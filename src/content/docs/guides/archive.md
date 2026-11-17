---
title: "grommunio Archive: e-mail archiving, search and restore"
description: "Install grommunio Archive, connect it to the Postfix mail flow, grant users access, and verify archiving, full-text search and restore into the mailbox."
sidebar:
  label: "Archive"
  order: 70
---

grommunio Archive is the e-mail archiving component of grommunio. It is based
on the open source archiver Piler and stores an independent, deduplicated and
encrypted copy of every message that passes through the mail system, indexes
it for full-text search and lets users find, view, export and restore
messages through a web interface under `/archive/`.

At the end of this guide you have an archive that receives a copy of each
message from Postfix, a working search index, users who can log in with their
grommunio credentials, and a proven restore path from the archive back into
the mailbox. You also know which artefacts to back up and what to monitor.

:::caution[Compliance is your responsibility]
grommunio Archive is the technical building block for retention and
compliance archiving. Which messages must be retained, for how long, who may
access them, how exports must look and how evidential value is preserved are
legal and organisational questions. Define them with your organisation and
legal counsel and map them onto the retention rules, legal hold and access
roles described below.
:::

## How it fits together

Postfix delivers a message to the mailbox as usual and, in addition, creates a
copy for an internal archive address. A transport map routes that address to
the archive SMTP listener on `127.0.0.1:2693`. The archive daemon stores the
message in `/var/lib/grommunio-archive/store`, writes metadata to the
`groarchive` database in MariaDB and feeds the Sphinx full-text index. Users
search and open messages in the web interface; the interface authenticates
against the Gromox IMAP service and uses the same IMAP connection to restore
messages into the user's mailbox.

```plaintext
client / internet
      |
   Postfix  --------------------------------> mailbox (Gromox, virtual_transport)
      |  always_bcc or recipient_bcc_maps
      |  + X-Envelope-To header
      v
archive@mail.example.com  --transport_maps-->  smtp:[127.0.0.1]:2693
                                                    |
                                        grommunio-archive-smtp (piler-smtp)
                                                    |
                                          grommunio-archive (piler)
                                           |                |
                                 store + metadata      Sphinx index
                                 (files + groarchive)  (searchd, cron indexer)
                                                    |
                                   web UI /archive/ (nginx + PHP-FPM)
                                                    |
                                     restore via IMAP into the mailbox
```

| Component | Unit / process | Listens on | Role |
| --- | --- | --- | --- |
| Archive SMTP listener | `grommunio-archive-smtp.service` (`piler-smtp`) | `listen_addr:2693` | Accepts the copies handed over by Postfix |
| Archive daemon | `grommunio-archive.service` (`piler`) | – | Deduplicates, encrypts and stores messages, writes metadata |
| Full-text index | `searchd.service` (Sphinx, runs as `groarchive`) | `127.0.0.1:9306` (MySQL protocol), `127.0.0.1:9312` | Serves search queries; indexes are refreshed by cron |
| Web interface | nginx location `/archive/`, PHP-FPM pool `grommunio-archive-pool` | HTTPS 443 | Login, search, view, export, restore, administration |
| Database | MariaDB, database `groarchive` | local socket | Metadata, recipients, users, rules, audit log |
| IMAP service | Gromox [imap(8gx)](/man/imap-8gx/) | 993 | Authentication backend and restore target |

Files and directories you will work with:

| Path | Purpose |
| --- | --- |
| `/etc/grommunio-archive/grommunio-archive.conf` | Daemon and SMTP listener configuration (template: `grommunio-archive.conf.dist`) |
| `/etc/grommunio-archive/config-site.php` | Web interface configuration (template: `config-site.dist.php`) |
| `/etc/grommunio-archive/sphinx.conf.dist` | Template that renders `/etc/sphinx/sphinx.conf` |
| `/etc/grommunio-archive/grommunio-archive.key` | Encryption key for the message store |
| `/etc/php8/fpm/php-fpm.d/pool-grommunio-archive.conf` | PHP-FPM pool, socket `/run/php-fpm/php-grommunio-archive-fpm.sock` |
| `/usr/share/grommunio-common/nginx/locations.d/grommunio-archive.conf`, `/usr/share/grommunio-common/nginx/upstreams.d/grommunio-archive.conf` | nginx location and upstream shipped with the package |
| `/usr/share/grommunio-archive/archive/` | Web interface document root |
| `/usr/share/grommunio-archive/db-mysql.sql` | Database schema including the built-in `admin@local` and `auditor@local` accounts |
| `/usr/libexec/grommunio-archive/` | Helper scripts: `indexer.delta.sh`, `indexer.main.sh`, `purge.sh`, `pilerpurge.py`, `import.sh` |
| `/var/lib/grommunio-archive/{store,tmp,sphinx,error,stat,imap}` | Message store, temporary files, Sphinx index files, failed messages, status beacons |
| `/var/spool/cron/tabs/groarchive` | Crontab of the `groarchive` user (indexer, purge, cleanup) |

On the grommunio Appliance, `grommunio-setup` performs steps 2 to 6 when you
select the Archive feature. Use those steps to verify or adjust the result,
or to install Archive manually on a system that was not set up with the
wizard. In the container deployment the same components are enabled with
`ENABLE_ARCHIVE=true`, see [Container deployment](/admin/container_core/).
With the Helm chart, Archive is controlled by `features.archive.enabled`
(enabled by default), see [Kubernetes](/admin/kubernetes/).

:::caution[Archive encryption key on Kubernetes]
The chart keeps the encryption key on the archive data volume
(`data-<release>-archive-0`, file
`/var/lib/grommunio-archive/grommunio-archive.key`). It is never
regenerated, and archived mail is unreadable without it. Export it right
after the first install:

```bash
kubectl -n grommunio exec grommunio-archive-0 -- cat /var/lib/grommunio-archive/grommunio-archive.key > grommunio-archive.key
```

To restore or migrate onto an empty archive volume, store the key in a
Secret under the key `grommunio-archive.key` and reference it with
`features.archive.encryptionKey.existingSecret`. The container installs it
on a fresh volume and refuses to start if it differs from a key already
present.
:::

## Prerequisites

- A working grommunio installation with DNS, a trusted TLS certificate for
  the public name (for example `mail.example.com`), time synchronisation,
  access to the Admin UI and functioning user mailboxes. See the
  [post-installation guide](/guides/post-install/).
- The Gromox IMAP service is running and reachable on port 993 under the same
  name that is on the TLS certificate; the archive web interface
  authenticates and restores over IMAP with TLS.
- Postfix is the MTA on the host, configured with the grommunio MySQL maps
  (see the Postfix table in [High availability](/admin/high-availability/)).
- MariaDB is local or reachable, and you can run SQL as the database
  administrator.
- Disk capacity for the message store. Plan `/var/lib/grommunio-archive` like
  mailbox storage: it grows with every message for the whole retention period.

Check the starting point:

```bash
hostname -f
rpm -qa | grep -Ei 'grommunio|gromox' | sort
systemctl is-active postfix nginx php-fpm mariadb
ss -ltn | grep -E ':993 |:25 '
```

## 1. Install the packages

The archive and the Sphinx search engine come from the grommunio repository.

```bash
zypper refresh
zypper install grommunio-archive sphinx
```

Expected result: `rpm -q grommunio-archive sphinx` prints both packages, the
system user `groarchive` exists and `/var/lib/grommunio-archive` contains the
`store`, `tmp`, `sphinx`, `stat` and `imap` directories.

```bash
id groarchive
ls -la /var/lib/grommunio-archive
ls /etc/grommunio-archive
```

## 2. Prepare the database

Archive uses its own database, `groarchive` by default. Create the database
and a dedicated user, then import the schema.

```bash
mariadb -uroot <<'SQL'
CREATE DATABASE IF NOT EXISTS groarchive CHARACTER SET utf8mb4;
CREATE USER IF NOT EXISTS 'groarchive'@'localhost' IDENTIFIED BY '<strong-password>';
GRANT ALL PRIVILEGES ON groarchive.* TO 'groarchive'@'localhost';
FLUSH PRIVILEGES;
SQL
```

The shipped schema creates two built-in accounts, `admin@local`
(administration) and `auditor@local` (read access to all archived mail). Their
passwords are the placeholders `grommunioArchiveAdmin` and
`grommunioArchiveAuditor` in the SQL file. Replace them while importing;
never import the schema with the placeholders.

```bash
sed -e 's#grommunioArchiveAdmin#<archive-admin-password>#g' \
    -e 's#grommunioArchiveAuditor#<auditor-password>#g' \
    /usr/share/grommunio-archive/db-mysql.sql | mariadb groarchive
mariadb -N groarchive -e "SHOW TABLES" | wc -l
```

Expected result: around 40 tables, among them `metadata`, `rcpt`,
`sph_index`, `retention_rule`, `archiving_rule`, `legal_hold`, `audit` and
`user`.

## 3. Configure the daemon, the web interface and Sphinx

### 3.1 Daemon configuration

Copy the template and restrict it to root and the `groarchive` group, because
it contains the database password.

```bash
cp -n /etc/grommunio-archive/grommunio-archive.conf.dist /etc/grommunio-archive/grommunio-archive.conf
chgrp groarchive /etc/grommunio-archive/grommunio-archive.conf
chmod 0640 /etc/grommunio-archive/grommunio-archive.conf
```

Set the values that apply to your environment:

```ini title="/etc/grommunio-archive/grommunio-archive.conf"
hostid=mail.example.com
listen_addr=127.0.0.1
listen_port=2693
mysqlsocket=/run/mysql/mysql.sock
mysqldb=groarchive
mysqluser=groarchive
mysqlpwd=<strong-password>
queuedir=/var/lib/grommunio-archive/store
workdir=/var/lib/grommunio-archive/tmp
sphxhost=127.0.0.1
sphxport=9306
encrypt_messages=1
default_retention_days=2557
extra_to_field=X-Envelope-To:
```

| Key | Shipped default | Meaning |
| --- | --- | --- |
| `hostid` | placeholder | SMTP HELO name of the listener. Use the domain part of the archive address (`mail.example.com` for `archive@mail.example.com`). |
| `listen_addr` | `0.0.0.0` | Address the SMTP listener binds to. Set `127.0.0.1` when Postfix runs on the same host; the shipped default listens on all interfaces. |
| `listen_port` | `2693` | Port of the SMTP listener. Must match the Postfix transport entry. |
| `mysqlhost`, `mysqlsocket` | empty, `/run/mysql/mysql.sock` | Database connection; the socket is used when `mysqlhost` is empty. |
| `mysqldb`, `mysqluser`, `mysqlpwd` | `groarchive`, `groarchive`, empty | Database credentials from step 2. |
| `queuedir` | `/var/lib/grommunio-archive/store` | Message store. |
| `workdir` | `/var/lib/grommunio-archive/tmp` | Temporary files while a message is processed. |
| `sphxhost`, `sphxport` | `127.0.0.1`, `9306` | MySQL-protocol endpoint of `searchd`. |
| `encrypt_messages` | `1` | Encrypt stored messages with `grommunio-archive.key`. Decide before the first message arrives and never change it afterwards. |
| `default_retention_days` | `2557` | Retention for messages without a matching retention rule (7 years + 2 days). Stored per message at archiving time. |
| `extra_to_field` | `X-Envelope-To:` | Header from which the archive reads the envelope recipient; Postfix adds it (step 6). |
| `username` | `groarchive` | Service account of the daemons. |

Query the effective configuration at any time with `pilerconf -q <key>`, for
example `pilerconf -q listen_addr`.

### 3.2 Encryption key

With `encrypt_messages=1` the store is unreadable without
`/etc/grommunio-archive/grommunio-archive.key`. Create it once, only if it
does not exist yet, and include it in every backup.

```bash
test -s /etc/grommunio-archive/grommunio-archive.key || head -c 56 /dev/urandom > /etc/grommunio-archive/grommunio-archive.key
chgrp groarchive /etc/grommunio-archive/grommunio-archive.key
chmod 0640 /etc/grommunio-archive/grommunio-archive.key
```

:::danger
Losing or regenerating the key after messages have been archived makes the
existing store permanently unreadable. Treat the key like a private key.
:::

### 3.3 Web interface configuration

The web interface reads `/usr/share/grommunio-archive/archive/config.php` and
then overrides it with `/etc/grommunio-archive/config-site.php`. Render the
template by replacing its placeholders: `MYHOSTNAME` (public name of the
appliance), `MYSMTP` (mail domain used for notification senders) and the
`MYSQL_*` database values.

```bash
sed -e 's#MYHOSTNAME#mail.example.com#g' \
    -e 's#MYSMTP#example.com#g' \
    -e 's#MYSQL_HOSTNAME#localhost#' \
    -e 's#MYSQL_DATABASE#groarchive#' \
    -e 's#MYSQL_USERNAME#groarchive#' \
    -e 's#MYSQL_PASSWORD#<strong-password>#' \
    /etc/grommunio-archive/config-site.dist.php > /etc/grommunio-archive/config-site.php
chgrp groarchive /etc/grommunio-archive/config-site.php
chmod 0640 /etc/grommunio-archive/config-site.php
```

The template already contains the grommunio-specific settings; check them
after rendering:

| Setting | Value in the template | Meaning |
| --- | --- | --- |
| `PATH_PREFIX`, `SITE_URL` | `/archive/`, `https://<MYHOSTNAME>/archive/` | Public URL of the web interface. |
| `ENABLE_IMAP_AUTH` | `1` | Users log in with their grommunio e-mail address and password, checked over IMAP. |
| `IMAP_HOST`, `IMAP_PORT`, `IMAP_SSL` | `<MYHOSTNAME>`, `993`, `true` | IMAP endpoint for login and restore. The host name must match the TLS certificate of the IMAP service. |
| `RESTORE_OVER_IMAP` | `1` | Restore writes the message back into the mailbox over IMAP. |
| `IMAP_RESTORE_FOLDER_INBOX`, `IMAP_RESTORE_FOLDER_SENT` | `INBOX`, `Sent` | Target folders for restored received and sent messages. |
| `SMTP_DOMAIN`, `SMTP_FROMADDR`, `ADMIN_EMAIL` | derived from `MYSMTP` | Sender and contact addresses for notifications. |
| `DB_HOSTNAME`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | from `MYSQL_*` | Database access of the web interface. |

Defaults that remain in `config.php` unless you override them in
`config-site.php`: `ENABLE_AUDIT = 1` (every view, download and restore is
logged), `ENABLE_DELETE = 0` (nobody can delete from the archive through the
interface), `BULK_DOWNLOAD_FOR_USERS = 1`, `ENABLE_PDF_DOWNLOAD = 0`,
`SPHINX_HOSTNAME = 127.0.0.1:9306`, `SPHINX_MAIN_INDEX =
main1,dailydelta1,delta1`, `SESSION_EXPIRY = 3600`.

### 3.4 Sphinx configuration and initial index

`sphinx.conf.dist` is a PHP template. Render it, insert the database
credentials, hand the file to the `groarchive` and `sphinx` accounts and build
the empty indexes once.

```bash
php /etc/grommunio-archive/sphinx.conf.dist > /etc/sphinx/sphinx.conf
sed -i -e 's#MYSQL_HOSTNAME#localhost#' \
       -e 's#MYSQL_DATABASE#groarchive#' \
       -e 's#MYSQL_USERNAME#groarchive#' \
       -e 's#MYSQL_PASSWORD#<strong-password>#' /etc/sphinx/sphinx.conf
chown groarchive:sphinx /etc/sphinx/sphinx.conf
chmod 0640 /etc/sphinx/sphinx.conf
chown -R groarchive:sphinx /var/lib/grommunio-archive/sphinx
runuser -u groarchive -- indexer --config /etc/sphinx/sphinx.conf --all
```

Expected result: `grep '^index ' /etc/sphinx/sphinx.conf` lists `main1` to
`main4`, `dailydelta1`, `delta1`, `tag1` and `note1`, and
`/var/lib/grommunio-archive/sphinx/` contains index files for each of them.

## 4. Enable the services and check the listeners

```bash
systemctl enable --now searchd.service grommunio-archive-smtp.service grommunio-archive.service
systemctl restart php-fpm.service
systemctl is-active searchd grommunio-archive-smtp grommunio-archive php-fpm nginx
ss -ltnp | grep -E ':2693|:9306|:9312'
```

Expected result: all five services are `active`; `searchd` listens on
`127.0.0.1:9306` and `127.0.0.1:9312`; `piler-smtp` listens on port 2693 on
the address you set in `listen_addr`. If the listener shows `0.0.0.0:2693`,
set `listen_addr=127.0.0.1` and restart `grommunio-archive-smtp.service`,
or restrict the port with the host firewall. Only HTTPS should be reachable
from outside.

## 5. Publish the web interface under /archive/

The package ships the nginx configuration; nothing has to be written by hand.
`/etc/nginx/conf.d/grommunio.conf` includes
`/usr/share/grommunio-common/nginx.conf`, which loads
`/usr/share/grommunio-common/nginx/locations.d/*.conf` and
`/usr/share/grommunio-common/nginx/upstreams.d/*.conf`, plus local overrides
from `/etc/grommunio-common/nginx/locations.d/` and
`/etc/grommunio-common/nginx/upstreams.d/`. The archive snippet serves the
document root, passes PHP to the `fpm_archive` upstream and rewrites the
application routes (search, message view, bulk restore, retention, legal
hold, audit). In essence:

```nginx title="/usr/share/grommunio-common/nginx/locations.d/grommunio-archive.conf (excerpt)"
location /archive {
        alias /usr/share/grommunio-archive/archive;
        index index.php;
        try_files $uri $uri/ /archive/index.php;
        access_log /var/log/nginx/nginx-archive-access.log;
        error_log /var/log/nginx/nginx-archive-error.log;
}

location ~* ^/archive/(qr|js|sso|index).php {
        alias /usr/share/grommunio-archive;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_pass fpm_archive;
        include fastcgi_params;
}
```

```nginx title="/usr/share/grommunio-common/nginx/upstreams.d/grommunio-archive.conf"
upstream fpm_archive {
        server unix:/run/php-fpm/php-grommunio-archive-fpm.sock;
}
```

Do not edit the files under `/usr/share`; place changes in
`/etc/grommunio-common/nginx/locations.d/`. Test and reload:

```bash
nginx -t
systemctl reload nginx
ls -la /run/php-fpm/php-grommunio-archive-fpm.sock
curl -kI https://mail.example.com/archive/
```

Expected result: an HTTP `200` or a redirect to the login page, and the
PHP-FPM socket owned by `groarchive`.

To link the archive from the Admin UI, set `archiveWebAddress` to
`https://mail.example.com/archive` in `/etc/grommunio-admin-common/config.json`
(see [Administration](/admin/administration/)).

## 6. Connect the mail flow in Postfix

Postfix creates the archive copy. Two mechanisms are available; the appliance
uses the first one.

### 6.1 Archive everything (appliance default)

`always_bcc` adds the archive address as a recipient to every message Postfix
accepts. A `transport_maps` entry routes that address to the archive
listener, and a `check_recipient_access` map prepends an `X-Envelope-To`
header per recipient so that the archive knows the real envelope recipient
(this is what makes BCC recipients and distribution lists attributable).

```bash
postconf -e "always_bcc=archive@mail.example.com"
echo "archive@mail.example.com smtp:[127.0.0.1]:2693" > /etc/postfix/transport
postmap /etc/postfix/transport
echo '/(.*)/   prepend X-Envelope-To: $1' > /etc/postfix/grommunio-archiver-envelope.cf
```

Make sure `transport_maps` points at the map and that the recipient
restrictions contain the envelope map right after the permit rules. The
appliance uses these values:

```properties title="/etc/postfix/main.cf (relevant settings)"
always_bcc = archive@mail.example.com
transport_maps = lmdb:/etc/postfix/transport
smtpd_recipient_restrictions = permit_sasl_authenticated, permit_mynetworks,
    check_recipient_access pcre:/etc/postfix/grommunio-archiver-envelope.cf,
    reject_unknown_recipient_domain, reject_non_fqdn_hostname,
    reject_non_fqdn_sender, reject_non_fqdn_recipient,
    reject_unauth_destination, reject_unauth_pipelining
```

```bash
systemctl restart postfix
postconf always_bcc transport_maps smtpd_recipient_restrictions
postmap -q archive@mail.example.com lmdb:/etc/postfix/transport
```

Expected result of the last command: `smtp:[127.0.0.1]:2693`. The domain part
of the archive address must equal `hostid` in the daemon configuration. Only
mail that passes through Postfix is archived; in a standard grommunio
installation this includes mail submitted by Outlook, grommunio Web and mobile
clients, because Gromox hands outgoing messages to the local MTA
(`outgoing_smtp_url`, see [gromox.cfg(5)](/man/gromox-cfg-5/)).

### 6.2 Archive selected users only

If only some mailboxes must be archived, leave `always_bcc` unset
(`postconf -X always_bcc`) and use the per-user *E-Mail forward* in the Admin
UI (user, tab *SMTP*, CC mode) with `archive@mail.example.com` as the
destination. Postfix evaluates these entries through
`recipient_bcc_maps = mysql:/etc/postfix/grommunio-bcc-forwards.cf`, which
queries the `forwards` table with `forward_type = 0`; the transport and
envelope maps from 6.1 are still required. See
[Administration](/admin/administration/) for the forward settings and the
[CLI cookbook](/cli/cookbook/) for scripted user changes.

```bash
postmap -q alice@example.com mysql:/etc/postfix/grommunio-bcc-forwards.cf
```

Expected result: the archive address for every user that should be archived,
and no output for users that should not.

## 7. Grant users access

The web interface authenticates over IMAP, so an archive user needs the
POP3/IMAP privilege in addition to the Archive privilege. This is the most
common reason for a failing archive login, see
[KB: Archive](/kb/archive/). Set both in the Admin UI (user, *Account*:
*Allow POP3/IMAP logins* and *Allow Archive*) or on the command line:

```bash
grommunio-admin user modify alice@example.com --pop3-imap true --privArchive true
grommunio-admin user query username pop3_imap privArchive -f username=alice@example.com
```

Expected result: `pop3_imap` and `privArchive` are `true` for the user. See
[grommunio-admin user](/cli/grommunio-admin/user/) for all fields.

Then open `https://mail.example.com/archive/` and log in with the full e-mail
address and the mailbox password. Regular users see only messages they sent
or received. The built-in `auditor@local` account can search across all
mailboxes, `admin@local` manages domains, rules, legal hold and users. Keep
these two accounts for auditors and administrators, use strong passwords and
do not hand them to regular users.

## 8. Prove that messages are archived

Send a test message with a unique marker in the subject and follow it through
Postfix, the SMTP listener, the daemon, the database and the index.

```bash
/usr/sbin/sendmail -t <<'MAIL'
From: Archive Test <bob@example.com>
To: alice@example.com
Subject: Archive validation MARKER-20260916-1
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8

This message verifies archiving, search and restore.
MAIL
```

Check each stage:

```bash
journalctl -u postfix --since "-10 min" --no-pager | grep 2693
journalctl -u grommunio-archive-smtp --since "-10 min" --no-pager
journalctl -u grommunio-archive --since "-10 min" --no-pager
mariadb groarchive -e "SELECT id, CAST(subject AS CHAR(255)) AS subject, FROM_UNIXTIME(arrived) AS arrived FROM metadata ORDER BY id DESC LIMIT 5;"
```

Expected results:

- Postfix: `relay=127.0.0.1[127.0.0.1]:2693 ... status=sent (250 OK <ID>)`
  for the archive recipient, and the normal delivery to the mailbox.
- `grommunio-archive-smtp`: `received: <ID>, from=<...>, size=..., client=127.0.0.1`.
- `grommunio-archive`: a line ending in `status=stored` with the same ID,
  `retention=2557` (or the value of your rule). `status=duplicate` means the
  identical message was already archived; this is deduplication, not an
  error.
- The `metadata` query lists the test subject as the newest row. The `subject`
  column is a `blob`, hence the `CAST`.

The search index is refreshed by the `groarchive` crontab: `indexer.delta.sh`
every 30 minutes (minute 5 and 35), `indexer.main.sh` nightly at 02:30,
`tag1`/`note1` every 15 minutes. To make the message searchable immediately,
run the delta indexer manually and query Sphinx directly over its MySQL
protocol port:

```bash
crontab -l -u groarchive
runuser -u groarchive -- /usr/libexec/grommunio-archive/indexer.delta.sh
mariadb -h127.0.0.1 -P9306 -e "SELECT id FROM main1,dailydelta1,delta1 WHERE MATCH('MARKER-20260916-1');"
```

Expected result: the `id` from the `metadata` table. Indexer messages are
logged to the journal with the prefix `INDEXER INFO` or `INDEXER ERROR`.

## 9. Search, open and restore

In the web interface, search for the marker. The hit must show date, sender,
recipient, subject and size. Open the message and check that headers, body
and the restore action are visible.

For a real restore test the message must first be gone from the mailbox:

1. Delete the test message from Alice's inbox in grommunio Web (and empty
   *Deleted Items*), or remove it with an IMAP client.
2. Confirm it is gone: search the mailbox in grommunio Web or list the
   folder over IMAP.
3. In Archive, open the message and use *Restore to mailbox*. The interface
   appends the message over IMAP into `INBOX` (sent messages go to `Sent`).
4. Confirm that the message is back in the mailbox with the original headers.

Every restore, view and download is recorded in the audit log
(`ENABLE_AUDIT = 1`), which the auditor can search in the web interface. For
automated acceptance tests, check the mailbox over IMAP rather than through
the browser; it verifies the same folder without UI caching effects.

## 10. Export, attachments and user isolation

- Export: a user can download an opened message as EML and, with
  `BULK_DOWNLOAD_FOR_USERS = 1`, download all hits of a search. PDF export is
  off by default (`ENABLE_PDF_DOWNLOAD = 0`). For bulk exports on the server,
  `pilerexport` selects by date range (`-a`, `-b`), sender or recipient (`-f`,
  `-r`, `-F`, `-R`), a Sphinx match expression (`-w`) and writes EML files,
  optionally into zip archives (`-z`); run `pilerexport` without arguments
  for the option list.
- Attachments: open a message with an attachment; the attachment must be
  listed in the message view and be contained in the exported EML.
- Isolation: search for one of Alice's messages while logged in as Alice
  (hit) and as Bob (no hit). Only `auditor@local` and accounts with the
  auditor role see mail of other users.
- Deletion from the archive through the interface is disabled by default
  (`ENABLE_DELETE = 0`). Messages leave the archive only through retention
  and purge.

## 11. Retention, legal hold and purge

Retention works in two layers:

- `default_retention_days` in `grommunio-archive.conf` (2557 days) is written
  into each message's metadata when it is archived. Changing it affects new
  messages only.
- In the web interface, `admin@local` defines *retention rules* (retention
  period by domain, sender, recipient, subject, size or attachment type),
  *archiving rules* (exclusions that are not archived at all) and *legal
  hold* per address. Legal hold suspends purging for the affected mail.

Expired messages are removed by the daily purge job (`purge.sh` at 03:40 in
the `groarchive` crontab), which runs `pilerpurge.py`. Preview what the next
purge would remove without deleting anything:

```bash
runuser -u groarchive -- /usr/libexec/grommunio-archive/pilerpurge.py --dry-run --verbose
```

Record the retention decisions and the rule set together with the rest of
your compliance documentation; the archive enforces them, but it does not
define them.

## Verification checklist

| Check | How | Expected result |
| --- | --- | --- |
| Packages | `rpm -q grommunio-archive sphinx` | Both installed |
| Services | `systemctl is-active searchd grommunio-archive-smtp grommunio-archive php-fpm nginx postfix` | All `active` |
| Listeners | `ss -ltnp \| grep -E ':2693\|:9306\|:9312'` | 2693 on `127.0.0.1` (or firewalled), 9306 and 9312 on `127.0.0.1` |
| Postfix routing | `postmap -q archive@mail.example.com lmdb:/etc/postfix/transport` | `smtp:[127.0.0.1]:2693` |
| Postfix copy | `postconf always_bcc` or `postmap -q <user> mysql:/etc/postfix/grommunio-bcc-forwards.cf` | Archive address returned |
| Web interface | `curl -kI https://mail.example.com/archive/` | HTTP 200 or redirect to login |
| User privileges | `grommunio-admin user query username pop3_imap privArchive -f username=<user>` | Both `true` |
| Login | Browser login with e-mail address and password | Search page opens |
| Archiving | Test mail, `journalctl -u grommunio-archive` | `status=stored` for the message |
| Database | `mariadb groarchive -e "SELECT COUNT(*) FROM metadata"` | Count increases with each archived message |
| Index | Sphinx `MATCH()` query after `indexer.delta.sh` | `id` of the test message |
| Search and view | Search marker in the web interface, open the hit | Headers, body, attachments and restore action visible |
| Restore | Delete from mailbox, restore from archive | Message back in `INBOX` |
| Isolation | Search as a second user | No hit for the first user's mail |
| Cron | `crontab -l -u groarchive` | Delta, main, purge and cleanup entries present |
| Restart | `systemctl restart searchd grommunio-archive-smtp grommunio-archive` and reboot test | Archiving and search work afterwards |
| Logs | `journalctl -u grommunio-archive -u grommunio-archive-smtp -u searchd --since -1h` | No errors |

## Troubleshooting

| Symptom | Likely cause | What to check / fix |
| --- | --- | --- |
| Login at `/archive/` fails for a grommunio user | POP3/IMAP or Archive privilege missing; IMAP service unreachable or certificate name mismatch | `grommunio-admin user query ... pop3_imap privArchive`; `ss -ltn \| grep 993`; `IMAP_HOST` in `config-site.php` must match the certificate; see [KB: Archive](/kb/archive/) |
| `404` or blank page under `/archive/` | nginx snippet not loaded, PHP-FPM pool not running | `nginx -T \| grep -A3 'location /archive'`; `ls -la /run/php-fpm/php-grommunio-archive-fpm.sock`; `/var/log/nginx/nginx-archive-error.log`; `systemctl restart php-fpm` |
| Postfix logs `connect to 127.0.0.1[127.0.0.1]:2693 ... Connection refused`, archive copies deferred | `grommunio-archive-smtp` not running or `listen_addr`/`listen_port` mismatch | `systemctl status grommunio-archive-smtp`; `ss -ltnp \| grep 2693`; `postqueue -p` or the *Mail queue* page in the Admin UI |
| Message is in `metadata` but the search finds nothing | Delta indexer has not run yet (30-minute interval) or fails | Run `indexer.delta.sh` manually; `journalctl --since -1h \| grep INDEXER`; `searchd` active; `SPHINX_MAIN_INDEX` unchanged |
| No `received:` line in `grommunio-archive-smtp` although Postfix reports `status=sent` to 2693 | Another service answers on 2693 or the copy goes to a different host | `ss -ltnp \| grep 2693`; `postconf transport_maps`; `postmap -q` on the transport map |
| Message not attributed to the recipient (found only by the auditor) | `X-Envelope-To` header missing | `postconf smtpd_recipient_restrictions` contains `check_recipient_access pcre:/etc/postfix/grommunio-archiver-envelope.cf`; `extra_to_field=X-Envelope-To:` in the daemon config |
| Restore does not arrive in the mailbox | `RESTORE_OVER_IMAP`, `IMAP_HOST` or TLS settings wrong; user lacks IMAP privilege | `config-site.php`; `/var/log/nginx/nginx-archive-error.log`; audit log entry for the restore; test an IMAP login for the user |
| Port 2693 reachable from other hosts | Shipped default `listen_addr=0.0.0.0` | Set `listen_addr=127.0.0.1`, restart `grommunio-archive-smtp`, or restrict the port in the host firewall |
| Files accumulate in `/var/lib/grommunio-archive/error` | Messages could not be stored (database down, permissions, disk full) | `journalctl -u grommunio-archive`; `df -h /var/lib/grommunio-archive`; `cat /var/lib/grommunio-archive/stat/error` |
| Archived messages cannot be opened after a restore of the platform | Wrong or missing `grommunio-archive.key` | Restore the key from backup; compare `encrypt_messages` with the value used when the messages were archived |
| Configuration ignored after a package update | New `.dist` template, old values kept in `.rpmsave` | Compare `/etc/grommunio-archive/*.dist` with your files, merge new keys |

## Operating notes

### Backup and restore of the archive platform

Back up the whole set together, consistent with the general procedure in
[Operations](/admin/operations/) and the [backup and restore guide](/guides/backup-restore/):

- Database dump of `groarchive`.
- `/var/lib/grommunio-archive` (message store, Sphinx index files, status
  beacons). The Sphinx indexes can be rebuilt from the database, the store
  cannot.
- `/etc/grommunio-archive` including `grommunio-archive.key`.
- `/etc/sphinx/sphinx.conf`.
- `/etc/postfix` (transport map, `grommunio-archiver-envelope.cf`, `main.cf`).
- `/etc/grommunio-common/nginx` and the PHP-FPM pool if you changed them.

```bash
install -d -m 0700 /var/backups/grommunio-archive
mariadb-dump --single-transaction groarchive | gzip -c > /var/backups/grommunio-archive/groarchive.sql.gz
tar -C / -czf /var/backups/grommunio-archive/archive-config-data.tar.gz \
    etc/grommunio-archive etc/sphinx/sphinx.conf etc/postfix var/lib/grommunio-archive
gzip -t /var/backups/grommunio-archive/groarchive.sql.gz
tar -tzf /var/backups/grommunio-archive/archive-config-data.tar.gz | head
```

The backup contains the encryption key and database passwords; store it with
the same protection as the key itself.

Restore order: stop the three archive services, restore the configuration
and the key, import the database dump, restore `/var/lib/grommunio-archive`,
restore the ownership of `/var/lib/grommunio-archive` to `groarchive` as
declared in `/usr/lib/tmpfiles.d/grommunio-archive.conf`, rebuild the indexes with
`runuser -u groarchive -- indexer --config /etc/sphinx/sphinx.conf --all --rotate`
and start the services. Finish with a search and a restore test.

### Monitoring and logs

Monitor more than an HTTP 200 on `/archive/`:

| What | How |
| --- | --- |
| Services | `systemctl is-active searchd grommunio-archive-smtp grommunio-archive` |
| Listeners | `ss -ltn` for 2693, 9306, 9312 |
| Archive throughput | `mariadb groarchive -e "SELECT COUNT(*) FROM metadata"`; `status=stored` lines in `journalctl -u grommunio-archive` |
| Index freshness | Modification time of `/var/lib/grommunio-archive/stat/indexer` (touched by every indexer run); `INDEXER ERROR` lines in the journal |
| Purge | Modification time of `/var/lib/grommunio-archive/stat/purge` |
| Failed messages | `/var/lib/grommunio-archive/stat/error` (count, updated every 5 minutes) |
| Storage | `du -sh /var/lib/grommunio-archive`; free space on the file system |
| Web interface | `/var/log/nginx/nginx-archive-access.log`, `/var/log/nginx/nginx-archive-error.log` |

Add a synthetic end-to-end check (send, search, restore) to your monitoring
schedule; it is the only test that proves the whole chain.

### Updates

Update with `zypper update` like the rest of the appliance. After an update,
compare your configuration with the new `.dist` templates in
`/etc/grommunio-archive/` and check `crontab -l -u groarchive`, then repeat
the verification checklist.

## Related pages

- [KB: Archive login not possible](/kb/archive/)
- [Administration: users, privileges and e-mail forwards](/admin/administration/)
- [grommunio-admin user](/cli/grommunio-admin/user/)
- [CLI cookbook](/cli/cookbook/)
- [Operations: backup and restore](/admin/operations/)
- [Backup and restore guide](/guides/backup-restore/)
- [Post-installation guide](/guides/post-install/)
- [High availability: Postfix integration](/admin/high-availability/)
- [Container deployment](/admin/container_core/)
- [Kubernetes](/admin/kubernetes/)
- [imap(8gx)](/man/imap-8gx/)
