---
title: "ews(4gx)"
description: "ews — Handler for Exchange Web Services requests"
sidebar:
  order: 50
---

## Name

ews — Handler for Exchange Web Services requests

## Description

The ews(4gx) component handles requests to the <strong>/EWS/Exchange.asmx</strong> URI path.

## Configuration directives (gromox.cfg)

The following directives are recognized when they appear in /etc/gromox/gromox.cfg: outgoing_smtp_url. See the [gromox.cfg(5)](/man/gromox-cfg-5/) manpage.

## Configuration directives (ews.cfg)

The following directives are recognized when they appear in /etc/gromox/ews.cfg.

<dfn class="gx-param">ews_log_filter</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">!</span>

<dfn class="gx-param">ews_pretty_response</dfn>  
Controls whether SOAP/XML responses produced by ews(4gx) are emitted normally ("no") or with extra indent for debugging ("yes").\
<span class="gx-deflabel">Default:</span> <span class="gx-default">no</span>

<dfn class="gx-param">ews_request_logging</dfn>  
When set to 1 or higher, requests are logged (subject to restriction by log_filter). When set to 2 or higher, the XML input is dumped as well. The log messages are emitted with "debug" (6) priority, so you may also need to raise http.cfg:http_log_level and/or gromox.cfg:istore_log_level.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">ews_response_logging</dfn>  
When set to 1 or higher, responses are logged. When set to 2 or higher, the XML output is dumped as well. Like requests, these are logged at "debug" priority level.

<dfn class="gx-param">ews_streaming_subscription_timeout</dfn>  
The cache entry backing a streaming subscription (and its GetStreamingEvents/GetEvents liveness) is evicted after this much time has gone by without the client touching it.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">5min</span>

## Normative references

- OXWAVLS, OXWOOF, OXWSPHOTO

## See also

<strong>gromox</strong>(7), <strong>http</strong>(8gx)
