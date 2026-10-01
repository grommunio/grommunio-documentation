---
title: "mysql_adaptor(4gx)"
description: "mysql_adaptor — MySQL/MariaDB connector for user metadata and authentication"
sidebar:
  order: 50
---

## Name

mysql_adaptor — MySQL/MariaDB connector for user metadata and authentication

## Description

mysql_adaptor is a component for integrating user accounts from a MySQL/MariaDB database.

## Configuration directives (gromox.cfg)

The following directives are read from gromox.cfg:

<dfn class="gx-param">mysql_object_cache_lifetime</dfn>  
Object data stored in SQL may be cached locally in memory to avert repeat requests (that would all incur natural network and SQL execution latency). This cache affects, including but not limited to, group/list memberships and thus permission checks. The special value 0 disables the cache.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">1min</span>

## Configuration directives (mysql_adaptor.cfg)

The following directives are read from mysql_adaptor.cfg:

<dfn class="gx-param">connection_num</dfn>  
Number of SQL connections to keep active. Note that the SQL server may have limits in place, such as "max_connections" and "wait_timeout" (cf. `SHOW GLOBAL VARIABLES LIKE "wait_timeout"`). Automatic reconnection happens by Gromox when a query is about to be executed.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">8</span>

<dfn class="gx-param">enable_firsttimepw</dfn>  
This flag determines whether non-LDAP users with no recorded password (empty users.password SQL column) will have the account's password set to whatever credential was passed along in the first authentication request.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">no</span>

<dfn class="gx-param">mysql_dbname</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">email</span>

<dfn class="gx-param">mysql_host</dfn>  
The hostname/IP address for contacting the SQL server.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">localhost</span>

<dfn class="gx-param">mysql_password</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">(unset)</span>

<dfn class="gx-param">mysql_pool_idle_timeout</dfn>  
Pooled SQL connections that have not been used for this long are closed when convenient, the exact time of which is unspecified, and connections are re-established on-demand. This keeps long-lived but mostly-idle processes, e.g. per-store istore workers when istore_standalone is enabled, from each holding a connection indefinitely and collectively running the SQL server into its max_connections limit. A value of 0 disables the reaper.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">1min</span>

<dfn class="gx-param">mysql_port</dfn>  
The TCP port number for contacting the SQL server.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">3306</span>

<dfn class="gx-param">mysql_rdwr_timeout</dfn>  
This sets all three of MYSQL_OPT_READ_TIMEOUT, MYSQL_OPT_WRITE_TIMEOUT and MYSQL_OPT_CONNECT_TIMEOUT option values on the MySQL connection.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>0</em> (unlimited) for read/write, <em>20</em> for connect</span>

<dfn class="gx-param">mysql_tls_cert</dfn>  
The path name of an optional client public key certificate file for authentication.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(empty)</span>

<dfn class="gx-param">mysql_tls_key</dfn>  
The path name of an optional client private key file for authentication.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(empty)</span>

<dfn class="gx-param">mysql_username</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">root</span>

<dfn class="gx-param">scan_interval</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">1 minute</span>

<dfn class="gx-param">schema_upgrade</dfn>  
This controls what to do when a database schema update is available. Because the mysql_adaptor component is loaded by many programs across potentially multiple machines, the basic default is to do nothing.

<strong>host:</strong><em>xyz</em>  
Perform automatic schema upgrades if the program which has loaded mysql_adaptor is [http(8gx)](/man/http-8gx/) and only if http.cfg's <strong>host_id</strong> value matches <em>xyz</em>.

(any other value)  
No automatic schema upgrades are performed in the process which has loaded the component. The component may be unable to process or produce certain data, e.g. if it relies on a table that has not yet been created. Generally, no restart is needed when that upgrade is finally performed, because SQL queries just start working. However, there may be some caches, e.g. in the [zcore(8gx)](/man/zcore-8gx/) address book that could remain empty until the refresh timer expires or a manual reload is triggered.

<span class="gx-deflabel">Default:</span> <span class="gx-default">host:(system_hostname)</span>

## Signals

Upon receipt of SIGHUP, configuration files are re-read, but only a few select directives can be changed this way, as many parts do not implement reload.

## See also

<strong>gromox</strong>(7), <strong>authmgr</strong>(4gx)
