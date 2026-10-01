---
title: "authmgr(4gx)"
description: "authmgr — Demultiplexer for authentication requests"
sidebar:
  order: 50
---

## Name

authmgr — Demultiplexer for authentication requests

## Description

authmgr is a component that, for mail account authentication, dynamically selects the authentication backend per user account.

## Configuration directives

The following directives are recognized when they are in /etc/gromox/gromox.cfg:

<dfn class="gx-param">auth_fail_delay</dfn>  
The amount of time to wait after a failed authentication attempt (unknown user or rejected password). When the MySQL database itself is unavailable, the delay is also added, which mitigates a little what could otherwise be an authentication storm. Users which are externally managed (e.g. in LDAP) are exempt from auth_fail_delay in Gromox, since the expectation is that the LDAP Bind operation already inserts a delay of its own. Setting the value to 0 disables the delay. Per-username banning by <strong>user_filter</strong>(4gx) applies regardless of this setting. Subsecond resolution is available.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">1s</span>

<dfn class="gx-param">auth_backend_selection</dfn>  
This controls how authmgr will verify passwords supplied with login operations. See the "Authentication modes" section below for details.\
Available: <em>deny_all</em>, <em>allow_all</em>, <em>ldap</em>, <em>pam</em>\
<span class="gx-deflabel">Default:</span> <span class="gx-default">ldap</span>

## Authentication modes

- <em>deny_all</em>: every attempt at authentication is rejected. This is at best useful for testing. This also implies auth_fail_delay=0.

- <em>allow_all</em>: every attempt at authentication (provided the user exists) is permitted. This may be handy when doing the initial mass-import of mailboxes via external IMAP-to-IMAP synchronization utilities such as imapsync without needing to know user passwords.

- <em>ldap</em> (old name: <strong>externid</strong>): authmgr will selectively pick LDAP/MySQL, depending on whether the externid column in the user database has a value or contains just the empty string. The particular value is ignored and only meaningful to the importer.

- <em>pam</em>: authmgr will selectively pick PAM/MySQL. The PAM service name will be "gromox". Be sure that pam_gromox.so is <strong>not</strong> invoked as part of that PAM service stack, or it will lead to infinite recursion.

## Signals

Upon receipt of SIGHUP, configuration files are re-read, but only a few select directives can be changed this way, as many parts do not implement reload.

## See also

<strong>gromox</strong>(7), <strong>ldap_adaptor</strong>(4gx), <strong>mysql_adaptor</strong>(4gx)
