..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2024 grommunio GmbH

Container Installation
======================

While for the majority of installations the grommunio Appliance delivers a
comprehensive solution for most installation targets, some special needs might
not be possible to satisfy. For these cases, the grommunio base system and core
(groupware) can be installed on container management systems such as Kubernetes
and Docker Compose with guidance from this chapter.

.. info::
   grommunio is a comprehensive communication and collaboration solution with
   many services and components. With this modularity, grommunio is extremely
   versatile and allows various installation types which all of them can't be
   covered in detail. This section is intentionally held as generic as possible

This chapter assumes a basic system is running already. **Basic** in this regard
means:

* should have an interactive shell for you to use
* should not be ephemeral and not lose its state when turned off

We will build a container for the `Grommunio Core <https://grommunio.com/>`_ suite.

* Automatic configuration of various services
* Grommunio Core (gromox-http, gromox-antispam, gromox-event, gromox-midb,
  gromox-postfix,gromox-timer, gromox-zcore, gromox-imap, gromox-pop3,
  gromox-delivery, gromox-delivery-queue, gromox-admin, nginx, redis and
  php-fpm)
* Configurable via config files and environment variables.

.. note::
   Future versions will configure all variables via the environment

* This Container uses a `openSUSE Linux base
  <https://hub.docker.com/r/opensuse/leap>`_ and includes `s6 overlay
  <https://github.com/just-containers/s6-overlay>`_ enabled for PID 1 init capabilities.

.. note::
   This is a complex piece of software that tries to get you up and
   running with sane defaults, you will need to switch eventually over to manually
   configuring the configuration file when depending on your use case.

.. important::
   Do not use our defaults in production environments! Please adapt them according
   to your usage requirements.


Prerequisites and Assumptions
-----------------------------

This image assumes that you have an external `MySQL/MariaDB
<https://hub.docker.com/_/mysql>`_ container.
A useful prerequisite is to read the `grommunio documentation
<https://docs.grommunio.com/>`_.

Installation
------------

Automated builds of the image are available on `Docker Hub
<https://hub.docker.com/r/grommunio/gromox-core>`_ and is the recommended
method of installation.

.. code-block:: text
        docker pull grommunio/gromox-core:latest

Quick Start
~~~~~~~~~~~

* The quickest way to get started is using `docker-compose
  <https://docs.docker.com/compose/>`_ or `kubernetes
  <https://kubernetes.io/>`_.

  See the examples folder for a working
  `docker-compose example <https://github.com/grommunio/gromox-container>`_ and
  `kubernetes example <https://github.com/grommunio/gromox-kubernetes>`_ that
  can be modified (and **should be**) for development or production use.

* Set various `environment variables` to understand the capabilities of this image.
* Map `persistent storage` for access to configuration and data files for backup.

Configuration
-------------

Persistent Storage
~~~~~~~~~~~~~~~~~~

The following directories are used for configuration and can be mapped for
persistent storage.

.. list-table:: Persistent storage configuration
   :header-rows: 1

   * - Directory
     - Description
   * - `/home/certificates/`
     - Certificates for nginx and other services.
   * - `/home/plugins/`
     - YAML configuration files for Grommunio Admin API
   * - `/home/gromox-services/`
     - Configuration files for http, imap, pop3, mysql connection, smtp and others that will reside in `/etc/gromox`
   * - `/home/links/`
     - Configuration files for nginx additions and a script to generate grommunio admin API links to Grommunio web, Grommunio Meet etc.
   * `/home/nginx/`
     - SSL certificate configuration for nginx

Environment Variables
~~~~~~~~~~~~~~~~~~~~~

Below is the complete list of available options that can be used to customize
your installation.

**They will be added/updated as soon as components implement environment
variable based deployments natively.**

General Options
+++++++++++++++

.. list-table:: General options
   :header-rows: 1

   * - Parameter
     - Description
     - Default
   * - `FQDN`
     - Fully Qualified Domain Name
     - `mail.route27.test`
   * - `ADMIN_PASS`
     - Password for Admin user on Admin API

Database Options
++++++++++++++++

.. list-table:: Database options
   :header-rows: 1

   * - Parameter
     - Description
     - Default
   * - `DB_HOST`
     - Host or container name of MariaDB Server
   * - `MARIADB_DATABASE`
     - MariaDB Database name
     - `grommunio`
   * - `MARIADB_ROOT_PASSWORD`
     - MariaDB Root Password
   * - `MARIADB_USER`
     - MariaDB Username for above Database
     - `grommunio`
   * - `MARIADB_PASSWORD`
     - MariaDB Password for above Database

Shell Access
------------

For debugging and maintenance purposes you may want access the containers shell.

.. code-block:: text
        docker exec -it `<container-name>` gromox bash
