---
title: "Files"
description: "Work with grommunio Files and other WebDAV storage directly in grommunio Web: browse, upload, preview, share and attach files to mails."
sidebar:
  order: 75
---

The **Files** plugin brings your file storage, for example grommunio Files, into grommunio Web. You can browse your folders, upload and preview documents, share them with others and attach them to mails without downloading them first.

## Switching Files on

1. Open **Settings › Plugins**.
2. Tick **Files Plugin** and click **Apply**.
3. Reload grommunio Web when asked.

A **Files** tab appears in the top bar. Until you add an account, it shows *There are no accounts added. Go to settings, Files tab and add an account.*

## Adding a Files account

1. Open **Settings › Files**.
2. Click **Add Account**.
3. Enter an **Account name**, for example *grommunio Files*, and choose the **Files Backend**: *Default* (WebDAV, used for grommunio Files and other WebDAV servers) or *Seafile*.
4. Enter the connection details your administrator gave you:
   - **Server address**, for example `mail.example.com`,
   - **Server port** (`443`) and **Use TLS**,
   - **Webdav base path**, for grommunio Files `/files/remote.php/webdav` (without a slash at the end).
5. Either tick **Use grommunio credentials for authentication**, or enter a **Username** and **Password**.
6. Click **Save** and **Apply**.

![The Edit Account dialog with account name, backend Default, server address, port 443, TLS and the WebDAV base path of grommunio Files](/img/web/web_files_account.png)

The account appears in the list with its status and the features it supports (quota, version information, sharing, fast up- and download). A green status means the connection works.

![The Manage Accounts list with the account grommunio Files](/img/web/web_files_settings.png)

:::tip
Your administrator can set up the Files account for you in advance. With single sign-on, grommunio Web uses your sign-in for Files, so you don't need to enter a password.
:::

## Browsing your files

Click **Files** in the top bar. The folder pane shows your accounts and their folders; the middle shows the contents of the selected folder, and the preview on the right shows the selected file.

![The Files view with the folders Aurora launch, Expo 2026, Marketing and Templates](/img/web/web_files.png)

![The folder Aurora launch with key visuals and the press release, and the preview of the selected image](/img/web/web_files_folder.png)

| Button | What it does |
|---|---|
| **Upload** | uploads files from your computer. You can also drag files into the list. |
| **Create document** | creates a new document, presentation or spreadsheet (if OnlyOffice is available). |
| **New Folder** | creates a folder. |
| **Preview** | opens the selected file in the [document viewer](/web/mail/#opening-attachments-in-the-viewer). |
| **Download** | downloads the selected files. |
| **Share** | shares the file or folder (see below). |
| **Attach to mail** | starts a new mail with the selected files attached. |
| **Attach to mail as link** | starts a new mail with a download link instead of the file. |
| **Rename**, **Delete** | rename or delete the selected item (in the ⋮ menu). |

Double-click a file to open it: office documents open in OnlyOffice if your administrator enabled it, everything else in the viewer. Right-click a file for **Info** with the details. Switch between the **List** and **Icons** view and the position of the preview with **Switch view** in the toolbar.

## Sharing files and folders

Select a file or folder and click **Share**:

- **Share with user/group**: add colleagues and decide whether they may re-share, change, create or delete.
- **Share via link**: creates a **Public link** you can send to anyone. Protect it with a **Password**, allow **Public upload** for folders, and set an **Expiration date**.

## Files in mail

- In a new mail, choose **Add attachments** › **Add from Files** to attach a file from your storage.
- Right-click an attachment in a received mail and choose **Add to Files** to save it to your storage.
- Right-click a mail and choose **Add to Files** to save the whole mail as an `.eml` file.
- Choose **New** › **Upload file** in the toolbar to upload a file from any view.
