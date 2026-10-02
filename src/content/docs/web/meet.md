---
title: "Meet"
description: "Start video meetings with grommunio Meet from grommunio Web and add meeting links to appointments and mails."
sidebar:
  order: 76
---

**grommunio Meet** is the video conferencing service of grommunio. The **Meet** plugin connects it with grommunio Web: start a meeting with one click, or add a meeting link to an appointment so that every attendee can join from the invitation.

## Switching Meet on

1. Open **Settings › Plugins**.
2. Tick **Meet** and click **Apply**.
3. Reload grommunio Web when asked.

A **Meet** button (camera icon) appears in the toolbar, and appointments and mails get an **Add meeting** button.

## Starting a meeting

Click **Meet** in the toolbar. grommunio Meet opens in a new tab:

![grommunio Meet inside grommunio Web with a suggested room name and the Start meeting button](/img/web/web_meet.png)

1. Keep the suggested room name or enter your own.
2. Click **Start meeting**.
3. Allow your browser to use the camera and microphone.
4. Share the address of the meeting with the people you want to invite.

Recent meetings are listed below, so you can join them again quickly.

## Adding a meeting to an appointment

1. Create an appointment or meeting request.
2. Click **Add meeting** in its toolbar.

grommunio Web creates a meeting room, puts its address in the **Location** and adds an invitation with a **Join Meeting** button to the description:

![An appointment with the Meet address in the location and the grommunio Meet invitation with the Join Meeting button in the notes](/img/web/web_meet_appointment.png)

Send the invitation as usual. At the time of the meeting, everybody clicks **Join Meeting** in the invitation, or **Join webmeeting** in the toolbar of the appointment.

:::tip
Hold <kbd>Shift</kbd> while clicking **Add meeting** to choose the room name and address yourself.
:::

In a new mail, **Add meeting** inserts a meeting link into the text, for example for a spontaneous call.

## Settings

![The Meet settings](/img/web/web_settings_meet.png)

Under **Settings › Meet** you can choose:

- **Open meeting in**: a grommunio Web tab, a popup or a separate browser window,
- **Hide the button in the main toolbar**,
- whether the subject and the name of the organizer are added to the room name,
- whether the address is added to the location instead of replacing it, and whether it may be overwritten automatically (for example when you add a meeting room),
- whether an invitation is added to the description, and the text of the invitation (plain text and HTML; `%url%` stands for the meeting address).

## See also

- [Calendar › Meetings](/web/calendar/#meetings)
