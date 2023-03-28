..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2020-2023 grommunio GmbH

#####
Login
#####

Accessing grommunio Web
=======================

.. image:: _static/img/web_login.png
   :alt: Login page of grommunio Web
   
Login page of grommunio Web

To access grommunio Web, follow these steps:

#. Navigate to the link provided by your administrator with your browser.
   Traditionally, the link is something close to https://example.com/web or
   https://mail.example.com/web
#. Enter your username and password
#. Click on the "Sign in" button

.. image:: _static/img/web_welcome.png
   :alt: Welcome assistant of grommunio Web
   
Welcome assistant of grommunio Web

Upon your first login, you are greeted by the "Welcome Assistant" which allows
configuring some general settings, such as language, initial weekday and other
settings. These settings can later be changed in the "Settings" configuration
pane at any time.

.. note::
   The default URL of grommunio Web ends with the URL suffix `/web/`. Depending
   on configuration, this might have been changed intentionally to a different
   login URL, in which case the new prefix will be conveyed by your
   administrator.

.. important::
   While technically it is possible to login to grommunio Web with http
   (unencrypted), doing so is strongly discouraged. Note that, when using
   unencrypted HTTP, as indicated by a broken lock sign in the address bar of
   most browsers, your credentials (username and password) used for login are
   exposed and are susceptible to interception by a third party.

Welcome Assistant
=================

Overview
========

As soon as you have logged into grommunio Web, it presents an overview of your
personal interface. By default, it will navigate to the mailbox overview,
which, traditionally, is either empty, or pre-filled by data from a migration
by your administrator.

The main overview of grommunio Web is organized as follows:

1. **Main interface area**

   The main interface area contains reference to the main application areas. By
   default, these are: Mail, Calendar, Tasks, Notes, Meet and Files. On the top
   right, you find personal information, such as the indicator of the user you
   have logged in, Reminders, Settings, Help and Logout buttons.

2. **Shortcut Bar**

   The shortcut bar combines the main functions available in the application
   area you are currently in, such as creating new messages in the mail
   application area. Some of the menus provide a dropdown element which
   provides extra functionality.

3. **Folder navigation area**

   With the folder navigation area, you can see an overview of your personal
   folders, as well as any attached secondary mailboxes like public folders
   that are accessible to you.

4. **Main content area**

   The main content window provides all information of the main application
   area combined with the chosen contextual information chosen. For example, it
   shows all emails of your inbox in the mail application area when the folder
   inbox has been chosen. In many areas, there is built-in search functionality
   available which results also show up in the main content area.

Data structure
==============

Your primary groupware data is stored in a so-called "mailbox", or "mail
store". This data contains major information such as your e-mails, calendar
data, contacts, and so on. To have this managed well, the mailbox store is
hierarchially organized with folders. By default, a store includes a set of
default folders which also have various types. These are:

.. list-table:: Mailbox structure
   :widths: 25 75
   :header-rows: 1

   * - Name
     - Type
   * - Inbox
     - E-Mail
   * - Drafts
     - E-Mail
   * - Sent Items
     - E-Mail
   * - Deleted Items
     - E-Mail
   * - Tasks
     - Tasks
   * - Calendar
     - Calendar
   * - Contacts
     - Contacts
   * - Junk E-Mail
     - E-Mail
   * - Notes
     - Notes
   * - Outbox
     - E-Mail

Overall behavior
================

grommunio Web is a true web application which provides an unusually enhanced
web application feeling. With this behavior, grommunio Web provides multiple
user experience enhancements to traditional web applications, such as:

- Support for Drag & Drop of elements.
- Right-click context menus with extra functionality on objects.
- Multi-select of objects using the Ctrl key (or Cmd on Apple).
- Tabular interface handling to allow multi-tasked working.

It is important to note that, by default, the mail folders shown are
contextually visible by the current application area in use. As an example,
using the mail application area will only show mail folders as a result.

The option "Show all folders" in the folder navigation area allows to toggle
this behavior. If activated, a switch to a folder of a different application
area automatically switches to that application. For example, selecting a
calendar folder will automatically navigate to the calendar application area
and open that calendar.
