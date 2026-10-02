---
title: "Settings"
description: "All settings of grommunio Web explained: general, mail, signatures, out of office, rules, calendar, delegates, sender lists, plugins and more."
sidebar:
  order: 70
---

Click **Settings** in the top bar to adjust grommunio Web to the way you work. The categories are listed on the left; the **Search settings** field at the top finds any option by name. Click **Apply** to save your changes or **Discard** to throw them away. If you leave the settings with unsaved changes, grommunio Web asks whether to apply them.

![The settings with the category list on the left and the General page on the right](/img/web/web_settings_general.png)

:::note
Plugins add their own categories, such as *AI Assistant*, *Files* or *Meet*, and your administrator may hide some settings. Your list may therefore look slightly different.
:::

## General

**Profile**

At the top you see your photo, name and e-mail address. Click the photo to **Upload a picture…** or to get it from **Gravatar** or **Libravatar**; a crop dialog lets you choose the visible part. **Personal information** opens your entry in the address book.

| Option | Description |
|---|---|
| **Language** | the language of the interface (needs a reload) |
| **Startup folder** | the view that opens after sign-in |
| **Theme** | the color scheme, for example *Basic*, *Teal* or *High Contrast* |
| **Appearance** | Light, Dark or System |
| **Icons** | Breeze or Classic |

**Display**

| Option | Description |
|---|---|
| **Date & Time** | short or long date format, 12-hour or 24-hour clock |
| **Favorites** | hide favorites, unpin them from the top, and show them only in Mail, in every list of the same type or in all lists |
| **Interface** | colored border for unread items, comfortable or compact list spacing, the Help button, the unread counter in the browser tab title |

**Inbox navigation**: **Infinite Scroll** (more items load as you scroll; default) or **Pagination** (items on pages), and the number of items loaded at a time.

![The rest of the General page with Inbox navigation, File previewing, Undo and redo, Address Book, Mailbox Usage and About](/img/web/web_settings_general_2.png)

**File previewing**: whether documents open in the built-in [viewer](/web/mail/#opening-attachments-in-the-viewer), the default zoom for documents and PDFs, and whether previews open in a **Dialog**, a **grommunio Web tab** or a **Browser window**.

**Undo and redo**: tick **Enable undo and redo of message actions** to use <kbd>Ctrl</kbd>+<kbd>Z</kbd> and <kbd>Ctrl</kbd>+<kbd>Y</kbd>. See [Undo and redo](/web/intro/#undo-and-redo).

**Address Book**: the address list that opens by default and whether names are shown as *Last Name, First Name* or *First Name Last Name*.

**Mailbox Usage**: how much of your mailbox quota is used.

**About**: the versions of grommunio Web and Gromox, how you are signed in and your browser, which helps your IT support. **Reset all settings to defaults** resets everything, closes the shared mailboxes you opened and reloads grommunio Web. **Migrate legacy categories** adds categories found on older items to your category list.

## Mail

![The Mail settings with general mail settings, compose settings, Cc recipients, incoming mail and notifications](/img/web/web_settings_mail.png)

**General mail settings**

- **Open or compose a mail item in a**: grommunio Web tab or browser window.
- **Location of preview pane**: No preview, Right or Bottom.
- **Use subject prefixes in accordance with RFC 5256/5322**: always use *Re:* and *Fwd:*, whatever the language.
- **Close original message on reply or forward**.
- **Show quick actions when hovering over a list item**.
- **Move items deleted in delegate's store**: to the owner's or to your own *Deleted Items*.

**Compose mail settings**

- **Compose mail in this format**: HTML or Plain Text.
- **Default font** and **Default font size**.
- **Save emails sent by delegate**: in your *Sent Items*, in the owner's, or in both.
- **Always request a read receipt**.
- **Activate attachment reminder**: warns you when your text mentions an attachment but none is attached.
- **AutoSave unsent mail every … minute(s)**.
- **Also autosave while encryption is selected**: off by default, because drafts are stored unencrypted.

**Cc recipients**: addresses that are added automatically to new mails and/or replies, for example a team mailbox.

**Incoming mail**

- **How to respond to requests for read receipts**: always, never, or ask me (default).
- **Automatically mark mail as read after … second(s)**.
- **View mail in this format**: HTML or Plain Text.

**New Mail Notifications**: show notifications for **All folders**, **Only my own mailbox** or **Only the folders I choose**.

![The rest of the Mail page with conversation view settings and signatures](/img/web/web_settings_mail_2.png)

**Conversation view settings**: **Enable conversation view**, collapse a conversation when you select another mail, and show the entire conversation in the reading pane. See [Conversation view](/web/mail/#conversation-view).

### Signatures

![The signature Anna – default with name, title and phone number, set as the signature for new messages](/img/web/web_settings_signature.png)

1. Click **New** below the list of signatures.
2. Give the signature a name, for example *Anna – default*.
3. Write the signature in the editor. You can use formatting, pictures and links.
4. Click **Save Signature**.
5. Choose which signature is added automatically to **New messages** and to **Replies/forwards**.
6. Click **Apply**.

You can insert any signature into a mail with **Add signature** in the compose toolbar.

#### Placeholders

Signatures can contain placeholders that are replaced with your details from the address book, so that one signature works for a whole team. Write the name of the field in curly brackets with a percent sign, for example `{%displayname}`:

| Placeholder | Replaced with |
|---|---|
| `{%firstname}`, `{%lastname}`, `{%initials}`, `{%displayname}` | your name |
| `{%title}`, `{%company}`, `{%department}`, `{%office}` | job title, company, department, office |
| `{%primary_email}` | your e-mail address |
| `{%phone}`, `{%phone_business}`, `{%phone_business2}`, `{%phone_mobile}`, `{%phone_home}`, `{%phone_home2}`, `{%phone_fax}`, `{%phone_pager}` | your phone numbers |
| `{%assistant}`, `{%phone_assistant}` | your assistant and their phone number |
| `{%address}`, `{%city}`, `{%state}`, `{%zipcode}`, `{%country}` | your address |

Empty fields are left out. Which details are available is maintained by your administrator.

## S/MIME

Upload your personal certificate and manage the certificates of your contacts. See [Signing & Encryption › S/MIME](/web/security/#smime).

## Out of Office

![The Out of Office settings with I am out of the office from selected and an automatic reply text](/img/web/web_settings_oof_filled.png)

1. Select **I am out of the office from** and choose the start date and time.
2. Optionally tick **I will be back on** and choose the end. grommunio Web then switches the automatic reply off by itself.
3. Write the reply for colleagues on the **Inside My Organization** tab.
4. On **Outside My Organization**, tick **Auto-reply to people outside my organization** and choose *My contacts only* or *Anyone outside my organization*, then write the text.
5. Click **Apply**.

If you are allowed to manage the out-of-office message of a shared mailbox, choose it under **Update Out of Office settings for**. When you sign in while your out-of-office reply is still active, grommunio Web asks whether you want to switch it off.

## OpenPGP

Create, import and verify OpenPGP keys and set the defaults for new mail. See [Signing & Encryption › OpenPGP](/web/security/#openpgp).

## Rules

Rules handle incoming mail automatically: they move, copy, delete, forward or mark mails as read when they meet your conditions.

![The rules list with the active rule Newsletters](/img/web/web_settings_rules_list.png)

1. Click **New**.
2. Enter a **Rule name**.
3. Under **When the message…**, choose a condition and click the underlined text to fill in the details, for example the words in the sender's address. **Add condition** adds more conditions; all of them must apply.
4. Under **Do the following…**, choose what should happen, for example *Move the message to folder…*.
5. Optionally add **Exceptions**.
6. Tick **Stop processing more rules** if later rules should not apply to these mails.
7. Click **Save**, then **Apply**.

![The rule Newsletters: mails whose sender address contains designweekly.example are moved to the Newsletters folder, and processing stops](/img/web/web_rule_dialog.png)

| Conditions | Actions |
|---|---|
| is received from…, is sent to…, is sent only to me | Move the message to folder… |
| includes these words in the sender's or recipient's address, subject, body or transport headers | Copy the message to folder… |
| has importance… / has sensitivity… / has an attachment | Delete the message |
| has my name in the To / Cc / To or Cc field | Redirect the message to… |
| is received before / after… | Forward the message to… / as attachment to… |
| size is at least / at most… | Mark the message as read… |
| is received (all messages) | |

Rules run in the order of the list; change it with **Move Up** and **Move Down**. Untick **Active** to switch a rule off without deleting it. A rule can also apply **only when Out of Office is active**, for example to forward urgent mail to a colleague while you are away.

:::tip
You can create a rule straight from a mail: right-click it › **Rules** › *Always move messages from …*.
:::

## Calendar

![The Calendar settings with working hours, resolution, default durations, multiple calendars and reminder settings](/img/web/web_settings_calendar.png)

- **General calendar settings**: first day of the week, start and end of the workday, calendar resolution, default appointment duration, default status of all-day events, working days, **Show busy dates as bold in the date picker** and **Delete the meeting request from the inbox when answering from the calendar**.
- **Calendar view settings**: show multiple calendars **side by side** or **overlaid**.
- **Reminder settings**: reminders for new appointments and the default reminder time for appointments and all-day events.

## Delegates

A delegate can work in your mailbox on your behalf, typically an assistant who manages your calendar and answers invitations for you.

![The Delegate Permissions dialog for Emma Novak with permissions for calendar, tasks, inbox, contacts, notes and journal](/img/web/web_delegate_permissions.png)

1. Click **Add…** and choose the person.
2. For each folder (Calendar, Tasks, Inbox, Contacts, Notes, Journal) choose **Owner**, **Secretary**, **Only read** or **None**.
3. Tick **Delegate receives copies of meeting-related messages sent to me** if your delegate should handle your invitations.
4. Tick **Delegate can see my private items** if they should also see private appointments.
5. Click **Ok** and **Apply**.

A delegate can send mails and invitations *on your behalf*. To change the permissions later, select the delegate and click **Permission…**.

:::note
If you only want to share a folder, without allowing anyone to send on your behalf, use **Share folder…** on the folder instead. See [Folders & Permissions](/web/folders-permissions/#sharing-a-folder).
:::

## From Addresses

![The From Addresses settings](/img/web/web_settings_fromaddresses.png)

Save the addresses you regularly send from, for example a shared mailbox, so that you can pick them in the **From** field. For each address you choose whether it is used for new mails, replies or forwards. You can only send from addresses your administrator gave you the permission for.

## Sender Lists

![The Sender Lists settings with Safe Senders, Safe Recipients and Blocked Senders](/img/web/web_settings_senderlists.png)

- **Safe Senders**: pictures and external content in mails from these addresses and domains are always shown. You add entries from a mail, via the blocked-content bar.
- **Safe Recipients**: mailing lists you subscribed to; their mails are trusted too.
- **Blocked Senders**: external content from these senders is always blocked.
- **Also trust email from my Contacts**.

The lists are the same as Outlook's junk e-mail lists, so they apply in both programs.

## Mobile Devices

The phones and tablets that synchronize with your mailbox. See [Mobile Devices](/web/mdm/).

## AI Assistant

The preferences of the AI Assistant. See [AI Assistant › Settings](/web/ai/#settings).

## Change Password

![The Change Password settings with current password, new password and confirmation](/img/web/web_settings_passwd.png)

Enter your **Current password** and the **New password** twice, then click **Apply**. A good password is long and contains upper- and lower-case letters and numbers. If you sign in through single sign-on, your administrator may manage passwords elsewhere.

## Plugins

![The Plugins settings listing the available plugins with their versions](/img/web/web_settings_plugins.png)

Switch optional plugins on or off. Some plugins are always on (*This plugin cannot be disabled*). Most changes take effect after grommunio Web reloads. An overview of all plugins is in [More Plugins](/web/plugins/).

## Keyboard Shortcuts

Choose **Keyboard shortcuts off**, **Basic keyboard shortcuts on** (default) or **Extended shortcuts on**, and see the list of all shortcuts. See [Keyboard Shortcuts](/web/keyboard/).

## Plugin settings

| Page | See |
|---|---|
| **Files** | [Files › Adding an account](/web/files/#adding-a-files-account) |
| **Chat** | **Open Chat at start**, see [Chat](/web/chat/) |
| **Template Snippets** | [Template Snippets](/web/templates/) |
| **Meet** | [Meet › Settings](/web/meet/#settings) |
| **Desktop Notifications** | [More Plugins › Desktop Notifications](/web/plugins/#desktop-notifications) |
| **Kendox InfoShare** | [More Plugins › Kendox InfoShare](/web/plugins/#kendox-infoshare) |

## Legal Information

Copyright and license notices of grommunio Web and the components it uses.
