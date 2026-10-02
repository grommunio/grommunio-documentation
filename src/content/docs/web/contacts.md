---
title: "Contacts"
description: "Manage your contacts and distribution lists in grommunio Web, use the address book of your organization and see addresses on a map."
sidebar:
  order: 40
---

Contacts holds the people you work with outside your organization: customers, partners, suppliers, and anybody else you want to keep. Colleagues are listed automatically in the **address book** of your organization. You don't need to add them as contacts.

![The contacts in the phone list view with name, e-mail and phone numbers of Claire Dubois, Tomás García and other contacts](/img/web/web_contacts_list.png)

## Views

Click **Switch view** in the toolbar to choose how contacts are shown:

![The Switch view menu with Business Cards and Phone List](/img/web/web_contacts_viewmenu.png)

- **Phone List**: a table with name, e-mail, phone numbers and categories. Click a column header to sort.
- **Business Cards**: one card per contact. Use the letters on the right to jump to contacts by their initial.

![The business card view with cards for Yuki Tanaka, Hannah Schmidt, Peter Lindqvist, Sarah Klein and others](/img/web/web_contacts_cards.png)

Use the **Search…** box to find a contact by name, company, e-mail address or phone number.

## Adding a contact

1. Click **New** in the toolbar, or choose **New** › **Contact** from any view.
2. Enter the details on the **General**, **Details** and **Map** tabs.
3. Click **Save & Close**.

![The contact Claire Dubois with name, company, job title, phone numbers, business address, e-mail and photo](/img/web/web_contact_general.png)

### General

| Field | Notes |
|---|---|
| **Full Name** | Click the button to enter title, first, middle and last name and suffix separately. |
| **Company**, **Job Title** | Shown in the list and on the business card. |
| **File as** | How the contact is sorted, for example *Dubois, Claire* or *Claire Dubois*. |
| **Phone Numbers** | Four fields. Use the drop-down next to each field to choose the type: Business, Home, Mobile, Business Fax and many more. |
| **Addresses** | Business, Home and Other address. Click the button to enter street, city, postal code and country separately. |
| **Email** | Up to three e-mail addresses (Email, Email 2, Email 3), each with a display name. |
| **Webpage**, **IM Address** | The web page and instant messaging address. |
| **Photo** | Click the picture to upload a photo of the contact. |
| **Additional information** | Free notes. |
| **Attachments** | Files belonging to the contact. |

### Details

![The Details tab with department, office, profession, nickname, manager, assistant, partner, birthday and anniversary](/img/web/web_contact_details.png)

The **Details** tab holds more personal and business information: department, office, profession, nickname, manager's and assistant's name, spouse or partner, **birthday** and **anniversary**.

:::tip
When you enter a birthday or an anniversary, grommunio Web adds a yearly all-day event to your calendar, for example *Claire Dubois's Birthday*.
:::

### Map

The **Map** tab shows the addresses of the contact on a map (OpenStreetMap). Use the **+** and **−** buttons or the mouse wheel to zoom, and drag the map to move it.

![The Map tab of Claire Dubois with a marker on 20 Place Bellecour in Lyon](/img/web/web_contact_map.png)

:::note
The Map tab is provided by the *Openstreetmap* plugin. To find an address on the map, grommunio Web sends it to the OpenStreetMap geocoding service.
:::

### The contact toolbar

**Save & Close**, **Delete**, **Add attachment**, **Print**, **Send email** to the contact, **Categories** and **Private**. A private contact is not visible to people who have access to your contacts folder.

### Working with contacts

Right-click a contact for the available actions:

![The context menu of a contact with Open, Copy/Move, Print, Categories, Delete, Send email, Export as and Options](/img/web/web_contacts_contextmenu.png)

- **Send email** opens a new mail to the contact.
- **Categories** works as in [Mail](/web/mail/#categories).
- **Print** prints the contact.
- **Copy/Move** moves contacts to another contacts folder.
- **Export as** saves contacts as vCard files (.vcf), which almost any other program can import.
- Hover over a contact to see the quick actions **Email** and **Delete**.

To import contacts, right-click a contacts folder and choose **Import contacts**, then select a vCard file. A vCard attached to a mail can be imported with **Import to folder** in the attachment menu.

## Distribution lists

A distribution list groups several addresses under one name, so you can write to all of them at once, for example *Aurora launch team*.

1. Choose **New** › **Distribution list**.
2. Enter a **Name**.
3. Add members:
   - **Select Members** picks them from the address book or your contacts,
   - **Add New** adds an address that is not in the address book,
   - **Remove** takes the selected member out of the list.
4. Optionally write a description on the **Notes** tab.
5. Click **Save & Close**.

![The distribution list Aurora launch team with five members](/img/web/web_contact_dlist.png)

To write to the list, enter its name in the **To** field of a mail. To send to only some of the members, expand the list in the address field first.

## The address book

Click **Address Book** in the toolbar to open the address book. It shows the **Global Address List** of your organization with all colleagues, rooms, equipment and shared mailboxes. With **Show Names from the** you switch to your contacts folders or to other address lists.

![The address book with the global address list of Example Ltd.](/img/web/web_addressbook.png)

Double-click an entry for the details of a colleague: name, organization, phone numbers, group memberships, e-mail addresses and the office address on a map.

![The details of Lukas Hofer from the address book with the tabs General, Organization, Phone, Member Of, Email addresses and Map](/img/web/web_addressbook_details.png)

![The Map tab of an address book entry, showing the office in Vienna](/img/web/web_addressbook_map.png)

Under [Settings › General › Address Book](/web/settings/#general) you choose which address list opens by default and whether names are shown as *First Last* or *Last, First*.

:::note
The global address list is maintained by your administrator. If your phone number or job title is wrong, ask your administrator to correct it.
:::
