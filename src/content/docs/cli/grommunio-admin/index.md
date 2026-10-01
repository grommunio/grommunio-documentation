---
title: "grommunio-admin"
description: "grommunio-admin — grommunio admin CLI"
sidebar:
  label: "Overview"
  order: 0
---

### Name

grommunio-admin — grommunio admin CLI

### Synopsis

<strong>grommunio-admin</strong> <em>-h</em>\
<strong>grommunio-admin</strong> <em>COMMAND</em> \[<em>-h</em> \| <em>ARGS…</em>\]

### Description

Command line interface of the grommunio Admin API.

The CLI is not intended to provide the full functionality of the REST interface, but rather a low level administrative tool.\
As the CLI is still under development, usage in automated scripts is generally discouraged.

The <em>-h</em>/\*--help\* option is not documented separately for each subcommand, but is valid at any point and prints usage information for the current subcommand.

The CLI supports color output if the <em>termcolor</em> module is installed.

### Commands

#### config

Configuration introspection. See <em>grommunio-admin-config(1)</em>.

#### chat

Chat management. See <em>grommunio-admin-chat(1)</em>.

#### connect

Connect to remote CLI. See <em>grommunio-admin-connect(1)</em>

#### dbconf

Database-stored configuration management. See <em>grommunio-admin-dbconf(1)</em>.

#### domain

Domain management. See <em>grommunio-admin-domain(1)</em>.

#### exmdb

Access and modify stores of domains and users. See <em>grommunio-admin-exmdb(1)</em>.

#### fetchmail

Fetchmail management. See <em>grommunio-admin-fetchmail(1)</em>.

#### fs

Filesystem operations. See <em>grommunio-admin-fs(1)</em>.

#### ldap

LDAP configuration, diagnostics and synchronization. See <em>grommunio-admin-ldap(1)</em>.

#### mconf

Managed configurations manipulation. See <em>grommunio-admin-mconf(1)</em>.

#### mlist

Mailing/distribution list management. See <em>grommunio-admin-mlist(1)</em>.

#### passwd

User password management. See <em>grommunio-admin-passwd(1)</em>.

#### run

Run the REST API. See <em>grommunio-admin-run(1)</em>.

#### server

Multi-server configuration. See <em>grommunio-admin-server(1)</em>

#### service

Control external services interface. See <em>grommunio-admin-service(1)</em>

#### shell

Start interactive shell. See <em>grommunio-admin-shell(1)</em>.

#### taginfo

Print information about proptags. See <em>grommunio-admin-taginfo(1)</em>.

#### user

User management. See <em>grommunio-admin-user(1)</em>.

#### version

Show version information. See <em>grommunio-admin-version(1)</em>.

### See Also

<strong>grommunio-dbconf</strong>(1)
