---
title: "Quickstart"
description: "This chapter covers a short walkthrough which can be used as a check list to install and get grommunio started."
sidebar:
  order: 20
---

This chapter covers a short walkthrough which can be used as a check list to install and get grommunio started.

- Download the installation ISO from <https://download.grommunio.com/appliance/grommunio.x86_64-latest.install.iso>. The installation image is a hybrid installation image which also allows to be transferred to a USB stick with USB imaging tools such as GNU ddrescue or <https://rufus.ie>.
- Use the installation media from grommunio to install and quickstart the configuration by walking through the following chapters.
- Create or request TLS certificates for secure, encrypted operation of the main services.
- Create the corresponding DNS records (A, MX, TXT and CNAME records).
- Configure the grommunio appliance by running grommunio-setup.

## Minimum requirements

For the installation of grommunio (or using the grommunio Appliance), the following minimal requirements apply:

- Server or virtual machine (VMware, Xen, KVM or Hyper-V) with at least:
  - 4 CPU cores
  - 6 GB RAM
  - 32 GB system disk for the operating system and base install. The installer
    overwrites the **entire** target disk (see the caution under *Installation*).
    Provision **additional** storage for mailbox data — it is the largest sizing
    factor and grows with the user count and per-mailbox quota.
- Correctly configured DNS records, at least two, for example:
  - **\<FQDN\>**, for example **mail.example.com**
  - **autodiscover.example.com**
- A TLS certificate with all included DNS names, alternatively a wildcard certificate for the entire domain. (Let's Encrypt can be configured by grommunio-setup.) If you already own a certificate, it can be reused provided it is in PEM format, with one file containing the certificate chain and server certificate, as well as a separate key file.

:::note
It is strongly recommended to properly set up the corresponding *autodiscover.example.com* DNS entry, otherwise AutoDiscover will not be able to determine the server.
:::

:::caution
IPv6 is mandatory to be active, since many preconfigurations rely on it. A "real" IPv6 is not required, the availability of `::1` is sufficient.
:::

Optional requirements:

- MX DNS records, for incoming mail delivery.
- At the time of certificate generation by Let's Encrypt, the accessibility of port 80 to all of the defined DNS records is a requirement.

## Installation

1.  Download of the bootable x86 image from download.grommunio.com: <https://download.grommunio.com/appliance/grommunio.x86_64-latest.install.iso>
2.  Load the file for installation into the server on which grommunio should be installed on.
3.  Boot from the installation medium and choose **"Install grommunio"** from the boot menu before the 10-second countdown expires (the default entry, *Boot from Hard Disk*, boots an existing installation).

:::caution
Note that the installer asks for confirmation to delete and overwrite the **entire** installation target disk!
:::

![grommunio Appliance installer boot screen](/img/appliance_boot_menu.png)

After the image has been copied to disk, the appliance boots into the installed system and is ready for the upcoming setup. See [Installing the appliance](/admin/installation/#installing-the-appliance) for screenshots of every step.

## Setup

After installation, the appliance displays the grommunio console user interface (CUI). For more detailed instructions of the setup process, refer to [grommunio Appliance configuration with CUI/setup](/admin/installation/#grommunio-appliance-configuration-with-cuisetup).

:::caution
The initial root password is unset (empty). As long as no password is set, `F2` opens the CUI main menu without asking for credentials.
:::

To configure grommunio, proceed as follows:

1.  Press `F2` to open the main menu. If the console keyboard layout does not match your keyboard, change it first with **"Keyboard configuration"** (or `F5`).
2.  Choose **"Change system password"** to set a new root password.
3.  Choose **"Network interface configuration"** to set up networking of the appliance (address, gateway, DNS servers).
4.  Choose **"Change hostname"** to set the fully qualified domain name, e.g. `mail.example.com`. Make sure it resolves to the appliance (DNS or `/etc/hosts`).
5.  Choose **"Timezone configuration"** to set up the correct timezone for the appliance.
6.  Choose **"timesyncd configuration"** to set up the correct timeservers (NTP) for accurate date and time settings.
7.  Choose **"grommunio setup wizard"** to guide through subsequent configuration interactively.
8.  (Optionally) choose **"Change admin-web password"** to reset the Admin UI password after setup to your liking.

The "grommunio setup wizard" invokes *grommunio-setup*, which can be started from the CUI or any other terminal of the appliance.

:::note
SSH is enabled by default, therefore grommunio-setup can also be executed from an SSH session. Note that a password must have been set before you can login via SSH.
:::

To navigate within the grommunio setup wizard (grommunio-setup), use the following navigation hints:

- *\<TAB\>* navigates through dialog elements
- *\<ARROW-UP\>* or *\<ARROW-DOWN\>* navigate within form elements (such as when entering subscription details) or menu selections (during database setup)
- *\<SPACE\>* toggles checkboxes (such as the optional roles in the feature selection)
- *\<j\>* or *\<k\>* keys for scrolling longer content-heavy dialogs (as in the finalization dialog)
- *\<ESC\>* to terminate grommunio-setup at any given stage of the configuration

Additional hotkeys are available at display of grommunio-cui at the bottom of the screen.

grommunio-setup automatically supplies defaults for most dialogs; these can be overridden as desired. For example, grommunio-setup automatically generates passwords which are also available after the installation in the grommunio-setup logfile, */var/log/grommunio-setup.log*.

:::caution
If the configuration fails for any reason, grommunio-setup can be re-run. Current versions detect an existing installation and offer to **keep** it: the base configuration is left alone and the optional roles (Chat, Meet, Files, Office, Archive) can be added or removed, with the data of a removed role preserved for a later re-add. The alternative, a re-configuration **from scratch**, is destructive and re-initializes the installation; grommunio-setup warns and asks for confirmation before deleting any data. To change system-related parameters on a running system, use the grommunio administration interface instead.
:::

:::caution
The installation process is logged in **/var/log/grommunio-setup.log**. Note that this file has all instance configuration used to configure grommunio-setup. As a subscription owner, you are entitled for support, where, for example, you can send the installation log to grommunio if you need any help. (Password references should be removed.)
:::

:::caution
It is recommended after successful installation to store the installation log in a safe place and delete it from the appliance. Alternatively, the installation log can be stored safely somewhere as reference of any credentials of your installation for later use.
:::

### grommunio Admin User

During the process of grommunio-setup, some accounts are automatically generated - such as a database account for user management and also for the initial grommunio administrator (admin).

:::caution
The admin user of grommunio and the root user of the appliance are separated, non-synced users. The admin user is solely known to the grommunio Administration framework and is (intentionally) not a system user. The credentials of both users are to be kept safe. The root user is the main system administrator while admin is the main grommunio administrator. They can (and should) have different passwords, with the role concept of grommunio it is even recommended not to work with these passwords in production, but instead create less privileged for regular tasks performed.
:::

:::note
The password of the primary admin user can be changed anytime by using grommunio-cui or by executing `grommunio-admin passwd --password "ChangeMe"`
:::

### Repository configuration

The interactive configuration tool grommunio-setup requests subscription credentials during execution. If you own a valid subscription, enter your subscription details. Without a valid subscription, grommunio-setup activates the community repositories, which are provided on a best-effort basis and are not supported. With a valid subscription, your subscription repository is activated and delivers commercial-grade packages for the installation to keep up-to-date with latest features and fixes.

:::note
To receive a valid subscription, contact any of our partners or via our established communication channels at <https://grommunio.com>
:::

### Certificates

grommunio-setup offers four ways to provision the TLS certificate used by all services:

- **Self-signed certificate** — the simplest option (the default); clients must trust it on first connect. Best for demos and validation, not production.
- **Own CA + certificate** — generate a local certificate authority and sign certificates from it; useful for larger multi-instance validation setups.
- **Import an existing certificate** — bring your own PEM certificate/key pair (a SAN or wildcard certificate is recommended). The most flexible option for publicly trusted CAs.
- **Let's Encrypt** — free, automatic issuance and renewal; requires port 80 reachable from the Internet for every domain during validation (and renewal). Recommended for most simple installations.

Certificates are placed in `/etc/grommunio-common/ssl` and referenced automatically by the appliance services. See [TLS configuration](/admin/installation/#tls-configuration) for the detailed walkthrough of each option.

## Firewall

For seamless operation, the grommunio appliance opens different ports so that clients can access it. The following ports are made available by default:

- 25 (smtp)
- 80 (http)
- 110 (pop3)
- 143 (imap)
- 443 (https)
- 587 (submission — STARTTLS mail submission)
- 993 (imaps)
- 995 (pop3s)
- 8080 (admin, unencrypted)
- 8443 (admin https)

:::note
grommunio-setup enables TLS for the Admin UI on port 8443 with the certificate configured during setup. The unencrypted port 8080 stays open as well; once you have confirmed that `https://<FQDN>:8443/` works, close port 8080 on the firewall or restrict it to administrative networks. Port 465 (SMTPS, implicit-TLS submission) is not enabled by default; mail clients submit via 587 (STARTTLS).
:::

Generally, it is recommended to only make available the ports that are required for service access. Note that grommunio's major protocols, RPC over HTTP, MAPI/HTTP, EWS (Exchange Web Services) and EAS (Exchange ActiveSync) are all accessed via port 443 (HTTPS).

When operating with proxies and load balancers, note that for successful operation of proxying RPC, special configuration needs to be in place. The required HTTP transport modes required to operate RPC over proxies are RPC_IN_DATA and RPC_OUT_DATA. Known supported proxy software to support these RPC data channels are: haproxy, squid, nginx and apache.

## Verify the installation

Once grommunio-setup finishes, you have a configured — but still empty — system. Confirm it is working:

- Open the **Admin UI** at `https://<FQDN>:8443/` and sign in as **`admin`** with the password you set (or the one generated by grommunio-setup, shown in the setup summary and recorded in `/var/log/grommunio-setup.log`). The CUI status screen lists the Admin UI addresses of the appliance as well.
- Open **grommunio Web** at `https://<FQDN>/` — the user webmail and groupware interface.

If both load over HTTPS and the Admin UI signs in, the appliance is ready.

## Next steps

A fresh appliance has no mail domains or users yet. Continue with:

- [Post-installation checklist](/guides/post-install/) — verify services and ports, create the first domain and user, publish MX/SPF/DKIM/DMARC and prove end-to-end mail flow.
- [Administration](/admin/administration/) — create your first mail **domain** and **user**, then manage roles, public folders and settings.
- [Operations](/admin/operations/) — day-2 tasks, updates, and switching the Admin API to TLS.
- [Migration](/migration/) — import mailboxes from Exchange, Kopano and other systems.

:::note[Before going to production]
Define a **backup** strategy covering the mail stores, databases and configuration — see [Operations → Backup & Disaster Recovery](/admin/operations/#backup--disaster-recovery) — and review hardening beyond the firewall (closing the unencrypted Admin port 8080, fail2ban, 2FA/SSO).
:::
