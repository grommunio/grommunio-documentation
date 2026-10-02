---
title: "Mobile Geräte"
description: "Sehen, welche Smartphones und Tablets mit Ihrem Postfach synchronisieren, ihren Status prüfen, sie neu synchronisieren und ein verlorenes Gerät löschen oder entfernen."
sidebar:
  order: 79
---

Smartphones und Tablets, die Ihre E-Mails, Ihren Kalender und Ihre Kontakte mit grommunio synchronisieren (über Exchange ActiveSync), stehen unter **Einstellungen › Mobile Geräte**. Dort prüfen Sie sie, synchronisieren sie neu und können ein verlorenes oder gestohlenes Gerät aus der Ferne löschen.

![Die Einstellungen Mobile Geräte mit einem iPhone und einem Android-Gerät, ihrem User-Agent, dem Provisionierungsstatus und der letzten Verbindung](/img/web/de/web_settings_mobile.png)

## Die Geräteliste

| Spalte | Bedeutung |
|---|---|
| **Gerät** | die Art des Geräts, zum Beispiel *iPhone* oder *Android* |
| **User-Agent** | die E-Mail-App und ihre Version |
| **Status der Provisionierung** | der Zustand der Sicherheitsrichtlinie, zum Beispiel *Ok* oder ein ausstehendes Löschen |
| **Letzte Verbindung** | wann das Gerät zuletzt synchronisiert hat |
| **Geräte-ID** | die eindeutige Kennung des Geräts |
| weitere Spalten | Betriebssystem, Geräteinformationen, erste Synchronisierung und wer das Gerät stellvertretend nutzt |

Synchronisiert kein Gerät mit Ihrem Konto, ist die Liste leer.

## Gerätedetails

Ein Doppelklick auf ein Gerät zeigt seine Details:

![Die Details des iPhones: verbunden seit, letzte Aktualisierung, letzte Verbindung, Status und Anzahl der synchronisierten Ordner](/img/web/de/web_mdm_details.png)

- **Allgemein**: wann das Gerät zuerst verbunden wurde und zuletzt synchronisiert hat, sein Status und wie viele Ordner jedes Typs synchronisiert werden. Unter **Gemeinsame Ordner** wählen Sie mit **Geteilte Ordner verwalten**, welche gemeinsamen Ordner auf das Gerät synchronisiert werden. Gemeinsame Postfächer müssen dafür zuerst in grommunio Web geöffnet sein.
- **Details**: Gerätetyp, Betriebssystem, Geräte-ID, User-Agent, ActiveSync-Version, grommunio-sync-Version und die Richtlinie.

![Die Registerkarte Details mit Typ, Betriebssystem, ID und Versionen](/img/web/de/web_mdm_details2.png)

## Aktionen

Wählen Sie ein Gerät aus und verwenden Sie die Schaltflächen unter der Liste.

### Volle Resynchronisierung

**Volle Resynchronisierung** synchronisiert alle Daten auf dem Gerät von Grund auf neu. Nutzen Sie sie, wenn das Gerät veraltete oder fehlende Elemente anzeigt. Je nach Größe Ihres Postfachs kann das eine Weile dauern.

### Gerät löschen

Ist ein Gerät verloren gegangen oder gestohlen worden, löscht **Gerät löschen** die Daten darauf, sobald es sich das nächste Mal verbindet. Sie haben die Wahl:

- **Nur Daten zu diesem Konto löschen**: entfernt nur Ihre grommunio-E-Mails, -Kalender und -Kontakte vom Gerät,
- **Alle Daten löschen**: setzt das Gerät auf die Werkseinstellungen zurück und löscht **alles** darauf.

Zur Bestätigung geben Sie Ihr Passwort ein oder, bei Anmeldung über Single Sign-on, `WIPE`:

![Der Bestätigungsdialog, in dem zum Löschen des Geräts WIPE eingegeben werden muss](/img/web/de/web_mdm_wipe.png)

:::danger
*Alle Daten löschen* lässt sich nicht rückgängig machen. Verwenden Sie es nur für Geräte, die sicher verloren oder gestohlen sind.
:::

### Gerät entfernen

**Gerät entfernen** entfernt das Gerät aus der Liste, zum Beispiel ein Smartphone, das Sie nicht mehr verwenden. Bestätigen Sie mit Ihrem Passwort oder bei Single Sign-on durch Eingabe von `REMOVE`. Verbindet sich das Gerät erneut, erscheint es wieder und synchronisiert von vorn.

### Neu laden

**Neu laden** aktualisiert die Liste und den Status der Geräte.
