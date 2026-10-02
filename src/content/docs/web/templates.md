---
title: "Template Snippets"
description: "Insert ready-made text blocks into mails, appointments, contacts, tasks and notes with the Template Snippets plugin, and create your own templates."
sidebar:
  order: 74
---

If you write the same text again and again, such as an acknowledgement, directions to your office or a product description, save it as a **template**. With the **Template Snippets** plugin you insert it with two clicks.

There are two kinds of templates:

- **System Templates** are provided by your organization for everybody, for example official wordings. You cannot change them.
- **User Templates** are your own.

## Switching Template Snippets on

1. Open **Settings › Plugins**.
2. Tick **Template Snippets** and click **Apply**.
3. Reload grommunio Web when asked.

## Inserting a template

1. Place the cursor where the text should go, in a mail, appointment, contact, task or note.
2. Click the arrow next to **Insert Template** in the toolbar.
3. Choose the template.

![The Insert Template menu with the system templates Acknowledgement of Receipt, Meeting follow-up and Product information Aurora and the user template Meeting confirmation](/img/web/web_templates_menu.png)

The menu lists the system templates first and then your own templates. The text is inserted at the cursor, formatted in HTML mails and as plain text in plain-text mails.

![A new mail to Claire Dubois with the inserted template text](/img/web/web_templates_inserted.png)

## Creating your own templates

1. Open **Settings › Template Snippets**.
2. Under **User Templates**, click **New**.
3. Enter a name and write the text in **HTML Content**. You can use bold text, lists and links.
4. Optionally click **Convert HTML to Plain Text** to create the plain-text version, or edit **Plain Text Content** yourself.
5. Click **Save Template** and **Apply**.

![The Template Snippets settings with the system templates and the user template Meeting confirmation](/img/web/web_templates_settings.png)

To change a template, select it, edit it and click **Save Template** again. **Delete** removes the selected template.

:::note[For administrators]
System templates are JSON files in `/var/lib/grommunio-web/templates` (see `PLUGIN_TEMPLATESNIPPETS_SYSTEM_DIR`), each with a `name`, an `html` and a `text` version. Users listed in `PLUGIN_TEMPLATESNIPPETS_ADMIN_USERS` can also create and edit system templates directly in the settings.
:::
