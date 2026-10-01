---
title: "exchange_nsp(4gx)"
description: "exchange_nsp — Handler for the Name Service Provider Interface Protocol"
sidebar:
  order: 50
---

## Name

exchange_nsp — Handler for the Name Service Provider Interface Protocol

## Description

exchange_nsp is a component for [http(8gx)](/man/http-8gx/) which handles the Name Service Provider Interface Protocol, in essence providing the Address Book for Outlook's EMSMDB32.DLL connector.

## Configuration directives

The usual config file location is /etc/gromox/exchange_nsp.cfg.

<dfn class="gx-param">cache_interval</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">5 minutes</span>

<dfn class="gx-param">hash_table_size</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">3000</span>

<dfn class="gx-param">nsp_trace</dfn>  
Level 1: Log entry into and exit out of NSP functions, with their parameter values to stderr (not http_log_file!). Log data dumps of select calls. Level 2: Dump more data.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">x500_org_name</dfn>  
See [gromox.cfg(5)](/man/gromox-cfg-5/):x500_org_name.

## Notes

A number of properties are always synthesized by exchange_nsp and never read from any storage; this includes key properties such as PR_ENTRYID, PR_RECORD_KEY, etc.

For user-attached properties that are read from SQL (cf. table "user_properties"), exchange_nsp (as well as [zcore(8gx)](/man/zcore-8gx/)'s AB) only handles a subset of property types: PT_BOOLEAN, PT_SHORT, PT_LONG, PT_I8, PT_SYSTIME, PT_BINARY, PT_UNICODE/STRING8 and PT_MV_UNICODE/STRING8.

## Signals

Upon receipt of SIGHUP, the address book cache will be dropped; the next regular request for the AB will cause it to be reloaded.

- MS-OXNSPI: Exchange Server Name Service Provider Interface (NSPI) Protocol

## See also

<strong>gromox</strong>(7), <strong>http</strong>(8gx)
