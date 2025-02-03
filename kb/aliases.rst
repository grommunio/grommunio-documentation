..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2025 grommunio GmbH

Understanding MAPI and Aliases
==============================

By default, grommunio such as Microsoft Exchange (on-premises and Exchange 
Online) does not allow users to send messages from any of their secondary 
(alias) email addresses. Instead, Exchange typically requires that email be 
sent from either the primary SMTP address of a mailbox or from another 
mailbox/address for which the user has explicit "Send As" or
"Send on Behalf of" permissions. Here are the key reasons why 
"sending as an alias" can be problematic and how Microsoft has approached this 
limitation:

Behavior in grommunio (and Exchange)
------------------------------------

- Single Primary SMTP Address: In traditional Exchange environments (and by  
default in Exchange Online), each user mailbox has one "primary" SMTP address. 
That address is the one used when you send an email.

- Alias Addresses: Mailboxes can have multiple "proxy" or "alias" addresses,
but these aliases exist primarily for receiving email. By default, Exchange 
does not allow you to send out through an alias.

From Microsoft’s standpoint, alias addresses are designed to ensure that 
a mailbox can receive email sent to multiple addresses or domains. Security 
and administrative considerations also come into play: Exchange wants to be 
explicit about which identity a user is sending from. Also, there are many
other technical reasons, one of them is that MRs (meeting requests) also have 
the attendees identifiable through SMTP addresses. Using different aliases 
with meeting requests would therefore be prone to errors in matching these 
objects beyond the now-point-in-time view (for example switching aliases at 
different times).

Alternative workarounds
-----------------------

If you are using an on-premises deployment of Exchange (2016, 2019, etc.), 
out-of-the-box "Send from Alias" is also not currently supported, just like 
with grommunio.

Possible workarounds include:

- Shared/Resource Mailbox: Create a separate mailbox or shared mailbox that 
  has the desired alias as its primary address, then grant "Send As" 
  permissions to your user. You can then select that mailbox as the From
  address.

- Third-Party Tools or Transport Rules: Some organizations use custom 
  transport rules or third-party utilities that rewrite the From header to 
  appear as an alias. This is more complex, can be tricky to maintain, and may 
  introduce mail-flow side effects.

With grommunio, we traditionally use Postfix as our main MTA (which is 
built-in with every appliance) and the recommended MTA. It is possible to 
create transport rules on that basis, like you can see based on the following 
example with a fixed recipient.

Alias transport rule in Postfix
-------------------------------

.. important::
   Please note to validate your transport maps appropriately, as they directly
   manipulate your MTA configuration. Take care and validate both rewriting
   and non-rewriting mail routing to work as expected.

In ``/etc/postfix/main.cf`` you can enable header checks with:

.. code-block:: text

	header_checks = pcre:/etc/postfix/header_checks

and use the appropriate header_checks file with (example):

.. code-block:: text

	/^(From:.*myuser@mydomain\.at)(\r?\n(.*\r?\n)*?^To:.*special@destination\.com)/m
	    REPLACE From: alias@mydomain.at

After that, do not forget to create the appropriate postfix map:

.. code-block:: text

	postmap /etc/postfix/header_checks

How it works: When Postfix processes the headers of an outgoing email, it 
checks for a From line matching myuser@mydomain.at. It then looks ahead in 
the next lines for a To line matching special@destination.com. If both 
conditions are met in that single message header, it rewrites the From header 
to alias@mydomain.at. If the message is going to any other recipient, no 
rewriting occurs.

Of course, this is just an example, there are many possibilities to extend this
by for example replacing the sender or the recipient(s) in a more generalized 
way.

Summary
-------

By default, grommunio acts the same way like Microsoft Exchange in this case.
Main Reason for that is the MAPI core technology which is the foundation of 
both.

Historically, aliases were for receiving mail only, and Microsoft locked down 
sending behavior for clarity, security, and auditability. However, the newer 
Microsoft 365 Exchange Online feature "Send from Alias" can be enabled by an 
admin to address this limitation in the cloud. This is done by rewriting 
addresses in the mail transport queue in M366. For on-premises Exchange,
administrators generally need to rely on workarounds (such as shared 
mailboxes or distribution groups with "Send As" privileges). With grommunio 
you can use our provided Postfix to define generalized alias transports or use 
the same methods as common with Microsoft Exchange (and many other solutions).
