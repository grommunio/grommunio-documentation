..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2024 grommunio GmbH

##########
Operations
##########

Configuration
=============

Admin API TLS configuration
---------------------------

Since the process of the Admin API is relevant for the initial provisioning
stage, it is per default made available via port 8080 and unencrypted.
As soon as the setup
process has finished, it is advised to switch to a TLS-based configuration.

The shipped grommunio configuration files are prepared for setting up TLS
configuration with the existing configuration. To activate the TLS
configuration of grommunio-admin, execute the following steps:

.. code-block:: bash

   ln -s /etc/grommunio-common/nginx/ssl_certficate.conf /etc/grommunio-admin-common/nginx-ssl.conf

This assumes the configuration of the TLS certificates has been installed
successfully by the provisioning of grommunio Setup.

As a final step, uncomment the prepared configuration directive in the last line
of the configuration file ``/etc/nginx/conf.d/grommunio-admin.conf`` as
follows::

   vhost_traffic_status_zone shared:vhost_traffic_status:8m;

   # If you want to disable HTTP, take note that your configuration might
   # need adaptation in the admin api configuration in
   #   config.yaml -> options: -> vhosts: -> local:
   include /usr/share/grommunio-admin-common/nginx.conf;

   # Uncomment the following line to enable TLS for the admin interface.
   # Make sure to create /etc/grommunio-admin-common/nginx-ssl.conf
   # containing the certificate configuration
   include /usr/share/grommunio-admin-common/nginx-ssl.conf;

After a subsequent successful configuration check of the webserver configuration,
nginx may be restarted, and the Admin API is available on port 8443, e.g.
https://mail.example.com:8443 :

.. code-block:: bash

   # nginx -t
   nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
   nginx: configuration file /etc/nginx/nginx.conf test is successful

   # systemctl restart nginx

Note that by restarting the webserver, existing connections are
terminated.

Certificate management
----------------------

For the operation of grommunio, the use of TLS-based security is mandatory. With
TLS certificates in place, any communication with grommunio's services are
protected by state-of-the-art encryption, which is mandatory for many clients and
protocols.

If following the grommunio Setup path, also see
also `https://docs.grommunio.com/admin/administration.html#tls-configuration
<https://docs.grommunio.com/admin/administration.html#tls-configuration>`_.
Throughout the installation process, the
administrator has multiple choices for TLS-based installation. For seamless
operation, it is recommended to have a basic understanding of PKI concepts and the
X.509 standard for certificates. Generally, grommunio uses PEM-encoded
certificates.

If certificates need to be replaced, the certificates used by grommunio can be
found by default in the following locations:

* ``/etc/grommunio-common/ssl/server-bundle.pem`` (certificate bundle including
  certificate authority)
* ``/etc/grommunio-common/ssl/server.key`` (private key)

By changing the certificates, all services using these certificates need to be
restarted for the certificate to be used.

If Let's Encrypt has been chosen for installation, the service
``grommunio-certbot-renew.timer`` automatically runs weekly to perform any new
certificate request. The status of the timer service can be checked with:

.. code-block:: bash

   systemctl status grommunio-certbot-renew.timer

Updating grommunio
==================

Package Updates
---------------

During every installation of grommunio Appliance, it attempts to connect to
the community repository of grommunio. This way, community updates are directly
available to community users and can update the Appliance accordingly. Furthermore,
grommunio provides the operating system repositories which provide
state-of-the-art packages with latest updates available to the Linux operating
system based on openSUSE Leap, a binary compatible distribution of SUSE Linux
Enterprise Server.

.. note::
   Community repositories are delivered on a best-effort basis and are not
   supported. While grommunio welcomes community members to use grommunio, the
   software distribution available with the subscription repositories include
   production-relevant benefits. Subscription repositories (available only with
   a valid subscription) include quality-tested packages, hotfixes and extra
   features not available in community repositories.

For package management, the grommunio Appliances use ``zypper``. Zypper is the
package manager primarily used by SUSE-based distributions and is therefore
default for the grommunio Appliances. Zypper has many similarities to other
well-known package managers, such as ``dnf`` or ``apt``.

The default repository file, ``/etc/zypp/repos.d/grommunio.repo`` is shipped
with the following contents:

.. code-block:: ini

   [grommunio]
   enabled=1
   autorefresh=1
   baseurl=https://download.grommunio.com/community/packages/openSUSE_Leap_15.5/?ssl_verify=no
   type=rpm-md

The default configuration does not verify SSL/TLS certificates intentionally.
This enables support for:

* configuration-less automated proxy environments with SSL/TLS interception
* repository mirroring with selected partners and customers (hosting, large
  installations)

The integrity of all packages is secured by signatures on all packages distributed
by grommunio with the grommunio GPG key, of which the public key is available at
`https://download.grommunio.com/community/packages/RPM-GPG-KEY-grommunio
<https://download.grommunio.com/community/packages/RPM-GPG-KEY-grommunio>`_.

Your subscription credentials are provided to you via your grommunio partner and
enables the availability of production-grade grommunio packages. These packages
are quality-tested and only available to subscription customers.

To update your grommunio appliance with the most recent available updates,
execute the following steps:

.. code-block:: bash

   # zypper ref
   Repository 'base' is up to date.
   Repository 'debug' is up to date.
   Repository 'debug-update' is up to date.
   Repository 'grommunio' is up to date.
   Repository 'update' is up to date.
   All repositories have been refreshed.

   # zypper up
   Loading repository data...
   Reading installed packages...

   The following package is going to be upgraded:
    grommunio-admin-web

    1 package to upgrade.
    Overall download size: 1.8 MiB. Already cached: 0 B. After the operation, additional 696.0 B will be used.
    Continue? [y/n/v/...? shows all options] (y):
    Retrieving package grommunio-admin-web-1.0.1.8.6c8842f-lp153.1.1.noarch     (1/1), 1.8 MiB ( 15.0 MiB unpacked)
    Retrieving: grommunio-admin-web-1.0.1.8.6c8842f-lp153.1.1.noarch.rpm ....................................[done]
    Checking for file conflicts: ............................................................................[done]
    (1/1) Installing: grommunio-admin-web-1.0.1.8.6c8842f-lp153.1.1.noarch ..................................[done]

After the installation/update of some packages, services are not always
restarted automatically due to the nature of the potential implications of such
a restart during a package installation. For packages that have been updated
however, a manual restart of the service is recommended. The command ``zypper ps
-s`` lists such services that should be restarted at a convenient
time to have the new update in place. An example of such an operation is:

.. code-block:: bash

   # zypper ps -s

   zypper ps -s
   The following running processes use deleted files:

   PID  | PPID | UID | User | Command   | Service
   -----+------+-----+------+-----------+----------
   1553 | 1    | 0   | root | saslauthd | saslauthd

   You may wish to restart these processes.
   See 'man zypper' for information about the meaning of values in the above table.

   No core libraries or services have been updated since the last system boot.
   Reboot is probably not necessary.

   # systemctl restart saslauthd

Backup & Disaster Recovery
==========================

grommunio fully supports snapshot-based backups of all modern filesystems and/or
appliances. The snapshot mechanisms of the following filesystems, backup
solutions or storage systems are tested and supported:

- Acronis Backup
- Arcserve Unified Data Protection (UDP)
- Amanda Backup
- Amazon EBS snapshots
- Azure VM snapshots
- Bacula Backup
- Bareos Backup
- btrfs-based snapshots
- CephFS/RBD snapshots
- Commvault Hyperscale
- Dell EMC
- Docker-based snapshots (docker checkpoint)
- Google cloud persistent disk snapshots
- HP StoreVirtual
- Hitachi Vantara
- Huawei OceanStor
- Hyper-V snapshots
- KVM-based snapshots
- Kubernetes volume snapshots
- LVM-based snapshots
- LXC-based snapshots (lxc snapshot)
- NetApp
- NovaStor DataCenter
- Nutanix
- Pure Storage
- VMware snapshots
- Veeam Backup
- Veritas
- Xen-based snapshots
- ZFS-based snapshots

With the snapshot mechanism provided by the storage provider, snapshots can be
easily used to backup and restore entire mailboxes in a matter of seconds. For
restoring mailboxes to another mailbox's identity, it is recommended to ensure
the mailbox is not in active use (such as mobile devices, profile
synchronization).
After the restore operation has completed, it is advised to restart the services
``gromox-http`` and ``gromox-midb`` to invalidate any existing runtime caches:

.. code-block:: bash

   # systemctl restart gromox-http
   # systemctl restart gromox-midb

To backup your grommunio installation, the following backup artifacts are
relevant (per default):

1. grommunio Groupware (gromox):

- ``/var/lib/gromox/user``: directory hierarchy for private mailboxes
- ``/var/lib/gromox/domain``: directory hierarchy for public mailboxes
  (public folders)
- ``/var/lib/gromox/user/account@domain``: individual mailbox container
- MySQL database: ``grommunio``

2. grommunio Files:

- ``/var/lib/grommunio-files``
- MySQL database: ``grofiles``

3. grommunio Chat:

- ``/var/lib/grommunio-chat``
- MySQL database: ``grochat``

4. grommunio Archive:

- ``/var/lib/grommunio-archive``
- MySQL database: ``groarchive``

5. grommunio Appliance:

- File backup of ``/etc/grommunio*``
- File backup of ``/etc/nginx`` (if any non-standard configuration changes have been made)
- File backup of ``/etc/php7/fpm/php-fpm.d`` (if any non-standard configuration changes have been made)
- File backup of ``/etc/letsencrypt`` (if Let's Encrypt certificates are used)
- File backup of ``/etc/postfix`` (if any non-standard configuration changes have been made)

.. note::
   By using grommunio-dbconf, many file-based backups are not required. This is
   because dbconf stores configuration directives within the main grommunio database.

Database backup
---------------

Backup the grommunio databases ``grommunio``, ``grofiles``,
``groarchive`` and  ``grochat`` using standard procedures.
Most backup solutions provide MySQL database backup agents for easy integration.
For detailed backup options of your MySQL databases, refer to:
`https://dev.mysql.com/doc/refman/8.0/en/backup-types.html
<https://dev.mysql.com/doc/refman/8.0/en/backup-types.html>`_. If in doubt, the
built-in utility ``mysqldump``
(`https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html
<https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html>`_ can create single
SQL backup files of databases. A manual MySQL backup dump can
be issued with:

.. code-block:: bash

   mysqldump --single-transaction --routines --triggers --events --add-drop-database > grommunio-mysql-backup.sql


File-based backup
-----------------

Since grommunio works entirely on the basis of transactions, any file-based
backup is consistent at sync time, as long as it utilizes a "deltasync" based
operation. It is also possible to sync
files from the original operating location to a remote/mounted location for
disk-to-disk backup scenarios, if so desired. With rsync, the grommunio Appliance offers a
simple tool to synchronize data for this backup method. A manual file backup
based on deltasync functionality by rsync can be issued with:

.. code-block:: bash

   rsync -HPavS <from-directory> <to-directory>

Mail requeueing
===============

To requeue messages in Gromox that have failed delivery for any reason, follow
the steps outlined below. This process is particularly useful when dealing with
messages that have not been delivered due to various errors, and can be found in
the ``/var/lib/gromox/queue/save`` directory.

Locate Failed Messages: Navigate to the directory where failed messages are
stored by using the command ``cd /var/lib/gromox/queue/save``. This directory
contains messages that have not been successfully processed.

Listing Messages: Use the command ``ls -ltr`` to list the messages in the
directory.  This will display all the files sorted by modification time, making
it easier to identify and select the messages you wish to requeue.

Requeue Messages: To requeue the messages, they must be moved to the
``/var/lib/gromox/queue/mess`` directory. This can be done using the ``mv``
command. For example, to move a specific message, use:

.. code-block:: bash

   mv <filename> /var/lib/gromox/queue/mess/

Replace ``<filename>`` with the name of the message file you intend to requeue.
If you wish to requeue multiple messages, you can use wildcards or specify
multiple filenames separated by spaces.

Reprocessing: Once the messages are moved to the ``/var/lib/gromox/queue/mess``
directory, Gromox will automatically attempt to reprocess and deliver them. This
step does not require any additional action from the user.

Verification: After requeuing, it's a good practice to monitor the system logs
to ensure that the messages are being processed successfully. Use ``journalctl
-u gromox-delivery -u gromox-delivery-queue`` to check for any log entries
related to the requeued messages.

This process is essential for managing delivery issues within Gromox and
ensuring that all messages reach their intended recipients. If requeuing does
not resolve the delivery issues, further investigation into the cause of the
failure might be necessary, including checking system logs for errors and
reaching out to Grommunio Support for assistance.

A simple loop to re-queue all failed messages can be achieved by the following
snippet:

.. code-block: sh

   cd /var/lib/gromox/queue/
   j=0
   for i in save/*; do
           mv "$i" "mess/0$j"
           j=$(($j+1))
           echo "requeued $i"
   done


Size limits
===========

Grommunio operates using native MAPI storage, which imposes certain (soft)
restrictions. Although these are primarily theoretical, client limitations when
accessing grommunio are dictated more by the MAPI standard's guidance rather
than by MAPI's inherent limitations.

Most restrictions stem from the use of Microsoft Outlook as the primary client.
Outlook imposes its own set of limits, which we advise adhering to in order to
maintain compatibility and full functionality with Microsoft's suite of
products.

An object, in this context, could be an email, a calendar appointment, a task
entry, a contact, or a note.

We recommend observing the following limitations:

* Maximum size per object (Message size limit): 150 MB
* Maximum number of objects per folder (Message count limit): 1,000,000
* Maximum parts in multipart messages (MIME): 250 parts
* Maximum storage size: 100 GB (with a default of 50 GB)

Registry path for adjusting max OST size in Microsoft Outlook:

* ``HKEY_CURRENT_USER\Software\Microsoft\Office\<version>\Outlook\PST``
  ``MaxLargeFileSize`` (DWORD(32-bit), Decimal: 102400)

Please note:

.. note::

   These are not strict limitations set by grommunio; rather, they are
   recommended for smooth integration with Microsoft Outlook. These guidelines
   also align with those used in Microsoft Exchange On-premises and Exchange
   Online environments. Should you opt not to use Microsoft Outlook as your
   client, grommunio can support much larger limits. However, exceeding
   these recommended limits may affect performance, depending on your
   configuration.
