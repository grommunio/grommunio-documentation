---
title: "gromox-eml2mbox(8)"
description: "gromox-eml2mbox — Utility for converting RFC5322 Internet Mail messages into a RFC4155 mbox-format mailbox"
sidebar:
  order: 50
---

## Name

gromox-eml2mbox — Utility for converting RFC5322 Internet Mail messages into a RFC4155 mbox-format mailbox

## Synopsis

<strong>gromox-eml2mbox</strong> \[<em>file</em>...\] <strong>\></strong><em>out.mbox</em>

## Description

gromox-eml2mbox reads one or more RFC5322-formated e-mail messages and re-exports them as a Unix mbox to stdout. The purpose is to make messages openable with command-line MUAs such as Alpine <https://alpineapp.email/>.

## Examples

When <strong>-</strong> is given as an argument, standard input is expected to contain a <strong>list of filenames</strong> (i.e. indirection). This can help when \*.eml leads to an expansion the system cannot handle:

> gromox-eml2mbox \*.eml \>all.mbox

May result in a "Argument list too long" error in sh. Remedy for that:

> find . -maxdepth 1 -type f -name "\*.eml" \| gromox-eml2mbox - \>all.mbox

To convert a single message coming from elsewhere via pipe:

> gromox-exm2mbox \<1.eml \>1.mbox

## See also

<strong>gromox</strong>(7)
