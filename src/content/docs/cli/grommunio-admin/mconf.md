---
title: "grommunio-admin mconf"
description: "grommunio-admin mconf — Managed configuration manipulation"
sidebar:
  label: "mconf"
  order: 10
---

### Name

grommunio-admin mconf — Managed configuration manipulation

### Synopsis

<strong>grommunio-admin mconf</strong> <strong>dump</strong> \[<em>-c</em>\] <em>CONFIG</em>\
<strong>grommunio-admin mconf</strong> <strong>modify</strong> <em>CONFIG</em> <em>unset</em> <em>KEY</em>\
<strong>grommunio-admin mconf</strong> <strong>modify</strong> <em>CONFIG</em> <em>ACTION</em> \[<em>-i</em> \| <em>-b</em>\] <em>KEY</em> <em>VALUE</em>\
<strong>grommunio-admin mconf</strong> <strong>print</strong> <em>CONFIG</em>\
<strong>grommunio-admin mconf</strong> <strong>reload</strong> <em>CONFIG</em>\
<strong>grommunio-admin mconf</strong> <strong>save</strong> <em>CONFIG</em>

### Description

grommunio managed configuration (mconf) offers the possibility to manipulate configuration files used by gromox.

### Commands

`dump`  
Print configuration file that would be generated from internal state

`modify`  
Modify internal configuration state

`print`  
Print internal configuration state

`reload`  
Reload configuration from disk

`save`  
Save configuration file to disk

### Options

`ACTION`  
Modification action:

<em>add</em> - Add entry to list\
<em>remove</em> - Remove entry from list\
<em>set</em> - Add key\
<em>unset</em> - Remove key

`CONFIG`  
Configuration file, either <em>authmgr</em> or <em>ldap</em>

`KEY`  
Configuration key

`VALUE`  
Configuration value for numeric or boolean values use <em>-b</em> and <em>-i</em> respectively

`-b`, `--bool`  
Convert value to boolean, valid values are <em>y</em>, <em>n</em>, <em>yes</em>, <em>no</em>, <em>true</em>, <em>false</em>, <em>1</em>, <em>0</em>

`-c`, `--censor`  
Hide confidential information

`-i`, `--int`  
Convert value to integer, octal (<em>0o</em>) and hexadecimal (<em>0x</em>) prefixes are supported

### See Also

<strong>grommunio-admin</strong>(1), <strong>grommunio-admin-config</strong>(1), grommunio-admin-dbconf\*\*(1),\*\*grommunio-admin-ldap\*\*(1)
