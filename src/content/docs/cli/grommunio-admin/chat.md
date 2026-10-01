---
title: "grommunio-admin chat"
description: "grommunio-admin chat — Chat management"
sidebar:
  label: "chat"
  order: 10
---

### Name

grommunio-admin chat — Chat management

### Synopsis

<strong>grommunio-admin chat</strong> <strong>remove-all</strong>\
<strong>grommunio-admin chat</strong> <strong>sso</strong> (<em>enable</em> \| <em>disable</em>) \[<em>-d DOMAIN</em>\] …

### Description

Commands for the grommunio-chat integration.

### Commands

`remove-all`  
Set the chat IDs of all domains and users to NULL.

`sso`  
Move the chat accounts of grommunio users to single sign-on through the grommunio Keycloak realm (<em>enable</em>) or back to the local login (<em>disable</em>), and set the defaults for new accounts accordingly. Which OAuth service is used depends on what the chat server offers. grommunio-auth runs this when it configures grommunio-chat.

### Options

`-d DOMAIN`, `--domain DOMAIN`  
Only affect users of DOMAIN and set its domain defaults. Can be given multiple times. Without this option the system defaults are set and per-domain overrides are removed.

### See Also

<strong>grommunio-admin</strong>(1), <strong>grommunio-admin-user</strong>(1)
