---
title: "Post-installation checklist"
description: "Verify a freshly set-up grommunio appliance, create the first domain and user, publish the DNS records and confirm that mail flows end to end."
sidebar:
  order: 10
---

When `grommunio-setup` finishes, the appliance is configured but empty: no mail domain, no user, no DNS records that other mail servers could trust. This page covers everything between that point and a system that delivers mail reliably in both directions. Work through the numbered steps in order; each one ends with a check you should pass before moving on.

The installation itself is documented elsewhere and is not repeated here: downloading the ISO and sizing the machine in the [Quickstart](/admin/quickstart/), the console user interface and every dialog of the setup wizard in [Guided Installation](/admin/installation/). If the wizard did not complete, fix that first (the log is `/var/log/grommunio-setup.log`).

## How it fits together

A grommunio appliance is a set of cooperating services. After setup, all of them should be running; the checks in this guide follow the path a message takes through them.

| Unit | Role | Listens on |
| --- | --- | --- |
| `nginx` | Reverse proxy for grommunio Web, Admin UI, AutoDiscover, EAS, DAV; TLS termination | 80, 443, 8080/8443 (Admin) |
| `postfix` | MTA: receives mail from the Internet and from clients, hands it to the antispam milter and to local delivery | 25, 587 (465 where implicit-TLS submission is enabled) |
| `grommunio-antispam` | Rspamd-based filter: spam scoring, DKIM signing, optional anti-virus | 11332 (milter), 11334 (controller), local only |
| `gromox-delivery-queue`, `gromox-delivery` | Local delivery: receive from Postfix, convert to MAPI objects, store in the mailbox | 24 (LMTP/SMTP), local only |
| `gromox-http` | MAPI/HTTP, RPC over HTTP, EWS, AutoDiscover backend behind nginx | local only |
| `gromox-imap`, `gromox-pop3` | IMAP and POP3 access | 143/993, 110/995 |
| `gromox-midb`, `gromox-zcore`, `gromox-event`, `gromox-timer` | Message index, PHP-MAPI core, event bus, scheduled tasks | local only |
| `grommunio-admin-api` | Admin REST API behind nginx (Admin UI, `grommunio-admin` CLI) | via nginx |
| `mariadb`, `redis@grommunio`, `php-fpm`, `saslauthd` | Database, cache, PHP runtime for Web/Sync/DAV, SMTP authentication | local only |

The public ports and the firewall defaults are listed in the [Quickstart](/admin/quickstart/#firewall); the complete mail flow is described in [Architecture](/admin/architecture/).

## Prerequisites

- `grommunio-setup` has completed; you know the FQDN (for example `mail.example.com`) and the primary mail domain (`example.com`) you entered, and the `admin` password.
- Root access to the appliance (console or SSH).
- Control over the public DNS zone of the mail domain and over the reverse DNS (PTR) of the public IP address, usually via the hosting provider.
- Inbound TCP 25 and 443 reachable from the Internet on the public IP; TCP 80 if you use Let's Encrypt.
- An external mailbox (another provider) to test delivery in both directions.

## 1. Check services, ports and repositories

A loaded web page does not prove that the mail path works. Verify the service set, the listening sockets and the package repositories before creating anything.

```bash
systemctl --failed
systemctl --type=service --state=running | grep -E 'gromox|grommunio|postfix|nginx|mariadb|redis|saslauthd|php-fpm'
ss -tulpn
hostname -f
timedatectl
getent hosts download.grommunio.com
zypper lr -u
zypper refresh
zypper list-patches
```

Expected results:

- `systemctl --failed` lists no units.
- The running services include `grommunio-admin-api`, `grommunio-antispam`, the `gromox-*` daemons from the table above, `mariadb`, `nginx`, `php-fpm`, `postfix`, `redis@grommunio` and `saslauthd`.
- `ss -tulpn` shows listeners on 25, 80, 443, 587, 110, 143, 993, 995 and on the Admin ports 8080 (HTTP) and 8443 (HTTPS). Internal listeners on 24 (`delivery-queue`), 11332/11334 (`rspamd`), 3306 (`mysqld`) and 6379 (`redis-server`) are bound to localhost only.
- `hostname -f` returns the FQDN, not `localhost` or a short name; `timedatectl` reports a synchronised clock and the intended time zone.
- `getent hosts download.grommunio.com` resolves and `zypper refresh` succeeds. If it does not, fix the resolver first: a broken resolver is the most common reason for failing repository access and, later, for failing outbound mail. On the appliance, `/etc/resolv.conf` is written by the CUI from the DNS servers entered in the network dialog; name servers handed out by DHCP are not used. Hostname, resolver and time settings are changed through the CUI, see [Guided Installation](/admin/installation/#grommunio-appliance-configuration-with-cuisetup).

The appliance ships with `firewalld`, and `grommunio-setup` opens the service ports listed in the [Quickstart](/admin/quickstart/#firewall) in the `public` zone. Confirm the rule set and close what you do not offer:

```bash
systemctl is-active firewalld
firewall-cmd --list-all
```

Expected result: the services and ports from the Quickstart list, nothing more. Remove the entries for protocols you do not provide (for example POP3) and, on systems without a host firewall (`firewalld` not installed or inactive), restrict the Admin ports and unused services on the perimeter firewall or the hypervisor instead.

## 2. Open the Admin UI and grommunio Web

Open the Admin UI at `https://<FQDN>:8443/` and sign in as `admin`. The Admin UI is served on its own ports, not below the `/web/` path of grommunio Web. On the appliance, grommunio-setup enables TLS for the Admin UI on 8443 with the certificate chosen during setup. If the page does not load on 8443 (for example on a manual installation), the Admin API is served unencrypted on port 8080 only; switch it to TLS as described in [Admin API TLS configuration](/admin/operations/#admin-api-tls-configuration) before exposing it anywhere.

On the [Dashboard](/admin/administration/#dashboard), the services panel must show all grommunio and Gromox services as running, and the versions panel lists the installed components. Then open grommunio Web at `https://<FQDN>/web/`; the login page must load over HTTPS without an error other than the expected certificate warning if you chose a self-signed certificate.

Two housekeeping tasks belong here:

- The setup log `/var/log/grommunio-setup.log` contains generated credentials. Copy it to a safe place and remove it from the appliance, or at least restrict access to it.
- Change the `admin` password if you kept the generated one: `grommunio-admin passwd` (no user argument sets the password of `admin`). The `admin` account and the system `root` account are independent; see [grommunio Admin User](/admin/quickstart/#grommunio-admin-user).

## 3. Create the first domain and user

The wizard records the primary mail domain but does not create it as a mail domain. Create the domain, then a first user. Both can be done in the Admin UI ([Adding a domain](/admin/administration/#adding-a-domain), [Adding a user](/admin/administration/#adding-a-user)) or on the command line. The CLI is reproducible and easy to script, so it is used here.

```bash
grommunio-admin domain create -u 25 --title "Example Inc." example.com
grommunio-admin user create --lang en_US --pop3-imap true --privWeb true --smtp true alice@example.com
grommunio-admin passwd alice@example.com
grommunio-admin user query username maildir pop3_imap smtp privWeb status
```

- `-u` sets the maximum number of users of the domain and is required. Add `--create-role` if you want a domain administrator role created together with the domain.
- The domain of the user is taken from the address; the domain must exist. `--privWeb`, `--smtp` and `--pop3-imap` grant login to grommunio Web, sending via SMTP and IMAP/POP3 access. Defaults for these flags can be preset in the Admin UI under *Defaults*.
- `grommunio-admin passwd` prompts for the password; `-a` generates one.

Expected result: the query lists the user with a `maildir` path below `/var/lib/gromox/user/` and status `normal` (`0`). Confirm the credentials without a browser:

```bash
grommunio-admin user login alice@example.com
```

Further recipes, including aliases, feature switches and bulk operations, are in [Common administration tasks](/cli/cookbook/); the complete option lists are in [grommunio-admin domain](/cli/grommunio-admin/domain/) and [grommunio-admin user](/cli/grommunio-admin/user/).

## 4. Web login and a local test mail

Sign in to `https://<FQDN>/web/` as `alice@example.com`. An empty Inbox and a working calendar view confirm that the mailbox store, `gromox-zcore` and PHP are functional.

Next, inject a message on the server itself. This exercises Postfix, the antispam milter and the Gromox local delivery path without depending on DNS or the Internet:

```bash
printf 'From: alice@example.com\nTo: alice@example.com\nSubject: Local delivery test\n\nThis message was injected locally.\n' | sendmail alice@example.com
postqueue -p
gromox-mailq
journalctl -u postfix -u gromox-delivery -u gromox-delivery-queue --since "10 minutes ago"
```

Expected result: the message appears in the Inbox in grommunio Web within seconds, both queues are empty and the journal shows Postfix handing the message to the local transport on port 24 and `gromox-delivery` storing it. A message that stays in the queue points to a problem in the local chain; see [Troubleshooting](#troubleshooting) below and [Mail requeueing](/admin/operations/#mail-requeueing).

The same queues are visible in the Admin UI under [Mail queue](/admin/administration/#mail-queue), together with flush, requeue and delete actions.

## 5. Publish the DNS records

A server can run perfectly and still be unable to exchange mail with the rest of the Internet. Receiving mail requires an MX record; being accepted by other servers requires a matching forward and reverse name, SPF, DKIM and DMARC; Outlook, mobile devices and other clients find the server through AutoDiscover. Publish the following records in the public zone of `example.com`, replacing the example IP address:

| Record | Name | Value (example) | Purpose |
| --- | --- | --- | --- |
| A / AAAA | `mail.example.com` | public IPv4 / IPv6 of the appliance | Name of the server; must match the certificate and the HELO name |
| MX | `example.com` | `10 mail.example.com` | Inbound delivery |
| PTR | reverse of the public IP | `mail.example.com` | Reverse DNS; set at the hosting provider; must resolve back to the same IP |
| A / AAAA or CNAME | `autodiscover.example.com` | `mail.example.com` | AutoDiscover for Outlook, EAS devices and other clients |
| SRV (optional) | `_autodiscover._tcp.example.com` | `0 0 443 mail.example.com` | AutoDiscover for clients that use the SRV method |
| TXT | `example.com` | `v=spf1 a mx -all` | SPF: only hosts in the A and MX records may send for the domain |
| TXT | `dkim._domainkey.example.com` | `v=DKIM1; k=rsa; p=<public key>` | DKIM public key; generated in step 6 |
| TXT | `_dmarc.example.com` | `v=DMARC1; p=none; rua=mailto:dmarc@example.com` | DMARC policy and aggregate reports |

Notes on the values:

- The certificate must cover every name clients connect to, at least `mail.example.com` and `autodiscover.example.com`. If you chose Let's Encrypt in the wizard, both names must point to the appliance before the certificate can be issued; see [TLS configuration](/admin/installation/#tls-configuration) and [Certificate management](/admin/operations/#certificate-management).
- The SPF value above is the one the Admin UI proposes. If outbound mail leaves through a relayhost or a third-party service, add that sender with an `include:` or `ip4:` mechanism, otherwise your own mail fails SPF. Use `~all` (softfail) while you are still validating, then move to `-all`.
- Start DMARC with `p=none`: receivers report but do not act, and the aggregate reports sent to the `rua` address tell you whether SPF and DKIM align for all legitimate mail. Tighten to `p=quarantine` and finally `p=reject` once the reports are clean for a while. The `rua` mailbox must exist; create it as a user or alias.
- The Admin UI additionally checks `autoconfig.example.com` (Thunderbird-style Mail Autoconfig) and SRV records for `_submission`, `_imaps`, `_pop3s`, `_caldavs` and `_carddavs`. They are optional; add them if you want clients to auto-configure without AutoDiscover. See [autoconfig(7)](/man/autoconfig-7/) and [autodiscover(7)](/man/autodiscover-7/).
- Split-horizon setups must publish the `autodiscover` record in the public view as well; see the [AutoDiscover KB article](/kb/autodiscover/).

Verify from outside the appliance's own network where possible, because your internal resolver may answer differently from the Internet:

```bash
dig +short MX example.com
dig +short A mail.example.com
dig +short -x 203.0.113.10
dig +short TXT example.com
dig +short TXT _dmarc.example.com
dig +short SRV _autodiscover._tcp.example.com
```

The Admin UI performs the same checks: open *Domains*, select the domain and look at the DNS health section. Each record is queried through the local resolver and through an external resolver, and the reachability check compares the server's detected public IP with the MX target. A new domain shows most items as missing; after publishing, every item you configured should turn green. DNS changes take up to the zone's TTL to propagate.

## 6. Create the DKIM key pair

DKIM signing is done by `grommunio-antispam`; the key pair is generated per domain from the Admin UI, which also hands you the DNS record to publish.

1. In the Admin UI, open *Domains*, select `example.com` and open the DKIM entry in the DNS health section. On a new domain, the dialog reports that the record `dkim._domainkey.example.com` is not resolvable and shows a placeholder for the public key.
2. Click *Generate DKIM keypair*. Keep *Type* `rsa` (`ed25519` is offered, but not every receiver verifies it) and *Output mode* `dns` for a standard TXT record. Leave *Selector* empty to use the default selector `dkim`; if you set another selector, the record name changes accordingly.
3. Click *Generate*. The dialog now shows the TXT record for DNS and a list of commands to run on the server.

On the server, the private key is written to `/var/lib/grommunio-admin-api/example.com.dkim.key` (owner `grommunio`, mode 0440; the public key is stored alongside with the suffix `.pub`, and a previous key pair is kept with the suffix `.old`). Publish only the TXT record; the private key never leaves the server.

The Admin API cannot write into the antispam data directory, so the key must be made available to `grommunio-antispam` manually. Run the commands shown in the dialog, which correspond to the following (replace `example.com`):

```bash
postconf -e 'non_smtpd_milters = $smtpd_milters'
mkdir -m 0700 /var/lib/grommunio-antispam/dkim
cp /var/lib/grommunio-admin-api/example.com.dkim.key /var/lib/grommunio-antispam/dkim/
chown -Rf groas:grommunio /var/lib/grommunio-antispam/dkim
chmod 600 /var/lib/grommunio-antispam/dkim/example.com.dkim.key
systemctl restart postfix
```

- `smtpd_milters` already points to `inet:localhost:11332`, but `non_smtpd_milters` is empty by default. Setting it passes mail that enters Postfix locally (the `sendmail` command, bounces, notifications) through the same milter as SMTP mail, so that it is signed as well.
- `grommunio-antispam` runs as user `groas` in group `grommunio`; the key must be readable by that user and by nobody else. If the package already created `/var/lib/grommunio-antispam/dkim`, `mkdir` reports that the directory exists; continue with the next command.
- The signing configuration in `/etc/grommunio-antispam/local.d/dkim_signing.conf` looks for the key at `/var/lib/grommunio-antispam/dkim/$domain.$selector.key` with the selector `dkim`, which is exactly the file name the Admin UI produces. If you chose a different selector in the dialog, rename the copied key to `example.com.<selector>.key` and change `selector` in that file accordingly. The default configuration signs mail from authenticated clients and from local senders.
- Repeat the copy for every additional domain you create; the directory only needs to be created once.

Check the result by sending a message from grommunio Web to an external mailbox and inspecting its headers there: a `DKIM-Signature:` header with `d=example.com; s=dkim` must be present and the receiver's `Authentication-Results:` header must report `dkim=pass`. A locally delivered message does not prove signing, because it never passes an external verifier.

:::caution
Keys under `/var/lib/grommunio-admin-api/` and `/var/lib/grommunio-antispam/dkim/` are part of the configuration and must be included in the backup. Generating a new key pair for a domain replaces the record you have to publish; rotate the DNS record together with the key.
:::

## 7. End-to-end send and receive test

With DNS and DKIM in place, test the complete path in both directions against a real external mailbox.

Outbound:

1. In grommunio Web, send a message from `alice@example.com` to the external mailbox.
2. `postqueue -p` on the appliance must return an empty queue within a few seconds; `journalctl -u postfix --since "5 minutes ago"` must show `status=sent` for the recipient's MX.
3. At the receiver, open the headers. `Authentication-Results:` should show `spf=pass`, `dkim=pass` and `dmarc=pass`, and the message must not land in the spam folder.

Inbound:

1. Reply from the external mailbox to `alice@example.com`.
2. `journalctl -u postfix -u gromox-delivery --since "5 minutes ago"` must show the connection from the remote MX, the milter verdict and the local delivery.
3. The reply appears in the Inbox in grommunio Web; the antispam headers added by `grommunio-antispam` are visible in the message source.

Client access:

```bash
PASS='<strong-password>' gromox-dscli -e alice@example.com
openssl s_client -connect mail.example.com:993 -servername mail.example.com </dev/null
```

`gromox-dscli` performs the AutoDiscover lookup the way a client does and prints the resulting configuration ([gromox-dscli(8)](/man/gromox-dscli-8/)); the `openssl` call shows the certificate chain presented on IMAPS, which must be trusted by your clients and cover the name they connect to. For Outlook specifics, see the [Outlook KB article](/kb/outlook/).

Finally, confirm from a network you do not control (a mobile connection, a remote host) that the server is not an open relay: connecting to port 25 and issuing `RCPT TO` for a foreign domain without authentication must be rejected with `554 5.7.1 Relay access denied`. A test from inside your own network says nothing about this.

## 8. Updates, backup and mailbox maintenance

### Updates

Treat the appliance like any production Linux mail server: refresh, review, patch in a maintenance window, then re-check the services.

```bash
zypper refresh
zypper list-patches
zypper patch
zypper ps -s
systemctl --failed
gromox-mailq
```

`zypper ps -s` lists services that still run old binaries after an update and should be restarted. Updates can also be triggered from the Admin UI ([Updates tab](/admin/administration/#updates)). Repository types, subscription channels and the full procedure are in [Updating grommunio](/admin/operations/#updating-grommunio); the reasoning behind the release cadence is in [Update Cycle](/kb/update_cycle/).

### Backup

Define the backup before the first real mailbox arrives. The artefacts are the mailbox stores under `/var/lib/gromox/user/` and `/var/lib/gromox/domain/`, the MariaDB database `grommunio`, `/etc/grommunio*`, the certificates and, from step 6, the DKIM keys. Snapshot-based and file-based approaches are described in [Backup & Disaster Recovery](/admin/operations/#backup--disaster-recovery); a complete restore procedure including single-mailbox recovery is in [Backup and restore](/guides/backup-restore/). Test the restore, not just the backup.

### Mailbox maintenance with gromox-cleaner

Gromox ships `gromox-cleaner.timer` and the one-shot `gromox-cleaner.service`. The service runs `gromox-mbop` over every local mailbox, hard-deletes messages that have been soft-deleted for longer than the retention period, and removes attachment files that are no longer referenced by any message ([gromox-cleaner.service(8)](/man/gromox-cleaner-service-8/)). Soft-deleted means the message is flagged as deleted and recoverable by the client until it is purged; the cleaner is what finally frees the space. It is not a backup, not an archive and does not empty the Deleted Items folder by itself.

The retention is taken from `softdelete_purgetime` in `/etc/gromox/gromox.cfg`; if the directive is not set, the unit falls back to `30d`. The timer runs daily, but it is not enabled after installation.

```bash
systemctl cat gromox-cleaner.service
systemctl status gromox-cleaner.timer
systemctl list-timers --all | grep gromox-cleaner
```

Once retention, backup and any archiving requirements are agreed, enable the timer and run one pass by hand:

```bash
systemctl enable --now gromox-cleaner.timer
systemctl start gromox-cleaner.service
journalctl -u gromox-cleaner.service --since "10 minutes ago"
```

Expected result: the service exits successfully and logs the mailboxes it processed; on a fresh system there is nothing to purge. The service requires `gromox-http` to be running. To also empty the Deleted Items folder of all users after a set time, extend the unit as shown in [Mailbox maintenance](/kb/mailbox_maint/).

## Verification checklist

| Area | Check | Expected result |
| --- | --- | --- |
| Services | `systemctl --failed`; services panel on the Dashboard | No failed units; all grommunio and Gromox services running |
| Network | `ss -tulpn`; perimeter firewall rules | Listeners on 25, 80, 443, 587, 110/995, 143/993 and the Admin ports; only intended ports reachable from outside |
| Name resolution and time | `hostname -f`, `getent hosts download.grommunio.com`, `timedatectl` | FQDN returned; external names resolve; clock synchronised |
| Repositories | `zypper refresh`, `zypper list-patches` | Refresh succeeds; patch list is known and applied in a maintenance window |
| Admin UI | `https://<FQDN>:8443/` | Login as `admin` works over TLS; Dashboard shows versions and services |
| grommunio Web | `https://<FQDN>/web/` | Login as the test user works; Inbox and calendar open |
| Domain and user | `grommunio-admin domain list`, `grommunio-admin user query ...`, `grommunio-admin user login` | Domain active; user has a maildir, status `normal`, login succeeds |
| Local delivery | `sendmail` test, `postqueue -p`, `gromox-mailq` | Message in Inbox; both queues empty |
| DNS | `dig` checks; DNS health in the Admin UI | MX, A/AAAA, PTR, autodiscover, SPF, DKIM and DMARC resolve externally and match |
| TLS | Browser, `openssl s_client` on 443 and 993 | Trusted chain; certificate covers `mail.` and `autodiscover.` names |
| DKIM | Headers of a message received externally | `DKIM-Signature` present, `dkim=pass` |
| Outbound delivery | Message to an external mailbox | Delivered to Inbox; `spf=pass`, `dkim=pass`, `dmarc=pass` |
| Inbound delivery | Reply from the external mailbox | Delivered to the user's Inbox; logged by Postfix and `gromox-delivery` |
| Relay | `RCPT TO` a foreign domain from outside, unauthenticated | Rejected with `Relay access denied` |
| AutoDiscover | `gromox-dscli -e alice@example.com` | Configuration returned for the mailbox |
| Reboot | `systemctl reboot`, then repeat the service and login checks | All services return; Web and Admin UI reachable |
| Maintenance | `systemctl list-timers` | `gromox-cleaner.timer` and, with Let's Encrypt, `grommunio-certbot-renew.timer` scheduled |
| Backup | Documented procedure, first run completed | Mail stores, database, `/etc/grommunio*`, certificates and DKIM keys covered; restore tested |

## Troubleshooting

Work from the symptom to the cause: check the service state, read the relevant journal, verify the URL or DNS name, and only then change configuration. Log locations are listed in [Troubleshooting](/admin/troubleshooting/#system-logs); verbose logging options in [Debugging messaging services](/kb/debug_services/).

| Symptom | Likely cause | What to check / fix |
| --- | --- | --- |
| `zypper refresh` fails, repositories unreachable | Resolver or gateway not configured on the appliance; `/etc/resolv.conf` missing because DNS servers were only provided by DHCP | `getent hosts download.grommunio.com`, `ip route`, `cat /etc/resolv.conf`; enter gateway and DNS servers in the CUI network configuration |
| Admin UI does not answer on 8443 | Admin TLS not enabled (manual installation) or nginx not running | Follow [Admin API TLS configuration](/admin/operations/#admin-api-tls-configuration); `nginx -t`, `systemctl restart nginx` |
| Browser or client rejects the certificate | Self-signed certificate, or `autodiscover.example.com` missing from the SAN list | Import a proper certificate or re-issue it with all names, see [Certificate management](/admin/operations/#certificate-management) |
| Let's Encrypt issuance failed during setup | Port 80 not reachable from the Internet, or DNS not yet pointing to the appliance | `/var/log/grommunio-setup.log`; fix DNS/firewall and request the certificate again as shown in [TLS configuration](/admin/installation/#tls-configuration) |
| User cannot log in to grommunio Web | Wrong password, `privWeb` not set, or user status not `normal` | `grommunio-admin user login`, `grommunio-admin user query username privWeb status`, `grommunio-admin passwd` |
| Local test mail never reaches the Inbox | Message stuck in Postfix or in the Gromox queue; `gromox-delivery` or `gromox-http` not running | `postqueue -p`, `gromox-mailq`, `journalctl -u postfix -u gromox-delivery -u gromox-delivery-queue`; [Mail requeueing](/admin/operations/#mail-requeueing) |
| Outbound mail rejected or filed as spam | Missing or mismatching PTR, SPF failure, no DKIM signature, dynamic or listed IP address | DNS health in the Admin UI; `Authentication-Results` at the receiver; `dig -x` on the public IP; check the IP against common blocklists |
| No `DKIM-Signature` header on outgoing mail | Key not readable by `groas`, key file name does not match `<domain>.<selector>.key`, or locally submitted mail bypasses the milter | Repeat the commands from step 6; `ls -l /var/lib/grommunio-antispam/dkim/`; `postconf non_smtpd_milters`; `journalctl -u grommunio-antispam` |
| Mail from the Internet never arrives | MX record wrong, port 25 blocked by the provider or firewall, or domain not created in grommunio | `dig MX example.com`; `ss -tulpn` for port 25; `journalctl -u postfix`; `grommunio-admin domain list` |
| Outlook or mobile device cannot auto-configure | `autodiscover` record missing in the public zone, or certificate does not cover the name | `gromox-dscli -e user@example.com`; [autodiscover(7)](/man/autodiscover-7/); [Outlook KB](/kb/outlook/) |
| Login or TLS errors after a reboot, timestamps wrong | Time not synchronised | `timedatectl`; configure NTP via the CUI timesyncd dialog; `timedatectl timesync-status` shows the server in use |
| `gromox-cleaner.service` fails to start | `gromox-http` not running (the unit requires it) | `systemctl status gromox-http`; then `systemctl start gromox-cleaner.service` |

## Operating notes

- Logs: all grommunio and Gromox services log to the journal (`journalctl -u <unit>`); nginx and the PHP services for Web, Sync and DAV write to files under `/var/log/nginx/`, `/var/log/grommunio-sync/` and `/var/log/grommunio-dav/`. The Admin UI exposes the journals under [Logs](/admin/administration/#logs).
- Queues: watch `postqueue -p` and `gromox-mailq`, or the Mail queue view in the Admin UI. A growing queue is the earliest sign of a delivery problem.
- Certificates: with Let's Encrypt, `grommunio-certbot-renew.timer` renews weekly; port 80 must stay reachable. With imported certificates, track the expiry date yourself and restart the services after replacing the files.
- Monitoring: service state, queue length, disk usage of `/var/lib/gromox`, certificate expiry and the DMARC aggregate reports are the minimum set to watch.
- Firewall: `firewalld` on the appliance opens every service port after setup. Keep the Admin ports (8080/8443) restricted to administrative networks, on the host firewall (`firewall-cmd --remove-port=8080/tcp --zone=public --permanent`, then `firewall-cmd --reload`, once you have confirmed that 8443 works) and on the perimeter, and expose only 25, 80, 443, 587 and the IMAP/POP3 ports you need.

## Related pages

- [Quickstart](/admin/quickstart/)
- [Guided Installation (grommunio Appliance)](/admin/installation/)
- [Administration](/admin/administration/)
- [Operations](/admin/operations/)
- [Troubleshooting](/admin/troubleshooting/)
- [Common administration tasks](/cli/cookbook/)
- [Antispam](/guides/antispam/)
- [Backup and restore](/guides/backup-restore/)
- [AutoDiscover](/kb/autodiscover/)
- [Mailbox maintenance](/kb/mailbox_maint/)
