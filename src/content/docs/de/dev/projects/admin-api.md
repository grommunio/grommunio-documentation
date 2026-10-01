---
title: "Admin API"
description: "grommunio Admin API ist die zentrale API-Komponente von grommunio, die appliance(s), Domänen, Benutzer und mehr verwaltet. grommunio API koordiniert alle Komponenten…"
sidebar:
  order: 50
---

> Quelle: [admin-api](https://github.com/grommunio/admin-api) README.

## grommunio Admin API

grommunio Admin API ist die zentrale API-Komponente von grommunio, die appliance(e), Domänen, Benutzer und mehr verwaltet. grommunio API koordiniert alle Komponenten und Architekturen, die für den Betrieb und die Verwaltung des gesamten grommunio-Stacks erforderlich sind.

<details open="open">
<summary>Übersicht</summary>

- [Über](#about)
  - [Entwickelt mit](#built-with)
- [Erste Schritte](#getting-started)
  - [Voraussetzungen](#prerequisites)
  - [Installation](#installation)
- [Verwendung](#usage)
- [Status](#status)
- [Support](#support)
- [Projektunterstützung](#project-assistance)
- [Mitwirken](#contributing)
- [Sicherheit](#security)
- [Programmierstil](#coding-style)
- [Lizenz](#license)

</details>

---

### Über grommunio Admin API

- [OpenAPI 3.0](https://swagger.io/specification/)-basiertes REST API und interaktives CLI
- Webbasierter Zugriff über [grommunio Admin Web](https://github.com/grommunio/admin-web)
- Verwaltung von grommunio-Komponenten
- Benutzer-, Gruppen- und Mailinglistenverwaltung
- Benutzersynchronisation mit LDAP-fähigen Backends
- Abruf von Konten über fetchmail
- Verwaltung öffentlicher Ordner
- Rollenverwaltung mit System-, Organisations- und Domänenrollen
- Mandantenverwaltung mit Organisationen und Domänen
- Konfiguration über grommunio-dbconf
- Verbindungsstatus in Echtzeit, einschließlich mobiler Geräte
- Protokoll-Viewer
- Mail-Transport-Warteschlange und Aufgabenwarteschlange
- Verteilbar, kompatibel mit Load-Balancern wie haproxy, apisix, KEMP und anderen
- Sicher, mit erweiterten Sicherheitsprüfungen und CSRF-Tokens

### Erste Schritte

#### Voraussetzungen

- `uwsgi` Anwendungsserver mit `uwsgi-python3` Plugin
- `MySQL` oder `MariaDB` Datenbankserver als zentraler Speicher (wie von [gromox](https://github.com/grommunio/gromox) verwendet und eingerichtet)
- `python3-pyexmdb` für die gromox-Speicherverwaltung (bereitgestellt von [libexmdbpp](https://github.com/grommunio/libexmdbpp))
- Empfohlen: ein Webserver mit einer funktionierenden TLS-Konfiguration (z. B. `nginx`)

#### Installation

- Installieren Sie die in der [Pipfile](Pipfile) aufgeführten erforderlichen Pakete, entweder als Systempakete oder in einer virtuellen Umgebung
- Stellen Sie die Admin-API an einem Ort Ihrer Wahl bereit, z. B. `/usr/share/grommunio-admin-api`
- Konfigurieren Sie die [Datenbankverbindung](conf.d/README.md#Database)
- Passen Sie [Konfiguration](conf.d/README.md) nach Bedarf an
- Führen Sie die Datei [main.py](main.py) mit `uwsgi` aus ([Beispielkonfiguration](data/api-config.ini), [Dokumentation](https://uwsgi-docs.readthedocs.io/en/latest/Configuration.html))

### Verwendung

- Verwenden Sie die Referenz grommunio Admin, API und CLI für den Betrieb ab [https://docs.grommunio.com/man/grommunio-admin.html0

oder

- Verwenden Sie Ihren API-Client, um Aufrufe zu generieren, basierend auf der [OpenAPI-Spezifikation](res/openapi.yaml)

### Support

- Support wird von der [grommunio GmbH](https://grommunio.com) und ihren Partnern angeboten.
- Die grommunio Admin- und API-Community finden Sie hier: [grommunio Community](https://community.grommunio.com)

Für den direkten Kontakt zu den Betreuern (beispielsweise um Informationen zu einer sicherheitsrelevanten verantwortungsvollen Offenlegung zu übermitteln) können Sie sich direkt an grommunio unter [dev@grommunio.com](mailto:dev@grommunio.com) wenden.

### Mitwirken

Zunächst einmal vielen Dank, dass du dir die Zeit für einen Beitrag genommen hast! Es sind gerade diese Beiträge, die die Open-Source-Community zu einem so großartigen Ort zum Lernen, zur Inspiration und zum Gestalten machen. Jeder Beitrag, den du leistest, kommt allen anderen zugute und wird sehr geschätzt.

Bitte lies dir [unsere Richtlinien für Beiträge](doc/CONTRIBUTING.md) durch und vielen Dank für dein Engagement!

### Sicherheit

grommunio Admin API befolgt bewährte Sicherheitspraktiken. grommunio überwacht kontinuierlich sicherheitsrelevante Probleme.
grommunio Admin API wird „wie besehen“ ohne jegliche Gewährleistung bereitgestellt. Informationen zu professionellen Support-Optionen im Rahmen von Abonnements finden Sie unter [grommunio](https://grommunio.com).

_Weitere Informationen sowie Hinweise zur Meldung von Sicherheitsproblemen finden Sie in unserer [Sicherheitsdokumentation](doc/SECURITY.md)._

### Programmierstil

Dieses Repository folgt einem Programmierstil, der sich lose am PEP8-Standard orientiert (Ausnahme: maximale Zeilenlänge von 127).

### Lizenz

Dieses Projekt unterliegt der GNU Affero General Public License v3.

Weitere Informationen finden Sie unter [LICENSE](LICENSE.txt).
