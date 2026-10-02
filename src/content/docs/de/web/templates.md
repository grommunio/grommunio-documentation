---
title: "Vorlagenausschnitte"
description: "Mit dem Plugin Vorlagenausschnitte fertige Textbausteine in E-Mails, Termine, Kontakte, Aufgaben und Notizen einfügen und eigene Vorlagen anlegen."
sidebar:
  order: 74
---

Schreiben Sie denselben Text immer wieder – eine Eingangsbestätigung, eine Wegbeschreibung zu Ihrem Büro oder eine Produktbeschreibung –, speichern Sie ihn als **Vorlage**. Mit dem Plugin **Vorlagenausschnitte** fügen Sie ihn mit zwei Klicks ein.

Es gibt zwei Arten von Vorlagen:

- **Systemvorlagen** stellt Ihre Organisation für alle bereit, zum Beispiel offizielle Formulierungen. Sie können sie nicht ändern.
- **Benutzervorlagen** sind Ihre eigenen.

## Vorlagenausschnitte einschalten

1. Öffnen Sie **Einstellungen › Plugins**.
2. Aktivieren Sie **Vorlagenausschnitte** und klicken Sie auf **Übernehmen**.
3. Laden Sie grommunio Web neu, wenn Sie dazu aufgefordert werden.

## Eine Vorlage einfügen

1. Setzen Sie den Cursor an die Stelle, an der der Text stehen soll – in einer E-Mail, einem Termin, einem Kontakt, einer Aufgabe oder einer Notiz.
2. Klicken Sie in der Symbolleiste auf den Pfeil neben **Vorlage einfügen**.
3. Wählen Sie die Vorlage.

![Das Menü Vorlage einfügen mit den Systemvorlagen Eingangsbestätigung, Nachbereitung Besprechung und Produktinformation Aurora und der Benutzervorlage Terminbestätigung](/img/web/de/web_templates_menu.png)

Das Menü listet zuerst die Systemvorlagen und dann Ihre eigenen. Der Text wird an der Cursorposition eingefügt – in HTML-E-Mails formatiert, in reinen Text-E-Mails als Text.

![Eine neue E-Mail an Claire Dubois mit dem eingefügten Vorlagentext](/img/web/de/web_templates_inserted.png)

## Eigene Vorlagen anlegen

1. Öffnen Sie **Einstellungen › Vorlagenausschnitte**.
2. Klicken Sie unter **Benutzervorlagen** auf **Neu**.
3. Geben Sie einen Namen ein und schreiben Sie den Text unter **HTML-Inhalt**. Sie können Fettdruck, Listen und Links verwenden.
4. Klicken Sie bei Bedarf auf **HTML in reinen Text konvertieren**, um die Textfassung zu erzeugen, oder bearbeiten Sie den **Inhalt im Klartext** selbst.
5. Klicken Sie auf **Vorlage speichern** und **Übernehmen**.

![Die Einstellungen Vorlagenausschnitte mit den Systemvorlagen und der Benutzervorlage Terminbestätigung](/img/web/de/web_templates_settings.png)

Um eine Vorlage zu ändern, wählen Sie sie aus, bearbeiten sie und klicken erneut auf **Vorlage speichern**. **Löschen** entfernt die ausgewählte Vorlage.

:::note[Für Administratoren]
Systemvorlagen sind JSON-Dateien in `/var/lib/grommunio-web/templates` (siehe `PLUGIN_TEMPLATESNIPPETS_SYSTEM_DIR`), jeweils mit einem `name`, einer `html`- und einer `text`-Fassung. Benutzer, die in `PLUGIN_TEMPLATESNIPPETS_ADMIN_USERS` stehen, können Systemvorlagen auch direkt in den Einstellungen anlegen und bearbeiten.
:::
