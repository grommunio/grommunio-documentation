---
title: "delivery-queue(8gx)"
description: "delivery-queue — LMTP/SMTP frontend for local delivery"
sidebar:
  order: 50
---

## Name

delivery-queue — LMTP/SMTP frontend for local delivery

## Synopsis

<strong>delivery-queue</strong> \[<strong>-c</strong> <em>config</em>\]

## Description

delivery-queue is an additional mail queue in front of [delivery(8gx)](/man/delivery-8gx/). It may be removed in a future version.

## Options

<dfn class="gx-param">-c</dfn> <em>config</em>  
Read configuration directives from the given file. If this option is not specified, /etc/gromox/gromox.cfg and /etc/gromox/smtp.cfg will be read.

<dfn class="gx-param">-?</dfn>  
Display option summary.

All time-based command-line options and configuration file directives are subject to the syntax described in [gromox(7)](/man/gromox-7/), section "Duration specifications".

## Configuration directives (gromox.cfg)

The following directives are recognized when reading from /etc/gromox/gromox.cfg, or when the <strong>-c</strong> option is used to specify a custom file:

<dfn class="gx-param">daemons_fd_limit</dfn>  
In gromox-delivery-queue, this is treated as an alias for lda_fd_limit.

<dfn class="gx-param">lda_fd_limit</dfn>  
Request that the file descriptor table be at least this large. The magic value 0 indicates that the system default hard limit (rlim_max, cf. setrlimit(2)) should be used.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">lda_listen</dfn>  
A space-separated list of bind address specifiers to expose standard SMTP/LMTP (unencrypted and/or explicit STARTTLS) on.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>\[::\]:25</em></span>

<dfn class="gx-param">lda_listen_tls</dfn>  
A space-separated list of bind address specifiers to expose implicit-TLS SMTP (SMTPS)/LMTP on. (Port 465 is the recommendation from RFC 8314.)\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>\[::\]:465</em></span>

<dfn class="gx-param">lda_recipient_delimiter</dfn>  
The set of characters that separate an email address into localpart and extension. This mirrors the "recipient_delimiter" directive from postconf(5).\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(empty)</span>

<dfn class="gx-param">lda_support_haproxy</dfn>  
This directive sets the expectation for incoming connections to carry haproxy's "PROXY" protocol extension version 2 (2), or no such header (0). When a (reverse) proxy is placed in front of gromox-delivery-queue, the address that gxdq normally sees is the proxy address (e.g. ::1). A proxy can use this protocol extension to convey the actual client address, and gximap can pick this up for its own reporting, which in turn is useful for e.g. fail2ban setups.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

## Configuration directives (smtp.cfg)

The following directives are recognized when reading from /etc/gromox/smtp.cfg, or when the <strong>-c</strong> option is used to specify a custom file:

<dfn class="gx-param">command_protocol</dfn>  
Selects what kind of hello command is accepted of clients. Can be <em>lmtp</em>, <em>smtp</em> or <em>both</em>.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">both</span>

<dfn class="gx-param">config_file_path</dfn>  
Colon-separated list of directories which will be scanned when locating further configuration files, especially those used by subcomponent instances. (For example, [mysql_adaptor(4gx)](/man/mysql_adaptor-4gx/) would be directed to look at /etc/gromox/smtp/mysql_adaptor.cfg before /etc/gromox/mysql_adaptor.cfg.)\
<span class="gx-deflabel">Default:</span> <span class="gx-default">/etc/gromox/smtp:/etc/gromox</span>

<dfn class="gx-param">context_average_mem</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">256K</span>

<dfn class="gx-param">context_max_mem</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">2M</span>

<dfn class="gx-param">context_num</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">200</span>

<dfn class="gx-param">data_file_path</dfn>  
Colon-separated list of directories which will be scanned when locating data files.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">/usr/share/gromox/smtp</span>

<dfn class="gx-param">host_id</dfn>  
A unique identifier for this system. It is used for greeting lines emitted by delivery-queue on the network.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(system hostname)</span>

<dfn class="gx-param">lda_listen_addr</dfn>  
Deprecated in favor of gromox.cfg:lda_listen / gromox.cfg:lda_listen_tls.

<dfn class="gx-param">lda_listen_port</dfn>  
Deprecated in favor of gromox.cfg:lda_listen.

<dfn class="gx-param">lda_listen_tls_port</dfn>  
Deprecated in favor of gromox.cfg:lda_listen_tls.

<dfn class="gx-param">lda_log_file</dfn>  
Target for log messages here. Special values: "<em>-</em>" (stderr/syslog depending on parent PID) or "<em>syslog</em>" are recognized.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>-</em> (auto)</span>

<dfn class="gx-param">lda_log_level</dfn>  
Maximum verbosity of logging. 1=crit, 2=error, 3=warn, 4=notice, 5=info, 6=debug.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>4</em> (notice)</span>

<dfn class="gx-param">lda_thread_charge_num</dfn>  
The maximum number of connections that each thread is allowed to process.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">40</span>

<dfn class="gx-param">lda_thread_init_num</dfn>  
The minimum number of client processing threads to keep around.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">1</span>

<dfn class="gx-param">mail_max_length</dfn>  
Maximum permitted length of a message.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">64M</span>

<dfn class="gx-param">running_identity</dfn>  
An unprivileged user account to switch the process to after startup. To inhibit the switch, assign the empty value.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">gromox</span>

<dfn class="gx-param">smtp_certificate_passwd</dfn>  
The password to unlock TLS certificates.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(unset)</span>

<dfn class="gx-param">smtp_certificate_path</dfn>  
A colon-separated list of TLS certificate files. The complete certificate chain should be present (as there is no other config directive to pull CA certs in, and implicit loading from system directories is not guaranteed by Gromox).\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(unset)</span>

<dfn class="gx-param">smtp_conn_timeout</dfn>  
If an SMTP connection is inactive for the given period, the connection is terminated.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">3 minutes</span>

<dfn class="gx-param">smtp_force_starttls</dfn>  
This flag controls whether clients must utilize TLS, either by way of implicit TLS (cf. <strong>lda_listen_tls_port</strong>), or through the STARTTLS command.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">false</span>

<dfn class="gx-param">smtp_private_key_path</dfn>  
A colon-separated list of TLS certificate private key files.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(unset)</span>

<dfn class="gx-param">smtp_support_pipeline</dfn>  
This flag controls the offering of the PIPELINING extension (RFC 2920) to clients.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">true</span>

<dfn class="gx-param">smtp_support_starttls</dfn>  
This flag controls the offering of the STARTTLS extension (RFC 3027) to clients.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">false</span>

<dfn class="gx-param">tls_min_proto</dfn>  
The lowest TLS version to offer. Possible values are: <strong>tls1.0</strong>, <strong>tls1.1</strong>, <strong>tls1.2</strong>, and, if supported by the system, <strong>tls1.3</strong>.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">tls1.2</span>

## Signals

Upon receipt of SIGHUP, configuration files are re-read, but only a few select directives can be changed this way, as many parts do not implement reload.

## Files

- <em>data_file_path</em>/smtp_code.txt: Mapping from internal SMTP error codes to textual descriptions.

## See also

<strong>gromox</strong>(7), <strong>delivery</strong>(8gx), <strong>midb_agent</strong>(4gx)
