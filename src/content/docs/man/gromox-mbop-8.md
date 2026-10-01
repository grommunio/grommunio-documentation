---
title: "gromox-mbop(8)"
description: "gromox-mbop — Mailbox operations utility"
sidebar:
  order: 50
---

## Name

gromox-mbop — Mailbox operations utility

## Synopsis

<strong>gromox-mbop</strong> \[<strong>-d</strong> <em>mbox</em>\|<strong>-u</strong> \[<em>recipient</em>\]<strong>@domain.example</strong>\] <em>command</em> \[command-args...\]

## Summary

gromox-mbop can be used to perform various administrative tasks on mailboxes. Technically, mbop contacts the respective home server(s) and instructs the server to perform the requested action. Unlike tools such as mbck, mkprivate/mkpublic/mkmidb, mbop itself does not do any direct filesystem access on the mailbox.

## Global options

<dfn class="gx-param">-c</dfn>  
Continuous operation mode. If a command in a series (e.g. with foreach.\*) fails, do not stop.

<dfn class="gx-param">-d</dfn> <em>/var/lib/gromox/user/abc@example.com</em>  
Lookup the mailbox parameters from the associated filesystem location.

<dfn class="gx-param">-u</dfn> \[<em>user</em>\]<strong>@example.com</strong>  
Lookup the mailbox parameters by the associated username. (To access a public store of a domain, leave out the local part, i.e. use <strong>@</strong><em>example.com</em>.)

<dfn class="gx-param">-v</dfn>  
Verbose mode.

## Commands

- <strong>(</strong> command1 c1args <strong>) (</strong> command2 c2args <strong>)</strong>: command chaining

- cgkreset: reset synchronization state (PR_CHANGE_KEY, PR_PREDECESSOR_LIST)

- clear-photo: delete user picture

- clear-profile: delete user's PHP-MAPI profile

- clear-rwz: delete IPM.RuleOrganizer FAI messages from the inbox

- delmsg: issue "delete_message" RPCs for a mailbox

- echo-maildir: return maildir (for use with foreach.here.\*)

- echo-username: return username (for use with foreach.\*)

- emptyfld: remove objects from folders

- exaddrxlat: replace all "EX" type addresss in the mailbox's contents

- foreach.\*: iterate over security objects

- freeze: halt all operations on a mailbox

- get-freebusy: test FB schedule lookups

- clear-msgcopy: unset the sent-as/on-behalf copy settings

- get-msgcopy: show whether sent-as/on-behalf copies are retained

- get-photo: retrieve user image from store and print to stdout

- get-websettings, get-websettings-persistent, get-websettings-recipients: retrieve settings for grommunio-web

- movemsg: move or copy a message between folders

- ping: cause a mailbox's sqlite files to be opened

- purge-datafiles: remove orphaned attachments/content files from disk

- purge-softdelete: remove soft-deleted items from a folder

- recalc-sizes: recalculate store size

- set-locale: reset UI language and special folders' names

- set-msgcopy: control retention of sent-as/on-behalf copies

- set-photo: read user image from stdin and save to store

- set-websettings, set-websettings-persistent, set-websettings-recipients: read new grommunio-web settings from stdin and save to store

- sync-midb: trigger a midb synchronization run

- thaw: unfreeze a mailbox

- unload: issue the "unload_store" RPC for a mailbox

- vacuum: issue the "vacuum" RPC for a mailbox

- zaddrxlat: replace all "ZARAFA" type addresses in the mailbox's contents

## Further documentation

- SQLite recovery: https://docs.grommunio.com/kb/sqlite.html

## Command chaining

<strong>(</strong> <em>subcommand1 sub1args</em>... <strong>)</strong>...

It is possible to run multiple mbop commands in sequence for a user. For the option parser to recognize when a command ends and the next one starts, each subcommand invocation shall be wrapped in <strong>(</strong> and <strong>)</strong>. This becomes even more handy in conjunction with the foreach.\* pseudocommand.

Subcommands reading data from standard input (e.g. set-photo) cannot be realiably used with chaining, because stdin would be fully consumed the first time around and (...) does not cache the input for any subcommands.

### Examples

Run two commands for a user: gromox-mbop -u a@b.de ( purge-softdelete -r / ) ( purge-datafiles )

## cgkreset

cgkreset resets Change Numbers on all folder and message objects, PR_CHANGE_KEY and PR_PREDECESSOR_LIST values. The use cases for cgkreset are:

- when the mailbox has CN corruption and Incremental Change Synchronization (by e.g. Outlook or grommunio-sync) is hampered (e.g. message flags/color updates not transferred)

- when the mailbox has CN corruption and gromox-http/emsmdb has thrown the error "INSERT INTO messages ... UNIQUE constraint failed: messages.change_number"

After execution, .ost files referencing the reset mailbox should be deleted.

## clear-photo

The clear-photo command will delete the user picture. Note that, when there is no mailbox-level profile picture set, Gromox server processes may serve an image from another source, e.g. LDAP.

## clear-profile

Similar to MSMAPI, PHP-MAPI keeps a MAPI profile which contains a store list and also the settings for grommunio-web. The clear-profile command will delete the copy of this data stored in exmdb. Note that zcore(8) may still hold a copy of the MAPI profile in memory and could write that back to exmdb, nullifying the effect of the clear-profile command. Also, if the store list is absent, a new one will implicitly be created when PHP-MAPI/zcore is used.

## clear-rwz

Deletes IPM.RuleOrganizer FAI messages from the inbox.

## delmsg

### Synopsis

<strong>delmsg -f</strong> <em>folder_spec</em> <em>msgid</em>\[...\]

### Description

This command hard-deletes messages from a store, including issuing proper PR_CHANGE_KEY metadata updates for the sake of Cached Mode clients.

The message IDs taken as arguments on the command-line should be of the GC-value form, i.e. as they appear in the the SQLite database. (For details about GCV, see glossary.rst in the source distribution.)

### Subcommand options

<dfn class="gx-param">-f</dfn> <em>folder_spec</em>  
The folder from which to delete the messages. See section "Folder specification" below for syntax details of <em>folder_spec</em>. (If a msgid is specified which is not located in the particular folder, that message will not be deleted.)

<dfn class="gx-param">--soft</dfn>  
Perform a soft deletion.

## emptyfld

### Synopsis

<strong>emptyfld</strong> \[<strong>-MRa</strong>\] \[<strong>-t</strong> <em>age</em>\] \[<strong>--soft</strong>\] <em>folder_spec</em>...

### Description

This command deletes objects from one or more folders. emptyfld is normally a one-shot server-side operation. The use of -R,-t is not covered by the existing network protocols, which means that, if either of these options is used, the mbop client program performs the desired recursion and/or timestamp matching locally. This incurs multiple round trips to the server and so takes a bit more time than a "trivial" emptyfld call.

Just to spell it out again explicitly, emptyfld can be in one of three modes:

- server-assisted operations:

  - clear contents and/or FAI, no time conditions, no recursion

  - clear contents and/or FAI, no time conditions, nuke subfolders (recursion barred)

- client-side traversal:

  - clear contents and/or FAI, with or without evaluating timestamps, with or without recursion into subfolders, with or without subfolder deletion if empty

### Subcommand options

<dfn class="gx-param">-M</dfn>  
Exempt normal messages from deletion.

<dfn class="gx-param">-R</dfn>  
Recurse into subfolders.

<dfn class="gx-param">-a</dfn>  
Select associated messages (FAI) for deletion.

<dfn class="gx-param">-t</dfn> <em>relative-age</em>  
Limit deletion to messages which have a last modification timestamp older than <em>relative-age</em>. See [gromox(7)](/man/gromox-7/), section "Time span syntax" for details. There is currently no option for specifying absolute time.

<dfn class="gx-param">--delempty</dfn>  
If, after message deletion, any subfolder is empty, delete it.

<dfn class="gx-param">--nuke-folders</dfn>  
Unconditionally delete subfolders outright. For obvious reasons, deleting subfolders disables recursion via -R (because when they are deleted, there is nothing left to recurse into).

<dfn class="gx-param">--soft</dfn>  
Switch from hard deletion to soft deletion.

### Soft deletion notes

Soft deletion sets the soft-delete flag (also called "hidden" in Exchange) on messages and/or folders. Soft-deleted objects can be restored/unhidden by the user. Users are technically empowered to perform hard deletions as well, but most mail clients do not offer a user control (e.g. checkbox widget) for it, requiring the use of diagnostic utilities like MFCMAPI or gromox-mbop instead.

When a folder's soft-delete flag changes, the messages and subfolders within are left untouched; their soft-delete flag does not change. In fact, this behaves exactly like setting a directory in the file system to hidden.

### Examples

- Clear one folder's contents like Outlook/grommunio-web: gromox-mbop -u a@b.de emptyfld --soft DRAFTS

- Outlook/grommunio-web behave differently when clearing trash! The equivalent mbop command is: gromox-mbop -u a@b.de emptyfld --soft --nuke-folders DELETED

- Deletion of objects in trash only if untouched for a while: gromox-mbop -u abc@example.com emptyfld -Rt 1week --soft DELETED

## exaddrxlat

### Synopsis

<strong>exaddrxlat -m</strong> <em>file</em> \[<strong>-r</strong>\] <em>folder_spec</em>\[...\]

### Description

Scans messages in the given folders and replaces PR_ADDRTYPE="EX" and related properties by SMTP addresses.

MAPI as a system supports referencing message participants with arbitrary address types, including, but not limited to, SMTP, EX (Exchange/ActiveDirectory DN), FAX numbers, etc.

Contemporary Exchange systems (\>= 2010) and/or Outlook versions should be adding secondary metadata when receiving/sending messages such that EX-typed participants become a EX+SMTP hybrid. Really old messages may lack the properties, and GUIs may fail to fill the To: line when replying to old messages. exaddrxlat will replace EX and EX+SMTP hybrids by pure SMTP ones, removing most historic Exchange Directory and ActiveDirectory information.

### Options

<dfn class="gx-param">-m</dfn> <em>file</em>  
User map to utilize for translation. See [kdb-uidextract(8)](/man/kdb-uidextract-8/) for a format description.

<dfn class="gx-param">-r</dfn>  
Process folders recursively.

## foreach.\*

### Synopsis

<strong>foreach.</strong><em>filter</em>\[<strong>.</strong><em>filter</em>\]\* \[<strong>-j</strong> <em>jobs</em>\] <em>command</em> \[command-args...\]

### Description

foreach.\* is a pseudoaction for running another subcommands that gromox-mbop offers (e.g. ping, unload, purge-softdelete, etc.) for a number of users. Subcommands reading data from standard input (e.g. set-photo) cannot be realiably used with foreach, because stdin would be fully consumed the first time around and foreach does not cache the input for any subcommands.

### Filters

- secobj: limit to objects that can be used in ACLs

- user: regular users

- dl: distribution lists (groups)

- sharedmb: shared mailboxes

- room: room objects

- equipment: equipment objects

- contact: GAB contact objects

- active: active entities

- susp: entities marked as "suspended"

- deleted: entities marked as "deleted"

- mb: entity has a mailbox directory defined

- here: entity has current host as homeserver (compares `hostname --fqdn` where mbop is run with the SQL.servers.hostname column)

There is no "all" filter. Security objects and Contacts are so vastly different that it just does not make sense to operate on them in the same run.

### Options

<dfn class="gx-param">-j</dfn> <em>jobs</em>  
Maximum parallel execution factor. (Experimental.) 0 means autosizing. Only ping/vacuum/unload support this, and the option is otherwise ignored. Use external tools like parallel(1) or make(1) for guaranteed parallelization.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">1</span>

### Examples

- Hard-delete all objects which are currently softdeleted: gromox-mbop foreach.mb.here purge-softdelete -r /

## get-freebusy

### Synopsis

<strong>get-freebusy</strong> \[<strong>-a</strong> <em>start_time</em>\] \[<strong>-b</strong> <em>end_time</em>\] \[<strong>-x</strong> <em>username</em>\]

### Description

Runs the get_freebusy routine on the mailbox specified by the global -d/-u option(s) \[or the mailbox currently in scope when using foreach.\*\], and asks for free/busy status within the given time period.

### Options

<dfn class="gx-param">-a</dfn> {<em>yyyy-mm-dd</em><strong>T</strong><em>hh:mm:ss</em>\[<strong>Z</strong>\|<strong>+</strong><em>hhmm</em>\|<strong>-</strong><em>hhmm</em>\]\|<em>unixtime</em>}  
Limit returned events to occuring on or after this timestamp. Can either be a Unixtime or a ISO 8601 timestamp.

<dfn class="gx-param">-b</dfn> {<em>yyyy-mm-dd</em><strong>T</strong><em>hh:mm:ss</em>\[<strong>+</strong><em>hhmm</em>\|<strong>-</strong><em>hhmm</em>\]\|<em>unixtime</em>}  
Limit returned events to ocurring before this timestamp.

<dfn class="gx-param">-x</dfn> <em>username</em>  
Evaluate access control lists as this identity. If the -x option is omitted, ACL checks are omitted.

## freeze

### Synopsis

<strong>freeze</strong> \[<strong>--no-wait</strong>\]

### Description

Tell the Information Store to halt all new operations on the mailbox. Outstanding operations that are currently in processing are allowed to complete. New requests for the mailbox will be rejected. Special requests like (mbop's) <em>unload</em> or <em>thaw</em> are nevertheless allowed in frozen state, for obvious reasons.

### Options

<dfn class="gx-param">--no-wait</dfn>  
Do not wait for outstanding operations to complete.

## get-photo

### Synopsis

<strong>get-photo \></strong><em>somefile</em>

### Description

Reads the user photo from the store and dumps it to stdout. If stdout is a terminal, no output is shown, in which case, if stderr is (also) a terminal, a summary will be shown there.

## get-websettings

### Synopsis

<strong>get-websettings \></strong><em>file.json</em>\
<strong>get-websettings-persistent \></strong><em>file.json</em>\
<strong>get-websettings-recipients \></strong><em>autocomplete.json</em>

### Description

Reads various grommunio-web settings from the store and dumps it to stdout.

## movemsg

### Synopsis

<strong>movemsg -f</strong> <em>folder_spec</em> <strong>-t</strong> <em>folder_spec</em> \[<strong>--copy</strong>\] <em>msgid</em>\[...\]

### Description

Moves, or with <strong>--copy</strong>, copies one or more messages from one folder to another within the same store.

The message IDs taken as arguments on the command-line should be of the GC-value form, i.e. as they appear in the SQLite database. (For details about GCV, see glossary.rst in the source distribution.)

### Subcommand options

<dfn class="gx-param">-f</dfn> <em>folder_spec</em>  
The source folder. See section "Folder specification" below for syntax details of <em>folder_spec</em>.

<dfn class="gx-param">-t</dfn> <em>folder_spec</em>  
The destination folder.

<dfn class="gx-param">--copy</dfn>  
Copy the messages instead of moving them.

## ping

Causes the respective mailbox to be opened by the server. (Any request to the information storage server causes the respective mailbox to be opened; and ping is technically just a no-op request type.)

## sync-midb

### Synopsis

<strong>sync-midb</strong> \[<strong>-f</strong> <em>folder_spec</em>\]

### Description

Sends a request to midb for opening the mailbox and updating the midb-specific folder indices, as well as potentially building RFC5322 representations for newly-appeared messages. (Once the mailbox is open in midb, it uses asynchronous notifications to stay up to date.)

### Options

<dfn class="gx-param">-f</dfn> <em>folder_spec</em>  
Forcibly rerun the sync routine for a single specific folder. See section "Folder specification". In addition, the special keyword "all" is recognized.

## purge-datafiles

The "purge-datafiles" RPC makes exmdb_provider remove attachment and content files from disk that are no longer referenced by any message.

## purge-softdelete

### Synopsis

<strong>purge-softdelete</strong> \[<strong>-r</strong>\] \[<strong>-t</strong> <em>timespec</em>\] <em>folder_spec</em>...

### Description

This command hard-deletes all messages from a folder which are marked as soft-deleted. (The entire mailbox can be processed by specifying the root folder plus the -r option.)

### Subcommand options

<dfn class="gx-param">-r</dfn>  
Recurse into subfolders.

<dfn class="gx-param">-t</dfn> <em>timespec</em>  
Specifies the minimum time to the last modification that soft-deleted messages must have before they are hard-deleted. See [gromox(7)](/man/gromox-7/), section "Duration specification" for timespec's syntax.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>0</em> (immediate deletion)</span>

### Examples

- To process an entire mailbox and wipe everything older than a few days: gromox-mbop -u abc@example.com purge-softdelete -r / -t 10d

## recalc-sizes

### Synopsis

<dfn class="gx-param">recalc-sizes</dfn>

### Description

Rebuilds the mailbox's stored size totals by summing the message sizes recorded in its database. It updates the total, normal message and associated message (FAI) size properties, including soft-deleted messages. Associated messages hold hidden folder data such as rules and settings.

Use this command when mailbox size accounting is inconsistent, for example after a database repair that changed message records without updating the store totals. It prints the old and new totals in bytes, with separate normal and FAI values, so the result can be compared.

The command uses existing per-message sizes. It does not recalculate those sizes from message content, measure filesystem usage, nor reclaim disk space.

### Example

    gromox-mbop -u abc@example.com recalc-sizes

## get-msgcopy, set-msgcopy, clear-msgcopy

### Synopsis

<dfn class="gx-param">get-msgcopy</dfn>

<strong>set-msgcopy</strong> \[<strong>-v</strong>\] \[<strong>-a</strong> <em>boolean</em>\] \[<strong>-b</strong> <em>boolean</em>\] \[<strong>-x</strong> <em>boolean</em>\]

<strong>clear-msgcopy</strong> \[<strong>-abvx</strong>\]

### Description

When set on a mailbox, these settings make the server file a copy of every message sent as, or on behalf of, that mailbox into that mailbox's Sent Items folder, so that everyone with access to a shared mailbox can see what was sent in its name. The sender keeps their own copy as well. The settings correspond to the Exchange mailbox settings MessageCopyForSentAsEnabled and MessageCopyForSendOnBehalfEnabled and belong on the <em>represented</em> mailbox, not on the account doing the sending.

get-msgcopy prints the state of the settings. A setting that was never set behaves as if switched off and is reported as such. clear-msgcopy returns a setting to that state, as opposed to setting it to a recorded 0.

The <strong>exclusive</strong> setting says what happens to the sender's own copy once one of the other two has placed a copy here. With it set, the submitted message is discarded instead of being filed anywhere in the sender's own mailbox, so the represented mailbox holds the only copy. A folder the client asked for by <strong>PR_TARGET_ENTRYID</strong> is overridden, since honouring it would put a copy back into the mailbox this setting exists to keep clear. It has no effect on its own, and none unless this mailbox's copy was written, so a mailbox that is over quota or unreachable cannot cause a sent message to be filed nowhere. This is the outcome Exchange produces from the client setting DelegateSentItemsStyle=1 together with MessageCopyForSentAsEnabled=0.

A copy is deposited even if the sender holds no permission on the represented mailbox's Sent Items folder, matching Exchange behaviour. A failure to deposit one only produces a log warning and never fails the send. Messages submitted over EWS, and deferred sends, produce no copy.

### Options

<dfn class="gx-param">-a</dfn> <em>boolean</em>  
Selects the setting governing messages sent <strong>as</strong> this mailbox. Under set-msgcopy the option takes a value, one of 0/1, no/yes, off/on or false/true. Under clear-msgcopy it takes no value and merely selects the setting for removal.

<dfn class="gx-param">-b</dfn> <em>boolean</em>  
As <strong>-a</strong>, but for messages sent <strong>on behalf of</strong> this mailbox.

<dfn class="gx-param">-x</dfn> <em>boolean</em>  
As <strong>-a</strong>, but for the <strong>exclusive</strong> setting.

<dfn class="gx-param">-v</dfn>  
Verbose mode. (Same as global -v.)

### Examples

- gromox-mbop -u shared@example.com set-msgcopy -a 1

- gromox-mbop -u shared@example.com set-msgcopy -a 1 -x 1

- gromox-mbop -u shared@example.com get-msgcopy

- gromox-mbop -u shared@example.com clear-msgcopy

## set-locale

### Synopsis

<strong>set-locale</strong> \[<strong>-Tv</strong>\] -l <em>id</em>

### Description

First, the set-locale operation changes the "preferred language" setting for the user account. This affects the display of user interfaces like grommunio-web, and also affects the folder language selection when a mailbox is truncated/re-created with [gromox-mkprivate(8)](/man/gromox-mkprivate-8/).

Second, provided Gromox has default folder name translations for the desired locale, set-locale also resets the display names of the mailbox's built-in folders.

### Options

<dfn class="gx-param">-T</dfn>  
Run a trivial performance test against exmdb by repeatedly setting the folder names.

<dfn class="gx-param">-l</dfn> <em>d</em>  
A locale identifier in the form of <em>language</em><strong>\_\[</strong><em>territory</em><strong>\],</strong> where language is a ISO 639-1 code and territory is a ISO 3166-1 Alpha 2 code, e.g. ja_JP, pt_BR, pt_PT. This is like the well-known XPG/POSIX locale identifier syntax <https://www.gnu.org/software/libc/manual/html_node/Locale-Names.html>, but no Codeset and no Modifier should be used in Gromox.

<dfn class="gx-param">-v</dfn>  
Verbose mode. (Same as global -v.)

### Examples

- gromox-mbop -u abc@example.com set-locale -l ja_JP

## set-photo

### Synopsis

<strong>set-photo \<</strong><em>somefile</em>

### Description

Reads a new user photo from standard input and writes it to the store.

## set-websettings

### Synopsis

<strong>set-websettings \<</strong><em>file.json</em>\
<strong>set-websettings-persistent \<</strong><em>file.json</em>\
<strong>set-websettings-recipients \<</strong><em>autocomplete.json</em>

### Description

Reads new grommunio-web settings from standard input and writes it to the store.

## unload

Normally, [exmdb_provider(4gx)](/man/exmdb_provider-4gx/) keeps stores open for up to exmdb_provider.cfg:cache_interval. The "unload_store" RPC to [exmdb_provider(4gx)](/man/exmdb_provider-4gx/) causes the sqlite database (in /var/lib/gromox/.../exmdb/exchange.sqlite3) to be closed. Any subsequent RPC may reopen it, though. The unload RPC is useful after a mailbox was deleted and/or reinitialized with grommunio-admin-api or tools like [gromox-mkprivate(8)](/man/gromox-mkprivate-8/)/[gromox-mkpublic(8)](/man/gromox-mkpublic-8/). \[zcore also has store state in memory. This would also need to be purged — but there is no RPC for such action at this time.\] unload will fail to succeed if there is still a client connected to the mailbox via a notification channel.

## vacuum

Issue the SQLite ".vacuum" command on the user's exchange.sqlite3 file in an attempt to reclaim unused disk space and shrink it. This operation can potentially run for quite some time, during which the mailbox is inaccessible.

## zaddrxlat

### Synopsis

<strong>zaddrxlat -m</strong> <em>file</em> <strong>\[-r\]</strong> <em>folder_spec</em><strong>\[...\]</strong>

### Description

Scans messages in the given folders and replaces PR_ADDRTYPE="ZARAFA" and related properties by normal SMTP addresses. See [gromox-kdb2mt(8)](/man/gromox-kdb2mt-8/) section "ZARAFA Address Type" for some details. The use case for zaddrxlat is for fixing up addresses after the fact, i.e. when the administrator forgot to employ a user map at the time of running kdb2mt. zaddrxlat does not change ACLs.

### Options

<dfn class="gx-param">-m</dfn> <em>file</em>  
User map to utilize for translation. See [kdb-uidextract(8)](/man/kdb-uidextract-8/) for a format description.

<dfn class="gx-param">-r</dfn>  
Process folders recursively.

## Example

zaddrxlat -m u.map -r "IPM_SUBTREE/Import of blah @2025-12-26"

## Folder specification

<em>folder_spec</em> <strong>must conform to one of three forms. Either:</strong>

- a numeric identifer (e.g. 13, 0xd)

- a folder path starting with a slash, optionally followed by a slash-separated sequence of subordinate folder names

- a folder path starting with a fixed symbolic name, optionally followed by a slash-separated sequence of subordinate folder names

The backslash may be used as a hierarchy separator instead. In any case, the chosen separator must be used consistently in the entire path. The folder path is case-insensitive.

The recognized strings are: CALENDAR, COMMON_VIEWS, CONFLICTS, CONTACTS, DEFERRED_ACTION, DELETED (TRASH, WASTEBASKET), DRAFTS, FINDER, INBOX, IPM_SUBTREE, JOURNAL, JUNK, LOCAL_FAILURES, NOTES, OUTBOX, SENT, SERVER_FAILURES, SHORTCUTS, SYNC_ISSUES, TASKS, VIEWS.

The purpose of these names is for referencing a built-in folder irrespective of its assigned name, which is dependent upon translation settings. The symbolic names can be used with private stores only. There are no names defined for public folder contents at this time. There is also no parsing support for slashes in folder names. The slash character is always treated as a hierarchy separator.

### Examples

- Using the MAPI root: /Top of Information Store/Sent Items/2022

- Using a symbolic name: IPM_SUBTREE/Sent Items/2022

- Using a symbolic name: SENT/2022

- Referencing a folder with a slash can be done by using backslash as the hierarchy separator: SENT\Winter break 2022/2023

The MAPI root is not visible in most clients. MUAs like Outlook and grommunio-web show hierarchy starting at IPM_SUBTREE only.

## See also

<dfn class="gx-param">[gromox(7)](/man/gromox-7/)</dfn>
