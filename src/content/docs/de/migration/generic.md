---
title: "Allgemeine Migration"
description: "Dieses Kapitel befasst sich mit der allgemeinen Migration auf grommunio unter Verwendung generischer und standardisierter Protokolle. Diese Anleitungen werden bewusst als „generisch“ bezeichnet, da diese…"
sidebar:
  order: 30
---

Dieses Kapitel befasst sich mit der allgemeinen Migration auf grommunio unter Verwendung generischer und standardisierter Protokolle. Diese Anleitungen tragen bewusst die Bezeichnung `generic`, da diese Migrationsszenarien für mehrere Anbieter, Installationen und andere Kommunikationssoftware-Installationen gelten.

## Einzelne E-Mails

Mit den Befehlszeilenprogrammen [gromox-eml2mt](/man/gromox-eml2mt-8/), gromox-ical2mt, gromox-vcf2mt und [gromox-mt2exm](/man/gromox-mt2exm-8/)-Befehlszeilenprogramme verfügt grommunio über Dienstprogramme, mit denen einzelne E-Mails, Kalender oder Kontaktkartendateien gelesen und importiert werden können. Weitere Informationen zur Aufrufsyntax finden Sie auf den verlinkten Handbuchseiten.

## Migration über IMAP

Postfächer auf jedem IMAP-fähigen Server lassen sich per IMAP nach grommunio übertragen. Für wenige Konten geht das interaktiv mit einem Mailclient wie Thunderbird oder Alpine, in dem Quell- und grommunio-Konto eingerichtet sind, durch Verschieben der Ordner. Für alles Größere eignet sich das Befehlszeilenwerkzeug *imapsync*, das für die grommunio Appliance paketiert ist und wiederholbare Erst- und Delta-Synchronisationen, Ordnerzuordnung und Massenläufe unterstützt; das vollständige Vorgehen inklusive Zielvorbereitung, Umstellungsplanung und Fehlerbehebung beschreibt [IMAP-Migration mit imapsync](/migration/imap/). IMAP überträgt nur E-Mails; Kalender, Kontakte und Aufgaben benötigen die oben genannten `gromox-*2mt`-Werkzeuge oder einen PST-basierten Import.
