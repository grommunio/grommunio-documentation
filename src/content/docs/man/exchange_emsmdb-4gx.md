---
title: "exchange_emsmdb(4gx)"
description: "exchange_emsmdb(4gx) — Handler for the Wire Format Protocol (Outlook/Exchange RPCs) and Remote Operations Protocol"
sidebar:
  order: 50
---

## Name

exchange_emsmdb(4gx) — Handler for the Wire Format Protocol (Outlook/Exchange RPCs) and Remote Operations Protocol

## Description

exchange_emsmdb is a component of [http(8gx)](/man/http-8gx/) which handles (1.) the remote procedure calls for the EMSMDB v1 and AsyncEMSMDB v1 RPC interfaces, and (2.) the Remote Operations encoding protocol that is typically wrapped by EMSMDB's EcDoRpcExt2 call or MAPIHTTP's EXECUTE call.

EMSMDB is a DCE/RPC interface with just a few RPC calls (6 are still used today). ecDoRpcExt2, a call offered by that interface, takes an opaque byte buffer argument not interpreted by DCE/RPC. That byte buffer contains another protocol, "Remote Operation(s) Encoding Protocol" \[OXCROPS\]. No reason for this wrapping is given in the OXCRPC spec. MAPIHTTP runs OXCROPS directly without the extra DCERPC/EMSMDB framing.

OXCROPS consists of 130 calls that make up the mailbox protocol.

## Configuration directives (gromox.cfg)

The following directives are recognized when they appear in /etc/gromox/gromox.cfg.

<dfn class="gx-param">emsmdb_compress_threshold</dfn>  
When a ROP response buffer has at least this many bytes, attempt to compress with LZXpress. (Use -1 to disable compression.) This format/implementation is underperforming in modern contexts: the rate is just about 60 MB/s on a 5950X CPU, which is a tenth of what zstd-1.5.7 achieves, and the compression ratio is somewhere between Unix compress(1) and gzip level 1.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">-1</span>

<dfn class="gx-param">outgoing_smtp_url</dfn>  
See [gromox.cfg(5)](/man/gromox-cfg-5/):outgoing_smtp_url.

## Configuration directives (exchange_emsmdb.cfg)

The following directives are recognized when they appear in /etc/gromox/exchange_emsmdb.cfg.

<dfn class="gx-param">async_threads_num</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">4</span>

<dfn class="gx-param">ems_max_active_notifh</dfn>  
Maximum number of concurrently active notify handles.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(unlimited)</span>

<dfn class="gx-param">ems_max_active_sessions</dfn>  
Maximum number of concurrently active EMSMDB sessions. The special value 0 indicates unlimited. The special value 0 indicates unlimited. EMSMDB sessions are not tied to any particular TCP connection; sessions terminate by means of an explicit "ecDoDisconnect" request, or by an inactivity timer (currently 2000 seconds). MFCMAPI sends ecDoDisconnect, but Outlook just breaks off TCP connections, so sessions can pile up.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(unlimited)</span>

<dfn class="gx-param">ems_max_active_users</dfn>  
Maximum number of concurrently active EMSMDB session owners (users). The special value 0 indicates unlimited.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(unlimited)</span>

<dfn class="gx-param">ems_max_pending_sesnotif</dfn>  
Maximum number of pending notifications for an EMSMDB session. \[Content tables on search folders can rack up enormous amounts of notifications, so worry not upon seeing W-2305 warnings in the log.\]\
<span class="gx-deflabel">Default:</span> <span class="gx-default">64K</span>

<dfn class="gx-param">emsmdb_collapse_notif_storm</dfn>  
Collapse long runs of pending row-added/row-modified table notifications for a session into a single table-changed notification, like is always done for row-deleted runs. This spares the server one synchronous row read per pending notification when the response is serialized, at the price of clients reloading the affected table view. Exchange 2019 delivers individual events; keep this off if exact notification behavior matters more than throughput under bulk changes.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">no</span>

<dfn class="gx-param">emsmdb_max_cxh_per_user</dfn>  
The maximum number of EMSMDB sessions (CXH = RPC context handle) for one user. The special value 0 indicates unlimited. EMSMDB sessions are not tied to any particular TCP connection; sessions terminate by means of an explicit "ecDoDisconnect" request, or by an inactivity timer (currently 2000 seconds). Outlook does not send ecDoDisconnect (MFCMAPI does), so sessions can pile up.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">100</span>

<dfn class="gx-param">emsmdb_max_obh_per_session</dfn>  
The maximum number of object handles (e.g. folders/messages/etc.) each ROP logon (contrary to the name, not EMSMDB session) can have at any one time concurrently. Use 0 to indicate unlimited. On average, Outlook creates six ROP logons per mailbox that it opens.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">32768</span>

<dfn class="gx-param">emsmdb_private_folder_softdelete</dfn>  
Enables soft-delete support for folders in private stores. (This feature is experimental.) Public folders always have this on. (Take note that exmdb_provider.cfg:exmdb_private_folder_softdelete also need to be enabled.)\
<span class="gx-deflabel">Default:</span> <span class="gx-default">yes</span>

<dfn class="gx-param">emsmdb_rop_chaining</dfn>  
0: Deactivate ROP chaining. 1: Enable ROP chaining for OL \< 15 and OL \>= 16.0.10000 (OL2019, OL2021, OLM365). 2: Enabled for all clients.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">1</span>

<dfn class="gx-param">mailbox_ping_interval</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">5 minutes</span>

<dfn class="gx-param">mail_max_length</dfn>  
The maximum size for any individual attachment and message. Attempts to store objects larger than this are rejected. The upper limit is 2G, imposed by Exchange protocols.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">64M</span>

<dfn class="gx-param">max_ext_rule_length</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">510K</span>

<dfn class="gx-param">max_rcpt_num</dfn>  
The maximum number of recipients that an e-mail is allowed to have.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">256</span>

<dfn class="gx-param">rop_debug</dfn>  
Log every incoming OXCROP call and the return code of the operation in a minimal fashion. Level 1 emits ROPs with a failure return code, level 2 emits all ROPs. Note the daemon log level needs to be "debug" (6), too.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">submit_command</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">/usr/bin/php /usr/share/gromox/submit.php</span>

<dfn class="gx-param">x500_org_name</dfn>  
See [gromox.cfg(5)](/man/gromox-cfg-5/):x500_org_name.

## Files

- <em>data_file_path</em>/notify_bounce/: templates for read/nonread notification mails sent to originators

## Outlook notes

Outlook can be started with the <strong>/rpcinfo</strong> command-line parameter to display a status table about the RPC connections it has open. Alternatively, one can Ctrl-MouseBtn3 (right button) on the status tray icon to call up a context menu, from which "Connection status..." can be selected for the same.

## Signals

Upon receipt of SIGHUP, configuration files are re-read, but only a few select directives can be changed this way, as many parts do not implement reload.

Upon receipt of SIGUSR1, an overview of current EMSMDB sessions to the configured log device (stderr/journal by default). EMSMDB sessions are not linked to any one HTTP connection in particular, and multiple HTTP connections may exercise one session.

## Normative references

- DCERPC / C706: Technical Standard DCE 1.1: Remote Procedure Call by The Open Group, 1997

- MS-OXCRPC: Wire Format Protocol. This is the document for the EMSMDB RPC interface.

- MS-OXCROPS: Remote Operations List and Encoding Protocol.

## See also

<strong>gromox</strong>(7), <strong>http</strong>(8gx)
