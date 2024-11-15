..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2024 grommunio GmbH

AutoDiscover
============

Introduction
------------

Autodiscover is a HTTP-based discovery protocol that helps users configure their
email client settings automatically.
To locate the Autodiscover endpoint itself, a client can utilize the Domain
Name System (DNS). When joined to an ActiveDirectory domain, it can also do AD
queries for Service Connection Point objects.

When a user sets up a new email account or changes their existing email client
settings, the email client sends an Autodiscover request to the Autodiscover server.
The Autodiscover request is an HTTP POST request that contains the user's email
address. The Autodiscover server then responds with an
XML response that contains the necessary configuration settings.

The Autodiscover XML response contains information such as

* the list of supported mail protocols and transports (e.g.
  MSRPC/RPCH/MAPIHTTP, IMAP, SMTP, etc.)
* the connection parameters for those (e.g. name of the
  home server, HTTP endpoint URLs)
* for MAPI, any extra mailboxes that should be opened unconditionally
  (e.g. delegators, public folder)

The email client uses this information to configure the user's email account
automatically.

Autodiscover V2 is not an improved version, it is an extra layer that warrants
a disgruntled remark about questionable protocol design. Locating the
AutoDiscover server still happens via DNS or AD-SCP query. The V2 request
contains the user identity and the name of a next-level protocol that the
client seeks, e.g. "ActiveSync", "EWS" or "AutoDiscoverV1". The response is now
a JSON document and generally contains just one URL, namely for the service
sought. Indeed there is no way to obtain MAPI, IMAP or SMTP information in
Autodiscover V2.

Please note that Autodiscover is not used exclusively by Microsoft Outlook,
Autodiscover is the main discovery protocol for any EAS-enabled device and
application, such as Apple iOS, Android and other applications.

DNS records
-----------

There are different DNS records that clients can attempt to resolve to locate
AutoDiscover servers. Some clients may just try one, some may try multiple. The
exact behavior depends on the client. There is no specific order required. When
HTTP requests are issued to the servers found via DNS (and/or AD-SCP), *even
more* AutoDiscover server candidates may be collected if there are HTTP
redirects.

* Name: <domain>

  Type: A & AAAA, or CNAME

  Value: <address or canonical name of Autodiscover server>

  That is, a client working with the identity ``user@example.com`` *may* try to
  resolve ``example.com`` and request
  ``https://example.com/Autodiscover/Autodiscover.xml`` next.

* Name: autodiscover.<domain>

  Type: A & AAAA, or CNAME

  Value: <address or canonical name of Autodiscover server>

  That is, a client working with the identity ``user@example.com`` *may* try to
  resolve ``autodiscover.example.com`` and request
  ``https://autodiscover.example.com/Autodiscover/Autodiscover.xml`` next.

* Name: _autodiscover._tcp.<domain>

  Type: SRV

  Value:

    * Priority: 10
    * Weight: 10
    * Port: 443
    * Target: autodiscover.<domain>

  That is, a client working with the identity ``user@example.com`` *may* try to
  resolve ``_autodiscover._tcp.example.com``, and request
  ``http://<target>/Autodiscover/Autodiscover.xml`` next.

CNAME is mutually exclusive with other types, for a given name. Confer with
your DNS manual.

Note that the DNS records should be created in the public DNS
zone for your domain. Once the DNS records have propagated, users can configure
their email client settings automatically using Autodiscover.

If the DNS records are published only on private DNS servers without being
publicly resolvable, most clients will fail to discover the endpoint correctly,
for example Microsoft Outlook uses Microsoft servers for discovery if the
explicit endpoint request (``ExcludeExplicitO365Endpoint``) has not been
disabled appropriately.

For successful discovery, the endpoint should be available
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
  ``https:///example.net/autodiscover.xml`` or
  ``https://example.net/autodiscover/autodiscover.xml``.

* ``ExcludeHttpsAutoDiscoverDomain``

  Outlook does not use the AutoDiscover domain to locate the AutoDiscover
  service. For example, Outlook does not use the following URL:
  ``https://example.net/autodiscover/autodiscover.xml``

* ``ExcludeHttpsRootDomain``

  When this option is enabled, Outlook will skip trying the URL
  ``https:///example.net/autodiscover.xml`` of your primary SMTP address to
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

The OXDISCO module uses the oxdisco_exonym setting when making references to
itself in AutoDiscover responses. This can be specified in ``gromox.cfg``, if
not, it will default to the re-resolved kernel hostname, the latter of which
can be inspected with the ``hostname --fqdn`` command. If the exonym is not
fully-qualified, clients such as Outlook will likely not succeed in connecting
if they do not happen to have a suitable domain search list.

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

.. image:: _static/img/oldisco.png

An alternative way to validate AutoDiscover request & responses is to use the
Gromox command-line utility ``PASS=abcd gromox-dscli -e user@domain``.
