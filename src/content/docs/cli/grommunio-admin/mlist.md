---
title: "grommunio-admin mlist"
description: "grommunio-admin mlist — Mailing/distribution list management"
sidebar:
  label: "mlist"
  order: 10
---

### Name

grommunio-admin mlist — Mailing/distribution list management

### Synopsis

<strong>grommunio-admin mlist</strong> <strong>add</strong> <em>MLISTSPEC</em> (<em>sender</em>\|<em>recipient</em>) <em>ENTRY</em> <strong>grommunio-admin mlist</strong> <strong>create</strong> \[<em>-p PRIVILEGE</em>\] \[<em>-r RECIPIENT</em>\] \[<em>-s SENDER</em>\] \[<em>-t TYPE</em>\] NAME\
<strong>grommunio-admin mlist</strong> <strong>delete</strong> \[<em>-y</em>\] <em>MLISTSPEC</em>\
<strong>grommunio-admin mlist</strong> <strong>list</strong> \[<em>-f FIELD=\<value\></em>\] \[<em>-s FIELD</em>\] \[<em>MLISTSPEC</em>\]\
<strong>grommunio-admin mlist</strong> <strong>modify</strong> \[<em>-p PRIVILEGE</em>\] \[<em>-r RECIPIENT</em>\] <em>MLISTSPEC</em> <strong>grommunio-admin mlist</strong> <strong>remove</strong> <em>MLISTSPEC</em> (<em>sender</em>\|<em>recipient</em>) <em>ENTRY</em> <strong>grommunio-admin mlist</strong> <strong>show</strong>

### Description

Create, modify or delete mailing lists.

### Commands

`add`  
Add sender or recipient to list

`create`  
Create a new mailing list

`delete`  
Delete mailing list

`list`  
List mailing lists

`modify`  
Modify mailing list

`remove`  
Remove sender or recipient from list

`show`  
Show detailed information about mailing list

### Options

`-p PRIVILEGE`, `--privilege PRIVILEGE`  
Set who is allowed to send mails to the list, one of <em>all</em>, <em>domain</em>, <em>internal</em>, <em>outgoing</em> or <em>specific</em>

`-f FIELD=<value>`, `--filter FIELD=<value>`  
Filter expression in the form of ‘field=value’. Can be specified multiple times to refine filter

`-s FIELD`, `--sort FIELD`  
Sort by field. Can be given multiple times

`-t TYPE`, `--type TYPE`  
List type (recipient selection), one of <em>normal</em> or <em>domain</em>

### See Also

<strong>grommunio-admin</strong>(1), <strong>grommunio-admin-domain</strong>(1), <strong>grommunio-admin-user</strong>(1)
