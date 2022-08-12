Gromox verbose debug options
============================

The gromox-http daemon can be made to emit more messages for detailed
debugging. See the respective manpages for details.

* `/etc/gromox/http.cfg`: `http_debug=1` to dump HTTP requests/responses as
  they happen.
* `/etc/gromox/http.cfg`: `msrpc_debug=1` to dump short status reports of
  DCE remote procedure calls.
* `/etc/gromox/exchange_nsp.cfg`: `nsp_trace=1` to dump entry/exit to NSP
  (addresbook) procedures and some data.
* `/etc/gromox/exchange_emsmdb.cfg`: `rop_debug=1` or =2 to dump EMSMDB ROPs
  issued by clients. (One DCE call may include multiple ROP commands.)
* `/etc/gromox/exmdb_provider.cfg`: `exrpc_debug=1` or =2 to dump all issued
  EXMDB RPCs (network only, not shmem calls made by emsmdb)
* Sending SIGUSR1 to gromox-http: Dumps the currently active HTTP connections
  and EMSMDB sessions.
