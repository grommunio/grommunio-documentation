---
title: "grommunio-admin domain"
description: "grommunio-admin domain — Domain management"
sidebar:
  label: "domain"
  order: 10
---

### Name

grommunio-admin domain — Domain management

### Synopsis

<strong>grommunio-admin domain</strong> <strong>create</strong> \[<em>--create-role</em>\] \[<em>--homeserver HOMESERVER</em>\] \[<em>--no-defaults</em>\] \[<em>--skip-adaptor-reload</em>\] \[<em>\<FIELDS\></em>\] <em>-u MAXUSER</em> <em>DOMAINNAME</em>\
<strong>grommunio-admin domain</strong> <strong>delete</strong> <em>DOMAINSPEC</em>\
<strong>grommunio-admin domain</strong> <strong>list</strong> \[<em>-f FIELD=\<value\></em>\] \[<em>-s FIELD</em>\] \[<em>DOMAINSPEC</em>\]\
<strong>grommunio-admin domain</strong> <strong>modify</strong> \[<em>\<FIELDS\></em>\] <em>DOMAINSPEC</em>\
<strong>grommunio-admin domain</strong> <strong>purge</strong> \[<em>--files</em>\] \[<em>-y</em>\] <em>DOMAINSPEC</em>\
<strong>grommunio-admin domain</strong> <strong>query</strong> \[<em>-f ATTRIBUTE=\<value\></em>\] \[<em>--format FORMAT</em>\] \[<em>--separator SEPARATOR</em>\] \[<em>-s FIELD</em>\] \[<em>ATTRIBUTE</em> …\]\
<strong>grommunio-admin domain</strong> <strong>recover</strong> <em>DOMAINSPEC</em>\
<strong>grommunio-admin domain</strong> <strong>show</strong> \[<em>-f FIELD=\<value\></em>\] \[<em>-s FIELD</em>\] <em>DOMAINSPEC</em>

### Description

Subcommand to show and manipulate domains.

### Commands

`create`  
Create a new domain

`delete`  
Soft-delete a domain

`list`  
List domains

`modify`  
Modify domain

`purge`  
Permanently delete domain

`query`  
Query domain attributes

`recover`  
Recover a soft-deleted domain

`show`  
Show detailed information about a domain

### Options

`ATTRIBUTE`  
Attributes to query. Available attributes are <em>ID</em>, <em>activeUsers</em>, <em>address</em>, <em>adminName</em>, <em>chat</em>, <em>chatID</em>, <em>displayname</em>, <em>domainStatus</em>, <em>domainname</em>, <em>endDay</em>, <em>homedir</em>, <em>homeserverID</em>, <em>inactiveUsers</em>, <em>maxUser</em>, <em>orgID</em>, <em>tel</em> and <em>title</em>

If no attributes are specified, <em>ID</em>, <em>domainname</em> and <em>domainStatus</em> are shown.

`DOMAINNAME`  
Complete name of the domain

`DOMAINSPEC`  
Domain name prefix or domain ID

`--create-role`  
Automatically create a domain administrator role for the new domain

`--files`  
Also delete files from disk

`-f FIELD=<value>`, `--filter FIELD=<value>`  
Filter expression in the form of ‘field=value’. Can be specified multiple times to refine filter

`--format FORMAT`  
Output format. Can be one of <em>csv</em>, <em>json-flat</em>, <em>json-kv</em>, <em>json-object</em>, <em>json-structured</em> and <em>pretty</em>. Default is <em>pretty</em>.

`--homeserver HOMESERVER`  
ID of the homeserver to place the domain on

`--no-defaults`  
Do not apply configured default values

`--separator SEPARATOR`  
String to use for column separation (<em>csv</em> and <em>pretty</em> only). Must have length 1 if format is <em>csv</em>. Default is "," for <em>csv</em> and " " for pretty.

`-s FIELD`, `--sort FIELD`  
Sort by field. Can be given multiple times

`-y`, `--yes`  
Assume yes instead of prompting

### Fields

`--address ADDRESS`  
Content of address field

`--adminName ADMINNAME`  
Name of the domain administrator or primary contact

`--endDay ENDDAY`  
Date of domain expiration in YYYY-MM-DD format

`--orgID ID`  
ID of the organization to assign the domain to

`--tel TEL`  
Telephone number of domain administrator or primary contact

`-u MAXUSER`, `--maxUser MAXUSER`  
Maximum number of users in the domain

### See Also

<strong>grommunio-admin</strong>(1), <strong>grommunio-admin-exmdb</strong>(1), <strong>grommunio-admin-fs</strong>(1), <strong>grommunio-admin-server</strong>(1), <strong>grommunio-admin-user</strong>(1)
