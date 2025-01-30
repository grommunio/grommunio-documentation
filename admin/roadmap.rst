..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2024 grommunio GmbH

#######
Roadmap
#######

Current roadmap of grommunio (as of 29th of January, 2025):

- The **Current Stable** release of grommunio has been released on the
  29th of January 2025, with a support lifecycle of 3 years and optional extended
  lifecycle extensions available with grommunio's subscription program.

- The **Next point release** is planned for release in the last week of
  February 2025 with the following features:

  - RFC 2184/2231: Enhanced handling of extended parameters in MIME headers.
  - Trashed Mailboxes & Migration: Improvements for advanced mailbox handling
    across multiple migrations, including x400 addressing and undocumented MAPI
    attributes.
  - grommunio Setup v2: Expanding support for the setup stage for RHEL9,
    Debian 12, and Ubuntu 24.04.
  - grommunio-files: Updated version with group folder management and modern
    authentication.

- Following 2025.01.2 the following features are in the upcoming
  release funnel (in QA and/or deployed already in pilot-installations):

  - Modern Authentication (OAuth2) for Outlook, IMAP, and POP3.
  - Full HTML-based MR (Meeting Request) Processing in the Web UI.
  - AI-Powered Features for enhanced user productivity.
  - Extended rules & autoprocessing support.

Release strategy
================

grommunio is committed to delivering quality software products in a
customer-friendly and predictable way.

The release model of grommunio is divided into 2 different chains:

- Major releases (e.g. 2025.01.1, 2023.11.1, 2022.12.1)

- Minor releases (e.g. 2025.01.2, 2023.11.3, 2022.12.2)

Major releases contain are determined to larger feature sets as well as
including potential architectural changes whereas minor releases are focused
on bugfixes, security updates and smaller features.

grommunio provides a major release annually with patch-level releases in
monthly cycles.

Supported Distributions
=======================

As of 2025.01.1, grommunio actively supports installation and operation on the
following Linux distributions:

- RHEL9 / EPEL9
- openSUSE 15.5+ / SLES 15.5+
- Debian 12
- Ubuntu 24.04

With 2025.01.2, grommunio additionally will start to provide automatic
deployment tools (grommunio-setup) for these distributions, too.

Disclaimer
==========

While grommunio does everything to provide the highest level of transparency,
the roadmap document is subject to change based on factors such as customer
demand, technological adaption or community response. While this document is
crafted with the highest level of care and accuracy, there might be changes,
which grommunio communicates through its available communication channels, such
as social networks, newsletters and on grommunio's other news sections.
