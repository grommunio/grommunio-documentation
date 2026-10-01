---
title: "pam_gromox(4gx)"
description: "pam_gromox — a PAM plugin to authenticate with Gromox"
sidebar:
  order: 50
---

## Name

pam_gromox — a PAM plugin to authenticate with Gromox

## Description

This module feeds authentication requests to Gromox's [authmgr(4gx)](/man/authmgr-4gx/) module, and thus [mysql_adaptor(4gx)](/man/mysql_adaptor-4gx/) and/or [ldap_adaptor(4gx)](/man/ldap_adaptor-4gx/). It does not rely on the availability of any Gromox service; just MySQL/LDAP is enough. pam_gromox is meant to be used in conjunction with non-Gromox processes that an administrator may wish to integrate with, such as an SMTP daemon.

## Incantation in /etc/pam.d/smtp

Gromox accounts are not mapped from or to any Unix accounts, so the pam_unix.so module that is present in the default /etc/pam.d/smtp module list within Linux distributions is not suitable and can be wholly replaced. In otherwords, /etc/pam.d/smtp need just contain:

    auth required pam_gromox.so service=smtp
    account required pam_permit.so

(pam_gromox does not provide a usable "account" handler, therefore "account required pam_gromox.so" would do nothing. The PAM framework always starts out with an initial deny policy, so at least one module needs to be called to make the PAM request succeed. For this reason, if there are no other "account" modules listed, pam_permit.so should be used.)

## PAM module arguments

<strong>service=</strong><em>s</em>  
Check for a specific privilege bit on the user account. Possible values for <em>s</em> are: <strong>exch</strong>, <strong>smtp</strong>, <strong>imap</strong>, <strong>pop3</strong>, <strong>chat</strong>, <strong>video</strong>, <strong>files</strong>, <strong>archive</strong>.\
<span class="gx-deflabel">Default:</span> <span class="gx-default"><em>smtp</em></span>

## Configuration directives

The usual config file location is /etc/gromox/pam.cfg.

<dfn class="gx-param">config_file_path</dfn>  
Colon-separated list of directories in which further configuration files.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">/etc/gromox/pam:/etc/gromox</span>

<dfn class="gx-param">pam_prompt</dfn>  
If pam_gromox detects the absence of a password but presence of a PAM conversation function, it will attempt to retrieve the password that way, and in doing so, will show this label just ahead of the nonechoing password prompt.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">Password:</span>

## See also

<strong>gromox</strong>(7)
