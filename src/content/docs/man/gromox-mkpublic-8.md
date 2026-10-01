---
title: "gromox-mkpublic(8)"
description: "gromox-mkpublic — Tool for creating a blank public store"
sidebar:
  order: 50
---

## Name

gromox-mkpublic — Tool for creating a blank public store

## Synopsis

<strong>gromox-mkpublic</strong> \[<strong>-Uv</strong>\] \[<strong>-T</strong> <em>template_dir</em>\] \[<strong>-c</strong> <em>config</em>\] \[<strong>-f</strong>\] <em>domainname</em>

## Description

mkpublic is used to generate the exchange.sqlite3 file for a public store. mkpublic directly operates on the filesystem, and has the same considerations as mentioned in [gromox-mkprivate(8)](/man/gromox-mkprivate-8/).

## Options

<dfn class="gx-param">-T</dfn> <em>path</em>  
This option can be used to override the built-in data path for folder name translations and prepoulated named properties.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">/usr/share/gromox</span>

<dfn class="gx-param">-U</dfn>  
Rather than creating the SQLite file, upgrade it. (The -f option has no effect.) mkpublic does not coordinate with [exmdb_provider(4gx)](/man/exmdb_provider-4gx/) and data corruption is possible if both try to edit the file at the same time. You should let [exmdb_provider(4gx)](/man/exmdb_provider-4gx/) do upgrades instead, via the "exmdb_schema_upgrades" directive, or at the very least, stop [http(8gx)](/man/http-8gx/)/exmdb_provider when using mkpublic -U.

<dfn class="gx-param">-c</dfn> <em>config</em>  
Read configuration directives from the given file. If this option is not specified, /etc/gromox/mysql_adaptor.cfg will be read for MySQL connection parameters if that file exists.

<dfn class="gx-param">-f</dfn>  
Force overwrite when an existing SQLite database is detected for the user. By default, mkpublic will not touch exchange.sqlite3.

<dfn class="gx-param">-v</dfn>  
Turn on verbose mode for -U.

<dfn class="gx-param">--create-old</dfn>  
Create blank initial database using version 0. (This can be used for testing the upgrade procedure.)

<dfn class="gx-param">--integrity</dfn>  
Perform SQLite integrity check, either standalone or, if -U is also given, as part of an upgrade.

<dfn class="gx-param">-?</dfn>  
Display option summary.

## Files

- <em>data_file_path</em>/propnames.txt: Initial set of named properties to add to the new private store.

- <em>/var/lib/gromox/...</em>/exmdb/exchange.sqlite3: MAPI object database.

## See also

<strong>gromox</strong>(7), <strong>gromox-mkprivate</strong>(8), <strong>mysql_adaptor</strong>(4gx)
