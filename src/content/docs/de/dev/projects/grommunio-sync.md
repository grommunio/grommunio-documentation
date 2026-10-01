---
title: "grommunio Sync (EAS)"
description: "Support wird von der grommunio GmbH und ihren Partnern angeboten. Weitere Informationen finden Sie hier. Ein Community-Forum finden Sie unter ."
sidebar:
  order: 30
---

> Quelle: [grommunio-sync](https://github.com/grommunio/grommunio-sync) README.

## grommunio Sync

<strong>grommunio Sync ist eine Open-Source-Anwendung zur Synchronisierung von Exchange ActiveSync (EAS)-kompatiblen Geräten wie Mobiltelefonen und Tablets.</strong>

<em>Zwar unterstützt Microsoft Outlook das Protokoll EAS, doch wird die Verwendung von grommunio Sync nicht empfohlen, da nur ein sehr kleiner Teil der Funktionen unterstützt wird. Für Microsoft und Outlook sollten Benutzer stattdessen die nativen Protokolle MAPI/HTTP und MAPI/RPC verwenden, die über \`grommunio Gromox \<https://github.com/grommunio/gromox\>\` verfügbar sind.</em>

   

## Auf einen Blick

- Bietet native Groupware-Anbindung (E-Mails, Kontakte, Kalender, Aufgaben und Notizen) für mobile Geräte wie Smartphones und Tablets.
- Bietet Kompatibilität mit den Protokollen Exchange ActiveSync (EAS) 2.5, 12.0, 12.1, 14.0, 14.1, 16.0 und 16.1.
- Plattformübergreifende Unterstützung für die neuesten Android-, Apple-Geräte (iPhone- und iPad-Modelle mit iOS-Technologie) sowie für ältere Windows Mobile-, Nokia- und BlackBerry-Geräte.
- Unterstützt Richtlinien zur Geräteverwaltung wie Fernlöschung, Passwortstärke und Sperrung nach einer definierbaren Anzahl ungültiger Authentifizierungsversuche.
- Kompatibel und funktionsfähig mit verschiedenen Webservern wie nginx, Apache und anderen; die Verwendung von nginx wird empfohlen.
- Hocheffizient: durchschnittlicher Speicherverbrauch von 2 MB pro Synchronisierungs-Thread und Gerät (bei Verwendung von nginx mit PHP-FPM).
- Verteilbar und kompatibel mit Lastenausgleichssystemen wie HAProxy, Apisix, KEMP und anderen.
- Skalierbar, ermöglicht Bereitstellungen mit mehreren Servern und an mehreren Standorten.
- Ausfallsicher, Speicherung von Geräte- und Synchronisationszuständen in Benutzerspeichern.
- Hohe Leistung, ermöglicht eine Speichersynchronisation nahezu mit Leitungsgeschwindigkeit.
- Sicher, mit Zertifizierungen durch unabhängige Sicherheitsforschung und -validierung.

## Erstellt mit

- PHP 7.4+, 8.x
- PHP-Module: soap, mbstring, posix, pcntl, pdo, xml, redis
- PHP-Backend-Modul: mapi

## Erste Schritte

### Voraussetzungen

- Ein funktionsfähiger <strong>Webserver</strong> (nginx wird empfohlen) mit einer funktionsfähigen <strong>TLS</strong>-Konfiguration.
- <strong>PHP</strong>, vorzugsweise als fpm-Pool verfügbar.
- <strong>Redis</strong> für hochleistungsfähige Interprozesskommunikation.
- <strong>Zcore</strong> MAPI-Transport (bereitgestellt von [Gromox](https://github.com/grommunio/gromox)).
- Funktionierende <strong>AutoDiscover</strong>-Konfiguration (empfohlen, bereitgestellt von [Gromox](https://github.com/grommunio/gromox)).

### Installation

- Stellen Sie grommunio-sync an einem Ort Ihrer Wahl bereit, z. B. `/usr/share/grommunio-sync`.
- Passen Sie `version.php` mit der entsprechenden Versionszeichenfolge an, siehe [/build/version.php.in](https://github.com/grommunio/grommunio-sync/blob/master/build/version.php.in).
- Legen Sie eine Standardkonfigurationsdatei als „config.php“ an, siehe [/config.php](https://github.com/grommunio/grommunio-sync/blob/master/config.php).
- Passen Sie die Webserver-Konfiguration an Ihre Anforderungen an; unter [/build](https://github.com/grommunio/grommunio-sync/blob/master/build) finden Sie einige Beispiele.
- Bereiten Sie die PHP-Konfiguration entsprechend Ihren Anforderungen vor; [/build](https://github.com/grommunio/grommunio-sync/blob/master/build) enthält einige Beispiele.
- Installation und Konfiguration des Redis-Dienstes.
- (Optional) Richten Sie AutoDiscover entsprechend für die Erkennung und Konfiguration von Konten ein.

### Verwendung

- Konfigurieren Sie den EAS-Client Ihrer Wahl mit dem bereitgestellten E-Mail-Kontotyp <strong>„Microsoft Exchange“</strong>.
- Bei AutoDiscover sind für die Geräteeinrichtung lediglich Ihre Anmeldedaten (Benutzername und Passwort) erforderlich.
- Verwenden Sie `grommunio-sync-top.php` oder die Benutzeroberfläche von grommunio Admin, um die Verbindungen anzuzeigen.

## Support

Support wird von der grommunio GmbH und ihren Partnern angeboten. Weitere Informationen finden Sie unter <https://grommunio.com/>. Ein Community-Forum finden Sie unter <https://community.grommunio.com/>.

Für direkten Kontakt und die Übermittlung von Informationen zu einer sicherheitsrelevanten verantwortungsvollen Offenlegung wenden Sie sich bitte an [dev@grommunio.com](dev@grommunio.com).

## Mitwirken

- <https://docs.github.com/en/get-started/quickstart/contributing-to-projects>
- Alternativ können Sie die Commits in einen Git-Speicher Ihrer Wahl hochladen oder die Serie mithilfe von [git format-patch](https://git-scm.com/docs/git-format-patch) als Patchset exportieren und uns den Git-Link bzw. die Patches dann über unsere direkte Kontaktadresse (siehe oben) zukommen lassen.

### Programmierstil

Dieses Repository folgt einem benutzerdefinierten Programmierstil, der jederzeit mithilfe der im Repository bereitgestellten [Konfigurationsdatei](.phpcs) überprüft werden kann.
