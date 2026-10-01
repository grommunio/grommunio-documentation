---
title: "kdb-uidextract(8)"
description: "<strong>kdb-uidextract</strong> — Helper for creating a gromox-kdb2mt ACL map"
sidebar:
  order: 50
---

## Name

<strong>kdb-uidextract</strong> — Helper for creating a gromox-kdb2mt ACL map

## Synopsis

<dfn class="gx-param">python /usr/libexec/gromox/kdb-uidextract</dfn>

## Description

kdb-uidextract is a Python script utilizing python-kopano bindings to read user object descriptions off a Kopano installation and produce a user listing suitable for consumption by the gromox-kdb2mt --user-map option.

This script is meant to be executed on a live Kopano system and does not rely on Gromox components at all.

kdb-uidextract first queries the server on the current machine for all participating Kopano servers in the cluster. This requires that all Kopano servers accept TLS connections (/etc/kopano/server.cfg:server_ssl_port, server_ssl_key_file, sslkeys_path) and have authentication keys set up for the SYSTEM account (in the directory specified by sslkeys_path).

The resulting map for kdb2mt is printed to stdout.

## Options

This program offers no command-line options.

## Files

By way of the <em>kopano</em> Python module, /etc/kopano/admin.cfg is sourced for TLS certificate parameters. Confer with the kopano-admin.cfg(5) manpage.

## User map format

The output of kdb-uidextract is a JSON file containing an array of user objects. If running uidextract is not possible, or not applicable (e.g. in case of Exchange user translation), the JSON file can also be constructed by other means, including manual input. Each user object is a dictionary with zero or more attributes; these can be:

- "na": original username associated with the Kopano account (this can have many forms, including, but not limited to, "user", "user@domain", "domain_user", "domain\user"; see "loginname_format" line of /etc/kopano/server.cfg)

- "dn": X.500 Legacy DN associated with an Exchange account

- "sv": server GUID, represented as 16 ASCII characters, case-insensitive

- "st": store GUID, represented as 16 ASCII characters, case-insensitive

- "id": per-database(!) numeric user ID

- "em": original e-mail address associated with the Kopano account

- "to": target e-mail address in the Gromox system

null values and empty strings are allowed. Take note that in multi-server Kopano installations, every LDAP user will appear in <strong>all</strong> the kopano-server databases, and with generally <strong>different</strong> user IDs.

For sender/recipient address substitution (done by kdb2mt, or mbop-zaddrxlat): The "to" attribute is needed. One (or both) of "na" and "em" is also needed.

For sender/recipient address substitution (done by mbop-exaddrxlat), the "to" and "dn" attributes are needed.

For ACL substitution (done by kdb2mt), the "id", "sv" and "to" attributes are needed.

For kdb2mt --mbox-user lookup, the "sv", "id" and "st" attributes are needed.

## Example Kopano user map

>     [
>
>      {"em": "boss@example.domain", "na": "boss", "sv":
>       "0123456789abcdef0123456789abcdef", "st": "0123456789abcdef0123456789abcdef",
>       "to": "boss@domain.example", "id": 3},
>
>      {"em": "boss@domain.example", "na": "boss", "sv":
>       "123456789abcdef0123456789abcdef0", "st": "0123456789abcdef0123456789abcdef",
>       "to": "boss@domain.example", "id": 91}
>
>     ]

## Example Exchange user map

>     [
>      {"dn": "/o=foobar/ou=Gobbledygook/cn=00000000-boss",
>       "to": "boss@domain.example"}
>     ]

## See also

<strong>gromox</strong>(7), <strong>gromox-kdb2mt</strong>(8), <strong>kdb-uidextract-limited</strong>(8)
