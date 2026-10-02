---
title: "Dateien"
description: "Mit grommunio Files und anderen WebDAV-Speichern direkt in grommunio Web arbeiten: durchsuchen, hochladen, Vorschau, teilen und Dateien an E-Mails anhängen."
sidebar:
  order: 75
---

Das Plugin **Dateien** (*Files*) bringt Ihren Dateispeicher, zum Beispiel grommunio Files, in grommunio Web. Sie können Ihre Ordner durchsuchen, Dokumente hochladen und in der Vorschau ansehen, sie mit anderen teilen und an E-Mails anhängen, ohne sie vorher herunterzuladen.

## Dateien einschalten

1. Öffnen Sie **Einstellungen › Plugins**.
2. Aktivieren Sie **Files Plugin** und klicken Sie auf **Übernehmen**.
3. Laden Sie grommunio Web neu, wenn Sie dazu aufgefordert werden.

In der oberen Leiste erscheint die Registerkarte **Dateien**. Solange Sie kein Konto hinzugefügt haben, weist sie darauf hin, dass Sie zuerst in den Einstellungen ein Konto anlegen müssen.

## Ein Dateien-Konto hinzufügen

1. Öffnen Sie **Einstellungen › Dateien**.
2. Klicken Sie auf **Account hinzufügen**.
3. Geben Sie einen **Accountnamen** ein, zum Beispiel *grommunio Files*, und wählen Sie das Backend: *Standard* (WebDAV, für grommunio Files und andere WebDAV-Server) oder *Seafile*.
4. Geben Sie die Verbindungsdaten ein, die Sie von Ihrem Administrator erhalten haben:
   - **Serveradresse**, zum Beispiel `mail.example.com`,
   - **Serverport** (`443`) und **TLS verwenden**,
   - **WebDAV-Basispfad**, für grommunio Files `/files/remote.php/webdav` (ohne Schrägstrich am Ende).
5. Aktivieren Sie **grommunio-Zugangsdaten verwenden** oder geben Sie **Benutzername** und **Passwort** ein.
6. Klicken Sie auf **Speichern** und **Übernehmen**.

![Der Dialog zum Bearbeiten des Kontos mit Accountname, Backend Standard, Serveradresse, Port 443, TLS und dem WebDAV-Basispfad von grommunio Files](/img/web/de/web_files_account.png)

Das Konto erscheint in der Liste mit seinem Status und den unterstützten Funktionen (Kontingent, Versionsinformationen, Teilen, schneller Up- und Download). Ein grüner Status bedeutet, dass die Verbindung funktioniert.

![Die Liste Accounts verwalten mit dem Konto grommunio Files](/img/web/de/web_files_settings.png)

:::tip
Ihr Administrator kann das Dateien-Konto vorab für Sie einrichten. Mit Single Sign-on verwendet grommunio Web Ihre Anmeldung auch für Dateien – ein Passwort ist dann nicht nötig.
:::

## Dateien durchsuchen

Klicken Sie in der oberen Leiste auf **Dateien**. Der Ordnerbereich zeigt Ihre Konten und deren Ordner, die Mitte den Inhalt des gewählten Ordners und die Vorschau rechts die ausgewählte Datei.

![Die Ansicht Dateien mit den Ordnern Aurora-Launch, Marketing, Messe 2026 und Vorlagen](/img/web/de/web_files.png)

![Der Ordner Aurora-Launch mit Key Visuals und der Pressemitteilung sowie der Vorschau des ausgewählten Bildes](/img/web/de/web_files_folder.png)

| Schaltfläche | Funktion |
|---|---|
| **Hochladen** | lädt Dateien von Ihrem Computer hoch. Sie können Dateien auch in die Liste ziehen. |
| **Dokument erstellen** | erstellt ein neues Dokument, eine Präsentation oder eine Tabelle (wenn OnlyOffice verfügbar ist). |
| **Neuer Ordner** | legt einen Ordner an. |
| **Vorschau** | öffnet die ausgewählte Datei im [Dokumentbetrachter](/de/web/mail/#anhänge-im-betrachter-öffnen). |
| **Herunterladen** | lädt die ausgewählten Dateien herunter. |
| **Teilen** | teilt die Datei oder den Ordner (siehe unten). |
| **An E-Mail anhängen** | beginnt eine neue E-Mail mit den ausgewählten Dateien als Anhang. |
| **An E-Mail als Link anhängen** | beginnt eine neue E-Mail mit einem Download-Link statt der Datei. |
| **Umbenennen**, **Löschen** | benennt das ausgewählte Element um oder löscht es (im Menü ⋮). |

Ein Doppelklick öffnet eine Datei: Office-Dokumente in OnlyOffice, sofern Ihr Administrator es aktiviert hat, alles andere im Betrachter. Ein Rechtsklick auf eine Datei bietet **Info** mit den Details. Mit **Ansicht umschalten** in der Symbolleiste wechseln Sie zwischen Listen- und Symbolansicht und der Position der Vorschau.

## Dateien und Ordner teilen

Wählen Sie eine Datei oder einen Ordner aus und klicken Sie auf **Teilen**:

- **Mit Benutzer/Gruppe teilen**: Fügen Sie Kolleginnen und Kollegen hinzu und legen Sie fest, ob sie weiterteilen, ändern, anlegen oder löschen dürfen.
- **Per Link teilen**: erstellt einen **Öffentlichen Link**, den Sie an beliebige Personen senden können. Schützen Sie ihn mit einem **Passwort**, erlauben Sie bei Ordnern einen **Öffentlichen Upload** und setzen Sie ein **Ablaufdatum**.

## Dateien in E-Mails

- Wählen Sie in einer neuen E-Mail im Anhangsmenü **Aus Files einfügen**, um eine Datei aus Ihrem Speicher anzuhängen.
- Klicken Sie mit der rechten Maustaste auf einen Anhang einer erhaltenen E-Mail und wählen Sie **Dem Files-Backend hinzufügen**, um ihn in Ihrem Speicher abzulegen.
- Ein Rechtsklick auf eine E-Mail mit **Dem Files-Backend hinzufügen** speichert die ganze E-Mail als `.eml`-Datei.
- Mit **Neu** › **Datei hochladen** in der Symbolleiste laden Sie aus jeder Ansicht eine Datei hoch.
