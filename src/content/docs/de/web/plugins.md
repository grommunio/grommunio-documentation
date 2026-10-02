---
title: "Weitere Plugins"
description: "Alle Plugins von grommunio Web im Überblick sowie Desktopbenachrichtigungen, Intranet-Seiten, die Karte in Kontakten und Kendox InfoShare."
sidebar:
  order: 80
---

Plugins erweitern grommunio Web um zusätzliche Funktionen. Ihr Administrator entscheidet, welche Plugins installiert und für Sie eingeschaltet sind; optionale Plugins können Sie unter **Einstellungen › Plugins** selbst ein- und ausschalten:

![Die Einstellungen Plugins mit Kontrollkästchen für die optionalen Plugins und ihren Versionen](/img/web/de/web_settings_plugins.png)

Setzen oder entfernen Sie das Häkchen bei einem Plugin und klicken Sie auf **Übernehmen**. grommunio Web lädt neu, um das Plugin zu laden oder zu entfernen. Plugins mit dem Hinweis *Dieses Plugin kann nicht deaktiviert werden* sind immer aktiv.

## Übersicht

| Plugin | Was es hinzufügt | Mehr dazu |
|---|---|---|
| **KI-Assistent** | Zusammenfassungen, Übersetzungen, vorgeschlagene Aktionen und Schreibhilfe | [KI-Assistent](/de/web/ai/) |
| **Archiv** | die Registerkarte *Archiv* zum Durchsuchen von grommunio Archive | [Archiv](/de/web/archive/) |
| **Passwort ändern** | die Einstellungsseite *Passwort ändern* (immer aktiv) | [Einstellungen](/de/web/settings/#passwort-ändern) |
| **Chat** | die Registerkarte *Chat* mit grommunio Chat | [Chat](/de/web/chat/) |
| **Desktopbenachrichtigungs-Plugin** | Benachrichtigungen des Betriebssystems für neue E-Mails und Erinnerungen | [unten](#desktopbenachrichtigungen) |
| **Files Plugin** | die Registerkarte *Dateien* und Dateien in E-Mails | [Dateien](/de/web/files/) |
| **Intranet** | Registerkarten für Webseiten Ihrer Organisation | [unten](#intranet) |
| **Kendox InfoShare** | Archivierung von E-Mails in Kendox InfoShare | [unten](#kendox-infoshare) |
| **Meet** | Videokonferenzen mit grommunio Meet | [Meet](/de/web/meet/) |
| **Mobilgeräteverwaltung** | die Einstellungsseite *Mobile Geräte* (immer aktiv) | [Mobile Geräte](/de/web/mdm/) |
| **OpenPGP-Plugin** | Signieren und Verschlüsseln mit OpenPGP | [Signieren & Verschlüsseln](/de/web/security/#openpgp) |
| **OpenStreetMap** | die Registerkarte *Karte* für Kontakte und Adressbucheinträge | [unten](#karten) |
| **S/MIME-Plugin** | Signieren und Verschlüsseln mit S/MIME-Zertifikaten | [Signieren & Verschlüsseln](/de/web/security/#smime) |
| **Vorlagenausschnitte** | wiederverwendbare Textbausteine | [Vorlagenausschnitte](/de/web/templates/) |

## Desktopbenachrichtigungen

Mit dem **Desktopbenachrichtigungs-Plugin** kündigt auch Ihr Betriebssystem neue E-Mails und Erinnerungen an, selbst wenn der Tab von grommunio Web im Hintergrund liegt.

1. Schalten Sie das Plugin unter **Einstellungen › Plugins** ein und laden Sie neu.
2. Öffnen Sie **Einstellungen › Desktopbenachrichtigungen** und klicken Sie auf **Erlaubnis anfordern**. Erlauben Sie Benachrichtigungen, wenn Ihr Browser fragt.
3. Wählen Sie, worüber Sie benachrichtigt werden möchten.

![Die Einstellungen Desktopbenachrichtigungen](/img/web/de/web_settings_desktopnotifications.png)

| Option | Beschreibung |
|---|---|
| **Desktopbenachrichtigungen für neue E-Mail aktivieren** | eine Benachrichtigung für jede neue E-Mail |
| **Desktopbenachrichtigungen für Erinnerungen aktivieren** | eine Benachrichtigung für jede fällige Erinnerung |
| **Desktopbenachrichtigung automatisch nach … Sekunde(n) ausblenden** | wie lange eine Benachrichtigung sichtbar bleibt |
| **Ton deaktivieren** | Benachrichtigungen ohne Ton |

Desktopbenachrichtigungen funktionieren in Chrome, Edge und Firefox. Welche Ordner Benachrichtigungen auslösen, legen Sie unter [Einstellungen › Mail › Benachrichtigungen bei neuen E-Mails](/de/web/settings/#mail) fest.

## Intranet

Das Plugin **Intranet** fügt der oberen Leiste Registerkarten hinzu, die Webseiten Ihrer Organisation in grommunio Web öffnen, etwa das Intranet, ein Wiki oder ein Ticketsystem. Namen und Adressen der Registerkarten legt Ihr Administrator fest:

![Die obere Leiste mit zwei zusätzlichen Registerkarten des Intranet-Plugins](/img/web/de/web_intranet_tabs.png)

Manche Webseiten erlauben es nicht, innerhalb einer anderen Anwendung angezeigt zu werden. Sie lassen sich nicht als Intranet-Registerkarte verwenden.

## Karten

Das Plugin **OpenStreetMap** fügt Kontakten und den Details von Adressbucheinträgen die Registerkarte **Karte** hinzu. Sie zeigt die Privat-, Geschäfts- und weiteren Adressen auf einer OpenStreetMap-Karte; ein Klick auf eine Markierung zeigt, welche Adresse es ist. Siehe [Kontakte › Karte](/de/web/contacts/#karte).

Um die Position einer Adresse zu finden, wird sie an den Geokodierungsdienst von OpenStreetMap gesendet.

## Kendox InfoShare

Organisationen, die das Dokumentenmanagementsystem **Kendox InfoShare** einsetzen, können E-Mails direkt aus grommunio Web dorthin archivieren:

1. Klicken Sie mit der rechten Maustaste auf eine E-Mail und wählen Sie **Archivieren in InfoShare**.
2. Wählen Sie, was archiviert werden soll:
   - **Alles - Archiviere E-Mail im Originalformat**,
   - **Nur E-Mail - E-Mail ohne Anhänge speichern** oder
   - **Separat - Anhänge separat speichern** und wählen Sie die Anhänge.
3. Klicken Sie auf **Archivierung starten** und schließen Sie die Archivierung im sich öffnenden Kendox-Dialog ab.

Die Grenzen für Anzahl und Größe der Anhänge und die Kendox-Umgebung werden unter **Einstellungen › Kendox InfoShare** und von Ihrem Administrator festgelegt.
