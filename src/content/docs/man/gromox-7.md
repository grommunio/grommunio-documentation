---
title: "gromox(7)"
description: "gromox — Overview of the Gromox groupware server"
sidebar:
  order: 1
---

## Name

gromox — Overview of the Gromox groupware server

## Description

Gromox is a groupware server capable of serving as a replacement for Microsoft Exchange. Connectivity options include RPC/HTTP (Outlook Anywhere), IMAP, POP3, an SMTP-speaking LDA, and a PHP module with a Z-MAPI function subset.

Gromox relies on other components to provide a sensibly complete mail system, such as Postfix as a mail transfer agent, and grommunio-admin for user management. A web interface is available with grommunio-web. The grommunio distribution ships these essentials and has a ready-to-run installation of Gromox. system.

## Manual page listing

Gromox documentation consists of at least a dozen manual pages ("manpages") on its individual components. We have grouped these according to their principal function.

### Overview and definitions

- gromox(7) — This page, an overview of the Gromox groupware server.

- [mapi(7gx)](/man/mapi-7gx/) — Definition for "Messaging Application Programming Interface"

- [gromox-selinux(5)](/man/gromox-selinux-5/) — SELinux policy for Gromox

### Information Store subsystem

- [autoconfig(7)](/man/autoconfig-7/) — AutoConfig protocols

- [autodiscover(4gx)](/man/autodiscover-4gx/) — AutoDiscover HTTP Service Protocol handler (responder).

- [autodiscover(7)](/man/autodiscover-7/) — AutoDiscover protocols

- [exmdb_provider(4gx)](/man/exmdb_provider-4gx/) — Gromox Information Store

- [http(8gx)](/man/http-8gx/) — Protocol handler for HTTP and RPCH

- [istore(8gx)](/man/istore-8gx/) — Information Store launcher

- [mod_cache(4gx)](/man/mod_cache-4gx/) — Handler for serving objects from a local filesystem

- [mod_fastcgi(4gx)](/man/mod_fastcgi-4gx/) — Handler for proxying requests to FastCGI servers

- [mod_rewrite(4gx)](/man/mod_rewrite-4gx/) — Handler for altering HTTP request URIs before processing

- [timer(8gx)](/man/timer-8gx/) — deferred command executor

### Exchange subsystem and its components

- [exchange_emsmdb(4gx)](/man/exchange_emsmdb-4gx/) — Handler for the Wire Format Protocol (Outlook/Exchange RPCs) and Remote Operations Protocol

- [exchange_nsp(4gx)](/man/exchange_nsp-4gx/) — Handler for the Name Service Provider Interface Protocol

- [exchange_rfr(4gx)](/man/exchange_rfr-4gx/) — Handler for the Address Book Name Service Provider Interface Referral Protocol

- [ews(4gx)](/man/ews-4gx/) — Handler for Exchange Web Services requests

- [mh_emsmdb(4gx)](/man/mh_emsmdb-4gx/) — Handler for MAPIHTTP-wrapped EMSMDB requests

- [mh_nsp(4gx)](/man/mh_nsp-4gx/) — Handler for MAPIHTTP-wrapped NSPI requests

### PHP-MAPI subsystem

- [zcore(8gx)](/man/zcore-8gx/) — Bridge for PHP-MAPI requests

### Mail retrieval agent subsystem (MRA)

- [imap(8gx)](/man/imap-8gx/) — IMAP server

- [event_proxy(4gx)](/man/event_proxy-4gx/) — Event sender

- [event_stub(4gx)](/man/event_stub-4gx/) — Event receiver

- [midb_agent(4gx)](/man/midb_agent-4gx/) — Client for [midb(8gx)](/man/midb-8gx/)

- [pop3(8gx)](/man/pop3-8gx/) — POP3 server

### Local delivery agent (LDA)

- [alias_resolve(4gx)](/man/alias_resolve-4gx/) — Alias resolution for [delivery(8gx)](/man/delivery-8gx/) using MySQL

- [delivery(8gx)](/man/delivery-8gx/) — Backend for local delivery

- [delivery-queue(8gx)](/man/delivery-queue-8gx/) — LMTP/SMTP frontend for local delivery

- [user_filter(4gx)](/man/user_filter-4gx/) — User logon limiter

### Auxiliary services

- [gromox-cleaner.service(8)](/man/gromox-cleaner-service-8/) — Soft-deleted message/attachment removal

- [pam_gromox(4gx)](/man/pam_gromox-4gx/) — a PAM plugin to authenticate with Gromox

- [event(8gx)](/man/event-8gx/) — Folder change notification daemon

- [midb(8gx)](/man/midb-8gx/) — Message Index database daemon

### System administration

- [gromox-abktconv(8)](/man/gromox-abktconv-8/) — Utility for converting between ABKT and JSON

- [gromox-abktpull(8)](/man/gromox-abktpull-8/) — Utility to extract ABKT templates from LDIF

- [gromox-compress(8)](/man/gromox-compress-8/) — Utility to recompress Gromox content files

- [gromox-dbop(8)](/man/gromox-dbop-8/) — User database maintenance utility

- [gromox-dscli(8)](/man/gromox-dscli-8/) — Autodiscover command line utility

- [gromox-mailq(8)](/man/gromox-mailq-8/) — SMTP queue lister

- [gromox-mbck(8)](/man/gromox-mbck-8/) — Mailbox check and repair utility

- [gromox-mbop(8)](/man/gromox-mbop-8/) — Mailbox operations utility

- [gromox-mbsize(8)](/man/gromox-mbsize-8/) — Mailbox size analysis

- [gromox-mkmidb(8)](/man/gromox-mkmidb-8/) — Tool for creating a blank message index database

- [gromox-mkprivate(8)](/man/gromox-mkprivate-8/) — Tool for creating a blank private store

- [gromox-mkpublic(8)](/man/gromox-mkpublic-8/) — Tool for creating a blank public store

### Mail import, export and conversion

- [gromox-eml2mbox(8)](/man/gromox-eml2mbox-8/) — Utility for converting RFC5322 Internet Mail messages into a RFC4155 mbox-format mailbox

- [gromox-import(8)](/man/gromox-import-8/) — Utility for analysis of/importing messages from a Gromox Message Transfer datastream

- [gromox-export(8)](/man/gromox-export-8/) — Utility for exporting messages

- [gromox-exm2eml(8)](/man/gromox-exm2eml-8/) — Wrapper for gromox-export selecting RFC5322 Internet Mail output

- [gromox-exm2ical(8)](/man/gromox-exm2ical-8/) — Wrapper for gromox-export selecting RFC5545/5546 iCalendar output

- [gromox-exm2mt(8)](/man/gromox-exm2mt-8/) — Wrapper for gromox-export selecting Gromox Mailbox Transfer stream output

- [gromox-exm2tnef(8)](/man/gromox-exm2tnef-8/) — Wrapper for gromox-export selecting TNEF output

- [gromox-exm2vcf(8)](/man/gromox-exm2vcf-8/) — Wrapper for gromox-export selecting RFC6540 vCard output

- [gromox-ical2mt(8)](/man/gromox-ical2mt-8/) — Utility for analysis of/importing RFC5545/5546 iCalendar objects

- [gromox-kdb2mt(8)](/man/gromox-kdb2mt-8/) — Utility for analysis of/importing Zarafa/Kopano SQL-stored mailboxes

- [gromox-oxm2mt(8)](/man/gromox-oxm2mt-8/) — Utility for analysis and import of Outlook .msg files

- [gromox-pff2mt(8)](/man/gromox-pff2mt-8/) — Utility for analysis/import of PFF/PST/OST files

- [gromox-snapshot(8)](/man/gromox-snapshot-8/) — Helper to create btrfs snapshots of mailboxes

- [gromox-tnef2mt(8)](/man/gromox-tnef2mt-8/) — Utility for analysis/import of MS-OXTNEF objects

- [gromox-vcf2mt(8)](/man/gromox-vcf2mt-8/) — Utility for analysis/import of vCard objects

- [kdb-uidextract(8)](/man/kdb-uidextract-8/) — Helper for creating a gromox-kdb2mt ACL map

- [kdb-uidextract-limited(8)](/man/kdb-uidextract-limited-8/) — Helper for creating a gromox-kdb2mt ACL map

### Components

- [authmgr(4gx)](/man/authmgr-4gx/) — Demultiplexer for authentication requests

- [dnsbl_filter(4gx)](/man/dnsbl_filter-4gx/) — DNS Blacklist filtering

- [ldap_adaptor(4gx)](/man/ldap_adaptor-4gx/) — LDAP connector for authentication

- [mysql_adaptor(4gx)](/man/mysql_adaptor-4gx/) — MySQL/MariaDB connector for user metadata and authentication

- [timer_agent(4gx)](/man/timer_agent-4gx/) — Client for [timer(8gx)](/man/timer-8gx/)

### Historic commands that have been removed

The following is a list of programs that no longer exist. It is intended solely to capture keyword searches within the documentation for said obsolete/removed commands.

- gromox-mt2exm: renamed to gromox-import

### Language bindings

- [mapi(4gx)](/man/mapi-4gx/) — PHP module providing MAPI functions

## Configuration files

Program configuration files reside within /etc/gromox. The format for .cfg files is: one "key=value" pair per line. Empty lines are ignored, as are lines beginning with a '#' character. Lines can have a maximum length of 1024. Each key=value line is logically split at the equals sign, and whitespace is trimmed around key and value. Comments at the end of a value are not supported. Escape sequences are not supported. Each config key is one of four types of how the config file reader should apply an early generalized transform:

- A quantity, e.g. bytes for a buffer, a limit on the number of users, etc. With 1-unit granularity. See section "Quantity syntax" below.

- A time span, e.g. a duration or maximum lifetime for some object, with 1s or 1ns granularity (whatever the program code wants for any particular key). See section "Time span syntax" below.

- Boolean value. The empty string, the strings "no", "off", "false", and a string that completely parses as "0" via strtoul, is interpreted as false, with everything else considered true.

- Untransformed string.

The format for .ini files is: one "key=value" pair per line. Empty lines are ignored, as are lines beginning with a ';' character. Only used by some ailing PHP code. No generalized transforms.

Many programs have a <strong>config_file_path</strong> directive with which the search path for further config files can be specified. For example, [http(8gx)](/man/http-8gx/) defaults to config_file_path=/etc/gromox/http:/etc/gromox, so the [mysql_adaptor(4gx)](/man/mysql_adaptor-4gx/) component as loaded by http will first try /etc/gromox/http/mysql_adaptor.cfg, then /etc/gromox/mysql_adaptor.cfg. This allows having one file that is shared between multiple programs as well as being able to override on a per program-basis.

### Listing of config files per component

A list of components and the config files they potentially use.

- [alias_resolve(4gx)](/man/alias_resolve-4gx/) inside [delivery(8gx)](/man/delivery-8gx/): /etc/gromox/alias_resolve.cfg, /etc/gromox/mysql_adaptor.cfg

- [authmgr(4gx)](/man/authmgr-4gx/) inside [delivery(8gx)](/man/delivery-8gx/), [delivery-queue(8gx)](/man/delivery-queue-8gx/), [http(8gx)](/man/http-8gx/), [imap(8gx)](/man/imap-8gx/), [midb(8gx)](/man/midb-8gx/), [pam_gromox(4gx)](/man/pam_gromox-4gx/), [pop3(8gx)](/man/pop3-8gx/), [zcore(8gx)](/man/zcore-8gx/): /etc/gromox/gromox.cfg

- [autodiscover(4gx)](/man/autodiscover-4gx/) inside php-fpm(8): /etc/gromox/autodiscover.ini, /etc/gromox/mysql_adaptor.cfg

- [delivery(8gx)](/man/delivery-8gx/): /etc/gromox/alias_resolve.cfg, /etc/gromox/exmdb_local.cfg, /etc/gromox/ldap_adaptor.cfg, /etc/gromox/mlist_expand.cfg, /etc/gromox/mysql_adaptor.cfg

- [delivery-queue(8gx)](/man/delivery-queue-8gx/): /etc/gromox/gromox.cfg, /etc/gromox/midb_agent.cfg, /etc/gromox/ldap_adaptor.cfg, etc/gromox/mysql_adaptor.cfg

- [event(8gx)](/man/event-8gx/): /etc/gromox/event.cfg

- [exchange_emsmdb(4gx)](/man/exchange_emsmdb-4gx/) inside [http(8gx)](/man/http-8gx/): /etc/gromox/exchange_emsmdb.cfg

- [exchange_nsp(4gx)](/man/exchange_nsp-4gx/) inside [http(8gx)](/man/http-8gx/): /etc/gromox/exchange_nsp.cfg

- [exchange_rfr(4gx)](/man/exchange_rfr-4gx/) inside [http(8gx)](/man/http-8gx/): no config file

- [exmdb_provider(4gx)](/man/exmdb_provider-4gx/) inside [http(8gx)](/man/http-8gx/): /etc/gromox/exmdb_provider.cfg

- [http(8gx)](/man/http-8gx/): /etc/gromox/cache.txt, /etc/gromox/exchange_emsmdb.cfg, /etc/gromox/exchange_nsp.cfg, etc/gromox/exmdb_provider.cfg, /etc/gromox/fastcgi.txt, /etc/gromox/rewrite.txt

- [imap(8gx)](/man/imap-8gx/): /etc/gromox/event_proxy.cfg, etc/gromox/event_stub.cfg, /etc/gromox/gromox.cfg, /etc/gromox/imap.cfg, etc/gromox/ldap_adaptor.cfg, /etc/gromox/mysql_adaptor.cfg

- [midb_agent(4gx)](/man/midb_agent-4gx/) inside [delivery-queue(8gx)](/man/delivery-queue-8gx/), [imap(8gx)](/man/imap-8gx/), [pop3(8gx)](/man/pop3-8gx/): /etc/gromox/midb_agent.cfg

- mlist_expand(4gx) inside [delivery(8gx)](/man/delivery-8gx/): /etc/gromox/mlist_expand.cfg

- [mod_cache(4gx)](/man/mod_cache-4gx/) inside [http(8gx)](/man/http-8gx/): /etc/gromox/http.cfg, /etc/gromox/cache.txt

- [mod_fastcgi(4gx)](/man/mod_fastcgi-4gx/) inside [http(8gx)](/man/http-8gx/): /etc/gromox/http.cfg, /etc/gromox/fastcgi.txt

- [mod_rewrite(4gx)](/man/mod_rewrite-4gx/) inside [http(8gx)](/man/http-8gx/): /etc/gromox/http.cfg, /etc/gromox/rewrite.txt

- [mh_emsmdb(4gx)](/man/mh_emsmdb-4gx/) inside [http(8gx)](/man/http-8gx/): no config file

- [mh_nsp(4gx)](/man/mh_nsp-4gx/) inside [http(8gx)](/man/http-8gx/): no config file

- [pop3(8gx)](/man/pop3-8gx/): /etc/gromox/authmgr.cfg, /etc/gromox/event_proxy.cfg, /etc/gromox/imap.cfg, /etc/gromox/ldap_adaptor.cfg, /etc/gromox/mysql_adaptor.cfg

- [timer(8gx)](/man/timer-8gx/): /etc/gromox/timer.cfg

- [timer_agent(4gx)](/man/timer_agent-4gx/) inside [http(8gx)](/man/http-8gx/), [zcore(8gx)](/man/zcore-8gx/): /etc/gromox/timer_agent.cfg

- [user_filter(4gx)](/man/user_filter-4gx/) inside [http(8gx)](/man/http-8gx/), [imap(8gx)](/man/imap-8gx/), [pop3(8gx)](/man/pop3-8gx/): /etc/gromox/gromox.cfg

- [zcore(8gx)](/man/zcore-8gx/): /etc/gromox/authmgr.cfg, /etc/gromox/zcore.cfg, /etc/gromox/ldap_adaptor.cfg, /etc/gromox/mysql_adaptor.cfg, /etc/gromox/timer_agent.cfg

### Listing of components per config file

- /etc/gromox/alias_resolve.cfg: used by the [alias_resolve(4gx)](/man/alias_resolve-4gx/) component, accessed process-wise by the [delivery(8gx)](/man/delivery-8gx/) process.

- /etc/gromox/authmgr.cfg: used by the [authmgr(4gx)](/man/authmgr-4gx/) and [pam_gromox(4gx)](/man/pam_gromox-4gx/) components, accessed process-wise by [delivery(8gx)](/man/delivery-8gx/), [delivery-queue(8gx)](/man/delivery-queue-8gx/), [http(8gx)](/man/http-8gx/), [imap(8gx)](/man/imap-8gx/), [midb(8gx)](/man/midb-8gx/), [pop3(8gx)](/man/pop3-8gx/), [zcore(8gx)](/man/zcore-8gx/), and arbitrary PAM applications.

- /etc/gromox/autodiscover.ini: used by the [autodiscover(4gx)](/man/autodiscover-4gx/) component, accessed process-wise by php-fpm(8).

- /etc/gromox/event.cfg: used by the [event(8gx)](/man/event-8gx/) process.

- /etc/gromox/event_proxy.cfg: used by the [event_proxy(4gx)](/man/event_proxy-4gx/) component, accessed process-wise by [imap(8gx)](/man/imap-8gx/), [midb(8gx)](/man/midb-8gx/), [pop3(8gx)](/man/pop3-8gx/).

- /etc/gromox/event_stub.cfg: used by the [event_stub(4gx)](/man/event_stub-4gx/) component, accessed process-wise by [imap(8gx)](/man/imap-8gx/).

- /etc/gromox/exchange_emsmdb.cfg: used by the [exchange_emsmdb(4gx)](/man/exchange_emsmdb-4gx/) component, accessed process-wise by [http(8gx)](/man/http-8gx/).

- /etc/gromox/exchange_nsp.cfg: used by the [exchange_nsp(4gx)](/man/exchange_nsp-4gx/) component, accessed process-wise by [http(8gx)](/man/http-8gx/).

- /etc/gromox/exmdb_local.cfg: used by the [exmdb_local(4gx)](/man/exmdb_local-4gx/) component, accessed process-wise by [delivery(8gx)](/man/delivery-8gx/).

- /etc/gromox/exmdb_provider.cfg: used by the [exmdb_provider(4gx)](/man/exmdb_provider-4gx/) component, accessed process-wise by [http(8gx)](/man/http-8gx/).

- /etc/gromox/gromox.cfg: An effort to consolidate all the invididual .cfg files you see around here. This is a work-in-progress. See the [gromox.cfg(5)](/man/gromox-cfg-5/) manpage.

- /etc/gromox/http.cfg: used by the [mod_cache(4gx)](/man/mod_cache-4gx/), [mod_fastcgi(4gx)](/man/mod_fastcgi-4gx/), [mod_rewrite(4gx)](/man/mod_rewrite-4gx/) components, and the [http(8gx)](/man/http-8gx/) process.

- /etc/gromox/imap.cfg: used by the [imap(8gx)](/man/imap-8gx/) process.

- /etc/gromox/ldap_adaptor.cfg: used by the [ldap_adaptor(4gx)](/man/ldap_adaptor-4gx/) component, accessed process-wise by [delivery(8gx)](/man/delivery-8gx/), [delivery-queue(8gx)](/man/delivery-queue-8gx/), [http(8gx)](/man/http-8gx/), [imap(8gx)](/man/imap-8gx/), [midb(8gx)](/man/midb-8gx/), [pop3(8gx)](/man/pop3-8gx/), [zcore(8gx)](/man/zcore-8gx/), and arbitrary PAM applications.

- /etc/gromox/midb_agent.cfg: used by the [midb_agent(4gx)](/man/midb_agent-4gx/) component, accessed process-wise by [delivery-queue(8gx)](/man/delivery-queue-8gx/), [imap(8gx)](/man/imap-8gx/), [pop3(8gx)](/man/pop3-8gx/).

- /etc/gromox/mlist_expand.cfg: used by the mlist_expand(4gx) component, accessed process-wise by [delivery(8gx)](/man/delivery-8gx/).

- /etc/gromox/mysql_adaptor.cfg: used by the [alias_resolve(4gx)](/man/alias_resolve-4gx/), [mysql_adaptor(4gx)](/man/mysql_adaptor-4gx/) components, accessed process-wise by [delivery(8gx)](/man/delivery-8gx/), [delivery-queue(8gx)](/man/delivery-queue-8gx/), [http(8gx)](/man/http-8gx/), [imap(8gx)](/man/imap-8gx/), [midb(8gx)](/man/midb-8gx/), [pop3(8gx)](/man/pop3-8gx/), [zcore(8gx)](/man/zcore-8gx/), and arbitrary PAM applications.

- /etc/gromox/midb.cfg: used by the [midb(8gx)](/man/midb-8gx/) process.

- /etc/gromox/mod_cache.txt: used by the [mod_cache(4gx)](/man/mod_cache-4gx/) component, accessed process-wise by [http(8gx)](/man/http-8gx/).

- /etc/gromox/mod_fastcgi.txt: used by the [mod_fastcgi(4gx)](/man/mod_fastcgi-4gx/) component, accessed process-wise by [http(8gx)](/man/http-8gx/).

- /etc/gromox/mod_rewrite.txt: used by the [mod_rewrite(4gx)](/man/mod_rewrite-4gx/) component, accessed process-wise by [http(8gx)](/man/http-8gx/).

- /etc/gromox/mysql_adaptor.cfg: used by the [autodiscover(4gx)](/man/autodiscover-4gx/) component, [http(8gx)](/man/http-8gx/), [imap(8gx)](/man/imap-8gx/), [pop3(8gx)](/man/pop3-8gx/), [zcore(8gx)](/man/zcore-8gx/) processes.

- /etc/gromox/pam.cfg: used by the [pam_gromox(4gx)](/man/pam_gromox-4gx/) component, accessed process-wise by arbitrary PAM applications.

- /etc/gromox/pop3.cfg: used by the [pop3(8gx)](/man/pop3-8gx/) process.

- /etc/gromox/timer.cfg: used by the [timer(8gx)](/man/timer-8gx/) process.

- /etc/gromox/timer_agent.cfg: used by the [timer_agent(4gx)](/man/timer_agent-4gx/) component, accessed process-wise by [http(8gx)](/man/http-8gx/), [zcore(8gx)](/man/zcore-8gx/).

- /etc/gromox/zcore.cfg: used by the [zcore(8gx)](/man/zcore-8gx/) process.

## Databases

- User information is held in a MariaDB/MySQL database. This database can be accessed by multiple Gromox servers, and so enables distributed Gromox operation. The MariaDB system itself provides the necessary utilities for distributing or replicating this database.

- Per-user e-mail messages are stored in a SQLite database (e.g. /var/lib/gromox/user/abc@example.com/exmdb/exchange.sqlite3), as is a message index (e.g. /var/lib/gromox/user/abc@example.com/exmdb/midb.sqlite3). These are normally only used by one system, but can be shared through network filesystems provided that file locking is properly implemented in the filesystem driver. Normal file mechanisms can be used to backup or transfer the database to another Gromox host.

## Host addresses

Gromox exclusively uses the AF_INET6 socket family with the Berkeley/BSD/POSIX socket API. What this means is that, whenever an IP address is logged, it will have the form specified in RFC 4291 §2.2/§2.5.5. Furthermore, whenever some configuration file directive (field) requires an IP address (i.e. you cannot or do not want to use a hostname), the RFC 4291 form <strong>must</strong> be used for both IPv6 and IPv4.

## Listening sockets

Below is a general overview of sockets that would be commonly used for Mail User Agents to contact Gromox services, or for Gromox services to communicate among each other. This not a reflection of any particular config setting.

- \*:24 — [delivery-queue(8gx)](/man/delivery-queue-8gx/) LMTP/SMTP service (when Postfix is on 25)

- \*:25 — Normally, your own MTA (postfix(1), exim(8), whatever the case may be). [delivery-queue(8gx)](/man/delivery-queue-8gx/) will only be on 25 in developer setups that wish to cut and skip Postfix/etc. to get a simpler test setup.

- \*:80 — [http(8gx)](/man/http-8gx/) HTTP service

- \*:110 — [pop3(8gx)](/man/pop3-8gx/) POP3 service

- \*:143 — [imap(8gx)](/man/imap-8gx/) IMAP service

- \*:443 — [http(8gx)](/man/http-8gx/) HTTP over implicit TLS

- \*:993 — [imap(8gx)](/man/imap-8gx/) IMAP over implicit TLS

- \*:995 — [pop3(8gx)](/man/pop3-8gx/) POP3 over implicit TLS

- \[::1\]:5000 — [exmdb_provider(4gx)](/man/exmdb_provider-4gx/) component inside [http(8gx)](/man/http-8gx/) or [istore(8gx)](/man/istore-8gx/).

- \[::1\]:5555 — [midb(8gx)](/man/midb-8gx/) service

- \[::1\]:6666 — [timer(8gx)](/man/timer-8gx/) service

- \[::1\]:33333 — [event(8gx)](/man/event-8gx/) service

- /run/gromox/zcore.sock — [zcore(8gx)](/man/zcore-8gx/)

## Files

- /usr/share/gromox/cpid.txt: mapping between character set IDs and names

- /usr/share/gromox/folder_names.txt: Translations for essential folders in a message store.

- /usr/share/gromox/lang_charset.txt: mapping from language code to character set

- /usr/share/gromox/lcid.txt: mapping between locale IDs and names

- /usr/share/gromox/mime_extension.txt: mapping between file extensions and MIME types (if you also have /etc/mime.types, it will be used too, but it is optional)

- /var/lib/gromox: basic root directory of all variadic data for Gromox

- /var/lib/gromox/queue: directory for delivery-queue(8) temporary files

- /var/lib/gromox/user, /var/lib/gromox/domain: standard subtree for mailbox containers\
  The users.homeserver and users.maildir columns in the gromox MariaDB/MySQL database specifies the actual location of the mailbox. The directory name/path has no requirements (it must be absolute). The administrator can set an arbitrary path and it need not be located in /var/lib/gromox. Documentation uses various placeholders like /var/lib/gromox/user/abc@example.com.

- <em>maildir</em>/exmdb/exchange.sqlite3: mail store with almost everything (no mail bodies)

- <em>maildir</em>/cid/: attachments and message bodies (PR_BODY, PR_HTML, PR_RTF_COMPRESSED).

- <em>maildir</em>/eml/<em>mid_string</em>: RFC5322 representation for a message.\
  mid_string has no required form. Typically, there is <em>timestamp</em>.<em>seqid</em>.<em>hostname</em> which represents EMLs captured by [delivery(8gx)](/man/delivery-8gx/) on ingestion, and <em>timestamp</em>.<em>seqid</em>.midb for EMLs generated by [midb(8gx)](/man/midb-8gx/) out of MAPI messages.

- <em>maildir</em>/ext/<em>mid_string</em>: Digest for the RFC5322 file.\
  This JSON-encoded file contains e.g. indexing information for individual MIME parts of the RFC5322 representation. Generated by [midb(8gx)](/man/midb-8gx/).

## fail2ban integration

Daemons emit a mostly consistent log messages on authentication failures that can be matched with (PCRE):

/rhost=\\(\S+)?\\\S\* user=(\S+) .\*(auth\|login.\*\|logon) rejected:/

Operation texts can be "HTTP auth rejected" (http), "zs_logon rejected" (zcore), "zs_logon_token rejected" (zcore), "LOGIN phase0 rejected" (imap), "LOGIN phase1 rejected" (imap), "LOGIN phase2 rejected" (imap), "login rejected" (pop3).

## Quantity syntax

The syntax for strings that are parsed to obtain some kind of number may have one SI unit prefix letter affixed to the number to select a power-of-1024(!) multiplier. Formally,

quantum := number \[letter\]

\# "number" can be whatever strtol(3) accepts. If a period is detected, parsing switches to strtod(3).

letter := 'k' \| 'M' \| 'G' \| 'T' \| 'P' \| 'E' \| 'Z' \| 'Y' \| 'R' \| 'Q'

Examples: <em>4k</em> is 4\*1024^1 = <em>4096</em>, <em>1.5M</em> is 1.5\*1024^2 = 1572864.

Note: This syntax specifies no unit, nor unit symbols. Whether "4k" means 4096 bytes, 4096 nibbles or 4096 users depends on the enclosing context (e.g. configuration directive) that uses this syntax.

## Time span syntax

The syntax for strings that are to be interpreted as a duration, period/interval must be of the form:

duration := quantum \[ quantum \]\*

quantum := number unit

\# "number" can be whatever strtol(3) accepts. If a period is detected, parsing switches to strtod(3).

unit := "ns" \| "nsec" \| "µs" \| "µsec" \| "ms" \| "msec" \| "s" \| "sec" \| "second" \| "seconds" \| "min" \| "minute" \| "minutes" \| "h" \| "hour" \| "hours" \| "d" \| "day" \| "days" \| "week" \| "weeks" \| "month" \| "months" \| "y" \| "year" \| "years"

Whitespace is ignored whereever it appears (so use as much as you need). Quanta with the same unit may be used; they are simply added together. Per this syntax, numbers can be positive or negative, integral or fractional (be mindful of precision limits of computers' floating-point math). Unit names must be used as specified; any other names, especially non-English ones, are not accepted. In places where program code does not care about subsecond accuracy, time spans will have the subsecond parts truncated, i.e. "1.5s" becomes 1.0 seconds, and "1.5min" stays the 90 seconds that it is.

Examples: <em>1d1h1m1s</em>, <em>3.5 hours</em>, <em>1 hour 1 hour</em> (2 hours), <em>1 hour 60 minutes</em> (2 hours)

Note that Gromox may impose additional restrictions on specific configuration directives after the basic parse to enforce certain minimum and maximum values.
