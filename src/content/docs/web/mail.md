---
title: "Mail"
description: "Read, write, answer and organize e-mail in grommunio Web: reading pane, attachments and document viewer, composing, signatures, send later, flags, categories, folders and conversations."
sidebar:
  order: 20
---

Mail is where most people spend most of their day. This chapter shows how to read and answer mail, work with attachments, write new messages and keep your mailbox organized.

## Reading mail

Select a mail in the list to show it in the reading pane. Double-click it to open it in its own tab.

![The Mail view with the inbox list and a mail from Lukas Hofer with an attachment in the reading pane](/img/web/web_mail_reading.png)

The header of the reading pane shows:

- the **subject**,
- the **sender** with photo, initials or company logo, and the time,
- the **recipients** (To, Cc),
- the **attachments**,
- the **categories** of the mail,
- information bars, for example *This message was sent with High importance* or a notice that the mail is private.

![The header of a mail with the information bar This message was sent with High importance and a PDF attachment](/img/web/web_mail_infobar.png)

Above the mail you find the actions **Reply**, **Reply All** and **Forward**, and on the right **Delete**, **More options** (⋮), **Pop-out** and the [AI Assistant](/web/ai/) (✦).

:::tip[Sender logos]
For senders whose domain publishes a verified company logo (BIMI) and whose mail passed the DMARC check, grommunio Web shows the company logo next to the sender. It helps you recognize genuine mail from well-known companies at a glance. Your own contact photos take priority.
:::

### Read and unread

A mail is marked as read as soon as you select it. You can change this under [Settings › Mail › Incoming mail](/web/settings/#mail), for example to mark mail as read only after a few seconds. To change the state yourself:

- hover over the mail and click the envelope icon,
- right-click and choose **Mark Read** or **Mark Unread**,
- or right-click a folder and choose **Mark All Messages Read**.

### Pictures and external content

To protect your privacy, grommunio Web does not load pictures from the internet in mails from unknown senders. An information bar tells you when content was blocked. Click it to:

- **Download Pictures** for this mail only,
- **Add Sender to Safe Senders List** to always show pictures from this sender,
- **Add Domain to Safe Senders List** to trust everyone from this domain.

You manage these lists under [Settings › Sender Lists](/web/settings/#sender-lists). Newsletters with embedded pictures are shown completely:

![A newsletter with a large colourful header and two article teasers displayed in the reading pane](/img/web/web_mail_newsletter.png)

### Conversation view

The conversation view groups the mails of a conversation in your Inbox, including your own replies from *Sent Items*. Switch it on under [Settings › Mail › Conversation view settings](/web/settings/#mail).

![The inbox in conversation view: the Website relaunch conversation with three participants is expanded, and the reading pane shows the messages of the conversation as cards](/img/web/web_mail_conversation.png)

- A conversation shows the number of messages and the participants. Click the arrow to expand it.
- When you select a conversation, the reading pane shows all its messages as cards, the newest first.
- Conversations are shown when the list is sorted by **Received** (newest first) and no search or filter is active. Otherwise the list is shown flat.

:::note
The conversation view needs the *Infinite Scroll* navigation (Settings › General › Inbox navigation), which is the default.
:::

### Switching the layout

Click **Switch view** in the toolbar to choose where the reading pane is shown:

![The Switch view menu with No preview, Right preview and Bottom preview](/img/web/web_mail_viewmenu.png)

## Attachments

Attachments are listed in the header of a mail with their name and size.

### Opening attachments in the viewer

Click an attachment to open it in the built-in document viewer. You don't need any other program:

![A PDF attachment opened in the document viewer with page navigation, zoom and the document outline](/img/web/web_viewer_pdf.png)

The viewer opens these formats directly in the browser:

| Type | Formats |
|---|---|
| Documents | PDF, Word (.docx, .doc, .docm, .dotx), RTF, OpenDocument text (.odt) |
| Spreadsheets | Excel (.xlsx, .xls, .xlsm, .xlsb), OpenDocument spreadsheet (.ods), CSV, TSV |
| Presentations | PowerPoint (.pptx, .ppsx, .potx), OpenDocument presentation (.odp) |
| Images | PNG, JPEG, GIF, WebP, AVIF, BMP, SVG, ICO |
| Audio and video | MP3, M4A, OGG, Opus, WAV, FLAC, MP4, WebM, MOV and more |
| Text and code | TXT, Markdown, JSON, XML, YAML, HTML (as source), CSS, JavaScript, PHP, Python, shell scripts and more |
| Mail | attached mails (.eml) including their own attachments |

![A spreadsheet attachment with the Q4 marketing budget opened in the document viewer](/img/web/web_viewer_xlsx.png)

The viewer has buttons to print, download, show the document as a presentation or in full screen, zoom, rotate and page through. Files that cannot be previewed are downloaded.

Under [Settings › General › File previewing](/web/settings/#general) you choose whether previews open in a **dialog** (default), in a **grommunio Web tab** or in a separate **browser window**, and the default zoom.

![An image attachment shown in the viewer](/img/web/web_viewer_image.png)

### The attachment menu

Right-click an attachment for more options:

![The attachment context menu with Preview, Preview in a grommunio Web tab, Preview in a browser window, Download, Download all as ZIP, Import to folder and Remove attachment](/img/web/web_mail_attachment_menu.png)

- **Preview**, **Preview in a grommunio Web tab**, **Preview in a browser window**
- **Download** saves the file.
- **Download all as ZIP** saves all attachments of the mail in one ZIP file.
- **Save selection to folder** writes the selected attachments into a folder on your computer (shown when two or more attachments are selected; Chromium-based browsers).
- **Import to folder** imports a contact card (.vcf), calendar file (.ics) or mail (.eml) into one of your folders.
- **Remove attachment** deletes the attachment from a mail that is stored in your mailbox, for example to save space. The mail itself stays unchanged. This cannot be undone.
- **Add to Files** saves the attachment to your [Files](/web/files/) storage.

:::tip[Several attachments at once]
<kbd>Ctrl</kbd>-click or <kbd>Shift</kbd>-click attachments to select several of them. You can then drag them into a mail you are writing, in another tab or window, or onto your desktop, where they arrive as one ZIP file.
:::

## Writing mail

Click **New** in the toolbar, press the **+** at the end of the tab bar, or press <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>X</kbd> with extended shortcuts. A new mail opens in its own tab:

![A new mail to Lukas Hofer with Maria Rossi in Cc, a subject, a Word document attached and a short text](/img/web/web_compose.png)

1. Enter the recipients in **To**. grommunio Web suggests addresses as you type. Separate several recipients with a semicolon or press <kbd>Enter</kbd> after each one.
2. Add more recipients in **Cc**. Click **Show Bcc field** in the toolbar for blind copies.
3. Enter a **subject**.
4. Write your text. The editor offers fonts, sizes, bold, italic, colors, lists, alignment, links, tables and images.
5. Click **Send** or press <kbd>Ctrl</kbd>+<kbd>Enter</kbd>.

### The compose toolbar

![The compose toolbar with Send, Save, Delete, Attach, Check names, Address Book, Signature, AI writing assistant, Options, flag, importance, read receipt, Bcc, From, Sign and Encrypt](/img/web/web_compose_toolbar.png)

| Button | What it does |
|---|---|
| **Send** (<kbd>Ctrl</kbd>+<kbd>Enter</kbd>) | Sends the mail. The arrow offers **Send Later**. |
| **Save** (<kbd>Ctrl</kbd>+<kbd>S</kbd>) | Saves the mail to *Drafts*. grommunio Web also saves automatically every minute. |
| **Delete** | Discards the draft. |
| **Add attachments** | Attaches files. The arrow offers *File upload*, *Attach item* and, with the Files plugin, *Add from Files*. |
| **Check names** | Resolves the names you typed against the address book. |
| **Open addressbook** | Picks recipients from the address book. |
| **Add signature** | Inserts one of your [signatures](/web/settings/#signatures). |
| **Insert Template** | Inserts a [template snippet](/web/templates/) (with the Template Snippets plugin). |
| **AI writing assistant** | Improves, shortens or translates your text, see [AI Assistant](/web/ai/#writing-with-the-ai). |
| **Add meeting** | Adds a video meeting link (with the [Meet](/web/meet/) plugin). |
| **Open options dialog** | Importance, sensitivity, read receipt. |
| **Set flag** | Flags the mail for follow-up by the recipients. |
| **High priority / Low priority** | Sets the importance. |
| **Request read receipt** | Asks the recipients to confirm that they read the mail. |
| **Show Bcc field / Show From field** | Shows the Bcc or From field. |
| **Sign / Encrypt** | Signs or encrypts the mail with S/MIME or OpenPGP, see [Signing & Encryption](/web/security/). |
| **Pop-out** | Opens the mail in its own browser window. |

### Attachments

There are several ways to attach a file:

- Drag files from your computer anywhere onto the mail. *Drop files here to attach them* appears.
- Click **Add attachments** › **File upload** and choose the files.
- Click **Add attachments** › **Attach item** to attach an item from your mailbox, such as another mail, a contact or an appointment, either as an attachment or as text.
- Click **Add attachments** › **Add from Files** to attach a file from your [Files](/web/files/) storage.

![The attachment menu with File upload, Attach item and Add from Files](/img/web/web_compose_attach_menu.png)

Pictures you drop into the text are embedded in the mail.

:::tip
Switch on the *attachment reminder* in [Settings › Mail](/web/settings/#mail). grommunio Web then warns you if your text mentions an attachment but none is attached.
:::

### Message options

Click **Open options dialog** to set the **Importance** (Low, Normal, High), the **Sensitivity** (None, Personal, Private, Confidential) and to request a **read receipt**:

![The Message Options dialog with Importance, Sensitivity and the read receipt option](/img/web/web_compose_options.png)

Sensitivity is a hint for the recipient's mail program. It does not protect the content. To protect a mail, [encrypt it](/web/security/).

### Sending later

Click the arrow next to **Send** and choose **Send Later**:

![The Send menu with Send and Send Later](/img/web/web_compose_sendmenu.png)

Choose when the mail should go out: in a number of hours, days or months, or at a specific date and time. grommunio Web confirms the time with a short sentence before you click **Send**.

![The Schedule mail to be sent out dialog with the options in hours, days, months or at a specific time](/img/web/web_compose_sendlater.png)

Until then, the mail waits in your **Outbox**, where you can still open, change or delete it.

### Sending from another address

If you may send as another person or as a shared mailbox such as *info@*, click **Show From field** and choose the address in **From**:

![A new mail with Example Info in the From field](/img/web/web_compose_from.png)

You can save frequently used sender addresses under [Settings › From Addresses](/web/settings/#from-addresses). Your administrator grants the permission to send as or on behalf of someone else.

### Drafts and autosave

grommunio Web saves the mail you are writing every minute to **Drafts**. If you close the tab or your browser crashes, you find the mail there and can continue writing. Double-click a draft to open it.

## Replying and forwarding

Select a mail and click **Reply**, **Reply All** or **Forward** above the reading pane (or right-click the mail). The answer opens in a new tab with the original mail quoted below your text:

![A reply to Hannah Schmidt with the original message quoted below](/img/web/web_mail_reply.png)

- **Reply** answers the sender only.
- **Reply All** answers the sender and all recipients.
- **Forward** sends the mail with its attachments to someone else.
- **Edit as New** (right-click) opens a copy of the mail as a new message, for example to send it again.

By default, grommunio Web closes the original mail when you reply. You can change this and the subject prefixes (RE:, FW:) in [Settings › Mail](/web/settings/#mail).

## Organizing your mail

### The context menu

Right-click a mail for everything you can do with it:

![The context menu of a mail with Open, Reply, Reply All, Forward, Delete, Mark Unread, Edit as New, Categories, Follow up, Copy/Move, Move to Junk Folder, Send to, Export as, Summarize with AI, Translate with AI, Rules, Create Appointment, Create task, Create note, Print and Options](/img/web/web_mail_contextmenu.png)

Besides the actions described in this chapter you find:

- **Send to…** to forward the mail as an attachment,
- **Export as** › *EML file(s)* or *ZIP file*, to save mails to your computer,
- **Create Appointment**, **Create task** and **Create note**, which create a new item from the mail,
- **Options** with importance, sensitivity and the **Internet Headers** of the mail, which are useful when your IT support asks for them.

### Flags and follow-up

Flag mails you still need to deal with. Hover over a mail and click the flag, or right-click the mail and choose **Follow up**:

![The Follow up submenu with due dates such as Today, Tomorrow, This week and Next week, and the Complete option](/img/web/web_mail_followup_menu.png)

Flagged mails are tinted in the list and also appear in your [To-Do List](/web/tasks/). Choose **Complete** when you are done; the flag turns into a check mark.

### Categories

Categories are colored labels for mails, appointments, contacts, tasks and notes, for example *Customer*, *Urgent* or a project name. Right-click an item and choose **Categories**:

![The Categories submenu listing Aurora launch, Website, Customer, Urgent, Personal and Expo, and Manage Categories](/img/web/web_mail_categories_menu.png)

Choose **Manage Categories** to create, rename, recolour or delete categories and to pin your favorites to the quick-access list:

![The Manage Categories dialog with the six categories, each with its color](/img/web/web_categories_dialog.png)

Categories are stored in your mailbox the way Outlook stores them, so you see the same names and colors in grommunio Web, Outlook and on your phone. A shared mailbox has its own categories.

### Notes on mails

You can attach a sticky note to a mail, for example to remember what you want to discuss. Right-click the mail and choose **Create note**. The note opens with a link to the mail:

![A new yellow sticky note with the link Note on: Partnership proposal and a short text](/img/web/web_note_linked_create.png)

Save the note. From then on, it is shown as a colored card at the top of the mail, for you and for everyone who works in the same (shared) mailbox:

![The header of the partnership proposal with the attached yellow note card](/img/web/web_mail_linkednote.png)

Click the card to open the note. The mail itself is not changed. The note is stored in the Notes folder.

### Folders and moving mail

Create your own folders to sort your mail, for example per project. Right-click a folder and choose **New Folder**. More folder options are described in [Folders & Permissions](/web/folders-permissions/).

To move or copy mails:

- drag them onto a folder (hold <kbd>Ctrl</kbd> to copy), or
- right-click and choose **Copy/Move** (<kbd>Ctrl</kbd>+<kbd>M</kbd> with extended shortcuts).

![The Copy/Move Messages dialog suggesting the folder Aurora launch for a mail from Maria Rossi](/img/web/web_mail_copymove.png)

grommunio Web remembers where you filed mail from a sender before and offers those folders as **Suggested folders** at the top of the dialog. You can also type the beginning of a folder name to jump to it. **Move** (or <kbd>Enter</kbd>) moves the mail, **Copy** copies it, **New folder** creates a folder on the spot.

### Rules

Rules sort your incoming mail automatically. Right-click a mail and choose **Rules** for quick rules such as *Always move messages from …*, or **Create rule…** for a full rule. All rules are managed under [Settings › Rules](/web/settings/#rules).

### Junk mail

Mail that the server classifies as spam lands in **Junk Email**. If a legitimate mail ends up there, right-click it and choose **Not Junk Email**. To move unwanted mail to the junk folder, right-click it and choose **Move to Junk Folder**.

### Deleting and restoring

- **Delete** (or the <kbd>Delete</kbd> key) moves mail to **Deleted Items**.
- <kbd>Shift</kbd>+<kbd>Delete</kbd> deletes mail without moving it to Deleted Items.
- Right-click *Deleted Items* and choose **Empty Deleted Items** to clean up.
- Accidentally deleted something permanently? Right-click the folder and choose **Restore items** to bring back recently deleted items.
- With [undo and redo](/web/intro/#undo-and-redo) switched on, <kbd>Ctrl</kbd>+<kbd>Z</kbd> takes back the last action.

### Printing

Select one or more mails and click **Print** in the toolbar or press <kbd>Ctrl</kbd>+<kbd>P</kbd>. grommunio Web uses the print dialog of your browser, where you can also save the mail as a PDF file.

## Shared mailboxes

When colleagues share a mailbox with you, for example a team address like *info@example.com*, it appears in your folder pane below your own mailbox. You work with it like with your own: read, reply, move and categorise. How to open a shared mailbox and how to send from it is described in [Folders & Permissions](/web/folders-permissions/#shared-mailboxes).
