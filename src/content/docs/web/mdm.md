---
title: "Mobile Devices"
description: "See which phones and tablets synchronize with your mailbox, check their status, resynchronize them, and wipe or remove a lost device."
sidebar:
  order: 79
---

Phones and tablets that synchronize your mail, calendar and contacts with grommunio (via Exchange ActiveSync) are listed under **Settings › Mobile Devices**. Here you can check them, resynchronize them and, if a device is lost or stolen, wipe it remotely.

![The Mobile Devices settings with an iPhone and an Android device, their user agent, provisioning status and last connection](/img/web/web_settings_mobile.png)

## The device list

| Column | Meaning |
|---|---|
| **Device** | the type of device, for example *iPhone* or *Android* |
| **User Agent** | the mail app and its version |
| **Provisioning Status** | the state of the security policy, for example *Ok* or *Wipe Pending* |
| **Last Connect** | when the device last synchronized |
| **Device ID** | the unique identifier of the device |
| further columns | operating system, device information, first synchronization and who impersonated the device |

If no device synchronizes with your account, the list shows *No devices connected to your account*.

## Device details

Double-click a device to see its details:

![The details of the iPhone: connected since, last update, last connection, status and the number of synchronized folders](/img/web/web_mdm_details.png)

- **General**: when the device was first connected and last synchronized, its status, and how many folders of each type are synchronized. Under **Shared Folders**, click **Manage Shared Folders** to choose which shared folders are synchronized to the device. Shared mailboxes must be opened in grommunio Web first to appear here.
- **Details**: device type, operating system, device ID, user agent, ActiveSync version, grommunio-sync version and the policy.

![The Details tab with type, operating system, ID and versions](/img/web/web_mdm_details2.png)

## Actions

Select a device and use the buttons below the list.

### Full resync

**Full resync** resynchronizes all data on the device from scratch. Use it when the device shows outdated or missing items. Depending on the size of your mailbox, this can take a while.

### Wipe Device

If a device is lost or stolen, **Wipe Device** deletes the data on it the next time it connects. You can choose:

- **Wipe only data related to this account**: removes only your grommunio mail, calendar and contacts from the device,
- **Wipe all data**: resets the device to factory settings, deleting **everything** on it.

To confirm, enter your password, or type `WIPE` if you sign in with single sign-on:

![The confirmation dialog asking to type WIPE to wipe the device](/img/web/web_mdm_wipe.png)

:::danger
*Wipe all data* cannot be undone. Use it only for devices you are sure are lost or stolen.
:::

### Remove device

**Remove device** removes the device from the list, for example a phone you no longer use. Confirm with your password, or by typing `REMOVE` with single sign-on. If the device connects again, it reappears and synchronizes from scratch.

### Refresh

**Refresh** updates the list and the status of the devices.
