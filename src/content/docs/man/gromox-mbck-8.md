---
title: "gromox-mbck(8)"
description: "<strong>gromox-mbck</strong> — Mailbox check and repair utility"
sidebar:
  order: 50
---

## Name

<strong>gromox-mbck</strong> — Mailbox check and repair utility

## Synopsis

<strong>gromox-mbck</strong> \[<strong>-p</strong>\] exchange.sqlite3 \[...\]

## Description

mbck checks one or more mailbox databases (exmdb/exchange.sqlite3) for specific inconsistencies in Gromox's bookkeeping. Use it when investigating suspected synchronization issues.

The main check validates that every folder and message ID is covered by a prior block reservation. Block reservations are means to cluster message IDs together, which is supposed to help the compression of ICS metadata a bit (saves at most 8 bytes per message). With the repair action selected, missing reservations are added.

A second check validates that all indices that are supposed to exist do, in fact, exist. This is a read-only test, with no repair actions defined.

mbck is not a general SQLite integrity checker and does not verify message bodies or attachments in the cid directory.

Back up the mailbox before using <strong>-p</strong>.

mbck directly operates on the filesystem, which is not ideal, but it is believed it is "mostly fine":

It is technically safe to run gromox-mbck while gromox-http has a mailbox open, provided Gromox is version \>= 2.30. HOWEVER, gromox-http (still as of Gromox 3.10) does not anticipate databases being write-locked by another process for undue amounts of time (gromox.cfg:sqlite_busy_timeout), and will signal an operational error upwards if that time limit is reached. For example, mail cannot be delivered to the mailbox while mbck is running in repair/write mode.

## Options

<dfn class="gx-param">-p</dfn>  
Perform repairs / write operations. (Default: just readonly checks)

<dfn class="gx-param">-?</dfn>  
Display option summary.
