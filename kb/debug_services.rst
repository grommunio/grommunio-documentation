..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2020-2023 grommunio GmbH

Debug Services
==============

Log level
---------

As of Gromox gromox-1.33-72-ge09fed809, all messages have a severity level
associated with them, and the Gromox daemons have a log level setting. The
default level is 4 (NOTICE).

Verbose debug options
---------------------

The gromox-http daemon can be made to emit more messages for detailed
debugging. See the respective manpages for details.

To see these debug messages, the log level also needs to be cranked
to 6 (DEBUG) in various daemons, e.g. ``http.cfg:http_log_level``.

* ``/etc/gromox/http.cfg``: ``http_debug=1`` to dump HTTP requests/responses as
  they happen. Credentials may become visible, so take care!
* ``/etc/gromox/http.cfg``: ``msrpc_debug=1`` to dump short status reports of
  DCE remote procedure calls.
* ``/etc/gromox/exchange_nsp.cfg``: ``nsp_trace=1`` to dump entry/exit to NSP
  (addresbook) procedures and some data.
* ``/etc/gromox/exchange_emsmdb.cfg``: ``rop_debug=2`` to dump EMSMDB ROPs
  issued by clients. (One DCE call may include multiple ROP commands.)
* ``/etc/gromox/exmdb_provider.cfg``: ``exrpc_debug=2`` to dump all issued
  EXMDB RPCs (network only, not shmem calls made by emsmdb)
* ``/etc/gromox/exmdb_provider.cfg``: ``sqlite_debug=1`` to dump all SQLite SQL
  statements as they are issued. Failing statements will be logged in any case.
* (There is no knob for mysql_adaptor SQL statements. However, failing
  statements will be logged in any case.)
* Sending SIGUSR1 to gromox-http dumps the currently active HTTP connections
  and EMSMDB sessions.

Similar directives exist for other daemons:

* ``/etc/gromox/zcore.cfg``: ``zrpc_debug=2`` to dump all issued Zcore RPCs
  by php-fpm.
* ``/etc/gromox/midb.cfg``: ``midb_cmd_debug=2`` to dump all MIDB commands.
* ``/etc/gromox/midb.cfg``: ``sqlite_debug=1`` to dump all SQLite SQL statements
  as they are issued.
* ``/etc/gromox/imap.cfg``: ``imap_cmd_debug=2`` to dump all IMAP commands
  (without responses). Credentials may become visible.
* ``/etc/gromox/pop3.cfg``: ``pop3_cmd_debug=2`` to dump all POP3 commands
  (without responses). Credentials may become visible.
