---
title: "Mobile devices: Exchange ActiveSync and device management"
description: "Enable Exchange ActiveSync for users, connect phones and tablets, verify synchronisation, apply sync policies and handle resync and remote wipe."
sidebar:
  label: "Mobile devices (EAS)"
  order: 80
---

grommunio serves phones and tablets over Exchange ActiveSync (EAS), implemented by grommunio-sync. Device management in grommunio covers the ActiveSync relationship between a mailbox and a device: listing devices, checking their sync status, forcing a full resync, removing stale server-side state, enforcing sync policies (PIN, lock timeout, encryption) and issuing a remote wipe.

It is not a unified endpoint management (UEM) product. grommunio does not install apps, distribute certificates or configure device settings outside the EAS policy set, and every policy is only as effective as the client's implementation of it.

This guide takes you from a working grommunio installation to a user whose device synchronises mail, calendar, contacts and tasks, and shows where devices are reviewed and managed: in grommunio Web, in the Admin UI and on the command line.

:::note[Container and Kubernetes deployments]
With [Docker Compose](/admin/container_core/) or the [Helm chart](/admin/kubernetes/), grommunio-sync runs in gromox-core. Run the server-side commands inside the core container (`docker exec gromox-core ...`, `kubectl -n grommunio exec grommunio-core-0 -- ...`) and check the services with `supervisorctl status` instead of `systemctl`. `/etc/grommunio-sync` is not on a volume: changes to `grommunio-sync.conf.php` (for example `PROVISIONING` or `LOGLEVEL`) are lost when the container is recreated unless you mount the file into gromox-core.
:::

## How it fits together

| Component | Role for EAS |
|----|----|
| nginx | Terminates TLS on port 443 and passes `/Microsoft-Server-ActiveSync` to the grommunio-sync PHP-FPM pool (location shipped in `/usr/share/grommunio-common/nginx/locations.d/grommunio-sync.conf`) |
| grommunio-sync (PHP-FPM pool `grommunio-sync-pool`, socket `/run/php-fpm/php-grommunio-sync-fpm.sock`) | Implements EAS 2.5 to 16.1: provisioning, folder hierarchy sync, item sync, push (Ping), policies, wipe handshake |
| gromox-zcore | php-mapi transport; grommunio-sync reads and writes the mailbox through zcore |
| gromox-http | Information store (exmdb) behind zcore; also answers AutoDiscover at `/Autodiscover/Autodiscover.xml` |
| Redis | Transient state of running sync threads; feeds `grommunio-sync-top`, the Admin UI *Mobile devices* view and the "last connect" timestamps |
| grommunio-admin-api | Serves the effective sync policy and the wipe status of a device to grommunio-sync; keeps wipe requests in its database |
| User store | Persistent per-device sync state in the hidden `GS-SyncState` folder, outside `IPM_SUBTREE` |

A device session runs as follows:

1. The device locates the server via AutoDiscover (or you enter the server name manually) and sends requests to `https://mail.example.com/Microsoft-Server-ActiveSync`.
2. nginx forwards the request to grommunio-sync, which authenticates the user through php-mapi against gromox-zcore. Users without the EAS privilege are rejected.
3. On the first contact the device is provisioned: grommunio-sync fetches the effective sync policy for the user from the Admin API and the device acknowledges it (PIN, lock timeout and so on).
4. The device runs FolderSync and Sync; grommunio-sync records the per-device state in the user's store. Between changes the device sits in a Ping request, which is how push mail works.

Because the device state lives inside the mailbox, it travels with the mailbox during backups, migrations and homeserver moves, and it is deleted with the mailbox. Redis holds only what is needed to display live connections.

## Prerequisites

- A grommunio installation with working DNS and TLS, for example after the [post-installation guide](/guides/post-install/).
- DNS: `mail.example.com` resolves from every network your devices use, and `autodiscover.example.com` points to the same host (A/AAAA or CNAME). Alternatively publish an SRV record `_autodiscover._tcp.example.com`. See [autodiscover(7)](/man/autodiscover-7/).
- A publicly trusted TLS certificate covering both names. Mobile operating systems refuse untrusted certificates or require manual trust profiles; expired certificates stop synchronisation on every device at once.
- TCP port 443 reachable from the mobile networks. EAS needs no other port.
- Running services: `nginx`, `php-fpm`, `gromox-http`, `gromox-zcore`, Redis and `grommunio-admin-api`.
- A user with a mailbox and, for the first test, a device you can afford to reset. Policies apply during the first sync and a wipe test is destructive.

## 1. Check the server side

Confirm the host name, the installed components and the services before touching a device.

```bash
hostname -f
rpm -q grommunio-sync gromox grommunio-admin-api
systemctl is-active nginx php-fpm gromox-http gromox-zcore redis@grommunio grommunio-admin-api
```

Every service should report `active`. Then probe the two HTTPS endpoints from outside the server, without disabling certificate verification. If `curl` rejects the certificate, mobile devices will reject it too.

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://mail.example.com/Microsoft-Server-ActiveSync
curl -sS -o /dev/null -w '%{http_code}\n' https://autodiscover.example.com/Autodiscover/Autodiscover.xml
```

Expected result: `401` for both URLs. An unauthenticated request is answered with an authentication challenge, which proves that nginx, the PHP-FPM pool and gromox-http are wired up. A `404`, `502` or `503` points at the nginx configuration, a stopped `php-fpm` or a stopped `gromox-http`.

To test AutoDiscover the way an EAS client does, use [gromox-dscli(8)](/man/gromox-dscli-8/) with the `--eas` request schema:

```bash
PASS='<strong-password>' gromox-dscli --eas -e alice@example.com
```

Expected result: an XML response that names the server. With `-v`, the request and the raw response are printed for inspection.

## 2. Enable EAS for the user

ActiveSync access is a per-user privilege. Without it, the user cannot log in at the EAS endpoint even with a correct password.

**Admin UI:** open *Domains*, select the domain, open *Users*, click the user, and on the *Account* tab enable *Allow EAS*. Click *Save* at the bottom of the page. To pre-fill the privilege for newly created users, set it under *Defaults* (globally or per domain); see [Administration](/admin/administration/#editing-a-user).

**CLI:**

```bash
grommunio-admin user modify alice@example.com --privEas 1
grommunio-admin user query -f username=alice@example.com username status privEas
```

Expected result: the query lists the user with `privEas` set to `1`. Boolean fields accept `0`/`1`, `yes`/`no` and `true`/`false`. `grommunio-admin user show alice@example.com` prints the full record. To withdraw ActiveSync access later, set `--privEas 0`; this blocks new logins but leaves existing device states in the store (see [step 6](#6-manage-devices-from-the-cli) for cleanup).

The privilege is stored in grommunio, not in LDAP. Users imported from LDAP get it through the defaults or by setting it explicitly as shown. See [grommunio-admin user](/cli/grommunio-admin/user/) for all fields.

## 3. Connect a device

Use the account type *Microsoft Exchange* (sometimes labelled *Exchange ActiveSync* or *Exchange*), never *Microsoft 365* or *Outlook.com*, which are tied to Microsoft's cloud.

| Setting | Value |
|----|----|
| E-mail address | `alice@example.com` |
| Username | `alice@example.com` (the full address; leave any *Domain* field empty) |
| Password | The user's grommunio password |
| Server | `mail.example.com` (manual setup only) |
| Encryption | SSL/TLS, port 443 |
| Data to sync | Mail, Contacts, Calendars, Tasks/Reminders, Notes, as offered by the client |

grommunio-sync expects the full e-mail address as login name (`USE_FULLEMAIL_FOR_LOGIN` in `/etc/grommunio-sync/grommunio-sync.conf.php`), which is also what AutoDiscover hands to the device.

### With AutoDiscover

Enter the e-mail address and the password and let the device discover the server. The device queries `autodiscover.example.com` (or the SRV record) and receives the ActiveSync URL. Nothing else is required. If a client offers both a sign-in and a manual path, the sign-in path is the AutoDiscover path.

### Manual server entry

When AutoDiscover is not published or the client insists on manual data, choose the manual or advanced option and enter server, username and password as in the table above. On iOS and iPadOS this is *Configure Manually* after entering the address; Android mail apps ask for *Server* and *Username* in their *Manual setup*; Outlook for iOS and Android exposes the server field under *Advanced settings* when the account type *Exchange* is chosen. Menu names vary between vendors and versions.

:::note[Outlook for iOS and Android]
Outlook mobile treats third-party ActiveSync accounts differently from the built-in apps, and its support for them has changed between versions. The reference clients for grommunio are the built-in mail, calendar and contacts apps of iOS and Android.
:::

### Shared mailboxes on a phone

grommunio-sync supports impersonation over EAS. To put a shared mailbox on a device with full rights, use the combined login `<shared-mailbox>!<your-address>`, for example `sales@example.com!alice@example.com`, with Alice's own password. AutoDiscover understands this form and the server checks that Alice holds owner rights on the target store. A remote wipe issued against such a session is automatically reduced to an account-only wipe. See the [release notes](/admin/release_notes/).

:::caution
The device receives the sync policy during the first contact. If the policy requires a PIN or encryption, the device enforces it before the first sync completes. Use a device you control for the first tests.
:::

## 4. Prove synchronisation

On the device, the folder list appears first (FolderSync), followed by the content of the folders (Sync). Send a message to the user and create an appointment on the device; the message should arrive on the device and the appointment should show up in grommunio Web.

On the server, list the user's devices:

```bash
grommunio-admin user devices alice@example.com list
```

Expected result: one line per device with the columns `ID`, `Device`, `Agent`, `Version` (EAS protocol version), `Last connect` and `Status` (wipe status). `grommunio-admin user devices alice@example.com show <DEVICE-ID>` prints the details recorded by grommunio-sync, including `devicetype`, `devicemodel`, `deviceos`, `useragent`, `firstsynctime`, `lastupdatetime`, `lastconnecttime`, `asversion` and `wipeStatus`.

Watch live connections with the console tool shipped with grommunio-sync:

```bash
grommunio-sync-top
```

It shows one line per running request with `PID`, `ADDRESS`, `USER`, `COMMAND` (for example `Provision`, `FolderSync`, `Sync`, `Ping`), `TIME`, `AGENT`, `DEVID`, additional information and the EAS version. Type `f:alice` to filter on a user, `l:` to grep the log, `t:` to tail the log, `e:` to tail the error log, `h` for help and `q` to quit. The Admin UI offers the same view under *Mobile devices*, and *Live Status* lists every EAS request together with the other HTTP protocols.

Check the grommunio-sync logs for the user:

```bash
grep -i 'alice@example.com' /var/log/grommunio-sync/grommunio-sync.log | tail -n 50
tail -n 100 /var/log/grommunio-sync/grommunio-sync-error.log
```

Expected result: provisioning, FolderSync and Sync entries for the device ID and no entries in the error log for this session.

## 5. Review devices in grommunio Web and the Admin UI

**grommunio Web (user self-service).** Under *Settings*, *Mobile Devices*, the user sees every device paired with the mailbox: friendly name, operating system, first and last sync, device ID, and on click the synchronised folders, the grommunio-sync version, the negotiated EAS version and the provisioning policy in force. The actions *Wipe Device* (requires the user's password), *Full Resync*, *Remove Device* and *Refresh* are described in [Mobile Device Management](/web/mdm/). Point users to that page and to the clean-restart procedure in the [user troubleshooting page](/user/troubleshooting/) before they contact you.

**Admin UI, per user.** Open the user and switch to the *Mobile devices* tab to see the devices of this mailbox. The tab offers *Remote wipe* and *Cancel remote wipe*. The *Sync policy* tab next to it holds the user-specific policy (see [step 7](#7-sync-policies)).

**Admin UI, server-wide.** *Mobile devices* in the drawer is a live table of current connections, refreshed every two seconds, with a text filter and an activity filter. It is the graphical equivalent of `grommunio-sync-top`. Use it to see who is syncing right now, not as an inventory: devices that are idle between Ping requests appear and disappear as their requests come and go. See [Administration](/admin/administration/).

## 6. Manage devices from the CLI

All device operations hang off `grommunio-admin user devices`. `USERSPEC` is the user name or ID; device IDs come from `list`.

```bash
grommunio-admin user devices alice@example.com list
grommunio-admin user devices alice@example.com show <DEVICE-ID>
grommunio-admin user devices alice@example.com resync <DEVICE-ID>
grommunio-admin user devices alice@example.com remove <DEVICE-ID>
grommunio-admin user devices alice@example.com wipe --mode account <DEVICE-ID>
grommunio-admin user devices alice@example.com wipe --mode normal <DEVICE-ID>
grommunio-admin user devices alice@example.com wipe --mode cancel <DEVICE-ID>
```

| Subcommand | Effect | Takes effect |
|----|----|----|
| `list` | Devices of the user with EAS version, last connect time and wipe status | Immediately |
| `show DEVICE …` | Full device record from the sync state | Immediately |
| `resync [DEVICE …]` | Marks the device for a full resync: hierarchy first, then all content | On the device's next request |
| `remove [DEVICE …]` | Deletes the device state from the store and the device's wipe record | Immediately; a device that still has the account configured re-registers and performs a full sync |
| `wipe --mode MODE DEVICE` | Sets the wipe status: `normal` (whole device), `account` (this account's data only) or `cancel` (withdraw a pending request); default is `normal` | On the device's next authenticated request |

`list`, `show`, `resync` and `remove` accept several device IDs; without an ID they act on all devices of the user. `wipe` requires exactly one device ID. Additional examples are in the [CLI cookbook](/cli/cookbook/).

Use `resync` when items are missing on a device or a folder does not update. Use `remove` for devices that have been retired, or as part of the clean-restart procedure: remove the account from the device, remove the device state, wait a few minutes, recreate the account.

## 7. Sync policies

Sync policies are the EAS provisioning rules a device must accept before it may synchronise. grommunio applies them in three layers:

1. The server default, visible with `grommunio-admin config get sync.defaultPolicy`.
2. The domain policy: *Domains*, select the domain, *Sync policy* tab. It applies to all users of the domain.
3. The user policy: *Users*, select the user, *Sync policy* tab. It overrides the domain policy for this user.

In both tabs, blue controls mark values that deviate from the inherited policy; grey controls inherit. A policy change is pushed to the devices at their next contact, when grommunio-sync re-provisions them. The Admin UI exposes, among others:

| Policy | Purpose |
|----|----|
| Password required | Device must have a lock PIN or password |
| Minimum password length | Minimum number of characters |
| Require alphanumeric password / Minimum password character sets | Complexity requirements |
| Allow simple passwords | Permit repeating or sequential PINs |
| Password expiration (days) | Force periodic PIN changes |
| Number of failed login attempts allowed | Device wipes itself after that many wrong entries (client-dependent) |
| Inactivity (seconds) before device locks itself | Auto-lock timeout |
| Require encryption on storage card | Encryption of removable storage |
| Device encryption, camera, storage card, Wi-Fi, Bluetooth, browser, unsigned apps, attachments and maximum attachment size, mail and calendar age filters | Feature restrictions and sync limits from the EAS policy set |

A common baseline for company devices is: password required, minimum length 6, lock after 300 to 900 seconds of inactivity, 10 failed attempts, device encryption required. Everything else is client-dependent: current iOS and Android releases honour PIN, complexity, lock timeout, encryption and camera rules; many other keys date from older device generations and are silently ignored. Validate a policy with a real device of each platform you support. Test clients that only speak the protocol do not enforce anything.

Two settings in the grommunio-sync configuration file `/etc/grommunio-sync/grommunio-sync.conf.php` (linked as `/usr/share/grommunio-sync/config.php`) govern provisioning as a whole: `PROVISIONING` (enabled by default) switches policy enforcement on, and `LOOSE_PROVISIONING` (disabled by default) admits devices that cannot provision while still enforcing policies on devices that can. Leave both at their defaults unless you must support legacy clients.

:::note
Policies are not a substitute for revoking access. A lost device that never connects again never receives a new policy or a wipe. Change the password and remove the EAS privilege in that case.
:::

## 8. Remote wipe

:::danger
A remote wipe is destructive and cannot be undone. In `normal` mode, iOS devices and many Android devices perform a factory reset that removes personal photos, apps and settings. Verify the device ID and the mode before issuing it, and never test on a device that holds data you need.
:::

| Mode | Admin UI label | Result on the device |
|----|----|----|
| `normal` | Wipe all data | Full device wipe, vendor-dependent; equivalent to a factory reset on most platforms |
| `account` | Wipe only data related to this account | Removes the grommunio account and its mail, contacts and calendar items; other data stays |
| `cancel` | Cancel remote wipe | Withdraws a pending request that the device has not acknowledged yet |

A wipe can be requested from three places: by the user in grommunio Web (*Wipe Device*, password required), by an administrator in the Admin UI (*Remote wipe* on the user's *Mobile devices* tab) and on the CLI with `wipe --mode`. In every case the request is stored as a pending status; the device receives the command in the response to its next authenticated request, acknowledges it and executes it. `list` shows the current status in the `Status` column.

Recommended procedure for a lost or stolen device:

1. Identify the device with `list` and `show`: match the model, the user agent and the last connect time against what the user reports.
2. Choose the mode. Prefer `account` on personally owned devices; use `normal` only where company policy and the user's consent cover a full reset.
3. Issue the wipe and leave the account credentials valid until the device has acknowledged the request. A device that can no longer authenticate is never told to wipe.
4. Watch `list` for the status change and the grommunio-sync log for the device's acknowledgement. Devices that are switched off, offline or have already had the account removed stay in pending state indefinitely; cancel the request if the device turns up.
5. After the acknowledgement, remove the device state with `remove`, change the user's password (`grommunio-admin passwd alice@example.com`) and, if appropriate, withdraw the EAS privilege.

Wipes issued against an impersonated shared-mailbox session are reduced to `account` mode by grommunio-sync, so a personal device is never reset because of a shared mailbox.

## Verification checklist

| Check | How | Expected result |
|----|----|----|
| DNS | `dig +short mail.example.com` and `dig +short autodiscover.example.com` | Both resolve to the grommunio host from the client networks |
| TLS | `curl -sS https://mail.example.com/` without `-k` | No certificate error; certificate covers both names |
| Services | `systemctl is-active nginx php-fpm gromox-http gromox-zcore redis@grommunio grommunio-admin-api` | All `active` |
| Endpoint | `curl -sS -o /dev/null -w '%{http_code}\n' https://mail.example.com/Microsoft-Server-ActiveSync` | `401` |
| AutoDiscover | `PASS='…' gromox-dscli --eas -e alice@example.com` | XML response naming the server |
| User privilege | `grommunio-admin user query -f username=alice@example.com privEas` | `1` |
| Provisioning | Add the account on a device | Device accepts the policy and, if required, asks for a PIN |
| Hierarchy and content | Device shows folders; a test mail and a test appointment sync both ways | Items visible on the device and in grommunio Web |
| Device registered | `grommunio-admin user devices alice@example.com list` and grommunio Web *Mobile Devices* | Device listed with a recent last connect time |
| Live view | `grommunio-sync-top` or Admin UI *Mobile devices* while the device syncs | Request lines for the user appear |
| Resync | `resync`, then wait for the next request | Device performs a full resync; items reappear |
| Remove | `remove`, with the account removed from the device first | Device disappears from the list and does not return |
| Policy change | Change the lock timeout in the domain or user policy | Device is re-provisioned at its next contact and applies the new value |
| Restart | `systemctl restart php-fpm nginx` | Devices reconnect and continue syncing |
| Logs | `/var/log/grommunio-sync/grommunio-sync-error.log` | No errors for the tested session |

## Troubleshooting

| Symptom | Likely cause | What to check/fix |
|----|----|----|
| Device cannot find the server during setup | AutoDiscover DNS missing or not published in the client's DNS view; certificate does not cover `autodiscover.example.com` | Resolve `autodiscover.example.com` from the client network; test with `gromox-dscli --eas`; enable `oxdisco_request_logging` in `/etc/gromox/gromox.cfg` temporarily; fall back to manual server entry |
| Device reports a certificate error | Self-signed, incomplete chain or expired certificate | `curl` without `-k` from outside; install a publicly trusted certificate with the full chain |
| Account setup fails with wrong credentials although the password is correct | Username not the full address, `Domain` field filled, EAS privilege not set, user suspended | Use `alice@example.com` as username with an empty domain; `grommunio-admin user query -f username=alice@example.com status privEas`; `grommunio-admin user login alice@example.com` to test authentication |
| Endpoint always returns `401` for the device, `grommunio-sync.log` shows no login | Request never reaches PHP or authentication backend down | `systemctl status php-fpm gromox-zcore`; `/var/log/nginx/nginx-sync-error.log`; `/var/log/grommunio-sync/grommunio-sync-fpm.log` |
| Repeated `401`/`403` in `/var/log/nginx/nginx-sync-access.log` for one user | Stale password on a device after a password change, or privilege withdrawn | Identify the device by IP and user agent in `grommunio-sync-top`; update or remove the account on the device |
| Device not listed although it syncs | Looking at the wrong user or the Admin UI live view instead of the device list | `grommunio-admin user devices <user> list`; grommunio Web *Mobile Devices*, *Refresh* |
| Sync stuck, no new mail, last connect time old | Device offline, push (Ping) blocked by the network, client not provisioned, broken sync state | Check `Last connect` in `list`; watch `grommunio-sync-top` for Ping requests from the device; `resync`; as a last resort the clean-restart procedure (remove account, `remove`, wait, re-add) |
| Items missing or duplicated, flags not updating | Corrupted device state or change-number problems in the mailbox | `resync` first; if the mailbox itself shows ICS problems see `cgkreset` in [gromox-mbop(8)](/man/gromox-mbop-8/) |
| `resync` has no visible effect | The device has not connected since | Wait for the next request or trigger a manual sync on the device |
| Device reappears after `remove` | The account is still configured on the device | Remove the account on the device first, then `remove` the state |
| Policy not applied on the device | Device has not reconnected; client does not implement the policy key; `PROVISIONING` disabled | Force a sync on the device; test with a native mail client; confirm `PROVISIONING` in `/etc/grommunio-sync/grommunio-sync.conf.php` |
| Wipe stays pending | Device offline, switched off, or the account was removed before the wipe was delivered; password changed before acknowledgement | Keep credentials valid until acknowledgement; `wipe --mode cancel` if the device turns up; otherwise rely on password change and privilege removal |
| Shared mailbox login rejected | Impersonation form wrong or missing owner rights | Login must be `shared@example.com!alice@example.com`; grant owner permission on the shared store |
| `grommunio-sync-top` aborts with `Permission denied` on `config.php` | The wrapper switches to the `grosync` user, which cannot read `/etc/grommunio-sync/grommunio-sync.conf.php` (mode 640, group `grosync`) | Check `id grosync` and the file's group; use the Admin UI *Mobile devices* view or `grommunio-admin user devices … list` in the meantime |

## Operating notes

**Logs.** grommunio-sync writes to files, not to the journal:

| File | Content |
|----|----|
| `/var/log/grommunio-sync/grommunio-sync.log` | Request log: user, device ID, command, result |
| `/var/log/grommunio-sync/grommunio-sync-error.log` | Errors and warnings only |
| `/var/log/grommunio-sync/grommunio-sync-fpm.log` | PHP-FPM output of the grommunio-sync pool |
| `/var/log/nginx/nginx-sync-access.log`, `/var/log/nginx/nginx-sync-error.log` | HTTP status codes and proxy errors for `/Microsoft-Server-ActiveSync` (separate from the grommunio Web logs) |

The default verbosity is `LOGLEVEL_INFO` (`LOGLEVEL` in `/etc/grommunio-sync/grommunio-sync.conf.php`). Raise it only for the duration of an investigation; the debug and WBXML levels record message content. `/etc/logrotate.d/grommunio-sync.lr` rotates the files under `/var/log/grommunio-sync/` once they exceed 4 MB, keeps four generations and deletes archives after a year. gromox-zcore and gromox-http log to the journal (`journalctl -u gromox-zcore -u gromox-http`); a general log overview is in [Troubleshooting](/admin/troubleshooting/).

**Monitoring.** Monitor technical health rather than device inventories: HTTP reachability and the `401` challenge of the endpoint, certificate expiry, the share of `401`/`403` responses in `/var/log/nginx/nginx-sync-access.log`, growth of `grommunio-sync-error.log`, saturation of the PHP-FPM pool (each Ping request holds a worker) and stale `Last connect` times of devices that should be active. Device IDs, IMEIs and user agents are personal data; keep exports of device lists to what your policy requires.

**State and backups.** Device states are part of the user store and are therefore included in mailbox backups and in full exports with `gromox-exm2mt -ar /`; an export restricted to `IPM_SUBTREE` omits them. Redis contents are transient and need no backup. See [Operations](/admin/operations/) for the general backup procedure.

**Housekeeping.** Review device lists periodically and `remove` states of devices whose last connect time is months old. When a user leaves, withdraw the EAS privilege, wipe the account data if required, then delete the user; the states go with the mailbox.

**Updates and high availability.** Update grommunio-sync with `zypper` together with the rest of the stack and re-run the endpoint check and one device sync afterwards. Because grommunio-sync is stateless PHP behind nginx and the device state lives in the store, `/Microsoft-Server-ActiveSync` can be load-balanced across web nodes; the [architecture](/admin/architecture/) and [high availability](/admin/high-availability/) pages contain the routing examples.

## Related pages

- [Mobile Device Management in grommunio Web](/web/mdm/)
- [Administration: users, mobile devices, sync policies](/admin/administration/)
- [grommunio-admin user](/cli/grommunio-admin/user/) and the [CLI cookbook](/cli/cookbook/)
- [autodiscover(7)](/man/autodiscover-7/), [autodiscover(4gx)](/man/autodiscover-4gx/) and [gromox-dscli(8)](/man/gromox-dscli-8/)
- [Architecture: Exchange ActiveSync workflow](/admin/architecture/)
- [Troubleshooting](/admin/troubleshooting/) and the [user troubleshooting page](/user/troubleshooting/)
- [gromox-mbop(8)](/man/gromox-mbop-8/)
- [Release notes](/admin/release_notes/)
