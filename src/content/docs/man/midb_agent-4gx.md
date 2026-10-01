---
title: "midb_agent(4gx)"
description: "midb_agent — Client for [midb(8gx)](/man/midb-8gx/)"
sidebar:
  order: 50
---

## Name

midb_agent — Client for [midb(8gx)](/man/midb-8gx/)

## Configuration directives

The usual config file location is /etc/gromox/midb_agent.cfg.

<dfn class="gx-param">connection_num</dfn>  
The number of connections to keep open towards every midb target.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">5</span>

<dfn class="gx-param">context_average_mem</dfn>  
Enables and sets the size of a memory pool (in object count; the actual size is 256 bytes \* context_num \* context_average_mem). [imap(8gx)](/man/imap-8gx/) and [pop3(8gx)](/man/pop3-8gx/) require this to be non-zero for full functionality.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">1024</span>

<dfn class="gx-param">midb_agent_command_buffer_size</dfn>  
Certain midb commands can produce large results (such as P-SRHU with "ALL"). To avoid unbounded memory allocation, the result set is limited in size. If midb responds with a larger result, the midb connection is terminated and midb_agent returns an error to e.g. IMAP/POP. The default of 256K is good for a result set of around 24000 to 32000 messages.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">256K</span>

## Multiserver map

The SQL column <strong>users.homedir</strong> specifies a home directory location in an abstract namespace. This abstract namespace is shared between all Gromox programs, and can be used to divide users into custom subsets and steer connections to different servers.

midb_list.txt specifies how to map from this namespace to midb servers. Each line in this file consists of 3 columns separated by whitespace:

- Initial prefix to match a user's exmdb home directory on. The pattern should almost always end in a '/' character, otherwise a prefix of "/home" is able to match a userdir of "/home2/username" as well, which may be undesired.

- The IPv6 address of the midb server to connect to for all requests involving this prefix. The address must conform to [gromox(7)](/man/gromox-7/) § "Host addresses".

- The port number.

In the absence of midb_list.txt, an implicit default entry is used:

>     / ::1 5555

## Files

- <em>config_file_path</em>/<em>instance</em>.cfg: configuration file for the instance of midb_agent. (Instance is usually <strong>midb_agent</strong>, as there is not much point in loading midb_agent twice.)

- <em>config_file_path</em>/midb_list.txt: midb multiserver map

<em>config_file_path</em> is determined by the configuration of the program that loaded the midb_agent component.

## Signals

Upon receipt of SIGHUP, configuration files are re-read, but only a few select directives can be changed this way, as many parts do not implement reload.

## See also

<strong>gromox</strong>(7)
