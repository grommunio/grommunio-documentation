---
title: "Meet"
description: "Videokonferenzen mit grommunio Meet aus grommunio Web starten und Besprechungslinks zu Terminen und E-Mails hinzufügen."
sidebar:
  order: 76
---

**grommunio Meet** ist der Videokonferenzdienst von grommunio. Das Plugin **Meet** verbindet ihn mit grommunio Web: Starten Sie eine Besprechung mit einem Klick oder fügen Sie einem Termin einen Besprechungslink hinzu, damit alle Teilnehmer direkt aus der Einladung teilnehmen können.

## Meet einschalten

1. Öffnen Sie **Einstellungen › Plugins**.
2. Aktivieren Sie **Meet** und klicken Sie auf **Übernehmen**.
3. Laden Sie grommunio Web neu, wenn Sie dazu aufgefordert werden.

In der Symbolleiste erscheint die Schaltfläche **Meet** (Kamerasymbol), und Termine und E-Mails erhalten die Schaltfläche **Besprechung hinzufügen**.

## Eine Besprechung starten

Klicken Sie in der Symbolleiste auf **Meet**. grommunio Meet öffnet sich in einer neuen Registerkarte:

![grommunio Meet in grommunio Web mit einem vorgeschlagenen Raumnamen und der Schaltfläche zum Starten der Besprechung](/img/web/de/web_meet.png)

1. Übernehmen Sie den vorgeschlagenen Raumnamen oder geben Sie einen eigenen ein.
2. Starten Sie die Besprechung.
3. Erlauben Sie Ihrem Browser den Zugriff auf Kamera und Mikrofon.
4. Teilen Sie die Adresse der Besprechung mit den Personen, die Sie einladen möchten.

Darunter sind Ihre letzten Besprechungen aufgeführt, damit Sie ihnen schnell wieder beitreten können.

## Einem Termin eine Besprechung hinzufügen

1. Legen Sie einen Termin oder eine Besprechungsanfrage an.
2. Klicken Sie in der Symbolleiste auf **Besprechung hinzufügen**.

grommunio Web erstellt einen Besprechungsraum, trägt seine Adresse unter **Ort** ein und fügt der Beschreibung eine Einladung mit einer Schaltfläche zum Beitreten hinzu:

![Ein Termin mit der Meet-Adresse im Ort und der grommunio-Meet-Einladung mit Beitrittsschaltfläche in den Notizen](/img/web/de/web_meet_appointment.png)

Senden Sie die Einladung wie gewohnt. Zum Zeitpunkt der Besprechung treten alle über die Schaltfläche in der Einladung bei oder über **Webmeeting beitreten** in der Symbolleiste des Termins.

:::tip
Halten Sie beim Klick auf **Besprechung hinzufügen** die <kbd>Umschalt</kbd>-Taste gedrückt, um Raumnamen und Adresse selbst zu wählen.
:::

In einer neuen E-Mail fügt **Besprechung hinzufügen** einen Besprechungslink in den Text ein, etwa für ein spontanes Gespräch.

:::note
Der Einladungstext wird von Ihrem Administrator vorgegeben und kann daher auch auf Englisch erscheinen. In den Meet-Einstellungen können Sie ihn selbst anpassen.
:::

## Einstellungen

![Die Meet-Einstellungen](/img/web/de/web_settings_meet.png)

Unter **Einstellungen › Meet** legen Sie fest:

- **Besprechung öffnen in**: einer Web-Registerkarte, einem Popup oder einem eigenen Browserfenster,
- **Schaltfläche im Hauptmenü verstecken**,
- ob Betreff und Name des Organisators zum Raumnamen hinzugefügt werden,
- ob die Adresse zum Ort hinzugefügt wird, statt ihn zu ersetzen, und ob sie automatisch überschrieben werden darf (zum Beispiel beim Hinzufügen eines Besprechungsraums),
- ob der Terminbeschreibung eine Einladung hinzugefügt wird, und den Text der Einladung (als reiner Text und als HTML; `%url%` steht für die Adresse der Besprechung).

## Siehe auch

- [Kalender › Besprechungen](/de/web/calendar/#besprechungen)
