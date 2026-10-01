---
title: "grommunio-admin exmdb"
description: "grommunio-admin exmdb — User or domain store management"
sidebar:
  label: "exmdb"
  order: 10
---

### Name

grommunio-admin exmdb — User or domain store management

### Synopsis

<strong>grommunio-admin</strong> <strong>exmdb</strong> <em>TARGET</em> <em>folder</em> <em>create</em> \[<em>--comment COMMENT</em>\] \[<em>-t TYPE</em>\] NAME \[<em>PARENTID</em>\]\
<strong>grommunio-admin</strong> <strong>exmdb</strong> <em>TARGET</em> <em>folder</em> <em>delete</em> \[<em>-a</em>\] \[--clear\] <em>FOLDERSPEC</em>\
<strong>grommunio-admin</strong> <strong>exmdb</strong> <em>TARGET</em> <em>folder</em> <em>find</em> \[<em>-x</em>\] <em>NAME</em> \[<em>ID</em>\]\
<strong>grommunio-admin</strong> <strong>exmdb</strong> <em>TARGET</em> <em>folder</em> <em>grant</em> \[<em>-f</em>\] \[<em>-r</em>\] <em>ID</em> <em>USERNAME</em> <em>PERMISSION</em> \[<em>PERMISSION</em> …\]\
<strong>grommunio-admin</strong> <strong>exmdb</strong> <em>TARGET</em> <em>folder</em> <em>list</em> \[<em>-r</em>\] \[<em>--format FORMAT</em>\] \[<em>ID</em>\]\
<strong>grommunio-admin</strong> <strong>exmdb</strong> <em>TARGET</em> <em>folder</em> <em>revoke</em> \[<em>-r</em>\] <em>ID</em> <em>USERNAME</em> \[<em>PERMISSION</em> …\]\
<strong>grommunio-admin</strong> <strong>exmdb</strong> <em>TARGET</em> <em>store</em> <em>delete</em> <em>PROPSPEC</em> \[<em>PROPSPEC</em> ...\]\
<strong>grommunio-admin</strong> <strong>exmdb</strong> <em>TARGET</em> <em>store</em> <em>get</em> \[<em>--format FORMAT</em>\] \[<em>--separator SEPARATOR</em>\] \[<em>PROPSPEC</em> ...\]\
<strong>grommunio-admin</strong> <strong>exmdb</strong> <em>TARGET</em> <em>store</em> <em>set</em> \[<em>PROPSPEC=VALUE</em> ...\]

### Description

Subcommand to access and modify a domain's or user's store via exmdb protocol.

### Commands

#### Folder subcommand

`create`  
Create a new folder

`delete`  
Delete folder by ID or name.

`find`  
Find folders with given name

`grant`  
Grant permissions on this folder to a user

`list`  
List subfolders of a folder. If no folder ID is specified, list subfolders of root folder.

`revoke`  
Revoke permissions on this folder from a user. If not permission is specified, revoke all permissions.

#### Store subcommand

`delete`  
Delete properties

`get`  
Get store properties

`set`  
Set store properties

### Options

`ID`  
ID of the folder

`FOLDERSPEC`  
ID or name of the folder

`NAME`  
Name of the folder

`PARENTID`  
ID of the parent folder

`PERMISSION`  
Name or numeric value of the permission

`PROPSPEC`  
Name or numeric value of the property

`TARGET`  
Name of the domain or e-mail address of the user

`USERNAME`  
E-Mail address of a user

`-a`, `--all`  
Do not stop if target is ambiguous but apply to all.

`--clear`  
Delete folder contents. Required for non-empty folders.

`--comment COMMENT`  
Folder comment

`-f`, `--force`  
Grant permissions to non-existing user

`--format FORMAT`  
Output format. Can be one of <em>csv</em>, <em>json-flat</em>, <em>json-kv</em>, <em>json-object</em>, <em>json-structured</em> and <em>pretty</em>. Default is <em>pretty</em>.

`-r`, `--recursive`  
Apply recursively to subfolders

`--separator SEPARATOR`  
String to use for column separation (<em>csv</em> and <em>pretty</em> only). Must have length 1 if format is <em>csv</em>. Default is "," for <em>csv</em> and " " for pretty.

`-t TYPE`, `--type TYPE`  
<em>CONTAINERCLASS</em> property, defaults to <em>"IPF.Note"</em>

`-x`, `--exact`  
Only match exact folder names instead of case-insensitive substrings

### Notes

- Folder IDs and permissions can be given in decimal, hexadecimal (<em>0x</em>-prefix), octal (<em>0</em>-prefix) or binary (<em>0b</em>-prefix).
- Currently, the permission value echoed by the <em>grant</em> and <em>revoke</em> commands is the one sent to the server and might differ from the value actually assigned.
- The <em>create</em>, <em>find</em> and <em>list</em> commands operate on the <em>IPMSUBTREE</em> folders (<em>0x9</em> for users, <em>0x2</em> for domains) by default, which can be overridden by the <em>ID</em> parameter.

### See Also

<strong>grommunio-admin</strong>(1), <strong>grommunio-admin-domain</strong>(1), <strong>grommunio-admin-service</strong>(1), <strong>grommunio-admin-user</strong>(1)
