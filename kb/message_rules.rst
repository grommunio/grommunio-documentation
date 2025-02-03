..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2025 grommunio GmbH

Message rules
=============

Managing rules
--------------

MAPI allows to keep rules for *every individual folder* (cf. MS-OXORULE §1.3),
but the way this is exposed by clients in their user interface varies.

* Outlook (as of 2021) only supports editing rules for the default private
  store inbox, and for public folders.

  * To edit the rule table of the Inbox folder of the default private store in
    Outlook, choose File » Manage Rules & Alerts.

  * To edit the rule table of folders in public stores in Outlook,
    select the folder in the folder hierarchy view, call up the context menu,
    select "Properties". The properties dialog has a button "Folder Assistant".

  * "Folder Assistant" is greyed out for Exchange 2019 servers and enabled
    for Gromox servers.

* grommunio-web only supports editing rules for the default private store
  inbox. (Settings » Rules)

* To show the rule table of any folder in MFCMAPI, select the folder in the
  hierarchy view, call up the context menu, select "Other tables » Rules
  table". MFCMAPI does not support adding any rules and also cannot edit the
  PR_RULE_ACTIONS property.


Rule processor triggers
-----------------------

* When a message is first saved into a public store folder through, the rules
  defined for that folder are executed for the message. (cf. OXORULE §1.3) This
  is lacking in gromox-zcore 2.3 and only implemented in gromox-emsmdb
  (OL/MSMAPI).

* When a message is **delivered** into a private store folder, the
  rules defined for that folder are executed for the message. "Delivery" is
  an action which implies, but is distinct from, "Save message". Delivery is
  only invoked by ``gromox-delivery`` or ``gromox-mt2exm -D``.


Rule execution caveats
----------------------

* OXORULE §1.3 pg. 11 ¶4 specifies that "the remaining rules continue to run
  against the moved message"

  * Exchange 2019 violates this OXORULE requirement. ``OP_MOVE`` action
    performs a copy of the message into the desired target folder, then
    schedules the original message for deletion. (A message sent to a private
    store inbox whose rule table has three OP_MOVEs produces three mails rather
    than one.)

  * Gromox 2.3: (same)

* OXORULE §1.3 pg. 11 ¶5 specifies that "the server will evaluate the
  destination folder rules against the moved message after evaluating the
  remaining rules in the original folder"

  * Gromox 2.3: Destination folder rules are evaluated for the new message
    immediately once the copy is made (see above). Remaining rules in the
    original folder resume later (and are applied to the original message, not
    the copy).

* Order of execution

  * Gromox 2.3: Processes the set of standard rules first (sorted by sequence
    number), then the set of extended rules (sorted by sequence number).

  * OXORULE gives some direction, but is vague: "same syntactic restrictions
    and semantic meanings of values apply as the respective property defined
    [for standard rules]" (§2.2.4)

* MOVE/COPY availability for public folder rules: OXORULE §2.2.5.1 says they
  must not be used but this is a weird arbitrary limitation; Gromox allows it
  anyway. (But it should nevertheless be used with care due to loops. Gromox
  has loop detection.)
