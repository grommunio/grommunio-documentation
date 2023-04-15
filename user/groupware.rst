..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2022 grommunio GmbH

###################
grommunio Groupware
###################

Microsoft Outlook
=================

grommunio Accounts can be easily configured with Microsoft Outlook, as
grommunio natively supports the protocols used by Microsoft Outlook (RPC over
HTTP and MAPI/HTTP).

In this configuration setup, it is assumed no profiles have been setup so far.
If E-Mail profiles already exist on the system, new profiles and accounts can
easily be added by executing ``outlook /profiles``.

1. To add your grommunio account to your Microsoft Outlook profile, select a
   name for your profile, and select ``OK`` to confirm your profile name.

.. image:: _static/img/user_outlook_1.png
   :alt: Outlook: New profile

2. In the following dialog the Outlook profile assistant will request your
   email address. It is recommended to check "Let me set up my account
   manually", to make sure the correct protocol is chosen. Depending on the
   used Outlook version this might not be required, however depending on your
   setup, Microsoft Outlook might automatically choose a non-native protocol
   such as IMAP which comes with feature limitations.

.. image:: _static/img/user_outlook_2.png
   :alt: Outlook: Account email address

3. The following progress dialog might take a few seconds, since Outlook is now
   busy preparing your profile based on your selection.

.. image:: _static/img/user_outlook_3.png
   :alt: Outlook: Account setup progress

4. In the following dialog, you are requested to configure the account type,
   which for grommunio is ``Exchange``, as it provides native
   Exchange-compatible protocols.

.. image:: _static/img/user_outlook_4.png
   :alt: Outlook: Exchange account type

5. With the choice of ``Exchange``, Outlook now requests credentials to be able
   to automatically discover your account settings (AutoDiscover). Enter
   your credentials to continue account setup. Select ``Store login
   credentials`` to save the login credentials anytime Outlook is requesting
   access to your mailbox.

.. image:: _static/img/user_outlook_5.png
   :alt: Outlook: Entry of credentials

6. After completed setup of the account, Outlook has access to your mailbox and
   is available at start of Microsoft Outlook.

.. image:: _static/img/user_outlook_6.png
   :alt: Outlook: Account setup complete

.. note::
   Per default, the account setup will show ``Microsoft Exchange`` account
   type. The setup procedure of Microsoft Outlook with grommunio Groupware does
   not differ from a setup with Microsoft Exchange. Note as with
   Microsoft Exchange, the default profile is set up with ``Cached Exchange
   Mode``, which synchronizes your account for offline usage. grommunio
   Groupware supports ``Cached Exchange Mode``, however in some use cases, this
   might be unpreferrable and should be disabled (such as with Remote Desktop
   Servers in most cases).

.. important::
   For the groupware features of grommunio, no separate software needs to be
   installed. Howevery, the exact Microsoft Outlook setup procedure might
   differ from outlined above, depending on the version used. When setting up
   your Outlook account with grommunio Groupware in use, proceed the client
   installation as if it would be configured with Microsoft Exchange. For
   automation purpose, third party software may be used for account and profile
   creation, as long as the compatibility of the third party software includes
   Microsoft Exchange.

Android
=======

grommunio Accounts can be easily added to Android devices, as they natively
support the Microsoft Exchange ActiveSync (EAS) protocol.

1. To add your grommunio account to your Android device, navigate to
   ``Settings -> Accounts`` page, and select ``Exchange``

.. image:: _static/img/user_exchange_android_1.png
   :alt: Android: Add Exchange account

2. In the following setup dialog, enter your email address, select ``Next``

.. image:: _static/img/user_exchange_android_2.png
   :alt: Android: Configure account email address
   
3. In the following setup dialog, enter your password, select ``Next``

.. image:: _static/img/user_exchange_android_3.png
   :alt: Android: Configure account password

4. After finishing the account setup your data is being synchronized in the
   background.

Depending on the grommunio backend configuration, you might be requested to
accept a corporate policy setting to finish and accept the configuration.
Note that this (depending on your configuration) might allow system
administrators (and yourself through grommunio web) to setup specific policies
or handle the device through mobile device management. The rights you are to be
granting by this so-called provisioning step are shown in the subsequent
dialog. The possibilities of profile settings vary from Android versions and
OEM configurations (brand of mobile device).

After having setup the device, your new account will show up at ``Settings ->
Accounts``, with the possibility to setup more configuration options with your
profile (such as signatures, synchronization periods, and more). The
possibilities of configuration settings vary by Android versions and OEM
configurations (brand of mobile device).

With the configuration of your mobile device with an exchange account, your
mobile device has access to the data of your account through the personal
information manager (PIM) interface. This allows you to use your grommunio
mailbox with a variety of applications of your choice, such as a mail or
calendar application of your preference.


Apple iOS
=========

grommunio Accounts can be easily added to iOS devices (such as iPhone or iPad),
as they natively support the Microsoft Exchange ActiveSync (EAS) protocol.

1. To add your grommunio account to your iOS device, navigate to ``Settings``
   page, and select ``Mail``

.. image:: _static/img/user_exchange_iphone_1.png
   :alt: iOS: Navigate to Mail

2. In the ``Mail settings``, select ``Add Account``

.. image:: _static/img/user_exchange_iphone_2.png
   :alt: iOS: Add Account

3. In the following setup dialog, select ``Microsoft Exchange`` as account type

.. image:: _static/img/user_exchange_iphone_3.png
   :alt: iOS: Select Microsoft Exchange

4. In the following setup dialog, enter your email address, choose an account
   description, and select ``Next``

.. image:: _static/img/user_exchange_iphone_4.png
   :alt: iOS: Enter account information

5. After confirming your account information, you will be requested whether you
   want to sign-in by using Microsoft, or manually want to configure your
   account information. Since grommunio is equipped with AutoDiscover
   technology, both possibilities are available.

.. image:: _static/img/user_exchange_iphone_5.png
   :alt: iOS: Sign in via Microsoft

6. With the following dialog, your credentials (which you are requested to
   enter) could be verified correctly, and you can select which information
   should be synchronized with your iOS device, namely Mail, Contacts,
   Calendar, Reminders and Notes. After hitting ``Save`` your account setup has
   finished and your data is being synchronized in the background.

.. image:: _static/img/user_exchange_iphone_6.png
   :alt: iOS: Available synchronization data

7. After finishing the account setup your data is being synchronized in the
   background.

Depending on the grommunio backend configuration, you might be requested to
accept a corporate policy setting to finish and accept the configuration.
Note that this (depending on your configuration) might allow system
administrators (and yourself through grommunio web) to setup specific policies
or handle the device through mobile device management. The possibilities of
profile settings vary by different iOS versions.

With the configuration of your mobile device with an exchange account, your
mobile device has access to the data of your account through the personal
information manager (PIM) interface. This allows you to use your grommunio
mailbox with a variety of applications of your choice, such as a mail or
calendar application of your preference.


Apple macOS
===========

Microsoft Mail
==============

grommunio Accounts can be easily added to Microsoft Mail, as grommunio natively
supports the protocols used by Microsoft Mail.

1. To add your grommunio account to Microsoft Mail, open Microsoft Mail and
   select ``Accounts`` in the left menu and after that ``Add account`` on the
   account management pane on the right side.

.. image:: _static/img/user_msmail_1.png
   :alt: Microsoft Mail: New account

2. In the following dialog the Microsoft Mail account assistant select ``Office
   365`` account type from the list.

.. image:: _static/img/user_msmail_2.png
   :alt: Microsoft Mail: Select Office 365 account type

3. The following dialog requests the entry of the email address, which should
   be entered here, select ``Next`` to continue.

.. image:: _static/img/user_msmail_3.png
   :alt: Microsoft Mail: Account email setup

4. After a few seconds, the next dialog requests the password of the account,
   select ``Logon`` after entry.

.. image:: _static/img/user_msmail_4.png
   :alt: Microsoft Mail: Account password setup

5. After entering the credentials, Microsoft Mail will automatically (based on
   AutoDiscover technology) detect your settings after a few seconds.

.. image:: _static/img/user_msmail_5.png
   :alt: Microsoft Mail: Account discovery

6. After completed setup of the account, Microsoft Mail will confirm the
   successful account creation and synchronize all information with your
   Microsoft Windows device.

.. image:: _static/img/user_msmail_6.png
   :alt: Microsoft Mail: Account setup complete

.. image:: _static/img/user_msmail_7.png
   :alt: Microsoft Mail: Account available for use

.. note::
   Microsoft Mail will automatically store the credentials without the option
   to deselect this feature. The password hereby is stored in the Microsoft
   Windows user profile used for the account creation.

.. important::
   With the account creation in Microsoft Mail, the Windows default Apps
   ``People`` and ``Calendar`` automatically have access to the same account
   information and automatically synchronize your grommunio account with the
   Microsoft Windows device.

Mozilla Thunderbird
===================

Mozilla is a free and open-source cross-platform email and personal information
manager. grommunio fully supports Mozilla Thunderbird with its primary
protocols, IMAP(s), POP3(s), SMTP(s) as well as CalDAV(s). Additionally, with
full support for CardDAV(s) by grommunio, the official Mozilla Thunderbird
plugin named "CardBook" can be used for synchronization of contacts.

Thunderbird: E-Mail
-------------------

1. To setup an email account with Mozilla Thunderbird, choose ``File -> New ->
   Existing Mail Account...`` and fill in your personal mail account settings:

.. image:: _static/img/add-account-1.png
   :alt: Thunderbird: Set Up your existing Email Address

If you want your authentication information to be stored on your system, use
the ``Remember password`` option, so it will not prompt you the next times you
open Mozilla Thunderbird.

Press ``Continue`` when you have your confirmed your information to be correct.

.. image:: _static/img/add-account-2.png
   :alt: Thunderbird: Set Up your existing Email Address, detailed information automatically detected.

2. The summary page will provide you with the functionality available for
   Mozilla Thunderbird. During configuration, the warning ``Configuration
   found, but no addons known to handle the config`` might show up. You can
   safely ignore this hint, since Mozilla Thunderbird does not understand all
   protocols available by grommunio, which is the reason for this warning to
   show up. Mozilla Thunderbird automatically detects the correct mail server
   information for you and sets the protocol encryption for you. With the
   choice of your favorite protocol, select ``Done`` and your account is setup.

Thunderbird: Calendar
---------------------

1. To setup a calendar account with Mozilla Thunderbird, choose ``File ->
   New -> Calendar...`` and select ``On the Network`` as the location of your
   calendar.

.. image:: _static/img/caldav-add-account-1.png
   :alt: Thunderbird: Setup your remote calendar account (CalDAV)

2. In the upcoming dialog choose ``CalDAV`` as Format, enter your Username and
   set the location appropriately. Per default, your personal Calendar is
   reachable under "https://<Server URL>/dav/calendars/<Username>/<Calendar
   Name>". If you do not have this information, contact your
   administrator to provide you with this information accordingly. In most
   cases, the server URL matches your grommunio Web URL. Checking the checkbox
   ``Offline Support`` will make sure you can access your calendar information
   also without an active connection to your provider.

.. image:: _static/img/caldav-add-account-2.png
   :alt: Thunderbird: Setup remote calendar information

.. note::
   Since grommunio support multiple calendars in a Mailbox, the <Calendar Name>
   is needed to be specified explicitly. Note that this URL is sensitive
   to correct spelling, which means a users mailbox' calendar is most likely to
   be named ``Kalender`` in german, for example.

3. The next dialog in the CalDAV account setup will give you options to setup
   your Calendar account, such as giving it a specific name, color and activate
   reminders. It is recommended to choose the corresponding email account
   correctly - This ensures appointment handling is matching the correct
   calendar/mailbox pairing.

.. image:: _static/img/caldav-add-account-3.png
   :alt: Thunderbird: Personal configuration of remote calendar

4. As final dialog you will be presented to provide your credentials to be able
   to access your calendar. You can identify being connected to the correct
   server URL by seeing the prompt: ``The site says: "grommunio dav"``.
   Use the same credentials as with your email account to access your calendar
   information.

.. image:: _static/img/caldav-add-account-4.png
   :alt: Thunderbird: Authentication for remote calendar

Thunderbird: Contacts
---------------------

1. To setup a contacts account with Mozilla Thunderbird, it is first required
   to install a plugin with Mozilla Thunderbird. The well-known plugin
   "CardBook" is fully tested and supported with grommunio, and available at
   the following location:
   `https://addons.thunderbird.net/de/thunderbird/addon/cardbook/
   <https://addons.thunderbird.net/de/thunderbird/addon/cardbook/>`_.
   Download the plugin and install it, to make your Mozilla Thunderbird
   installation to support contacts management based on the vCARD standard. To
   install it, you need to download and install the plugin (an XPI archive) or
   download it directly within Mozilla Thunderbird via ``File -> Add-Ons`` and
   search for the Add-on ``CardBook`` and select ``Add to Thunderbird``. It
   will be automatically installed and with installation it will request you
   for the necessary permissions, which need to be accepted for proper
   operation of the plugin.

.. image:: _static/img/carddav-add-account-1.png
   :alt: Thunderbird: Installation of CardBook plugin

2. After installation, choose the CardBook Tab from Mozilla Thunderbird,
   and within CardBook, choose ``Addressbook -> New Adressbook`` and select
   ``Remote`` as address book location and select ``Next >``.

.. image:: _static/img/carddav-add-account-2.png
   :alt: Thunderbird: Selection of remote address book

3. For setting up your grommunio Contacts folder, choose ``CardDAV`` as your
   remote address book type. Per default, your personal Calendar is reachable
   under "https://<Server URL>". In most cases, the server URL matches your
   grommunio Web URL. After entering your credentials (Username and Password)
   you can validate your correct configuration with the button ``Validate``.

.. image:: _static/img/carddav-add-account-3.png
   :alt: Thunderbird: Setup of remote address book (CardDAV)

4. After successful validation, select ``Next >`` to continue your address book
   configuration.

.. image:: _static/img/carddav-add-account-4.png
   :alt: Thunderbird: Validation of remote address book configuration

5. The final dialog will give you options to setup your address book account,
   such as giving it a specific name and color. Checking the checkbox ``Work
   Offline`` will make sure you can access your calendar information also
   without an active connection to your provider.

.. image:: _static/img/carddav-add-account-5.png
   :alt: Thunderbird: Personal configuration of remote address book

Evolution
=========

grommunio Web
=============

grommunio Web provides the primary web interface for accessing your mailbox and
other communication tools with just a browser.

.. important::
   For grommunio Web, we have crafted a dedicated standalone documentation,
   which you can find here: `grommunio Web documentation
   <https://docs.grommunio.com/web>`_

.. note::
   This documentation is also referenced directly from grommunio Web, which
   allows your users to use the most recent version of the documentation
   online.
