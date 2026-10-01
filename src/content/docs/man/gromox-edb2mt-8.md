---
title: "gromox-edb2mt(8)"
description: "gromox-edb2mt — Utility for analysis of Exchange .edb files"
sidebar:
  order: 50
---

## Name

gromox-edb2mt — Utility for analysis of Exchange .edb files

## Synopsis

<strong>gromox-edb2mt</strong> <strong>-l</strong> <em>mdb01.edb</em>

<strong>gromox-edb2mt</strong> \[<strong>-pt</strong>\] <em>mdb01.edb</em> <strong>-x</strong> <em>mbid</em>

## Description

gromox-edb2mt reads one mailbox from an Exchange .edb file, and dumps the structure to stderr with -t/-p.

edb2mt is not currently suitable for import of mailbox data, see also <https://github.com/libyal/libesedb/issues/68>.

## Options

<dfn class="gx-param">-l</dfn>  
Show the mailbox table from the .edb file.

<dfn class="gx-param">-p</dfn>  
Show properties in detail (enhances <strong>-t</strong>).

<dfn class="gx-param">-t</dfn>  
Show a diagnostic tree view of the source data as it is being read.

<dfn class="gx-param">-x</dfn> <em>mbid</em>  
Extract the given mailbox from the .edb file.

<dfn class="gx-param">--loglevel</dfn> <em>n</em> Maximum verbosity of general logging (not connected  
to <strong>-p</strong>, <strong>-t</strong> or <strong>-v</strong>). 1=crit, 2=error, 3=warn, 4=notice, 5=info, 6=debug.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>4</em> (notice)</span>

## Obtaining edb files

On the Exchange server, stop the service known as "Microsoft Exchange Information Store" (as reported in services.msc) or "Microsoft.Exchange.Store.exe" (as reported in Task Manager). This will release file locks on edb files so that they can be copied elsewhere.

## See also

<strong>gromox</strong>(7), <strong>gromox-import</strong>(8)
