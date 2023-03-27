..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2022 grommunio GmbH

AutoDiscover
============

Introduction
------------

Autodiscover is a HTTP-based discovery protocol that helps users configure their
email client settings automatically. Autodiscover uses the Domain Name System
(DNS) to locate the Mail server that hosts a user's mailbox, and then retrieves
the necessary configuration settings.

When a user sets up a new email account or changes their existing email client
settings, the email client sends an Autodiscover request to the Mail server.
The Autodiscover request is an HTTP POST request that contains the user's email
address and domain name. The Exchange server then responds with an Autodiscover
XML file that contains the necessary configuration settings.

The Autodiscover XML file contains information such as the Mail server name,
server version, authentication methods, and SSL certificate information. The
email client uses this information to configure the user's email account
automatically.

Autodiscover V2 is an improved version of Autodiscover that was introduced with
Exchange Server 2013. Autodiscover V2 uses the same DNS records as Autodiscover
but has a different URL endpoint. The Autodiscover V2 JSON format is designed to
be more efficient and flexible than the XML format used by the original
Autodiscover. The Autodiscover V2 endpoint uses a URL format, for example:
https://autodiscover.<domain>.<tld>/autodiscover/autodiscover.json.

The Autodiscover V2 JSON format includes the same configuration settings as the
XML format, such as the Mail server name, server version, authentication
methods, and SSL certificate information. However, the JSON format allows for
additional settings to be included, such as mobile device management (MDM)
information.

To use Autodiscover V2 in Microsoft Outlook, the email client sends an
Autodiscover request to the Autodiscover V2 endpoint, which is typically located
at https://autodiscover.<domain>.<tld>/autodiscover/autodiscover.json. The
Autodiscover V2 endpoint then returns an Autodiscover V2 JSON file that contains
the necessary configuration settings.

Please note that Autodiscover is not used exclusively by Microsoft Outlook,
Autodiscover is the main discovery protocol for any EAS-enabled device and
application, such as Apple iOS, Android and other applications.

DNS records
-----------

The first DNS record is an A record that maps the Autodiscover service to the IP
address of the Mail server. This record is used by email clients that do not
support the Autodiscover V2 endpoint.

* ``Autodiscover`` record

  Type: A

  Name: autodiscover.<domain>.<tld>

  Value: <IP address of Mail server>

  **or**

  Type: CNAME

  Name: autodiscover.<domain>.<tld>

  Value: <alias>.<domain>.<tld>


The second DNS record is an SRV record that maps the Autodiscover V2 service to
the Autodiscover URL endpoint. This record is used by email clients that support
the Autodiscover V2 endpoint.

* ``AutodiscoverV2`` record

  Type: SRV

  Name: _autodiscover._tcp.<domain>.<tld>

  Priority: 10

  Weight: 10

  Port: 443

  Target: autodiscover.<domain>.<tld>

When an email client sends an Autodiscover request, it first looks for an SRV
record for the Autodiscover V2 service. If the SRV record is found, the email
client sends the Autodiscover request to the Autodiscover V2 URL endpoint. If
the SRV record is not found, the email client falls back to the original
Autodiscover URL endpoint.

It's important to note that the DNS records should be created in the public DNS
zone for your domain. Once the DNS records have propagated, users can configure
their email client settings automatically using Autodiscover or Autodiscover V2.

If the DNS records are published only on private DNS servers without being
publicly resolvable, most clients will fail to discover the endpoint correctly,
for example Microsoft Outlook uses Microsoft servers for discovery if the
explicit endpoint request (``ExcludeExplicitO365Endpoint``) has not been
disabled appropriately.

.. important::
   Please note that for successful discovery, the endpoint should be available
   from any network segment where client devices could be accessing the
   autodiscover as well as the service resolved by autodiscover as well. Depending
   on your setup, you might want to use techniques such as `Split-horizon DNS
   <https://en.wikipedia.org/wiki/Split-horizon_DNS>`_ or define your externally
   available adresses to be accessible from the internal networks as well, known
   as `NAT hairpinning or NAT reflection
   <https://en.wikipedia.org/wiki/Network_address_translation#NAT_hairpinning>_`.

Registry settings (MS Outlook)
------------------------------

To control the behavior of AutoDiscover from Microsoft Outlook clients, there
are two general possibilities: Windows registry or GPO (which set the
corresponding registry keys more user/admin friendly). The following main
configuration keywords apply:

* ``EnableOffice365ConfigService``

  In Outlook versions before 16.0.9327.1000, this URL was used to automatically
  provision O365 endpoints, overriding some AutoDiscover behavior

* ``ExcludeExplicitO365Endpoint``

  In Outlook 2016+ (versions after 16.0.6741.2017), this configuration
  parameter is used to proxy AutoDiscover requests via Microsoft servers. Usage
  of this service is possible

  # with grommunio if the AutoDiscover entries have been configured, and/or
  # when globally resolvable records are pointing to grommunio as the endpoint.

* ``ExcludeHttpRedirect``

  Outlook does not use the HTTP redirect method in the event it is unable to
  reach the AutoDiscover service via either of the HTTPS URLs:
  ``https:///mydomain.at/autodiscover.xml`` or
  ``https://mydomain.at/autodiscover/autodiscover.xml``.

* ``ExcludeHttpsAutoDiscoverDomain``

  Outlook does not use the AutoDiscover domain to locate the AutoDiscover
  service. For example, Outlook does not use the following URL:
  ``https://mydomain.at/autodiscover/autodiscover.xml``

* ``ExcludeHttpsRootDomain``

  When this option is enabled, Outlook will skip trying the URL
  ``https:///mydomain.at/autodiscover.xml`` of your primary SMTP address to
  locate the AutoDiscover service.

* ``ExcludeLastKnownGoodURL``

  Outlook will not use the last known good AutoDiscover URL.

* ``ExcludeScpLookup``

  Outlook does not perform Active Directory queries for Service Connection
  Point (SCP) objects with AutoDiscover information.

* ``ExcludeSrvRecord``

  Outlook does not use SRV record lookups in DNS to locate the AutoDiscover
  service.

These configuration settings are available via ADMX settings (category Outlook
2016), for details visit `Group Policy Home
<https://admx.help/?Category=Office2016&Policy=outlk16.Office.Microsoft.Policies.Windows::L_OutlookDisableAutoDiscover&Language=en-us>`_.

Alternatively, the records can be modified via the Windows registry, for example by
using the following .reg file fragment:

.. code-block::

	[HKEY_CURRENT_USER\Software\Microsoft\Office\16.0\Outlook\AutoDiscover]
	"ExcludeExplicitO365Endpoint"=dword:00000001
	"ExcludeLastKnownGoodURL"=dword:00000001
	"ExcludeHttpsRootDomain"=dword:00000001
	"ExcludeHttpsAutoDiscoverDomain"=dword:00000000
	"ExcludeHttpRedirect"=dword:00000000
	"ExcludeScpLookup"=dword:00000001
	"ExcludeSrvRecord"=dword:00000001
	"EnableOffice365ConfigService"=dword:00000000
	
	[HKEY_CURRENT_USER\Software\Policies\Microsoft\Office\16.0\Outlook\AutoDiscover]
	"ExcludeExplicitO365Endpoint"=dword:00000001
	"ExcludeLastKnownGoodURL"=dword:00000001
	"ExcludeHttpsRootDomain"=dword:00000001
	"ExcludeHttpsAutoDiscoverDomain"=dword:00000000
	"ExcludeHttpRedirect"=dword:00000000
	"ExcludeScpLookup"=dword:00000001
	"ExcludeSrvRecord"=dword:00000001
	"EnableOffice365ConfigService"=dword:00000000


This configuration example sets Outlook 2016+ to skip over any mechanisms
other than ``ExcludeHttpsAutoDiscoverDomain`` and ``ExcludeHttpRedirect``.


Gromox notes
------------

The OXDISCO module uses the host_id setting when making references to itself in
AutoDiscover responses. The host_id can be specified in ``http.cfg``, if not,
the host_id will be filled in from the system hostname (kernel hostname), the
latter of which can be inspected with the ``hostname`` or ``sysctl
kernel.hostname`` commands. If the host_id is not fully-qualified, clients such
as Outlook will likely not succeed in connecting if they do not happen to have a
suitable domain search list.

Because Outlook re-issues AutoDiscover requests every now and then and can
potentially pick up a new bad hostname from a misconfigured AutoDiscover
service, re-opening the mailbox may spuriously cease to function. Because OL
will also not re-run AutoDiscover when caches are present and before having
successfully opened the mailbox, bad hostnames are cumbersome to purge and need
manual intervention.

* Delete ``%LOCALAPPDATA%/Microsoft/Outlook/16/AutoD.*.xml``
* Delete ``%LOCALAPPDATA%/Microsoft/Outlook/* - Autodiscover.xml``


AutoDiscover in MS Outlook
--------------------------

In the Windows taskbar, in the notification area, there is an Outlook icon.
When this icon is Ctrl-right click, it brings up a service menu, and "Test
AutoDiscover" is one of the commands.

In this AutoDiscover test dialog, if the discovery reports HTTP error 401
Unauthorized, the cause is because that dialog stupidly uses an old saved
password and not the contents of the password field.

.. image:: oldisco.png

An alternative way to validate AutoDiscover request & responses is to use the
Gromox command-line utility ``PASS=abcd gromox-dscli -e user@domain``.
