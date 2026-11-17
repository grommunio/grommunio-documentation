---
title: "Virtualisierung"
sidebar:
  order: 180
---

## VirtualBox – Klassisches BIOS

- Rufen Sie das Startmenü mit der Taste F12 auf.
- Beim Booten von einer CD-ROM und der Auswahl von „Boot local disk“ friert VirtualBox ein. Dies scheint ein Problem zu sein, das ausschließlich bei der VirtualBox-Implementierung des Classic-BIOS auftritt (tritt nicht auf VMware-Plattformen oder bei Verwendung von VBox EFI auf).
- Die VBE-Implementierung bietet im Standard-Set Modi von 320×200 bis 1600×1200 an (sowie einige weitere über die private INT-10h-Funktion 5642h, von 640×480 bis 2560×1920, dies wird jedoch von GRUB nicht genutzt).
- Die Standardauflösung der Firmware beträgt 640×480.
- Wenn GRUB auf die Verwendung von `GRUB_GFXMODE=auto` eingestellt ist (vgl. `/etc/default/grub`), behält es einfach diese Auflösung bei. (Dies steht im Gegensatz zur Auswahl der maximal verfügbaren Auflösung.)
- Eine manuelle Auflistung von Auflösungen führt immer zu Problemen bei mindestens einem konkreten System, daher belassen wir die Grommunio-Installationsmedien und die Standard-Systemeinstellungen auf `auto`. Sie können die Auflösung in bestehenden Systemen auf eine geeignete Größe ändern.

## VirtualBox EFI

- Rufen Sie mit F2 das Startmenü auf.
- Der EFI-GOP-Treiber unterstützt eine Vielzahl von Auflösungen von 640×480 bis 7680×4320.
- Die Standardauflösung der Firmware beträgt 1024×768.

## Container und Kubernetes

Statt in einer virtuellen Maschine lässt sich grommunio auch in Containern
betreiben: mit den Images `gromox-core`, `gromox-archive` und `gromox-office` von
`container.grommunio.com` und MariaDB in separaten Containern. Die Dienstcontainer
benötigen keinen privilegierten Modus und keine spezielle Laufzeitumgebung.

- Docker Compose auf einem einzelnen Host: mindestens 4 GB RAM für gromox-core,
  8 GB mit grommunio Office. Siehe [Container-Installation](/admin/container_core/).
- Kubernetes mit dem Helm-Chart: etwa 2 CPUs und 7 GiB Arbeitsspeicher an Resource
  Requests bei aktivierten Funktionen sowie eine StorageClass mit `ReadWriteOnce`-Volumes.
  Jede Komponente läuft mit genau einem Replikat, da Gromox die Postfächer in
  SQLite-Dateien speichert. Siehe [Kubernetes](/admin/kubernetes/).

Images, Editionen und Signaturprüfung sind unter
[Container-Registry](/admin/container_registry/) beschrieben.
