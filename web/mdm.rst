########################
Mobile Device Management
########################

Overview
========

Mobile Device Management (MDM) is a plugin for grommunio Web. It allows
users to view the list and details of mobile devices configured to sync
the account data. MDM also enables users to issue resync, removal or
remote wipe of a specific device.

The MDM plugin is server-side enabled and always visible in the plugin list.

In order to access the plugin, select "Settings" on the top right corner of the
grommunio web Window. In the listbox then shown on the left pane, select "Mobile
Devices". The initial view shows the list of all mobile devices currently
configured to sync the account data and some additional device information:
friendly device name, device OS, first and last sync times, device id etc. The
column list and order is configurable.

.. image:: _static/img/web_mdm_devicelist.png
   :alt: MDM device list

Selecting a device opens a popup window which displays more
information about the device: number and types of synchronized folders,
grommunio sync version, current ActiveSync protocol version implemented by
grommunio sync and current provisioning policy enforced on the device.

.. image:: _static/img/web_mdm_devicedetails1.png
   :alt: MDM device details
.. image:: _static/img/web_mdm_devicedetails2.png
   :alt: MDM device details

Actions
=======

.. important::
  Be fully aware what action a particular button triggers before clicking on
  any of them, because they trigger write operations on your device and your
  grommunio store.

Wipe Device
***********

This command sets the device status to "pending wipe request". During the next request, the
device will acknowledge the request and perform the data wipe. Depending on the
vendor implementation, it is possible that the device will reboot after
performing this operation. Due to the consequences of this operation, the user
must provide his password before issuing the wipe request.

.. important::
   Vendors implemented different wipe strategies. On some, mostly Android
   devices, only the grommunio account and its data (emails, contacts, calendar
   items and so on) will be removed.

   Some iOS devices perform an entire device wipe, also removing your
   personal data, including, but not limited to, media data (photos and videos),
   apps, settings. It is comparable to a factory reset.

The wipe strategy may also depend on the provisioning policies enforced by the
domain administrator. Contact him or grommunio support if you have any doubts
about this operation **before** performing it.

Full Resync
***********

This command marks the device for full grommunio account resync. On the next request, the
device will acknowledge the request and perform, at first, the hierarchy and,
afterwards, the
content sync. Be aware that it might take some time, especially if you have a
lot of items or a lot of items with attachments in your grommunio store.

Use this functionality if you're experiencing issues with the
synchronization e.g. some items do not appear on the mobile device.

Remove Device
*************

This command will remove the saved device state from your grommunio store and the device
will also disappear from the list.

.. note::
   This action will not prevent the device from syncing your grommunio data. If
   you wish that the device also stops syncing, you have to remove your
   grommunio account from the device. Failing to remove the account on the
   device will just cause the device to perform full resync.

Refresh
*******

This command refreshes the devices list. If you set up a grommunio account on a new mobile
device after you opened the MDM plugin, selecting this button will get the
devices' information from your grommunio store and the new device will appear in
the list.
