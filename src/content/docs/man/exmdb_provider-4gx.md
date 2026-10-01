---
title: "exmdb_provider(4gx)"
description: "exmdb_provider — Gromox Information Store"
sidebar:
  order: 50
---

## Name

exmdb_provider — Gromox Information Store

## Description

exmdb_provider is the mailbox engine. It offers a plethora of stateless low-level functions (about 150) for operating on mailbox stores. The functionality of the engine is exposed by way of a Gromox-specific network protocol on port 5000.

exmdb_provider is built as a shared library and can run in either the [http(8gx)](/man/http-8gx/) or [istore(8gx)](/man/istore-8gx/) processes, depending on the gromox.cfg:istore_standalone config directive.

The shared library contributes an exmdb_client API, which will transparently pick either a local or a remote procedure call depending on whether the mailbox is served by the same process or not.

## Configuration directives (gromox.cfg)

The following directives are recognized when they appear in /etc/gromox/gromox.cfg.

<dfn class="gx-param">exmdb_force_write_txn</dfn>  
(Developer option.) Perform all SQLite transactions as write transactions (i.e. with exclusive locking).\
<span class="gx-deflabel">Default:</span> <span class="gx-default">no</span>

<dfn class="gx-param">exmdb_deep_backtrace</dfn>  
(Developer option.) Record and report transaction problems with a multi-level backtrace instead of a single-level location indicator.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">no</span>

<dfn class="gx-param">exmdb_ics_log_file</dfn>  
Log ICS/synchronization requests (and their results) to this file. The value <em>-</em> selects standard error instead of a file. An empty value disables the dump.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(empty)</span>

<dfn class="gx-param">exmdb_optimize_stm</dfn>  
A debug knob to turn on/off a specific subset of the SQLite prepared statements with extended lifetimes used in the vincinity of property retrieval in conjunction with Content Table querying (e.g. exmdb_server::query_table, or MAPI ropQueryRows), Content Table matching (exmdb_server::match_table, or MAPI ropFindRow), non-instanced full message retrieval (exmdb_server::read_message, often used by our exporters).\
<span class="gx-deflabel">Default:</span> <span class="gx-default">on</span>

<dfn class="gx-param">exmdb_parallelize_schemaup</dfn>  
The maximum number of EXRPC request parsing threads that can concurrently perform schema upgrades in sqlite database files. (Other threads must wait.) This directive is meant to limit the amount of disk I/O.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">4</span>

<dfn class="gx-param">exmdb_parallelize_sqliteshut</dfn>  
On shutdown, close SQLite databases in parallel with as many threads as declared by this directive, capped by the number of processors actually available in the system. This improves the speed of the shutdown procedure. As of sqlite version 3.47, the parallel portion (\alpha in the context of Amdahl's law) is about 0.82.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">4</span>

<dfn class="gx-param">outgoing_smtp_url</dfn>  
See [gromox.cfg(5)](/man/gromox-cfg-5/):outgoing_smtp_url.

## Configuration directives (exmdb_provider.cfg)

The usual config file location is /etc/gromox/exmdb_provider.cfg.

<dfn class="gx-param">cache_interval</dfn>  
The inactivity timer after which a mailbox's sqlite files are closed.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>1min</em>\</span>
Lower limit: 1s

<dfn class="gx-param">dbg_synthesize_content</dfn>  
When this directive is set to 1, missing content files will not be regarded as an error and the respective attachment or property is delivered with a replacement string. If set to 2, a replacement string is always delivered, which is useful for reducing the amount of data downloaded when debugging ICS.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">enable_dam</dfn>  
When set to <strong>on</strong>, inbox rule processing is allowed to create Deferred Action Messages (DAM). Furthermore, the "Deferred Actions" folder will have its contents shown. / Conversely, if this directive is <strong>off</strong>, no DAMs will be created, and the DAM folder in inboxes is presented as empty to clients (even if it has content from earlier).\
Outlook's DAM handling is poor and if you experience a crash with a primary mailbox that is in non-cached/online mode a few seconds after Outlook has opened it, turn this option off for mitigation.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">on</span>

<dfn class="gx-param">exmdb_body_autosynthesis</dfn>  
When a client requests either PR_BODY, PR_HTML or PR_RTF_COMPRESSED, but that property does not exist on a particular message, automatically synthesize the data on-the-fly from another of the available formats.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">on</span>

<dfn class="gx-param">exmdb_file_compression</dfn>  
Compress content files (bodytexts and attachments). Possible values: <strong>no</strong>, <strong>yes</strong> (zstd-6), <strong>zstd-</strong><em>level</em> (level=1..19).\
<span class="gx-deflabel">Default:</span> <span class="gx-default">zstd-6</span>

<dfn class="gx-param">exmdb_hosts_allow</dfn>  
A space-separated list of individual host addresses that are allowed to converse with the exmdb service. The addresses must conform to [gromox(7)](/man/gromox-7/) § "Host addresses". No networks and no CIDR notations are permitted. This option deprecates the /etc/gromox/exmdb_acl.txt file used before Gromox 2.8.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">::1</span>

<dfn class="gx-param">exmdb_listen_port</dfn>  
The TCP port number for exposing the timer service on.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">5000</span>

<dfn class="gx-param">exmdb_pf_read_per_user</dfn>  
Keep public folder read states per user (1) or keep one state for all users (0).\
<span class="gx-deflabel">Default:</span> <span class="gx-default">1</span>

<dfn class="gx-param">exmdb_pf_read_states</dfn>  
When set to 0, messages in public stores/folders will always be shown as read and the folder summary will reflect that.\
When set to 1, messages will have new/read markings but PR_CONTENT_UNREAD will indicate 0 new messages at all times.\
When set to 2, PR_CONTENT_UNREAD indicates the number of new messages for the particular user. (Outlook does not show this number; in Folder Properties, the radiobox is even greyed out.)\
<span class="gx-deflabel">Default:</span> <span class="gx-default">2</span>

<dfn class="gx-param">exmdb_private_folder_softdelete</dfn>  
Enables soft-delete support for folders in private stores. (This feature is experimental.) Public folders always have this on.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">yes</span>

<dfn class="gx-param">exmdb_schema_upgrades</dfn>  
This directive controls whether database schemas are automatically upgraded when a mailbox is loaded. During this time, the mailbox is unavailable and operations on it will be delayed. Connection aborts, if any, would be due to timeouts in clients rather than servers. (The procedure takes roughly 36sec per gigabyte of exchange.sqlite3 worth of data, or 36sec per about 110k messages, on a 3700X CPU, single-thread. The file can also temporarily grow to double its size, so ample disk space may be required.)\
<span class="gx-deflabel">Default:</span> <span class="gx-default">yes</span>

<dfn class="gx-param">exmdb_eph_prefix</dfn>  
A path for where variadic data files that are process-temporary can be stored. This may be used to keep the tables.sqlite3 file off an NFS-backed homedir. Required disk space scales linearly with open table handles and linearly with messages in the opened folders, at about 80 bytes per messages. (In other words, don't lump molasses of messages into a single folder in a shared mailbox read by multiple people.) When you create the directory, set its ownership to gromox:gromox and mode to 0770.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(empty)</span>

<dfn class="gx-param">exmdb_search_pacing</dfn>  
When initially populating a search folder (static or dynamic), yield the lock on the sqlite database (file descriptor) after so many messages to give other clients a chance to perform an action.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">250</span>

<dfn class="gx-param">exmdb_search_pacing_time</dfn>  
When initially populating a search folder (static or dynamic), yield the lock on the sqlite database (file descriptor) after this much time has passed to give other clients a chance to perform an action.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">2s</span>

<dfn class="gx-param">exmdb_search_nice</dfn>  
Run the search folder population thread with adjusted niceness, which affects process scheduling. This is not an absolute priority as the nice(1) command would use, but a relative one, as per the nice(2) syscall. The allowed range in Gromox is 0 .. 19; negative values are not supported (and not meaningful, because Gromox will usually be running in an unprivileged setting where it is not possible to raise the priority).\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">exmdb_search_yield</dfn>  
Make the search folder population thread not only give up the lock on the sqlite database temporarily, but also invoke pthread_yield(3) after every work block (cf. exmdb_search_pacing).\
<span class="gx-deflabel">Default:</span> <span class="gx-default">no</span>

<dfn class="gx-param">exrpc_debug</dfn>  
Log every incoming exmdb network RPC and the return code of the operation in a minimal fashion to stderr. Level 1 emits RPCs with a failure return code, level 2 emits all RPCs. Note that direct function calls from within the process image are not logged this way, so this will not show exmdb_provider invocations from [exchange_emsmdb(4gx)](/man/exchange_emsmdb-4gx/). Note the daemon log level needs to be "debug" (6), too.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">listen_ip</dfn>  
The IPv6 socket address for exposing the exmdb service on. The address must conform to [gromox(7)](/man/gromox-7/) § "Host addresses".\
<span class="gx-deflabel">Default:</span> <span class="gx-default">::1</span>

<dfn class="gx-param">max_ext_rule_number</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">20</span>

<dfn class="gx-param">max_router_connections</dfn>  
As a exmdb server, permit at most this many inbound connections for the purpose of sending notifications on these channels. Note that every incoming TCP connection starts as a data connection and only becomes re-classified as "notification" once the LISTEN_NOTIFICATION RPC has been issued by the client.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">unlimited (only limited by ulimits)</span>

<dfn class="gx-param">max_rpc_stub_threads</dfn>  
As a exmdb server, permit at most this many inbound connections for commands.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">unlimited (only limited by ulimits)</span>

<dfn class="gx-param">max_rule_number</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">1000</span>

<dfn class="gx-param">max_store_message_count</dfn>  
The maximum number of messages any one particular message store is allowed to keep. The technical limit is somewhere around 2^47.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>0</em> (no limit)</span>

<dfn class="gx-param">populating_threads_num</dfn>  
The number of threads to spawn that will work on asynchronous search folder population.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">4</span>

<dfn class="gx-param">rpc_proxy_connection_num</dfn>  
The maximum number of (idle) connections towards (other) Information Store homeservers that are kept alive for re-use.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">10</span>

<dfn class="gx-param">sqlite_busy_timeout</dfn>  
This sets the maximum time that exmdb_provider/libsqlite will wait in an attempt to start an exclusive write transaction, and if the waittime is exceeded, the surrounding exmdb RPC is aborted with error.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>60s</em> (max: <em>1h</em>)</span>

<dfn class="gx-param">sqlite_debug</dfn>  
If set to 1, every query given to SQLite prepare/execute is logged. If set to 0, only failed queries are logged. (It cannot be made completely silent, since our queries ought to never fail.)\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">table_size</dfn>  
Maximum number of concurrently active mailboxes.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">5000</span>

<dfn class="gx-param">x500_org_name</dfn>  
See [gromox.cfg(5)](/man/gromox-cfg-5/):x500_org_name.

## Sharding / Multiple Home Server Cluster

Each exmdb_provider (server) instance evalutes the SQL columns <strong>users.homeserver</strong>/<strong>servers.hostname</strong> for private stores and <strong>domains.homeserver</strong>/<strong>servers.hostname</strong> for public stores against the <strong>host_id</strong> directive to determine if it should be served. exmdb_client component, as used by zcore, imapd, etc. and a plethora of command-line utilities, likewise evaluates those SQL columns to determine which server to contact.

The magic value 0 in the homeserver column means any and all server instances consider themselves authoritative. This has serious implications (concurrent writes by multiple hosts) and so, using homeserver=0 for accounts with an actual maildir should be avoided in multiserver setups. (Using 0 for Contact Objects, and using 0 for single-server setups is tolerable.)

For a decidedly single-server cluster, this cicrumstance requires attention too. For example, picture the server.hostname SQL column containing "server01.example.com", which resolves to "2001:db8::1" — this conflicts with the ::1 bind address, making connection attemps fail.

The file /etc/gromox/exmdb_list.txt became obsolete in the development phase that followed the Gromox 3.4 release.

## Network protocol

The transmissions on the socket are simple concatenations of protocol data units built using the NDR format. The PDU length is present within the PDU itself near the start.

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

## Files

- <em>data_file_path</em>/mail_bounce/

<em>config_file_path</em> and <em>data_file_path</em> is determined by the configuration of the program that loaded the exmdb_provider component.

## Environment

- ISTORE_JUST_ONE: A development knob that, in conjunction with gromox.cfg:istore_standalone=2/3, starts separate worker(s) only for the one specified user/directory.

- ISTORE_WORKER: A development knob that overrides the executable to use for istore workers. (In conjunction with ISTORE_JUST_ONE, this allows for running one user's mailbox under ASAN/TSAN.)

## Signals

Upon receipt of SIGHUP, configuration files are re-read, but only a few select directives can be changed this way, as many parts do not implement reload.

## See also

<strong>gromox</strong>(7), <strong>http</strong>(8gx)
