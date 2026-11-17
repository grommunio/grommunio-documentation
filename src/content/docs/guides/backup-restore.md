---
title: "Backup, disaster recovery and single-mailbox restore"
description: "Build a restorable backup set of a grommunio server, rebuild it on a fresh appliance, and restore one mailbox into the same or a different mailbox."
sidebar:
  label: "Backup & restore"
  order: 90
---

This guide is the procedural complement to the
[Backup & Disaster Recovery](/admin/operations/#backup--disaster-recovery)
section of the operations manual. That section lists the supported snapshot
mechanisms and the backup artefacts of every grommunio component; this page
shows how to turn those artefacts into a **logical backup set**, how to
**rebuild a server from it** on a fresh appliance, and how to **restore a
single mailbox** with the Gromox mailbox transfer tools.

At the end you will have a repeatable backup procedure, a tested full disaster
recovery (DR) runbook, and two verified ways to get a single mailbox back: into
a different mailbox, or into the original one.

## How it fits together

grommunio stores its state in three places that must be captured **together**,
from the same point in time:

| Data | Location | Backup method |
| --- | --- | --- |
| Directory data: domains, users, aliases, groups, roles, settings kept by grommunio-dbconf | MariaDB database `grommunio` (plus `grofiles`, `grochat`, `groarchive` if those components are installed) | `mysqldump` or a MariaDB backup agent |
| Mailbox stores: MAPI object databases (`exmdb/exchange.sqlite3`), IMAP index (`midb.sqlite3`), message content and attachments | `/var/lib/gromox` | File-level backup (`tar`/`rsync`) or filesystem snapshot |
| Configuration and secrets: Gromox daemon configuration and database credentials, Admin API and Admin Web configuration, TLS material, web server and MTA configuration | `/etc/gromox`, `/etc/grommunio*`, `/etc/nginx`, `/etc/postfix`, `/etc/letsencrypt` (if used) | File-level backup |

A mailbox is only usable when its store directory under `/var/lib/gromox` and
its row in the `grommunio` database match, and the daemons can only open the
database when `/etc/gromox/mysql_adaptor.cfg` carries the credentials that the
restored MariaDB instance accepts. Restore all three from the same backup run.

Two backup styles exist, and they complement each other:

- **Consistent snapshot.** A snapshot of the whole VM or of the filesystem
  holding `/var/lib/gromox` and the MariaDB data directory is consistent by
  construction and is the fastest way to roll a server or one mailbox back.
  The supported mechanisms are listed in
  [Backup & Disaster Recovery](/admin/operations/#backup--disaster-recovery);
  the appliance ships [gromox-snapshot(8)](/man/gromox-snapshot-8/) for
  Btrfs/reflink snapshots of the mailbox storage.
- **Logical backup set.** A database dump, a tar archive of the data and
  configuration directories, and optionally per-mailbox exports in the Gromox
  Mailbox Transfer (GXMT) format. A logical set is portable, can be verified
  with checksums, and is the only form that lets you import one mailbox into
  a *different* mailbox.

For the export/import tools used below, the man pages are
[gromox-exm2mt(8)](/man/gromox-exm2mt-8/) (export, an alias of
[gromox-export(8)](/man/gromox-export-8/)) and
[gromox-mt2exm(8)](/man/gromox-mt2exm-8/) (import, an alias of
[gromox-import(8)](/man/gromox-import-8/)). The format itself is described on
the [Mailbox transfer format](/dev/gromox/mtformat/) page.

:::caution[Replication is not backup]
DRBD, storage replication and cluster failover replicate deletions and
corruption faithfully. A [high-availability](/admin/high-availability/) setup
still needs the independent backup described here; see its
[Backup and restore](/admin/high-availability/#backup-and-restore) section for
the additional cluster artefacts (Corosync, Pacemaker CIB, DRBD configuration).
:::

## Prerequisites

- Root shell access on the grommunio server; all commands below run as `root`.
- A backup target outside the server (mounted share, object storage, backup
  server) with enough space for the database dump, the `/var/lib/gromox` tree
  and the configuration archive.
- For a full DR test: a second, freshly installed grommunio Appliance of the
  **same package versions** as the source (compare `rpm -qa` output for the
  `grommunio*`, `gromox*`, `mariadb*`, `nginx`, `postfix` and `redis*`
  packages). Restoring a database dump and SQLite stores across different
  major versions is not covered here.
- For single-mailbox restores: the restore target mailbox exists (see
  [step 4](#4-restore-a-single-mailbox-into-a-different-mailbox)).

Record the versions of the source system with the backup, so that a restore
host can be provisioned to match:

```bash
cat /etc/os-release
grommunio-admin version
rpm -qa | grep -E "^(grommunio|gromox|mariadb|nginx|postfix|redis)" | sort
systemctl --failed
```

## 1. Create a logical backup set

Work in a dedicated directory on the backup target and give every run its own
timestamped subdirectory, so that database dump, file archives, mailbox exports
and checksums of one run stay together.

### 1.1 Dump the databases

Dump all databases in a single consistent transaction, including stored
routines, triggers and events. `--add-drop-database` lets the dump replace the
databases that a fresh appliance already created during setup:

```bash
mysqldump --all-databases --single-transaction --routines --triggers --events --add-drop-database > grommunio-mysql-all.sql
```

This is the same command the operations manual recommends under
[Database backup](/admin/operations/#database-backup). Because the dump
includes the MariaDB system database, it also carries the database accounts
and grants that `/etc/gromox/mysql_adaptor.cfg` and the Admin API
configuration refer to; that is what makes the restore in step 2 work without
re-creating database users.

### 1.2 Archive the mailbox stores and the configuration

Archive `/var/lib/gromox` and the configuration directories. Keep extended
attributes and ACLs, because the appliance relies on group-writable data
directories shared between the `gromox` daemons and the Admin API:

```bash
tar --xattrs --acls -czf gromox-varlib.tar.gz -C /var/lib gromox
tar --xattrs --acls -czf grommunio-etc.tar.gz /etc/grommunio* /etc/gromox /etc/nginx /etc/postfix
```

Add `/etc/letsencrypt` to the second archive if the appliance obtains its
certificates from Let's Encrypt, and `/etc/php8/fpm/php-fpm.d` if you changed
PHP-FPM settings (see the artefact list in
[Backup & Disaster Recovery](/admin/operations/#backup--disaster-recovery)).
If grommunio Files, Chat or Archive are installed, include their data
directories from that list in the same run.

:::note[Consistency of the file archive]
`tar` reads the store files while the daemons keep writing to them. For a
backup that is guaranteed consistent, run the archive step from a filesystem
snapshot (for example a gromox-snapshot subvolume, an LVM or a hypervisor
snapshot) instead of the live directory, or stop the Gromox services for the
duration of the archive as in [step 2.1](#21-stop-the-services). Mailboxes
are transactional SQLite databases, so a `tar` of a live system is usually
recoverable, but a snapshot removes the doubt.
:::

### 1.3 Export mailboxes in GXMT format (optional)

A GXMT export is a logical copy of one mailbox that can later be imported into
*any* mailbox, which the file-level archive cannot do. Export the mailboxes you
may need to restore individually, or all of them from a loop over
`grommunio-admin user query`. The flags matter:

| Flag | Meaning (from [gromox-export(8)](/man/gromox-export-8/)) |
| --- | --- |
| `-u alice@example.com` | Source mailbox. |
| `-a` | Also export Folder Associated Information (FAI, hidden messages such as views and settings). |
| `-r` | Recurse into subfolders (GXMT only). |
| `-s` | Mark objects for **splicing**: on import, objects that came from a well-known folder (Inbox, Sent Items, Calendar, ...) are placed into the *target mailbox's* folder of the same kind instead of a newly created folder tree. |
| `/` | Folder specification; the MAPI root, which covers the whole store. `IPM_SUBTREE` exports only what Outlook and grommunio Web show. |

Create both variants of a full export. The plain export is a faithful archive;
the splice export is the one you import into another mailbox in step 4:

```bash
gromox-exm2mt -u alice@example.com -ar / > alice-full.mt
gromox-exm2mt -u alice@example.com -ars / > alice-full-splice.mt
```

The `-s` flag only changes the placement instructions written to the stream
header; the message content is identical. If you want to keep just one file,
keep the splice export.

### 1.4 Record checksums

Write SHA-256 checksums for the whole set and copy the checksum file together
with the artefacts:

```bash
sha256sum * > SHA256SUMS
```

Verify the set on the restore side with `sha256sum -c SHA256SUMS` before you
change anything on the target. Expected result: every line reports `OK`.

Before moving on, confirm that a GXMT export parses. Without `-u`,
`gromox-mt2exm` only reads the stream and, with `-t`, prints the folder and
message summary to stderr instead of importing anything:

```bash
gromox-mt2exm -t < alice-full-splice.mt
```

## 2. Full disaster recovery onto a fresh appliance

The scenario: the original server is lost. You install a new grommunio
Appliance with the same package versions, do **not** create domains or users
on it, and fill it entirely from the backup set. Copy the backup set to the new
host and verify the checksums first.

### 2.1 Stop the services

Stop everything that reads the database or the mailbox stores, consumers
first, then MariaDB:

```bash
systemctl stop postfix gromox-delivery gromox-delivery-queue gromox-http gromox-zcore gromox-midb gromox-imap gromox-pop3 gromox-event gromox-timer grommunio-admin-api php-fpm nginx
systemctl stop mariadb
```

If additional components run on the host, stop their services as well before
restoring their data, for example `grommunio-antispam`, `grommunio-chat`,
`grommunio-archive` and `grommunio-archive-smtp`. Files and Office run inside
`php-fpm`/`nginx` and stop with them.

### 2.2 Restore the files

Unpack the mailbox stores under `/var/lib` and the configuration archive
relative to `/`, again preserving extended attributes and ACLs:

```bash
tar --xattrs --acls -xzf gromox-varlib.tar.gz -C /var/lib
tar --xattrs --acls -xzf grommunio-etc.tar.gz -C /
```

Restoring `/etc/gromox`, `/etc/grommunio*` and `/etc/nginx` also brings back
the TLS certificate and key referenced by the web server configuration, the
database credentials in `/etc/gromox/mysql_adaptor.cfg`, and the Admin API
configuration. If the new host has a different hostname or IP address, adjust
Postfix and nginx configuration afterwards.

### 2.3 Check ownership and permissions

On the appliance the system users and groups exist with consistent IDs, so a
tar restore normally yields the correct owners. If backup and restore hosts
were built differently, numeric UIDs/GIDs stored in the archive may map to
other names, and the ACLs restored by `--acls` then refer to the wrong
accounts. Check the result before starting any daemon:

```bash
getent passwd gromox
getent group gromox
getent group gromoxcf
namei -l /var/lib/gromox
find /var/lib/gromox -maxdepth 2 -printf '%u:%g %m %p\n' | head -50
ls -la /etc/gromox
```

Expected result: `getent` resolves the system user `gromox` (the Gromox
daemons) and `grommunio` (the Admin API), and the groups `gromox` and
`gromoxcf`; `grommunio` is a member of `gromox`, and `gromoxcf` contains
`gromox` and `grommunio`. `/var/lib/gromox` and everything below it belongs
to user `gromox` (or `grommunio`) and group `gromox`, mode `drwxrwx---`, so
that daemons and Admin API can both write to it. `/etc/gromox` belongs to
group `gromoxcf`; the configuration files inside must be readable by that
group (`pam.cfg` may be world-readable). Compare with `ls -ld /var/lib/gromox`
output recorded on the source system and fix deviations with `chown`/`chmod`
on the affected trees before continuing.

### 2.4 Restore the database

Start MariaDB alone and replay the dump. Because the dump contains
`DROP DATABASE`/`CREATE DATABASE` statements, the empty databases created by
the appliance setup are replaced:

```bash
systemctl start mariadb
mysql < grommunio-mysql-all.sql
```

Restart MariaDB once afterwards so that the restored account and grant tables
are reloaded, then confirm that the credentials from
`/etc/gromox/mysql_adaptor.cfg` work:

```bash
systemctl restart mariadb
mysql --user=grommunio --password --database=grommunio -e "SELECT COUNT(*) FROM users;"
```

Take the username, password and database name from the `mysql_username`,
`mysql_password` and `mysql_dbname` directives in
`/etc/gromox/mysql_adaptor.cfg` ([mysql_adaptor(4gx)](/man/mysql_adaptor-4gx/)).
Expected result: the user count of the source system.

### 2.5 Start the services

Start the stack in dependency order: cache and PHP first, then the Admin API
and web server, the Gromox core daemons, the protocol front ends, and finally
delivery and the MTA:

```bash
systemctl start redis@grommunio php-fpm nginx grommunio-admin-api gromox-event gromox-timer gromox-midb gromox-zcore gromox-http gromox-imap gromox-pop3 gromox-delivery-queue gromox-delivery postfix
systemctl --failed
```

Expected result: `systemctl --failed` lists no units. The same order is used
by the Pacemaker service group in the
[high-availability](/admin/high-availability/#service-start-order-grommunio_svc)
reference architecture.

### 2.6 Verify the restored server

Check from the command line that domains, users and mailbox content are back:

```bash
grommunio-admin domain list
grommunio-admin user list
gromox-mbop -u alice@example.com ping
gromox-exm2mt -u alice@example.com -ar / > alice-after-dr.mt
gromox-mt2exm -t < alice-after-dr.mt
```

Expected result: the domain and user lists match the source system, `ping`
returns without error (the store opened), and the parsed export lists the
folders and messages you expect. Then sign in to the Admin UI at
`https://mail.example.com:8443/` and confirm the users under *Domains* and
*Global users*, and sign in to grommunio Web at `https://mail.example.com/`
(which redirects to `/web/`) as a restored user to see the mailbox content. If Let's Encrypt or a
public-CA certificate was restored, the browser should show no certificate
warning.

## 3. Restore a mailbox from a filesystem snapshot

When the storage under `/var/lib/gromox` is snapshotted (gromox-snapshot, LVM,
ZFS, hypervisor or storage-array snapshots as listed in
[Backup & Disaster Recovery](/admin/operations/#backup--disaster-recovery)),
rolling a single mailbox back is a directory copy. Find the mailbox directory
first:

```bash
grommunio-admin user query -f username=alice@example.com username maildir
```

Then make the information store close the mailbox, replace the directory
contents from the snapshot, and reopen it:

```bash
gromox-mbop -u alice@example.com ( freeze ) ( unload )
```

Copy the mailbox directory from the snapshot over the live directory (for
example with `rsync -HPavS`, as in
[File-based backup](/admin/operations/#file-based-backup)), preserving
ownership, then:

```bash
gromox-mbop -u alice@example.com thaw
systemctl restart gromox-http gromox-midb
```

`freeze` halts new operations on the mailbox, `unload` closes its SQLite
files, and `thaw` lifts the freeze ([gromox-mbop(8)](/man/gromox-mbop-8/)).
The restart of `gromox-http` and `gromox-midb` invalidates runtime caches, as
the operations manual advises after a snapshot restore. `unload` fails while a
client still holds a notification channel on the mailbox; make sure the user
is signed out of Outlook, grommunio Web and mobile devices before you start.
Restoring a store directory into a *different* mailbox's directory is not
supported by this method: store identity is embedded in the SQLite database.
Use the GXMT import in step 4 for that.

## 4. Restore a single mailbox into a different mailbox

Use this when a user needs old content next to the current mailbox, when a
departed user's mailbox has to be handed to a colleague, or when you want to
inspect a backup without touching production data. The source is the splice
export from [step 1.3](#13-export-mailboxes-in-gxmt-format-optional).

### 4.1 Create the target mailbox

The target can be an existing mailbox or a new one. Create a new one with the
CLI ([grommunio-admin user](/cli/grommunio-admin/user/),
[grommunio-admin passwd](/cli/grommunio-admin/passwd/)) or in the Admin UI:

```bash
grommunio-admin user create restore-alice@example.com
grommunio-admin passwd restore-alice@example.com
```

### 4.2 Import the splice export

Import the stream into the target. `gromox-mt2exm` reads GXMT from standard
input and needs only the target mailbox:

```bash
gromox-mt2exm -u restore-alice@example.com < alice-full-splice.mt
systemctl restart gromox-http gromox-midb gromox-zcore
```

Add `-t` to print each folder and message as it is processed, and `-c` to
continue after an error on a single message instead of aborting; both are
documented in [gromox-import(8)](/man/gromox-import-8/).

Restart `gromox-http`, `gromox-midb` and `gromox-zcore` after the import: the
import tools write to the store through the information store engine, but the
IMAP index (`midb`) and the grommunio Web/PHP-MAPI layer (`zcore`) keep their
own runtime state that must be refreshed before the imported items appear
everywhere. The source mailbox is untouched by the import.

### 4.3 Why the export must carry `-s`

The GXMT stream header contains a **folder map** that tells the importer where
to put each exported folder:

- With `-s`, every well-known folder of the source store (root, IPM subtree,
  Inbox, Sent Items, Deleted Items, Calendar, Contacts, and so on) is mapped
  onto the target store's folder of the same kind. Nothing is created for
  them; their messages go straight into the target's Inbox, Sent Items, etc.
  User-created subfolders are created below the mapped parent, and a subfolder
  whose name already exists at that place is reused. The result is a normal
  mailbox layout with the restored items merged in.
- Without `-s`, the map is empty and the exported root folder is "unanchored".
  The importer places unanchored objects in the anchor folder given with
  `-B`, which defaults to **Drafts** for private stores. Exporting `/` and
  importing without `-s` therefore recreates the *entire* source hierarchy
  (root, IPM subtree, Inbox, ...) as a new folder tree underneath Drafts: the
  content arrives, but as a nested copy of the whole store rather than in the
  user's real folders. Without `-s` the importer also refuses to create a
  folder that already exists at the anchor unless `-x` is given.

Both behaviours are described in the option lists of
[gromox-export(8)](/man/gromox-export-8/) (`-s`) and
[gromox-import(8)](/man/gromox-import-8/) (`-B`, `-x`). For a restore that
should look like the original mailbox, always export with `-ars /` and import
without `-B`.

:::note[No duplicate detection]
`gromox-mt2exm` does not check whether a message already exists in the target.
Every message in the stream becomes a new message. Importing the same stream
twice, or importing into a mailbox that already holds the same items, produces
duplicates.
:::

### 4.4 Verify

Sign in to grommunio Web as the target user and confirm that the restored
messages sit in Inbox, Sent Items and the user-created folders, not under
Drafts. From the shell, export the target and compare the folder and message
summary with the source export:

```bash
gromox-exm2mt -u restore-alice@example.com -ar / > restore-alice-check.mt
gromox-mt2exm -t < restore-alice-check.mt
```

## 5. Restore a single mailbox into the original mailbox

Two options exist, depending on whether the mailbox should be rolled back as a
whole or specific content re-imported.

### Option A: roll the store back from a snapshot or file backup

Follow [step 3](#3-restore-a-mailbox-from-a-filesystem-snapshot) with the
mailbox directory from the snapshot or from the `gromox-varlib.tar.gz`
archive. This replaces the whole store, including folder structure, IMAP
index and all settings stored in the mailbox, with the backed-up state.
Content created after the backup is lost.

### Option B: clear the mailbox and re-import the splice export

Importing a splice export into the original mailbox merges the backup into
whatever is there and, because there is no duplicate detection, doubles every
message that still exists. To avoid that, empty the mailbox first with
[gromox-mbop(8)](/man/gromox-mbop-8/) `emptyfld`, then import:

```bash
gromox-mbop -u alice@example.com emptyfld -R -a IPM_SUBTREE
gromox-mbop -u alice@example.com purge-datafiles
gromox-mt2exm -u alice@example.com < alice-full-splice.mt
systemctl restart gromox-http gromox-midb gromox-zcore
```

`emptyfld -R` hard-deletes the messages of `IPM_SUBTREE` and, recursively,
of every folder below it; `-a` includes the FAI messages that the `-a` export
captured, so that view settings are not duplicated either. The folders
themselves stay in place, which is what the splice import expects: well-known
folders are reused, and user-created folders with matching names are reused
as well. `purge-datafiles` removes the attachment and content files that the
deleted messages referenced. Do not add `--nuke-folders`: it would delete the
well-known folders below `IPM_SUBTREE`.

:::danger
`emptyfld -R` without `--soft` is a hard deletion that cannot be undone from
within the mailbox. Make sure the splice export you are about to import is
complete (`gromox-mt2exm -t < file.mt`) and its checksum matches before you
clear the mailbox. Have the user sign out of all clients first.
:::

Option B keeps only what was in the export; items stored outside `IPM_SUBTREE`
(search folders, shortcuts, grommunio-sync states) are neither deleted nor
re-imported by this sequence. Clients that hold cached copies (Outlook Cached
Mode, mobile devices) should be resynchronised afterwards; for ActiveSync
devices use `grommunio-admin user devices alice@example.com resync`.

## Verification checklist

| Area | Check | Expected result |
| --- | --- | --- |
| Backup set | `ls` of the run directory | Database dump, `gromox-varlib.tar.gz`, `grommunio-etc.tar.gz`, GXMT exports and `SHA256SUMS` are present and non-empty |
| Integrity | `sha256sum -c SHA256SUMS` on the restore host | Every artefact reports `OK` |
| Export validity | `gromox-mt2exm -t < file.mt` | Folder and message summary is printed, no error, exit status 0 |
| Full DR: services | `systemctl --failed` after step 2.5 | No failed units |
| Full DR: directory | `grommunio-admin domain list`, `grommunio-admin user list` | Same domains and users as the source |
| Full DR: mailboxes | `gromox-mbop -u <user> ping`, export and `-t` parse | Store opens; folders and messages match the source export |
| Full DR: web | Admin UI at `https://<FQDN>:8443/`, grommunio Web at `https://<FQDN>/` | Users visible in the Admin UI; a restored user sees mail in grommunio Web; no certificate warning |
| Ownership | `namei -l /var/lib/gromox`, `ls -la /etc/gromox` | Owners and groups as in step 2.3 |
| Single-mailbox restore | Sign in as the target user | Restored items in Inbox, Sent Items and the original subfolders; nothing nested under Drafts |
| Source untouched | Export the source mailbox again | Unchanged folder and message summary |
| Secret handling | Review backup location and shell history | Backup set readable only by the backup operator; no credentials left in shell history or documentation |

## Troubleshooting

| Symptom | Likely cause | What to check/fix |
| --- | --- | --- |
| Imported mail appears as a folder tree underneath Drafts | Export was made without `-s`; unanchored root landed in the `-B` default folder | Re-export with `gromox-exm2mt -u <user> -ars /`, delete the nested tree in the target, import again |
| `gromox-mt2exm` aborts with a "folder already exists" error | Non-splice import into a mailbox that already has that folder | Use a splice export, or add `-x` to reuse existing folders |
| `Cannot satisfy splice request` | Splice export from a private store imported into a public store or vice versa | Choose a target of the same store type (`-u user@domain` for private, `-u @domain` for public) |
| Every message exists twice after an import | Stream imported twice or imported into a mailbox that still held the items | There is no duplicate detection; clear the mailbox first (step 5, option B) or import into an empty target |
| Gromox daemons fail to start after DR; logs show MariaDB access denied | Restored `/etc/gromox/mysql_adaptor.cfg` and the restored `mysql` system database disagree, or MariaDB was not restarted after the import | Restart `mariadb`, then test the credentials from `mysql_adaptor.cfg` with the `mysql` client as in step 2.4 |
| Admin UI shows no domains after DR | Dump restored before the appliance's own empty database was dropped, or the wrong dump file used | Re-run `mysql < grommunio-mysql-all.sql` (the dump carries `--add-drop-database`), check `SELECT COUNT(*) FROM domains;` |
| Mailbox cannot be opened; "permission denied" in the `gromox-http` log | UID/GID mismatch after the tar restore | Compare `getent passwd gromox` on source and target, fix owners with `chown -R` per step 2.3 |
| `gromox-mbop ... unload` fails | A client still holds a notification channel on the mailbox | Sign the user out of all clients (or stop `gromox-http`), retry |
| IMAP clients or grommunio Web do not show imported items | `midb`/`zcore` still hold pre-import state | `systemctl restart gromox-http gromox-midb gromox-zcore` |
| `mysqldump` fails with access denied | Run from an account without MariaDB root access | Run as `root` on the appliance, or pass `--user`/`--password` of a MariaDB account with full read access |
| Restored mailbox reports inconsistencies | Store files copied while the source was writing | Run `gromox-mbck` on the store ([gromox-mbck(8)](/man/gromox-mbck-8/)); take future file backups from a snapshot |

## Operating notes

- **Test restores, not backups.** Schedule a full DR rehearsal onto a
  throw-away appliance and a single-mailbox restore into a test mailbox at a
  fixed interval, and record the elapsed time against your recovery time
  objective.
- **Keep secrets out of the shell history.** Use `mysql --password` (prompt)
  rather than `--password=<value>`, or a client options file with restrictive
  permissions. The configuration archive contains database credentials and
  TLS private keys: encrypt the backup set at rest and restrict access to it
  as tightly as to the server itself.
- **Store checksums separately.** Keep `SHA256SUMS` (or a signed copy) with
  the backup catalogue as well as next to the artefacts, so that a tampered or
  truncated artefact is noticed before a restore depends on it.
- **Version pinning.** Record the package list of every backup run. A restore
  host must match the MariaDB and Gromox versions of the dump and store files,
  or be upgraded from that version by the normal update path afterwards.
- **Snapshots plus logical backups.** Use snapshots for fast rollback of the
  server or of a whole mailbox; keep a logical set for portability and
  cross-mailbox restores. `gromox-snapshot.timer` runs hourly once enabled
  (`systemctl enable --now gromox-snapshot.timer`); retention is set in
  `/etc/gromox/snapshot.cfg`, which you create if it does not exist
  ([gromox-snapshot(8)](/man/gromox-snapshot-8/)).
- **Other components.** grommunio Files, Chat, Archive and Antispam keep their
  own databases and data directories; include them in the same backup run as
  listed in [Backup & Disaster Recovery](/admin/operations/#backup--disaster-recovery).

## Container and Kubernetes deployments

The procedures on this page assume a package installation. In container
deployments the same state lives in volumes; the backup procedure depends on
the deployment method:

- **Docker Compose:** back up the database, data and configuration volumes
  as described in
  [Container installation: Backup](/admin/container_core/#backup).
- **Kubernetes (Helm chart):** back up the persistent volume claims, the
  chart Secrets and the archive encryption key. For database dumps, enable the
  chart's backup CronJob (`backup.enabled`). The full list of items and the
  restore procedure are in [Kubernetes](/admin/kubernetes/).

The mailbox-level tools used on this page (`gromox-export`, `gromox-import`,
`gromox-mbop`) run inside the core container, for example with
`docker exec gromox-core ...` or
`kubectl -n grommunio exec grommunio-core-0 -- ...` (release and namespace `grommunio`).

## Related pages

- [Container installation](/admin/container_core/)
- [Kubernetes](/admin/kubernetes/)
- [Operations: Backup & Disaster Recovery](/admin/operations/#backup--disaster-recovery)
- [High availability: Backup and restore](/admin/high-availability/#backup-and-restore)
- [Common administration tasks](/cli/cookbook/)
- [Gromox CLI utilities](/cli/gromox-tools/)
- [grommunio-admin user](/cli/grommunio-admin/user/)
- [gromox-export(8)](/man/gromox-export-8/) / [gromox-exm2mt(8)](/man/gromox-exm2mt-8/)
- [gromox-import(8)](/man/gromox-import-8/) / [gromox-mt2exm(8)](/man/gromox-mt2exm-8/)
- [gromox-mbop(8)](/man/gromox-mbop-8/)
- [gromox-snapshot(8)](/man/gromox-snapshot-8/)
- [Mailbox transfer format](/dev/gromox/mtformat/)
- [Database check (SQLite recovery)](/kb/sqlite/)
- [Migration overview](/migration/)
