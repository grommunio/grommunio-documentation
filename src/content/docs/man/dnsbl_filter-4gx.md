---
title: "dnsbl_filter(4gx)"
description: "dnsbl_filter — DNS Blacklist filtering"
sidebar:
  order: 50
---

## Name

dnsbl_filter — DNS Blacklist filtering

## Description

dnsbl_filter is a module which will query a Domain Name System Realtime Blackhole/Blacklist/Block List to deny access to IP addresses attempting to connect to Gromox services. In particular, (only) the four services use it; gromox-imap(8), gromox-pop3(8), gromox-delivery-queue(8) and gromox-http(8).

## Configuration directives

The config file location is /etc/gromox/gromox.cfg; service specific locations are /etc/gromox/http/gromox.cfg, /etc/gromox/imap/gromox.cfg and /etc/gromox/pop3/gromox.cfg.

<dfn class="gx-param">dnsbl_client</dfn>  
This sets the zone suffix to use for queries. If no zone is set, no DNSBL checking takes place.\
<span class="gx-deflabel">Example:</span> <span class="gx-default"><em>xbl.spamhaus.org</em>\</span>
<span class="gx-deflabel">Default:</span> <span class="gx-default">(unset)</span>

## See also

<strong>gromox</strong>(7)
