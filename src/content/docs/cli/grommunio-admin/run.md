---
title: "grommunio-admin run"
description: "grommunio-admin run — Start a stand-alone HTTP server"
sidebar:
  label: "run"
  order: 10
---

### Name

grommunio-admin run — Start a stand-alone HTTP server

### Synopsis

<strong>grommunio-admin run</strong> \[<em>-d</em>\] \[<em>-i IP</em>\] \[<em>--no-config-check</em>\] \[<em>-p PORT</em>\]

### Description

Run REST API in a stand-alone HTTP server.

<strong>—–DO NOT USE IN PRODUCTION!—–</strong>\
This command is intended for development and testing. A production instance should use an external WSGI server like <em>uwsgi</em>.

### Options

`-d`, `--debug`  
Enable debug mode

`-i IP`, `--ip IP`  
Host address to bind to (default ::)

`--no-config-check`  
Skip configuration check

`-p PORT`, `--port PORT`  
Host port to bind to (default 5001)

### See Also

<strong>grommunio-admin</strong>(1), <strong>grommunio-admin-config</strong>(1)
