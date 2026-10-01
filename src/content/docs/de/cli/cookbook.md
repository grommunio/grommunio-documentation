---
title: "Allgemeine Verwaltungsaufgaben"
description: "Praktische, per „Kopieren und Einfügen“ umsetzbare Befehlszeilen-Anleitungen für die tägliche Administration des grommunio – Benutzeranmeldung, Synchronisierung von LDAP und Active Directory, Postfachverwaltung, fetchmail, Backups und Diagnose."
sidebar:
  label: "Häufige Aufgaben"
  order: 5
---

Ein praktisches Handbuch für die Aufgaben, die Administratoren am häufigsten ausführen. Jeder Befehl
wird auf dem grommunio-Server als `root` (oder mit `sudo`) ausgeführt. Identifizieren Sie einen Benutzer anhand seiner
E-Mail-Adresse (`jdoe@example.com`); fügen Sie `--help` an einen beliebigen `grommunio-admin`-Befehl
an, um alle dessen Optionen anzuzeigen.

:::note
Diese Anleitungen kombinieren das High-Level-Management-Tool [`grommunio-admin`](/cli/grommunio-admin/)
CLI mit den Low-Level-Mailbox-Tools [`gromox-*`](/cli/gromox-tools/).
Um den vollständigen Optionsumfang eines Befehls anzuzeigen, folgen Sie den Links zu dessen Referenzseite.
:::

## Benutzer und Passwörter

### Einen Benutzer anlegen und ein Passwort festlegen

```bash
# Create the mailbox (a maildir/store is provisioned automatically)
grommunio-admin user create jdoe@example.com

# Set an initial password (you'll be prompted), or generate a strong one:
grommunio-admin passwd jdoe@example.com
grommunio-admin passwd -a -l 16 jdoe@example.com     # auto-generate, 16 chars
```

Die Domäne (`example.com`) muss bereits vorhanden sein – siehe
[Domäne erstellen](#create-a-domain) weiter unten.

### Benutzer anzeigen, auflisten und suchen

```bash
grommunio-admin user show jdoe@example.com           # full detail for one user
grommunio-admin user list                            # all users
grommunio-admin user list -f status=0 jdoe@*         # filter + wildcard
```

### Einen Benutzer bearbeiten

```bash
# Add an alias address
grommunio-admin user modify jdoe@example.com --alias john.doe@example.com

# Change the interface language
grommunio-admin user modify jdoe@example.com --lang en_US

# Toggle a feature (e.g. disable ActiveSync for this user)
grommunio-admin user modify jdoe@example.com --privEas 0
```

`grommunio-admin user modify --help` listet alle Felder auf, einschließlich der benutzerspezifischen
Funktionsschalter (`--privChat`, `--privVideo`, `--privFiles`, `--privDav`,
`--privEas`, …), Aliase und gespeicherte Eigenschaften.

### Mobile Geräte verwalten

```bash
grommunio-admin user devices jdoe@example.com list           # paired EAS devices
grommunio-admin user devices jdoe@example.com resync DEVICE  # force a resync
grommunio-admin user devices jdoe@example.com wipe DEVICE    # remote wipe
```

### Delegierung und „Als… senden“

```bash
grommunio-admin user delegate jdoe@example.com add assistant@example.com
grommunio-admin user sendas   jdoe@example.com add shared@example.com
grommunio-admin user delegate jdoe@example.com list
```

### Einen Benutzer löschen

:::caution [Destruktiv]
Durch das Löschen eines Benutzers wird das Postfach entfernt. Fügen Sie `-k` hinzu, um die zugrunde liegenden Dateien auf der
Festplatte zu behalten, falls Sie diese möglicherweise wiederherstellen müssen.
:::

```bash
grommunio-admin user delete -y jdoe@example.com      # -y skips the confirmation
```

## Domains und Organisationen

### Eine Domain erstellen

```bash
# -u sets the maximum number of users for the domain
grommunio-admin domain create -u 100 example.com
```

### Domains auflisten, bearbeiten und entfernen

```bash
grommunio-admin domain list
grommunio-admin domain modify example.com            # see --help for fields
grommunio-admin domain delete example.com            # soft-delete (recoverable)
grommunio-admin domain purge --files example.com     # permanent + remove files
```

:::caution [Unwiderruflich]
`domain purge --files` löscht die Domäne **sowie** alle
Daten ihrer Postfächer dauerhaft. Dieser Vorgang kann nicht rückgängig gemacht werden.
:::

## LDAP / Active Directory

Verbinden Sie grommunio mit einem externen Verzeichnis, importieren Sie anschließend die Benutzer und halten Sie sie synchron.

```bash
grommunio-admin ldap configure        # interactive: server, bind, search base
grommunio-admin ldap check            # verify connectivity and the configuration
grommunio-admin ldap search jdoe      # find matching directory objects
grommunio-admin ldap dump jdoe@example.com   # show the raw LDAP object
```

Benutzer importieren (ein „Down-Sync“ aus dem Verzeichnis in grommunio):

```bash
grommunio-admin ldap downsync jdoe@example.com   # one user
grommunio-admin ldap downsync -c                 # complete sync of all mapped users
```

:::tip[Automatisieren]
Führen Sie regelmäßig einen `grommunio-admin ldap downsync -c` über einen systemd-Timer oder einen Cron-Job
aus, um grommunio mit dem Verzeichnis synchron zu halten. `grommunio-admin ldap check -r`
meldet (und entfernt in Verbindung mit `-y`) Benutzer, deren Verzeichnisobjekt verschwunden ist.
:::

## Fetchmail – E-Mails aus einem Remote-Postfach abrufen

Nützlich bei Migrationen, um E-Mails vom alten Provider eines Benutzers abzurufen:

```bash
grommunio-admin fetchmail create \
  --srcServer mail.old-provider.example \
  --srcUser   old-account \
  --srcPassword 'secret' \
  jdoe@example.com

grommunio-admin fetchmail list jdoe@example.com
```

## Wartung der Mailbox

Diese Aufgaben verwenden [`gromox-mbop`](/cli/gromox-tools/#gromox-mbop) („Postfach-
Operationen“), die immer auf ein Postfach mit der Nummer `-u` abzielen. Ordner können durch
**symbolischen Namen** (`INBOX`, `SENT`, `DRAFT`, `JUNK`, `DELETED`, …) oder über den Pfad
(`/Top of Information Store/…`) angegeben werden.

### Einen Ordner leeren

```bash
# Empty the Junk folder (soft-delete, like a client would)
gromox-mbop -u jdoe@example.com emptyfld --soft JUNK

# Empty Deleted Items recursively, including subfolders (-R), hard delete
gromox-mbop -u jdoe@example.com emptyfld -R DELETED
```

### Bestimmte Nachrichten löschen

```bash
gromox-mbop -u jdoe@example.com delmsg -f INBOX 0x1234 0x1235
```

### Speicherplatz freigeben

Weichgelöschte („wiederherstellbare“) Elemente belegen weiterhin Speicherplatz, bis sie endgültig gelöscht werden. Eine typische
Bereinigung, gefolgt von einer Komprimierung, schafft den meisten Speicherplatz frei:

```bash
# Hard-delete items soft-deleted more than 30 days ago, across the whole store
gromox-mbop -u jdoe@example.com purge-softdelete -r -t 30d /

# Drop attachment/content files no longer referenced by any message
gromox-mbop -u jdoe@example.com purge-datafiles

# Compact the SQLite store
gromox-mbop -u jdoe@example.com vacuum
```

### Die angegebene Filialgröße neu berechnen

```bash
gromox-mbop -u jdoe@example.com recalc-sizes
```

### Eine Aktion für alle Postfächer ausführen

Der Pseudo-Befehl `foreach.*` wendet eine Aktion gleichzeitig auf mehrere Postfächer an —
ideal für flottenweite Wartungsarbeiten:

```bash
# Purge old soft-deleted items in every mailbox hosted on this server
gromox-mbop foreach.mb.here purge-softdelete -r -t 30d /
```

## Backups und Snapshots

grommunio appliances erstellen regelmäßig platzsparende Snapshots des Postfachspeichers
(auf einem Copy-on-Write-Dateisystem wie Btrfs):

```bash
/usr/libexec/gromox/gromox-snapshot       # create a snapshot now
```

Planen Sie dies über einen systemd-Timer, um regelmäßige, ressourcenschonende
Zeitpunkt-Backups durchzuführen. Einzelheiten zur Aufbewahrungsdauer finden Sie unter [`gromox-snapshot`](/man/gromox-snapshot-8/).

## Diagnose und Fehlerbehebung

```bash
# Open (touch) a mailbox to confirm the store responds
gromox-mbop -u jdoe@example.com ping

# Check a mailbox for inconsistencies (and repair with care)
gromox-mbck jdoe@example.com

# Report a mailbox's size breakdown
gromox-mbsize jdoe@example.com

# Inspect the local delivery queue
gromox-mailq

# Drop into an interactive admin shell (REST API context)
grommunio-admin shell
```

:::tip[Weitermachen]
Dies ist ein Einstiegsset – siehe die vollständige [`grommunio-admin`](/cli/grommunio-admin/)
Referenz für jeden Verwaltungsbereich sowie [Gromox CLI Dienstprogramme](/cli/gromox-tools/)
für die vollständige Liste der Low-Level-Tools.
:::
