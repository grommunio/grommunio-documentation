---
title: "gromox-mkprivate(8)"
description: "gromox-mkprivate — Tool for creating a blank private store"
sidebar:
  order: 50
---

## Name

gromox-mkprivate — Tool for creating a blank private store

## Synopsis

<strong>gromox-mkprivate</strong> \[<strong>-Uv</strong>\] \[<strong>-T</strong> <em>template_dir</em>\] \[<strong>-c</strong> <em>config</em>\] \[<strong>-f</strong>\] <em>username</em>

## Description

mkprivate is used to generate the exchange.sqlite3 file for a private store. mkprivate directly operates on the filesystem, which has implications. First, the program ought to be executed on the correct homeserver in case a multi-server Gromox installation is used. Second, there is no coordination with [exmdb_provider(4gx)](/man/exmdb_provider-4gx/), and exmdb_provider might continue using file descriptors opened earlier, working with the old copy of the mailbox, or get confused because e.g. a WAL file no longer matches the sqlite db. Ideally, you would use something like `gromox-mbop -u ... ( freeze ) ( unload )` to make exmdb_provider close the mailbox before resetting it. Even then, services that build on top of exmdb, such as [exchange_emsmdb(4gx)](/man/exchange_emsmdb-4gx/) or [zcore(8gx)](/man/zcore-8gx/), may also get confused when the mailbox (now as an abstract object rather than a concrete file descriptor) or any key characteristics like PR_STORE_RECORD_KEY.

## Options

<dfn class="gx-param">-T</dfn> <em>path</em>  
This option can be used to override the built-in data path for folder name translations and prepoulated named properties.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">/usr/share/gromox</span>

<dfn class="gx-param">-U</dfn>  
Rather than creating the SQLite file, upgrade it. (The -f option has no effect.) mkprivate does not coordinate with [exmdb_provider(4gx)](/man/exmdb_provider-4gx/) and data corruption is possible if both try to edit the file at the same time. You should let [exmdb_provider(4gx)](/man/exmdb_provider-4gx/) do upgrades instead, via the "exmdb_schema_upgrades" directive, or at the very least, stop [http(8gx)](/man/http-8gx/)/exmdb_provider when using mkprivate -U.

<dfn class="gx-param">-c</dfn> <em>config</em>  
Read configuration directives from the given file. If this option is not specified, /etc/gromox/mysql_adaptor.cfg will be read for MySQL connection parameters if that file exists.

<dfn class="gx-param">-f</dfn>  
Force overwrite when an existing SQLite database is detected for the user. By default, mkprivate will not touch exchange.sqlite3.

<dfn class="gx-param">-v</dfn>  
Turn on verbose mode for -U.

<dfn class="gx-param">--create-old</dfn>  
Create blank initial database using version 0. (This can be used for testing the upgrade procedure.)

<dfn class="gx-param">--integrity</dfn>  
Perform SQLite integrity check, either standalone or, if -U is also given, as part of an upgrade.

<dfn class="gx-param">-?</dfn>  
Display option summary.

## Files

- <em>data_file_path</em>/folder_names.txt: Translations for essential folders in a message store.

- <em>data_file_path</em>/propnames.txt: Initial set of named properties to add to the new private store.

- <em>/var/lib/gromox/...</em>/exmdb/exchange.sqlite3: MAPI object database.

## See also

<strong>gromox</strong>(7), <strong>gromox-mkmidb</strong>(8), <strong>gromox-mkpublic</strong>(8), <strong>mysql_adaptor</strong>(4gx)
