---
title: "timer(8gx)"
description: "<strong>timer</strong> — deferred command executor"
sidebar:
  order: 50
---

## Name

<strong>timer</strong> — deferred command executor

## Synopsis

<strong>timer</strong> \[<strong>-c</strong> <em>config</em>\]

## Description

The timer daemon can be used to schedule commands to be executed once, at a particular time in the future. It is similar to the at(1) command and its associated daemon, atd.

timer(8gx) generally receives commands from [timer_agent(4gx)](/man/timer_agent-4gx/).

## Options

<dfn class="gx-param">-c</dfn> <em>config</em>  
Read configuration directives from the given file. If this option is not specified, /etc/gromox/gromox.cfg and /etc/gromox/timer.cfg will be read.

<dfn class="gx-param">--version</dfn>  
Output version information and exit.

<dfn class="gx-param">-?</dfn>  
Display option summary.

All time-based command-line options and configuration file directives are subject to the syntax described in [gromox(7)](/man/gromox-7/), section "Duration specifications".

## Files

- /var/lib/gromox/timer.txt: This file is used to save the state of timer(8gx) and persist them across restarts.

## Configuration directives

The usual config file location is /etc/gromox/timer.cfg.

<dfn class="gx-param">running_identity</dfn>  
An unprivileged user account to switch the process to after startup. To inhibit the switch, assign the empty value.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">gromox</span>

<dfn class="gx-param">timer_hosts_allow</dfn>  
A space-separated list of individual IPv6 or v4-mapped IPv6 host addresses that are allowed to converse with the timer service. No networks and no CIDR notations are permitted.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">::1</span>

<dfn class="gx-param">timer_listen_ip</dfn>  
An IPv6 address (or v4-mapped address) for exposing the timer service on.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">::1</span>

<dfn class="gx-param">timer_listen_port</dfn>  
The TCP port number for exposing the timer service on.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">6666</span>

<dfn class="gx-param">timer_log_file</dfn>  
Target for log messages here. Special values: "<em>-</em>" (stderr/syslog depending on parent PID) or "<em>syslog</em>" are recognized.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>-</em> (auto)</span>

<dfn class="gx-param">timer_log_level</dfn>  
Maximum verbosity of logging. 1=crit, 2=error, 3=warn, 4=notice, 5=info, 6=debug.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>4</em> (notice)</span>

<dfn class="gx-param">timer_state_path</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">/var/lib/gromox/timer.txt</span>

<dfn class="gx-param">timer_threads_num</dfn>  
The minimum number of client processing threads to keep around.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">50</span>

## Timer protocol

The timer service is exposed as a line-based text protocol. Upon connection, the event server gratitiously writes "OK", following which the server will wait for timer commands, and execute them synchronously.

The command "ADD \<seconds\> \<command\>" installs a new timer for the given command to be executed in that many seconds from now. The server will respond with "FALSE 2", "FALSE 3", or respond with the timer ID as "TRUE \<id\>".

The command "CANCEL \<id\>" revokes the timer with the chosen ID.

## See also

<strong>gromox</strong>(7), <strong>timer_agent</strong>(4gx)
