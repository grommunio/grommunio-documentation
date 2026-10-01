---
title: "grommunio-admin user"
description: "grommunio-admin user — User management"
sidebar:
  label: "user"
  order: 10
---

### Name

grommunio-admin user — User management

### Synopsis

<strong>grommunio-admin user</strong> <strong>create</strong> \[<em>--no-defaults</em>\] \[<em>--no-maildir</em>\] \[<em>\<FIELDS\></em>\] <em>USERNAME</em>\
<strong>grommunio-admin user</strong> <strong>delegate</strong> <em>USERSPEC</em> (<em>clear</em> \| <em>list</em>)\
<strong>grommunio-admin user</strong> <strong>delegate</strong> <em>USERSPEC</em> (<em>add</em> \| <em>remove</em>) <em>USERNAME</em> …\
<strong>grommunio-admin user</strong> <strong>delete</strong> \[<em>-c</em>\] \[<em>-k</em>\] \[<em>-y</em>\] <em>USERSPEC</em>\
<strong>grommunio-admin user</strong> <strong>devices</strong> <em>USERSPEC</em> (<em>list</em> \| <em>resync</em> \| <em>remove</em> \| <em>show</em>) \[<em>DEVICE</em> …\]\
<strong>grommunio-admin user</strong> <strong>devices</strong> <em>USERSPEC</em> wipe \[<em>--mode MODE</em>\] <em>DEVICE</em>\
<strong>grommunio-admin user</strong> <strong>list</strong> \[<em>-f ATTRIBUTE=\<value\></em>\] \[<em>-s FIELD</em>\] \[<em>USERSPEC</em>\]\
<strong>grommunio-admin user</strong> <strong>login</strong> \[<em>--nopass</em>\] \[<em>--password PASSWORD</em>\] \[<em>--token</em>\] <em>USERNAME</em>\
<strong>grommunio-admin user</strong> <strong>modify</strong> \[<em>\<FIELDS\></em>\] \[<em>--delete-chat-user</em>\] \[<em>--no-ldap</em>\] \[<em>--remove-alias ALIAS</em>\] \[<em>--remove-altname ALTNAME</em>\] \[<em>--remove-property PROPSPEC</em>\] \[<em>--remove-storeprop PROPSPEC</em>\] <em>USERSPEC</em>\
<strong>grommunio-admin user</strong> <strong>query</strong> \[<em>-f ATTRIBUTE=\<value\></em>\] \[<em>--format FORMAT</em>\] \[<em>--separator SEPARATOR</em>\] \[<em>-s FIELD</em>\] \[<em>ATTRIBUTE</em> …\]\
<strong>grommunio-admin user</strong> <strong>sendas</strong> <em>USERSPEC</em> (<em>clear</em> \| <em>list</em>)\
<strong>grommunio-admin user</strong> <strong>sendas</strong> <em>USERSPEC</em> (<em>add</em> \| <em>remove</em>) <em>USERNAME</em> …\
<strong>grommunio-admin user</strong> <strong>show</strong> \[<em>-f ATTRIBUTE=\<value\></em>\] \[<em>-s FIELD</em>\] <em>USERSPEC</em>

### Description

Subcommand for user management.

### Commands

`create`  
Create a new user

`delegate`  
Manage delegate permission

`delete`  
Delete user

`devices`  
User mobile device management

`list`  
List users <strong>Deprecated.</strong> Use query instead.

`login`  
Test user login

`modify`  
Modify a user

`query`  
Query user attributes

`sendas`  
Manage send-as permission

`show`  
Show detailed information about a user

### Options

`ATTRIBUTE`  
Attributes to query. Available attributes are <em>ID</em>, <em>aliases</em>, <em>changePassword</em>, <em>chat</em>, <em>chatAdmin</em>, <em>domainID</em>, <em>forward</em>, <em>homeserverID</em>, <em>lang</em>, <em>ldapID</em>, <em>maildir</em>, <em>pop3_imap</em>, <em>privArchive</em>, <em>privChat</em>, <em>privFiles</em>, <em>privVideo</em>, <em>privWeb</em>, <em>privDav</em>, <em>privEas</em>, <em>publicAddress</em>, <em>smtp</em>, <em>status</em> and <em>username</em>.

If no attributes are specified, <em>ID</em>, <em>username</em> and <em>status</em> are shown.

`DEVICE`  
Limit command to given device ID(s)

`USERNAME`  
E-Mail address of the user

`USERSPEC`  
User name prefix or user ID

`-c`, `--keep-chat`  
Deactivate but do not permanently delete chat user

`--delete-chat-user`  
Permanently delete chat user

`-f FIELD=<value>`, `--filter FIELD=<value>`  
Filter expression in the form of ‘field=value’. Can be specified multiple times to refine filter

`--format FORMAT`  
Output format. Can be one of <em>csv</em>, <em>json-flat</em>, <em>json-kv</em>, <em>json-object</em>, <em>json-structured</em> and <em>pretty</em>. Default is <em>pretty</em>.

`-k`, `--keep-files`  
Do not delete user files from disk

`--mode MODE`  
Specify wipe status to set. Possible values are <em>account</em> and <em>normal</em>, or <em>cancel</em> to stop a pending wipe.

`--no-defaults`  
Do not apply configured default values

`--no-ldap`  
Detach user from LDAP object

`--no-maildir`  
Do not create a mailbox for that user

`--nopass`  
Skip password check

`--password`  
User password. If omitted, password is retrieved from prompt.

`--remove-alias ALIAS`  
Remove ALIAS from user (can be given multiple times)

`--remove-altname ALTNAME`  
Remove ALTNAME from user (can be given multiple times)

`--remove-property PROPSPEC`  
Remove property from user (can be given multiple times)

`--remove-storeprop PROPSPEC`  
Remove property from user's store (can be given multiple times)

`--separator SEPARATOR`  
String to use for column separation (<em>csv</em> and <em>pretty</em> only). Must have length 1 if format is <em>csv</em>. Default is "," for <em>csv</em> and " " for pretty.

`-s FIELD`, `--sort FIELD`  
Sort by field. Can be given multiple times

`--token`  
Generate access and CSRF token on successful login

`-y`, `--yes`  
Assume yes instead of prompting

### Fields

`--changePassword <bool>`  
Whether the user can change the password

`--chat <bool>`  
Whether to create a chat user

`--chatAdmin <bool>`  
Whether the user has chat admin privileges

`--homeserver ID`  
ID of the home server or 0 for local user

`--lang LANG`  
User store language

`--ldapID LDAPID`  
Identifier of the LDAP object linked to the user

`--pop3-imap <bool>`  
Whether the user has the POP3/IMAP privilege

`--privArchive <bool>`  
Whether the user has the archiving privilege

`--privChat <bool>`  
Whether the user has the chat privilege

`--privFiles <bool>`  
Whether the user has the files privilege

`--privVideo <bool>`  
Whether the user has the video privilege

`--privWeb <bool>`  
Whether the user has the web privilege

`--privDav <bool>`  
Whether the user has the DAV privilege

`--privEas <bool>`  
Whether the user has the EAS privilege

`--public-address <bool>`  
Whether the user has the public address privilege

`--smtp <bool>`  
Whether the user has the SMTP privilege

`--status STATUS`  
User address status. Either numeric value or one of <em>normal</em>, <em>suspended</em>, <em>deleted</em> or <em>shared</em>.

`--alias ALIAS`  
Add alias

`--altname ALTNAME`  
Add ALTNAME to user alternative login name list (can be given multiple times)

`--property propspec=value`  
Set property defined by propspec to value

`--storeprop propspec=value`  
Set store property defined by propspec to value

`--username`  
Rename user

### See Also

<strong>grommunio-admin</strong>(1), <strong>grommunio-admin-domain</strong>(1), <strong>grommunio-admin-exmdb</strong>(1), <strong>grommunio-admin-fs</strong>(1), <strong>grommunio-admin-ldap</strong>(1), <strong>grommunio-admin-passwd</strong>(1), <strong>grommunio-admin-server</strong>(1)
