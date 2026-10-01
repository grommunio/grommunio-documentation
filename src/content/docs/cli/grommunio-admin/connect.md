---
title: "grommunio-admin connect"
description: "grommunio-admin connect — Connect to remote CLI"
sidebar:
  label: "connect"
  order: 10
---

### Name

grommunio-admin connect — Connect to remote CLI

### Synopsis

<strong>grommunio-admin connect</strong> \[<em>-c COMMAND</em>\] \[<em>--no-verify</em>\] \[<em>--redirect-fs</em> \[<em>--auto-save (local\|remote\|discard\|print)</em>\]\] \[<em>-v</em>\] \[<em>HOST</em> \[<em>USER</em> \[<em>PASSWORD</em>\]\]\]

### Description

Connect to a remote server to invoke CLI commands on.\
Requires a running admin API with active remote CLI and a user with `SystemAdminPermission`.

Note that the remote CLI currently uses a REST interface which does not provide a standard input, rendering commands that rely on user interaction useless.

### Options

`HOST`  
Host to connect to, in the format <em>protocol</em>://\*hostname\*:\*port\*, where protocol is either http or https. If omitted, the protocol is auto-detected, with https taking precedence over http. If no port is specified, the default ports 8080 (http) and 8443 (https) are used. <em>hostname</em> can either be a resolvable host name, an IPv4 address or an IPv6 address in brackets. The default hostname is <em>localhost</em>.

`PASSWORD`  
Password to use for authentication. Default is to prompt.

`USER`  
User to use for authentication. Default is <em>admin</em>.

`--auto-save ACTION`  
Choose automatic action for received files when filesystem redirection is enabled. Possible actions are:

<em>discard</em> - discard any received file\
<em>local</em> - save at local path\
<em>print</em> - print file contents to stdout and discard\
<em>remote</em> - save at path reported from remote server

`-c`, `--command`  
Execute command on remote server and exit instead of starting an interactive shell.

`--no-verify`  
Continue with https even if the TLS certificate presented by the server is invalid. Required if the server uses a self-signed certificate that is not installed on the system. Use with caution.

`-p`, `--password`  
Prompt for password even when connecting to localhost.

`--redirect-fs`  
Redirect CLI initiated file operations to local filesystem. See section <em>Filesystem Emulation</em> for details.

`-v`, `--verbose`  
Print more detailed information about the connection process.

### Filesystem Emulation

When the <em>--redirect-fs</em> option is given, CLI initiated file operations are performed in an emulated filesystem and written files are sent back to the client.

Note that this does only apply to files which are opened by CLI operations, while module-level operations (e.g. loading of configurations) are unaffected.

Files received from the remote server can then be viewed or saved locally.

### See Also

<strong>grommunio-admin</strong>(1), <strong>grommunio-admin-shell</strong>(1)
