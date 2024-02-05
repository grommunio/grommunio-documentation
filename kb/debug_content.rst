..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2022 grommunio GmbH

Debug Content
=============

Messages in delivery
--------------------

**Observation:** gromox-delivery emits log messages about "Dispatch error".

.. code-block:: text

	# journalctl -u gromox-delivery
	...
	exmdb_client_do_rpc: Dispatch error
	oxcmail_import:2870: returned false
	SMTP message queue-ID: 2, FROM: doc@example.com, TO: doc@example.com  fail to convert rfc5322 into MAPI message object

**Cause:** The TCP connection between gromox-delivery and gromox-http
(exmdb_provider subcomponent) ended unexpectedly. Routine(s) for converting
Internet Mail to MAPI objects thus could not complete.

**Action to take:** Check the system logs for indications that gromox-http has
suffered a crash, or that an administrator has willingly stopped the process.

---

**Observation:** gromox-delivery emits log messages about failed
RFC5322-to-MAPI conversion such as the following (but without the
above-mentioned "Dispatch error").

.. code-block:: text

	# journalctl -u gromox-delivery
	...
	oxcical_import:1234: returned null/false
	...
	oxcmail_import:2870: returned false
	SMTP message queue-ID: 2, FROM: doc@example.com, TO: doc@example.com  fail to convert rfc5322 into MAPI message object

**Cause:** Suboptimal parsing routines.

**Action to take:** Send the message file to Grommunio Support to facilitate
further investigation.

The message in question should be located in ``/var/lib/gromox/queue/save``.
Conversion failure is considered terminal and no retry will be attempted.

(There are three other errors which are not considered terminal. These are: the
user database being unavailable, a permission error on disk, or a disk full
event. In these cases, redelivery will be attempted and the messages placed in
``/var/lib/gromox/queue/cache`` instead. Redelivery may disappear in a future
version of Gromox, because Postfix is already capable of handling this.)

The message can be found by matching up the
timestamp in the log with the timstamp of the file object or, in fact, the
timestamp in the filename itself. The filename usually consists of a Unix
timestamp, a boot-time monotonically-increasing counter (QID), and the
hostname. This file may contain small binary tags, so if looking for the exact
file by way of the ``grep`` command and it complains about ``Binary file
matches``, you may need the ``--text`` option. To convert from and to Unix
timestamps, the following command examples should help.

.. code-block:: text

	perl -e 'print scalar localtime 1699956475'

	date -d "2023-11-14 11:07:55" +%s


Delivered messages & IMAP messages
----------------------------------

**Observation:** A message appears incomplete in any MUA after being put into
the mailbox by gromox-delivery or an IMAP client.

**Cause:** Conversion from Internet Mail (IM) to MAPI is lossy in nature, and
the conversion procedure has unanticipatedly ignored too much of the IM
content.

**Action to take:** Send the original EML copy of the message to Grommunio
Support to facilitate further investigation.

Look into the ``/var/lib/gromox/user/XXX/eml/`` directory. The filename is
generally the one used during delivery (Unix TS + QID + hostname). If the file
was created later, that may be reflected in timestamps. This should help
narrowing the set of files as should the use of ``grep``. (The binary tags from
the delivery stage are not present.)

The hostname portion may be ``.midb``. If so, that file was synthesized from a
MAPI object, and *not the original EML form* from delivery/IMAP.


Messages imported from a MAPI source
------------------------------------

**Observation:** A message appears incomplete in any MUA after import
from gromox-kdb2mt, gromox-pff2mt or gromox-oxm2mt.

**Observation:** A message has missing metadata, mangled metadata, mangled
body, or has substantial differences in how it is rendered between Outlook,
grommunio-web or some IMAP client to the point that it is subjectively
considered "broken".

**Cause:** To be determined in detail. Imports via gromox-kdb2mt/pff2mt/oxm2mt
are practically lossless (compared to RFC5322 conversions) because the data
model is already MAPI. Some metadata and some internal IDs and references are
regenerated or dropped so messages make reasonable sense when placed in the
target Gromox mailbox. But not all ancient metadata is dropped so as to provide
as loss-free a conversion as is feasible, but such ancient data may cause
strange behavior in corner cases. (For example, unusual recipient address
types.)

**Action to take:** Send the MT stream file to Grommunio Support to facilitate
further investigation.

For gromox-kdb2mt: Capture the standard output of the gromox-kdb2mt process to
a file. The ``--only-obj`` option can help produce a smaller MT file. Depending
on circumstances however, access may be needed to the entire database
(interactively or a mysqldump) if the MT file is not informative enough.

For gromox-pff2mt: Capture the standard output of gromox-pff2mt to a file. The
``--only-nid`` option can help produce a minimal-size MT file. Depending on
circumstances however, access may be needed to the PFF/PST/OST file if the MT
file is not informative enough.

For gromox-oxm2mt: Send the .msg file to the support team.


Messages imported from RFC5322/5545/6350 files
----------------------------------------------

**Observation:** A message appears incomplete in any MUA after import
from gromox-eml2mt, gromox-ical2mt or gromox-vcf2mt.

**Cause:** Conversion from Internet Mail (IM) to MAPI is lossy in nature, and
the conversion procedure has unanticipatedly ignored too much of the IM
content.

**Action to take:** Send the original EML, iCal or vCard file to Grommunio
Support to facilitate further investigation.


Messages at rest
----------------

**Observation:** Some operation on a mailbox that involves existing messages
does not work as expected. Example use cases that would fall under this:

* moving messages between folders
* setting categories on messages
* composing or submitting messages
* MAPI-to-RFC5322 conversions for outgoing mail

**Cause:** To be individually determined.

**Action to take:** Grommunio Support may require the sqlite mailbox, which is
located in ``/var/lib/gromox/X/exmdb/exchange.sqlite3`` to reproduce.


Message export
--------------

**Observation:** gromox-http or gromox-zcore emits a log message about failed
MAPI-to-RFC5322 conversion such as the following.

.. code-block:: text

	# journalctl -u gromox-zcore
	...
	user=test@host.example.net host=::ffff:192.0.2.37  W-1281: Failed to export to RFC5322 mail while sending mid:0x5001b

**Cause:** Presumably the software did not anticipate a lack of certain
metadata on the message.

**Action to take:** Follow-up with Grommunio Support to facilitate access to
the sqlite3 file. (The conversion procedure ought to succeed at all times with
all MAPI messages.)


Outgoing messages
-----------------

**Observation:** A message in "Sent Items" appears acceptable, but arrives
incomplete for the recipient in their Inbox.

**Cause:** Suboptimal export routines.

**Action to take:** Local investigation by administrator, follow-up with
Grommunio Support.

**Procedure:**

On the sender side, open grommunio-web, right click the message in "Sent Items"
and call up the Options dialog. The 16th-last to 5th-last nibble is the
GCV/message id. (Screenshot example: 0x1fe647)

.. image:: _static/img/gweb-messageid.png

With this ID, the MAPI-to-RFC5322 conversion can be re-enacted:

.. code-block:: sh

	gromox-exm2eml -u test@host.example.net 0x1fe647

If this EML looks bad: Export routine is broken. Confer with section "Messages at rest".

If this EML looks good: Look for problems in the SMTP transport or on the
receiving side.

.. meta::
   :description: grommunio Knowledge Database
   :keywords: grommunio Knowledge Database
   :author: grommunio GmbH
   :publisher: grommunio GmbH
   :copyright: grommunio GmbH, 2023
   :page-topic: software
   :page-type: documentation
   :robots: index, follow
