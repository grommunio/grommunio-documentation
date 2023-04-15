..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2022 grommunio GmbH

#################
Generic Migration
#################

This chapter covers overall migration to grommunio with generic and
standardized protocols. These instructions are intentionally named ``generic``,
as these migration scenarios apply to multiple providers, installations and
other communication software installations.

Individual emails
=================

With the `gromox-eml2mt </man/gromox-eml2mt.8gx.html>`_, gromox-ical2mt,
gromox-vcf2mt and `gromox-mt2exm </man/gromox-mt2exm.8gx.html>`_ command-line
utilities, grommunio has utilities with which individual emails, calendars or
contact card files can be read and imported. Tend to the linked manual pages to
read about the invocation syntax.


Migration via IMAP
==================

As a user, you can do IMAP-to-IMAP transfers. This can be done interactively
with a MUA such as Thunderbird or Alpine by having both the original and the
Gromox IMAP accounts added and moving mails. Alternatively, the `imapsync`
command-line utility may be used to do so non-interactively.
