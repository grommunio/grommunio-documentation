---
title: "AI Assistant"
description: "Use the AI Assistant in grommunio Web to summarize and translate mails, get suggested meetings, tasks and replies, and improve the texts you write."
sidebar:
  order: 67
---

The **AI Assistant** helps you get through your mail faster. It summarizes long mails and whole threads, translates foreign-language mail, suggests the next steps (a meeting, a task, a reply) and polishes the texts you write.

:::note[Availability]
The AI Assistant is an optional plugin. Your administrator connects it to a language model, either a cloud service or a model running in your own organization, and decides which features are available. If the ✦ button is missing, the assistant has not been set up for you. You can switch it off yourself under [Settings › Plugins](/web/settings/#plugins).
:::

:::caution[Your data]
When you use the assistant, the text of the mail is sent to the language model your organization configured. Nothing is sent before you choose an action. Ask your administrator which service is used.
:::

## The assistant in the reading pane

Select a mail and click the **AI Assistant** button (✦) at the top right of the reading pane. The arrow next to it opens the menu:

![The AI Assistant menu with Summarize, Summarize thread, Translate and Suggest actions](/img/web/web_ai_menu.png)

| Entry | What it does |
|---|---|
| **Summarize** | summarizes the selected mail in a few sentences, with the action items for you. |
| **Summarize thread** | summarizes all mails of the conversation, from the first to the latest. |
| **Translate** ▸ | translates the mail into your language or into English, German, French, Spanish, Italian, Dutch, Portuguese, Polish, Chinese or Japanese. |
| **Suggest actions** | proposes the next steps: a meeting, a task, a new contact or a reply. |

You can also right-click a mail in the list and choose **Summarize with AI** or **Translate with AI**.

### Summaries

![The summary of the partnership proposal by Claire Dubois, with the main points and two action items for Anna](/img/web/web_ai_summary.png)

The answer appears while it is being written. Below it you find:

- **Copy** to copy the text, for example into a note or a reply,
- **Regenerate** to get a new version,
- **Close**.

The length of the summaries (brief, standard or detailed) is set in [Settings › AI Assistant](#settings).

![The summary of the Website relaunch thread with the contributions of Sophie, Anna, David and Maria](/img/web/web_ai_thread_summary.png)

### Translations

![The Spanish mail of Tomás García translated into English](/img/web/web_ai_translation.png)

![The Translate submenu with My language and ten languages](/img/web/web_ai_translate_menu.png)

**My language** translates into the language set under [Settings › AI Assistant](#settings), which by default follows your interface language. The original mail is not changed.

### Suggested actions

**Suggest actions** reads the mail and proposes what to do next. Each suggestion is a button:

![Suggested actions for the partnership proposal: a meeting with Claire Dubois and Lukas Hofer, a task to send the product presentation and a draft reply](/img/web/web_ai_actions.png)

- 📅 **Meeting** opens a new meeting request with subject, date, time, location and attendees filled in from the mail.
- ✅ **Task** opens a new task with subject, notes and due date.
- 👤 **Add contact** opens a new contact with the name and e-mail address of the sender.
- ↩️ **Draft reply** writes an answer for you.

![The meeting request created from the suggestion, with subject and notes prefilled](/img/web/web_ai_action_meeting.png)

:::tip
Nothing is saved or sent automatically. Every suggestion opens a normal dialog that you check, change and then save or send yourself.
:::

### Drafting a reply

**Draft reply** shows the proposed answer first. Click **Open as reply** to turn it into a normal reply with the original mail quoted below; then edit it and send it.

![The draft reply to Lena Fischer accepting the interview request](/img/web/web_ai_draft_reply.png)

![The reply to Lena Fischer with the AI-written text above the quoted original](/img/web/web_ai_reply_compose.png)

## Writing with the AI

When you write a mail, the **AI writing assistant** button (✦) in the toolbar works on the text you have written:

![The AI writing assistant menu with Improve writing, Shorten, Expand, Change tone, Fix grammar & spelling and Translate](/img/web/web_compose_ai_menu.png)

- **Improve writing**: makes your text clearer and more fluent.
- **Shorten** / **Expand**: makes it shorter or more detailed.
- **Change tone** ▸ *Formal*, *Friendly*, *Confident*, *Concise* or *Casual*.
- **Fix grammar & spelling**: corrects mistakes without rewriting.
- **Translate** ▸ into one of the supported languages.

![The Change tone submenu of the AI writing assistant with Formal, Friendly, Confident, Concise and Casual](/img/web/web_ai_compose_tone.png)

The result appears in a window. Choose **Insert at cursor** to add it where your cursor is, or **Replace draft** to replace your text:

![The Improved draft window with the polished text and the buttons Insert at cursor, Replace draft, Copy, Regenerate and Close](/img/web/web_ai_compose_result.png)

![The mail after Replace draft with the improved text](/img/web/web_ai_compose_replaced.png)

:::note
Write some text first. The writing assistant works on your draft and does not invent a mail from nothing.
:::

## Settings

Under **Settings › AI Assistant** you can adjust the assistant to your needs:

![The AI Assistant settings with the provider, Test connection and the preferences](/img/web/web_ai_settings_test.png)

- **Provider**: which service and model your administrator configured. **Test connection** checks that it works and shows the response time.
- **Summary length**: Brief, Standard or Detailed.
- **Translate into**: the language for *My language* (automatic by default).
- **Writing tone**: the default tone of the writing assistant.
- **Stream responses as they are generated**: shows the answer while it is being written.
- **Features** and **Smart actions**: switch individual features off, for example the draft replies.

Options your administrator switched off are greyed out with the hint *Disabled by administrator*.

:::caution
AI can be wrong. Always check summaries, translations and suggested dates before you act on them, especially names, numbers and times.
:::
