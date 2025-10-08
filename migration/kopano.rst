..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2025 grommunio GmbH

######
Kopano
######

Migrating Kopano is a multi-step process which also depends on the configuration of the backend used by Kopano.

If Kopano uses LDAP, the high-level view of the migration is as follows:

- Configure grommunio appropriately to LDAP (settings user filters, etc.)
- Create stores in grommunio
- Migrating user data (which this article covers mainly)
- Switch mail-routing

This migration focusses mainly on the migration of the dataset and does not imply an active LDAP configuration.

.. important::
   This guide is not conclusive and is provided for convenience reasons. There might be aspects of your Kopano installation which is not covered by this manual. Please refer to your partner or feel free to contact us, specifically Professional Services for extended inquiries if you are missing something relevant to your migration.

Preparation
===========

When migrating Kopano, being well-prepared matters. For this to happen, we need to make sure that the relevant metadata for migration is prepared, ideally in a list format which we can use to create our users in the grommunio installation:

.. code-block:: bash

	kopano-admin -l | sed -e '1,4d' -e '/^$/d' | awk '{ print $1 }' | sort | while read user; do kopano-admin --details $user; done | egrep '^(Username|Fullname|Emailaddress|Store GUID| Warning| Soft| Hard)' | sed -e 's#^ ##g' -e 's#^Username:\t*##g' -e 's#.*:[\t ]*#;#g' | sed ':a;N;$!ba;s/\n;/;/g' >> kopano-users.txt

This (long) command executed on the Kopano system will create us a list of users with the important metadata of users which we will require in a format which can be used for further scripting. 

With this list now, we can create the used domains in grommunio:

.. code-block:: bash

	MAX_USERS_DOMAIN=250

	cat kopano-users.txt | awk -F\; '{ print $3 }' | awk -F@ '{ print $2 }' | sort | uniq | sed '/^$/d' | while read DOMAIN; do
		grommunio-admin domain create -u ${MAX_USERS_DOMAIN} $DOMAIN
	done



On the grommunio system, Kopano databases can be imported on the command-line
with `gromox-kdb2mt <https://docs.grommunio.com/man/gromox-kdb2mt.8.html>`_ and `gromox-mt2exm
<https://docs.grommunio.com/man/gromox-mt2exm.8.html>`_. These are two commands meant to be chained
together by way of a pipe; tend to the linked manual pages to read about the
invocation syntax.
