---
title: "gromox-pff2mt(8)"
description: "gromox-pff2mt — Utility for analysis/import of PFF/PST/OST files"
sidebar:
  order: 50
---

## Name

gromox-pff2mt — Utility for analysis/import of PFF/PST/OST files

## Synopsis

<strong>gromox-pff2mt</strong> \[<strong>-pst</strong>\] \[...\] <em>input.pst</em>

## Description

gromox-pff2mt reads a file that conforms to the Personal Folder File (PFF) and the Offline Folder File (OFF) format and re-exports the data in a Gromox-specific mailbox transfer format to stdout for consumption by pipe by the [gromox-import(8)](/man/gromox-import-8/) program. Optionally, pff2mt can print a tree summary of the PFF. The PFF format is used in several file types:

- PAB (Personal Address Book)

- PST (Personal Storage Table)

- OST (Offline Storage Table)

By default, pff2mt transfers the mail hierarchy and contents such that the PFF root folder is mapped to a new unanchored folder "Import of \<xyz.pst\> on \<date\>". Refer to [gromox-import(8)](/man/gromox-import-8/) for details on how/where unanchored objects are ultimately placed with the target mailbox.

Note that folders of non-default mailboxes are stored in a flat fashion in OST. A secretary.ost file with hierarchy like "(Boss)\Inbox\2021\Invoices", "(Boss)\Inbox\2022\Invoices" is flattened to "(Boss)\Inbox", "(Boss)\2021", "(Boss)\Invoices", "Boss\2022" and "(Boss)\Invoices". The presence of <strong>two</strong> folders with the same name <strong>at the same level</strong> means gromox-import errors out when it tries to create a folder whose name already exists. This limits the usefulness of importing OST files.

## Options

<dfn class="gx-param">-p</dfn>  
Show properties in detail (enhances <strong>-t</strong>).

<dfn class="gx-param">-s</dfn>  
Splice objects from the PFF into existing folders. Specifically, the PFF root is mapped to the store root, and special folders (Sent Items, Deleted Items, etc.) are mapped to special folders in the store if the PFF has the necessary information. PST files have no such mapping hint for Inbox; only OST do. Note that combining -s and --with-hidden might pollute e.g. the "QuickStep settings" folder with conflicting settings.

<dfn class="gx-param">-t</dfn>  
Show a diagnostic tree view of the source data as it is being read.

<dfn class="gx-param">--loglevel</dfn> <em>n</em> Maximum verbosity of general logging (not connected  
to <strong>-p</strong>, <strong>-t</strong> or <strong>-v</strong>). 1=crit, 2=error, 3=warn, 4=notice, 5=info, 6=debug.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>4</em> (notice)</span>

<dfn class="gx-param">--with-hidden</dfn>, <strong>--without-hidden</strong>  
This option controls the import of folders that have PR_ATTR_HIDDEN=1.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">skip hidden folders</span>

<dfn class="gx-param">--only-obj</dfn> <em>nid</em>  
Extract just the object with the given PFF node id. This option may be specified multiple times. The objects will be unanchored.

## Examples

Import of a PFF-compatible file into a Gromox mailbox via exmdb transport:

gromox-pff2mt sample.pst \| gromox-import -u user@domain.example

gromox-import has more target options. See its manpage.

## Bugs

Embedded messages are treated as subitems by libpff. Luckily, the only consequence is that the tree view (-t) shows duplicate NID visits.

>     \_ [id=21cee4h ntyp=unknown-4h type=appointment nset=1 nent=161]
>         \_ [id=8005h ntyp=atx type=attachment nset=1 nent=19]
>             \_ [attachment type=i embedded_msg]
>                 \_ [id=21cf04h ntyp=unknown-4h type=appointment nset=1
>         \_ [id=21cf04h ntyp=unknown-4h type=appointment nset=1 nent=50]
>         \_ [id=8025h ntyp=atx type=attachment nset=1 nent=19]
>             \_ [attachment type=i embedded_msg]
>                 \_ [id=21cf24h ntyp=unknown-4h type=appointment nset=1
>         \_ [id=21cf24h ntyp=unknown-4h type=appointment nset=1 nent=49]

## See also

<strong>gromox</strong>(7), <strong>gromox-import</strong>(8)
