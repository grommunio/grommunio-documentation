---
title: "autodiscover(4gx)"
description: "autodiscover — AutoDiscover HTTP Service Protocol handler (responder)"
sidebar:
  order: 50
---

## Name

autodiscover — AutoDiscover HTTP Service Protocol handler (responder)

## Description

A client would make a HTTP request to the /Autodiscover/Autodiscover.xml endpoint, which is handled by the Gromox oxdisco component.

The Autodiscover response contains the home server name and protocol options (MAPI-RPC-HTTP, MAPIHTTP, IMAP, etc.). A client uses this to set up the mailbox with MAPI services (like ``MSEMS`` or ``INTERSTOR`\`) within a MAPI profile.

## Configuration directives (gromox.cfg)

The following directives are recognized when they appear in /etc/gromox/gromox.cfg.

<dfn class="gx-param">oxdisco_advertise_mh</dfn>  
This setting controls whether the AutoDiscover response should include a EXHTTP Protocol section. Possible values: <em>yes</em>, <em>no</em>, <em>not_old_mso</em>, <em>only_new_mso</em>. The latter two values can be used to finely control emission in case of clients other than Outlook.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">yes</span>

<dfn class="gx-param">oxdisco_advertise_rpch</dfn>  
This setting controls whether the AutoDiscover response should include EXCH/EXPR Protocol sections. Possible values: <em>yes</em>, <em>no</em>, <em>only_old_mso</em>, <em>not_new_mso</em>. The latter two values can be used to finely control emission in case of clients other than Outlook.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">yes</span>

<dfn class="gx-param">oxdisco_exonym</dfn>  
Globally valid name pointing to a default mailbox server in the Gromox server forest. (Since AutoDiscover nodes are also mailbox nodes, the exonym should simply be: this server's hostname).\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(inherited from http.cfg:host_id, which defaults to the system FQDN)</span>

<dfn class="gx-param">oxdisco_pretty_response</dfn>  
A debugging knob to make the Autodiscovery handler emit indented XML responses.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">no</span>

<dfn class="gx-param">oxdisco_request_logging</dfn>  
Log AutoDiscover requests. This is independent of http.cfg:http_debug, and setting both would log requests twice.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">no</span>

<dfn class="gx-param">oxdisco_response_logging</dfn>  
Log AutoDiscover responses. This is independent of http.cfg:http_debug, and setting both would log responses twice.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">no</span>

<dfn class="gx-param">oxdisco_validate_scndrequest</dfn>  
When OL opens a non-default store (store of another user) or a public store, it may also make an AutoDiscover inquiry for the extra store. This setting controls whether the AutoDiscover handler should perform a permission check on non-default stores and possibly reject returning connection details. (Inquiry of public stores are always permitted.)\
<span class="gx-deflabel">Default:</span> <span class="gx-default">yes</span>

<dfn class="gx-param">x500_org_name</dfn>  
See [gromox.cfg(5)](/man/gromox-cfg-5/):x500_org_name.

## Configuration directives (autodiscover.cfg)

The following directives are recognized when they appear in /etc/gromox/autodiscover.cfg. autodiscover.cfg is obsolete in favor of gromox.cfg.

<dfn class="gx-param">x500_org_name</dfn>  
See [gromox.cfg(5)](/man/gromox-cfg-5/):x500_org_name.

## Configuration directives (autodiscover.ini)

The following directives are recognized when they appear in /etc/gromox/autodiscover.ini. autodiscover.ini is obsolete in favor of gromox.cfg.

<dfn class="gx-param">organization</dfn>  
Same as gromox.cfg:x500_org_name.

## Outlook notes

When Outlook is active, it is possible to Ctrl-MouseBtn3 (right click) on the status tray icon to call up a context menu, from which "Test Email Autoconfiguration..." can be selected to debug AutoDiscover requests and responses from the Windows side.

## Exchange notes

In EXC, MH can be toggled on/off via an EAC Shell command: `Set-OrganizationConfig -MapiHttpEnable \$false` (or \$true).

## Normative references

- MS-OXDISCO: Autodiscover HTTP Service Protocol

- MS-OXDSCLI: Autodiscover Publishing and Lookup Protocol

## See also

<strong>gromox</strong>(7), <strong>autodiscover</strong>(7)
