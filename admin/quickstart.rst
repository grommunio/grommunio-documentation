..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2025 grommunio GmbH

##########
Quickstart
##########

This chapter covers a short walkthrough which can be used as a check list to
install and get grommunio started.

- Download the installation ISO from
  `<https://download.grommunio.com/appliance/grommunio.x86_64-latest.install.iso>`_.
  The installation image is a hybrid installation image which also allows to be
  transferred to a USB stick with USB imaging tools such as
  GNU ddrescue or `<https://rufus.ie>`_.
- Use the installation media from grommunio to install and quickstart the
  configuration by walking through the following chapters.
- Create or request TLS certificates for secure, encrypted operation of the
  main services.
- Create the corresponding DNS records (A, MX, TXT
  and CNAME records).
- Configure the grommunio appliance by running grommunio-setup.

Minimum requirements
====================

For the installation of grommunio (or using the grommunio Appliance), the
following minimal requirements apply:

- Server or virtual machine (VMware, Xen or Hyper-V) with at least:

  - 4 CPU cores
  - 6 GB RAM

- Correctly configured DNS records, at least two, for example:

  - **<FQDN>**, for example **mail.example.com**
  - **autodiscover.example.com**

- A TLS certificate with all included DNS names, alternatively a wildcard
  certificate for the entire domain. (Let's Encrypt can be configured by
  grommunio-setup.)
  If you already own a certificate, it can be reused provided it is in PEM
  format, with one file containing the certificate chain and server
  certificate, as well as a separate key file.

.. note::
   It is strongly recommended to properly set up the corresponding
   `autodiscover.example.com` DNS entry, otherwise AutoDiscover will not be
   able to determine the server.

.. important::
   IPv6 is mandatory to be active, since many preconfigurations rely on it.
   A "real" IPv6 is not required, the availability of ``::1`` is sufficient.

Optional requirements:

- MX DNS records, for incoming mail delivery.
- At the time of certificate generation by Let's Encrypt, the accessibility of
  port 80 to all of the defined DNS records is a requirement.

Installation
============

#. Download of the bootable x86 image from download.grommunio.com:
   https://download.grommunio.com/appliance/grommunio.x86_64-latest.install.iso
#. Load the file for installation into the server on
   which grommunio should be installed on.
#. Run the installer and choose "Install grommunio_Appliance" from the boot
   menu to install the appliance.

.. important::
   Note that the installer asks for confirmation to delete and overwrite the
   installation target!

.. image:: _static/img/admin_quickstart_boot.png
   :alt: grommunio Appliance installer boot screen

After the image has been copied to disk, the appliance is ready for boot and
upcoming setup.

Setup
=====

After installation, the appliance displays the grommunio console user interface
(CUI). For more detailed instructions of the setup process, refer to
`grommunio-console-ui-cui
<https://docs.grommunio.com/admin/administration.html#grommunio-console-ui-cui>`_.

.. important::
   The initial root password is unset (empty). When asked for password, just
   press "Enter".

To configure grommunio, proceed as follows:

#. Choose **"Change system password"** to set a new root password.
#. Choose **"Network configuration"** to set up networking of the appliance.
#. Choose **"Timezone configuration"** to set up the correct timezone for the
   appliance.
#. Choose **"Timesync configuration"** to set up the correct timeservers (NTP)
   for accurate date and time settings.
#. Choose **"grommunio setup wizard"** to guide through subsequent
   configuration interactively.
#. (Optionally) choose **"Change Admin Web UI password"** to reset the password
   after setup to your liking.

The "grommunio setup wizard" invokes `grommunio-setup`, which can be started
from the CUI or any other terminal of the appliance.

.. note::
   SSH is enabled by default, therefore grommunio-setup can also be executed
   from an SSH session. Note that a password must have been set before you can
   login via SSH.

To navigate within the grommunio setup wizard (grommunio-setup), use the
following navigation hints:

- *<TAB>* navigates through dialog elements
- *<ARROW-UP>* or *<ARROW-DOWN>* naviate within form elements (such as when
  entering subscription details) or menu selections (during database setup)
- *<j>* or *<k>* keys for scrolling longer content-heavy dialogs (as in the
  finalization dialog)
- *<ESC>* to terminate grommunio-setup at any given stage of the configuration

Additional hotkeys are available at display of grommunio-cui at the bottom of
the screen.

grommunio-setup automatically supplies defaults for most dialogs; these can be
overridden as desired. For example, grommunio-setup automatically generates
passwords which are also available after the installation in the
grommunio-setup logfile, `/var/log/grommunio-setup.log`.

.. important::
   If the configuration fails for any reason, grommunio-setup can be re-run.
   However, any re-configuration from scratch is **destructive** and will
   re-initialize the installation. If you intend to change any system-related
   parameters, use the grommunio administration interface instead. Any re-run
   grommunio-setup invocation will warn and ask for confirmation before
   deleting any data.

.. important::
   The installation process is logged in **/var/log/grommunio-setup.log**. Note
   that this file has all instance configuration used to configure
   grommunio-setup. As a subscription owner, you are entitled for support,
   where, for example, you can send the installation log to grommunio if you
   need any help. (Password references should be removed.)

.. important::
   It is recommended after successful information to store the installation log
   in a safe place and delete it from the appliance. Alternatively, the
   installation log can be stored safely somewhere as reference of any
   credentials of your installation for later use.

grommunio Admin User
********************

During the process of grommunio-setup, some accounts are automatically
generated - such as a database account for user management and also for the
initial grommunio administrator (admin).

.. important::
   The admin user of grommunio and the root user of the appliance are
   separated, non-synced users. The admin user is solely known to the grommunio
   Administration framework and is (intentionally) not a system user. The
   credentials of both users are to be kept safe. The root user is the main
   system administrator while admin is the main grommunio administrator. They
   can (and should) have different passwords, with the role concept of
   grommunio it is even recommended not to work with these passwords in
   production, but instead create less privileged for regular tasks performed.

.. note::
   The password of the primary admin user can be changed anytime by using
   grommunio-cui or by executing ``grommunio-admin passwd --password
   "ChangeMe"``

Repository configuration
************************

The interactive configuration tool grommunio-setup requests subscription
credentials during execution. If you own a valid subscription, enter your
subscription details. Without a valid subscription, grommunio-setup activates
the community repositories, which are without support and contain
non-quality-tested packages. With a valid subscription, your subscription
repository is activated and delivers commercial-grade packages for the
installation to keep up-to-date with latest features and fixes.

.. note::
   To receive a valid subscription, contact any of our partners or via our
   established communication channels at `<https://grommunio.com>`_

Certificates
************

With grommunio-setup, you are able to choose from multiple choices for
certificate installation:

#. **Creation of self-signed certificate**

   Creating your own self-signed certificate is the simplest option - Creating
   an own self-signed certificate will though show up as untrusted at first
   connect and needs to be trusted before continuing. This behavior is normal
   and is because any client that connects has no possibility validation if the
   certificate has a valid source. This setting is the default and does not
   require any preparation for certificate generation. grommunio does not
   recommend this option for production environments, as this option requires
   any client to first trust the certificate in use. This option is the best
   for validation and demo installations of grommunio.

#. **Creation of own CA (certificate authority) and certificate**

   Creating your own certificate authority is an extended option which allows
   you to create self-signed certificates with an own certificate authority.
   This way, you can (manually) create further certificates under the umbrella
   of a own central authority with multiple server certificates to be signed by
   the same certificate authority generated by yourself. This option is the
   best for validation and demo installation of larger installations of
   grommunio with multiple instances.

#. **Import of an existing TLS certificate from files**

   Importing your own certificate allows any type of external certificate pair
   (PEM-encoded) to be used with your grommunio installation. Note that it is
   recommended to either use SAN certificates with multiple domains or a
   wildcard certificate. With your choice of your own TLS certificates, you
   have the highest flexibility to either use a trusted CA or a publicly signed
   certificate by an officially trusted certification authority including, but
   not limited to, Thawte, Digicert, Comodo or others.

#. **Automatic generation of certificates with Let's Encrypt**

   Using this option allows the automatic certificate generation process with
   the Let's Encrypt certificate authority. Using Let's Encrypt certificates is
   free of charge, however the terms of service by Let's Encrypt apply, which
   are referenced during installation. Using this option automatically requests
   the domains from the selection you made, and automatically starts the
   validation process. For this automated process to work successfully, Let's
   Encrypt verifies _all_ defined domain names by creating a challenge on the
   appliance. For this to work, port 80 (HTTP) needs to be accessible from the
   Internet during this step of verification (and any subsequent automated
   renewal) with all the domains pointing to the appliance. This option is
   recommended for any simple installation and allows the most seamless
   installation experience if prepared correctly.

Any certificates so generated are placed in ``/etc/grommunio/ssl`` and are
automatically referenced by any services of the appliance.

Firewall
========

For seamless operation, the grommunio appliance opens different ports so that
clients can access it. Note that all of the following ports are made available
by default:

- 25 (smtp)
- 80 (http)
- 110 (pop3)
- 143 (imap)
- 443 (https)
- 993 (imaps)
- 995 (pop3s)
- 8080 (admin) (disabled per default)
- 8443 (admin https)

Generally, it is recommended to only make available the ports that are required
for service access. Note that grommunio's major protocols, RPC over HTTP,
MAPI/HTTP, EWS (Exchange Web Services) and EAS (Exchange ActiveSync) are all
accessed via port 443 (HTTPS).

When operating with proxies and load balancers, note that for successful
operation of proxying RPC, special configuration needs to be in place. The
required HTTP transport modes required to operate RPC over proxies are
RPC_IN_DATA and RPC_OUT_DATA. Known supported proxy software to support these
RPC data channels are: haproxy, squid, nginx and apache.
