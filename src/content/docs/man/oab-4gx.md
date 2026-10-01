---
title: "oab(4gx)"
description: "oab — Handler for the Offline Address Book"
sidebar:
  order: 50
---

## Name

oab — Handler for the Offline Address Book

## Description

oab is a component for [http(8gx)](/man/http-8gx/) which handles URIs with the /OAB/ prefix.

## Configuration directives (exchange_nsp.cfg)

If it exists, /etc/gromox/exchange_nsp.cfg will be read.

<dfn class="gx-param">cache_interval</dfn>  
Address book cache invalidation time.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">5 minutes</span>
