---
title: "alias_resolve(4gx)"
description: "alias_resolve — Alias resolution and expansion for [delivery(8gx)](/man/delivery-8gx/)"
sidebar:
  order: 50
---

## Name

alias_resolve — Alias resolution and expansion for [delivery(8gx)](/man/delivery-8gx/)

## Description

alias_resolve is a component of the delivery agent which rewrites the Envelope FROM and RCPT fields of incoming messages, trimming extensions, resolving aliases to the primary email address, resolving contact objects where they occur, and expanding mailing lists to their members.

## Configuration directives (gromox.cfg)

<dfn class="gx-param">lda_alias_cache_lifetime</dfn>  
Interval between refreshes of the alias and contact object cache.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">1h</span>

<dfn class="gx-param">lda_recipient_delimiter</dfn>  
The set of characters that separate an email address into localpart and extension. This mirrors the "recipient_delimiter" directive from postconf(5).\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(empty)</span>

## Signals

When the component is reloaded, i.e. by way of sending SIGHUP to [delivery(8gx)](/man/delivery-8gx/), the alias cache is refreshed as well, resetting the timer for the next refresh.

## Files

- <em>data_file_path</em>/mlist_bounce/: response templates for when a mailing list could not be expanded

## See also

<strong>gromox</strong>(7), <strong>delivery</strong>(8gx), <strong>mysql_adaptor</strong>(4gx)
