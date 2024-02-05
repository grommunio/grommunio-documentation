..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2024 grommunio GmbH

############
Introduction
############

This Administrator Manual covers everything regarding installation, operation
and maintenance of the grommunio software suite. The intended audience for this
documentation is administrators and system operators deploying
grommunio.

About
=====

grommunio delivers a fully-featured communication solution which covers all
aspects of the software-defined era. As a modern and modular platform,
grommunio helps to simplify all needs of modern communication by providing the
following feature set:

- E-Mail
- Calendar
- Contacts
- Tasks
- Notes
- Video meetings
- Chat
- File sync & share
- Web office

Overview & Concepts
===================

grommunio is shipped as an integrated software appliance for deployment on
target systems by combining an embedded, optimized operating system, based on
openSUSE. While grommunio is also shipping software repositories for major
Linux platforms, the software appliance allows quick deployment on a variety of
platforms, including bare metal and virtualized environments.

Architecture
============

grommunio's software component stack is modular and consists of the following
main components:

.. list-table::
    :widths: 10 50 10
    :header-rows: 1

    * - Component
      - Function
      - Component Group
    * - **gromox-delivery**, **gromox-delivery-queue**
      - Local delivery agent that places messages received from Postfix into mail stores
      - grommunio Groupware
    * - **gromox-event**
      - Software bus inter-process communication (IPC) mechanism that allows
        communication between multiple processes running concurrently on
        multiple machines.
      - grommunio Groupware
    * - **gromox-http**
      - The mail store (exmdb), and HTTP interface for RPCH, EWS, and optional
        FastCGI passthrough
      - grommunio Groupware
    * - **gromox-imap**
      - IMAP interface providing industry-leading performance to IMAP clients
      - grommunio Groupware
    * - **gromox-pop3**
      - POP3 interface
      - grommunio Groupware
    * - **gromox-zcore**
      - Bridge process between PHP-MAPI and exmdb
      - grommunio Groupware
    * - **gromox-midb**
      - Message index database, mostly an acceleration mechanism for use by IMAP
      - grommunio Groupware
    * - **grommunio-antispam**
      - grommunio-antispam not only keeps your mail service clean from spam but
        also provides interfaces for anti-virus scanning and filtering
      - grommunio Groupware
    * - **grommunio-admin-api**
      - A REST interface for automation and which provides the main API for
        grommunio's administration web interface
      - grommunio Admin
    * - **grommunio-admin-web**
      - grommunio-admin-web is the central administration interface for
        system, domain and user management
      - grommunio Admin
    * - **grommunio-web**
      - grommunio-web is the user's main web interface delivering a rich user
        experience to browser-based clients
      - grommunio web service
    * - **grommunio-sync**
      - grommunio-sync provides the main EAS (Exchange ActiveSync) service for
        native clients, such as iOS, Android and other EAS-capable clients
      - grommunio web service
    * - **grommunio-dav**
      - grommunio-dav provides the main CardDAV and CalDAV service for native
        clients, such as macOS and other capable clients
      - grommunio web service
    * - **grommunio-files**
      - grommunio-files provides the file sync and share functionality,
        available to web and native clients
      - grommunio Files
    * - **grommunio-chat**
      - grommunio-chat provides the main enterprise chat functionality,
        available to web and native clients
      - grommunio Chat
    * - **grommunio-meet**
      - grommunio-meet is the web-based enterprise meeting feature, available
        to web and native clients
      - grommunio Meet
    * - **grommunio-office**
      - grommunio-office is the web-based document collaboration software
        suite, available to web clients
      - grommunio Office
    * - **grommunio-archive**
      - grommunio-archive delivers a legally conform archiving solution, available
        to web clients
      - grommunio Archive

Other software components used in combination with grommunio:

- MariaDB is the central database for all user metadata which provides the main
  database for all backend services. No user payload data (e-mails, etc.) are
  stored in this database.

- Postfix provides world-class functionality and versatility as the de-facto
  standard MTA which allows even the most advanced mail routing setups.

- nginx is a fast, robust and modern web server acting as the main web server
  and providing major services via HTTP and RPC to clients.

- SQLite is used for storage of the individual users' mailbox stores.

Some parts of grommunio are shipped as forks of other successful open source
software. While grommunio only ships the open variants (with some integration
features added), many of these open source vendors deliver enterprise variants
of their software components. If the software component is covered by the
grommunio subscription, grommunio delivers support for the open source variants
of these components as well. Using the enterprise variants of the respective
vendors is supported from an integration perspective, yet not for the vendors'
product.

At grommunio, the top priority is to deliver a seamless communication and
collaboration experience for users and a turnkey installation experience for
administrators. These ambitions have led to the inclusion of other software
components with additions (such as authentication through a single stack). This
way, the integration effort for administrators is kept low, while users benefit
from the interaction of multiple software components, delivering a seamless
experience.

As a reference, the components of software products forked as part of the
grommunio stack are:

- grommunio-files is a fork of Nextcloud with authentication and setup
  enhancements (`https://nextcloud.com/ <https://nextcloud.com/>`_)
- grommunio-meet is a fork of Jitsi with integration enhancements
  (`https://jitsi.org/ <https://jitsi.org/>`_)
- grommunio-office is a fork of OnlyOffice web with integration enhancements
  (`https://www.onlyoffice.com/ <https://www.onlyoffice.com/>`_)
- grommunio-chat is a fork of an open source chat platform with authentication and integration
  enhancements
- grommunio-archive is a fork of Piler with authentication and integration
  enhancements (`https://www.mailpiler.org/ <https://www.mailpiler.org/>`_)
- grommunio-antispam is a fork of rspamd with integration enhancements
  (`https://rspamd.com/ <https://rspamd.com/>`_)

grommunio maintains and integrates these software solutions with the delivery
targets offered by grommunio, such as software appliance and well-packaged
software components available for all major Linux distributions. All these
components are fully supported by grommunio based on the respective
subscription level.

In case an environment or similar installation exists, these components can be
integrated on an interface level. Note that grommunio can not support
installations not packaged by grommunio. However, if existing enterprise
installations are available, the integration of these
systems is possible with the correct configuration in place. grommunio
subscriptions deliver support for integrations with these enterprise variants
or even - based on the interfaces available - alternative solutions.

grommunio delivers a variety of interfaces which allow other solutions to
integrate with grommunio. Because of the modular nature of grommunio's software
distribution, there is no forced need to use the extra components delivered by
grommunio. For turnkey solutions, especially in the SMB market, shipping these
components with the simplified integration effort helps administrators to
install and operate grommunio as a comprehensive communication platform within
just a few minutes.
