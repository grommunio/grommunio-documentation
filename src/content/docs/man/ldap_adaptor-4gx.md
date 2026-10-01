---
title: "ldap_adaptor(4gx)"
description: "ldap_adaptor — LDAP connector for authentication"
sidebar:
  order: 50
---

## Name

ldap_adaptor — LDAP connector for authentication

## Description

ldap_adaptor is a component for Gromox that facilitates the use of an LDAP server for authentication purposes. Since the authoritative user database is in MySQL, LDAP is only used to perform authentication (Bind operations), and metadata searches that lead up to such Binds, i.e. looking for the LDAP object that has a particular "mail" attribute.

Gromox versions 1.33 and onwards have support for using different LDAP servers per organization. The SQL database for Gromox users (and domains and organizations) has room to store properties on the individual organization objects. Use Grommunio AAPI/AWEB to create and/or change organizations and their properties. These properties from SQL can selectively override the six config directives ldap_host, ldap_start_tls, ldap_bind_user, ldap_bind_pass, ldap_search_base and ldap_mail_attr.

## Configuration directives

The configuration file, /etc/gromox/ldap_adaptor.cfg, serves not only the ldap_adaptor component, but is also read by the Grommunio Admin API.

### Gromox directives

<dfn class="gx-param">auth_connections</dfn>  
The maximum size of the connection pool for authentication requests. This parameter has fixed value (same as data_connections) and is currently not settable!\
(Authentication operations incur an implicit logout of whatever identity was used before, which could incur extra latency if authentication operations and metadata lookups were to be done on the same connection, which is why ldap_adaptor has two separate connection pools.)\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(same as data_connections)</span>

<dfn class="gx-param">data_connections</dfn>  
The number of LDAP connections that will be kept active to the LDAP server for the purpose of metadata searches.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">4</span>

<dfn class="gx-param">ldap_edirectory_workarounds</dfn>  
Attempt to deal with wire protocol violations brought about by Novell/NetIQ eDirectory server implementations.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">false</span>

<dfn class="gx-param">ldap_bind_user</dfn>  
An LDAP binddn to use for metadata searches. You can only use Simple Authentication at this time. If an organization object defines LDAP credentials of its own, those will be used in preference to ldap_bind_user.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(unset)</span>

<dfn class="gx-param">ldap_bind_pass</dfn>  
Password for Simple Authentication of ldap_bind_user.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(unset)</span>

<dfn class="gx-param">ldap_host</dfn>  
Whitespace-separated set of LDAP URIs for the default LDAP tree. The form is <strong>ldap</strong>\[<strong>s</strong>\]<strong>://</strong>\[<em>name</em>\[<strong>:</strong><em>port</em>\]\] or <strong>ldapi://</strong>\[<em>path</em>\], the latter being a Unix domain socket specification, whose path, if specified, needs to be percent-encoded. The openldap2 ldap.conf(5) manpage does not specify trailing slashes or DN bases like RFC 2255 does, and because of this, you should not use them. openldap2 utilities accept-ignore such part of the URI, while other implementations like python-ldap3 fail to connect. Per-organization LDAP credentials override ldap_host as necessary.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(libldap default, see ldap.conf(5))</span>

<dfn class="gx-param">ldap_mail_attr</dfn>  
The name of the LDAP attribute which holds the primary e-mail address of the user. Pick <strong>mail</strong> (OpenLDAP as well as Active Directory schemes).\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(empty)</span>

<dfn class="gx-param">ldap_search_base</dfn>  
<span class="gx-deflabel">Default:</span> <span class="gx-default">(libldap default)</span>

<dfn class="gx-param">ldap_start_tls</dfn>  
Use the STARTTLS mechanism on LDAP connections. Prefer using Explicit TLS (ldaps:// in the URI field) in favor of ldap:// with STARTTLS; see Internet blog posts "STARTTLS considered harmful" for details.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>off</em>\</span>
Take note that libldap may reject self-signed certificates from the LDAP server. This may be worked around with the "TLS_REQCERT allow" directive in ldap.conf. See the ldap.conf(5) manpage for details. However, by its description, TLS_REQCERT will also make encryption optional, which means becoming the victim of a downgrade attack is a possibility.

### Grommunio Admin API directives

<dfn class="gx-param">ldap_host</dfn>  

<dfn class="gx-param">ldap_bind_user</dfn>  

<dfn class="gx-param">ldap_bind_pass</dfn>  

<dfn class="gx-param">ldap_search_base</dfn>  

<dfn class="gx-param">ldap_start_tls</dfn>  

<dfn class="gx-param">ldap_mail_attr</dfn>  
(These six as above)

<dfn class="gx-param">ldap_disabled</dfn>  
If true, Grommunio Admin API will not make use of LDAP (which generally just means synchronization). This directive has no effect on Gromox; users which have been synchronized previously and which exist in MySQL keep their validity as far as Gromox is concerned.

<dfn class="gx-param">ldap_object_id</dfn>  
The name of the LDAP attribute which holds a unique, unchanging object identifier for synchronization purposes. Pick <strong>entryUUID</strong> for OpenLDAP, <strong>objectGUID</strong> for Active Directory.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(empty)</span>

<dfn class="gx-param">ldap_user_filter</dfn>  
An LDAP search filter that specifies which users should be synchronized. Recommendations are <strong>(objectClass=posixAccount)</strong> for OpenLDAP/RFC2307bis, <strong>(objectClass=user)</strong> for Active Directory.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(empty)</span>

<dfn class="gx-param">ldap_user_displayname</dfn>  
The name of the LDAP attribute which holds the value for PR_DISPLAY_NAME. Pick <strong>displayName</strong> (OpenLDAP as well as Active Directory schemes).\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(empty)</span>

<dfn class="gx-param">ldap_user_search_attrs</dfn>  
The name(s) of LDAP attributes which the Admin API will compare when using AAPI's search function. To specify multiple attributes, repeat this directive, and specify one attribute per line, i.e. put <em>ldap_user_search_attrs=mail</em> and <em>ldap_user_search_attrs=cn</em>, etc. in the config file.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(empty set)</span>

<dfn class="gx-param">ldap_user_templates</dfn>  
The name(s) of Admin API templates to use. Multi-value directive like search_attrs. Pick <strong>ldap_user_templates=common</strong> and <strong>ldap_user_templates=OpenLDAP</strong> for OpenLDAP, or <strong>ldap_user_templates=common</strong> and <strong>ldap_user_templates=ActiveDirectory</strong> for Active Directory.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(empty set)</span>

<dfn class="gx-param">ldap_user_aliases</dfn>  
The name of the LDAP attribute which contains secondary e-mail addresses. Pick <strong>mailAlternativeAddress</strong> (OpenLDAP) or <strong>proxyAddresses</strong> (Active Directory). The <strong>smtp:</strong> prefix in proxyAddresses is automatically trimmed when read.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">(empty)</span>

## Signals

Upon receipt of SIGHUP, configuration files are re-read, but only a few select directives can be changed this way, as many parts do not implement reload.

## See also

<strong>gromox</strong>(7), <strong>authmgr</strong>(4gx)
