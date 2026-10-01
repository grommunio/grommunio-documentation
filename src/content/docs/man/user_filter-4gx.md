---
title: "user_filter(4gx)"
description: "user_filter — User logon limiter"
sidebar:
  order: 50
---

## Name

user_filter — User logon limiter

## Description

This component implements two concepts (each independently configurable):

- A mechanism for banning user identities for a set time window. When a user repeatedly fails to successfully authenticate, the [http(8gx)](/man/http-8gx/), [imap(8gx)](/man/imap-8gx/), [pop3(8gx)](/man/pop3-8gx/) daemons can add the user to this list and set a time during which all authentication requests for the user are rejected. This is a bit like fail2ban, but operates on usernames rather than hosts/IP addresses.

- A mechanism for rate-limiting authentication attempts. Whenever a user tries to authenticate, the daemons convey the occurrence to the user_filter component, and the component ensures that only a given amount of attempts can be made per time quantum, per user. This is a bit like iptables -m (hash)limit.

## Configuration directives (gromox.cfg)

<dfn class="gx-param">userfilter_icase</dfn>  
Treat usernames as case-insensitive within the user_filter component.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">true</span>

<dfn class="gx-param">userfilter_maxbans</dfn>  
Controls how much memory the banlist mechanism of user_filter is allowed to use at most, by limiting the number of unique usernames recorded. The list replacement policy is none (so, slightly different from MRU). The value 0 therefore deactivates user_filter's banlist mechanism.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">1000</span>

<dfn class="gx-param">userfilter_maxusers</dfn>  
Controls how much memory the rate-limiting mechanism of user_filter is allowed to use at most, by limiting the number of unique usernames. The list replacement policy is none. The value 0 therefore deactivates user_filter's rate-limiting mechanism.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<dfn class="gx-param">userfilter_rl_maxtries</dfn>  
Rate-limit all authentication calls to rl_maxtries per rl_window. Note that there can be <strong>a lot</strong> of requests, particularly over MAPI/HTTP since every single HTTP request counts as one attempt. (Opening a message with MFCMAPI already incurs 4 HTTP requests. The Windows EMSMDB connector is anything but efficient.)\
<span class="gx-deflabel">Default:</span> <span class="gx-default">10</span>

<dfn class="gx-param">userfilter_rl_window</dfn>  
Rate-limit all authentication attempts to rl_maxtries per rl_window.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">1minute</span>

## See also

<strong>gromox</strong>(7)
