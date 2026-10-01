---
title: "exmdb_local(4gx)"
description: "exmdb_local — LDA hook that offers a [exmdb_provider(4gx)](/man/exmdb_provider-4gx/) client with a C API"
sidebar:
  order: 50
---

## Name

exmdb_local — LDA hook that offers a [exmdb_provider(4gx)](/man/exmdb_provider-4gx/) client with a C API

## Description

An LDA hook for [delivery(8gx)](/man/delivery-8gx/) which places mail into a store by connecting to a [exmdb_provider(4gx)](/man/exmdb_provider-4gx/) service.

## Configuration directives

The usual config file location is /etc/gromox/exmdb_local.cfg.

<dfn class="gx-param">autoreply_silence_window</dfn>  
-\> See [gromox.cfg(5)](/man/gromox-cfg-5/) manpage instead!

<dfn class="gx-param">autoreply_subject_prefix</dfn>  
-\> See [gromox.cfg(5)](/man/gromox-cfg-5/) manpage instead!

<dfn class="gx-param">cache_scan_interval</dfn>  
Interval in which to scan /var/lib/gromox/queue/cache.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">3min</span>

<dfn class="gx-param">exmdb_connection_num</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">5</span>

<dfn class="gx-param">lda_mrautoproc</dfn>  
Perform meeting request autoprocessing. This feature is currently experimental. Requires lda_twostep_ruleproc to be enabled.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">no</span>

<dfn class="gx-param">lda_relay_unknown_recipients</dfn>  
-\> See [gromox.cfg(5)](/man/gromox-cfg-5/) manpage instead!

<dfn class="gx-param">lda_twostep_ruleproc</dfn>  
If set to <em>1</em>, an alternate rule processor codebase will be used which supports cross-store moves, forwarding and OOF condition but (at this time) no delegation or autoreply.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">response_audit_capacity</dfn>  
Keep track of at most this many {From address, To address} pairs for bounce reports in memory.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">1000</span>

<dfn class="gx-param">response_interval</dfn>  
If a bounce report message for a delivery failure or operational failure is to be generated, that return message will be suppressed if another report for the given {From, To} address pair was produced within the given time period previously.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">3min</span>

<dfn class="gx-param">retrying_times</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">30</span>

<dfn class="gx-param">x500_org_name</dfn>  
See [gromox.cfg(5)](/man/gromox-cfg-5/):x500_org_name.

## Notes

Out-of-office replies are only generated when one of the recipient's addresses (primary or alias) appears in the To, Cc or Bcc line of the message, cf. RFC 5230 section 4.5. Mail that reaches a mailbox only by way of e.g. a distribution group thus produces no OOF reply.

## Files

- <em>data_file_path</em>/local_bounce/: response templates for when mail cannot be delivered

## See also

<strong>gromox</strong>(7), <strong>delivery</strong>(8gx), <strong>exmdb_provider</strong>(4gx)
