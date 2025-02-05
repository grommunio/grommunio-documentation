..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2025 grommunio GmbH

########
Settings
########

Mail signatures
###############

Grommunio Web allows users to manage multiple email signatures, with the
flexibility to set different signatures for new messages, as well as for replies
and forwarded emails.

Setting Up a Signature to create or modify an email signature in Grommunio Web,
follow these steps:

#. Open Settings from the top right menu.
#. Navigate to the Mail section.
#. Scroll to Signatures and click New to create a new signature.
#. Enter a custom signature name for easy identification.
#. Compose your signature using plain text, formatted text, or HTML.

Signature templating
####################

Grommunio Web supports dynamic signature attributes, which automatically insert
information from your user profile into your signature. These attributes
correspond to account details configured on the server, such as your name, phone
number, company, and job title.

Important: The availability of attributes depends on your organization's server
configuration. If you require additional attributes or changes to the available
ones, please contact your system administrator.

How It Works: Attributes are enclosed in curly brackets with a percentage sign,
e.g., {%attribute}. When composing an email, Grommunio Web will replace these
placeholders with your actual user information. If an attribute is not
configured in your profile, it will not appear in the signature.

Signature Placeholders
----------------------

The following general attributes can be used in email signatures:

- {%firstname} – First name
- {%initials} – Initials
- {%lastname} – Last name
- {%displayname} – Full display name
- {%title} – Job title
- {%company} – Company name
- {%department} – Department
- {%office} – Office location
- {%assistant} – Name of the assistant
- {%phone} – Primary phone number
- {%primary_email} – Primary email address
- {%address} – Street address
- {%city} – City
- {%state} – State/Region
- {%zipcode} – ZIP/Postal code
- {%country} – Country
- {%phone_business} – Primary business phone number
- {%phone_business2} – Secondary business phone number
- {%phone_fax} – Fax number
- {%phone_assistant} – Assistant's phone number
- {%phone_home} – Primary home phone number
- {%phone_home2} – Secondary home phone number
- {%phone_mobile} – Mobile phone number
- {%phone_pager} – Pager number
