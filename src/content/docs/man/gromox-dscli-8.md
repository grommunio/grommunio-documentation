---
title: "gromox-dscli(8)"
description: "gromox-dscli — AutoDiscover command line utility"
sidebar:
  order: 50
---

## Name

gromox-dscli — AutoDiscover command line utility

## Synopsis

<strong>PASS=</strong><em>secret</em> <strong>gromox-dscli</strong> \[<strong>--eas</strong>\] \[<strong>-H</strong> <em>https://host/path</em>\] \[<strong>-h</strong> <em>hostonly</em>\] \[<strong>-e</strong> <em>emailaddr</em>\] \[<strong>-v</strong>\]

## Description

This utility facilitates sending/receiving AutoDiscover request/responses to/from a server for testing.

## Options

<dfn class="gx-param">-H</dfn> <em>https://host/Autodiscover/Autodiscover.xml</em>  
The full URL for making the request. Useful when the request URI is non-standard. Use of -H disables DNS SRV lookup.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">https://localhost/Autodiscover/Autodiscover.xml</span>

<dfn class="gx-param">-e</dfn> <em>user@domain.example</em>  
Username to send along in the request.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(none)</span>

<dfn class="gx-param">-h</dfn> <em>host</em>  
The hostname to use for making the request. From this, the full URL is constructed as "https://<em>host</em>/Autodiscover/Autodiscover.xml". Use of -h disables DNS SRV lookup.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">derived from -e argument, or <em>localhost</em> (when -x is used)</span>

<dfn class="gx-param">-u</dfn> <em>username</em>  
Use a distinct username for authentication.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">inherited from -e argument</span>

<dfn class="gx-param">-v</dfn>  
Be verbose. Log messages are emitted to stderr, the HTTP/XML request is emitted to stderr, and the HTTP/XML response (if any) is emitted to standard output. (These choices allow the output XML to be fed to e.g. xmllint for pretty-printing).

<dfn class="gx-param">-x</dfn> <em>/o=1234578/ou=Exchange Administrative Group (FYDIBOHF23SPDLT)/cn=Recipients/cn=username</em>  
LegacyDN field to send along in the request.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(none)</span>

<dfn class="gx-param">--eas</dfn>  
Use the request schema from \[MS-ASCMD\].

<dfn class="gx-param">--ac</dfn>  
Perform Mail Autoconf request instead of AutoDiscover. MA is used by e.g. (Mozilla) Thunderbird, (GNOME) Evolution, (KDE) KMail, (KDE) Kontact, K9 Mail, to name a few.

## Examples

Discover your store:

> PASS=letmein gromox-dscli -e user@domain.example

Test public store discovery:

> PASS=letmein gromox-dscli -e public.folder.root@domain.example -u user@domain.example

## Normative references

- MS-OXDISCO: Autodiscover HTTP Service Protocol

- MS-OXDSCLI: Autodiscover Publishing and Lookup Protocol

## See also

<strong>gromox</strong>(7)
