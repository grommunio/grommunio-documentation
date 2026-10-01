---
title: "grommunio-admin fs"
description: "grommunio-admin fs — Filesystem operations"
sidebar:
  label: "fs"
  order: 10
---

### Name

grommunio-admin fs — Filesystem operations

### Synopsis

<strong>grommunio-admin fs</strong> <strong>clean</strong> \[<em>-d</em>\] \[<em>-s</em>\] \[<em>PARTITION</em>\]\
<strong>grommunio-admin fs</strong> <strong>du</strong> \[<em>PARTITION</em>\]

### Description

Show space used by user and domain home directories or remove unused files.

Unused files may remain when users or domains are deleted without removing their files.

### Commands

`clean`  
Remove directories and files that are not used by any domain or user.

`du`  
Show data usage statistics

### Options

`PARTITION`  
Apply only to selected partition. Can be either <em>domain</em> or <em>user</em>

`-d`, `--dryrun`  
Do not delete anything, just print what would be deleted

`-s`, `--nostat`  
Do not collect disk usage statistics of deleted files

### See Also

<strong>grommunio-admin</strong>(1), <strong>grommunio-admin-domain</strong>(1), <strong>grommunio-admin-user</strong>(1)
