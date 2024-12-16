..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2024 grommunio GmbH

Search
======

Different search results
------------------------

Outlook and g-web use different search filters (MAPI restrictions)
under different circumstances, so it is possible they yield different
results.

Default restriction of Outlook (online mode) when Quick Search (DE:Sofortsuche)
is used on Inbox (22 conditions, OR-ed):

* 19 properties tested for the user-defined search terms:
	* 0037001fh PR_SUBJECT
	* 0042001fh PR_SENT_REPRESENTING_NAME
	* 0065001fh PR_SENT_REPRESENTING_EMAIL_ADDRESS
	* 0c1a001fh PR_SENDER_NAME
	* 0c1f001fh PR_SENDER_EMAIL_ADDRESS
	* 0e02001fh PR_DISPLAY_BCC
	* 0e03001fh PR_DISPLAY_CC
	* 0e04001fh PR_DISPLAY_TO
	* 1000001fh PR_BODY
	* PSETID_Appointment,LID=8208h PidLidLocation
	* PSETID_Common,LID=85a4h PidLidToDoTitle
	* PSETID_Sharing,LID=8a04h PidLidSharingRemotePath
	* PSETID_Sharing,LID=8a05h PidLidSharingRemoteName
	* PSETID_Sharing,LID=8a07h PidLidSharingInitiatorName
	* PSETID_Sharing,LID=8a0fh PidLidSharingLocalName
	* PSETID_Sharing,LID=8a2fh PidLidSharingRemoteComment
	* PSETID_Sharing,LID=8a51h PidLidSharingBrowseUrl
	* PS_PUBLIC_STRINGS,NAME=Keywords (Categories)
	* PSETID_UnifiedMessaging,NAME=UMAudioNotes
* 3 instances of a contradictory (nonsensical) condition:
  ``RES_AND{RES_EXIST{PR_LAST_MODIFCATION_TIME},
  RES_NOT{RES_EXIST{PR_LAST_MODIFICATION_TIME}}}``

Default restriction of Outlook (online mode) for quick search in the trash
folder (44 conditions):

* 19+3 from above, plus 22 more properties:
	* 3001001fh PR_DISPLAY_NAME
	* 3a08001fh PR_BUSINESS_TELEPHONE_NUMBER
	* 3a09001fh PR_HOME_TELEPHONE_NUMBER
	* 3a16001fh PR_COMPANY_NAME
	* 3a17001fh PR_COMPANY_NAME
	* 3a18001fh PR_DEPARTMENT_NAME
	* 3a1b001fh PR_BUSINESS2_TELEPHONE_NUMBER
	* 3a1c001fh PR_MOBILE_TELEPHONE_NUMBER
	* PSETID_Address,LID=8005h PidLidFileUnder
	* PSETID_Address,LID=801ah PidLidHomeAddress
	* PSETID_Address,LID=801bh PidLidWorkAddress
	* PSETID_Address,LID=801ch PidLidOtherAddress
	* PSETID_Address,LID=802ch PidLidYomiFirstName
	* PSETID_Address,LID=802dh PidLidYomiLastName
	* PSETID_Address,LID=802eh PidLidYomiCompanyName
	* PSETID_Address,LID=8083h PidLidEmail1EmailAddress
	* PSETID_Address,LID=8093h PidLidEmail2EmailAddress
	* PSETID_Address,LID=80a3h PidLidEmail3EmailAddress
	* PSETID_Task,LID=811fh PidLidTaskOwner
	* PSETID_Common,LID=8539h PidLidCompanies
	* PSETID_Common,LID=853ah PidLidContacts
	* PSETID_Log,LID=8700h PidLidLogType

If OL detects PR_CI_SEARCH_ENABLED on the store, it instead uses:

* 1 property tested for the user-defined search terms
	* 0eaf001fh PR_SEARCH_ALL_INDEXED_PROPS

If OL is to search the entire mailbox, further conditions are added:

* message class must be one of: ``IPM.Document``, ``IPM.Note``,
  ``IPM.Post``, ``IPM.Recall``, ``IPM.Schedule``, ``IPM.Sharing``,
  ``IPM.TaskRequest`` ``REPORT``

When using the "Extended Search" (DE:Erweiterte Suche) dialog in OL,
PR_SEARCH_ALL_INDEXED_PROPS is not used.

Outlook (Cached Mode) might yet use another filter.

Default filter of grommunio-web:

* 41 properties across 8 classes:
	* 37001fh PR_SUBJECT
	* 42001fh PR_SENT_REPRESENTING_NAME
	* 65001fh PR_SENT_REPRESENTING_EMAIL_ADDRESS
	* c1a001fh PR_SENDER_NAME
	* c1f001fh PR_SENDER_EMAIL_ADDRESS
	* e03001fh PR_DISPLAY_CC
	* e04001fh PR_DISPLAY_TO
	* 1000001fh PR_BODY
	* 3001001fh PR_DISPLAY_NAME
	* 3a02001fh PR_CALLBACK_TELEPHONE_NUMBER
	* 3a05001fh PR_GENERATION
	* 3a08001fh PR_BUSINESS_TELEPHONE_NUMBER
	* 3a09001fh PR_HOME_TELEPHONE_NUMBER
	* 3a16001fh PR_COMPANY_NAME
	* 3a1a001fh PR_PRIMARY_TELEPHONE_NUMBER
	* 3a1b001fh PR_BUSINESS2_TELEPHONE_NUMBER
	* 3a1c001fh PR_MOBILE_TELEPHONE_NUMBER
	* 3a1d001fh PR_RADIO_TELEPHONE_NUMBER
	* 3a1e001fh PR_CAR_TELEPHONE_NUMBER
	* 3a1f001fh PR_OTHER_TELEPHONE_NUMBER
	* 3a21001fh PR_BEEPER_TELEPHONE_NUMBER
	* 3a23001fh PR_PRIMARY_FAX_NUMBER
	* 3a24001fh PR_BUSINESS_FAX_NUMBER
	* 3a25001fh PR_HOME_FAX_NUMBER
	* 3a2c001fh PR_TELEX_NUMBER
	* 3a2e001fh PR_ASSISTANT_TELEPHONE_NUMBER
	* 3a2f001fh PR_HOME2_TELEPHONE_NUMBER
	* 3a45001fh PR_DISPLAY_NAME_PREFIX
	* 3a4b001fh PR_TTYTDD_PHONE_NUMBER
	* 3a57001fh PR_COMPANY_MAIN_PHONE_NUMBER
	* PSETID_Address,LID=8005h PidLidFileUnder
	* PSETID_Address,LID=801ah PidLidHomeAddress
	* PSETID_Address,LID=801bh PidLidWorkAddress
	* PSETID_Address,LID=801ch PidLidOtherAddress
	* PSETID_Address,LID=8083h PidLidEmail1EmailAddress
	* PSETID_Address,LID=8093h PidLidEmail2EmailAddress
	* PSETID_Address,LID=80a3h PidLidEmail3EmailAddress
	* PSETID_Task,LID=33055 PidLidTaskOwner
	* PSETID_Appointment,LID=33288 PidLidLocation
	* PSETID_Common,LID=34105 PidLidCompanies
	* PS_PUBLIC_STRINGS,NAME=Keywords (Categories)
* Classes:
	* IPM.Appointment, IPM.Contact, IPM.DistList, IPM.Note (standard
	  message), IPM.Schedule, IPM.StickyNote, IPM.Task, REPORT.IPM.Note
* Class selection thus skips over e.g. (non-exhaustive list):
	* IPM.Activity (journal), IPM.Post (public folder post), SMIME messages
* Since BCC is not on the list, Drafts with an otherwise matching BCC entry
  would get skipped

The MFCMAPI utility can be used to inspect the search criteria (filter).

.. image:: _static/img/mfcmapi_searchcrit.png
