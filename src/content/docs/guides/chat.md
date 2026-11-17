---
title: "grommunio Chat: teams, channels and users"
description: "Install grommunio Chat, connect it to the Admin API, map domains to teams and users to accounts, test channels and WebSockets, and add optional Keycloak SSO."
sidebar:
  label: "Chat"
  order: 50
---

grommunio Chat is the team messaging component of the grommunio stack. It is
based on Mattermost, runs as a local service on the grommunio host and is
published by nginx under `/chat/` on the same host name as grommunio Web and
grommunio Admin. grommunio Admin holds the mapping between grommunio domains,
grommunio users and the corresponding chat teams and chat accounts, so that
chat is provisioned from the same place as mailboxes.

At the end of this guide you have a running chat server behind nginx, an Admin
API connection that creates teams and accounts automatically, at least one
domain team with two users exchanging messages in a channel, and a documented
set of checks for the WebSocket connection, multi-tenancy boundaries and the
optional single sign-on through grommunio-auth (Keycloak).

This page covers installation and administration. Day-to-day use of the Chat
plugin inside grommunio Web (enabling the plugin, invitations, team roles) is
described in [Chat in grommunio Web](/web/chat/).

:::note[Container and Kubernetes deployments]
In the container deployment, chat runs in the `gromox-core` container (pod
`grommunio-core-0` with the Helm chart). It is switched on with
`ENABLE_CHAT=true` in `var.local.env`
([Docker Compose](/admin/container_core/#optional-components)) or with
`features.chat.enabled` ([Helm chart](/admin/kubernetes/)); both are enabled by
default. The container carries out steps 1 to 4, so start with step 5. See
[Container and Kubernetes deployments](#container-and-kubernetes-deployments)
for the differences.
:::

## How it fits together

| Component | Role | Where |
|---|---|---|
| `grommunio-chat.service` | Mattermost-based chat server, runs as user `grochat`, listens on `127.0.0.1:8065` and on a local-mode Unix socket for CLI administration | `/etc/grommunio-chat/config.json`, `/var/lib/grommunio-chat`, `/var/log/grommunio-chat` |
| `grommunio-chat-ctl` | The `mmctl` administration command of the chat server | `/usr/bin/grommunio-chat-ctl` |
| MariaDB database `grochat` | Users, teams, channels and posts | local MariaDB, port 3306 |
| nginx | Publishes `/chat/` on port 443 and proxies it, including WebSocket upgrades, to the upstream `chat_server` | `/usr/share/grommunio-common/nginx/locations.d/grommunio-chat.conf`, `/usr/share/grommunio-common/nginx/upstreams.d/grommunio-chat.conf` |
| PAM service `grommuniochat` | Lets chat accounts authenticate with grommunio credentials through `pam_gromox.so` | `/etc/pam.d/grommuniochat` |
| `grommunio-admin-api.service` | Talks to the chat REST API (`/chat/api/v4`) as a technical system administrator; creates a team per domain and an account per user | `/etc/grommunio-admin-api/conf.d/chat.yaml` |
| grommunio Web Chat plugin | Embeds `/chat/` in a tab of grommunio Web | `/etc/grommunio-web/config-chat.php`, see [Chat in grommunio Web](/web/chat/) |
| grommunio-auth / Keycloak (optional) | OpenID Connect login for chat | realm `grommunio`, client `grommunio-chat` |

Data flow: the browser opens `https://mail.example.com/chat/`, nginx forwards
the request to the chat server on `127.0.0.1:8065`, the chat server reads and
writes the `grochat` database. Real-time updates use a WebSocket connection on
`/chat/api/v4/websocket`, for which the shipped nginx location sets the
`Upgrade` headers; the chat server only accepts that connection when
`ServiceSettings.SiteURL` matches the origin the browser uses.

How grommunio objects map to chat objects (as implemented by the Admin API):

| grommunio object | Chat object |
|---|---|
| Domain with *Create grommunio-chat team* enabled (`chat=true`) | One team per domain. The team display name is the domain title (or the domain name), the team is invite-only. The team ID is stored as the domain's `chatID`. |
| User with *Create grommunio-chat user* enabled (`chat=true`) | One chat account. E-mail address = grommunio address, chat user name = address with `@` replaced by `_` (for example `alice_example.com`). The account is added to the domain team. Its ID is stored as the user's `chatID`. |
| User flag `chatAdmin` | Adds the `system_admin` role to the chat account. |
| User privilege `privChat` | Grants the *Chat* feature to the user in grommunio (feature switch, independent of the chat account). |

Accounts created by the Admin API use the chat server's PAM authentication
method, so users sign in with their grommunio e-mail address and grommunio
password. Chat itself does not store a usable password for these accounts.

## Prerequisites

- A working grommunio installation with DNS, TLS and reachable
  `/web/` and `/admin/` (see [Quickstart](/admin/quickstart/) and
  [Post-installation](/guides/post-install/)).
- Root shell access to the grommunio host; `grommunio-admin` works.
- A strong, unique password for the `grochat` database user and one for the
  technical chat administrator. Keep them in a secret store or in root-only
  files; do not paste them into tickets.
- If you plan to use single sign-on: grommunio-auth with Keycloak is already
  set up as described in [Single sign-on with Keycloak](/guides/sso-keycloak/).

All commands below run as root on the grommunio host. Replace
`mail.example.com` and `example.com` with your host name and mail domain.

## 1. Install the package and check the inventory

grommunio Admin ships the chat driver (the `mattermostdriver` Python package)
even when the chat server itself is not installed. Check what is present
before you install anything:

```bash
rpm -qa | grep -Ei 'grommunio-chat|mattermost' | sort
zypper search -s grommunio-chat
```

Install the chat server package. Depending on the repository it is called
`grommunio-chat` or carries the Mattermost major version in its name (for
example `grommunio-chat-v10`); use the name that `zypper search` shows:

```bash
zypper --non-interactive install grommunio-chat
```

The package installs these parts (check with `rpm -ql grommunio-chat`):

| Path | Purpose |
|---|---|
| `/usr/bin/grommunio-chat`, `/usr/lib/systemd/system/grommunio-chat.service` | Server binary and unit (`User=grochat`, `WorkingDirectory=/usr/share/grommunio-chat/`) |
| `/usr/bin/grommunio-chat-ctl` | `mmctl` administration command |
| `/etc/grommunio-chat/config.json` | Server configuration, owned by `grochat` |
| `/etc/pam.d/grommuniochat` | PAM stack used for password logins (`pam_gromox.so`) |
| `/var/lib/grommunio-chat/` | Data directory (`files/` for attachments, `plugins/`, `client/`), mode 0700 |
| `/var/log/grommunio-chat/` | Log directory (`/usr/share/grommunio-chat/logs` points here) |
| `/usr/share/grommunio-common/nginx/locations.d/grommunio-chat.conf` | nginx `location /chat` and WebSocket location |
| `/usr/share/grommunio-common/nginx/upstreams.d/grommunio-chat.conf` | nginx `upstream chat_server` |

The directories and their ownership are created through `systemd-tmpfiles`
(`/usr/lib/tmpfiles.d/grommunio-chat.conf`). Before moving on,
`systemctl status grommunio-chat` should show the unit as loaded (it is not
started yet) and `ls -ld /etc/grommunio-chat /var/lib/grommunio-chat /var/log/grommunio-chat`
should show `grochat` as owner of the data and log directories.

## 2. Prepare the database and the configuration

The chat server needs its own database and a `config.json`. The package
installs `/etc/grommunio-chat/config.json`; if your version ships only a
`config.json.example`, copy it to `config.json` first and give it to `grochat`
(`chown grochat:grochat`, `chmod 0640`).

Create the database and its user (replace `<strong-password>`):

```sql
CREATE DATABASE IF NOT EXISTS grochat CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'grochat'@'localhost' IDENTIFIED BY '<strong-password>';
GRANT ALL PRIVILEGES ON grochat.* TO 'grochat'@'localhost';
FLUSH PRIVILEGES;
```

Run the statements with `mariadb` as root.

Edit `/etc/grommunio-chat/config.json`. At minimum the following keys must be
correct; keep all other keys. The excerpt shows only the relevant parts of
each section.

```json title="/etc/grommunio-chat/config.json (excerpt)"
{
  "ServiceSettings": {
    "SiteURL": "https://mail.example.com/chat",
    "ListenAddress": "127.0.0.1:8065",
    "EnableLocalMode": true,
    "LocalModeSocketLocation": "/var/tmp/grommunio-chat_local.socket"
  },
  "TeamSettings": {
    "EnableOpenServer": false,
    "RestrictCreationToDomains": "example.com"
  },
  "SqlSettings": {
    "DriverName": "mysql",
    "DataSource": "grochat:<strong-password>@tcp(localhost:3306)/grochat?charset=utf8mb4,utf8&readTimeout=30s&writeTimeout=30s"
  },
  "FileSettings": {
    "Directory": "/var/lib/grommunio-chat/files/"
  }
}
```

| Key | Purpose |
|---|---|
| `ServiceSettings.SiteURL` | The exact URL users open in the browser, including the `/chat` path and without trailing slash. A mismatch in scheme, host, port or path makes the server reject WebSocket handshakes with HTTP 403. |
| `ServiceSettings.ListenAddress` | Bind to loopback only; nginx is the only client and the shipped upstream points to `127.0.0.1:8065`. |
| `ServiceSettings.EnableLocalMode`, `LocalModeSocketLocation` | Enables the Unix socket used by `grommunio-chat-ctl --local` for administration without a login. |
| `TeamSettings.EnableOpenServer` | `false`: nobody can self-register without an invitation. Accounts come from grommunio Admin. |
| `TeamSettings.RestrictCreationToDomains` | Comma-separated list of mail domains allowed to have accounts. Leave it empty to allow every domain, or list every grommunio domain that will use chat, including the domain of the technical administrator created in step 4. |
| `SqlSettings.DriverName`, `DataSource` | MariaDB connection for the `grochat` database. |
| `FileSettings.Directory` | Where attachments are stored; keep it inside `/var/lib/grommunio-chat`. |

The file contains the database password; it must stay `grochat:grochat` with
mode `0640` (the package sets this through tmpfiles). Before moving on,
`python3 -m json.tool /etc/grommunio-chat/config.json >/dev/null` must
succeed (valid JSON).

## 3. Start the service and check the nginx upstream

Start the chat server and check that the local-mode socket appears:

```bash
systemctl enable --now grommunio-chat
systemctl status grommunio-chat
ss -ltnp | grep 8065
test -S /var/tmp/grommunio-chat_local.socket && echo socket-ok
```

The first start creates the database schema; give it a few seconds and check
`journalctl -u grommunio-chat` and `/var/log/grommunio-chat/mattermost.log`
for SQL errors if the port or the socket does not appear.

nginx needs two snippets, both shipped by the package: the `location /chat`
block (plus a separate location for `/chat/api/v*/websocket` that sets the
`Upgrade` and `Connection` headers) and the upstream definition:

```nginx title="/usr/share/grommunio-common/nginx/upstreams.d/grommunio-chat.conf"
upstream chat_server {
  server 127.0.0.1:8065;
}
```

Test the configuration and restart the web front end and the Admin API, so
that both pick up the new service:

```bash
nginx -t
systemctl restart nginx grommunio-admin-api
```

If `nginx -t` fails with `host not found in upstream "chat_server"`, the
upstream snippet is not included. Some appliance versions ship it as
`/etc/grommunio-common/nginx/upstreams.d/grommunio-chat.conf.example`; in that
case copy it to `grommunio-chat.conf` in the same directory and repeat
`nginx -t`.

Check the published route:

```bash
curl -kI https://mail.example.com/chat/
curl -k https://mail.example.com/chat/api/v4/system/ping
```

Expected result: the first request returns `HTTP/2 200` (or `HTTP/1.1 200`),
the second returns a JSON document containing `"status":"OK"`. nginx logs
requests to `/chat` separately in `/var/log/nginx/nginx-chat-access.log` and
`/var/log/nginx/nginx-chat-error.log`.

## 4. Create the technical chat administrator and connect the Admin API

grommunio Admin needs a chat account with the `system_admin` role to create
teams and users. Create it through local mode, which needs no existing login.
The domain restriction still applies: the address must belong to a domain
listed in `RestrictCreationToDomains` (if that list is set); an address such
as `admin@localhost` is rejected with
`The email you provided does not belong to an accepted domain`.

```bash
export MMCTL_LOCAL_SOCKET_PATH=/var/tmp/grommunio-chat_local.socket
grommunio-chat-ctl --local user create --email chatadmin@example.com --username chatadmin --password '<strong-password>' --system-admin --email-verified --disable-welcome-email
```

`grommunio-chat-ctl` is the `mmctl` command of the Mattermost code base; all
`mmctl` sub-commands and the global `--local` and `--json` flags work.
`--local` connects to the Unix socket named by `MMCTL_LOCAL_SOCKET_PATH`
(without the variable, `mmctl` looks for `/var/tmp/mattermost_local.socket`).

Tell the Admin API how to reach the chat server. The keys under `connection`
are the options of the `mattermostdriver` Python package the API uses:

```yaml title="/etc/grommunio-admin-api/conf.d/chat.yaml"
chat:
  connection:
    login_id: chatadmin
    password: '<strong-password>'
    url: mail.example.com
    basepath: /chat/api/v4
    port: 443
    scheme: https
    verify: True
```

| Key | Meaning |
|---|---|
| `login_id`, `password` | The technical administrator created above |
| `url`, `port`, `scheme`, `basepath` | The API endpoint as published by nginx (`https://mail.example.com:443/chat/api/v4`) |
| `verify` | TLS verification: `True` (default), the path of a CA bundle, or `False`. `False` is only acceptable with a self-signed certificate on an isolated system; it also makes every `grommunio-admin` command that touches chat print an `InsecureRequestWarning`. |

The Admin API runs as user `grommunio`; `/etc/grommunio-admin-api/conf.d/`
is readable only by root and that user. Keep the file readable for the
service and restart the API:

```bash
chown root:grommunio /etc/grommunio-admin-api/conf.d/chat.yaml
chmod 0640 /etc/grommunio-admin-api/conf.d/chat.yaml
systemctl restart grommunio-admin-api
```

Do not set mode `0600` with owner `root`; the API could not read the file and
every chat operation would fail. Before moving on,
`journalctl -u grommunio-admin-api -n 50` should show no connection or
authentication errors for the `chat` service.

## 5. Activate chat for a domain and its users

Chat is enabled in two levels, and the order matters: first the domain (this
creates the team), then the users (this creates the accounts and adds them to
the team). Enabling a user before the domain is silently skipped; the Admin
API logs `Could not enable chat for user '<user>': chat is not enabled for domain`.

### Admin UI

1. Open **Domains**, select the domain and enable **Create grommunio-chat
   team**. Save.
2. Open **Users**, select a user and enable **Create grommunio-chat user**.
   Enable **Allow Chat** under the feature switches so the user sees the Chat
   entry in grommunio Web. Tick **grommunio-chat admin permission** only for
   users who should administer the chat server. Save.

The domain checkbox is greyed out when the Admin API cannot reach the chat
server; the user checkbox is disabled while the domain has no team. To give
new users the *Chat* feature automatically, set `privChat` in the system or
domain **Defaults** (see [Administration](/admin/administration/#defaults)).

### CLI

```bash
grommunio-admin domain modify example.com --chat true
grommunio-admin user modify alice@example.com --chat true --privChat true
grommunio-admin user modify bob@example.com --chat true --privChat true
```

Verify the result:

```bash
grommunio-admin domain query domainname chat chatID --format json-flat
grommunio-admin user query username chat chatAdmin privChat privWeb --format json-flat
```

Expected result: the domain shows `chat: true` and a 26-character `chatID`;
each user shows `chat: true` and `privChat: true`. `--chat true` also works on
`grommunio-admin domain create` and `grommunio-admin user create`, so new
tenants and users can be provisioned with chat in one step.

If `user modify --chat true` does not set `chat: true`:

- `Cannot activate chat for deactivated domain` or
  `Cannot activate chat for locked user`: fix the status first.
- No error, `chat` stays `false`: check `journalctl -u grommunio-admin-api`
  for the warnings above (domain not enabled, chat service unreachable, user
  creation rejected by the chat server, for example because the domain is not
  in `RestrictCreationToDomains`, or
  `Unable to create the new team membership because the team has reached the limit of members`,
  which means `TeamSettings.MaxUsersPerTeam` in `config.json` is too low).

Do not repair the mapping by editing the `grochat` database. Fix the Admin API
connection and repeat the `grommunio-admin` commands; the API reuses an
existing team or account when the ID is already stored.

## 6. Log in and create channels

Open `https://mail.example.com/chat/` in a browser and sign in as
`alice@example.com` with the grommunio password. After the first login the
domain team is preselected and the default channels (Town Square, Off-Topic)
are visible.

Create the channels your organisation needs. You can do that in the browser
(see [Chat in grommunio Web](/web/chat/)) or from the shell with local mode.
The team name is the internal identifier the Admin API generated; look it up
instead of guessing:

```bash
export MMCTL_LOCAL_SOCKET_PATH=/var/tmp/grommunio-chat_local.socket
grommunio-chat-ctl --local team list --json
```

Then create a channel in that team and add both users (users can be given as
e-mail address or chat user name):

```bash
TEAM=<team-name-from-list>
grommunio-chat-ctl --local channel create --team "$TEAM" --name operations --display-name "Operations" --purpose "Monitoring, incidents and daily operations."
grommunio-chat-ctl --local channel users add "$TEAM:operations" alice@example.com bob@example.com
```

Add `--private` to `channel create` for a channel that is only visible to its
members. Before moving on, reload the browser: the channel *Operations* should
be listed for `alice@example.com`.

## 7. Test with two users and check the WebSocket

A loading login page proves nothing about real-time delivery. Test with two
separate browser profiles (or two devices):

1. Sign in as `alice@example.com` in the first browser and as
   `bob@example.com` in the second.
2. Both users should see the same team and the channel *Operations*.
3. Send a message as Alice. It must appear in Bob's window without a page
   reload, and Bob's reply must appear in Alice's window.

If messages only appear after a reload, the WebSocket connection is not
established. In the browser developer tools (Network tab, filter *WS*), the
request to `/chat/api/v4/websocket` must be answered with status `101`. A
`403` on the WebSocket handshake means `SiteURL` differs from the URL in the
address bar (scheme, host, port or path). A `502`, or a plain `200` without
upgrade, means the request did not reach the WebSocket location of the shipped
nginx snippet, for example because another proxy in front of nginx strips the
`Upgrade` header.

Also confirm that the service survives a restart of the whole chain:

```bash
systemctl restart mariadb grommunio-chat nginx grommunio-admin-api
systemctl is-active mariadb grommunio-chat nginx grommunio-admin-api
curl -k https://mail.example.com/chat/api/v4/system/ping
```

## 8. Optional: single sign-on with grommunio-auth and Keycloak

Skip this step if you do not use grommunio-auth. Complete and test steps 1 to
7 with password login first, so that SSO problems are not confused with chat
problems.

grommunio-auth manages one OpenID Connect client per application in the realm
`grommunio` and exports the client data to
`/var/cache/grommunio-auth/adaptor-config/`. Each application ships a script
`setup-gk-app-g-<application>` in
`/usr/share/grommunio-auth/adaptor-config-scripts/` that applies the exported
data to the application's configuration. For chat, the script writes the
Mattermost-compatible OpenID Connect settings (`Enable`, `Id`, `Secret`,
`AuthEndpoint`, `TokenEndpoint`, `UserAPIEndpoint`, `DiscoveryEndpoint`,
`ButtonText`) into `/etc/grommunio-chat/config.json`. You only have to provide
the client in Keycloak.

### Create the Keycloak client

In the Keycloak administration console (reachable through grommunio-auth under
`/auth/`), switch to the realm `grommunio`. Do not work in the `master` realm.
Check whether a client `grommunio-chat` already exists; if not, create it:

| Setting | Value |
|---|---|
| Client type | OpenID Connect |
| Client ID | `grommunio-chat` |
| Client authentication | on (confidential client) |
| Standard flow | on |
| Direct access grants, Implicit flow, Service account roles | off |
| Valid redirect URIs | `https://mail.example.com/chat/login/gitlab/complete` and `https://mail.example.com/chat/signup/gitlab/complete` |
| Web origins | `https://mail.example.com` |

Both callback paths are needed because the chat server returns to a different
path for login and for first-time sign-up. The redirect URIs must match the
published `/chat` path exactly.

### Apply the adapter configuration

```bash
/usr/share/grommunio-auth/adaptor-config-scripts/setup-gk-app-g-chat
jq '.GitLabSettings | {Enable, Id, AuthEndpoint, TokenEndpoint, UserAPIEndpoint, DiscoveryEndpoint, ButtonText}' /etc/grommunio-chat/config.json
systemctl restart grommunio-chat
```

Expected result: `Enable` is `true`, `Id` is `grommunio-chat`, and the
endpoints point to `https://mail.example.com/auth/realms/grommunio/...`. The
client secret is written by the script and must not be printed or copied into
documentation. If the `GitLabSettings` section is untouched after the script
ran, check the `KeycloakSettings` section of `config.json` in the same way;
it carries the same keys.

### Test the SSO login

Open `https://mail.example.com/chat/` in a fresh browser profile. The login
page should now show the Keycloak button. Click it, authenticate (including
MFA if the realm requires it), and confirm that you land in the domain team.
Repeat the two-user test of step 7 with both users signed in through SSO.

:::caution
Test SSO with a test user before announcing it. Accounts that were created
with password login and accounts that arrive through SSO are matched by e-mail
address; verify with one existing user that the SSO sign-in reaches the
existing account and its channels rather than creating a second account.
:::

## 9. Multi-tenancy: domain teams and where separation ends

Every grommunio domain with chat enabled gets its own team. A second domain
therefore produces a second team on the same chat server:

```bash
grommunio-admin domain create tenant2.example.com -u 10 --title "Tenant 2" --chat true
grommunio-admin domain query domainname title chat chatID --format json-flat
```

Expected result: `example.com` and `tenant2.example.com` each show a
different `chatID`. If `TeamSettings.RestrictCreationToDomains` is set, add
the new domain to it and restart `grommunio-chat` before enabling its users.

Teams created by the Admin API are invite-only, so users of one domain do not
see or join the team of another domain unless a team administrator invites
them. This is organisational separation, not tenant isolation. Use it with the
following limits in mind:

- **Separated per domain team:** team membership, public and private
  channels, team and channel roles, invitations, team-level settings.
- **Shared across all teams on the server:** the server configuration
  (`config.json`), plugins, integrations such as webhooks and bots, e-mail
  notification settings, file storage, the System Console (visible to every
  `system_admin`), search index, retention and compliance settings. Direct
  messages are possible between any two users of the server while
  `TeamSettings.RestrictDirectMessage` is `any`; set it to `team` to limit
  them to members of a common team.
- **Not separable on one server:** administrators (every `chatAdmin` is a
  system administrator of the whole server), SSO client, backup and restore
  (one database), security policy.

One domain team per department or subsidiary of the same organisation works
well. For customers who require hard data-protection boundaries, separate
administrators, separate SSO or separate backup and restore, run a separate
grommunio installation (or at least a separate chat server) per customer.

## 10. Final check from grommunio Web

The integration is complete when a user reaches chat from grommunio Web
without touching a second URL. The Web plugin is configured in
`/etc/grommunio-web/config-chat.php`:

| Constant | Meaning |
|---|---|
| `PLUGIN_CHAT_URL` | URL embedded in the Chat tab; defaults to `https://<host of the Web session>/chat/`, which matches the nginx route on a single host |
| `PLUGIN_CHAT_USER_DEFAULT_ENABLE` | `true` enables the plugin for every user without a visit to *Settings > Plugins* |
| `PLUGIN_CHAT_AUTOSTART` | `true` opens the Chat tab automatically at login |

1. In grommunio Web, enable the **Chat** plugin under *Settings > Plugins* and
   reload (see [Chat in grommunio Web](/web/chat/)). The **Chat** entry appears
   in the main navigation only for users with *Allow Chat* (`privChat`).
2. Open the Chat tab as `alice@example.com`. Depending on step 8, either the
   password login or the Keycloak login appears; complete it.
3. Post in *Operations* and confirm the message with `bob@example.com`, who
   uses the Chat tab in a second browser profile.

Optionally set `chatWebAddress` in `/etc/grommunio-admin-common/config.json`
to `https://mail.example.com/chat` so that grommunio Admin shows Chat in its
application launcher (see [Administration](/admin/administration/)).

## Verification checklist

| Area | Check | Expected result |
|---|---|---|
| Installation | `rpm -qa \| grep grommunio-chat` | Chat server package is installed |
| Services | `systemctl is-active grommunio-chat mariadb nginx grommunio-admin-api` | All four report `active` |
| Port | `ss -ltnp \| grep 8065` | `grommunio-chat` listens on `127.0.0.1:8065` only |
| Local mode | `test -S /var/tmp/grommunio-chat_local.socket` | Socket exists; `grommunio-chat-ctl --local team list` returns the domain team(s) |
| nginx | `nginx -t` | `syntax is ok`, no `host not found in upstream "chat_server"` |
| Route | `curl -kI https://mail.example.com/chat/` | HTTP 200 |
| API | `curl -k https://mail.example.com/chat/api/v4/system/ping` | `"status":"OK"` |
| Admin API coupling | `grommunio-admin domain query domainname chat chatID` | `chat: true` and a `chatID` for every chat-enabled domain, no `InsecureRequestWarning` |
| User mapping | `grommunio-admin user query username chat privChat` | `chat: true` for every provisioned user |
| Login | Browser login at `/chat/` with grommunio credentials | Domain team and default channels visible |
| WebSocket | Developer tools, request `/chat/api/v4/websocket` | Status 101, no 403 |
| Two users | Message from Alice in *Operations* | Appears for Bob without reload; reply appears for Alice |
| Multi-tenancy | Second domain with `--chat true` | Own `chatID`, own team, users of domain A do not see team B |
| SSO (optional) | Keycloak button on `/chat/`, login round trip | User lands in the domain team; second user test passes |
| grommunio Web | Chat tab in grommunio Web | Login and messaging work inside the tab |
| Restart | `systemctl restart grommunio-chat nginx` | All checks above still pass |
| Logs | `journalctl -u grommunio-chat -u grommunio-admin-api -p warning`, `/var/log/grommunio-chat/mattermost.log` | No recurring errors during the tests |

## Troubleshooting

| Symptom | Likely cause | What to check / fix |
|---|---|---|
| `nginx -t`: `host not found in upstream "chat_server"` | Upstream snippet not included | Make sure `/usr/share/grommunio-common/nginx/upstreams.d/grommunio-chat.conf` exists (reinstall the package) or copy the `.example` file in `/etc/grommunio-common/nginx/upstreams.d/`; run `nginx -t`, restart nginx |
| `/chat/` returns 502 | Chat server not running or listening on another address | `systemctl status grommunio-chat`, `ss -ltnp \| grep 8065`; `ServiceSettings.ListenAddress` must match the upstream (`127.0.0.1:8065`) |
| Messages appear only after reload; WebSocket handshake returns 403 | `SiteURL` does not match the browser URL | Set `ServiceSettings.SiteURL` to exactly `https://mail.example.com/chat`, restart `grommunio-chat`; check reverse proxies and port forwards in front of nginx |
| Chat server fails to start, SQL errors in the journal | Database, user or password wrong | Compare `SqlSettings.DataSource` with the `CREATE USER` statement; test with `mariadb -u grochat -p grochat` |
| `user create` in local mode: `The email you provided does not belong to an accepted domain` | `RestrictCreationToDomains` excludes the address | Use an address in an allowed domain, or extend the list and restart `grommunio-chat` |
| `grommunio-chat-ctl --local` cannot connect | Local mode disabled or wrong socket path | `EnableLocalMode: true`; `LocalModeSocketLocation` and `MMCTL_LOCAL_SOCKET_PATH` must match |
| Admin UI: chat checkboxes disabled; API log shows connection or login errors | Admin API cannot log in to the chat server | `journalctl -u grommunio-admin-api`; verify `chat.yaml` (credentials, `url`, `port`, `basepath`, `verify`) and that the file is readable by user `grommunio`; restart `grommunio-admin-api` |
| `user modify --chat true` has no effect, log says `chat is not enabled for domain` | Domain team missing | `grommunio-admin domain modify <domain> --chat true` first, then repeat the user command |
| `Cannot activate chat for locked user` / `for deactivated domain` | Status prevents provisioning | Set the user or domain status to normal, then enable chat |
| API log: `Unable to create the new team membership because the team has reached the limit of members` | Team member limit reached | Raise `TeamSettings.MaxUsersPerTeam` in `config.json`, restart `grommunio-chat`, repeat `user modify --chat true` |
| User of a second domain cannot be created in chat | Domain missing in `RestrictCreationToDomains` | Add the domain to the list, restart `grommunio-chat`, repeat `user modify --chat true` |
| `InsecureRequestWarning` printed by `grommunio-admin` commands | `verify: False` in `chat.yaml` | Install a trusted certificate and set `verify: True` (or the path of your CA bundle) |
| Banner `Preview Mode: Email notifications have not been configured` | SMTP not configured in the chat server | Not needed for messaging; for production set the `EmailSettings` (`SMTPServer`, `SMTPPort`, `FeedbackEmail`, `SendEmailNotifications`) in `config.json` so that invitations and notifications are delivered |
| Keycloak button missing after step 8 | Adapter did not write the settings or service not restarted | Re-run `setup-gk-app-g-chat`, check `Enable` in `GitLabSettings` (or `KeycloakSettings`) with `jq`, restart `grommunio-chat` |
| Keycloak: `Invalid parameter: redirect_uri` | Redirect URIs do not match the published path | Add both `/chat/login/gitlab/complete` and `/chat/signup/gitlab/complete` on `https://mail.example.com` to the client |

## Operating notes

- **Logs:** `journalctl -u grommunio-chat` for service start and stop,
  `/var/log/grommunio-chat/mattermost.log` (JSON lines) for the server itself
  and `/var/log/grommunio-chat/notifications.log` for notification delivery;
  `journalctl -u grommunio-admin-api` for provisioning problems (team and user
  creation, connection errors); `/var/log/nginx/nginx-chat-access.log` and
  `nginx-chat-error.log` for the HTTP layer. Log levels are set in
  `LogSettings` of `config.json`.
- **Backup:** back up `/etc/grommunio-chat/config.json` (contains the
  database password and, with SSO, the client secret), the data directory
  `/var/lib/grommunio-chat` (attachments under `files/`, installed plugins)
  and the MariaDB database `grochat`, together with the other grommunio
  databases. `/etc/grommunio*` is part of the standard appliance file backup;
  see [Operations](/admin/operations/) and
  [Backup and restore](/guides/backup-restore/). The team and account IDs
  stored in the grommunio database (`chatID`) must stay consistent with the
  `grochat` database; restore both from the same point in time.
- **Reset of the mapping:** if the chat database is rebuilt from scratch,
  `grommunio-admin chat remove-all` clears all stored `chatID` values of
  domains and users so that `--chat true` provisions fresh teams and accounts.
- **Updates:** update with `zypper` like the rest of the stack (see
  [Operations](/admin/operations/)). The package treats `config.json` as a
  configuration file: after an update, compare
  `/etc/grommunio-chat/config.json.rpmnew` with your file and merge new keys.
  The chat server applies database migrations on start; watch
  `journalctl -u grommunio-chat` after an update and re-run the ping and
  WebSocket checks.
- **Monitoring:** poll `https://mail.example.com/chat/api/v4/system/ping` and
  the `grommunio-chat` unit; alert on WebSocket errors reported by users, as
  they usually indicate a proxy or `SiteURL` change.
- **Removing users:** `grommunio-admin user delete` also removes the chat
  account; add `-c` (`--keep-chat`) to deactivate it instead.
  `grommunio-admin user modify <user> --delete-chat-user` removes the chat
  account of a user who stays in grommunio; see
  [grommunio-admin user](/cli/grommunio-admin/user/).

## Container and Kubernetes deployments

With chat enabled, gromox-core sets up the chat server as follows:

- On every start: the database connection (`CHAT_MYSQL_*` variables),
  `ServiceSettings.SiteURL` (`https://<FQDN>/chat`), local mode, and
  `/etc/grommunio-admin-api/conf.d/chat.yaml`. The Admin API connects
  directly to the chat server on `http://localhost:8065` as the chat system
  administrator `admin`. Edits to `chat.yaml` are overwritten on the next
  start.
- On the first initialization: the `grochat` database and the system
  administrator `admin` with the password `CHAT_ADMIN_PASS`.

Chat starts only if `ENABLE_CHAT=true` and the file named by `CHAT_CONFIG`
(default `/etc/grommunio-chat/config.json`) exists. `/etc/grommunio-chat` and
`/var/lib/grommunio-chat` are on volumes; other changes to `config.json`, such
as `EmailSettings` or the OpenID Connect settings, are kept across restarts
and image updates.

If you enable chat on an existing deployment, the system administrator does
not exist yet. Set `FORCE_RECONFIG=true` (Helm chart:
`maintenance.forceReconfig: true`) for one start, then remove it again. This
re-runs the initialization and also resets the grommunio `admin` password to
`ADMIN_PASS`.

| Topic | Difference |
|---|---|
| Steps 1 to 4 | Done by the container. |
| Steps 5 to 7, 9 and 10 | Apply. Run `grommunio-admin` inside gromox-core, for example `docker exec gromox-core grommunio-admin domain modify example.com --chat true` or `kubectl -n grommunio exec grommunio-core-0 -- grommunio-admin ...`. `grommunio-chat-ctl --local` needs the socket path: `docker exec gromox-core env MMCTL_LOCAL_SOCKET_PATH=/var/tmp/grommunio-chat_local.socket grommunio-chat-ctl --local team list`. |
| Step 8 | The adaptor script needs grommunio-auth on the same host and does not apply. Create the Keycloak client as described and enter the OpenID Connect settings in `config.json` yourself. |
| Service commands | Use `supervisorctl status grommunio-chat` and `supervisorctl restart grommunio-chat` (and `grommunio-admin-api`) inside gromox-core instead of `systemctl`. With the Helm chart, `helm test grommunio -n grommunio` checks `/chat/api/v4/system/ping`. |
| Logs | `mattermost.log` is in gromox-core under `/var/log/grommunio-chat/`. Service output is in `/var/log/supervisor-grommunio-chat.log` (Docker Compose) or in the pod log (Helm chart). |
| Updates | Update by pulling new images. `config.json` stays on its volume; there is no `.rpmnew` to merge. |
| Backup | Include the chat volumes and the `grochat` database, see [Backup and restore](/guides/backup-restore/#container-and-kubernetes-deployments). |

## Related pages

- [Chat in grommunio Web](/web/chat/) — enabling the plugin, invitations, team roles
- [Administration](/admin/administration/) — domain and user settings and Defaults in the Admin UI
- [grommunio-admin domain](/cli/grommunio-admin/domain/) and [grommunio-admin user](/cli/grommunio-admin/user/) — CLI reference
- [CLI cookbook](/cli/cookbook/) — common provisioning commands
- [Single sign-on with Keycloak](/guides/sso-keycloak/) — grommunio-auth and the `grommunio` realm
- [Post-installation](/guides/post-install/) — DNS, TLS and base checks this guide builds on
- [Operations](/admin/operations/) and [Backup and restore](/guides/backup-restore/) — backup artefacts and update procedure
- [Architecture](/admin/architecture/) — routing `/chat` in multi-server and load-balanced setups
- [Container installation](/admin/container_core/) and [Kubernetes](/admin/kubernetes/) — container deployments
