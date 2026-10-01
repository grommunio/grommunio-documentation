---
title: "istore(8gx)"
description: "istore — Gromox Information Store launcher"
sidebar:
  order: 50
---

## Name

istore — Gromox Information Store launcher

## Synopsis

<strong>/usr/libexec/gromox/istore</strong> \[<strong>-c</strong> <em>config</em>\]

## Description

The Gromox Information Store, [exmdb_provider(4gx)](/man/exmdb_provider-4gx/), is built as a shared object, and can be either be loaded by gromox-http(8) or run in a separate process which is gromox-istore. The benefit of a separate process is improved debuggability.

## Options

<dfn class="gx-param">-c</dfn> <em>config</em>  
Read configuration directives from the given file. If this option is not specified, /etc/gromox/gromox.cfg will be read if it exists.

<dfn class="gx-param">-x</dfn> <em>userdir</em>  
Used internally by istore to re-launch itself as a single-store worker process. This option is not meant to be used by administrators.

## Configuration directives (gromox.cfg)

The following directives are recognized when reading from /etc/gromox/gromox.cfg, or when the <strong>-c</strong> option is used to specify a custom file:

<dfn class="gx-param">config_file_path</dfn>  
Colon-separated list of directories which will be scanned when locating further configuration files, especially those used by subcomponent instances. (For example, [mysql_adaptor(4gx)](/man/mysql_adaptor-4gx/) would be directed to look at /etc/gromox/istore/mysql_adaptor.cfg before /etc/gromox/mysql_adaptor.cfg.)\
<span class="gx-deflabel">Default:</span> <span class="gx-default">/etc/gromox/istore:/etc/gromox</span>

<dfn class="gx-param">daemons_fd_limit</dfn>  
In gromox-istore, this is treated as an alias for istore_fd_limit.

<dfn class="gx-param">data_file_path</dfn>  
Colon-separated list of directories which will be scanned when locating data files.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">/usr/share/gromox/istore:/usr/share/gromox</span>

<dfn class="gx-param">host_id</dfn>  
A unique identifier for this system. It is used for the Server HTTP responses header, for components like [exmdb_provider(4gx)](/man/exmdb_provider-4gx/), which makes use of it for SMTP HELO lines, for DSN report texts, for MIDB database/EML cache. The identifier should only use characters allowed for hostnames.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(system hostname)</span>

<dfn class="gx-param">istore_fd_limit</dfn>  
Request that the file descriptor table be at least this large. The magic value 0 indicates that the system default hard limit (rlim_max, cf. setrlimit(2)) should be used.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">istore_log_file</dfn>  
Target for log messages here. Special values: "<em>-</em>" (stderr/syslog depending on parent PID) or "<em>syslog</em>" are recognized.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>-</em> (auto)</span>

<dfn class="gx-param">istore_log_level</dfn>  
Maximum verbosity of logging. 1=crit, 2=error, 3=warn, 4=notice, 5=info, 6=debug.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>4</em> (notice)</span>

<dfn class="gx-param">istore_standalone</dfn>  
A bitmask controlling how the Information Store code should split itself up to run as separate processes in separate address spaces.\
Flag 0x1: Separation of the Information Store from the HTTP server. If set, the Information Store is to be launched from /usr/libexec/gromox/istore (e.g. the gromox-istore.service systemd unit) and not from /usr/libexec/gromox/http (gromox-http.service).\
Flag 0x2: Separation of individual stores. If set, the Information Store director, i.e. the code that has the port 5000 listening socket open, will spawn worker processes instead of threads.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">running_identity</dfn>  
An unprivileged user account to switch the process to after startup. To inhibit the switch, assign the empty value.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">gromox</span>

## Signals

Upon receipt of SIGHUP, configuration files are re-read, but only a few select directives can be changed this way, as many parts do not implement reload.

## See also

<strong>gromox</strong>(7), <strong>exmdb_provider</strong>(4gx)
