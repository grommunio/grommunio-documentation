---
title: "delivery(8gx)"
description: "delivery — Backend for local delivery"
sidebar:
  order: 50
---

## Name

delivery — Backend for local delivery

## Synopsis

<strong>delivery</strong> \[<strong>-c</strong> <em>config</em>\]

## Options

<dfn class="gx-param">-c</dfn> <em>config</em>  
Read configuration directives from the given file. If this option is not specified, /etc/gromox/gromox.cfg and /etc/gromox/delivery.cfg will be read.

<dfn class="gx-param">-?</dfn>  
Display option summary.

All time-based command-line options and configuration file directives are subject to the syntax described in [gromox(7)](/man/gromox-7/), section "Duration specifications".

## Configuration directives (gromox.cfg)

The following directives are recognized when reading from /etc/gromox/gromox.cfg, or when the <strong>-c</strong> option is used to specify a custom file:

<dfn class="gx-param">daemons_fd_limit</dfn>  
In gromox-delivery, this is treated as an alias for lda_fd_limit.

<dfn class="gx-param">lda_fd_limit</dfn>  
Request that the file descriptor table be at least this large. The magic value 0 indicates that the system default hard limit (rlim_max, cf. setrlimit(2)) should be used.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">outgoing_smtp_url</dfn>  
See [gromox.cfg(5)](/man/gromox-cfg-5/):outgoing_smtp_url.

## Configuration directives (delivery.cfg)

The following directives are recognized when reading from /etc/gromox/delivery.cfg, or when the <strong>-c</strong> option is used to specify a custom file:

<dfn class="gx-param">admin_mailbox</dfn>  
An e-mail address where to send reports from the "net_failure" code component.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(empty)</span>

<dfn class="gx-param">config_file_path</dfn>  
Colon-separated list of directories which will be scanned when locating further configuration files, especially those used by subcomponent instances. (For example, [mysql_adaptor(4gx)](/man/mysql_adaptor-4gx/) would be directed to look at /etc/gromox/delivery/mysql_adaptor.cfg before /etc/gromox/mysql_adaptor.cfg.)\
<span class="gx-deflabel">Default:</span> <span class="gx-default">/etc/gromox/delivery:/etc/gromox</span>

<dfn class="gx-param">data_file_path</dfn>  
Colon-separated list of directories in which static data files will be searched.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">/usr/share/gromox/delivery</span>

<dfn class="gx-param">dequeue_max_mem</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">1024M</span>

<dfn class="gx-param">dequeue_path</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">/var/lib/gromox/queue</span>

<dfn class="gx-param">free_context_num</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">512</span>

<dfn class="gx-param">host_id</dfn>  
A unique identifier for this system. It is used for the DSN text of bounce messages. It is used as the value for the EHLO command if and when connecting to an SMTP service (e.g. inbox rules that do forwarding).\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(system hostname)</span>

<dfn class="gx-param">lda_log_file</dfn>  
Target for log messages here. Special values: "<em>-</em>" (stderr/syslog depending on parent PID) or "<em>syslog</em>" are recognized.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>-</em> (auto)</span>

<dfn class="gx-param">lda_log_level</dfn>  
Maximum verbosity of logging. 1=crit, 2=error, 3=warn, 4=notice, 5=info, 6=debug.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>4</em> (notice)</span>

<dfn class="gx-param">running_identity</dfn>  
An unprivileged user account to switch the process to after startup.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">gromox</span>

<dfn class="gx-param">work_threads_max</dfn>  
The number of threads that gromox-delivery may spawn to process incoming messages. This number must be less-or-equal to the exmdb_local(4) exmdb_connection_num directive to avoid rejection of messages in a message storm.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">5</span>

<dfn class="gx-param">work_threads_min</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">1</span>

## Signals

Upon receipt of SIGHUP, configuration files are re-read, but only a few select directives can be changed this way, as many parts do not implement reload.

## See also

<strong>gromox</strong>(7)
