---
title: "grommunio Web"
description: "grommunio Web bildet zudem die Grundlage für grommunio Desk, einen plattformübergreifenden Client, der so konzipiert ist, dass er auf Ihrem Desktop ohne spezielle Browseranforderungen ausgeführt werden kann."
sidebar:
  order: 20
---

> Quelle: [grommunio-web](https://github.com/grommunio/grommunio-web) README.

## grommunio Web

<strong>grommunio Web ist eine Open-Source-Webanwendung und bietet alle bekannten E-Mail-, erweiterten Kalender- und Kontaktfunktionen, die Sie für ein produktives Arbeiten benötigen. Sie ist die zentrale Webanwendung für den Zugriff auf Ihren Produktivitäts-Arbeitsbereich, einschließlich E-Mail, Kalender, Kontakte, Aufgaben, Notizen und mehr.</strong>

   

grommunio Web bildet zudem die Grundlage für grommunio Desk, einen plattformübergreifenden Client, der so konzipiert ist, dass er auf Ihrem Desktop ohne spezielle Browseranforderungen ausgeführt werden kann.

## Auf einen Blick

- Bietet Anbindung an webbasierte Groupware (E-Mails, Kontakte, Kalender, Aufgaben und Notizen).
- Enthält Erweiterungen zur Integration von grommunio Meet, Chat-Archiv und mehr.
- Kompatibel, funktioniert mit jedem modernen Webbrowser wie Chrome, Edge, Firefox, Safari und anderen.
- Einfach zu bedienen, bietet eine ausgefeilte Benutzeroberfläche, für die nahezu keine Einarbeitung der Benutzer erforderlich ist.
- Verteilbar und kompatibel mit Load-Balancern wie haproxy, apisix, KEMP und anderen.
- Skalierbar und in der Lage, Zehntausende von Sitzungen gleichzeitig auszuführen.
- Schnell, mit einer reaktionsschnellen Benutzeroberfläche, die fast sofort auf Benutzeraktionen reagiert.
- Sicher, mit Zertifizierungen durch unabhängige Sicherheitsforschung und -validierung.

## Kompatibilität

- PHP 8.x
- Erforderliche Module: json, gd, gettext, mapi, xml
- Erforderliches Backend: gromox-zcore

## Erste Schritte

### Voraussetzungen

- Ein funktionierender <strong>Webserver</strong> (nginx wird empfohlen) mit einer funktionierenden TLS-Konfiguration
- <strong>PHP</strong>, vorzugsweise mit dem FPM-Executor
- <strong>Zcore</strong> MAPI-Transport (bereitgestellt von [Gromox](https://github.com/grommunio/gromox))

### Installation

- Stellen Sie grommunio-web an einem Ort Ihrer Wahl bereit, z. B. `/usr/share/grommunio-web`.
- Überprüfen Sie die Konfigurationsdatei und speichern Sie sie unter `/etc/grommunio-web/config.php`. Orientieren Sie sich dabei an der Vorlage in [/config.php.dist](https://github.com/grommunio/grommunio-web/blob/master/config.php.dist).
- Passen Sie die Webserver-Konfiguration an Ihre Anforderungen an. [/build](https://github.com/grommunio/grommunio-web/blob/master/build) enthält einige Beispiele.
- Bereiten Sie die Konfiguration von PHP entsprechend Ihren Anforderungen vor. [/build](https://github.com/grommunio/grommunio-web/blob/master/build) enthält einige Beispiele.

## Support

Support wird von der grommunio GmbH und ihren Partnern angeboten. Weitere Informationen finden Sie unter <https://grommunio.com/>. Ein Community-Forum finden Sie unter <https://community.grommunio.com/>.

Für direkten Kontakt und die Übermittlung von Informationen zu einer sicherheitsrelevanten verantwortungsvollen Offenlegung wenden Sie sich bitte an [dev@grommunio.com](dev@grommunio.com).

## Mitwirken

- <https://docs.github.com/en/get-started/quickstart/contributing-to-projects>
- Alternativ können Sie die Commits in einen Git-Speicher Ihrer Wahl hochladen oder die Serie mithilfe von [git format-patch](https://git-scm.com/docs/git-format-patch) als Patchset exportieren und uns den Git-Link bzw. die Patches dann über unsere direkte Kontaktadresse (siehe oben) zukommen lassen.

## Entwicklung

### Programmierstil

Dieses Repository folgt einem benutzerdefinierten Programmierstil, der jederzeit mithilfe der im Repository bereitgestellten [Konfigurationsdatei](.phpcs) überprüft werden kann.

### Einrichtung der Entwicklungsumgebung

Stellen Sie zunächst sicher, dass Sie über die folgenden Komponenten in funktionsfähiger Form verfügen:

- gromox-http
- gromox-zcore
- php-mapi
- nginx

Checken Sie das Repository in ein neues Verzeichnis aus, z. B. `/usr/share/grommunio-web-dev`.

Wenn Sie die vorhandene grommunio-web-Konfiguration verwenden möchten, verweisen Sie mit `config.php` darauf:

``` sh
ln -s /etc/grommunio-web/config.php /usr/share/grommunio-web-dev/config.php
```

oder verwenden Sie die Datei `config.php.dist`:

``` sh
cp -p /usr/share/grommunio-web-dev/config.php.dist /usr/share/grommunio-web-dev/config.php
```

Wenn Sie die vorhandenen grommunio-web-Standardwerte verwenden möchten, kopieren Sie die Datei `defaults.php`:

``` sh
cp -p /usr/share/grommunio-web/defaults.php /usr/share/grommunio-web-dev/defaults.php
```

Stellen Sie sicher, dass Sie `/usr/share/grommunio-web-dev/defaults.php` wie folgt anpassen, um Quellen anstelle der Release-Variante zu verwenden: Suchen Sie nach…

``` php
if (!defined('DEBUG_LOADER')) define('DEBUG_LOADER', LOAD_RELEASE);
```

und ersetze es durch

``` php
if (!defined('DEBUG_LOADER')) define('DEBUG_LOADER', LOAD_SOURCE);
```

Zu Debugging-Zwecken kann es sinnvoll sein, die Datei `debug.php` zu aktivieren:

``` sh
cp -p /usr/share/grommunio-web-dev/debug.php.dist /usr/share/grommunio-web-dev/debug.php
```

Passen Sie abschließend die Konfigurationsdatei „nginx“ `/usr/share/grommunio-common/nginx/locations.d/grommunio-web.conf` an (oder kopieren Sie sie), indem Sie

``` text
alias /usr/share/grommunio-web/;
```

mit

``` text
alias /usr/share/grommunio-web-dev/;
```

Überprüfen Sie nach dem Ändern der Konfiguration Ihre nginx-Konfiguration mit dem Befehl `nginx -t` und laden Sie sie mit `systemctl reload nginx` neu.

## Übersetzungen

Aus Leistungsgründen werden die Sprachen in den gemeinsamen Speicher des laufenden Systems geladen. Nach Änderungen an den Übersetzungsdateien sollten Sie die gettext-Strings neu generieren (siehe `Makefile`) und sicherstellen, dass Sie das gemeinsame Speichersegment für den Cache leeren:

``` sh
ipcrm -M 0x950412de
```

Die Übersetzungen werden über ein [Weblate-Projekt](https://hosted.weblate.org/projects/grommunio/grommunio-web/) verwaltet. Die Beiträge werden regelmäßig überprüft und in die Release-Zyklen von grommunio Web integriert.
