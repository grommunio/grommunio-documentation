---
title: "gromox-snapshot(8)"
description: "gromox-snapshot — Helper to create snapshots of mailboxes"
sidebar:
  order: 50
---

## Name

gromox-snapshot — Helper to create snapshots of mailboxes

## Synopsis

<dfn class="gx-param">/usr/libexec/gromox/gromox-snapshot</dfn>

## Description

gromox-snapshot calls btrfs(8) or cp(1)/--reflink to create snapshots of the current state of mailboxes as needed. gromox-snapshot is meant to be periodically invoked by a systemd timer (or, failing that, a classic cron job). The default interval of gromox-snapshot.timer is hourly.

The program generates snapshots "for this day" / "for this week" / etc., rather than snapshots which are at least one day / one week / etc. apart. When the snapshotter is run periodically, this evens out and is not a concern at all.

## Options

The program has no command-line options.

## Configuration file

/etc/gromox/snapshot.cfg will be read on startup. It is a trivial key=value file, with one variable per line.

<strong>retention_days</strong>=<em>n</em>  
Make daily snapshots and keep them for <em>n</em> days. Use <em>0</em> to deactivate daily snapshotting.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">7</span>

<strong>retention_hours</strong>=<em>n</em>  
Make hourly snapshots and keep them for <em>n</em> hours. Use <em>0</em> to deactivate hourly snapshotting.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<strong>retention_months</strong>=<em>n</em>  
Make monthly snapshots and keep them for <em>n</em> months (more precisely, <em>n</em>\*31 days). Use <em>0</em> to deactivate monthly snapshotting.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">0</span>

<strong>retention_weeks</strong>=<em>n</em>  
Make weekly snapshots and keep them for <em>n</em> weeks. Use <em>0</em> to deactivate weekly snapshotting.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">4</span>

<dfn class="gx-param">subvolume_root</dfn>  
When btrfs is used, this directive specifies the root directory of the nearest btrfs subvolume. (As of Linux 6.2.1, it is not possible to snapshot arbitrary directories; it has to be the root of a subvolume. Confer with `btrfs sub list` to see subvolumes.) Otherwise, this must point to the Gromox data directory.\
<span class="gx-deflabel">Default:</span> <span class="gx-default">/var/lib/gromox</span>

<dfn class="gx-param">snapshot_archive</dfn>  
The directory where snapshots (these are subdirectories) will be placed. This directory needs to be on the same device as the snapshot source (subvolume_root, see above).\
<span class="gx-deflabel">Default:</span> <span class="gx-default">/var/lib/gromox-snapshots</span>

Each time "category" (days, weeks, etc.) is independently evaluated and snapshots are always made from the subvolume_root, never from another snapshot. A weekly snapshot generated on the first day of the week is not strictly equal to the daily snapshot generated for the same day, as there is technically a very small time window between individual btrfs commands.

## Errors

- Invalid cross-device link: snapshot_archive was not on the same device as subvolume_root.

- Operation not supported: the filesystem employed on snapshot_archive does not support reflinks

## Known issues

When a reflink-based snapshot is deleted (which happens via /bin/rm), rm may modify the directory's timestamp. If that rm call is interrupted without completing, the next run of gromox-snapshot will erroneously consider the directory as "too new" and not resume the deletion until it has sufficiently aged again.

## See also

<strong>gromox</strong>(7)
