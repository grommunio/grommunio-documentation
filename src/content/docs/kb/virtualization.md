---
title: "Virtualization"
sidebar:
  order: 180
---

## VirtualBox Classic BIOS

- Use F12 to call up the boot menu.
- When booting from a CD-ROM and choosing "Boot local disk", VirtualBox hangs. This seems to be a problem exclusive to the VirtualBox implementation of Classic BIOS (does not occur on VMware platforms, or when using VBox EFI).
- The VBE implementation offers modes from 320×200 to 1600×1200 in the default set (and some more via private INT 10h function 5642h, from 640×480 to 2560×1920, but this is not used by GRUB).
- Default firmware resolution is 640×480.
- If GRUB is set to use `GRUB_GFXMODE=auto` (cf. `/etc/default/grub`), which makes it simply retain that resolution. (This in contrast to e.g. choosing the maximum available resolution.)
- A manual list of resolutions always inconveniences at least one concrete system, so we will leave the Grommunio installation media and default system settings at `auto`. You can change the resolution in existing systems to a suitable size.

## VirtualBox EFI

- Use F2 to call up the boot menu.
- The EFI GOP driver supports a plethora of modes from 640×480 to 7680×4320.
- Default firmware resolution is 1024×768.

## Containers and Kubernetes

Instead of a virtual machine, grommunio can run as containers: the images
`gromox-core`, `gromox-archive` and `gromox-office` from
`container.grommunio.com`, with MariaDB in separate containers. The service
containers need no privileged mode and no special runtime.

- Docker Compose on a single host: at least 4 GB RAM for gromox-core, 8 GB
  with grommunio Office. See [Container installation](/admin/container_core/).
- Kubernetes with the Helm chart: about 2 CPU and 7 GiB memory in resource
  requests with all features enabled, and a StorageClass with `ReadWriteOnce`
  volumes. Each component runs as a single replica, because Gromox keeps the
  mailboxes in SQLite files. See [Kubernetes](/admin/kubernetes/).

Images, editions and signature verification are described in
[Container registry](/admin/container_registry/).
