---
title: "midb(8gx)"
description: "midb — Message Index database daemon"
sidebar:
  order: 50
---

## Name

midb — Message Index database daemon

## Synopsis

<strong>midb</strong> \[<strong>-c</strong> <em>config</em>\]

## Description

midb is used by [imap(8gx)](/man/imap-8gx/) and [pop3(8gx)](/man/pop3-8gx/) to generate and keep track of folder and message summaries. In particular, it enumerates messages to give them their IMAP UID and have at all times a suitable UIDNEXT value for folders ready. midb also caches the Message-Id, modification date, message flags, subject and sender to facilitate IMAP listings.

## Options

<dfn class="gx-param">-c</dfn> <em>config</em>  
Read configuration directives from the given file. If this option is not specified, /etc/gromox/gromox.cfg and /etc/gromox/midb.cfg will be read.

<dfn class="gx-param">--version</dfn>  
Output version information and exit.

<dfn class="gx-param">-?</dfn>  
Display option summary.

All time-based command-line options and configuration file directives are subject to the syntax described in [gromox(7)](/man/gromox-7/), section "Duration specifications".

## Configuration directives (gromox.cfg)

The following directives are recognized when reading from /etc/gromox/gromox.cfg, or when the <strong>-c</strong> option is used to specify a custom file:

<dfn class="gx-param">daemons_fd_limit</dfn>  
In gromox-midb, this is treated as an alias for midb_fd_limit.

<dfn class="gx-param">midb_fd_limit</dfn>  
Request that the file descriptor table be at least this large. The magic value 0 indicates that the system default hard limit (rlim_max, cf. setrlimit(2)) should be used.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">midb_listen</dfn>  
A space-separated list of bind address specifiers to expose the MIDB service on.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>\[::1\]:5555</em></span>

## Configuration directives (midb.cfg)

The following directives are recognized when reading from /etc/gromox/midb.cfg, or when the <strong>-c</strong> option is used to specify a custom file:

<dfn class="gx-param">config_file_path</dfn>  
Colon-separated list of directories which will be scanned when locating further configuration files, especially those used by subcomponent instances. (For example, [mysql_adaptor(4gx)](/man/mysql_adaptor-4gx/) would be directed to look at /etc/gromox/midb/mysql_adaptor.cfg before /etc/gromox/mysql_adaptor.cfg.)\
<span class="gx-deflabel">Default:</span> <span class="gx-default">/etc/gromox/midb:/etc/gromox</span>

<dfn class="gx-param">data_file_path</dfn>  
Colon-separated list of directories which will be scanned when locating data files.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">/usr/share/gromox/midb</span>

<dfn class="gx-param">midb_cache_interval</dfn>  
The time after the last use of a particular midb.sqlite3 that the sqlite gets unloaded.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">30minutes</span>

<dfn class="gx-param">midb_cmd_debug</dfn>  
Log every incoming MIDB command and the return code of the operation in a minimal fashion to stderr (not midb_log_file!). Level 1 emits commands with a failure return code, level 2 emits all commands. Logs are written to stderr only.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">midb_hosts_allow</dfn>  
A space-separated list of individual host addresses that are allowed to converse with the midb service. The addresses must conform to [gromox(7)](/man/gromox-7/) § "Host addresses". No networks and no CIDR notations are permitted. This option deprecates the /etc/gromox/midb_acl.txt file used before Gromox 2.8.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">::1</span>

<dfn class="gx-param">midb_listen_ip</dfn>  
Deprecated in favor of gromox.cfg:midb_listen.

<dfn class="gx-param">midb_listen_port</dfn>  
Deprecated in favor of gromox.cfg:midb_listen.

<dfn class="gx-param">midb_log_file</dfn>  
Target for log messages here. Special values: "<em>-</em>" (stderr/syslog depending on parent PID) or "<em>syslog</em>" are recognized.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>-</em> (auto)</span>

<dfn class="gx-param">midb_log_level</dfn>  
Maximum verbosity of logging. 1=crit, 2=error, 3=warn, 4=notice, 5=info, 6=debug.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>4</em> (notice)</span>

<dfn class="gx-param">midb_reload_interval</dfn>  
The time after a midb.sqlite3 was first loaded that it will be unloaded.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">60min</span>

<dfn class="gx-param">midb_schema_upgrades</dfn>  
This directive controls whether database schemas are automatically upgraded when a message index database (midb.sqlite) is loaded. During this time, that DB is unavailable and operations on it will be delayed. Connection aborts, if any, would be due to timeouts in components other than midb. (The file can temporarily grow to double its size, so ample disk space may be required.)\
<span class="gx-deflabel">Default:</span> <span class="gx-default">yes</span>

<dfn class="gx-param">midb_table_size</dfn>  
Maximum number of message index databases that may be open at any one time. When this limit is reached, database access requests can fail until cache entries are released. See midb_cache_interval and midb_reload_interval for the lifetimes.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">5000</span>

<dfn class="gx-param">midb_threads_num</dfn>  
The exact number of client processing threads to keep around. This also controls the maximum number of concurrent connections by external clients towards midb.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">100</span>

<dfn class="gx-param">rpc_proxy_connection_num</dfn>  
The maximum number of (idle) connections towards Information Store homeservers that are kept alive for rapid re-use.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">10</span>

<dfn class="gx-param">sqlite_debug</dfn>  
If set to 1, every query given to SQLite prepare/execute is logged. If set to 0, only failed queries are logged. (It cannot be made completely silent, since our queries ought to never fail.)\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">x500_org_name</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">(unspecified)</span>

## See also

<strong>gromox</strong>(7)
