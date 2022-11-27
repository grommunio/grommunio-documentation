..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2022 grommunio GmbH

Attachment size
===============

Situation: When looking a mail that has attachments, the size reported next to
the icon+filename appears inflated over the actual file size that will be saved
to disk.

Cause: Outlook displays the value of the ``PR_ATTACH_SIZE`` MAPI property. This
property is specified to not only include the file size, but also the metadata
for the attachment.
