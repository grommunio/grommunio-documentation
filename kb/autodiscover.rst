..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2022 grommunio GmbH

AutoDiscover
============

To control the behavior of AutoDiscover from Microsoft Outlook clients, there
are 2 general possibilities: Windows registry or GPO (which set the
corresponding registry keys more user/admin friendly). The following main
configuration keywords apply:

- EnableOffice365ConfigService

In Outlook versions before 16.0.9327.1000 this URL was used to automatically
provision O365 endpoints, overriding some AutoDiscover behavior

- ExcludeExplicitO365Endpoint

In Outlook 2016+ versions after 16.0.6741.2017, this configuration parameter
is used to proxy AutoDiscover requests via Microsoft. Usage of this service
is possible with grommunio, if the AutoDiscover entries have been configured
as well in globally resolvable records, pointing to grommunio as endpoint.

- ExcludeHttpRedirect

Outlook does not use the HTTP redirect method in the event it is unable to
reach the AutoDiscover service via either of the HTTPS URLs:
https:///mydomain.at/autodiscover.xml or
https://mydomain.at/autodiscover/autodiscover.xml

- ExcludeHttpsAutoDiscoverDomain

Outlook does not use the AutoDiscover domain to locate the AutoDiscover
service. For example, Outlook does not use the following URL:
https://mydomain.at/autodiscover/autodiscover.xml

- ExcludeHttpsRootDomain

Outlook does not use the root domain of your primary SMTP address to locate
the AutoDiscover service. For example, you select this optionOutlook does not
use the following URL: https:///mydomain.at/autodiscover.xml.

- ExcludeLastKnownGoodURL

Outlook does not use the last known good AutoDiscover URL.

- ExcludeScpLookup

Outlook does not perform Active Directory queries for Service Connection
Point (SCP) objects with AutoDiscover information.

- ExcludeSrvRecord

Outlook does not use an SRV record lookup in DNS to locate the AutoDiscover
service

These configuration settings are available via ADMX settings (category Outlook
2016), for details visit `Group Policy Home <https://admx.help/?Category=Office2016&Policy=outlk16.Office.Microsoft.Policies.Windows::L_OutlookDisableAutoDiscover&Language=en-us>`

Alternatively, the records can be modified via Windows registry, for example by
using the following entries of a registry with with .reg extension:

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


This configuration example sets Outlook 2016+ to disable any other mechanisms
than ExcludeHttpsAutoDiscoverDomain and ExcludeHttpRedirect.

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
