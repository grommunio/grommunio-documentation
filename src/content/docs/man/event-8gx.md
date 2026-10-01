---
title: "event(8gx)"
description: "event — Folder change notification daemon"
sidebar:
  order: 50
---

## Name

event — Folder change notification daemon

## Synopsis

<strong>event</strong> \[<strong>-c</strong> <em>config</em>\]

## Description

The event daemon is a software bus, inter-process communication (IPC) mechanism that allows communication between multiple processes running concurrently on multiple machines.

In practice, it is used by [midb(8gx)](/man/midb-8gx/), [pop3(8gx)](/man/pop3-8gx/) and [imap(8gx)](/man/imap-8gx/) to notify [imap(8gx)](/man/imap-8gx/) instances of changed folder/message states.

## Options

<dfn class="gx-param">-c</dfn> <em>config</em>  
Read configuration directives from the given file. If this option is not specified, /etc/gromox/gromox.cfg and /etc/gromox/event.cfg will be read.

<dfn class="gx-param">--version</dfn>  
Output version information and exit.

<dfn class="gx-param">-?</dfn>  
Display option summary.

All time-based command-line options and configuration file directives are subject to the syntax described in [gromox(7)](/man/gromox-7/), section "Duration specifications".

## Configuration directives

The usual config file location is /etc/gromox/event.cfg.

<dfn class="gx-param">event_hosts_allow</dfn>  
A space-separated list of individual host addresses that are allowed to converse with the event service. The addresses must conform to [gromox(7)](/man/gromox-7/) § "Host addresses". No networks and no CIDR notations are permitted.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">::1</span>

<dfn class="gx-param">event_listen_ip</dfn>  
The IPv6 socket address for exposing the event service on. The address must conform to [gromox(7)](/man/gromox-7/) § "Host addresses".\
<span class="gx-deflabel">Default:</span> <span class="gx-default">::1</span>

<dfn class="gx-param">event_listen_port</dfn>  
The TCP port number for exposing the event service on.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">33333</span>

<dfn class="gx-param">event_log_file</dfn>  
Target for log messages here. Special values: "<em>-</em>" (stderr/syslog depending on parent PID) or "<em>syslog</em>" are recognized.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>-</em> (auto)</span>

<dfn class="gx-param">event_log_level</dfn>  
Maximum verbosity of logging. 1=crit, 2=error, 3=warn, 4=notice, 5=info, 6=debug.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>4</em> (notice)</span>

<dfn class="gx-param">event_threads_num</dfn>  
The minimum number of client processing threads to keep around.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">50</span>

<dfn class="gx-param">running_identity</dfn>  
An unprivileged user account to switch the process to after startup. To inhibit the switch, assign the empty value.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">gromox</span>

## Event protocol

The event service is exposed as a line-based text protocol. Upon connection, the event server gratitiously writes "OK" and will wait for commands. Each connection to the event daemon starts out in Enqueue Mode, and this is the only mode from which commands can be issued.

"FALSE" may be emitted by the server if there is a syntax error.

### ID

The command "ID \<res_id\>" declares the particular connection to be a notification sender. res_id is generally the hostname and the PID. The server always responds with "TRUE". (The connection stays in Enqueue Mode.)

### LISTEN

The command "LISTEN \<res_id\>" declares the particular connection to be a notification receiver. res_id follows the same pattern. The server responds with "TRUE" and the connection state changes to the Dequeue Mode (see below).

### SELECT

The command "SELECT \<username\> \<folder\>" subscribes those connections that have registered <strong>as a listener for res_id</strong> to notifications. (This means that a process wishing to use [event_stub(4gx)](/man/event_stub-4gx/) to listen for notifications strictly requires loading [event_proxy(4gx)](/man/event_proxy-4gx/) too, and, in essence, use two connections to event(8gx).) The server responds with "FALSE" if no listener exists, or "TRUE" on success.

### UNSELECT

The command "UNSELECT \<username\> \<folder\>" unsubscribes those connections that had registered as a listener for res_id. The server always responds with "TRUE".

### QUIT

Terminate the connection.

### PING

Reset inactivity timer on connection.

### Partially parsed commands

Any other input is treated as a notification item and is not interpreted by event(8gx) beyond checking the number of fields:

### FOLDER-TOUCH

The notification "FOLDER-TOUCH \<username\> \<folder\>" informs listeners that the folder metadata has changed and warrants being reloaded. This is also how the arrival of new messages is conveyed.

### MESSAGE-FLAG

The notification "MESSAGE-FLAG \<username\> \<folder\> \<messageid\>" informs listeners that the message metadata has changed and warrants being reloaded. (This operation is no longer recognized since Gromox 2.17-26-g10564f3e7.)

### MESSAGE-UFLAG

The notification "MESSAGE-UFLAG \<username\> \<folder\> \<imapuid\>" informs listeners that the message metadata has changed and warrants being reloaded.

### MESSAGE-EXPUNGE

The notification "MESSAGE-EXPUNGE \<username\> \<folder\> \<messageid\>" informs listeners that the message was deleted.

### Client behavior

Clients in Dequeue Mode will receive notifications. Each notification line received by the client needs to be acknowledged with a "TRUE" response. It is not possible to exit Dequeue Mode; connection termination is the only way out.

Events do not echo for a particular res_id. The [event_proxy(4gx)](/man/event_proxy-4gx/) and [event_stub(4gx)](/man/event_stub-4gx/) components use the getpid() function when constructing the res_id for the ID/LISTEN commands. A process like [imap(8gx)](/man/imap-8gx/) which uses both components will intentionally not see its own notifications over the gromox-event IPC system this way.

## See also

<strong>gromox</strong>(7), <strong>event_proxy</strong>(4gx), <strong>event_stub</strong>(4gx)
