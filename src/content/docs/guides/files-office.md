---
title: "grommunio Files and Office: file sync and online editing"
description: "Install grommunio Files and grommunio Office, connect them to grommunio users and grommunio Web, and verify upload, sharing and in-browser editing."
sidebar:
  label: "Files & Office"
  order: 60
---

grommunio Files adds file storage, WebDAV access, sharing and a web interface to a grommunio installation. grommunio Office adds browser-based editing of Word, Excel and PowerPoint documents stored in Files, including collaborative editing. Both are optional components of the grommunio stack and are installed on the same host as the groupware in the default appliance layout.

This guide installs both components on an existing grommunio Appliance, connects Files to the grommunio user base, wires Files to Office, activates the Files integration in grommunio Web and validates the result with real file and document workflows. At the end, users log in to Files with their grommunio credentials, upload and share files, and open DOCX, XLSX and PPTX files in the browser from Files and from grommunio Web.

## How it fits together

grommunio Files is a Nextcloud-based PHP application. It runs under PHP-FPM as the system user `grofiles` in its own pool (`grommunio-files-pool`, socket `/run/php-fpm/php-grommunio-files-fpm.sock`), is published by nginx under `/files/` on the groupware FQDN through the shipped location `/usr/share/grommunio-common/nginx/locations.d/grommunio-files.conf`, stores metadata in the MariaDB database `grofiles` and user data below `/var/lib/grommunio-files/data`. Redis (`redis@grommunio.service`, bound to `127.0.0.1:6379`) provides the distributed file locking and the local cache. The timer `grommunio-files-cron.timer` runs the Nextcloud background jobs (`cron.php`) every five minutes.

grommunio Office is an ONLYOFFICE Document Server. Its document service (`ds-docservice`, running as the user `groffice` and listening on port 8000) and converter (`ds-converter`) use RabbitMQ as message broker and the MariaDB database `groffice` for editing sessions and change tracking. nginx publishes the Document Server under `/office/` by proxying to `http://localhost:8000/` (`/usr/share/grommunio-common/nginx/locations.d/grommunio-office.conf`). The Document Server reads its configuration from `/etc/grommunio-office/` (`default.json`, `production-linux.json`). Files connects to Office through the bundled ONLYOFFICE app: the browser loads the editor from `/office/`, the Document Server fetches the document from Files through the configured storage URL and writes the saved document back through a callback.

grommunio Web integrates Files through its Files plugin. The plugin talks to Files over WebDAV (the default backend), lists folders inside the web client, attaches files from Files to e-mails, saves attachments to Files and, when Office is enabled, opens office file types in an editor tab.

| Component | Package / units | Route or port | Data |
|---|---|---|---|
| grommunio Files | `grommunio-files`; `grommunio-files-cron.timer` | `https://<fqdn>/files/` (nginx location, PHP-FPM pool `grommunio-files-pool`) | `/var/lib/grommunio-files/data`, database `grofiles` |
| Redis | `redis@grommunio.service` (Valkey as `valkey@grommunio.service` on newer bases) | `127.0.0.1:6379` | cache, file locks (volatile) |
| grommunio Office | `grommunio-office` (pulls `grommunio-office-fonts` and system font packages); `ds-docservice`, `ds-converter`; one-shot `ds-themegen`, `ds-fontgen`; optional `ds-metrics` | `https://<fqdn>/office/` (nginx proxy to `localhost:8000`); `ds-docservice` on port 8000 | database `groffice` |
| RabbitMQ | `rabbitmq-server` | local only | message queue for Office |
| grommunio Web Files plugin | part of `grommunio-web` | `https://<fqdn>/web/` | plugin settings in `/etc/grommunio-web/` |
| grommunio DAV | grommunio-dav | `https://<fqdn>/dav` | package creates the endpoint necessary for authentication in `files`, has to be installed on the grommunio core installation (/web) |

Paths that matter for Files:

| Path | Purpose |
|---|---|
| `/usr/share/grommunio-files` | application root; contains `occ` |
| `/usr/share/grommunio-files/config/config.php` | Files configuration, including the database credentials and instance secret |
| `/usr/share/grommunio-files/apps` | bundled apps (read-only) |
| `/var/lib/grommunio-files/apps-external` | writable app directory |
| `/var/lib/grommunio-files/data` | user data, versions, trash |
| `/var/log/grommunio-files/files.log`, `upgrade.log` | Files application log and upgrade log |
| `/etc/php8/fpm/php-fpm.d/pool-grommunio-files.conf` | PHP-FPM pool for Files |
| `/usr/share/grommunio-common/nginx/locations.d/grommunio-files.conf`, `grommunio-office.conf` | nginx locations for `/files/` and `/office/` (shipped by the packages; do not edit in place) |
| `/etc/grommunio-office/default.json` | Office (Document Server) configuration, including the database credentials |
| `/usr/libexec/grommunio-office/server/schema/mysql/createdb.sql` | Office database schema |

All `occ` commands in this guide are executed from `/usr/share/grommunio-files` as the `grofiles` user:

```bash
cd /usr/share/grommunio-files
sudo -u grofiles ./occ status
```

:::note[grommunio-setup]
Current versions of grommunio-setup offer *files* and *office* as feature roles and perform the installation steps below automatically, including the Office wiring and the `fileWebAddress` link in `/etc/grommunio-admin-common/config.json`. The manual steps in this guide follow the same sequence, so that you can add the components to an installation without re-running the setup, and so that you know what to check afterwards. Older grommunio-setup versions re-initialise the whole installation when re-run; check the behaviour of your version before you use it on a production system.
:::

## Prerequisites

- A working grommunio installation with grommunio Web, DAV, Admin UI and mail, reachable under its production FQDN (`mail.example.com` in the examples). See [Installation](/admin/installation/) and [Post-installation](/guides/post-install/).
- A TLS certificate that browsers and the server itself trust. Files fetches documents and identity-provider metadata server-side, and Office fetches documents from Files, so a self-signed certificate breaks these paths unless you add lab-only workarounds.
- MariaDB, nginx, PHP-FPM and Redis running on the host.
- Disk space for user data, versions, trash, database and backups. Files keeps versions and deleted files in `/var/lib/grommunio-files/data`.
- Users who will use Files need the *Web*, *DAV* and *Files* privileges (`privWeb`, `privDav`, `privFiles`) in the Admin UI or via `grommunio-admin user modify`. The DAV privilege is required because Files authenticates users against the grommunio DAV endpoint.
- A snapshot or backup of the appliance before you start. See [Backup and restore](/guides/backup-restore/).

## 1. Record the baseline

Capture the state of the system before installing anything, so that later problems can be attributed to the new components rather than to pre-existing faults.

```bash
cat /etc/os-release
hostname -f
df -h
free -h
systemctl --failed
rpm -qa | grep -i grommunio | sort
ss -lntup
```

Expected result: `hostname -f` prints the FQDN that users will use for Files and Office, `systemctl --failed` lists no units, and nothing listens on port 8000 yet.

## 2. Install the packages

Files, Office and RabbitMQ come from the grommunio repositories. Install them together so that the PHP dependencies, fonts, Document Server and the nginx location snippets arrive in one consistent transaction.

```bash
zypper search -s grommunio-files grommunio-office
zypper --non-interactive install --auto-agree-with-licenses grommunio-files grommunio-office rabbitmq-server
rpm -q grommunio-files grommunio-office rabbitmq-server
```

You also need the DAV package on the machine which hosts your grommunio core installation

```bash
zypper search -s grommunio-dav
zypper --non-interactive install --auto-agree-with-licenses grommunio-dav
rpm -q grommunio-dav
```
Expected result: `rpm -q` prints a version for each of the four packages. `grommunio-office` pulls in `grommunio-office-fonts` and a set of system font packages, which the editor uses for rendering; RabbitMQ is not a package dependency and must be requested explicitly. Reload nginx and restart PHP-FPM so that the shipped `/files/` and `/office/` locations and the PHP pool are active:

```bash
nginx -t
systemctl reload nginx
systemctl restart php-fpm
```

Do not open Files in a browser yet; the instance is not initialised.

## 3. Create the Files database

Files needs its own database and database user. Keep the generated password in a root-only file; it goes into `config.php`, which must stay readable only by root and the `grofiles` user.

```bash
install -d -m 0750 /root/grommunio-secrets
openssl rand -base64 32 > /root/grommunio-secrets/files-db-password
chmod 0600 /root/grommunio-secrets/files-db-password
FILES_DB_PASSWORD="$(cat /root/grommunio-secrets/files-db-password)"
mariadb <<SQL
CREATE DATABASE IF NOT EXISTS grofiles CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER IF NOT EXISTS 'grofiles'@'localhost' IDENTIFIED BY '${FILES_DB_PASSWORD}';
GRANT ALL PRIVILEGES ON grofiles.* TO 'grofiles'@'localhost';
FLUSH PRIVILEGES;
SQL
```

If the central database runs on another host (see [High availability](/admin/high-availability/)), create the database and user there and use that host in the next step.

## 4. Initialise Files and set the trusted domains

The package ships an application tree without an initialised instance. Before running the installer, make sure `config.php` carries the appliance layout: the web root `/files`, the data directory, the log file, the two app paths, Redis for cache and locking, and web-based upgrades disabled (upgrades are done from the command line, see [Operating notes](#operating-notes)). The following is the configuration that grommunio-setup writes; create the file if it does not exist yet.

```php title="/usr/share/grommunio-files/config/config.php"
<?php
$CONFIG = array (
  'overwritewebroot' => '/files',
  'datadirectory' => '/var/lib/grommunio-files/data',
  'logfile' => '/var/log/grommunio-files/files.log',
  'theme' => 'theme-grommunio',
  'logtimezone' => 'UTC',
  'apps_paths' => array (
    0 => array (
      'path' => '/usr/share/grommunio-files/apps',
      'url' => '/apps',
      'writable' => false,
    ),
    1 => array (
      'path' => '/var/lib/grommunio-files/apps-external',
      'url' => '/apps-external',
      'writable' => true,
    ),
  ),
  'memcache.local' => '\\OC\\Memcache\\Redis',
  'filelocking.enabled' => true,
  'memcache.locking' => '\\OC\\Memcache\\Redis',
  'upgrade.disable-web' => true,
  'upgrade.automatic-app-update' => true,
  'updater.server.url' => '127.0.0.1',
);
```

Run the installer with the database credentials from step 3 and choose a password for the local Files administrator account. This account is a Files-internal account, independent of grommunio users; keep it for administration only.

```bash
cd /usr/share/grommunio-files
sudo -u grofiles ./occ maintenance:install --database mysql --database-name grofiles --database-user grofiles --database-pass "$FILES_DB_PASSWORD" --admin-user admin --admin-pass '<strong-password>' --data-dir /var/lib/grommunio-files/data
```

Set the trusted domains and the URLs Files uses when it generates links. `overwritewebroot` must stay `/files`, because nginx publishes Files under that path. Add every host name under which users reach Files (index `0` is `localhost`, set by the installer).

```bash
MAIL_FQDN="mail.example.com"
sudo -u grofiles ./occ config:system:set trusted_domains 1 --value="${MAIL_FQDN}"
sudo -u grofiles ./occ config:system:set overwrite.cli.url --value="https://${MAIL_FQDN}/files"
sudo -u grofiles ./occ config:system:set overwritewebroot --value="/files"
sudo -u grofiles ./occ config:system:set overwriteprotocol --value="https"
sudo -u grofiles ./occ config:system:set default_phone_region --value="<ISO-3166-1-country-code>"
```

Check before moving on:

```bash
sudo -u grofiles ./occ status
sudo -u grofiles ./occ config:system:get trusted_domains
```

Expected result: `installed: true`, `maintenance: false`, and the FQDN in the trusted domains list.

## 5. Redis, file locking and background jobs

File locking prevents two clients (or a client and the Office callback) from writing the same file concurrently; background jobs generate previews, expire versions and trash, and run app maintenance. Both must work before Office is connected.

The appliance runs Redis as `redis@grommunio.service`, bound to `127.0.0.1:6379`, which is also the address Files uses when no `redis` block is configured. Confirm the cache and locking settings from step 4, switch background jobs to cron and enable the timer:

```bash
systemctl is-active redis@grommunio.service
sudo -u grofiles ./occ config:system:set memcache.local --value="\\OC\\Memcache\\Redis"
sudo -u grofiles ./occ config:system:set memcache.locking --value="\\OC\\Memcache\\Redis"
sudo -u grofiles ./occ config:system:set filelocking.enabled --type=boolean --value=true
sudo -u grofiles ./occ background:cron
systemctl enable --now grommunio-files-cron.service grommunio-files-cron.timer
```

Only if your Redis instance listens elsewhere (for example a dedicated Redis host in a multi-node setup), point Files to it:

```bash
sudo -u grofiles ./occ config:system:set redis host --value="<redis-host>"
sudo -u grofiles ./occ config:system:set redis port --value="6379" --type=integer
```

Check before moving on:

```bash
systemctl list-timers grommunio-files-cron.timer
sudo -u grofiles ./occ status
```

Expected result: the timer has a next run time (it fires every five minutes and runs `cron.php` as `grofiles`), `occ config:app:get core backgroundjobs_mode` prints `cron`, and `occ status` still reports `maintenance: false`. If `occ` hangs or reports a Redis connection error, verify that the Redis instance is running and listening on the configured address (`ss -lntp | grep 6379`).

## 6. Connect Files to the grommunio user base

Files should not maintain a second, independent user directory. The `user_external` app with its `BasicAuth` backend authenticates every login against the grommunio DAV endpoint, so users log in to Files with the same address and password they use for grommunio Web. This also covers users that grommunio imports from LDAP, because the check goes through the grommunio authentication stack.

```bash
cd /usr/share/grommunio-files
sudo -u grofiles ./occ app:enable user_external
sudo -u grofiles ./occ config:system:set user_backends 0 class --value="\\OCA\\UserExternal\\BasicAuth"
sudo -u grofiles ./occ config:system:set user_backends 0 arguments 0 --value="https://${MAIL_FQDN}/dav"
```

The DAV endpoint must be reachable from the server itself under the FQDN and with a trusted certificate. Test the round trip with a real user before continuing:

```bash
curl -sS -o /dev/null -w '%{http_code}\n' -u 'alice@example.com:<password>' "https://${MAIL_FQDN}/dav/"
```

Expected result: an HTTP 2xx status. A `401` means the credentials or the user's DAV privilege are wrong; a certificate error means Files will fail the same way.

Confirm that the users who will use Files have the required privileges:

```bash
grommunio-admin user query username privWeb privDav privFiles --format json-flat
```

Set missing privileges in the Admin UI (*Users*, user detail, *Allow Chat/Meet/Files/Archive*, see [Administration](/admin/administration/)) or with `grommunio-admin user modify alice@example.com --privDav 1 --privFiles 1` (see [grommunio-admin user](/cli/grommunio-admin/user/)).

For single sign-on through grommunio-auth and Keycloak instead of, or in addition to, the DAV login, see [step 10](#10-optional-single-sign-on-through-grommunio-auth).

## 7. Prepare Office: database and services

grommunio Office needs its own database and the schema from the package. The Document Server reads the credentials from `/etc/grommunio-office/default.json` under `services.CoAuthoring.sql`. The schema file contains `CREATE DATABASE` and `USE` statements for a differently named database; strip them and import the rest into `groffice`.

```bash
openssl rand -base64 32 > /root/grommunio-secrets/office-db-password
chmod 0600 /root/grommunio-secrets/office-db-password
OFFICE_DB_PASSWORD="$(cat /root/grommunio-secrets/office-db-password)"
mariadb <<SQL
CREATE DATABASE IF NOT EXISTS groffice CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER IF NOT EXISTS 'groffice'@'localhost' IDENTIFIED BY '${OFFICE_DB_PASSWORD}';
GRANT ALL PRIVILEGES ON groffice.* TO 'groffice'@'localhost';
FLUSH PRIVILEGES;
SQL
sed -e '/^CREATE DATABASE/d' -e '/^USE/d' /usr/libexec/grommunio-office/server/schema/mysql/createdb.sql | mariadb groffice
```

Write the credentials into `default.json` without changing the file's ownership and permissions (the file contains the password):

```bash
OFFICE_TMP="$(mktemp)"
jq --arg h localhost --arg n groffice --arg u groffice --arg p "${OFFICE_DB_PASSWORD}" '.services.CoAuthoring.sql.dbHost=$h | .services.CoAuthoring.sql.dbName=$n | .services.CoAuthoring.sql.dbUser=$u | .services.CoAuthoring.sql.dbPass=$p' /etc/grommunio-office/default.json > "${OFFICE_TMP}"
test -s "${OFFICE_TMP}" && cat "${OFFICE_TMP}" > /etc/grommunio-office/default.json
rm -f "${OFFICE_TMP}"
```

Start the services. `ds-themegen` and `ds-fontgen` are one-shot generators for editor themes and the font list from the fonts installed on the system; they run once and do not need to stay enabled. RabbitMQ must be up before the document service starts.

```bash
systemctl enable --now rabbitmq-server
systemctl start ds-themegen ds-fontgen
systemctl enable --now ds-converter ds-docservice
systemctl --no-pager is-active rabbitmq-server ds-converter ds-docservice
```

Check before moving on:

```bash
ss -lntp | grep ':8000'
curl -s "https://${MAIL_FQDN}/office/healthcheck"
```

Expected result: `ds-docservice` listens on port 8000 and the health check returns `true`. The health check covers the document service only; confirm separately that `rabbitmq-server` is `active` and not restarting in a loop, because collaborative editing and save callbacks depend on it. If the health check does not return `true`, check `journalctl -u ds-docservice -u ds-converter -u rabbitmq-server` before connecting Files.

:::caution[Port 8000]
By default the document service binds port 8000 on all interfaces, while nginx only needs to reach it on `localhost`. Port 8000 must not be reachable from outside the host: block it in the host firewall or on the network, and let all clients use `https://<fqdn>/office/` only.
:::

## 8. Connect Files to Office

Files reaches Office through the ONLYOFFICE app. Set the public editor URL (loaded by the browser), the internal URL (used by Files server-side) and the storage URL (used by the Document Server to fetch and save documents). On a single-host appliance all three use the FQDN; the package default for `DocumentServerUrl` is the relative path `/office/`, which is equally valid when Files and Office share the host. `sameTab` opens documents in the Files tab instead of a new browser tab, which the grommunio Web integration relies on.

```bash
cd /usr/share/grommunio-files
sudo -u grofiles ./occ app:enable onlyoffice
sudo -u grofiles ./occ config:app:set onlyoffice DocumentServerUrl --value="https://${MAIL_FQDN}/office/"
sudo -u grofiles ./occ config:app:set onlyoffice DocumentServerInternalUrl --value="https://${MAIL_FQDN}/office/"
sudo -u grofiles ./occ config:app:set onlyoffice StorageUrl --value="https://${MAIL_FQDN}/files/"
sudo -u grofiles ./occ config:app:set onlyoffice sameTab --value=true
sudo -u grofiles ./occ config:app:set onlyoffice customizationForcesave --value=true
```

grommunio-setup additionally sets `customizationChat`, `customizationCompactHeader`, `customizationFeedback`, `customizationToolbarNoTabs` and `preview` for a compact editor inside grommunio Web; adjust these to taste with `occ config:app:set onlyoffice <key> --value=<true|false>`. It also sets the Files system option `csrf.disabled` to `true` when wiring Office. Keep that setting as grommunio-setup configured it; if you build the instance manually and the grommunio Web integration fails with CSRF errors, compare your `config.php` with a setup-generated one.

**JWT secret.** The Document Server can require a signed token on every request. As shipped, grommunio Office does not enforce tokens: in `/etc/grommunio-office/default.json`, `services.CoAuthoring.token.enable.browser`, `services.CoAuthoring.token.enable.request.inbox` and `services.CoAuthoring.token.enable.request.outbox` are `false`, and nginx restricts access to `/office/` and port 8000 to the host. If you enable token validation, set the secret in `services.CoAuthoring.secret.inbox.string` and `services.CoAuthoring.secret.outbox.string` (edit the file the same way as in step 7 to keep its permissions), restart `ds-docservice` and `ds-converter`, and configure the same secret in the Files app, otherwise the editor loads but every document open fails with a download or token error:

```bash
sudo -u grofiles ./occ config:app:set onlyoffice jwt_secret --value='<office-jwt-secret>'
```

Do not enable tokens on one side only. Package updates may leave a `default.json.rpmnew` next to the active file; merge new keys from it after updates.

:::caution[Self-signed certificates]
Files validates the Office certificate when it connects server-side, and Office validates the Files certificate when it fetches documents. With a self-signed certificate both directions fail. For an isolated lab only, you can disable certificate verification in the Files app:

```bash
sudo -u grofiles ./occ config:app:set onlyoffice verify_peer_off --value=true
```

Remove the setting again as soon as a trusted certificate is in place (`occ config:app:delete onlyoffice verify_peer_off`). Do not run a production system with peer verification disabled; use a certificate from a public or internal CA that the appliance trusts instead.
:::

Open `https://mail.example.com/files/` as a regular user, create a new document from the *+* menu and confirm that the editor loads. The detailed edit-save-reopen test follows in step 13.

## 9. Integrate Files and Office with grommunio Web

The Files plugin of grommunio Web is configured server-side in its plugin configuration file, which on the appliance is `/etc/grommunio-web/config-files.php`. Three defines matter for this guide:

| Define | Purpose | Value |
|---|---|---|
| `PLUGIN_FILES_USER_DEFAULT_ENABLE` | enables the plugin for all users; with `false`, each user enables it under *Settings*, *Plugins* | `true` |
| `PLUGIN_FILES_ONLYOFFICE_ENABLE` | opens office file types from Files in an Office editor tab instead of downloading them | `true` |
| `PLUGIN_FILES_ONLYOFFICE_FILETYPES` | file extensions opened in the editor; everything else is downloaded | `".doc,.docx,.docxf,.oform,.odp,.ods,.odt,.ppt,.pptx,.xls,.xlsx"` |

Further defines in the same file: `PLUGIN_FILES_ASK_BEFORE_DELETE` (confirmation before deleting, default `true`), `PLUGIN_FILESBROWSER_LOGLEVEL` (`DEBUG`, `NORMAL`, `ERROR`, `NONE`), `PLUGIN_FILES_REDIS_HOST`, `PLUGIN_FILES_REDIS_PORT`, `PLUGIN_FILES_REDIS_AUTH` (Redis used for caching folder listings) and `PLUGIN_FILES_CACHE_TTL` (cache lifetime in seconds, default `900`).

```bash
grep -E 'PLUGIN_FILES_USER_DEFAULT_ENABLE|PLUGIN_FILES_ONLYOFFICE_ENABLE|PLUGIN_FILES_ONLYOFFICE_FILETYPES' /etc/grommunio-web/config-files.php
```

Expected result:

```php title="/etc/grommunio-web/config-files.php"
define('PLUGIN_FILES_USER_DEFAULT_ENABLE', true);
define('PLUGIN_FILES_ONLYOFFICE_ENABLE', true);
define('PLUGIN_FILES_ONLYOFFICE_FILETYPES', ".doc,.docx,.docxf,.oform,.odp,.ods,.odt,.ppt,.pptx,.xls,.xlsx");
```

If you change values, restart PHP-FPM and reload nginx afterwards:

```bash
systemctl restart php-fpm
systemctl reload nginx
```

Then, as a user, enable the Files plugin (if not enabled by default) and add a Files account in grommunio Web. The account uses the default WebDAV backend and points at your Files instance with the user's grommunio credentials. The user-facing steps are described in [Files in grommunio Web](/web/files/).

Finally, publish the Files link in the Admin UI app launcher by setting `fileWebAddress` in `/etc/grommunio-admin-common/config.json` to `https://mail.example.com/files`, then restart `grommunio-admin-api` (see [Application links](/admin/administration/#application-links-and-server-side-configuration)). Office has no launcher entry; users reach it through Files.

## 10. Optional: single sign-on through grommunio-auth

With grommunio-auth and Keycloak in place (see [Single sign-on with Keycloak](/guides/sso-keycloak/)), Files can use the same identity provider as grommunio Web through the `user_oidc` app. Office does not authenticate users itself; it works in the context of the Files session that opened the document.

| Component | Authentication | User source | Browser session |
|---|---|---|---|
| grommunio Web | grommunio-auth / Keycloak | grommunio users | own session |
| grommunio Files | `user_oidc` via Keycloak, or DAV login (step 6) | Keycloak / grommunio DAV | own session; single sign-on when `user_oidc` is used |
| grommunio Office | callback from the Files app | document context of Files | editor session inside the Files page |

The DAV backend from step 6 keeps working alongside `user_oidc`; the Files login page then offers both the password form and the Keycloak button.

1. In the Keycloak admin console, in the realm used by grommunio-auth (`grommunio` by default), create a confidential OpenID Connect client with client ID `grommunio-files`. Keep *Client authentication* and *Standard flow* enabled; leave *Direct access grants*, *Implicit flow* and *Service account roles* disabled. Register both callback variants of the `user_oidc` app as valid redirect URIs, because Files may return with or without `index.php` depending on the routing:
   - `https://mail.example.com/files/index.php/apps/user_oidc/code`
   - `https://mail.example.com/files/apps/user_oidc/code`
   
   Set the web origin to `https://mail.example.com`.

2. Enable the app and register the provider. The `user_oidc` app is installed but disabled by default, and its `occ` commands only exist while it is enabled. The `grommunio-files` package ships adaptor scripts under `/usr/share/grommunio-auth/adaptor-config-scripts/` (`setup-gk-app-g-files` and `delete-gk-app-g-files`, next to their grommunio Web counterparts). The Files adaptor reads the Keycloak client adapter file `/var/cache/grommunio-auth/adaptor-config/keycloak-grommunio-files.json` (fields `resource`, `credentials.secret`, `auth-server-url`, `realm`), which grommunio-auth writes when the client is created through it, and registers a provider named `grommunio Keycloak` with the user ID mapped to `preferred_username`, so that the Files user matches the account created by the DAV backend:

   ```bash
   cd /usr/share/grommunio-files
   sudo -u grofiles ./occ app:enable user_oidc
   /usr/share/grommunio-auth/adaptor-config-scripts/setup-gk-app-g-files
   sudo -u grofiles ./occ user_oidc:provider
   ```

   Without the adaptor file, register the provider manually with the client secret from Keycloak, using the same mappings the adaptor applies:

   ```bash
   sudo -u grofiles ./occ user_oidc:provider 'grommunio Keycloak' --clientid 'grommunio-files' --clientsecret '<client-secret>' --discoveryuri 'https://mail.example.com/auth/realms/grommunio/.well-known/openid-configuration' --scope 'openid profile' --unique-uid=0 --mapping-uid=preferred_username --mapping-display-name=name --mapping-email=email
   ```

   `occ user_oidc:provider` without arguments lists the registered providers; `delete-gk-app-g-files` (or `occ user_oidc:provider:delete 'grommunio Keycloak'`) removes the provider again.

3. Files must be able to fetch the Keycloak discovery document server-side. In production this works with a trusted certificate. Files uses its own CA bundle at `/usr/share/grommunio-files/resources/config/ca-bundle.crt` in addition to the system trust store, so in an isolated lab with a self-signed certificate you would have to append the lab CA to that bundle as well; this is a lab workaround, not a production configuration.

   ```bash
   curl -fsS "https://mail.example.com/auth/realms/grommunio/.well-known/openid-configuration" > /dev/null
   curl -sI "https://mail.example.com/files/index.php/apps/user_oidc/login/1" | head -3
   ```

   Expected result: the discovery document downloads without a certificate error, and the login route answers with a `302` redirect to the Keycloak authorisation endpoint under `/auth/`.

4. Open `https://mail.example.com/files/` in a private browser window, choose the Keycloak login, authenticate (including the second factor if configured) and confirm that Files logs in the same user that grommunio Web shows.

## 11. Run the health checks

Check services and routes before testing with users. Files must redirect anonymous requests to its login page, Office must report healthy.

```bash
systemctl --no-pager --plain is-active nginx mariadb php-fpm rabbitmq-server ds-docservice ds-converter grommunio-files-cron.timer
systemctl --failed --no-pager --plain
ss -lntup | grep -E ':(443|3306|6379|8000)\s'
curl -sI "https://${MAIL_FQDN}/files/" | head -3
curl -s "https://${MAIL_FQDN}/office/healthcheck"
```

Expected result:

```plaintext
all listed units: active
0 failed units
nginx on 443, MariaDB on 3306, Redis on 127.0.0.1:6379, ds-docservice on port 8000
GET /files/ without session: HTTP 302 to the login page
GET /office/healthcheck: true
```

## 12. Log in and upload test files

Log in to `https://mail.example.com/files/` as a regular grommunio user (`alice@example.com` with her grommunio password when the DAV backend is used). Then upload one DOCX, one XLSX and one PPTX file, either through the web interface or over WebDAV. The WebDAV path uses the Files user name, which is the full e-mail address:

```bash
curl -sS -u 'alice@example.com:<password>' -T test.docx "https://${MAIL_FQDN}/files/remote.php/dav/files/alice@example.com/test.docx"
curl -sS -u 'alice@example.com:<password>' -T test.xlsx "https://${MAIL_FQDN}/files/remote.php/dav/files/alice@example.com/test.xlsx"
curl -sS -u 'alice@example.com:<password>' -T test.pptx "https://${MAIL_FQDN}/files/remote.php/dav/files/alice@example.com/test.pptx"
```

Expected result: HTTP `201 Created` for each upload, and the three files appear in the user's root folder in the web interface with Office icons and a preview.

## 13. Edit, save and re-read a document

Opening the editor is not sufficient as an acceptance test; the saved content must reach the file in Files. Open `test.docx` from Files, type a unique marker text such as `Files Office validation`, wait for the editor to report that all changes are saved, close the editor, and read the file back over WebDAV:

```bash
curl -sS -u 'alice@example.com:<password>' -o /tmp/test.docx "https://${MAIL_FQDN}/files/remote.php/dav/files/alice@example.com/test.docx"
file /tmp/test.docx
unzip -p /tmp/test.docx word/document.xml | grep -c 'Files Office validation'
```

Expected result: `file` reports a Microsoft Word 2007+ document and `grep -c` prints `1` or more. Repeat the open test with `test.xlsx` and `test.pptx`; both must open in the spreadsheet and presentation editor respectively. Also open the same DOCX from two browser sessions (two users, or the same user in a second private window) and confirm that both see each other's edits, which proves that the Document Server, RabbitMQ and the Files callback work together.

## 14. Share with a second user

Sharing exercises the Files database, the user backend (the recipient must be resolvable) and the WebDAV view of the recipient. Share the DOCX from `alice@example.com` with `bob@example.com` through the OCS sharing API (`shareType=0` is a user share, `permissions=15` grants read, update, create and delete), then list Bob's root folder:

```bash
curl -sS -u 'alice@example.com:<password>' -H 'OCS-APIRequest: true' --data-urlencode 'path=/test.docx' -d 'shareType=0' --data-urlencode 'shareWith=bob@example.com' -d 'permissions=15' "https://${MAIL_FQDN}/files/ocs/v2.php/apps/files_sharing/api/v1/shares?format=json"
curl -sS -u 'bob@example.com:<password>' -X PROPFIND -H 'Depth: 1' "https://${MAIL_FQDN}/files/remote.php/dav/files/bob@example.com/"
```

Expected result: the share call returns `"statuscode":200` in the `ocs.meta` object, and Bob's PROPFIND response lists `test.docx`. Log in as Bob in a separate browser session, open the shared file in the editor and save a change; Alice must see the change when she reopens the file.

:::note
With the `user_external` backend, a user account is created in Files at the user's first login. If a share to `bob@example.com` fails with a user-not-found error, log in once as Bob (or check the sharing autocomplete restrictions in the Files administration settings), then repeat the share.
:::

## 15. Test the grommunio Web workflows

Test Files and Office on their own first (steps 12 to 14), then the three workflows that the grommunio Web integration adds. Each item must succeed with a normal user account.

**Workflow A: attach a file from Files to a new e-mail**

1. In grommunio Web, open a new e-mail.
2. Open the attachment menu and choose the Files entry (visible only when the plugin is enabled and an account is configured).
3. Browse to a folder and select an existing file.
4. Send the message. Expected result: the file arrives as a regular attachment at the recipient.

**Workflow B: save a received attachment to Files**

1. Open an e-mail with an attachment.
2. Open the attachment's actions and choose the entry that saves it to Files.
3. Choose the target folder.
4. Expected result: the file is visible in that folder in Files, including over WebDAV.

**Workflow C: edit an Office document from grommunio Web**

1. In the Files tab of grommunio Web, double-click a `.docx`, `.xlsx` or `.pptx` file.
2. Expected result: the document opens in an Office editor tab inside grommunio Web (not as a download), because the extension is listed in `PLUGIN_FILES_ONLYOFFICE_FILETYPES`.
3. Change something, wait for the saved confirmation, close the tab and reopen the file. Expected result: the change is present.

## Verification checklist

| Area | Check | Expected result |
|---|---|---|
| Packages | `rpm -q grommunio-files grommunio-office rabbitmq-server` | all three installed |
| Services | `systemctl is-active nginx mariadb php-fpm rabbitmq-server ds-docservice ds-converter grommunio-files-cron.timer` | all `active`, `systemctl --failed` empty |
| Files instance | `occ status` | `installed: true`, `maintenance: false` |
| Network | `ss -lntup` | nginx on 443, `ds-docservice` on port 8000 (not reachable from outside), Redis on `127.0.0.1:6379` |
| Files route | `curl -sI https://<fqdn>/files/` | `302` to the login page |
| Office route | `curl -s https://<fqdn>/office/healthcheck` | `true` |
| Background jobs | `systemctl list-timers grommunio-files-cron.timer`; Files admin overview | timer scheduled; last cron run recent |
| Authentication | login with a grommunio user (DAV backend) and, if configured, with Keycloak | same user identity as in grommunio Web |
| Upload | WebDAV `PUT` of DOCX, XLSX, PPTX | `201 Created`, files visible in the web interface |
| Editing | edit DOCX, save, download, `unzip -p ... word/document.xml` | marker text present in the file |
| Collaboration | two sessions on one document | both see each other's changes |
| Sharing | OCS share to a second user, PROPFIND as that user | share created, file listed |
| grommunio Web | workflows A, B and C | attach from Files, save to Files, edit in Office tab |
| Restart | `systemctl restart nginx php-fpm rabbitmq-server ds-docservice ds-converter`; reboot | all functions unchanged afterwards |
| Logs | `/var/log/grommunio-files/files.log`, `journalctl -u ds-docservice -u ds-converter` | no repeated errors during the tests |

## Troubleshooting

| Symptom | Likely cause | What to check / fix |
|---|---|---|
| `https://<fqdn>/files/` returns 404 or the nginx default page | nginx location for `/files/` not active, or PHP-FPM pool not loaded | `nginx -t`, `systemctl reload nginx`, `systemctl restart php-fpm`; verify the package installed correctly |
| "Access through untrusted domain" page | host name missing in `trusted_domains` | `occ config:system:get trusted_domains`, add the name with `occ config:system:set trusted_domains <n> --value=<host>` |
| Login with a grommunio user fails, Files administrator login works | `user_external` misconfigured, DAV URL not reachable from the server, missing `privDav`/`privFiles`, or certificate not trusted | `curl -u user:pass https://<fqdn>/dav/` from the server; `grommunio-admin user query username privDav privFiles`; check `files.log` |
| Files login page loads but `occ` or page loads are very slow | Redis unreachable; locking waits for timeouts | `ss -lntp | grep 6379`, Redis unit status, `redis host`/`redis port` in `config.php` |
| Previews, trash expiry or version cleanup never happen | background jobs not running | `occ background:cron`, `systemctl enable --now grommunio-files-cron.timer`, check the last cron run in the Files administration overview |
| Editor stays blank or reports that the document service is unreachable | `ds-docservice` down, RabbitMQ down, wrong `DocumentServerUrl`, or health check fails | `curl -s https://<fqdn>/office/healthcheck`, `journalctl -u ds-docservice -u ds-converter -u rabbitmq-server`, `occ config:app:get onlyoffice DocumentServerUrl` |
| Health check returns `true`, but collaborative editing or saving is unreliable | `rabbitmq-server` failed or restarting in a loop (`activating (auto-restart)`) | `systemctl status rabbitmq-server`, `journalctl -u rabbitmq-server`; fix RabbitMQ, then restart `ds-docservice` and `ds-converter` |
| Editor loads, but opening a document fails with a download or callback error | Document Server cannot fetch from `StorageUrl`, certificate not trusted, or JWT secret mismatch | `curl -sI https://<fqdn>/files/` from the server; compare the token settings in `/etc/grommunio-office/default.json` with `occ config:app:get onlyoffice jwt_secret`; only in a lab: `verify_peer_off` |
| Document opens but saved changes are missing after reopening | callback from Office to Files blocked, or file locking broken | `files.log` for callback errors, Redis status, `filelocking.enabled` |
| Wrong or missing fonts in the editor | font list not generated after installing fonts | install the fonts, run `systemctl start ds-fontgen`, restart `ds-docservice` and `ds-converter` |
| Office file types download instead of opening in grommunio Web | `PLUGIN_FILES_ONLYOFFICE_ENABLE` false, or extension missing in `PLUGIN_FILES_ONLYOFFICE_FILETYPES` | check `/etc/grommunio-web/config-files.php`, restart `php-fpm`, reload grommunio Web |
| Files entry missing in grommunio Web | plugin not enabled for the user, or no account configured | *Settings*, *Plugins*, *Files*; then add an account, see [Files in grommunio Web](/web/files/) |
| Keycloak login button missing or redirect loop | `user_oidc` provider not registered, redirect URI mismatch, or discovery document not fetchable server-side | `occ user_oidc:provider`, compare redirect URIs in Keycloak with `/files/index.php/apps/user_oidc/code`, `curl` the discovery URL from the server |
| Files stuck in maintenance mode after an update | `occ upgrade` was interrupted | `occ upgrade`, then `occ maintenance:mode --off`; check `files.log` |

## Operating notes

**Backup.** In addition to the artefacts listed in [Backup and disaster recovery](/admin/operations/#backup--disaster-recovery), back up:

- Files: `/var/lib/grommunio-files` (data and external apps), the `grofiles` database and `/usr/share/grommunio-files/config/config.php`. `config.php` contains the instance ID, the instance secret and the database credentials; without it a restored database cannot be attached to the data directory.
- Office: the `groffice` database and `/etc/grommunio-office/default.json` (database credentials and token settings). Editing sessions are transient; a restored Office instance starts with no open documents.
- When a role is removed through grommunio-setup, it keeps a copy of these configuration files under `/etc/grommunio-common/setup-backup/<role>/` so that the role can be re-added against the preserved data. The directory only exists after such a removal.

Put Files into maintenance mode for a consistent file-level backup of a busy instance (`occ maintenance:mode --on`, back up, `occ maintenance:mode --off`), or use a filesystem snapshot. See [Backup and restore](/guides/backup-restore/).

**Logs.** Files writes to `/var/log/grommunio-files/files.log` (JSON lines; `occ log:manage` sets the level) and records command-line upgrades in `/var/log/grommunio-files/upgrade.log`. Office, converter and RabbitMQ log to the journal: `journalctl -u ds-docservice -u ds-converter -u rabbitmq-server`. HTTP-level errors for `/files/` and `/office/` are in the nginx logs. For the grommunio Web plugin, set `PLUGIN_FILESBROWSER_LOGLEVEL` to `DEBUG` temporarily and read the PHP-FPM and grommunio Web logs.

**Updates.** Update the packages with `zypper update` (see [Updating grommunio](/admin/operations/#updating-grommunio)). Web-based upgrades are disabled (`upgrade.disable-web`), so after a `grommunio-files` update run the database migration from the command line and make sure the instance leaves maintenance mode:

```bash
cd /usr/share/grommunio-files
sudo -u grofiles ./occ upgrade
sudo -u grofiles ./occ maintenance:mode --off
sudo -u grofiles ./occ status
```

After a `grommunio-office` update, compare `/etc/grommunio-office/default.json` with a new `default.json.rpmnew` if one appeared, restart `ds-docservice` and `ds-converter` and re-check `/office/healthcheck`. Open documents are closed by the restart; announce maintenance windows to users.

**Routine occ tasks.**

```bash
sudo -u grofiles ./occ app:update --all
sudo -u grofiles ./occ files:scan --all
sudo -u grofiles ./occ maintenance:repair
```

`files:scan` is needed when files are added or changed on disk outside Files (for example after a restore). Run `occ` only as `grofiles`; running it as root changes file ownership in the application tree.

**Monitoring.** Alert on `systemctl --failed`, on the `grommunio-files-cron.timer` not firing, on `/office/healthcheck` returning anything other than `true`, and on disk usage of `/var/lib/grommunio-files/data`. The Files administration overview lists background job status, missing indices and security warnings after each update.

## Related pages

- [Files in grommunio Web](/web/files/) - enabling the plugin and adding an account as a user
- [Administration](/admin/administration/) - user privileges, application links
- [Operations](/admin/operations/) - updates, backup artefacts
- [Single sign-on with Keycloak](/guides/sso-keycloak/) - grommunio-auth and Keycloak setup
- [Post-installation](/guides/post-install/) - FQDN, TLS and baseline checks
- [Backup and restore](/guides/backup-restore/)
- [grommunio-admin user](/cli/grommunio-admin/user/) - setting privileges from the command line
- [High availability](/admin/high-availability/) - load balancer routes for `/files` and `/office`
