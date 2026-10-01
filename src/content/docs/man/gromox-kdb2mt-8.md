---
title: "gromox-kdb2mt(8)"
description: "<strong>gromox-kdb2mt</strong> — Utility for analysis/importing of Zarafa/Kopano SQL-stored mailboxes"
sidebar:
  order: 50
---

## Name

<strong>gromox-kdb2mt</strong> — Utility for analysis/importing of Zarafa/Kopano SQL-stored mailboxes

## Synopsis

<strong>gromox-kdb2mt</strong> \[<strong>-pstv</strong>\] \[<strong>--sql-host</strong> <em>hostname</em>\] \[<strong>--sql-user</strong> <em>identity</em>\] \[<strong>--sql-port</strong> <em>number</em>\] \[<strong>--sql-db</strong> <em>name</em>\] <strong>--src-attach</strong> <em>dir</em> {<strong>--mbox-guid</strong> <em>mboxguid</em>\|<strong>--mbox-name</strong> <em>username</em>\|<strong>--mbox-mro</strong> <em>username</em>} \[...\]

## Description

gromox-kdb2mt reads one store from a Zarafa/Kopano SQL database and, for attachments, the associated filesystem. The data is then re-exported in a Gromox-specific mailbox transfer format to stdout, intended for consumption by pipe by the [gromox-import(8)](/man/gromox-import-8/) program. Optionally, kdb2mt can print a summary of the hierarchy during extraction.

The SQL server that carries the Zarafa/Kopano database for the home server of the user must be active. Databases with a schema version <strong>n61</strong> or newer (ZCP versions 7.0.3 and onwards, and all KC versions) are supported. The kopano-server(8) process need not be running. Its LDAP need not be available either.

ACLs can be extracted, but, owing to the independence of the Kopano LDAP data model, require pre- or post-processing (see below).

The directory of Kopano attachments of the home server should be made available in the mount namespace wherever gromox-kdb2mt runs.

Properties of the <em>store object itself</em> are only shown (if and when -p is used), but never dumped to the MT data stream. Properties of the store <em>root</em> folder object are(!) transferred.

## Options

<dfn class="gx-param">-p</dfn>  
Show properties in detail (enhances <strong>-t</strong>).

<dfn class="gx-param">-s</dfn>  
Map the source mailbox folder hierarchy (and its subobjects) to the target mailbox's hierarchy and splice objects accordingly. Only use -s when both the source side and the target side are private stores. See the section "Splice mode" below for more information. When --with-hidden is not selected, -s will imply --without-hidden by default to avoid polluting e.g. "QuickStep settings" (which may already have settings).

<dfn class="gx-param">-t</dfn>  
Show a diagnostic tree view of the source data as it is being read.

<dfn class="gx-param">-v</dfn>  
Print message count progress while processing larger folders. This option has no effect if (the even more verbose) <strong>-t</strong> option was used.

<dfn class="gx-param">--loglevel</dfn> <em>n</em> Maximum verbosity of general logging (not connected  
to <strong>-p</strong>, <strong>-t</strong> or <strong>-v</strong>). 1=crit, 2=error, 3=warn, 4=notice, 5=info, 6=debug.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>4</em> (notice)</span>

<dfn class="gx-param">--user-map</dfn> <em>file</em>  
Use the given file to perform ACL mapping and ZARAFA Address Type rewriting. See sections "ACL Extraction" and "ZARAFA Address Type" below for details. The file format is described in [kdb-uidextract(8)](/man/kdb-uidextract-8/).

<dfn class="gx-param">--sql-host</dfn> <em>hostname</em>  
Hostname for the source SQL connection.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(MySQL default; <em>localhost</em>)</span>

<dfn class="gx-param">--sql-port</dfn> <em>number</em>  
Port for the source SQL connection.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(MySQL default; automatic)</span>

<dfn class="gx-param">--sql-user</dfn> <em>identity</em>  
Username for the source SQL connection.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">root</span>

<dfn class="gx-param">--sql-db</dfn> <em>dbname</em>  
Database name.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">kopano</span>

<dfn class="gx-param">--src-attach</dfn> <em>directory</em>  
Required specification to the /var/lib/kopano/attachments directory mounted somewhere locally. (To skip over file-based attachments, use the empty value, i.e. <strong>--src-attach ""</strong>.)

<dfn class="gx-param">--mbox-guid</dfn> <em>guid</em>  
Selects the mailbox with the particular GUID for extraction. (This may be used to read orphaned stores.)

<dfn class="gx-param">--mbox-user</dfn> <em>username</em>  
Scan the user map (cf. --user-map) for a mailbox which was used by the given username, and use it for extraction. (To get a listing of all stores, use <strong>--mbox-user ""</strong>.)

<dfn class="gx-param">--mbox-mro</dfn> <em>username</em>  
Scan the source database for a mailbox which appears to have last been used by <em>username</em>, and use it for extraction. There are a number of <strong>caveats</strong> related to this lookup; see the section "Store lookup by name" further below. (To get a listing of all stores, use <strong>--mbox-mro ""</strong>.)

<dfn class="gx-param">--l1</dfn> <em>x</em>, <strong>--l2</strong> <em>y</em>  
If you are using "attachment_storage=files_v1-<em>x</em>-<em>y</em>" in /etc/kopano/server.cfg, call kdb2mt with the L1 and L2 options.

<dfn class="gx-param">--only-obj</dfn> <em>hid</em>  
Extract just the folder/message object with the given hierarchy id. This option may be specified multiple times to selectively extract more objects. In the output stream, objects so extracted will be declared as unanchored so they can be imported to a folder of choice later (cf. gromox-import's -B option).

<dfn class="gx-param">--acl</dfn>={<em>auto</em>\|<em>no</em>\|<em>noextract</em>\|<em>extract</em>\|<em>convert</em>}  
Handling for ACLs on MAPI objects: ignore, extract to synthetic address, or convert to an e-mail address. <em>auto</em> plus the presence of --user-map leads to <em>convert</em>. <em>auto</em> plus the absence of --user-map leads to <em>noextract</em>. See the section "ACL Extraction" below for some more details.

<dfn class="gx-param">--with-hidden</dfn>, <strong>--without-hidden</strong>  
This option controls the import of folders that have PR_ATTR_HIDDEN=1.

## Splice mode

By default, kdb2mt transfers the mail hierarchy and contents such that the Kopano mailbox root folder is mapped to a new unanchored folder "Import of \<GUID\> @\<date\>". Refer to [gromox-import(8)](/man/gromox-import-8/) for details on how/where unanchored objects are ultimately placed with the target mailbox.

When the -s option is used, this behavior changes. The default mapping is replaced by one that will intermix imported folders with an existing hierarchy. Specifically, special folders such as the root folder item, Top of Information Store (a.k.a. TOIS or IPM_SUBTREE), Inbox, etc. are mapped. This only works when both the source and target are private stores!

Special folders are identified by metadata, not by name. This way, kdb2mt can support localized folder names and correctly map, for example, a German "Gesendete Elemente" to a French "Éléments envoyés" (Sent Items). Regular folders will be processed normally (by name), e.g. "(Source root)\Top of Information Store\Invoices" will be imported at "(Target root)\Top of Information Store\Invoices".

The -s option is most useful when importing one's own store from one system to another that's new and blank. If importing someone <em>else's</em> store into yours, leaving out -s is normally the desired behavior, since you may not want want to mix your (existing) with their mails.

## Environment variables

<dfn class="gx-param">SQLPASS</dfn>  
Password for the source SQL connection.

## Examples

### Common scenario (Separate hosts)

When Gromox and Kopano run on different hosts, and you wish to have the Gromox host to initiate all necessary connections.

Step 1. Establish an sshfs mount. This is used to get at the attachments directory of Kopano Core. Command:

> sshfs root@kp:/var/lib/kopano/attachments /mnt

For this to work, root logins need to be possible in some form (password or pubkey-based authentication).

Step 2. Establish an SSH tunnel. This is used to get at the MariaDB/MySQL database, assuming that this database is not already accepting connections on port 3306. Command:

> ssh -L 12345:localhost:3306 root@kp

This way, the database can be accessed as 127.0.0.1:12345 later.

Step 3. Locate the MariaDB connection parameters that you want to use. You can use the MariaDB "root" user (if available), or reuse the credentials from /etc/kopano/server.cfg (often a "kopano" user).

Step 4. Run the conversion. The use of "127.0.0.1" is necessary to bypass the special meaning of "localhost" (which implies the use of an AF_LOCAL socket, e.g. /run/mysql/mysql.sock). Command:

> SQLPASS=kopanosqlpass gromox-kdb2mt --sql-host 127.0.0.1 --sql-port 12345 --sql-user kopano --src-attach /mnt --mbox-mro jdoe \| gromox-import -u user@domain.example

Done! The speed of the operation depends on the capabilities of the network and the source database (latency more so than throughput).

### Other options

If the Gromox host is not allowed to connect to the Kopano host for reasons of networking and/or firewall setups, there are plenty of other ways to carry over the data. Administrators are asked to use their experience to mix and match the plethora of utilities available at their disposal. Possible operations include mysqldump(1), sftp(1), rsync(1), tar(1) and curl(1).

## Store lookup using Kopano tools

If kdb2mt's built-in heuristic --mbox-mro resolution mechanism is not adequate enough, you can use utilities from the Kopano installation, provided that is still active.

- `kopano-storeadm -M` is the gold standard. This dumps the entire store list, in JSON representation. The GUIDs can then be used together with --mbox-guid.

- The global "SYSTEM" user object in Kopano also happens to have a private store, titled "Inbox - SYSTEM". This store however is practically empty and it is unlikely it will ever need extraction. Alternatively, its GUID can also be shown with `kopano-admin --details SYSTEM`.

- The global public store in Kopano, if it exists, is owned by the "Everyone" <em>group object</em>. In kopano-storeadm output, it can be found by looking for the display name "Public Folders". There is no way to see the GUID via kopano-admin.

- Just for completeness: There is no per-company SYSTEM user (and hence no store). If anything, companies re-use the global SYSTEM user as a member.

- The per-company public folder, if it exists, is owned by the respective <em>company object</em>. In kopano-storeadm output, it can be found by looking for the display name "Public Folders - MyCompany". Alternatively, the GUID can also be shown with `kopano-admin --type company --details MyCompany`.

## Store lookup by name

Generally, Kopano SQL databases do not store usernames. Store ownership is recorded with a Kopano-level numeric ID, which itself is mapped to a site-specific attribute of an authentication service, e.g. the uidNumber field of an LDAP. Only the authentication service would know the username, and kdb2mt does not rely on the existence of such authentication provider.

Every store has a metadata field for the <strong>most recent owner</strong> (MRO). This field was intended for orphaned stores and has informational value only. The MRO field is not always updated by Kopano services, which can lead to --mbox-mro not necessarily finding an expected match. In particular, kopano-server misses doing the MRO update on store detach, and on changes to the username in LDAP.

Furthermore, because it is possible to detach/orphan and create a new store for a user (and repeatedly so), the MRO field value is <strong>not unique</strong> across the set of all stores.

Furthermore, the MRO field is missing the domain/company part of the username. Company public stores (in hosted setups) use the company name as MRO. This all contributes to --mbox-mro possibly matching multiple stores.

When more than one store matches in any way, kdb2mt will print the result set with GUIDs and exit, at which point you need to use --mbox-guid instead.

## ACL Extraction

Because kdb2mt works completely LDAP-less, it knows nothing about users except for their numeric user object ID on the homeserver and a reference to an LDAP object (the so-called "Extern id", e.g. objectUUID/uidNumber). The user object ID is local to a kopano-server instance. The composition of the object ID and server instance GUID forms a unique token. ACEs are carried over such that that permissions for user with a given <em>objid</em> are transformed to the synthetic identity <em>objid</em>@<em>serverguid</em>.kopano.invalid.

>     sqlite3 /var/lib/gromox/user/abc@example.com/exmdb/exchange.sqlite3
>     sqlite> select <em> from permissions;</em>
>     member_id  folder_id  username                                             permission
>     ---------  ---------  ---------------------------------------------------  ----------
>     1          15         default                                              2048
>     2          24         default                                              2048
>     3          2090545    256@aa8e2b20b2054ca98987ea1053c3bb16.kopano.invalid  1177

kdb2mt can be instructed to map these to a new email address using the --user-map command-line option. That file can be generated by executing [kdb-uidextract(8)](/man/kdb-uidextract-8/) or the [kdb-uidextract-limited(8)](/man/kdb-uidextract-limited-8/) helper programs on the original, live Kopano system. (With some effort, the file can also be manually constructed. See that manpage for format details.)

## ZARAFA Address Type

MAPI as a system supports referencing message participants with arbitrary address types, including, but not limited to, SMTP, EX (Exchange 4.0 Directory Service identifier), FAX numbers, etc.

Zarafa/Kopano systems define a "ZARAFA" address type, and the identifiers contain the username. How exactly it is formatted is system-dependent, cf. /etc/kopano/server.cfg:loginname_format.

## See also

<strong>gromox</strong>(7), <strong>gromox-import</strong>(8)
