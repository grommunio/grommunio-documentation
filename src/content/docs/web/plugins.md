---
title: "More Plugins"
description: "All plugins of grommunio Web at a glance, and how to use Desktop Notifications, Intranet sites, the map in contacts and Kendox InfoShare."
sidebar:
  order: 80
---

Plugins add features to grommunio Web. Your administrator decides which plugins are installed and which are switched on for you; you can switch optional plugins on and off yourself under **Settings › Plugins**:

![The Plugins settings with checkboxes for the optional plugins and their versions](/img/web/web_settings_plugins.png)

Tick or untick a plugin and click **Apply**. grommunio Web reloads to load or unload it. Plugins marked *This plugin cannot be disabled* are always on.

## Overview

| Plugin | What it adds | Read more |
|---|---|---|
| **AI Assistant** | summaries, translations, suggested actions and writing help | [AI Assistant](/web/ai/) |
| **Archive** | the *Archive* tab to search grommunio Archive | [Archive](/web/archive/) |
| **Change Password** | the *Change Password* settings page (always on) | [Settings](/web/settings/#change-password) |
| **Chat** | the *Chat* tab with grommunio Chat | [Chat](/web/chat/) |
| **Desktop Notifications Plugin** | notifications of your operating system for new mail and reminders | [below](#desktop-notifications) |
| **Files Plugin** | the *Files* tab and files in mail | [Files](/web/files/) |
| **Intranet** | tabs for web pages of your organization | [below](#intranet) |
| **Kendox InfoShare plugin** | archiving mails into Kendox InfoShare | [below](#kendox-infoshare) |
| **Meet** | video meetings with grommunio Meet | [Meet](/web/meet/) |
| **Mobile device management** | the *Mobile Devices* settings page (always on) | [Mobile Devices](/web/mdm/) |
| **OpenPGP Plugin** | signing and encryption with OpenPGP | [Signing & Encryption](/web/security/#openpgp) |
| **Openstreetmap** | the *Map* tab for contacts and address book entries | [below](#maps) |
| **S/MIME Plugin** | signing and encryption with S/MIME certificates | [Signing & Encryption](/web/security/#smime) |
| **Template Snippets** | reusable text blocks | [Template Snippets](/web/templates/) |

## Desktop Notifications

With the **Desktop Notifications Plugin**, new mail and reminders are also announced by your operating system, even when the grommunio Web tab is in the background.

1. Switch the plugin on under **Settings › Plugins** and reload.
2. Open **Settings › Desktop Notifications** and click **Request Permissions**. Allow notifications when your browser asks.
3. Choose what you want to be notified about.

![The Desktop Notifications settings](/img/web/web_settings_desktopnotifications.png)

| Option | Description |
|---|---|
| **Enable desktop notifications for new mail** | a notification for every new mail |
| **Enable desktop notifications for reminders** | a notification for every due reminder |
| **Auto-hide desktop notification after … second(s)** | how long a notification stays visible |
| **Disable sound** | notifications without sound |

Desktop notifications work in Chrome, Edge and Firefox. Which folders trigger notifications is set under [Settings › Mail › New Mail Notifications](/web/settings/#mail).

## Intranet

The **Intranet** plugin adds tabs to the top bar that open web pages of your organization inside grommunio Web, for example the intranet, a wiki or a ticket system. Your administrator configures the names and addresses of the tabs:

![The top bar with two additional tabs added by the Intranet plugin](/img/web/web_intranet_tabs.png)

Some web sites do not allow to be shown inside another application. They cannot be used as intranet tabs.

## Maps

The **Openstreetmap** plugin adds a **Map** tab to contacts and to the details of address book entries. It shows the home, business and other addresses on an OpenStreetMap map; click a marker to see which address it is. See [Contacts › Map](/web/contacts/#map).

To find the position of an address, it is sent to the geocoding service of OpenStreetMap.

## Kendox InfoShare

Organizations that use the document management system **Kendox InfoShare** can archive mails into it straight from grommunio Web:

1. Right-click a mail and choose **Archive to InfoShare...**.
2. Choose what to archive:
   - **Everything - Store mail in original format**,
   - **Email only - Store mail without attachments**, or
   - **Separate - Store attachments separately**, then select the attachments.
3. Click **Start archive** and complete the archiving in the Kendox dialog that opens.

The limits for the number and size of attachments and the Kendox environment are set under **Settings › Kendox InfoShare** and by your administrator.
