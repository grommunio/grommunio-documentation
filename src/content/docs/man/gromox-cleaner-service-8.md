---
title: "gromox-cleaner.service(8)"
description: "gromox-cleaner.service, gromox-cleaner.timer — Soft-deleted message/attachment removal"
sidebar:
  order: 50
---

## Name

gromox-cleaner.service, gromox-cleaner.timer — Soft-deleted message/attachment removal

## Description

gromox-cleaner.service is a systemd unit that invokes [gromox-mbop(8)](/man/gromox-mbop-8/) to clear out soft-deleted messages from stores, as well as reclaim space by deleting orphaned on-disk attachment files which are no longer referenced by any message. Usually, the service is invoked periodically from gromox-cleaner.timer.

## Configuration

/etc/gromox/gromox.cfg is read for the following directives:

<dfn class="gx-param">softpurge_purgetime</dfn>  
Controls the lifetime of soft-deleted messages. Messages which have the soft-delete flag (a.k.a. "hidden flag" in Exchange) and which have their PR_LAST_MODIFICATION_TIME older than this interval are hard-deleted.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">30days</span>

## See also

<strong>gromox</strong>(7), <strong>gromox-mbop</strong>(8)
