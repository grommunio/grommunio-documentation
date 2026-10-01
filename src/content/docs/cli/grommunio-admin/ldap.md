---
title: "grommunio-admin ldap"
description: "grommunio-admin ldap — LDAP tools"
sidebar:
  label: "ldap"
  order: 10
---

### Name

grommunio-admin ldap — LDAP tools

### Synopsis

<strong>grommunio-admin ldap</strong> <strong>check</strong> \[<em>-o ORGSPEC</em>\] \[<em>-r</em> \[<em>-m</em>\] \[<em>-y</em>\]\]\
<strong>grommunio-admin ldap</strong> <strong>configure</strong> \[<em>-d</em>\] \[<em>-o ORGSPEC</em>\]\
<strong>grommunio-admin ldap</strong> <strong>downsync</strong> \[<em>-c</em>\] \[<em>-f</em>\] \[<em>-l</em>\] \[<em>-o ORGSPEC</em>\] \[<em>-p PAGE_SIZE</em>\] \[<em>USER</em> \[<em>USER</em> …\]\]\
<strong>grommunio-admin ldap</strong> <strong>dump</strong> \[<em>-o ORGSPEC</em>\] <em>USER</em>\
<strong>grommunio-admin ldap</strong> <strong>info</strong> \[<em>-o ORGSPEC</em>\]\
<strong>grommunio-admin ldap</strong> <strong>reload</strong> \[<em>-o ORGSPEC</em>\]\
<strong>grommunio-admin ldap</strong> <strong>search</strong> \[<em>-a</em>\] \[<em>--format FORMAT</em>\] \[<em>-n MAX_RESULTS</em>\] \[<em>-o ORGSPEC</em>\] \[<em>-p PAGE_SIZE</em>\] \[<em>USER</em>\]

### Description

The grommunio admin ldap module provides functions for configuring and testing the LDAP connection and downloading or updating users.

### Commands

`check`  
Check if the LDAP objects imported users are linked to can still be found, optionally removing orphaned users

`configure`  
Interactively configure or modify LDAP connection

`downsync`  
Synchronize or import users from LDAP

`dump`  
Print LDAP object

`info`  
Show connection status

`reload`  
Reload the LDAP configuration and reconnect

`search`  
Search for users

### Options

`USER`  
LDAP object ID or search string

`-a`, `--all`  
Show all results, not only importable objects

`--auth-backend <automatic|externid|always_ldap|always_mysql>`  
For <em>reload</em> only. Set the authmgr global system authentication backend. Can be one of <em>automatic</em> (same as <em>externid</em>), <em>externid</em>, <em>always_ldap</em>, <em>always_mysql</em>. Default is <em>externid</em> if unset.

`-c`, `--complete`  
Import or update all users from the LDAP tree

`-f`, `--force`  
Force update users that are linked to a different or no LDAP object

`--format FORMAT`  
Output format. Can be one of <em>csv</em>, <em>json-flat</em>, <em>json-kv</em>, <em>json-object</em>, <em>json-structured</em> and <em>pretty</em>. Default is <em>pretty</em>.

`-l`, `--lang`  
Set language for imported users. Default is to not set any language.

`-m`, `--remove-maildirs`  
Also remove user files from disk

`-n MAX_RESULTS`, `--max-results MAX_RESULTS`  
Maximum number of results or 0 to disable limit (default 0). Note that the actual number of results may exceed the limit due to paging and filtering.

`-o ORGSPEC`, `--organization ORGSPEC`  
Use organization specific LDAP connection. Supports organization ID or name.

`-p PAGE_SIZE`, `--page-size PAGE_SIZE`  
Set batch size for paged search. Can be decreased when running into timeout errors with slow LDAP servers. Default is 1000.

`-r`, `--remove`  
Remove imported users of which the linked LDAP object could not be found

`-t TYPES`, `--types TYPES`  
Comma separated list of object types to search for. Supported are <em>user</em>, <em>contact</em> and <em>group</em>.

`-x <bool>`, `--disable-ldap <bool>`  
For reload only. Set the disable LDAP switch for the organization or globally system wide.

`-y`, `--yes`  
Do not prompt for confirmation, assume yes

### See Also

<strong>grommunio-admin</strong>(1), <strong>grommunio-admin-fs</strong>(1), <strong>grommunio-admin-user</strong>(1)
