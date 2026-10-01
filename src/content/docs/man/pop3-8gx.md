---
title: "pop3(8gx)"
description: "pop3 — Gromox POP3 server"
sidebar:
  order: 50
---

## Name

pop3 — Gromox POP3 server

## Authentication

The POP3 server supports impersonation; see [imap(8gx)](/man/imap-8gx/) for details.

## Synopsis

<strong>pop3</strong> \[<strong>-c</strong> <em>config</em>\]

## Options

<dfn class="gx-param">-c</dfn> <em>config</em>  
Read configuration directives from the given file. If this option is not specified, /etc/gromox/gromox.cfg and /etc/gromox/pop3.cfg will be read.

<dfn class="gx-param">--version</dfn>  
Output version information and exit.

<dfn class="gx-param">-?</dfn>  
Display option summary.

All time-based command-line options and configuration file directives are subject to the syntax described in [gromox(7)](/man/gromox-7/), section "Duration specifications".

## Configuration directives (gromox.cfg)

The following directives are recognized when reading from /etc/gromox/gromox.cfg, or when the <strong>-c</strong> option is used to specify a custom file:

<dfn class="gx-param">daemons_fd_limit</dfn>  
In gromox-pop3, this is treated as an alias for pop3_fd_limit.

<dfn class="gx-param">pop3_fd_limit</dfn>  
Request that the file descriptor table be at least this large. The magic value 0 indicates that the system default hard limit (rlim_max, cf. setrlimit(2)) should be used.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">pop3_accept_haproxy</dfn>  
This directive sets the expectation for incoming connections to carry haproxy's "PROXY" protocol extension version 2 (2), or no such header (0). When a (reverse) proxy is placed in front of gromox-pop3, the address that gxpop3 normally sees is the proxy address (e.g. ::1). A proxy can use this protocol extension to convey the actual client address, and gxpop3 can pick this up for its own reporting, which in turn is useful for e.g. fail2ban setups.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">pop3_listen</dfn>  
A space-separated list of bind address specifiers to expose standard POP3 (unencrypted and/or explicit STARTTLS) on.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>\[::\]:110</em></span>

<dfn class="gx-param">pop3_listen_tls</dfn>  
A space-separated list of bind address specifiers to expose implicit-TLS POP3 (POP3S) on.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>\[::\]:995</em></span>

## Configuration directives (pop3.cfg)

The following directives are recognized when reading from /etc/gromox/pop3.cfg, or when the <strong>-c</strong> option is used to specify a custom file:

<dfn class="gx-param">block_interval_auths</dfn>  
The amount of time a user is blocked from connecting to the service after too many failed logins.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">1 minute</span>

<dfn class="gx-param">config_file_path</dfn>  
Colon-separated list of directories which will be scanned when locating further configuration files, especially those used by subcomponent instances. (For example, [mysql_adaptor(4gx)](/man/mysql_adaptor-4gx/) would be directed to look at /etc/gromox/pop3/mysql_adaptor.cfg before /etc/gromox/mysql_adaptor.cfg.)\
<span class="gx-deflabel">Default:</span> <span class="gx-default">/etc/gromox/pop3:/etc/gromox</span>

<dfn class="gx-param">context_average_mem</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">256K</span>

<dfn class="gx-param">context_average_units</dfn>  
Lower clamp is 256.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">1024</span>

<dfn class="gx-param">context_max_mem</dfn>  
Network buffer per client.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">2M</span>

<dfn class="gx-param">context_num</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">200</span>

<dfn class="gx-param">data_file_path</dfn>  
Colon-separated list of directories in which static data files will be searched.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">/usr/share/gromox/pop3</span>

<dfn class="gx-param">enable_capa_implementation</dfn>  
When enabled, the server will include an "IMPLEMENTATION" line in the CAPA response (RFC 2449 §6.9). This is disabled by default, as it can facilitate potential attackers' information gathering.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">no</span>

<dfn class="gx-param">host_id</dfn>  
A unique identifier for this system. It is used in the POP3 protocol greeting lines (positive as well as negative). The identifier should only use characters allowed for hostnames.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(system hostname)</span>

<dfn class="gx-param">pop3_auth_times</dfn>  
The number of login tries a user is allowed before the account is blocked.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">3</span>

<dfn class="gx-param">pop3_certificate_passwd</dfn>  
The password to unlock TLS certificates.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(unset)</span>

<dfn class="gx-param">pop3_certificate_path</dfn>  
A colon-separated list of TLS certificate files. The complete certificate chain should be present (as there is no other config directive to pull CA certs in, and implicit loading from system directories is not guaranteed by Gromox).\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(unset)</span>

<dfn class="gx-param">pop3_cmd_debug</dfn>  
Log every incoming POP3 command and the return code of the operation in a minimal fashion to stderr (not pop3_log_file!). Level 1 emits commands that have failed execution, level 2 emits all commands.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">pop3_conn_timeout</dfn>  
If a POP3 connection is inactive for the given period, the connection is terminated.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">3 minutes</span>

<dfn class="gx-param">pop3_force_tls</dfn>  
This flag controls whether clients must utilize TLS, either by way of implicit TLS, or through the STLS command.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">false</span>

<dfn class="gx-param">pop3_listen_addr</dfn>  
Deprecated in favor of gromox.cfg:pop3_listen / gromox.cfg:pop3_listen_tls.

<dfn class="gx-param">pop3_listen_port</dfn>  
Deprecated in favor of gromox.cfg:pop3_listen.

<dfn class="gx-param">pop3_listen_tls_port</dfn>  
Deprecated in favor of gromox.cfg:pop3_listen_tls.

<dfn class="gx-param">pop3_log_file</dfn>  
Target for log messages here. Special values: "<em>-</em>" (stderr/syslog depending on parent PID) or "<em>syslog</em>" are recognized.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>-</em> (auto)</span>

<dfn class="gx-param">pop3_log_level</dfn>  
Maximum verbosity of logging. 1=crit, 2=error, 3=warn, 4=notice, 5=info, 6=debug.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>4</em> (notice)</span>

<dfn class="gx-param">pop3_private_key_path</dfn>  
A colon-separated list of TLS certificate private key files.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(unset)</span>

<dfn class="gx-param">pop3_support_tls</dfn>  
This flag controls the offering of TLS modes. This affects both the implicit TLS port as well as the advertisement of the STARTTLS extension and availability of the STLS command (RFC 2595) to clients.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">false</span>

<dfn class="gx-param">pop3_thread_charge_num</dfn>  
Connection load factor (oversubscription ratio) for a processing thread.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">40</span>

<dfn class="gx-param">pop3_thread_init_num</dfn>  
The initial and also minimum number of client processing threads to keep around. This is similar to php-fpm's start_servers/min_spare_servere. (The maximum number of threads, i.e. what would be max_spare_servers, is determined by: context_num divided by imap_thread_charge_num)\
<span class="gx-deflabel">Default:</span> <span class="gx-default">5</span>

<dfn class="gx-param">running_identity</dfn>  
An unprivileged user account to switch the process to after startup. To inhibit the switch, assign the empty value.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">gromox</span>

<dfn class="gx-param">tls_min_proto</dfn>  
The lowest TLS version to offer. Possible values are: <strong>tls1.0</strong>, <strong>tls1.1</strong>, <strong>tls1.2</strong>, and, if supported by the system, <strong>tls1.3</strong>.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">tls1.2</span>

## Signals

Upon receipt of SIGHUP, configuration files are re-read, but only a few select directives can be changed this way, as many parts do not implement reload.

## Files

- <em>data_file_path</em>/pop3_code.txt: Mapping from internal POP3 error codes to textual descriptions.

## See also

<strong>gromox</strong>(7), <strong>midb_agent</strong>(4gx)
