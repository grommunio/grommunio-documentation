---
title: "grommunio-admin dbconf"
description: "grommunio-admin dbconf — Database-stored configuration management."
sidebar:
  label: "dbconf"
  order: 10
---

### Name

grommunio-admin dbconf — Database-stored configuration management.

### Synopsis

<strong>grommunio-admin dbconf</strong> (<em>commit</em> \| <em>delete</em>) <em>SERVICE</em> \[<em>FILE</em> \[<em>KEY</em>\]\]\
<strong>grommunio-admin dbconf</strong> <em>get</em> <em>SERVICE</em> <em>FILE</em> \[<em>KEY</em>\]\
<strong>grommunio-admin dbconf</strong> <em>list</em> \[<em>SERVICE</em> \[<em>FILE</em> \[<em>KEY</em>\]\]\]\
<strong>grommunio-admin dbconf</strong> <em>set</em> \[<em>-b</em>\] \[<em>-i</em>\] \[--\] <em>SERVICE</em> <em>FILE</em> <em>KEY</em> <em>VALUE</em>

### Description

<em>grommunio dbconf</em> provides the ability to store and manage configurations at a single location while making it available across distributed systems. The configurations are stored in the central MySQL database and can be accessed via <em>grommunio-dbconf(1)</em> and <em>grommunio-admin-dbconf(1)</em>.\
While both tools essentially provide the same functionality, <em>grommunio-dbconf(1)</em> provides far better performance and is intended to be used for quickly accessing the configuration.

Configurations consist of key/value pairs organized in files, grouped by service. Each service can have an arbitrary number of configuration files, which in turn can contain an arbitrary number of unique keys.

### Commands

`commit`  
Trigger commit hook for service, file or key

`delete`  
Delete service, file or key

`get`  
Get file or single key

`list`  
List available services, files or keys

`set`  
Set a configuration key

### Options

`SERVICE`  
Name of the service to configure

`FILE`  
Name of the configuration file

`KEY`  
Name of the configuration key

`VALUE`  
Value to store in the key

`--`  
Indicate that all options have been specified and only names follow

`-b`, `--batch`  
Do not auto-commit

`-i`, `--init`  
Only set if configuration key does not exist yet

### grommunio-admin

The grommunio-admin API and CLI are also dbconf consumers. This allows system adiministrators to change certain configurations without filesystem access and the need to restart the API.

The following files and keys are meaningful when placed under the <em>grommunio-admin</em> service:

#### multi-server

`policy`  
Server selection policy for newly created users and domains in multi-server environments. Possible values are <em>balanced</em>, <em>first</em>, <em>last</em>, <em>random</em> and <em>round-robin</em>. Default is <em>round-robin</em>.

### Commit Hooks

When modifying values, potential consumers can be notified of this change via commit hooks, for example by restarting the service using the configuration. For security reasons only a few white-listed commands are available (see section <em>AVAILABLE COMMIT COMMANDS</em>).

Commit hooks can be defined on `key`, `file` or `service` level. <em>set</em> operations always trigger commits at key level, while the <em>commit</em> command can directly trigger key or service level hooks depending on whether a file or key is specified.

If no hook is defined for a specific trigger level, it automatically falls through to the next lower level, in the order <em>key</em> \> <em>file</em> \> <em>service</em>.

Commit hooks for a service can be defined by setting `commit_key`, `commit_file` and `commit_service` keys under <em>grommunio-dbconf/\<service\></em> to a valid command (see below).

### Available Commit Commands

The following commands are available:

#### Key

`postconf -e $ENTRY`

#### File

`postconf -e $FILE_S && systemctl reload postfix`

#### Service

`systemctl reload $SERVICE`\
`systemctl restart $SERVICE`

### Macros

As the whitelisted commands might be hard to memorize and may be changed in the future, macros are provided that expand to whitelisted commands.

The following macros are defined:

#### Key

`#POSTCONF` -\> `postconf -e $ENTRY`

#### File

`#POSTCONF` -\> `sudo postconf -e $FILE_S && systemctl reload postfix`

#### Service

`#RELOAD` -\> `systemctl reload $SERVICE`\
`#RESTART` -\> `systemctl restart $SERVICE`

### Command Variable Expansion

Commands can contain <em>\$</em>-prefixed variables that are expanded before execution. The literal <em>\$\$</em> can be used to generate a single <em>\$</em>.

The following variables are valid:

`ENTRY`  
Expands to `$KEY=$VALUE` (key level only)

`FILE`  
Complete content of the modified file as newline separated key=value entries (file level only)

`FILE_S`  
Complete content of the modified file as space separated key=value entries (file level only)

`FILENAME`  
Name of the modified file (key and file level)

`KEY`  
The modified key (key level only)

`SERVICE`  
Name of the modified service

`VALUE`  
New value of the modified key (key level only)

### See Also

<strong>grommunio-admin</strong>(1), <strong>grommunio-admin-config</strong>(1), <strong>grommunio-admin-mconf</strong>(1). <strong>grommunio-dbconf</strong>(1)
