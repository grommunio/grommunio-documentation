---
title: "imap(8gx)"
description: "imap — Gromox IMAP server"
sidebar:
  order: 50
---

## Name

imap — Gromox IMAP server

## Authentication

The IMAP server supports impersonation. The username given to the IMAP login normally specifies both the mailbox and the user performing the access. To use a different identity for authentication, prefix the mailbox name by the user identity and separate it with an exclamation mark, e.g. "myaccount@domain.example!sharedmbox@domain.example". Accessing a store in such manner is only possible when the authenticating user has store ownership over the mailbox.

(The exclamation mark was once used for path routing in Usenet, which might explain how the exclamation mark never became a character that is widely used for email addresses, despite being a valid character for an RFC 5322 addr-spec. That drove the choice to use the character for denoting impersonation; it could be regarded as a form of routing. ("Through myaccount@, access sharedmbox@"))

## Synopsis

<strong>imap</strong> \[<strong>-c</strong> <em>config</em>\]

## Options

<dfn class="gx-param">-c</dfn> <em>config</em>  
Read configuration directives from the given file. If this option is not specified, /etc/gromox/gromox.cfg and /etc/gromox/imap.cfg will be read.

<dfn class="gx-param">--version</dfn>  
Output version information and exit.

<dfn class="gx-param">-?</dfn>  
Display option summary.

All time-based command-line options and configuration file directives are subject to the syntax described in [gromox(7)](/man/gromox-7/), section "Duration specifications".

## Configuration directives (gromox.cfg)

The following directives are recognized when reading from /etc/gromox/gromox.cfg, or when the <strong>-c</strong> option is used to specify a custom file:

<dfn class="gx-param">daemons_fd_limit</dfn>  
In gromox-imap, this is treated as an alias for imap_fd_limit.

<dfn class="gx-param">imap_fd_limit</dfn>  
Request that the file descriptor table be at least this large. The magic value 0 indicates that the system default hard limit (rlim_max, cf. setrlimit(2)) should be used.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">imap_accept_haproxy</dfn>  
This directive sets the expectation for incoming connections to carry haproxy's "PROXY" protocol extension version 2 (2), or no such header (0). When a (reverse) proxy is placed in front of gromox-imap, the address that gximap normally sees is the proxy address (e.g. ::1). A proxy can use this protocol extension to convey the actual client address, and gximap can pick this up for its own reporting, which in turn is useful for e.g. fail2ban setups.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">imap_listen</dfn>  
A space-separated list of bind address specifiers to expose standard IMAP (unencrypted and/or explicit STARTTLS) on.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>\[::\]:143</em></span>

<dfn class="gx-param">imap_listen_tls</dfn>  
A space-separated list of bind address specifiers to expose implicit-TLS IMAP (IMAPS) on.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>\[::\]:993</em></span>

## Configuration directives (imap.cfg)

The following directives are recognized when reading from /etc/gromox/imap.cfg, or when the <strong>-c</strong> option is used to specify a custom file:

<dfn class="gx-param">block_interval_auths</dfn>  
The amount of time a user is blocked from connecting to the service after too many failed logins.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">1 minute</span>

<dfn class="gx-param">config_file_path</dfn>  
Colon-separated list of directories which will be scanned when locating further configuration files, especially those used by subcomponent instances. (For example, [mysql_adaptor(4gx)](/man/mysql_adaptor-4gx/) would be directed to look at /etc/gromox/imap/mysql_adaptor.cfg before /etc/gromox/mysql_adaptor.cfg.)\
<span class="gx-deflabel">Default:</span> <span class="gx-default">/etc/gromox/imap:/etc/gromox</span>

<dfn class="gx-param">context_average_mem</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">128K</span>

<dfn class="gx-param">context_average_mitem</dfn>  
The expected average upper bound of number of mails for a folder. Together with context_num, this directive controls the size of the memory pool for listings.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">64K</span>

<dfn class="gx-param">context_num</dfn>  
Maximum number of concurrently active sessions.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">200</span>

<dfn class="gx-param">data_file_path</dfn>  
Colon-separated list of directories in which static data files will be searched.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">/usr/share/gromox/imap</span>

<dfn class="gx-param">default_lang</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">en</span>

<dfn class="gx-param">enable_rfc2971_commands</dfn>  
RFC 2971 specifies the "ID" command with which a client can inquire the program name and version of the server. This is disabled by default, as it can facilitate potential attackers' information gathering.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">no</span>

<dfn class="gx-param">host_id</dfn>  
A unique identifier for this system. It is used in the IMAP protocol greeting lines (positive as well as negative). It is furthermore used as a unique identifier among the set of all [midb(8gx)](/man/midb-8gx/) clients to construct filenames for the MIDB database/EML cache. The identifier should only use characters allowed for hostnames.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(system hostname)</span>

<dfn class="gx-param">imap_auth_times</dfn>  
The number of login tries a user is allowed before the account is blocked.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">10</span>

<dfn class="gx-param">imap_autologout_time</dfn>  
If an authenticated IMAP connection is idle for the given period, the connection is terminated. RFC 2060 §5.4 recommends 30 minutes minimum. (Connections that have not authenticated are subject to the regular imap_conn_timeout.)\
<span class="gx-deflabel">Default:</span> <span class="gx-default">30 minutes</span>

<dfn class="gx-param">imap_certificate_passwd</dfn>  
The password to unlock TLS certificates.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(unset)</span>

<dfn class="gx-param">imap_certificate_path</dfn>  
A colon-separated list of TLS certificate files. The complete certificate chain should be present (as there is no other config directive to pull CA certs in, and implicit loading from system directories is not guaranteed by Gromox).\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(unset)</span>

<dfn class="gx-param">imap_cmd_debug</dfn>  
Log every incoming IMAP command and the return code of the operation in a minimal fashion to stderr. Level 1 emits commands that have failed execution, level 2 emits all commands. (The response text is <strong>not</strong> sent to the log, because of size. Deep analysis can be done with socat/telnet/tcpdump; shallow analysis for end-users is possible with the protocol-compliant error-reporting MUA "Alpine" <https://alpineapp.email/>.)\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">imap_conn_timeout</dfn>  
If an IMAP connection stalls (writing responses to client) for the given period, the connection is terminated. If unauthenticated IMAP connections do not have any activity (requests from clients) for the given period, the connection is terminated.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">3 minutes</span>

<dfn class="gx-param">imap_expunge_on_delete</dfn>  
When a STORE command sets the \Deleted flag, expunge the affected messages immediately instead of waiting for an EXPUNGE or CLOSE command. Some clients mark messages as deleted without ever expunging them. For example, Thunderbird does this when moving messages to a different account, which leaves such messages visible to non-IMAP clients indefinitely.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">false</span>

<dfn class="gx-param">imap_force_tls</dfn>  
This flag controls whether clients must utilize TLS, either by way of implicit TLS, or through the STARTTLS command.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">false</span>

<dfn class="gx-param">imap_listen_addr</dfn>  
Deprecated in favor of gromox.cfg:imap_listen / gromox.cfg:imap_listen_tls.

<dfn class="gx-param">imap_listen_port</dfn>  
Deprecated in favor of gromox.cfg:imap_listen.

<dfn class="gx-param">imap_listen_tls_port</dfn>  
Deprecated in favor of gromox.cfg:imap_listen_tls.

<dfn class="gx-param">imap_log_file</dfn>  
Target for log messages here. Special values: "<em>-</em>" (stderr/syslog depending on parent PID) or "<em>syslog</em>" are recognized.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>-</em> (auto)</span>

<dfn class="gx-param">imap_log_level</dfn>  
Maximum verbosity of logging. 1=crit, 2=error, 3=warn, 4=notice, 5=info, 6=debug.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>4</em> (notice)</span>

<dfn class="gx-param">imap_private_key_path</dfn>  
A colon-separated list of TLS certificate private key files.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(unset)</span>

<dfn class="gx-param">imap_rfc9051</dfn>  
Enable RFC 9051 (IMAP 4.2) related logic and protocol elements.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">yes</span>

<dfn class="gx-param">imap_support_tls</dfn>  
This flag controls the offering of TLS modes. This affects both the implicit TLS port as well as the advertisement of the STARTTLS extension and availability of the STARTTLS command (RFC 2595) to clients.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">false</span>

<dfn class="gx-param">imap_thread_charge_num</dfn>  
Connection load factor (oversubscription ratio) for a processing thread.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">40</span>

<dfn class="gx-param">imap_thread_init_num</dfn>  
The initial and also minimum number of client processing threads to keep around. This is similar to php-fpm's start_servers/min_spare_servere. (The maximum number of threads, i.e. what would be max_spare_servers, is determined by: context_num divided by imap_thread_charge_num)\
<span class="gx-deflabel">Default:</span> <span class="gx-default">5</span>

<dfn class="gx-param">running_identity</dfn>  
An unprivileged user account to switch the process to after startup.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">gromox</span>

<dfn class="gx-param">tls_min_proto</dfn>  
The lowest TLS version to offer. Possible values are: <strong>tls1.0</strong>, <strong>tls1.1</strong>, <strong>tls1.2</strong>, and, if supported by the system, <strong>tls1.3</strong>.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">tls1.2</span>

## Signals

Upon receipt of SIGHUP, configuration files are re-read, but only a few select directives can be changed this way, as many parts do not implement reload.

## Files

- <em>data_file_path</em>/folder_lang.txt: Translations for IMAP folder names.

- <em>data_file_path</em>/imap_code.txt: Mapping from internal IMAP error codes to textual descriptions.

## See also

<strong>gromox</strong>(7), <strong>midb_agent</strong>(4gx)
