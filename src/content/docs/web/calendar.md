---
title: "Calendar"
description: "Plan appointments and meetings in grommunio Web: calendar views, recurring appointments, invitations, scheduling with free/busy, room booking, responses and shared calendars."
sidebar:
  order: 30
---

The calendar shows your appointments, meetings and events. You can plan meetings with colleagues, book meeting rooms, see when others are available and look at shared calendars side by side.

![The calendar in the work week view with color-coded appointments from Monday to Friday](/img/web/web_cal_workweek.png)

## The calendar window

On the left, a **date picker** shows the current month. Click a day to jump to it, or **Today** to come back. Days with appointments are shown in bold. Below the date picker you find your calendars and those that others share with you; tick a calendar to show it.

The toolbar switches between the views:

![The calendar toolbar with New, Address Book, Refresh, Print and the view buttons Day, Workweek, Week, Month and List](/img/web/web_cal_toolbar.png)

| View | Shows |
|---|---|
| **Day** | one day, hour by hour |
| **Workweek** | your working days (Monday to Friday by default) |
| **Week** | the whole week |
| **Month** | a whole month at a glance |
| **List** | all appointments of the selected period as a list |

Use the arrows next to the date range above the calendar to move back and forward. The red line marks the current time; your working hours have a lighter background.

![The month view of October with recurring meetings, the business trip and Digital Expo Vienna](/img/web/web_cal_month.png)

Appointments are shown in the color of their [category](/web/mail/#categories), or in the color of the calendar. A circular arrow marks a recurring appointment. Hover over an appointment to see the details:

![The card that appears when hovering over the Aurora launch review appointment, with time, location and category](/img/web/web_cal_tooltip.png)

![The day view of today](/img/web/web_cal_day.png)

![The list view with all appointments, their start and end, location and categories](/img/web/web_cal_list.png)

## Appointments

### Creating an appointment

- double-click a time slot in the calendar,
- select a time range with the mouse and double-click it, or
- click **New** in the toolbar.

The appointment opens in its own tab:

![The appointment Aurora launch review with subject, location, start and end time, Show as, reminder and notes](/img/web/web_cal_appointment.png)

| Field | Purpose |
|---|---|
| **Subject** | The title of the appointment. |
| **Location** | Where it takes place, for example a room or an address. A web address in this field can be opened with one click. |
| **Time / until** | Start and end. Tick **All Day Event** for events without a time, such as holidays or trade fairs. |
| **Show as** | How the time appears to others: Free, Tentative, Busy, Out of Office or Working Elsewhere. |
| **Reminder** | Whether and how long before the start you are reminded. |
| **Create in** | The calendar the appointment is saved in, shown in its color (if you have more than one). |
| **Notes** | Any text, pictures or links. |
| **Attachments** | Files belonging to the appointment. |

The toolbar of the appointment offers **Save & Close**, **Delete**, **Add attachment**, **Print**, **Recurrence**, **Invite attendees**, **High/Low priority**, **Categories** and **Private**. A private appointment shows only as busy to others, even if they may see your calendar.

### Changing and moving appointments

- Drag an appointment to another time or day to move it. Drag its lower edge to change its length.
- Hold <kbd>Ctrl</kbd> while dragging to **copy** the appointment.
- Double-click an appointment to open and edit it.
- Right-click an appointment for more options:

![The context menu of an appointment with Open, Copy/Move, Delete, Mark Unread, Categories, Show as, Send to, Export as and Options](/img/web/web_cal_contextmenu.png)

Appointments that are new to you, for example invitations you have not looked at, are shown in **bold**. Right-click and choose **Mark Read** or **Mark Unread** to change this.

### Recurring appointments

Click **Recurrence** in the toolbar of an appointment to repeat it:

![The Recurrence dialog with the time of the appointment, the recurrence pattern and the range of recurrence](/img/web/web_cal_recurrence.png)

1. Set the start and end time of each occurrence.
2. Choose the pattern: **Daily**, **Weekly**, **Monthly** or **Yearly**, with the details, for example *every 2 weeks on Wednesday*.
3. Choose when the series ends: never, after a number of occurrences or on a date.

When you open or delete a recurring appointment, grommunio Web asks whether you mean this occurrence only or the whole series.

## Meetings

A meeting is an appointment with other people. They receive an invitation they can accept or decline, and you see their answers.

### Inviting people

1. Create an appointment and click **Invite attendees**, or choose **New** › **Meeting request**.
2. Enter the attendees in **To**, or click **To:** to pick them from the address book.
3. Fill in the subject, location and time.
4. Click **Send**.

![A new meeting request Aurora pricing workshop to Lukas Hofer, Sophie Wagner and Meeting Room Alpine with a short invitation text](/img/web/web_cal_meeting_new.png)

In the address book, attendees can be added as **Required**, **Optional** or **Resource** (rooms and equipment):

![The address book for meeting attendees with Lukas Hofer and Sophie Wagner as Required and Meeting Room Alpine as Resource](/img/web/web_cal_addressbook_room.png)

### Finding a time that suits everyone

Open the **Scheduling** tab to see the availability of all attendees, side by side:

![The Scheduling tab with the attendees on the left, their free/busy times for the selected day and suggested times on the right](/img/web/web_cal_scheduling.png)

- Colored bars show when someone is **busy**, **tentative**, **out of office** or **working elsewhere**.
- The green and red lines mark the start and end of your meeting. Drag them, or change the time at the top.
- **Suggested Times** on the right lists times when everybody is free. Click one to take it.
- **Show only working hours** hides the night.
- Add more attendees in the field below the list. Right-click an attendee to make them required, optional or a resource.

### Booking a meeting room

Rooms and equipment such as projectors are listed in the address book like people, with their own icon. Add a room as a **Resource** to your meeting:

- in the address book, select the room and click **Resource:**, or
- in the Scheduling tab, add the room and right-click it › **Set as resource**.

grommunio Web enters the room in the **Location** field. When you send the meeting, the room is booked. If the room is set up to accept invitations automatically, it accepts free times and declines conflicting ones. You see its answer in the [tracking](#tracking-responses).

:::note[For administrators]
Rooms and equipment are created as shared mailboxes of type *Room* or *Equipment* in grommunio Admin. In the room's account settings, enable the automatic processing of meeting requests (accept conflict-free requests, decline conflicts and, if you want, recurring requests).

grommunio Web books rooms directly in their calendar (`ENABLE_DIRECT_BOOKING`, on by default). For this, users need write access to the room's calendar: give the **Default** user at least the *Author* role with *Full Details* in the permissions of the room calendar. Otherwise sending a meeting with this room fails with *Could not save message (MAPI_E_NOT_FOUND)*.
:::

### Answering an invitation

Invitations arrive in your Inbox. The reading pane shows the date, time and location and the buttons to answer:

![The meeting request Aurora pricing workshop in the inbox of Lukas Hofer with the Accept, Tentative, Decline and Propose New Time buttons](/img/web/web_cal_request_received.png)

- **Accept**, **Tentative** or **Decline**: grommunio Web asks whether you want to edit the response before sending, send it right away, or not send a response at all.
- **Propose New Time** suggests another time to the organiser.

![The dialog asking whether to edit the response, send it now or not send a response](/img/web/web_cal_request_response.png)

Accepted and tentative meetings are added to your calendar. You can also answer from the calendar itself; under [Settings › Calendar](/web/settings/#calendar) you can choose to delete the invitation from your Inbox when you do.

### Tracking responses

The answers of your attendees arrive as mails in your Inbox, for example *Accepted: Aurora pricing workshop*:

![The inbox of Anna Berger with the accepted and tentative responses of Lukas Hofer and Sophie Wagner](/img/web/web_cal_responses_inbox.png)

Open the meeting in your calendar and click the **Tracking** tab to see everybody's answer in one place:

![The Tracking tab listing the organiser, the required attendees with their responses and the room as accepted resource](/img/web/web_cal_tracking.png)

### Changing or canceling a meeting

Open the meeting, make your changes and click **Send** to send the update to all attendees. To cancel a meeting, open it and click **Cancel invitation**, or delete it from your calendar. grommunio Web asks whether to send a cancellation to the attendees. They see the cancellation in their Inbox and can remove the meeting from their calendar with one click.

## Shared calendars

You can look at calendars of colleagues who have shared them with you, for example your manager's or a team calendar.

1. Click **Add Shared Calendar +** below the calendar list.
2. Enter the name of the colleague and press <kbd>Enter</kbd>.
3. Click **Open**.

![The Open Shared Folders dialog with Lukas Hofer as name and Calendar as folder type](/img/web/web_cal_shared_dialog.png)

The shared calendar appears in your list. Tick or untick it to show or hide it. With several calendars visible, grommunio Web shows them **side by side**:

![The own calendar and the calendar of Lukas Hofer side by side](/img/web/web_cal_shared_side.png)

Click the arrow on the tab of a calendar to **overlay** it onto the others. Both calendars are then shown in one column, each in its color:

![The own calendar and the calendar of Lukas Hofer overlaid in one column](/img/web/web_cal_shared_overlay.png)

You can make overlay the default under [Settings › Calendar](/web/settings/#calendar). What you see in a shared calendar depends on the permissions you have: only free/busy times, also subjects and locations, or all details. How to share your own calendar is described in [Folders & Permissions](/web/folders-permissions/#sharing-a-folder).

:::tip
To give an assistant full access to your calendar, including answering invitations for you, make them a [delegate](/web/settings/#delegates).
:::

## Printing the calendar

Click **Print** in the toolbar to print the day, work week, week or month you are looking at. The printout shows the period, your appointments and when and by whom it was printed.

## Reminders

When you create an appointment, grommunio Web sets a reminder 15 minutes before the start. You can change the default under [Settings › Calendar](/web/settings/#calendar). When a reminder is due, the **Reminders** window opens; see [Reminders and notifications](/web/intro/#reminders-and-notifications).
