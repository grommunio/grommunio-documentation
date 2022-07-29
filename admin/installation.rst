############
Installation
############

This chapter includes details on how to install grommunio.

grommunio Appliance
===================

grommunio delivers ready-to-use appliances for:

- bare metal or virtualized environments (ISO)
- container environments (docker)
- specialized, automated virtualization environments (OVA)

and a community image to run grommunio on a raspberry pi.

.. note::
   There are multiple ways of automation and deployment for grommunio available. Not all of these methods can be described - If you are looking for a special deployment type, don't hesitate to get in contact with one of grommunio's partners or with grommunio directly. grommunio is available from very small installations to large, hyperscale installations with millions of users.

To deploy grommunio via ISO, you need to make the installation media available to your installation target. The ISO is a generic, bootable installation medium which works in most scenarios. To deploy the ISO with bare metal, the ISO can be imaged to USB drives for simplified installation.

The grommunio Appliance is a general-purpose installation target, which comes with all components required for successful operation of grommunio. It already includes the operating system for simplified management and allows general purpose usage. Every appliance installation is automatically deployed with update servers ready-configured and services prepared for usage. If you are seeking a general-purpose and simple deployment, grommunio Appliance is the right place for you. Simplified update management, backups and full portability allow the appliance to operate for any installation target sizing 1-2000 users with adequate hardware sizing. For larger installations or installations with special deployment needs, such as - but not limited to - geographically split, cluster or hyperscale installations, please refer our partners and/or our support/professional services team. Alternatively, the combined information from the manual installation in this chapter together with the man page sections are a mighty tool to build the grommunio setup of your needs.

grommunio Appliance configuration with CUI/setup
------------------------------------------------

The grommunio console user interface (``grommunio-cui``) provides a
console interface which allows the administrator to perform basic
tasks to ready the appliance for
the admin UI (admin web interface) or admin CLI (admin command line
interface), such
as network configuration and time synchronization.

.. image:: _static/img/cui_1_main.png
   :alt: Main screen of grommunio-cui

Main screen
-----------

After starting ``grommunio-cui``, you are in the main screen. Upon login, you
are able to make system configuration changes.

In the main screen, the following functions are available:

- F1: Switching the color scheme (light vs. dark mode)
- F2: Login to unlock system configuration mode
- F5: Switching of keyboard layout
- L: Open system log viewer

Login
-----

.. image:: _static/img/cui_2_login.png
   :alt: Login

To enter into system configuration mode, press ``F2`` and log in with the system
superuser account (``root``).

.. important::
   The initial root password is unset (empty). When asked for password at first
   login, just enter an empty password.

Main configuration screen
-------------------------

The main menu provides the following functionality available to ``grommunio-cui``:

- Change system password
- Network configuration
- Timezone configuration
- Timesync configuration
- grommunio setup wizard
- Change Admin Web UI password
- Terminal
- Reboot
- Shutdown

.. image:: _static/img/cui_3_mainconfig.png
   :alt: Main configuration screen of grommunio-cui

Change system password
----------------------

The menu entry ``Change system password`` opens a window for setting the superuser
(``root``) account password. Do this directly after installation. Use a secure password.
We recommend using a password comprised of four words or more.

.. image:: _static/img/cui_4_change_sys_pass.png
   :alt: Changing the superuser password with grommunio-cui

Network configuration
---------------------

The menu entry ``Network configuration`` starts the network configuration utility
(``yast2 lan``), which provides support for all reasonable network
configuration settings. For detailed information on how to configure the
network by using the ``yast`` utility, refer to the online documentation
of YaST at
`https://documentation.suse.com/sles/15-SP3/html/SLES-all/cha-network.html#sec-network-yast
<https://documentation.suse.com/sles/15-SP3/html/SLES-all/cha-network.html#sec-network-yast>`_

.. image:: _static/img/cui_5_network.png
   :alt: Network configuration with YaST

.. important::
   The minimal set of configuration recommended to be changed includes:
   Hostname, Network Addressing (IP address), DNS (Nameservers), Routing (Default
   Gateway).

.. important::
   Note that using the domain ``localhost`` is not a valid hostname
   and/or ``local`` is not a valid domainname. Make sure to set the
   hostname and FQDN properly at all setup and installation stages for operating
   with a valid configuration.

Hostname & FQDN setup
~~~~~~~~~~~~~~~~~~~~~

It is a
requirement to setup the hostname and domainname correctly.

Additionally, for local name resolving of services to work properly, the
correct entries should be either available in DNS or setup in ``/etc/hosts``.

To do this with the appliance, set the fully qualified domain name (FQDN) in the
interface settings (which will be mirrored to ``/etc/hosts``) and in the
"Hostname/DNS" tab (the static hostname relates to ``/etc/hostname``). This way,
any services of the appliance will be able to use the correct adressing based
on the domain and host. A correct hostname/DNS setup is mandatory, especially for
multi-host setups.

.. important::
   To verify the settings, the command ``hostname`` should return the
   FQDN of the system.

.. image:: _static/img/yast_hostname_interface.png
   :alt: Hostname configuration on the interface

.. image:: _static/img/yast_hostname_system.png
   :alt: Generic hostname configuration of the system

Timezone configuration
----------------------

The menu entry ``Timezone configuration`` can be used to set the preferred
timezone displayed in server logs, etc. It has no practical impact on e-mails,
because mail user agents such as grommunio-web translate timestamps to the
timezone of the particular device the program is running on anyway.

.. image:: _static/img/cui_6_timezone.png
   :alt: Timezone configuration with YaST

Timesync configuration
----------------------

Timesync configuration is done with a simple interface providing the ability to
set the timezone according to your region and timezone of that region. It
generally is recommended to keep the setting ``Hardware Clock Set to UTC``,
since this provides the recommended timezone-agnostic behavior for services
(such as with logs, etc.).

.. image:: _static/img/cui_7_timesync.png
   :alt: Timesync configuration

After these basic setup, your grommunio Appliance should:

- be able to connect to the Internet (availability of Updates, etc.)
- have a valid timezone set
- have a valid timeserver configured, with the system time appropriately
  synchronized

grommunio setup wizard
----------------------

With the previous basic setup steps completed, it is recommended to run the
grommunio setup wizard to complete the configuration based on your needs.

The menu entry ``grommunio setup wizard`` initiates the ``grommunio-setup``
program which walks you through the initial setup of grommunio.

.. important::
   While grommunio-setup can be executed more than once,
   running through the setup process of grommunio-setup always resets the
   entire installation. grommunio-setup automatically detects if it has been
   run already and will warn you that, if you continue, all data stored will be
   lost.

Welcome screen
~~~~~~~~~~~~~~

Starting ``grommunio-setup`` presents you with a descriptive welcome screen.

.. image:: _static/img/cui_8_setup_welcome.png
   :alt: grommunio-setup: welcome screen

Repository setup
~~~~~~~~~~~~~~~~

As first step, ``grommunio-setup`` requests you to enter subscription details.
These subscription details are included in your purchase of the product,
alongside with the subscription certificate delivered for installation at a
later stage. If left empty, grommunio-setup will automatically include the
community repositories.

.. note::
   Community repositories are delivered on a best-effort basis and are not
   supported. While grommunio welcomes community members to use grommunio, the
   software distribution available with the subscription repositories include
   production-relevant benefits. Subscription repositories (available only with
   a valid subscription) include quality-tested packages, hotfixes and extra
   features not available with community repositories.

.. image:: _static/img/cui_9_setup_repository.png
   :alt: grommunio-setup: repository setup

Database variant
~~~~~~~~~~~~~~~~

In the next stage of ``grommunio-setup``, you are requested to specify which
central database type you want to configure. Most installations use the local
database installation, where the MySQL-database is initialized and prepared
automatically. For larger and/or special setups, e.g. clusters, multi-node and distributed setups, it might be recommended to
connect to an already existing database instead.

.. image:: _static/img/cui_10_setup_dbchoice.png
   :alt: grommunio-setup: choice of database variant

Database settings
~~~~~~~~~~~~~~~~~

With the choice of "local database", the next installation step will
automatically provide you with information which is used for initialization of
the database. For standard setups, it is recommended to go with the default
values. The values for the installation are generated randomly, which protects
your installation from unauthorized access.

.. image:: _static/img/cui_11_setup_dbsettings.png
   :alt: grommunio-setup: settings for database initialization

Administration User
~~~~~~~~~~~~~~~~~~~

After setting up the database, a default administrator password is requested
for the login with the grommunio Admin API. The default user (``admin``) is
then initialized with the password entered here. By default, grommunio
automatically generates a password and shows it at the end of the setup
procedure.

.. important::
   At the end of the setup procedure, the password entered here will be shown in
   the summary screen after setup. Make sure no unauthorized people are
   accessing or viewing the system console for retrieval of this major
   credential.

.. note::
   You can always reset this password at a later stage through ``grommunio-cui``.

.. image:: _static/img/cui_12_setup_adminpw.png
   :alt: grommunio-setup: setting of the admin password

Fully Qualified Domain Name
~~~~~~~~~~~~~~~~~~~~~~~~~~~

The next stage of ``grommunio-setup`` requests the configuration of the fully
qualified domain name (FQDN). The FQDN traditionally consists of the
**hostname**, combined with the primary **domain** of the system. The name
chosen here is strongly recommended to be part of the certificates generated at
a later stage in ``grommunio-setup``.

.. image:: _static/img/cui_13_setup_fqdn.png
   :alt: grommunio-setup: setting the fully qualified domain name (fqdn)

Primary mail domain
~~~~~~~~~~~~~~~~~~~

By continuing to the next stage, it is requested to provide the primary mail
domain. The primary mail domain is important as main system domain for further
system configuration.

.. image:: _static/img/cui_14_setup_primarydomain.png
   :alt: grommunio-setup: setting the primary mail domain

Relayhost configuration
~~~~~~~~~~~~~~~~~~~~~~~

If the installation is not to be directly sending E-Mails (by resolving the
recipients' MTAs directly), a relayhost is recommended to be set. This next
step allows the configuration of a relayhost which for example can be used for
integration with existing firewalls or mail security appliances. If the
configured target should be used directly (by requesting the IP address through
DNS A records instead of the associated MX records), the relayhost should be
enclosed with square brackets, like "[mail.isp.com]".

.. image:: _static/img/cui_15_setup_relayhost.png
   :alt: grommunio-setup: configuration of relayhost

TLS configuration
~~~~~~~~~~~~~~~~~

The next step of configuration with ``grommunio-setup`` provides a menu with a
choice of the preferred TLS setup with the grommunio installation:

.. image:: _static/img/cui_16_setup_tlsmode.png
   :alt: grommunio-setup: choosing the TLS installation mode

0: **Creation of self-signed certificate**

   Creating your own self-signed certificate is the simplest option - Creating
   an own self-signed certificate will though show up as untrusted at first
   connect and needs to be trusted before continuing. This behavior is normal
   and is because any client that connects has no possibility validation if the
   certificate has a valid source. This setting is the default and does not
   require any preparation for certificate generation. grommunio does not
   recommend this option for production environments, as this option requires
   any client to first trust the certificate in use. This option is the best
   for validation and demo installations of grommunio.

.. image:: _static/img/cui_17_setup_selfsigned.png
   :alt: grommunio-setup: Creating a self-signed certificate

1: **Creation of own CA (certificate authority) and certificate**

   Creating your own certificate authority is an extended option which allows
   you to create self-signed certificates with an own certificate authority.
   This way, you can (manually) create further certificates under the umbrella
   of a own central authority with multiple server certificates to be signed by
   the same certificate authority generated by yourself. This option is the
   best for validation and demo installation of larger installations of
   grommunio with multiple instances.

.. image:: _static/img/cui_18_setup_ownca.png
   :alt: grommunio-setup: Creating own certificate authority (CA) and certificate

2: **Import of an existing TLS certificate from files**

   Importing your own certificate allows any type of external certificate pair
   (PEM-encoded) to be used with your grommunio installation. Note that it is
   recommended to either use SAN certificates with multiple domains or a
   wildcard certificate. With your choice of your own TLS certificates, you
   have the highest flexibility to either use a trusted CA or a publicly signed
   certificate by an offically trusted certification authority including, but
   not limited to, Thawte, Digicert, Comodo or others.

.. image:: _static/img/cui_19_setup_importcert.png
   :alt: grommunio-setup: Importing existing certificate

3: **Automatic generation of certificates with Let's Encrypt**

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

.. image:: _static/img/cui_20_setup_letsencrypt.png
   :alt: grommunio-setup: Generating Let's Encrypt certificates

Any certificates so generated are placed in ``/etc/grommunio/ssl`` and are
automatically referenced by any services of the appliance.

Setup finalization
~~~~~~~~~~~~~~~~~~

After all above steps of ``grommunio-setup`` have been completed, the final
dialog shows the summarized information of the installation is shown as
reference.

.. image:: _static/img/cui_21_setup_final.png
   :alt: grommunio-setup: Setup finalization

.. important::
   All installation/setup relevant information is stored at
   /var/log/grommunio-setup.log. This file includes the passwords used for
   initialization which you may copy to a secure location or delete if not
   required anymore.

Admin web password reset
------------------------

The menu entry ``Admin web password reset`` changes the password of the main
administration user (``admin``). For administrators which want to execute this
option without running ``grommunio-cui`` first, this can be done anytime by
executing the command ``grommunio-admin passwd``.

.. image:: _static/img/cui_22_admin_passwd.png
   :alt: Admin Web password reset

Terminal
--------

The option ``Terminal`` enables a class shell with the ability to exit back to
``grommunio-cui`` by issuing the ``exit`` command at any given time. This
option should be used with care and only by experienced administrators.

.. image:: _static/img/cui_23_terminal.png
   :alt: Staring Terminal (root privileges)

.. important::
   Note that the Terminal executed here provides full administrative
   rights (root access) to the Appliance. With this level of permissions it is
   recommended to proceed with extreme caution.

Reboot
------

.. image:: _static/img/cui_24_reboot.png
   :alt: Rebooting grommunio Appliance

The option ``Reboot`` reboots the entire grommunio Appliance. Note that
during the reboot the services provides will not be available.

Shutdown
--------

.. image:: _static/img/cui_25_shutdown.png
   :alt: Shut down grommunio Appliance

The option ``Shutdown`` shuts down the entire grommunio Appliance. Note
that until the Appliance has been made available again by starting it again,
the services will not be available.

grommunio Manual
================

While for the majority of installations the grommunio Appliance delivers a comprehensive solution for most installation targets, some special needs might not be possible to satisfy. For these cases, grommunio can be installed manually with guidance from this chapter. 

.. note::
   grommunio is a comprehensive communication and collaboration solution with many services and components. With this modularity, grommunio is extremely versatile and allows various installation types which all of them can't be covered in detail. This section is intentionally held as generic as possible
   
.. important::
   Please note that this section it targeted at adept administrators who are experienced in advanced linux administration and configuration.

This chapter assumes a basic system is running already. *Basic* in this regard
means:

* a system service manager of some kind should be running (systemd, sysvinit,
  etc.)
* the system should be in its typical multi-user state (in terms of systemd,
  *multi-user.target* should have at least been started; in terms of sysvinit,
  init level 3 or 5)
* should have an interactive shell for you to use
* should not be ephemeral and not lose its state when turned off

Establish networking
--------------------

.. code-block:: sh

	localhost:~ # networkctl
	IDX LINK  TYPE     OPERATIONAL SETUP
	  1 lo    loopback carrier     unmanaged
	  2 host0 ether    routable    configured

	2 links listed.

	localhost:~ # networkctl status host0
	  2: host0
			     Link File: n/a
			  Network File: /etc/systemd/network/host0.network
				  Type: ether
				 State: routable (configured)
			  Online state: online
			    HW Address: aa:b2:5f:b1:9d:46
				   MTU: 1500 (min: 68, max: 65535)
				 QDisc: noqueue
	  IPv6 Address Generation Mode: none
		  Queue Length (Tx/Rx): 32/32
		      Auto negotiation: no
				 Speed: 10Gbps
				Duplex: full
				  Port: tp
			       Address: 88.198.85.196
					2a01:4f8:10b:45d8::f27
			       Gateway: 195.201.56.39
					2a01:4f8:10b:45d8::1
		     Activation Policy: up
		   Required For Online: yes

	Mar 31 23:47:13 localhost systemd-networkd[22]: host0: Link UP
	Mar 31 23:47:13 localhost systemd-networkd[22]: host0: Gained carrier

For this particular container, I had enabled ``systemd-networkd`` and put the
network configuration in place apriori. If anything, this section is but a
reminder to hook up the host to Internet, as it will be needed to get at
package repositories later. The particular method of network configuration
varies wildly between operating systems, and not every system is using
systemd-networkd. Consult the documentation relevant for your environment to
get online.

[Text screenshot of iproute2 output in a command shell]

.. code-block:: sh

	mail:~ # ip a
	1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
	    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
	    inet 127.0.0.1/8 scope host lo
	       valid_lft forever preferred_lft forever
	    inet6 ::1/128 scope host
	       valid_lft forever preferred_lft forever
	2: host0@if17: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
	    link/ether aa:b2:5f:b1:9d:46 brd ff:ff:ff:ff:ff:ff link-netnsid 0
	    inet 88.198.85.196/32 scope global host0
	       valid_lft forever preferred_lft forever
	    inet6 2a01:4f8:10b:45d8::f27/128 scope global
	       valid_lft forever preferred_lft forever

IPv6 is mandatory on the host itself. If you have ``::1`` assigned, all is
good.

You are well advised to install and configure a packet filter, a.k.a. a
firewall, with the sensible default of disallowing every service by default,
save perhaps for a way to let yourself in. More details will be presented
throughout the sections going forward. The summary though:

* open VPN, SSH and/or port 8443 (AWEB) for the admin as desired
* open smtp/25 for server-to-server mail passing as needed
* open https/443 for end-user interactions
* open imaps, pop3s for end-user interactions if desired


Declare hostname identity
-------------------------

If you have not consciously set a hostname yet, do so now, especially if some
default setting has left you with localhost as the hostname. You cannot
reasonably reach localhost from another machine without unnecessary pains.

I decided to use ``route27.test`` for the domain part of later e-mail addresses
(e.g. ``someuser@route27.test``), and this particular machine that Grommunio
will be installed on has received a hostname of ``mail.route27.test``.
Arbitrary names can be chosen so long as they make sense for their intended
network.


Package manager setup
---------------------

Visit `<https://download.grommunio.com>`_ to get an idea of the list of platforms for
which pre-built packages have been made available. Even though different
operating systems may use the same archive format (RPM, DEB, etc.) or
repository metadata formats (rpm-md, apt), do not use a repository which does
not exactly match your system. Do not use Debian packages for an Ubuntu system
or vice-versa. Do not use openSUSE packages for a Fedora system or vice-versa.
Do not even remotely think of converting between formats.

zypp
~~~~

openSUSE uses yum-style ``.repo`` files for declaring repositories. Based on
the Tumbleweed container introduced earlier, one can create a file
``/etc/zypp/repos.d/grommunio.repo`` and populate it like so:

.. code-block:: ini

	[grommunio]
	enabled=1
	autorefresh=1
	baseurl=https://download.grommunio.com/community/openSUSE_Tumbleweed
	type=rpm-md
	keeppackages=0

Retrieve the GPG key and import it into the RPM database to trust it. Then,
optionally, download the repository metadata (if not, it will be done the next
time you install anything).

.. code-block:: sh

	curl https://download.grommunio.com/RPM-GPG-KEY-grommunio >gr.key
	rpm --import gr.key

dnf
~~~

RHEL uses ``.repo`` files as well, though in another directory. The file to edit
would be ``/etc/yum.repos.d/grommunio.repo``, with contents:

.. code-block:: ini

	[grommunio]
	enabled=1
	autorefresh=1
	baseurl=https://download.grommunio.com/community/EL_8
	type=rpm-md
	keeppackages=0

Import the GPG key likewise, then proceed to use dnf or yum commands to update
at your leisure.

apt
~~~

For Debian, one is to add into ``/etc/apt/sources.list.d/grommunio.list``:

.. code-block:: sh

	deb [trusted=yes] https://download.grommunio.com/community/Debian_11 Debian_11 main

Then import the GPG key and proceed to use apt commands to update at your
leisure.

For Ubuntu installations, the ``universe`` repository is required in addition
to the base install.


TLS certificates
----------------

For obtaining a certificate, refer to external documentation.

* Self-signed certificate: https://stackoverflow.com/a/10176685
* Using Let's Encrypt: https://certbot.eff.org/instructions

The certificate's key strictly needs to be passwordless, as most services have
no way to interactively ask for a password (they are launched in the background
anyway).

A certificate with a *subjectAltName* (SAN) field, or even a wildcard
certificate may be desirable for the domain, if you plan on using multiple
subdomains, e.g. ``meet.route27.test`` for *grommunio-meet*.

Autodiscover clients, as part of their setup attempts, try to resolve and use
``autodiscover.route27.test``. Having a SAN for this subdomain is however not
strictly necessary; we can report that Autodiscover also works without this
domain. See `MS-OXDISCO §3.1.5
<https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxdisco/d56ae3c6-bf29-4712-b274-2e4cc5fdaa64>`_
about all the ways.

Advance list about which entities will prospectively need access to the
certificate(s):

* gromox

* nginx

* postfix (optional)

Some of the processes may read TLS certificates and their keyfiles *after*
switching to an unprivileged user identity. As a result, these files may need
to be enhanced with a filesystem ACL or, failing that, duplicate copies be made
with suitable ownership.


nginx
-----

nginx is used as a frontend to handle all HTTP requests, and to forward them to
further individual services. For example, RPC/HTTP requests will be delegated
to Gromox for further processing, Administration API (AAPI for short) requests
will be delegated to an uwsgi instance for further processing, and Mattermost
requests to the chat API.

An alternative HTTP server may be used if you feel comfortable in configuring
*all* of it, however this guide will only focus on nginx. Now then, source the
nginx package from your operating system, and have the service started both on
next boot and immediately.

In this screenshot, we also requested the installation of the nginx VTS module,
which AAPI can *optionally* for reporting traffic statistics. VTS is
**not** available for all platforms, in which case you have to omit and make do
without it.

Being the main entrypoint for everything, the nginx HTTPS network service will
need to be configured in the packet filter to be accessible (publicly). In
other words, open port 443.

By *default*, debian-based distributions ship default web server configs which
are in conflict with grommunio. It is recommended, to remove the default web
service entry, mostly located at ``/etc/nginx/sites-available/default```. By
simply removing this file, the webserver default website is disabled.

It is recommended to just alter configuration snippets under ``/etc/`` including
admin-api configuration, since ``/usr/share``  ships the default configurations.
There should be no requirement to adapt this default set of configuration files,
if there are special cases, the base configuration can be adapted with multiple
inclusion points throughout the configuration tree, enabling customized setups.


nginx support package
~~~~~~~~~~~~~~~~~~~~~

We have a package that contains the first set of premade configuration
fragments for nginx. Do install the ``grommunio-common`` package.

.. code-block:: sh

	zypper in grommunio-common

The nginx default configuration as shipped by Linux distributions (file
``/etc/nginx/nginx.conf``) contains a line ``include conf.d/*``. The support
package places a file to ``/etc/nginx/conf.d/grommunio.conf``, such that the
nginx-related grommunio configuration gets automatically loaded on the next
nginx (re-)start.

The actual fragment files for nginx are located under
``/usr/share/grommunio-common`` for packaging policy reasons; they are not
meant to be modified. They do however has further ``include`` directives
pointing back to ``/etc`` to facilitate overriding specific aspects.

``/usr/share/grommunio-common/nginx/locations.d/autodiscover.conf`` for example
contains the fragment that tells nginx to recognize the ``/Autodiscover`` space
and forward such requests to gromox-http on port 10443 (see later section).


TLS for nginx
~~~~~~~~~~~~~

Create ``/etc/grommunio-common/nginx/ssl_certificate.conf`` and populate with
the certificate directives, exchanging paths as appropriate:

.. code-block:: nginx

	ssl_certificate zzz.pem;
	ssl_certificate_key zzz.key;

(The exact chain of includes is ``/etc/nginx/nginx.conf`` -> ``/etc/nginx/conf.d/grommunio.conf`` -> ``/usr/share/grommunio-common/nginx.conf`` -> ``/etc/grommunio-common/nginx/ssl_certificate.conf``.)

The port 80 and 443 listen declarations are provided by
``/usr/share/grommunio-common/nginx.conf``.

nginx config check
~~~~~~~~~~~~~~~~~~

nginx's configuration can be tested and shown, respectively:

.. code-block:: sh

	nginx -t
	nginx -T


MariaDB
-------

MariaDB/MySQL is used to store the user database amongst a few auxiliary
configuration parameters. If you plan on erecting a multi-host Gromox cluster,
this database is the one that is meant to be globally available to all nodes
that will eventually be running Gromox services.

A preexisting MariaDB server may be used. All the standard tools and
procedures that the world community has developed around SQL are applicable, in
terms of e.g. configuration, backup/restore, and replication.

Assuming though that you are going for a new SQL server instance, source the
MariaDB packages from your operating system, and have the service started
both on next boot and immediately.

After the installation, do create a blank database and user identity for
accessing it.

.. code-block:: sql

	CREATE DATABASE `grommunio`;
	GRANT ALL ON `grommunio`.* TO 'grommunio'@'localhost' IDENTIFIED BY 'freddledgruntbuggly';

The MariaDB network service is not meant to be open to the public Internet.
Within your private network, it may need to be opened if (and only if) you plan
on using it in a multi-host Grommunio setup, or when your plans about database
replication demand it.

In certain versions, such as MySQL 8 (on e.g. Ubuntu 20.04), the GRANT
statement no longer implicitly creates users and one must use `CREATE USER
<https://dev.mysql.com/doc/refman/8.0/en/create-user.html>`_ instead.
Furthermore, authentication with MariaDB/older MySQL clients may fail due to
what appears to be a hashing method change; the remedy is an extra parameter
for CREATE USER or `ALTER USER
<https://stackoverflow.com/questions/49194719/>`_.


Gromox
------

Gromox is the central groupware server component of grommunio. It provides
the services for Outlook RPC, IMAP/POP3, an LDA for ingestion, and a PHP
module for Z-MAPI.

The package is available by way of the Grommunio repositories. This guide is
subsequently based on such a pre-built Gromox. Experts wishing to build from
source and who have general knowledge on how to do so are referred to the
`Gromox installation documentation
<https://github.com/grommunio/gromox/doc/install.rst>`_ on specific aspects of
the build procedure.

Gromox runs a number of processes and network services. None of them are meant
to be open to the public Internet, because nginx is already that important
point of ingress. The Gromox exmdb service (port 5000/tcp by default) needs to
be reachable from other Gromox nodes in a multi-host grommunio setup for
reasons of internal forwarding to a mailbox's home server.

Daemon executables are located in ``/usr/libexec/gromox``, they have short
names like ``http``, ``zcore``, etc. The manpage carries the same name, so you
would use ``man http`` to call up the corresponding manpage. The configuration
files read by default follow the same scheme, e.g. ``/etc/gromox/http.cfg``.
Process infomration utilities such as ps(1) may show the full path of the
executable or just ``http``, depending on how these diagnostic utilities are
used. The systemd unit name, though, is ``gromox-http.service``.

All log output goes to stderr. When run from systemd, this is automatically
redirected to the journal.


User database
~~~~~~~~~~~~~

The connection parameters for MariaDB need to be conveyed to Gromox with the
file ``/etc/gromox/mysql_adaptor.cfg``, whose contents could look like this::

	mysql_username=grommunio
	mysql_password=freddledgruntbuggly
	mysql_dbname=grommunio
	schema_upgrade=host:mail.route27.test

The data stored in MariaDB is shared among all mailbox nodes in a clustered
setup. Table schema (DDL) changes are necessary at times, but at most one node
in such a cluster should perform these changes to avoid running the risk of
corruption. The hostname after ``host:`` specifies which machine will be
considered authoritative, if any. The ``schema_upgrade=host:...`` line should
be consistent across all mailbox nodes. It is possible to completely omit
``schema_upgrade``, at which point no updates will be done automatically.

With Gromox instrumented on the SQL parameters, proceed now with performing the
initial creation of the database tables by issuing the command:

.. code-block:: sh

	gromox-dbop -C

If automatic schema upgrades are disabled, manual updates can be performed
later with:

.. code-block:: sh

	gromox-dbop -U


gromox-event/timer
~~~~~~~~~~~~~~~~~~

* event: A notification daemon for an interprocess channel between
gromox-imap/gromox-midb. No configuration needed.
* timer: An at(1)/atd(8)-like daemon for delayed delivery. No configuration
needed.

.. code-block:: sh

	systemctl enable --now gromox-event gromox-timer


gromox-http
~~~~~~~~~~~

Because nginx was set up earlier as a frontend to listen on ports 80 and 443,
gromox-http needs to be moved "out of the way" (its built-in defaults are also
80/443). In addition, the daemon needs to be told the paths to the TLS
certificates. A manual page is provided with all the configuration directives
and can be called up with ``man 8gx http``. For now, these directives for
``/etc/gromox/http.cfg`` should suffice:

.. code-block:: ini

	listen_port=10080
	listen_ssl_port=10443
	http_support_ssl=yes
	http_certificate_path=zzz.pem
	http_private_key_path=zzz.key

Run the service.

.. code-block:: sh

	systemctl enable --now gromox-http

Perform a connection test. The expected result of requesting the ``/`` URI will
be a 404 status code. (It could serve a static HTML file, but the default
config has no such file, and ``/`` is not mapped anywhere. Maybe we should
change that…)

.. code-block:: sh

	curl -kv https://localhost:10443/

Expected output:

.. code-block:: sh

	> GET / HTTP/1.1
	> Host: localhost:10443
	…
	< HTTP/1.1 404 Not Found
	…

Gromox's default config does however has a mapping for ``/web`` (to
``/usr/share/grommunio-web``). If you happen have the ``grommunio-web`` package
already installed, requests to this subdirectory can be responded to. You can
test the following URLs (port 10443 for gromox-http directly, 443 for nginx,
respectively) with curl from the server command-line, and it should serve a
static file:

.. code-block:: sh

	curl -kv https://localhost:10443/web/robots.txt
	curl -kv https://localhost:443/web/robots.txt
	# firefox https://mail.route27.test/web/robots.txt

Using a browser from a separate desktop machine is also possible provided port
10443 was made accessible. (Normally, 10443 need not be exposed to any other
hosts.) The result for localhost:10443 and localhost:443 should be the same.
Expected output:

.. code-block:: sh

	< HTTP/1.1 200 OK
	< Date: Tue, 29 Mar 2022 23:08:33 GMT
	< Content-Type: text/plain
	< Content-Length: 26
	< Accept-Ranges: bytes
	< Last-Modified: Tue, 29 Mar 2022 07:09:12 GMT
	< ETag: "19165e1100000000-1a000000-98b0426200000000"
	<
	User-agent: *
	Disallow: /


gromox-midb & zcore
~~~~~~~~~~~~~~~~~~~

The IMAP Message Index Database, and the bridge process for PHP-MAPI. No
further configuration needed.

.. code-block:: sh

	systemctl enable --now gromox-midb gromox-zcore


gromox-imap & pop3
~~~~~~~~~~~~~~~~~~

Similar to ``http.cfg``, convey to the IMAP/POP3 daemons the TLS certificate
paths. Skip this section if you do not intend to run these protocols.

IMAP/POP3 can run in unencrypted mode, but only for developers. Hence,
imap_force_starttls is set here. In ``/etc/gromox/imap.cfg``, declare:

.. code-block:: ini

	listen_ssl_port=993
	imap_support_starttls=true
	imap_certificate_path=zzz.pem
	imap_private_key_path=zzz.key
	imap_force_starttls=true

In ``/etc/gromox/pop3.cfg``:

.. code-block:: ini

	listen_ssl_port=995
	pop3_support_stls=true
	pop3_certificate_path=zzz.pem
	pop3_private_key_path=zzz.key
	pop3_force_stls=true

Enable/start zero or more of the services you wish to utilize. Adjust
your packet filter configuration for these new ports as needed.

.. code-block:: sh

	systemctl enable --now gromox-imap gromox-pop3

Trivial testing can be performed with a utility like *telnet*, *socat*; but
*curl* is quite sophisticated in its own right and can issue IMAP/POP3 protocol
commands.

.. code-block:: sh

	curl -kv imaps://localhost/
	curl -kv pop3s://localhost/

Expected output for IMAP:

.. code-block:: sh

	*   Trying ::1:993...
	…
	< * OK mail.route27.test service ready
	> A001 CAPABILITY
	< * CAPABILITY IMAP4rev1 XLIST SPECIAL-USE UNSELECT UIDPLUS IDLE AUTH=LOGIN STARTTLS
	< A001 OK CAPABILITY completed
	…

Expected output for POP3:

.. code-block:: sh

	*   Trying ::1:995...
	* TCP_NODELAY set
	* Connected to localhost (::1) port 995 (#0)
	…
	< +OK mail.route27.test pop service ready
	> CAPA
	< +OK capability list follows
	< STLS
	< TOP
	< USER
	< PIPELINING
	< UIDL
	< TOP
	< .
	> LIST
	< -ERR login first


PHP-FPM
-------

The installation of the ``gromox`` package should have already pulled in
php-fpm as a dependency.

For completeness, verify that PHP knows about the MAPI module.

.. code-block:: sh

	echo -en '<?php phpinfo(); ?>' | php | grep mapi

Verify that the gromox pool file was placed.

.. code-block:: sh

	ls -al /etc/php8/fpm/php-fpm.d/gromox.conf

Then enable/start php-fpm:

.. code-block:: sh

	systemctl enable --now php-fpm

For completness, verify that the socket in the pool file was created:

.. code-block:: sh

	ls -al /run/gromox/php-fpm.sock

Try to elicit a response from the Autodiscover code, via gromox-http (10443)
and/or nginx (443).
(``/usr/share/grommunio-common/nginx/locations.d/autodiscover.conf`` defines
the handler for the ``/Autodiscover`` URI path, to pass all requests to
gromox-http on port 10443. gromox-http forwards this to php-fpm. This way,
Autodiscover also works in test setups without a frontend like nginx.)

.. code-block:: sh

	curl -kv https://localhost:10443/Autodiscover/Autodiscover.xml
	curl -kv https://localhost:443/Autodiscover/Autodiscover.xml
	# firefox https://mail.route27.test/Autodiscover/Autodiscover.xml

Expected result of this operation:

.. code-block:: sh

	> GET /Autodiscover/Autodiscover.xml HTTP/1.1
	> Host: localhost:10443
	…
	< HTTP/1.1 200 Success
	< Date: Tue, 29 Mar 2022 23:54:16 GMT
	< Transfer-Encoding: chunked
	< Content-type: text/html; charset=UTF-8
	<
	E-2000: invalid request method, must be POST!


Administration API (AAPI)
-------------------------

Install the ``grommunio-admin-api`` package. This package contains a
command-line interface, and an application server implemented using uwsgi.

.. code-block:: sh

	zypper in grommunio-admin-api

Edit ``/etc/grommunio-admin-api/conf.d/database.yaml`` to make AAPI aware of
the MariaDB configuration:

.. code-block:: yaml

	DB:
	  host: 'localhost'
	  user: 'grommunio'
	  pass: 'freddledgruntbuggly'
	  database: 'grommunio'

Set the password for the AAPI admin. This shell command can also be used later
to recover from a lost password situation.

.. code-block:: sh

	grommunio-admin passwd

grommunio Admin Web supports the exposure of the available features to be seen in
the upper left corner. Since grommunio can be installed in a distributed way, this
setting can be configured in ``/etc/grommunio-admin-common/config.json``.

.. code-block:: json

        {
                "mailWebAddress": "https://mail.example.com/web",
                "chatWebAddress": "https://mail.example.com/chat",
                "videoWebAddress": "https://mail.example.com/meet",
                "fileWebAddress": "https://mail.example.com/files",
                "archiveWebAddress": "https://mail.example.com/archive"
        }

This configuration file needs to be made available to nginx, ideally in the pluggable
location of ``/etc/grommunio-admin-common/nginx.d/web-config.conf``.

.. code-block:: nginx

        location /config.json {
          alias /etc/grommunio-admin-common/config.json;
        }

The main user of the uwsgi server is the Administrator Web interface (AWEB), so
do enable/start the service now.

.. code-block:: sh

	systemctl enable --now grommunio-admin-api


Permissions
~~~~~~~~~~~

AAPI can and will write to certain system configuration files, such as
``/etc/gromox``. The AAPI uwsgi application server itself runs unprivileged too
and needs write permission there. The recommendation is ``root:gromox`` with
mode 0775 on ``/etc/gromox``. Individual files within that directory should be
0660 since they contain credentials sometimes.


nginx support package for AAPI/AWEB
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The installation of ``grommunio-admin-api`` or ``grommunio-admin-web`` also
pulls in ``grommunio-admin-common``, which places a number of nginx fragments
into the filesystem similar to the earlier ``grommunio-common``.

The package adds nginx configuration fragments to make it listen on port 8080
unencrypted. You can edit ``/etc/nginx/conf.d/grommunio-admin.conf`` and
disable the inclusion of ``/usr/share/grommunio-admin-common/nginx.conf``
and/or enable encrypted access by uncommenting
``/usr/share/grommunio-admin-common/nginx-ssl.conf``. The latter will make
nginx listen on port 8443.

Create ``/etc/grommunio-admin-common/nginx-ssl.conf`` as a file, or as a
symlink to ``/etc/grommunio-common/nginx/ssl_certificate.conf`` to the existing
TLS directives.

.. code-block:: sh

	ln -s /etc/grommunio-common/nginx/ssl_certificate.conf /etc/grommunio-admin-common/nginx-ssl.conf

Reload/restart nginx as needed. Adjust your packet filter configuration for the
new ports as needed.

The fragment files installed a route for the ``/api/v1`` URI space to be
forwarded to the uwsgi process. It is now possible to make requests to the AAPI
endpoints, and we can test for that with curl or even firefox.

.. code-block:: sh

	curl -kv https://localhost:8443/api/v1/login
	# firefox https://mail.route27.test:8443/api/v1/login

The expected result is a JSON response.

.. code-block:: sh

	…
	< HTTP/1.1 405 METHOD NOT ALLOWED
	…
	{"message":"Method 'GET' not allowed on this endpoint"}

An authenticated request can also be made:

.. code-block:: sh

	curl -kv https://localhost:8443/api/v1/login -d 'user=admin&password=freddledgruntbuggly'

Expected output:

.. code-block:: json

	{"grommunioAuthJwt":"eyJ0…"}


Administration Web Interface (AWEB)
-----------------------------------

AWEB is a package containing a HTML/JavaScript frontend and which will make use
of AAPI's endpoints via REST.

.. code-block:: sh

	zypper in grommunio-admin-web

Since this package contains just static files, the login page is now ready.
Visit ``https://mail.route27.test:8443/`` and log in with the credentials you
have previously assigned (username: ``admin``, password: as you did).

The details on how to use AWEB (sometimes also referred to as AUI) are provided
on the `Grommunio documentation website
<https://docs.grommunio.com/admin/administration.html#grommunio-admin-ui-aui>`_.


Known issues
------------

The systemd service list in the dashboard (subsection “Performance”, box
container in the left third) has action buttons to trigger systemctl
``enable/disable/start/stop/restart``. Despite the placement of the file
``/usr/share/polkit-1/rules.d/pkit-10-gromox.rules``, AAPI is unable to issue
systemctl commands, and a red error box with text ``Interactive authentication
required`` will appear.


Create domain & user
--------------------

Create the ``route27.test`` domain, and a user using AWEB. Afterwards, one can
test the login/use in various ways. For example, to run the Autodiscover
procedure from the command-line:

.. code-block:: sh

	PASS=abcdef /usr/libexec/gromox/autodiscover -e boop@route27.test

Expected output:

.. code-block:: xml

	<?xml version="1.0" encoding="utf-8"?>
	<Autodiscover xmlns="http://schemas.microsoft.com/exchange/autodiscover/responseschema/2006">
	<Response xmlns=…>

At your leisure, connect with Outlook.

To be able to log into IMAP/POP3, the user must have this feature explicitly
enabled. This can be changed using AWEB by going to the *Domains* ->
*route27.test* -> *Users* tab on the left-hand side navigation pane. Once
enabled,

.. code-block:: sh

	curl -kv imaps://localhost/ -u boop@route27.test:abcdef

Expected output:

.. code-block:: sh

	…
	> A001 CAPABILITY
	< * CAPABILITY IMAP4rev1 XLIST SPECIAL-USE UNSELECT UIDPLUS IDLE AUTH=LOGIN STARTTLS
	< A001 OK CAPABILITY completed
	> A002 AUTHENTICATE LOGIN
	< + VXNlciBOYW1lAA==
	> Ym9ua0Byb3V0ZTM4LnRlc3Q=
	< + UGFzc3dvcmQA
	> YWJjZGVm
	< A002 OK logged in
	> A003 LIST "" *
	< * LIST (\HasNoChildren) "/" {5}
	* LIST (\HasNoChildren) "/" {5}
	< INBOX
	…


grommunio-web
-------------

Install ``grommunio-web``. Verify that you can load the login page and login:

.. code-block:: sh

	curl -kv https://localhost:443/web/
	# firefox https://mail.route27.test/web/


Loopback mail
-------------

The *gromox-delivery-queue* and *gromox-delivery* services comprise the Local
Delivery Agent. This LDA supports a bit of SMTP to facilitate it being used in
a filter-free loopback scenario. That is, one can send mail from route27.test
to route27.test (only), with no SMTP to the outside.

(A mail composed and submitted with grommunio-web will ultimately be emitted by
the *gromox-zcore* process, which sends it to *localhost:25*. Alternatively, when
using Outlook, the *gromox-http* process emits the mail to *localhost:25*. And
on port 25, one can either run the LDA, or indeed a full MTA like Postfix.)

On some systems which exuberantly start services (hi Debian), you may need to
disable an existing MTA first before being able to perform this test.
(Alternatively, you can skip right the "Postfix" section below.)

.. code-block:: sh

	systemctl stop postfix
	systemctl enable --now gromox-delivery gromox-delivery-queue


Postfix
-------

Because *gromox-delivery-queue* listens on port 25 by default, it needs to be
moved out the way when putting a full MTA in its place. Edit
``/etc/gromox/smtp.cfg`` and declare:

.. code-block:: ini

	listen_port = 24

Within the Postfix configuration, we will be making use of the *mysql* lookup
plugin, so do install that alongside Postfix itself:

.. code-block:: sh

	zypper in postfix postfix-mysql

Set up a few Postfix directives:

.. code-block:: sh

	postconf -e virtual_alias_maps=mysql:/etc/postfix/g-alias.cf
	postconf -e virtual_mailbox_domains=mysql:/etc/postfix/g-virt.cf
	postconf -e virtual_transport="smtp:[localhost]:24"

Filenames for these additional configuration fragments, ``g-alias.cf``,
``g-virt.cf``, can be freely chosen. Add the MariaDB connection parameters to
the alias resolution fragment that (here) goes into
``/etc/postfix/g-alias.cf``:

.. code-block:: ini

	user = grommunio
	password = freddledgruntbuggly
	hosts = localhost
	dbname = grommunio
	query = SELECT mainname FROM aliases WHERE aliasname='%s'

Furthermore, add the MariaDB parameters to the domain resolution fragment, here
in ``/etc/postfix/g-virt.cf``:

.. code-block:: ini

	user = grommunio
	password = freddledgruntbuggly
	hosts = localhost
	dbname = grommunio
	query = SELECT 1 FROM domains WHERE domain_status=0 AND domainname='%s'

Finally, enable/restart the services so they can take their new places:

.. code-block:: sh

	systemctl enable --now gromox-delivery gromox-delivery-queue postfix
	systemctl restart gromox-delivery-queue postfix
