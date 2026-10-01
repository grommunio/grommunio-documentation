---
title: "gromox-eml2mt(8)"
description: "gromox-eml2mt — Utility for analysis/importing various formats"
sidebar:
  order: 50
---

## Name

gromox-eml2mt — Utility for analysis/importing various formats

## Synopsis

<strong>gromox-eml2mt</strong> \[<strong>-Ppt</strong>\] <em>file.eml</em>\[...\]

<strong>gromox-ical2mt</strong> \[<strong>-Ppt</strong>\] <em>file.ics</em>\[...\]

<strong>gromox-mbox2mt</strong> \[<strong>-Ppt</strong>\] <em>file.mbox</em>\[...\]

<strong>gromox-tnef2mt</strong> \[<strong>-Ppt</strong>\] <em>file.tnef</em>\[...\]

<strong>gromox-vcf2mt</strong> \[<strong>-Ppt</strong>\] <em>file.vcf</em>\[...\]

## Description

gromox-eml2mt reads one or more RFC5322-formatted e-mail messages and re-exports the data in a Gromox-specific mailbox transfer format to stdout for consumption by pipe by the [gromox-import(8)](/man/gromox-import-8/) program. Each file must contain at most one RFC5322 message.

When called as gromox-mbox2mt, the input is treated as RFC4155-formatted Unix mailbox.

When called as gromox-ical2mt, the input is treated as RFC5545/5546-formatted calendaring and scheduling objects (.ics).

When called as gromox-vcf2mt, the input is treated as RFC4770/6530-formatted vCard objects (.vcf).

When called as gromox-tnef2mt, the input is treated as a MS-OXTNEF object.

eml2mt will resolve email addresses to Gromox objects already, so the emitted data stream should be consumed by a gromox-import invocation on the <em>same</em> Gromox cluster.

All objects in the output stream are unanchored so that the -B option of gromox-import can be used to select placement. (Prior to Gromox 2.46, some modes like --ical and --vcard emitted an anchor.)

## Options

<dfn class="gx-param">--decap</dfn>=<em>n</em>  
Once a MAPI message object is constructed, select attachment number <em>n</em>'s embedded message as the "top-level" message and discard the rest of the outer message. <em>n</em> is 1-based.

<dfn class="gx-param">--ical</dfn>  
Treat all file arguments as iCalendar input. This is the default if the program was invoked as gromox-ical2mt.

<dfn class="gx-param">--loglevel</dfn> <em>n</em> Maximum verbosity of general logging (not connected  
to <strong>-p</strong>, <strong>-t</strong> or <strong>-v</strong>). 1=crit, 2=error, 3=warn, 4=notice, 5=info, 6=debug.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>4</em> (notice)</span>

<dfn class="gx-param">--mail</dfn>  
Treat all file arguments as Internet Mail input. This is the default if the program was invoked as gromox-eml2mt.

<dfn class="gx-param">--mbox</dfn>  
Treat all file arguments as Unix mboxes. This is the default if the program was invoked as gromox-mbox2mt.

<dfn class="gx-param">--oneoff</dfn>  
Do not resolve email addresses to EX addresses, but to ONEOFF instead. This way, streams created by eml2mt can be imported into <em>other</em> Gromox clusters that do not have the same user set.

<dfn class="gx-param">--tnef</dfn>  
Treat all file arguments as Transport Neutral Encapsulation Format objects. This is the default if the program was invoked as gromox-tnef2mt.

<dfn class="gx-param">--vcard</dfn>  
Treat all file arguments as vCard input. This is the default if the program was invoked as gromox-vcf2mt.

<dfn class="gx-param">-P</dfn>  
Enable super-pedantic mode when parsing VCARDs and reject everything that is not recognized. (Not recommended)

<dfn class="gx-param">-p</dfn>  
Show properties in detail (enhances <strong>-t</strong>). Using -p twice prints properties with human-readable mnemonic names. The BIN2TXT_MODE environment variable can be set to control how binary properties are presented; possible values are "co" (C string representation with octal escapes), "cstr" (C string representation, any form) and "hex" (two-hex-nibble representation), "txt" (compact representation for light-binary text-heavy content).

<dfn class="gx-param">-t</dfn>  
Show a diagnostic tree view of the source data as it is being read.

## Examples

Import of an RFC5322 message (sometimes with .eml file extension) to drafts:

gromox-eml2mt msg.eml \| gromox-import -u recipient@domain.example -B drafts

Import of calendar objects:

gromox-ical2mt meeting.ics \| gromox-import -u recipient@domain.example

## See also

<strong>gromox</strong>(7), <strong>gromox-export</strong>(8), <strong>gromox-import</strong>(8)
