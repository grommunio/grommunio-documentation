..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2024 grommunio GmbH

AutoDiscover
============

As of 2024-11-16, the content of this page was moved into the
Gromox manpage `https://docs.grommunio.com/man/autodiscover.7gx.html`_
and Outlook KB page, `https://docs.grommunio.com/kb/outlook.html`_.


M365 authentication dialog
--------------------------

When a DNS zone is M365-enabled (DNS TXT record on the domain with contents
like ``MS=ms12345678``), Outlook will present a mini browser window for M365
authentication. This can be permanently disabled by setting
``ExcludeExplicitO365Endpoint``:

.. code-block:: text

	[HKEY_CURRENT_USER\Software\Microsoft\Office\16.0\Outlook\AutoDiscover]
	"EnableOffice365ConfigService"=dword:00000000
	"ExcludeExplicitO365Endpoint"=dword:00000001

	[HKEY_CURRENT_USER\Software\Policies\Microsoft\Office\16.0\Outlook\AutoDiscover]
	"EnableOffice365ConfigService"=dword:00000000
	"ExcludeExplicitO365Endpoint"=dword:00000001

* ``EnableOffice365ConfigService``

  In Outlook versions before 16.0.9327.1000, this URL was used to automatically
  provision O365 endpoints, overriding some AutoDiscover behavior

* ``ExcludeExplicitO365Endpoint``

  In Outlook 2016+ (versions after 16.0.6741.2017), this configuration
  parameter is used to proxy AutoDiscover requests via Microsoft servers. Usage
  of this service is possible

  # with grommunio if the AutoDiscover entries have been configured, and/or
  # when globally resolvable records are pointing to grommunio as the endpoint.

For configuration via Group Policy, download the ADMX templates from
`https://www.microsoft.com/en-us/download/details.aspx?id=49030`_.
