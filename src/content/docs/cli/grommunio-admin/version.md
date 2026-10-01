---
title: "grommunio-admin version"
description: "grommunio-admin version — Show backend and/or API version"
sidebar:
  label: "version"
  order: 10
---

### Name

grommunio-admin version — Show backend and/or API version

### Synopsis

<strong>grommunio-admin version</strong> \[<em>-a</em>\] \[<em>-b</em>\] \[<em>-c</em>\]

### Description

Show the current version of the API (specification) or the backend (code).\
The combined mode (default) appends the difference between between backend and API version at the end of the API version.

If multiple options are given, each requested version is printed on a separate line. The order is always API – backend – combined.

### Options

`-a`, `--api`  
Print API version

`-b`, `--backend`  
Print backend version

`-c`, `--combined`  
Print combined version

### See Also

<strong>grommunio-admin</strong>(1)
