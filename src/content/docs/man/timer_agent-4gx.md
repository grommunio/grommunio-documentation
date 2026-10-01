---
title: "timer_agent(4gx)"
description: "timer_agent — Client for [timer(8gx)](/man/timer-8gx/)"
sidebar:
  order: 50
---

## Name

timer_agent — Client for [timer(8gx)](/man/timer-8gx/)

## Description

timer_agent connects to a remote [timer(8gx)](/man/timer-8gx/) daemon and locally installs two service functions, "add_timer" and "cancel_timer", which can be used to set up and rescind, respectively, jobs for later execution.

In practice, this is used by [exchange_emsmdb(4gx)](/man/exchange_emsmdb-4gx/) and [zcore(8gx)](/man/zcore-8gx/) to implement delayed sending of messages.

## Configuration directives

The usual config file location is /etc/gromox/timer_agent.cfg.

<dfn class="gx-param">connection_num</dfn>  
Number of connections to keep active.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">8</span>

<dfn class="gx-param">timer_host</dfn>  
The hostname/IP address for contacting the timer daemon.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">::1</span>

<dfn class="gx-param">timer_port</dfn>  
The TCP port number for contacting the timer daemon.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">6666</span>

## See also

<strong>gromox</strong>(7), <strong>timer</strong>(8gx)
