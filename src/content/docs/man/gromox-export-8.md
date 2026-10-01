---
title: "gromox-export(8)"
description: "gromox-export — Utility to export Gromox messages to various formats"
sidebar:
  order: 50
---

## Name

gromox-export — Utility to export Gromox messages to various formats

## Synopsis

<strong>gromox-exm2eml -u</strong> <em>user@domain.example</em> \[<em>folder_id</em><strong>:</strong>\]<em>message_id</em>

<strong>gromox-exm2ical -u</strong> <em>user@domain.example</em> \[<em>folder_id</em><strong>:</strong>\]<em>message_id</em>

<strong>gromox-exm2vcf -u</strong> <em>user@domain.example</em> \[<em>folder_id</em><strong>:</strong>\]<em>message_id</em>

<strong>gromox-exm2mt -u</strong> <em>user@domain.example</em> \[<strong>-ars</strong>\] {<em>folder_spec</em>\|<strong>f</strong><em>folder_id</em>\|\[<em>folder_id</em><strong>:</strong>\]<em>message_id</em>}... \>file.mt

<strong>gromox-exm2tnef -u</strong> <em>user@domain.example</em> \[<em>folder_id</em><strong>:</strong>\]<em>message_id</em> \>file.tnef

## Description

gromox-export reads folders or messages from an exmdb information store and exports it in various formats. depending on which name it was invoked with. ("exm" is short for exmdb and refers to the network protocol used to talk to the message store.) Multiple messages may only be exported to GXMT. ACLs are not extracted yet. Export to PST is not possible: the external library libpff has only implemented reading.

Folders can be selected by symbolic name or by folder path (see [gromox-mbop(8)](/man/gromox-mbop-8/) section "Folder specification" for that). To select a folder by numeric ID, use the 'f' prefix, e.g. <strong>f13</strong> or <strong>f0xd</strong>. To select a message by numeric ID, use the ID <strong>262145</strong> or <strong>0x10001</strong>. The syntax <strong>13:262145</strong> reads a message using the Instance API (i.e. using a copy-on-write object) and validates that the message is indeed in that folder; this mode is only relevant for developers really.

An alternate way to get an EML representation is using grommunio-web's "Export as \> EML file(s)" function from the context menu of a mail item.

## Options

<dfn class="gx-param">--ical</dfn>  
Selects iCalendar (RFC 5545/5546) as the output format. This is the default if the program was invoked as gromox-exm2ical.

<dfn class="gx-param">--mail</dfn>  
Selects Internet Mail (RFC 5322) as the output format. This is the default if the program was invoked as gromox-exm2eml.

<dfn class="gx-param">--mt</dfn>  
Selects Gromox Mailbox Transfer (GXMT) as the output format. This is the default if the program was invoked as gromox-export or gromox-exm2mt.

<dfn class="gx-param">--tnef</dfn>  
Selects Transport Neutral Encapsulation Format (TNEF) as the output format. This is the default if the program was invoked as gromox-exm2tnef.

<dfn class="gx-param">--vcard</dfn>  
Selects vCard (RFC 6350) as the output format. This is the default if the program was invoked as gromox-exm2vcf.

<dfn class="gx-param">-a</dfn>  
Include Folder Associated Information (FAI), a.k.a. MAPI_ASSOCIATED messages in the export as well. (PST export from Outlook would omit them; hence this is also a separate option for gromox-export.)

<dfn class="gx-param">-p</dfn>  
Show properties in detail (enhances <strong>-t</strong>).

<dfn class="gx-param">-r</dfn>  
Process folders recursively. (Only in conjunction with GXMT export.)

<dfn class="gx-param">-s</dfn>  
Mark objects for splicing when later imported. For example, objects exported from, and originally located in Sent Items are, upon import, placed in the target mailbox's Sent Items.

<dfn class="gx-param">-t</dfn>  
As the source message is read, print a diagnostic tree view of the MAPI properties to stderr.

<dfn class="gx-param">-u</dfn> \[<em>user</em>\]<strong>@</strong><em>domin.example</em>  
Source mail store from which to load the message from. For the public folder of a domain, leave out the local part, i.e. use <strong>@</strong><em>domain.example</em><strong>.</strong>

<dfn class="gx-param">--loglevel</dfn> <em>n</em>  
Maximum verbosity of general logging (not connected to <strong>-p, -t or</strong> <strong>-v). 1=crit, 2=error, 3=warn, 4=notice, 5=info, 6=debug.</strong>\
<span class="gx-deflabel">Default:</span> <span class="gx-default">4<em> </em><em>(notice)</em></span>

## Examples

- Export entire mailbox: gromox-exm2mt -u user@example.com -ar / \>dump.mt

- Export most of the mailbox (as Outlook would): gromox-exm2mt -u u@e.xz -r IPM_SUBTREE \>dump.mt\
  Note: Favorites, Shortcuts, Quick Steps, Search Folders, some view settings, grommunio-sync states are all stored outside of IPM_SUBTREE. In Exchange, softdeleted items are stored outside of IPM_SUBTREE as regular messages; in Gromox 3.6, they are stored as invisible items with the actual folder and never part of an export (this might change in the future, though).

- Export two folders without subordinates: gromox-exm2mt -u u@e.xz IPM_SUBTREE/Foo IPM_SUBTREE/Bar \>dump.mt

- Export a single message as RFC5322: gromox-exm2eml -u u@e.xz 0x10001 \>10001.eml

- Export a MAPI contact as vcard: gromox-exm2vcf -u u@e.xz 0x30001 \>30001.vcf

## See also

<dfn class="gx-param">[gromox(7)](/man/gromox-7/), [gromox-eml2mt(8)](/man/gromox-eml2mt-8/)</dfn>
