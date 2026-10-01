---
title: "gromox-oxm2mt(8)"
description: "gromox-oxm2mt — Utility for analysis of Outlook .msg files"
sidebar:
  order: 50
---

## Name

gromox-oxm2mt — Utility for analysis of Outlook .msg files

## Synopsis

<strong>gromox-oxm2mt</strong> \[<strong>-pt</strong>\] <em>input.msg</em>

## Description

gromox-oxm2mt reads an Outlook .msg file, and re-exports the data in a Gromox-specific mailbox transfer format to stdout for consumption by pipe by the [gromox-import(8)](/man/gromox-import-8/) program. Optionally, oxm2mt can print a tree summary of the message.

## Options

<dfn class="gx-param">--decap</dfn>=<em>n</em>  
Select attachment number <em>n</em>'s embedded message as the "top-level" message and discard the rest of the outer message. <em>n</em> is 1-based.

<dfn class="gx-param">-p</dfn>  
Show properties in detail (enhances <strong>-t</strong>).

<dfn class="gx-param">-t</dfn>  
Show a diagnostic tree view of the source data as it is being read.

<dfn class="gx-param">--loglevel</dfn> <em>n</em> Maximum verbosity of general logging (not connected  
to <strong>-p</strong>, <strong>-t</strong> or <strong>-v</strong>). 1=crit, 2=error, 3=warn, 4=notice, 5=info, 6=debug.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>4</em> (notice)</span>

## Examples

Import of a message to drafts:

gromox-oxm2mt saved.msg \| gromox-import -u user@domain.example -B drafts

## Normative references

- MS-CFB: Compound File Binary Format (CFBF)

- MS-OXMSG: Outlook Item (.msg) File Format

Outlook message files use the "Object Linking and Embedding (OLE) / Component Object Model (COM) structured storage compound file implementation binary file format", or just CFB/CFBF for short. It resembles something of a FAT filesystem. The file(1) utility identifies those as "CDFV2 Microsoft Outlook Message" (Compound Document Format). A proposed MIME type is "application/vnd.ms-outlook".

oxm2mt uses the libolecf C library to read the CDF structure of .msg files per \[MS-CFB\], and then applies own code to make sense of the files as per \[MS-OXMSG\].

## See also

<strong>gromox</strong>(7), <strong>gromox-import</strong>(8), <strong>olecfexport</strong>(1)
