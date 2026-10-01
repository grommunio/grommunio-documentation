---
title: "http(8gx)"
description: "http — Protocol handler for HTTP and RPCH"
sidebar:
  order: 50
---

## Name

http — Protocol handler for HTTP and RPCH

## Synopsis

<strong>http</strong> \[<strong>-c</strong> <em>config</em>\]

## Description

http(8gx) is a trivial HTTP server. It understands the special HTTP methods as used by RPC-over-HTTP protocol as used by Outlook, it can serve files verbatim, or forward requests to a FastCGI server such as php-fpm(8).

Generally, http(8gx) also executed the Information Store, [exmdb_provider(4gx)](/man/exmdb_provider-4gx/), which is a loadable module.

## Options

<dfn class="gx-param">-c</dfn> <em>config</em>  
Read configuration directives from the given file. If this option is not specified, /etc/gromox/gromox.cfg and /etc/gromox/http.cfg will be read.

<dfn class="gx-param">-?</dfn>  
Display option summary.

## URI processing order

- Requests are passed to the [mod_rewrite(4gx)](/man/mod_rewrite-4gx/) module (built-in) to have their URI potentially rewritten.

- If a HTTP request is using the methods RPC_IN_DATA or RPC_OUT_DATA, the data stream is handed off to the [exchange_emsmdb(4gx)](/man/exchange_emsmdb-4gx/) component.

- Otherwise, HTTP processing modules (HPM) are invoked. Processing ends when one module signals that the request was handled. The order depends on the HPM list (which is fixed): ews, mh_emsmdb, mh_nsp, oxdisco, oab.

- Otherwise, the [mod_fastcgi(4gx)](/man/mod_fastcgi-4gx/) module (built-in) is invoked. Processing ends if the module handled the request.

- Otherwise, the [mod_cache(4gx)](/man/mod_cache-4gx/) module (built-in) is invoked. Processing ends if the module handled the request.

- Otherwise, the request is rejected.

## RPC-over-HTTP

RPC-over-HTTP utilizes two special HTTP methods, RPC_IN_DATA and RPC_OUT_DATA. These requests can, similarly to HTTP CONNECT, be very long-lived. The RPC data stream is handled by the included [exchange_emsmdb(4gx)](/man/exchange_emsmdb-4gx/) component.

All time-based command-line options and configuration file directives are subject to the syntax described in [gromox(7)](/man/gromox-7/), section "Duration specifications".

## Configuration directives (gromox.cfg)

The following directives are recognized when reading from /etc/gromox/gromox.cfg, or when the <strong>-c</strong> option is used to specify a custom file:

<dfn class="gx-param">daemons_fd_limit</dfn>  
In gromox-http, this is treated as an alias for http_fd_limit.

<dfn class="gx-param">http_basic_auth_cred_caching</dfn>  
Perform credential caching for HTTP Basic.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">1minute</span>

<dfn class="gx-param">http_fd_limit</dfn>  
Request that the file descriptor table be at least this large. The magic value 0 indicates that the system default hard limit (rlim_max, cf. setrlimit(2)) should be used.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">http_listen</dfn>  
A space-separated list of bind address specifiers to expose HTTP on.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>\[::\]:80</em></span>

<dfn class="gx-param">http_listen_tls</dfn>  
A space-separated list of bind address specifiers to expose implicit-TLS (HTTPS) on.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>\[::\]:443</em></span>

<dfn class="gx-param">http_remote_host_hdr</dfn>  
The name of the HTTP request header which contains the actual client IPv6/IPv4 address. When a (reverse) proxy is placed in front of gromox-http, the address gxhttp normally sees is the proxy address (e.g. ::1). If the proxy sets a custom header to convey the actual client address, Gromox can pick this up for its own reporting, which in turn is useful for e.g. fail2ban setups.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(empty)</span>

<dfn class="gx-param">istore_standalone</dfn>  
A bitmask controlling how the Information Store code should run as separate processes in separate address spaces. See [istore(8gx)](/man/istore-8gx/) for details.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

## Configuration directives (http.cfg)

The following directives are recognized when reading from /etc/gromox/http.cfg, or when the <strong>-c</strong> option is used to specify a custom file:

<dfn class="gx-param">block_interval_auths</dfn>  
The amount of time a user is blocked from connecting to the service after too many failed logins.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">1 minute</span>

<dfn class="gx-param">config_file_path</dfn>  
Colon-separated list of directories which will be scanned when locating further configuration files, especially those used by subcomponent instances. (For example, [mysql_adaptor(4gx)](/man/mysql_adaptor-4gx/) would be directed to look at /etc/gromox/http/mysql_adaptor.cfg before /etc/gromox/mysql_adaptor.cfg.)\
<span class="gx-deflabel">Default:</span> <span class="gx-default">/etc/gromox/http:/etc/gromox</span>

<dfn class="gx-param">context_average_mem</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">256K</span>

<dfn class="gx-param">context_num</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">400</span>

<dfn class="gx-param">data_file_path</dfn>  
Colon-separated list of directories which will be scanned when locating data files.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">/usr/share/gromox/http</span>

<dfn class="gx-param">fastcgi_exec_timeout</dfn>  
Maximum execution time for CGI scripts.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">10 minutes</span>

<dfn class="gx-param">gss_program</dfn>  
The helper program to use for authenticating HTTP requests when Negotiate-SPNEGO headers are presented. The value is rudimentarily tokenized at whitespaces, and no special characters may be used. If necessary, write your own wrapper. The special value "internal-gss" uses libgssapi directly.\
Negotiate was meant to carry GSS-API auth data (appearing as "Authorization: Negotiate YII..." in HTTP protocol dumps). NTLM can be wrapped in SPNEGO (also shows up as "YII"), but a handful of clients may also send raw NTLM tokens (appearing as "Authorization: Negotiate TlRMTVNT..."). Whether raw NTLM tokens are accepted by internal-gss depends on your GSS library and, more broadly, your Kerberos setup. Otherwise, you may need to use a helper program like the one from Squid. internal-gss also does not offer a way to specify a separate keytab or replay cache parameters, so use Squid's helper if you need such parameters.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>internal-gss</em>\</span>
<span class="gx-deflabel">Example:</span> <span class="gx-default"><em>/usr/lib/squid/negotiate_wrapper_auth --ntlm /usr/bin/ntlm_auth</em> --helper-protocol=squid-2.5-ntlmssp --kerberos /usr/lib/squid/negotiate_kerberos_auth -s GSS_C_NO_NAME</span>

<dfn class="gx-param">host_id</dfn>  
A unique identifier for this system. It is used for the Server HTTP responses header, for components like [exmdb_provider(4gx)](/man/exmdb_provider-4gx/), which makes use of it for SMTP HELO lines, for DSN report texts, for MIDB database/EML cache. The identifier should only use characters allowed for hostnames.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(system hostname)</span>

<dfn class="gx-param">http_auth_basic</dfn>  
Enable HTTP Basic authentication.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">yes</span>

<dfn class="gx-param">http_auth_spnego</dfn>  
Enable HTTP Negotiate authentication.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">no</span>

<dfn class="gx-param">http_auth_times</dfn>  
The number of login tries a user is allowed before the account is blocked.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">10</span>

<dfn class="gx-param">http_certificate_passwd</dfn>  
The password to unlock TLS certificates.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(unset)</span>

<dfn class="gx-param">http_certificate_path</dfn>  
A colon-separated list of TLS certificate files. The complete certificate chain should be present (as there is no other config directive to pull CA certs in, and implicit loading from system directories is not guaranteed by Gromox).\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(unset)</span>

<dfn class="gx-param">http_conn_timeout</dfn>  
If a HTTP connection is inactive for the given period, the connection is terminated.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">3 minutes</span>

<dfn class="gx-param">http_debug</dfn>  
If set to <strong>1</strong>, prints all incoming and outgoing HTTP traffic to stderr (not http_log_file!).\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">http_enforce_auth</dfn>  
Enforce authentication at all times. This is a debugging knob.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">no</span>

<dfn class="gx-param">http_krb_service_principal</dfn>  
Kerberos service principal to use when gss_program=internal-gss. The form is often something like <em>HTTP</em><strong>/</strong><em>fqdn</em><strong>@</strong><em>REALM</em>, but may vary. When using an external GSS authentication helper, http_krb_service_principal has no effect, and any principal you want to use needs to be passed via the <strong>gss_program</strong> directive in some way. be\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(empty)</span>

<dfn class="gx-param">http_listen_addr</dfn>  
Deprecated in favor of gromox.cfg:http_listen / gromox.cfg:http_listen_tls.

<dfn class="gx-param">http_listen_port</dfn>  
Deprecated in favor of gromox.cfg:http_listen.

<dfn class="gx-param">http_listen_tls_port</dfn>  
Deprecated in favor of gromox.cfg:http_listen_tls.

<dfn class="gx-param">http_log_file</dfn>  
Target for log messages here. Special values: "<em>-</em>" (stderr/syslog depending on parent PID) or "<em>syslog</em>" are recognized.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>-</em> (auto)</span>

<dfn class="gx-param">http_log_level</dfn>  
Maximum verbosity of logging. 1=crit, 2=error, 3=warn, 4=notice, 5=info, 6=debug.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>4</em> (notice)</span>

<dfn class="gx-param">http_private_key_path</dfn>  
A colon-separated list of TLS certificate private key files.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(unset)</span>

<dfn class="gx-param">http_rqbody_flush_size</dfn>  
If the HTTP request to a CGI endpoint has a HTTP body larger than the limit given here, the data is buffered in a file rather than kept in memory. If the request uses Chunked Transfer Encoding, a file is used unconditionally.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">512K</span>

<dfn class="gx-param">http_rqbody_max_size</dfn>  
If the Content-Length of a HTTP request to a CGI endpoint is larger than this value, the request is rejected.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">50M</span>

<dfn class="gx-param">http_support_tls</dfn>  
This flag controls whether (or not) the server offers TLS at all. The default is false because you need a certificate for this first.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">false</span>

<dfn class="gx-param">http_thread_charge_num</dfn>  
Connection load factor (oversubscription ratio) for a processing thread.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">20</span>

<dfn class="gx-param">http_thread_init_num</dfn>  
The initial and also minimum number of client processing threads to keep around. This is similar to php-fpm's start_servers/min_spare_servere. (The maximum number of threads, i.e. what would be max_spare_servers, is determined by: context_num divided by http_thread_charge_num)\
<span class="gx-deflabel">Default:</span> <span class="gx-default">5</span>

<dfn class="gx-param">msrpc_debug</dfn>  
Log every completed RPC call and the return code of the operation in a minimal fashion to stderr. Level 1 emits RPCs with a failure return code, level 2 emits all RPCs. Note the daemon log level needs to be "debug" (6), too.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">request_max_mem</dfn>  
The maximum hint size for fragmented RPC PDU requests that will be allowed (C706 §12.6.3.7, MS-RPCE v33 §2.2.2.6).\
<span class="gx-deflabel">Default:</span> <span class="gx-default">4M</span>

<dfn class="gx-param">tls_min_proto</dfn>  
The lowest TLS version to offer. Possible values are: <strong>tls1.0</strong>, <strong>tls1.1</strong>, <strong>tls1.2</strong>, and, if supported by the system, <strong>tls1.3</strong>.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">tls1.2</span>

<dfn class="gx-param">running_identity</dfn>  
An unprivileged user account to switch the process to after startup. To inhibit the switch, assign the empty value.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">gromox</span>

<dfn class="gx-param">user_default_lang</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">en</span>

## Signals

Upon receipt of SIGHUP, configuration files are re-read, but only a few select directives can be changed this way, as many parts do not implement reload.

Upon receipt of SIGUSR1, a dump of the currently active HTTP connections will be printed to stderr.

## Normative references

- MS-RPCE: Remote Procedure Call Protocol Extensions

- DCERPC / C706: Technical Standard DCE 1.1: Remote Procedure Call by The Open Group, 1997

## See also

<strong>gromox</strong>(7), <strong>mod_cache</strong>(4gx), <strong>mod_fastcgi</strong>(4gx), <strong>mod_rewrite</strong>(4gx)
