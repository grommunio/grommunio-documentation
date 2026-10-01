---
title: "zcore(8gx)"
description: "zcore — Bridge for PHP-MAPI requests"
sidebar:
  order: 50
---

## Name

zcore — Bridge for PHP-MAPI requests

## Synopsis

<strong>zcore</strong> \[<strong>-c</strong> <em>config</em>\]

## Description

zcore is a bridge process (proxy) between PHP-MAPI and the Information Store (see manpages [mapi(4gx)](/man/mapi-4gx/) and [exmdb_provider(4gx)](/man/exmdb_provider-4gx/), respectively). It listens on /run/gromox/zcore.sock (hardcoded) for zcore RPCs, a Gromox-specific protocol and issues exmdb RPCs to [exmdb_provider(4gx)](/man/exmdb_provider-4gx/). As exmdb_provider connections have no state to speak of, zcore is the process that defines the logins sessions. zcore needs to run on the same server as the program that uses the PHP-MAPI functions.

## Options

<dfn class="gx-param">-c</dfn> <em>config</em>  
Read configuration directives from the given file. If this option is not specified, /etc/gromox/gromox.cfg and /etc/gromox/zcore.cfg will be read.

<dfn class="gx-param">--version</dfn>  
Output version information and exit.

<dfn class="gx-param">-?</dfn>  
Display option summary.

All time-based command-line options and configuration file directives are subject to the syntax described in [gromox(7)](/man/gromox-7/), section "Duration specifications".

## Configuration directives (gromox.cfg)

The following directives are recognized when reading from /etc/gromox/gromox.cfg, or when the <strong>-c</strong> option is used to specify a custom file:

<dfn class="gx-param">daemons_fd_limit</dfn>  
In gromox-zcore, this is treated as an alias for zcore_fd_limit.

<dfn class="gx-param">outgoing_smtp_url</dfn>  
See [gromox.cfg(5)](/man/gromox-cfg-5/):outgoing_smtp_url.

<dfn class="gx-param">zcore_fd_limit</dfn>  
Request that the file descriptor table be at least this large. The magic value 0 indicates that the system default hard limit (rlim_max, cf. setrlimit(2)) should be used.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

## Configuration directives (zcore.cfg)

The following directives are recognized when reading from /etc/gromox/zcore.cfg, or when the <strong>-c</strong> option is used to specify a custom file:

<dfn class="gx-param">address_cache_interval</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">5 minutes</span>

<dfn class="gx-param">address_table_size</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">3000</span>

<dfn class="gx-param">config_file_path</dfn>  
Colon-separated list of directories which will be scanned when locating further configuration files, especially those used by subcomponent instances. (For example, [mysql_adaptor(4gx)](/man/mysql_adaptor-4gx/) would be directed to look at /etc/gromox/zcore/mysql_adaptor.cfg before /etc/gromox/mysql_adaptor.cfg.)\
<span class="gx-deflabel">Default:</span> <span class="gx-default">/etc/gromox/zcore:/etc/gromox</span>

<dfn class="gx-param">data_file_path</dfn>  
Colon-separated list of directories which will be scanned when locating data files.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">/usr/share/gromox/zcore</span>

<dfn class="gx-param">host_id</dfn>  
A unique identifier for this system. It is used for the HELO line of outgoing SMTP connections, and as an unused identifier within muidStoreWrap entryids. The identifier should only use characters allowed for hostnames.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(system hostname)</span>

<dfn class="gx-param">mailbox_ping_interval</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">5 minutes</span>

<dfn class="gx-param">mail_max_length</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">64M</span>

<dfn class="gx-param">max_ext_rule_length</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">510K</span>

<dfn class="gx-param">max_rcpt_num</dfn>  
The maximum number of recipients that an e-mail is allowed to have.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">256</span>

<dfn class="gx-param">rpc_proxy_connection_num</dfn>  
The maximum number of (idle) connections towards Information Store homeservers that are kept alive for rapid re-use.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">10</span>

<dfn class="gx-param">submit_command</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">/usr/bin/php /usr/share/gromox/submit.php</span>

<dfn class="gx-param">user_cache_interval</dfn>  
Sets the time how long the MAPI profile is cached before it is written to disk.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">1 hour</span>

<dfn class="gx-param">user_table_size</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">5000</span>

<dfn class="gx-param">x500_org_name</dfn>  
See [gromox.cfg(5)](/man/gromox-cfg-5/):x500_org_name.

<dfn class="gx-param">zcore_listen</dfn>  
The named path for the AF_LOCAL socket that zcore will listen on.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">/run/gromox/zcore.sock</span>

<dfn class="gx-param">zcore_log_file</dfn>  
Target for log messages here. Special values: "<em>-</em>" (stderr/syslog depending on parent PID) or "<em>syslog</em>" are recognized.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>-</em> (auto)</span>

<dfn class="gx-param">zcore_log_level</dfn>  
Maximum verbosity of logging. 1=crit, 2=error, 3=warn, 4=notice, 5=info, 6=debug.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>4</em> (notice)</span>

<dfn class="gx-param">zcore_max_obh_per_session</dfn>  
The maximum number of object handles each session can have at any one time (e.g. folders/messages/etc. open simultaneously). Use 0 to indicate unlimited. There is one session for each time a mailbox is opened.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">500</span>

<dfn class="gx-param">zcore_threads_num</dfn>  
The minimum number of client processing threads to keep around.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">10</span>

<dfn class="gx-param">zrpc_debug</dfn>  
Log every incoming zcore RPC and the return code of the operation in a minimal fashion to stdout. Level 1 emits RPCs with a failure return code, level 2 emits all RPCs. Note the daemon log level needs to be "debug" (6), too.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

## Network protocol

The transmissions on the zcore socket are simple concatenations of protocol data units built using the NDR format. The PDU length is present within the PDU itself near the start.

    {
    	leuint32_t length;
    	char pdu[];
    }

    pdu := {
    	uint8_t call_id;
    	string directory;
    	switch (call_id) {
    		...
    	}
    }

## Store lookup

zcore determines the homeserver and store path for a user from the user database, which is provided by [mysql_adaptor(4gx)](/man/mysql_adaptor-4gx/).

Each line in this file consists of 4 columns separated by whitespace:

- A portion of the store path to match on

- The type of store ("private" or "public")

- The IPv6 socket address of the server running [exmdb_provider(4gx)](/man/exmdb_provider-4gx/). The address must conform to [gromox(7)](/man/gromox-7/) § "Host addresses".

- The TCP port number of the server

## Signals

Upon receipt of SIGHUP, configuration files are re-read, but only a few select directives can be changed this way, as many parts do not implement reload.

Upon receipt of SIGHUP, the address book cache will be dropped; the next regular request for the AB will cause it to be reloaded.

## Files

- <em>data_file_path</em>/folder_names.txt: Translations for essential folders in a message store.

- <em>data_file_path</em>/notify_bounce/: templates for read/nonread notification mails sent to originators

## Notes

Behavior for the address book generally mirrors [exchange_nsp(4gx)](/man/exchange_nsp-4gx/), so see that manpage for additional notes.

## See also

<strong>gromox</strong>(7)
