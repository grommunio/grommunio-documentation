---
title: "gromox-mbsize(8)"
description: "gromox-mbsize — Mailbox size analysis"
sidebar:
  order: 50
---

## Name

gromox-mbsize — Mailbox size analysis

## Synopsis

<strong>gromox-mbsize</strong> \[options...\] <em>directory</em>

## Description

Shows a detailed view of how a mailbox size translates to on-disk usage. Explanation of the columns/rows follows. The reported numbers may slightly deviate from what du(1) would output, as mbsize does not count e.g. the config/ directory, tmp/ directory, sqlite auxiliary files, any other unreferenced attachments (cf. [gromox-mbop(8)](/man/gromox-mbop-8/) for the purge-datafiles command), and other stuff left there by outside actions.

## Options

<dfn class="gx-param">-B</dfn> {<strong>B</strong>\|<strong>K</strong>\|<strong>M</strong>\|<strong>G</strong>\|<strong>T</strong>}  
Selects the display unit.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>M</em></span>

<dfn class="gx-param">--orphans</dfn>  
Show the list of files believed to be orphaned/unrecognized. This option is meant for debugging the counting implementation. Some files are naturally orphaned, e.g. between the time a message was hard-deleted and the time that `gromox-mbop purge-datafiles` is run.

## Line descriptions

Apparent size: This is the exact size of the object, or simply the sum of sizes of objects.

On FS: This is the space that is used on the filesystem, and is subject to fs block sizes. Details about this behavior may be found on <https://en.wikipedia.org/wiki/Block_(data_storage)>. As a result, the on-disk size may be larger than the apparent size. It is occassionally possible that files can become sparse (e.g. as a result of rsync -S) and their block-based use even be lower the apparent filesize.

RFC5322/Mbox: For the sake of IMAP, RFC5322 copies of messages and some metadata is retained. A heuristic tries to partition this into received and sent based on the program that created it, but this determination is not exact because it does not analyze which MAPI folder it belongs to.

RFC5322 Received: Applies to messages received via [delivery(8gx)](/man/delivery-8gx/).

RFC5322 Sent: Applies to any other message.

Body analysis: A set of 4 MAPI properties that usually get stored as files on disk rather than inside the sqlite database: PR_BODY, PR_HTML, PR_RTF_COMPRESSED and PR_TRANSPORT_MESSAGE_HEADERS. In gromox-mbsize, these are considered "body".

Attachment analysis: What it says. Not all MIME parts are or stay an attachment; for example, calendar items/meeting requests are usually converted to MAPI objects.

Missing items/Apparent: The number of MAPI properties/attachments which have a dangling reference into the filesystem.

Missing items/FS: The on-disk number of files that seem to be absent. This number can be lower than Apparent due to internal data deduplication that is transparent to MAPI/exmdb clients.

Informational content: The logical amount of data that is represented by those four MAPI properties / by MAPI attachments.

After deduplication: The logical amount of unique bodies/attachments.

Dedup ratio/gains: For the "body" group, there are usually little gains to be observed in practice; bodies are just very unique. Messages like "test" are ironically the ones that benefit. Attachments dedup a little better, owing to many people sending/receiving redundant information, such as company logos.

After compression: Besides deduplication, Gromox can also compress before data goes to disk. This is also the final form and so there is an apparent and an on-disk value. The on-disk value may be higher due to aforementioned filesystem block sizing.

File compress ratio/gains: The earnings going from Dedup to Compressed.

IFC compress ratio/gains: The earnings going from Informational Content to Compressed.

MAPI reported sizes: The PR_MESSAGE_SIZE property of a store, folder, message, and the PR_ATTACH_SIZE property of an attachment, all give a close approximation to the amount of data needed to transfer the object(s) over a MAPI connection uncompressed, and without accounting for any framing like TCP, HTTP, RPC, ROP or FXSTREAM.

NTS deviation: how much the Network Transfer Size is off from the on-disk size.

Provisioning factor: The ratio between on-disk usage and the logical mailbox size reported inside MUAs.

## See also

<strong>gromox</strong>(7)
