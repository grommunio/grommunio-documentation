---
title: "grommunio-admin passwd"
description: "grommunio-admin passwd — Set user password"
sidebar:
  label: "passwd"
  order: 10
---

### Name

grommunio-admin passwd — Set user password

### Synopsis

<strong>grommunio-admin passwd</strong> \[<em>-a</em>\] \[<em>-l LENGTH</em>\] \[<em>-p PASSWORD</em>\]  
\[<em>--password-stdin</em>\] \[<em>USER</em>\]

### Description

Set user password.\
If no user is specified, the password is set for the <em>admin</em> user, which is created automatically if necessary.\
If none of <em>-a</em>, <em>-p</em> or <em>--password-stdin</em> is provided, the user is prompted for a password.

### Options

`USER`  
User to set password for (default <em>admin</em>)

`-a`, `--auto`  
Automatically generate a password

`-l LENGTH`, `--length LENGTH`  
Length of the automatically generated password (default 16)

`-p PASSWORD`, `--password PASSWORD`  
Password to set (do not prompt). Note that the password is visible to every local user in the process list for as long as the command runs; on multi-user hosts use <em>--password-stdin</em> instead.

`--password-stdin`  
Read the password from the first line of standard input (do not prompt). The trailing newline is stripped; any further input is ignored.

### See Also

<strong>grommunio-admin</strong>(1), <strong>grommunio-admin-user</strong>(1)
