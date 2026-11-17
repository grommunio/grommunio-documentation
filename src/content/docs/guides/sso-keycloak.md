---
title: "Single sign-on with grommunio-auth and Keycloak"
description: "Set up grommunio-auth and grommunio-keycloak for OpenID Connect single sign-on to grommunio Web, add MFA and broker an existing identity provider."
sidebar:
  label: "SSO with Keycloak"
  order: 30
---

grommunio-auth adds a central OpenID Connect (OIDC) login to grommunio. It
installs a packaged Keycloak instance (`grommunio-keycloak`) behind the
appliance's nginx, creates a realm named `grommunio` whose users come straight
from the grommunio user database, and configures grommunio Web to redirect
browsers to that realm instead of showing its own password form. On top of the
realm you can enforce multi-factor authentication (MFA) and broker an existing
corporate identity provider (IdP), so that users keep one login for grommunio
Web and for the other web applications (Files, Meet, Chat) that reuse the same
realm.

This guide installs the packages, walks through the setup wizard, verifies
realm, client, federation, tokens and introspection, adds MFA, optionally
brokers an upstream IdP, and ends with an end-to-end login and reboot test.
For transparent Kerberos logins of domain-joined Windows clients (Outlook) use
the [Kerberos single sign-on guide](/admin/kerberos-sso/) instead; both
methods can coexist.

:::note[Container and Kubernetes deployments]
The container images do not run Keycloak. With
[Docker Compose](/admin/container_core/#optional-components) or the
[Helm chart](/admin/kubernetes/), gromox-core connects grommunio Web to a
Keycloak server you operate separately. Steps 1 and 2 do not apply. See
[Container and Kubernetes deployments](#container-and-kubernetes-deployments)
for the settings and for the steps that still apply.
:::

## How it fits together

| Component | Role | Listens on |
| --- | --- | --- |
| nginx | Public entry point. Proxies `/auth/` to Keycloak; restricts `/auth/admin`, `/auth/metrics` and `/auth/health` to the networks listed in `/etc/grommunio-common/nginx/auth_allow.conf`. | 443/tcp (public) |
| `grommunio-keycloak.service` | Keycloak, started as user `groauth` with `/etc/grommunio-keycloak/keycloak.conf`. Serves the realm `grommunio` under the relative path `/auth`. | 9080/tcp, localhost only |
| grommunio user-storage provider | Keycloak plugin (`/opt/grommunio-keycloak/providers/grommunio-user-storage.jar`). Reads users from the grommunio database with the read-only credentials in `/etc/grommunio-keycloak/grommunio.properties` and verifies passwords through the PAM service `grommunioauth` (`pam_gromox.so`), so users that authenticate against LDAP in grommunio work as well. | — |
| MariaDB | Keycloak's own database `grommunio_keycloak` plus `SELECT` access to `grommunio.users` and `grommunio.user_properties`. | 3306/tcp, localhost |
| grommunio Web (php-fpm pool user `groweb`) | Reads `/etc/gromox/keycloak.json`, runs the OIDC authorization-code flow, introspects and refreshes the access token, and logs on to gromox with the token. | unix socket |
| gromox-zcore | Accepts the token logon; `authmgr` verifies the token signature against `/etc/gromox/bearer_pubkey`, checks the expiry and maps the `email` claim to the mailbox. | `/run/gromox/zcore.sock` |
| gromox-http (exmdb) | Mailbox store access for zcore and the other daemons. | `[::1]:5000` |

The login flow:

1. The browser opens `https://mail.example.com/web/`. Because
   `/etc/gromox/keycloak.json` exists, grommunio Web sends the browser to the
   authorization endpoint of the realm `grommunio` with scope `openid`.
2. nginx proxies `/auth/...` to Keycloak on port 9080. Keycloak shows the
   grommunio login theme, looks the user up through the grommunio user-storage
   provider and checks the password through PAM; MFA is asked for if it is
   configured.
3. Keycloak redirects back to `https://mail.example.com/web` with an
   authorization code. grommunio Web exchanges the code for tokens at the token
   endpoint (client `grommunio` plus client secret) and introspects the access
   token.
4. grommunio Web logs on to gromox-zcore with the access token. `authmgr`
   verifies the RS256 signature with the realm public key in
   `/etc/gromox/bearer_pubkey`, rejects expired tokens and resolves the `email`
   claim against the user database.
5. Every 280 seconds grommunio Web refreshes the token, falling back to
   introspection. If both fail, the browser is sent back to Keycloak.

Files created or used by the setup:

| File | Content | Recommended owner / mode |
| --- | --- | --- |
| `/etc/grommunio-keycloak/keycloak.conf` | Keycloak server options: database, port, relative path, hostname, proxy headers. Contains the Keycloak database password. | `groauth:gromox`, `0640` |
| `/etc/grommunio-keycloak/grommunio.properties` | JDBC connection of the user-storage provider to the grommunio database. Contains the read-only database password. | `groauth:gromox`, `0640` |
| `/etc/gromox/keycloak.json` | OIDC client configuration for grommunio Web: realm, `auth-server-url`, client id (`resource`) and client secret. | `root:groweb`, `0640` |
| `/etc/gromox/bearer_pubkey` | PEM public key of the realm `grommunio`, used by gromox to verify access tokens. Public data, may stay world-readable. | `root:root`, `0644` |
| `/etc/grommunio-common/nginx/auth_allow.conf` | `allow` rules for the restricted Keycloak paths. | `root:root`, `0644` |
| `/usr/share/grommunio-common/nginx/locations.d/grommunio-auth.conf` | Shipped nginx locations for `/auth`; do not edit, place additions in `/etc/grommunio-common/nginx/locations.d/`. | package file |
| `/usr/share/grommunio-common/nginx/upstreams.d/grommunio-auth.conf` | Shipped upstream `grommunio_keycloak` (`127.0.0.1:9080`). | package file |
| `/etc/pam.d/grommunioauth` | PAM stack used by the user-storage provider (`pam_gromox.so`). | package file |
| `/var/log/grommunio-setup-auth.log` | Log of the setup wizard. Contains the Keycloak admin password in clear text. | `root:root` |
| `/var/log/nginx/nginx-auth-access.log`, `nginx-auth-error.log` | nginx logs for the `/auth` locations. | nginx |

## Prerequisites

- A working grommunio installation reachable over HTTPS under its final
  fully qualified domain name (FQDN), for example `https://mail.example.com`,
  with valid DNS, a trusted TLS certificate and NTP. The FQDN is written into
  the Keycloak hostname, the OIDC client URLs and `keycloak.json`; changing it
  afterwards means redoing the setup.
- Users exist in grommunio (created locally or imported from LDAP; see
  [Users and LDAP in the administration manual](/admin/administration/)).
  Keycloak does not store users or passwords of its own for this realm.
- Root shell access, a tested grommunio Admin login and a current backup
  (see [Operations](/admin/operations/)). Single sign-on changes the login
  path of every web user.
- A terminal for the setup wizard, which is a `dialog`-based text UI.

Record the starting point before you change anything:

```bash
hostname -f
rpm -q grommunio-web gromox grommunio-admin-api grommunio-common
systemctl is-active nginx php-fpm mariadb gromox-http gromox-zcore
curl -k -I https://mail.example.com/web/
```

Expected result: the FQDN users will type, active services and an HTTP
response from grommunio Web. Fix anything that fails before continuing.

## 1. Install the packages

`grommunio-auth` depends on `grommunio-keycloak`, `grommunio-common` and
`grommunio-setup`; installing it pulls the Keycloak package in:

```bash
zypper refresh
zypper install grommunio-auth grommunio-keycloak
```

The Keycloak service is installed but not yet configured:
`/etc/grommunio-keycloak/keycloak.conf` and `grommunio.properties` are empty
until the wizard fills them from the templates in `/usr/share/grommunio-auth/`.
Do not start `grommunio-keycloak` by hand at this point.

## 2. Run the setup wizard

```bash
/usr/share/grommunio-auth/setup-grommunio-auth.sh
```

:::caution
The wizard drops and recreates the Keycloak database. Running it on an
already configured system removes the realm configuration (clients, MFA
settings, identity providers). Use it for the initial setup only.
:::

The wizard asks for:

| Prompt | What to enter |
| --- | --- |
| FQDN | The public name users type in the browser, for example `mail.example.com`. It is lower-cased and becomes `hostname=` in `keycloak.conf`, the client URLs and the `auth-server-url`. Never enter an internal name or a port. |
| Keycloak database | *Create database locally* creates the database and user `grommunio_keycloak` with a random password. *Connect to existing database* expects a prepared database. |
| Keycloak grommunio database user | The read-only account the user-storage provider uses to read the grommunio user table. The default creates the user `groauth` with a random password and grants `SELECT` on `grommunio.users` and `grommunio.user_properties`. |
| Keycloak administrator password | Password of the `admin` user in the realm `master`. Accept the generated one or enter your own; it is shown again at the end and written to `/var/log/grommunio-setup-auth.log`. |
| Restricted grommunio auth paths | Space-separated IP addresses or networks that may reach `/auth/admin`, `/auth/metrics` and `/auth/health`, for example `10.0.0.0/24 127.0.0.1`. Leaving it empty writes `allow 0.0.0.0/0;`, which exposes the admin console to the Internet. |

The wizard then, without further questions:

1. writes `/etc/grommunio-keycloak/keycloak.conf` and
   `/etc/grommunio-keycloak/grommunio.properties`;
2. writes `/etc/grommunio-common/nginx/auth_allow.conf`;
3. starts Keycloak once to create the `admin` user, waits for port 9080 and
   logs in with `kcadm.sh`;
4. creates the realm `grommunio` (enabled, *Remember me* on, login theme
   `grommunio`), the user-federation component `grommunio` and the
   confidential OIDC client `grommunio`;
5. exports the client configuration to `/etc/gromox/keycloak.json` and the
   realm public key to `/etc/gromox/bearer_pubkey`;
6. enables and starts `grommunio-keycloak.service` and restarts nginx.

Check the result:

```bash
systemctl is-active grommunio-keycloak nginx php-fpm mariadb
ss -ltnp | grep ':9080'
curl -k -s https://mail.example.com/auth/realms/grommunio/.well-known/openid-configuration | jq -r .issuer
```

Expected result: `active` for all services, a Java process listening on
port 9080, and the issuer `https://mail.example.com/auth/realms/grommunio`.
If port 9080 never opens, read `journalctl -u grommunio-keycloak`; the usual
causes are database credentials and a wrong `hostname=`.

## 3. Work in the realm grommunio, not in master

Open the admin console at `https://mail.example.com/auth/admin/` from an
address listed in `auth_allow.conf` and log in as `admin`. The realm `master`
exists only to administer Keycloak itself. Everything that concerns grommunio
(client, user federation, authentication flows, identity providers) lives in
the realm `grommunio`: select it in the realm drop-down at the top left before
you change anything. Under *Realm settings* → *General* the realm must be
*Enabled*, and *Require SSL* must be *External requests*.

The same checks from the shell, with the bundled admin CLI. Log in once; the
session token is stored in `/root/.keycloak/kcadm.config`:

```bash
/opt/grommunio-keycloak/bin/kcadm.sh config credentials --server http://localhost:9080/auth --realm master --user admin
/opt/grommunio-keycloak/bin/kcadm.sh get realms/grommunio --fields realm,enabled,sslRequired,loginTheme
```

Expected result: `"enabled" : true`, `"sslRequired" : "external"` and
`"loginTheme" : "grommunio"`.

## 4. Check the client grommunio

In the realm `grommunio` open *Clients* → `grommunio`. This is the OIDC
application grommunio Web uses. Compare with what the wizard created:

| Setting | Expected value |
| --- | --- |
| Client ID | `grommunio` |
| Client authentication | On (confidential client, *Client ID and Secret*) |
| Root URL, Home URL | `https://mail.example.com:443/` |
| Valid redirect URIs | `https://mail.example.com/*` |
| Valid post logout redirect URIs | `https://mail.example.com:443/` |
| Web origins | `https://mail.example.com:443/` |
| Standard flow | Enabled (required for the browser login) |
| Direct access grants | Enabled (password grant; used for the token test in step 9) |
| Default client scopes | `web-origins`, `acr`, `profile`, `roles`, `email` |

`profile` and `email` are required: gromox resolves the mailbox from the
`email` claim. On the *Credentials* tab, the client secret must be the value
in `credentials.secret` of `/etc/gromox/keycloak.json`. If you regenerate the
secret, update the file and restart php-fpm.

From the shell:

```bash
/opt/grommunio-keycloak/bin/kcadm.sh get clients -r grommunio -q clientId=grommunio --fields id,clientId,enabled,redirectUris,webOrigins,standardFlowEnabled,directAccessGrantsEnabled,publicClient
/opt/grommunio-keycloak/bin/kcadm.sh get clients/<CLIENT_UUID>/protocol-mappers/models -r grommunio --fields name,protocolMapper
```

Replace `<CLIENT_UUID>` with the `id` from the first command. Expected
result: an enabled, non-public client with the redirect URI above and the
three session-note mappers *Client IP Address*, *Client Host* and
*Client ID*. Whether an `oidc-audience-mapper` is present depends on the
package version; step 10 adds one if token introspection needs it.

## 5. Check the user federation

Open *User federation* in the realm `grommunio`. The provider `grommunio`
must be present and enabled. It makes grommunio users visible to Keycloak
without copying them into Keycloak accounts; user administration stays in
grommunio Admin (or LDAP). Under *Users*, search for `*` or for an address:
your grommunio users appear with their primary e-mail address as username.

```bash
/opt/grommunio-keycloak/bin/kcadm.sh get components -r grommunio -q type=org.keycloak.storage.UserStorageProvider --fields name,providerId,config
/opt/grommunio-keycloak/bin/kcadm.sh get users -r grommunio -q email=alice@example.com --fields username,email,enabled,federationLink
```

Expected result: one component with `"providerId" : "grommunio"` and
`"enabled" : [ "true" ]`, and the user record with a `federationLink`
pointing to that component. If the user list is empty, check
`/etc/grommunio-keycloak/grommunio.properties` and
`journalctl -u grommunio-keycloak` for JDBC errors.

## 6. Enable multi-factor authentication

MFA is configured in the realm `grommunio`, under *Authentication*. Start
with individual users, then decide whether to enforce it realm-wide.

### Per user: require OTP enrolment

1. In the realm `grommunio` open *Users* and select the user, for example
   `alice@example.com`.
2. On the *Details* tab add *Configure OTP* to *Required user actions* and
   save.
3. Let the user log out completely and open `https://mail.example.com/web/`
   again.
4. After the password, Keycloak shows the TOTP enrolment with a QR code. The
   user scans it with an authenticator app and confirms the first one-time
   code. From then on every login asks for the code.

### Realm-wide: make OTP mandatory

1. Under *Authentication* → *Flows* duplicate the built-in *browser* flow
   instead of editing it (for example `browser-otp`).
2. In the copy, set the OTP step (*OTP Form* inside the conditional
   sub-flow) to *Required*.
3. Bind the copy as the realm's *Browser flow* via *Action* → *Bind flow*.

:::caution
Bind a mandatory OTP flow only after you have tested it with one user and
you have a documented way back: the `admin` account in the realm `master` is
not affected by flows of the realm `grommunio`, and grommunio Web can fall
back to its password form when `DISABLE_KEYCLOAK` is defined as `true` in
`/etc/grommunio-web/config.php`.
:::

## 7. Broker an existing identity provider (optional)

If your organisation already runs a central Keycloak or another OIDC
provider, connect it as an identity provider of the realm `grommunio`. Users
then authenticate upstream, and Keycloak issues the tokens grommunio needs.

1. In the realm `grommunio` open *Identity providers* and add a *Keycloak
   OpenID Connect* provider (or a generic *OpenID Connect v1.0* provider for
   other IdPs). Choose a short alias such as `corp-idp`.
2. Enter the upstream discovery URL or its endpoints (authorization, token,
   logout, user info), the client ID and the client secret of the client you
   create upstream.
3. Note the *Redirect URI* Keycloak displays,
   `https://mail.example.com/auth/realms/grommunio/broker/corp-idp/endpoint`,
   and register exactly this URI on the upstream confidential client.
4. Make sure the e-mail address the upstream IdP asserts equals the primary
   address of the grommunio user. gromox resolves the mailbox from the
   `email` claim, so a brokered identity without a matching grommunio user
   cannot log in.

### Redirect the broker logout response

After a logout through the upstream provider, the browser returns to
`/auth/realms/grommunio/broker/<alias>/endpoint/logout_response` and may end
on a Keycloak page instead of grommunio Web. Add a redirect in the grommunio
server block. nginx includes every `*.conf` file in
`/etc/grommunio-common/nginx/locations.d/` there:

```nginx title="/etc/grommunio-common/nginx/locations.d/grommunio-auth-broker.conf"
location ~ ^/auth/realms/grommunio/broker/[^/]+/endpoint/logout_response$ {
    return 302 $scheme://$host/web/;
}
```

```bash
nginx -t
systemctl reload nginx
curl -k -I https://mail.example.com/auth/realms/grommunio/broker/corp-idp/endpoint/logout_response
```

Expected result: status `302` with `location: https://mail.example.com/web/`.
Do not put the block into `keycloak.conf` or into the shipped
`grommunio-auth.conf` under `/usr/share`; package updates overwrite the
latter.

## 8. Review the configuration files and permissions

After the wizard, the four files below must agree on the FQDN. The browser
URL is `https://mail.example.com/auth/`; the Keycloak process itself listens
on `http://localhost:9080/auth` and is only reachable through nginx.

```ini title="/etc/grommunio-keycloak/keycloak.conf"
db=mariadb
proxy=edge
http-port=9080
http-relative-path=/auth
http-host=localhost
http-enabled=true
db-username=grommunio_keycloak
db-password=<redacted>
db-url-database=grommunio_keycloak
db-url-host=localhost
hostname=mail.example.com
hostname-strict=false
hostname-strict-https=false
proxy-headers=xforwarded
```

```properties title="/etc/grommunio-keycloak/grommunio.properties"
grommunio.db-kind=org.mariadb.jdbc.Driver
grommunio.jdbc-url=jdbc:mariadb://localhost:3306/grommunio
grommunio.username=groauth
grommunio.password=<redacted>
```

```json title="/etc/gromox/keycloak.json"
{
  "realm": "grommunio",
  "auth-server-url": "https://mail.example.com/auth/",
  "ssl-required": "external",
  "resource": "grommunio",
  "verify-token-audience": true,
  "credentials": {
    "secret": "<client-secret>"
  },
  "confidential-port": 0,
  "policy-enforcer": {
    "credentials": {}
  }
}
```

```nginx title="/etc/grommunio-common/nginx/auth_allow.conf"
allow 10.0.0.0/24;
allow 127.0.0.1;
```

`keycloak.json` is generated by Keycloak's *keycloak-oidc-keycloak-json*
installation export; keep the generated keys and only correct
`auth-server-url` and `credentials.secret` if they diverge. Optionally add
`"redirect-url": "https://mail.example.com/web"` to pin the callback URL
grommunio Web sends, which helps when nginx serves several host names.

The wizard writes these files with the default umask, typically
world-readable. The Keycloak files contain
database passwords, `keycloak.json` contains the client secret; tighten them.
grommunio Web runs as `groweb`, Keycloak as `groauth`:

```bash
chown groauth:gromox /etc/grommunio-keycloak/keycloak.conf /etc/grommunio-keycloak/grommunio.properties
chmod 0640 /etc/grommunio-keycloak/keycloak.conf /etc/grommunio-keycloak/grommunio.properties
chown root:groweb /etc/gromox/keycloak.json
chmod 0640 /etc/gromox/keycloak.json
stat -c '%U:%G %a %n' /etc/gromox/keycloak.json /etc/gromox/bearer_pubkey /etc/grommunio-keycloak/keycloak.conf /etc/grommunio-keycloak/grommunio.properties
systemctl restart grommunio-keycloak php-fpm
systemctl is-active grommunio-keycloak nginx php-fpm gromox-http gromox-zcore
```

If another PHP component on the same host is configured to read
`keycloak.json`, it must stay readable for that component's pool user as
well. `bearer_pubkey` holds only the public key and is read by gromox on
every token logon; leave it readable.

## 9. Verify discovery, token issuance and introspection

Check the OIDC foundation independently of the browser:

```bash
curl -k -s https://mail.example.com/auth/realms/grommunio/.well-known/openid-configuration | jq '.issuer,.authorization_endpoint,.token_endpoint,.introspection_endpoint'
```

Expected result: four URLs below `https://mail.example.com/auth/realms/grommunio/`.

Obtain a token with the password grant (enabled on the client by the
wizard) for a test user without MFA:

```bash
TOKEN_RESPONSE=$(curl -ks -d grant_type=password -d client_id=grommunio -d client_secret='<client-secret>' -d username='alice@example.com' -d password='<user-password>' -d scope='openid profile email' https://mail.example.com/auth/realms/grommunio/protocol/openid-connect/token)
echo "$TOKEN_RESPONSE" | jq -r '.token_type,.expires_in'
ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r .access_token)
printf '%s' "$ACCESS_TOKEN" | awk -F. '{print $2}' | base64 -d 2>/dev/null | jq '{azp,aud,email,exp}'
```

Expected result: `Bearer`, a lifetime in seconds, and a payload with
`azp` = `grommunio` and the user's `email`. `invalid_client` means the client
ID or secret is wrong; `invalid_grant` means a wrong password, a pending
required action (for example *Configure OTP*) or an MFA requirement the
password grant cannot satisfy.

Introspect the token the way grommunio Web does:

```bash
curl -k -sS -X POST -u 'grommunio:<client-secret>' -d "token=$ACCESS_TOKEN" https://mail.example.com/auth/realms/grommunio/protocol/openid-connect/token/introspect | jq '{active,client_id,username,aud,azp,iss}'
```

Expected result: `"active": true`. If the answer is `"active": false` or an
error, and `journalctl -u grommunio-keycloak` shows
`INTROSPECT_TOKEN_ERROR` with `invalid_token`, continue with step 10.

## 10. Add an audience mapper for introspection

An access token whose `azp` is `grommunio` does not necessarily list
`grommunio` in `aud`. Keycloak then refuses to introspect it for the client
`grommunio` and logs `INTROSPECT_TOKEN_ERROR`, even though the browser login
looks fine at first. The token must carry the client as audience in the
access token and in the introspection response.

In the realm `grommunio` open *Clients* → `grommunio` → *Client scopes* →
`grommunio-dedicated` → *Mappers* → *Add mapper* → *By configuration* →
*Audience* and create:

```yaml
Mapper type: Audience
Name: grommunio-self-audience
Included Client Audience: grommunio
Add to ID token: Off
Add to access token: On
Add to lightweight access token: Off
Add to token introspection: On
```

Existing tokens do not change. Request a new token as in step 9, confirm
that `aud` now contains `grommunio`, and repeat the introspection; it must
return `"active": true`. Verify that the mapper sits in the client's dedicated
scope:

```bash
/opt/grommunio-keycloak/bin/kcadm.sh get clients/<CLIENT_UUID>/protocol-mappers/models -r grommunio --fields name,protocolMapper,config
```

## 11. Check the local loopback and localhost:5000

A common failure that looks like an SSO problem is local: gromox-http exposes
the mailbox store (exmdb) on `[::1]:5000`, and `exmdb_hosts_allow` defaults to
`::1` (see [exmdb_provider(4gx)](/man/exmdb_provider-4gx/) and
[gromox(7)](/man/gromox-7/)). On the appliance, `localhost` resolves to `::1`
first. If IPv6 is disabled on `lo`, internal components cannot reach
`localhost:5000` and logins fail after Keycloak has already succeeded.

```bash
getent ahosts localhost
sysctl net.ipv6.conf.all.disable_ipv6 net.ipv6.conf.default.disable_ipv6 net.ipv6.conf.lo.disable_ipv6
ip -brief addr show lo
ss -ltnp | grep ':5000'
journalctl -u gromox-http -u gromox-zcore --since '30 minutes ago' --no-pager
```

Expected result: `::1` among the answers, all three sysctls `0`, `::1/128` on
`lo`, and `http` listening on `[::1]:5000`. Disabling IPv6 on the loopback
interface is not supported; this has nothing to do with IPv6 on the public
interface, which may stay off.

## 12. End-to-end login test

The acceptance test is the complete user path, not a token:

1. Open `https://mail.example.com/web/` in a fresh private browser window.
   The grommunio Web login page must hand over to Keycloak within a second.
2. Log in with a grommunio user (and the OTP code if enrolled). Expected
   result: the browser returns to `https://mail.example.com/web/` and the
   mailbox opens.
3. Send a test mail to yourself to confirm the MAPI session works.
4. Log out from grommunio Web. Expected result: the Keycloak session ends
   and the next visit to `/web/` asks for credentials again.
5. Watch `journalctl -u gromox-zcore -f` during the test. A rejected token
   is logged as `zs_logon_token rejected` with the reason; a successful login
   produces no such line.

## 13. Reboot and persistence test

Single sign-on is finished only when it survives a restart without manual
steps:

```bash
systemctl reboot
```

After reconnecting:

```bash
systemctl is-active grommunio-keycloak nginx php-fpm mariadb gromox-http gromox-zcore
curl -k -I https://mail.example.com/auth/realms/grommunio/.well-known/openid-configuration
curl -k -I https://mail.example.com/web/
```

Expected result: all services `active`, status `200` for the discovery
document, and a working browser login as in step 12. Keycloak needs some
time to start (`TimeoutStartSec=600` in the unit); nginx returns `502` for
`/auth/` until it is up.

## Verification checklist

| Area | Check | Expected result |
| --- | --- | --- |
| Installation | `rpm -q grommunio-auth grommunio-keycloak` | Both packages installed |
| Services | `systemctl is-active grommunio-keycloak nginx php-fpm mariadb gromox-http gromox-zcore` | `active` for all |
| Network | `ss -ltnp` shows `:9080` (Java, localhost) and `[::1]:5000` (gromox-http); `/auth/admin/` reachable only from `auth_allow.conf` networks | Ports bound; `403` from other networks |
| Realm | `kcadm.sh get realms/grommunio` | `enabled` true, `sslRequired` external |
| Client | `kcadm.sh get clients -r grommunio -q clientId=grommunio` | Confidential client, redirect URI `https://mail.example.com/*`, standard flow on |
| Federation | Users visible under *Users* in the realm `grommunio` | grommunio users listed with `federationLink` |
| Discovery | `.well-known/openid-configuration` | Issuer `https://mail.example.com/auth/realms/grommunio` |
| Token | Password grant for a test user | `Bearer` token, `email` claim present |
| Introspection | `token/introspect` with client credentials | `"active": true`, `aud` contains `grommunio` |
| Configuration | `stat` on the four configuration files | `keycloak.json` `root:groweb 0640`; Keycloak files `groauth:gromox 0640` |
| MFA | Login of a user with *Configure OTP* | TOTP enrolment, then OTP prompt on every login |
| Broker (if used) | Logout through the upstream IdP | `302` to `/web/`, no Keycloak page |
| End to end | Browser login, mailbox, logout | Complete round trip without errors |
| Restart | Reboot | Everything above still passes |
| Logs | `journalctl -u grommunio-keycloak -u gromox-zcore`, `/var/log/nginx/nginx-auth-error.log` | No `INTROSPECT_TOKEN_ERROR`, no `zs_logon_token rejected`, no upstream errors |

## Troubleshooting

| Symptom | Likely cause | What to check / fix |
| --- | --- | --- |
| Client, federation or IdP "exists" but grommunio Web does not redirect properly or Keycloak reports an unknown client | Objects were created in the realm `master` | Switch the realm selector to `grommunio`; recreate the objects there |
| Keycloak shows *Invalid parameter: redirect_uri* (event `invalid_redirect_uri`) | The URL the browser uses, `hostname=` in `keycloak.conf`, the client's *Valid redirect URIs* and `auth-server-url` in `keycloak.json` do not agree | Use one FQDN everywhere; set `redirect-url` in `keycloak.json` if nginx serves several host names |
| `invalid_client` at the token endpoint, or a login loop back to Keycloak | Wrong client secret in `/etc/gromox/keycloak.json`, or the file is not readable for `groweb` (php-fpm logs `Unable to load webapp Keycloak configuration`) | Copy the secret from the client's *Credentials* tab, set `root:groweb 0640`, restart php-fpm |
| Login succeeds at Keycloak, grommunio Web shows a login error; `gromox-zcore` logs `zs_logon_token rejected: Token did not validate` | `/etc/gromox/bearer_pubkey` missing, unreadable or stale after a realm key rotation | Regenerate the file from the realm's public key (see Operating notes) |
| Login succeeds at Keycloak, `zs_logon_token rejected` names the user | The `email` claim does not match a grommunio user (typical for brokered identities) | Align the upstream e-mail attribute with the grommunio primary address |
| Logout via the upstream IdP ends on a Keycloak page | No redirect for `/auth/realms/grommunio/broker/<alias>/endpoint/logout_response` | Add the location block from step 7 in `/etc/grommunio-common/nginx/locations.d/`, `nginx -t`, reload nginx |
| `journalctl -u grommunio-keycloak` shows `INTROSPECT_TOKEN_ERROR` / `invalid_token`; introspection returns `active: false` | Access token lacks `grommunio` in `aud` | Add the audience mapper in the `grommunio-dedicated` scope (step 10) and test with a new token |
| Internal errors around `localhost:5000`; `gromox-zcore` cannot reach exmdb | IPv6 loopback disabled or `localhost` no longer resolves to `::1` | Re-enable IPv6 on `lo`, check `getent ahosts localhost` and `ss -ltnp` for `[::1]:5000` (step 11) |
| `403 Forbidden` on `https://mail.example.com/auth/admin/` | Your address is not in `/etc/grommunio-common/nginx/auth_allow.conf` | Add an `allow` line, `nginx -t`, reload nginx |
| Port 9080 never opens; unit restarts | Database credentials or `hostname=` wrong in `keycloak.conf`; MariaDB not running | `journalctl -u grommunio-keycloak`; `systemctl is-active mariadb`; correct the file and restart the service |
| Passwords are suddenly rejected by Keycloak after a package update, while the grommunio Web password form still works | `pam_gromox.so` inside the running Keycloak process is stale after a Gromox update | `systemctl restart grommunio-keycloak` |

## Operating notes

- **Back up** `/etc/grommunio-keycloak/`, `/etc/gromox/keycloak.json`,
  `/etc/gromox/bearer_pubkey`, `/etc/grommunio-common/nginx/` and the
  database `grommunio_keycloak` together with the regular backup described
  in [Operations](/admin/operations/). The realm configuration (client,
  flows, identity providers, OTP enrolments) lives only in that database.
- **Logs**: `journalctl -u grommunio-keycloak` for Keycloak (login events,
  `INTROSPECT_TOKEN_ERROR`), `/var/log/nginx/nginx-auth-access.log` and
  `nginx-auth-error.log` for the `/auth` locations, `journalctl -u gromox-zcore`
  for token logons (`zs_logon_token rejected`), the php-fpm log for grommunio
  Web's Keycloak client. Delete or protect
  `/var/log/grommunio-setup-auth.log`; it contains the admin password.
- **Updates**: restart `grommunio-keycloak` after every Gromox update, because
  the PAM module loaded into the Java process cannot be reloaded (see
  [known issues](/dev/gromox/known_bugs/)). Package updates of
  `grommunio-auth` re-add `http-enabled`, `hostname-strict`,
  `hostname-strict-https` and `proxy-headers` to `keycloak.conf` if missing;
  they do not touch your other settings.
- **Key rotation**: if you rotate the RSA key of the realm `grommunio`,
  regenerate the public key file gromox uses, the same way the wizard does:

  ```bash
  { echo "-----BEGIN PUBLIC KEY-----"; curl -s http://localhost:9080/auth/realms/grommunio | jq -r .public_key; echo "-----END PUBLIC KEY-----"; } > /etc/gromox/bearer_pubkey
  ```

- **Fallback**: to return to the classic password form temporarily, define
  `DISABLE_KEYCLOAK` as `true` in `/etc/grommunio-web/config.php`; removing
  `/etc/gromox/keycloak.json` has the same effect permanently.
- **Login page**: with Keycloak enabled the login page is rendered by
  Keycloak, so the grommunio Web disclaimer described in
  [Disclaimer](/kb/disclaimer/) does not apply; use a Keycloak theme instead.
- **Multi-server setups**: OIDC sessions must stay on one home server; see
  the OIDC note in the [architecture manual](/admin/architecture/) for the
  HAProxy cookie approach.

## Container and Kubernetes deployments

Single sign-on is configured with these settings:

| Docker Compose (`var.local.env`) | Helm chart | Meaning |
| --- | --- | --- |
| `ENABLE_KEYCLOAK` | `features.keycloak.enabled` | `true` enables single sign-on for grommunio Web |
| `KEYCLOAK_URL` | `features.keycloak.url` | Base URL of the Keycloak server, below which `/realms/<realm>` is served, for example `https://sso.example.com` (or `https://sso.example.com/auth` for a server with the relative path `/auth`) |
| `KEYCLOAK_REALM` | `features.keycloak.realm` | Realm name |
| `KEYCLOAK_CLIENT_ID` | `features.keycloak.clientId` | Client ID of the confidential OIDC client |
| `KEYCLOAK_CLIENT_SECRET` | `secrets.values.KEYCLOAK_CLIENT_SECRET`, or the key `KEYCLOAK_CLIENT_SECRET` in `secrets.existingSecret` | Client secret |

On every start with `ENABLE_KEYCLOAK=true`, gromox-core:

- writes `/etc/gromox/keycloak.json` from these values;
- fetches the realm signing key from
  `<KEYCLOAK_URL>/realms/<realm>/protocol/openid-connect/certs` and writes it
  to `/etc/gromox/bearer_pubkey`. If Keycloak is not reachable at that moment,
  the container logs `Could not fetch bearer public key` and token logins
  fail until the next start. Restart gromox-core after a key rotation in the
  realm as well;
- writes `/etc/gromox/oidc-import.json`, a client definition with the
  redirect URIs and web origin for `FQDN`. Import it in the Keycloak admin
  console (*Clients* → *Import client*), then copy the generated secret into
  `KEYCLOAK_CLIENT_SECRET`:

  ```bash
  docker exec gromox-core cat /etc/gromox/oidc-import.json > oidc-import.json
  kubectl -n grommunio exec grommunio-core-0 -- cat /etc/gromox/oidc-import.json > oidc-import.json
  ```

With `ENABLE_KEYCLOAK=false`, both JSON files are removed and grommunio Web
shows its own login form again. Apply changes as described in
[Changing the configuration](/admin/container_core/#changing-the-configuration)
or with `helm upgrade`.

The realm must authenticate the grommunio users, and its `email` claim must
contain the user's grommunio address. The grommunio user-storage provider is
not set up for you; configure a user federation, for example against the LDAP
directory grommunio uses.

Of the steps above, 3, 4, 6, 7, 9, 10 and 12 apply to your Keycloak server
(with its URL instead of `https://mail.example.com/auth/`). In step 8 only
`keycloak.json` and `bearer_pubkey` exist; they are regenerated on every
start, so do not edit them. For step 13, restart the containers or pods
instead of the host. Check the services with
`docker exec gromox-core supervisorctl status` or
`kubectl -n grommunio exec grommunio-core-0 -- supervisorctl status`
(release and namespace `grommunio`). With the Helm chart and
`networkPolicy.egress.enabled`, the core pod reaches external HTTP(S) servers
on ports 80 and 443; if Keycloak listens on another port, add its address
range to `networkPolicy.egress.extraCIDRs`.

## Related pages

- [Kerberos single sign-on (SPNEGO)](/admin/kerberos-sso/) for domain-joined
  Windows clients
- [Administration manual](/admin/administration/) — Users, LDAP
- [Architecture — authentication](/admin/architecture/#authentication)
- [authmgr(4gx)](/man/authmgr-4gx/), [exmdb_provider(4gx)](/man/exmdb_provider-4gx/)
- [grommunio Chat guide](/guides/chat/), [grommunio Meet guide](/guides/meet/),
  [grommunio Files and Office guide](/guides/files-office/) — reuse this realm
  for their own OIDC clients
- [Operations](/admin/operations/), [Troubleshooting](/admin/troubleshooting/)
- [Container installation](/admin/container_core/), [Kubernetes](/admin/kubernetes/)
