---
title: "grommunio DAV"
description: "carddavs.tcp 86400 IN SRV 10 20 443 my.example.com."
sidebar:
  order: 40
---

> Quelle: [grommunio-dav](https://github.com/grommunio/grommunio-dav) README.

## grommunio DAV

<strong>grommunio DAV ist eine Open-Source-Anwendung, die CalDAV und CardDAV für kompatible Anwendungen und Geräte wie macOS Kalender, macOS Kontakte, Thunderbird/Lightning und andere bereitstellt.</strong>

   

## Auf einen Blick

- Bietet standardisierte CalDAV- und CardDAV-Schnittstellen für Groupware-Daten (Kontakte, Kalender und Aufgaben).
- Die plattformübergreifende Unterstützung umfasst verschiedene CalDAV- und CardDAV-Clients, wie beispielsweise den macOS-Kalender, macOS Kontakte, Thunderbird/Lightning, Evolution und viele andere CalDAV/CardDAV-Clients sowie weitere verwendete Anwendungen wie [Dash](https://get-dash.com).
- Kompatibel, funktioniert mit verschiedenen Webservern wie nginx, Apache und anderen; die Verwendung von nginx wird empfohlen.
- Hocheffizient, mit einem durchschnittlichen Speicherverbrauch von 4 MB pro Verbindung und Gerät (bei Verwendung von nginx mit PHP-FPM).
- Verteilbar, kompatibel mit Load-Balancern wie HAProxy, Apisix, KEMP und anderen.
- Skalierbar, ermöglicht Bereitstellungen mit mehreren Servern und an mehreren Standorten.
- Hochleistungsfähig, ermöglicht eine Speichersynchronisation nahezu mit Leitungsgeschwindigkeit.
- Sicher, mit Zertifizierungen durch unabhängige Sicherheitsforschung und -validierung.

## Erstellt mit

- PHP 8.x
- PHP-Module: ctype, curl, dom, iconv, mbstring, sqlite, xml, xmlreader, xmlwriter
- PHP-Backend-Modul: mapi

## Erste Schritte

### Voraussetzungen

- Ein funktionierender <strong>Webserver</strong> (nginx wird empfohlen) mit einer funktionierenden TLS-Konfiguration
- <strong>PHP</strong>, vorzugsweise als fpm-Pool verfügbar
- <strong>Zcore</strong> MAPI-Transport (bereitgestellt von [Gromox](https://github.com/grommunio/gromox))

### Installation

- Stellen Sie das grommunio-dav an einem Ort Ihrer Wahl auf, beispielsweise `/usr/share/grommunio-dav-dev`.

- Passe `version.php` mit der entsprechenden Versionszeichenfolge an, siehe [/build/version.php.in](https://github.com/grommunio/grommunio-dav/blob/master/build/version.php.in).

- Stellen Sie eine Standardkonfigurationsdatei namens „config.php“ bereit, siehe [/config.php](https://github.com/grommunio/grommunio-dav/blob/master/config.php).

- Passen Sie die Konfiguration des Webservers an Ihre Bedürfnisse an; [/build](https://github.com/grommunio/grommunio-dav/blob/master/build) enthält einige Beispiele.

- Passen Sie die Konfiguration von PHP an Ihre Anforderungen an; unter [/build](https://github.com/grommunio/grommunio-dav/blob/master/build) finden Sie einige Beispiele.

- (Optional) Es wird empfohlen, DNS-SRV-Einträge einzurichten, um die Konfiguration des Kontos zu vereinfachen:

  ``` text
  _carddavs._tcp 86400 IN SRV 10 20 443 my.example.com.
  _caldavs._tcp  86400 IN SRV 10 20 443 my.example.com.
  _caldavs._tcp  86400 IN TXT path=/dav
  _carddavs._tcp 86400 IN TXT path=/dav
  ```

### Protokollierung

grommunio DAV verwendet [monolog](https://seldaek.github.io/monolog/) für die Protokollierung. Passen Sie [/glogger.ini](https://github.com/grommunio/grommunio-dav/blob/master/glogger.ini) an Ihre Anforderungen an.

### Verwendung

- Sie können in Ihrem Webbrowser die Adresse `https://my.example.com/dav/` aufrufen oder alternativ direkt die URL Ihres Kalenders `https://my.example.com/dav/calendars/<user>/Calendar/`
- Geben Sie Ihre Anmeldedaten (Benutzername und Passwort) ein

## Support

Support wird von der grommunio GmbH und ihren Partnern angeboten. Weitere Informationen finden Sie unter <https://grommunio.com/>. Ein Community-Forum finden Sie unter <https://community.grommunio.com/>.

Für direkten Kontakt und die Übermittlung von Informationen zu einer sicherheitsrelevanten verantwortungsvollen Offenlegung wenden Sie sich bitte an [dev@grommunio.com](dev@grommunio.com).

## Mitwirken

- <https://docs.github.com/en/get-started/quickstart/contributing-to-projects>
- Alternativ können Sie die Commits in einen Git-Speicher Ihrer Wahl hochladen oder die Serie mithilfe von [git format-patch](https://git-scm.com/docs/git-format-patch) als Patchset exportieren und uns den Git-Link bzw. die Patches dann über unsere direkte Kontaktadresse (siehe oben) zukommen lassen.

### Programmierstil

Dieses Repository folgt einem benutzerdefinierten Programmierstil, der jederzeit mithilfe der im Repository bereitgestellten [Konfigurationsdatei](.phpcs) überprüft werden kann.
