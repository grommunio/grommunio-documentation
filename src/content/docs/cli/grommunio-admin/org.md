---
title: "grommunio-admin org"
description: "grommunio-admin org — Organization management"
sidebar:
  label: "org"
  order: 10
---

### Name

grommunio-admin org — Organization management

### Synopsis

<strong>grommunio-admin org</strong> <strong>create</strong> \[<em>--description DESCRIPTION</em>\] \[<em>--domain DOMAIN</em> …\] <em>ORGNAME</em>\
<strong>grommunio-admin org</strong> <strong>delete</strong> <em>ORGSPEC</em>\
<strong>grommunio-admin org</strong> <strong>modify</strong> \[<em>\<FIELDS\></em>\] <em>ORGSPEC</em>\
<strong>grommunio-admin org</strong> <strong>query</strong> \[<em>-f ATTRIBUTE=\<value\></em>\] \[<em>--format FORMAT</em>\] \[<em>--separator SEPARATOR</em>\] \[<em>-s FIELD</em>\] \[<em>ATTRIBUTE</em> …\]\
<strong>grommunio-admin org</strong> <strong>show</strong> \[<em>-f FIELD=\<value\></em>\] \[<em>-s FIELD</em>\] <em>ORGSPEC</em>

### Description

Subcommand to show and manipulate organizations.

### Commands

`create`  
Create a new organization

`delete`  
Delete an organization

`modify`  
Modify organization

`query`  
Query organization attributes

`show`  
Show detailed information about an organization

### Options

`ATTRIBUTE`  
Attributes to query. Available attributes are <em>ID</em>, <em>name</em>, <em>description</em> and <em>domainCount</em>

If no attributes are specified, <em>ID</em>, <em>name</em> and <em>domainCount</em> are shown.

`ORGNAME`  
Complete name of the organization

`ORGSPEC`  
Organization name prefix or organization ID

`-f FIELD=<value>`, `--filter FIELD=<value>`  
Filter expression in the form of ‘field=value’. Can be specified multiple times to refine filter

`--format FORMAT`  
Output format. Can be one of <em>csv</em>, <em>json-flat</em>, <em>json-kv</em>, <em>json-object</em>, <em>json-structured</em> and <em>pretty</em>. Default is <em>pretty</em>.

`--separator SEPARATOR`  
String to use for column separation (<em>csv</em> and <em>pretty</em> only). Must have length 1 if format is <em>csv</em>. Default is "," for <em>csv</em> and " " for pretty.

`-s FIELD`, `--sort FIELD`  
Sort by field. Can be given multiple times

`-y`, `--yes`  
Assume yes instead of prompting

### Fields

`--description DESCRIPTION`  
Description of the organization

`--domain DOMAINSPEC`  
Name prefix or ID of the domain to adopt. Can be given multiple times

`--name ORGNAME`  
Name of the organization

### See Also

<strong>grommunio-admin</strong>(1), <strong>grommunio-admin-domain</strong>(1), <strong>grommunio-admin-ldap</strong>(1)
