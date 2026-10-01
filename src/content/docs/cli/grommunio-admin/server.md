---
title: "grommunio-admin server"
description: "grommunio-admin server — Multi-server management"
sidebar:
  label: "server"
  order: 10
---

### Name

grommunio-admin server — Multi-server management

### Synopsis

<strong>grommunio-admin server</strong> <strong>create</strong> <em>-H HOSTNAME</em> <em>-e EXTNAME</em>\]\
<strong>grommunio-admin server</strong> <strong>delete</strong> <em>SERVERSPEC</em>\
<strong>grommunio-admin server</strong> <strong>list</strong> \[<em>-f FIELD=\<value\></em>\] \[<em>-s FIELD</em>\] \[<em>SERVERSPEC</em>\]\
<strong>grommunio-admin server</strong> <strong>modify</strong> \[<em>\<FIELDS\></em>\] <em>SERVERSPEC</em>\
<strong>grommunio-admin server</strong> <strong>show</strong> \[<em>-f FIELD=\<value\></em>\] \[<em>-s FIELD</em>\] <em>SERVERSPEC</em>

### Description

Subcommand to show and manipulate server entries.

If at least one server is specified, newly created users and domains will be associated with one of the servers. The destination server may be specified explicitly, or is chosen automatically according to <em>options.serverPolicy</em>.

### Commands

`create`  
Register a new server

`delete`  
Soft-delete a server

`list`  
List domains

`modify`  
Modify server

`show`  
Show detailed information about a server

### Options

`SERVERSPEC`  
Server hostname or ID

`-f FIELD=<value>`, `--filter FIELD=<value>`  
Filter expression in the form of ‘field=value’. Can be specified multiple times to refine filter

`-s FIELD`, `--sort FIELD`  
Sort by field. Can be given multiple times

### Fields

`-H HOSTNAME`, `--hostname HOSTNAME`  
Internal hostname of the server

`` `-e EXTNAME ``, `--extname EXTNAME`  
External hostname (e.g. FQDN) of the server.

### See Also

<strong>grommunio-admin</strong>(1), <strong>grommunio-admin-domain</strong>(1), <strong>grommunio-admin-user</strong>(1)
