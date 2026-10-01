---
title: "gromox-compress(8)"
description: "gromox-compress — Utility to recompress Gromox content files"
sidebar:
  order: 50
---

## Name

gromox-compress — Utility to recompress Gromox content files

## Synopsis

<strong>gromox-compress</strong> <strong>--cid</strong> {<em>directory</em>\|<em>file</em>...}

## Description

gromox-compress compresses content files (attachments, bodytext) in an existing mailbox after the fact. This utility is useful because the "exmdb_file_compression" config directive only controls compression in the groupware servers for newly created content files.

## Options

<dfn class="gx-param">--cid</dfn>  
Treat all arguments given on the command-line as CID directories, and process them appropriately.

<dfn class="gx-param">-n</dfn>  
Dry run. In essence, this only builds the file lists and runs no compressors.

<dfn class="gx-param">-z</dfn> <em>level</em>  
Compression level to use. Defaults to 6.

## Examples

Compress some:

> gromox-compress --cid /var/lib/gromox/user/foo@example.com/cid /var/lib/gromox/user/bar@example.com/cid

Or string that further to compress cid directories of all mailboxes:

> find /var/lib/gromox/{user,domain} -type d -name cid -exec gromox-compress --cid {} +

## Formats

- cid/\[0-9\]+: content file, with proptag-dependent header and trailer

- cid/\[0-9\]+.v1z: content file, with proptag-dependent header and trailer, compressed

- cid/\[0-9\]+.zst: content file, headerless, compressed

## See also

<strong>gromox</strong>(7), <strong>exmdb_provider</strong>(4gx)
