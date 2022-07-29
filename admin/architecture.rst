############
Architecture
############

Component architecture
======================

While grommunio is distributed as appliances, grommunio is also available as
packaged software. The packaging is oriented on the modular component structure
of the software modules available by grommunio. The modular component layout of
grommunio allows a component-based deployment for all sorts of deployments and
operations - ranging from single deployments with high-density component layout
to scale-out, distributed component layout.

.. image:: _static/img/component_architecture.png
   :alt: Architecture of grommunio components

The grommunio component layout supports a wide range of deployment types:

- Containers (Docker, LXC)
- Virtual machines (KVM, VMware, Hyper-V)

The appliances shipped by grommunio contain all components required for
operation by the use of packages which are available for updates via
repositories. The appliances ship these packages as part of the appliance
distribution to be able to operate the installation without external repository
activation necessary (whilst deploying with active internet connection for
updates at deployment is strongly encouraged).

To understand the component architecture and the interconnectivity of these
components, the following chapters show the single components and how they
interoperate with other components in the entire component stack.

Protocol / Component Flow
-------------------------

grommunio is a comprehensive communication and collaboration solution that
covers and delivers protocols with a vast variety of computer standards for
communication. The main protocols delivered by grommunio are:

Wire-level protocols:

- SMTP
- IMAP
- POP3

Application-level protocols (HTTP-based):

- RPC/HTTP (OutlookAnywhere)
- MAPI/HTTP
- EWS (Exchange Web Services)
- EAS (Exchange ActiveSync)
- CalDAV
- CardDAV

With these numerous protocols available, grommunio needs to have an effictient
component flow. Since protocols may be accessed in parallel for the same
dataset, grommunio takes care of parallelization and protocol tracking. To
ensure operation, security and functionality, grommunio uses a set of different
components as well as a plugin-based structure for larger components. This way,
components may be extended for future feature expansion and allows
nearly-realtime patches and updates. More complex setups gain from the
component/plugin architecture as the scalability of the components allow
various flavors of containerization and orchestration.

The following illustration shows the combined protocol and component flow for
grommunio Groupware based components:

.. image:: _static/img/diag_workflow_protocol.png
   :alt: Protocol and component flow of grommunio Groupware

SMTP
----

SMTP is the main protocol used for mail transport. For illustration purposes,
there is a distinction made of the internal mail flow as well as external mail
flow.

The entire transport is configured to be gapless in terms of email processing.
This way, grommunio protects also from internal outbreaks (for example spam or
virus distribution).

The configuration outlined here defines the default configuration set. In many
cases, even more sophisticated setups might be envisioned, as with extended
integration of security appliances. The following workflows provide the process
definition which provides a view to where a preferred hook might be
implemented.

Incoming
~~~~~~~~

.. image:: _static/img/diag_workflow_smtpin.png
   :alt: SMTP workflow of incoming mails
   
Incoming mails are processed as follows:

#. The shipped MTA postfix receives the mails and processes these to
#. grommunio-antispam which automatically checks the email for spam
   evaluation. If configured,
#. grommunio-antispam (optionally) sends the email to an anti-virus processing
   service. After this check, the mail is handled back to
#. grommunio-antispam which utilizes
#. postfix do distribute the email to the
#. gromox-delivery-queue process which effectively shows up in the users'
   mailbox.

Outgoing / Internal
~~~~~~~~~~~~~~~~~~~

.. image:: _static/img/diag_workflow_smtpout.png
   :alt: SMTP workflow of outgoing mails

Outgoing / Internal mails are processed as follows:

#. The shipped MTA postfix receives the mails via direct port 25 transport and
   processes these to
#. grommunio-antispam which automatically checks the email for spam evaluation.
   If configured,
#. grommunio-antispam (optionally) sends the email to an anti-virus processing
   service. After this check, the mail is handled back to
#. grommunio-antispam which utilizes
#. postfix do distribute the email to the
#. gromox-delivery-queue process which effectively shows up in the users'
   mailbox **or** (depending on the configuration) relays the email to the next
   relayhost or attempts direct delivery.

RPC/HTTP, MAPI/HTTP & EWS workflow
----------------------------------

.. image:: _static/img/diag_workflow_rpcews.png
   :alt: RPC & EWS workflow

The main protocols used by grommunio for MAPI-based connectivity - as used for
example with Microsoft Outlook - are:

- RPC/HTTP (OutlookAnywhere)
- MAPI/HTTP
- EWS (Exchange Web Services)

All of these protocols are HTTP-based which is why these are routed through the
shipped nginx web server, primarily for security, scalability and monitoring
reasons.

MAPI-based connections are processed as follows:

#. In the first stage, the endpoint utilizes AutoDiscover
   (`https://docs.microsoft.com/en-us/exchange/architecture/client-access/autodiscover <https://docs.microsoft.com/en-us/exchange/architecture/client-access/autodiscover>`_)
   technology (with Authentication) to discover which service endpoint URL is
   responsible for it.
#. If the AutoDiscover endpoint ends up at the same service (If not, it will be
   redirected to the other endpoint URL), nginx routes the connection directly
   to the gromox-http service which handles the connection.
#. For access to the users' mailbox, gromox-http's emsmdb plugin connects to
   the exmdb plugin for mailbox data delivery.
 
Exchange ActiveSync (EAS)
-------------------------

.. image:: _static/img/diag_workflow_eas.png
   :alt: Exchange ActiveSync (EAS) workflow

The main protocol used for mobile devices and tablets is Exchange ActiveSync
(EAS). EAS is a synchronization state-based protocol which uses state data to
determine its current synchronization status. EAS is often synonymously
reffered to as "Push Mail", since it is permanently connected to its service
and listening for updates. As such, EAS is recommended as protocol for mobile
devices especially over unreliable networks, such as cellular networks. While
it is possible to connect certain clients, including Microsoft Mail and
Microsoft Outlook, it is strongly discouraged to do so. Compared to its more
performing alternatives, such as MAPI/HTTP, the EAS protocol is slower for bulk
data transfer or large to very large (10 GB+) mailboxes. At last, the EAS
protocol only delivers a subset of features available to other protocols.

EAS-based connections are processed as follows:

#. In the first stage, the endpoint utilizes AutoDiscover
   (`https://docs.microsoft.com/en-us/exchange/architecture/client-access/autodiscover <https://docs.microsoft.com/en-us/exchange/architecture/client-access/autodiscover>`_)
   technology (with Authentication) to discover which service endpoint URL is
   responsible for it.
#. If the AutoDiscover endpoint ends up at the same service (If not, it will be
   redirected to the other endpoint URL), nginx routes the connection to
   grommunio-sync which natively provides the /Microsoft-Server-ActiveSync
   endpoint to its device.
#. For access to the users' mailbox, grommunio-sync connects to gromox-zcore
   which delivers PHP-MAPI interfaces to access
#. gromox-http via exmdb plugin for mailbox data delivery.

POP3
----

.. image:: _static/img/diag_workflow_imap.png
   :alt: IMAP workflow

IMAP workflow

IMAP
----

.. image:: _static/img/diag_workflow_pop3.png
   :alt: POP3 workflow

POP3 workflow

Authentication
--------------

.. image:: _static/img/diag_workflow_auth.png
   :alt: Authentication workflow

Authentication workflow
