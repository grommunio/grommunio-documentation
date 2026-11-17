---
title: "Einleitung"
description: "Dieses Administratorhandbuch behandelt alle Aspekte der Installation, des Betriebs und der Wartung der grommunio-Software-Suite. Die Zielgruppe für…"
sidebar:
  order: 10
---

Dieses Administratorhandbuch behandelt alle Aspekte der Installation, des Betriebs und der Wartung der grommunio-Software-Suite. Diese Dokumentation richtet sich an Administratoren und Systembetreiber, die grommunio einsetzen.

## Über

grommunio bietet eine Kommunikationslösung mit umfassendem Funktionsumfang, die alle Aspekte des Zeitalters der softwaredefinierten Kommunikation abdeckt. Als moderne und modulare Plattform trägt grommunio dazu bei, alle Anforderungen der modernen Kommunikation zu vereinfachen, indem es folgende Funktionen bereitstellt:

- E-Mail
- Kalender
- Kontakte
- Aufgaben
- Notizen
- Videokonferenzen
- Chat
- Dateisynchronisierung und -freigabe
- Web-Office

## Überblick und Konzepte

grommunio wird als integrierte Software appliance für die Bereitstellung auf Zielsystemen ausgeliefert und kombiniert ein eingebettetes, optimiertes Betriebssystem auf Basis von openSUSE. Während grommunio auch Software-Repositorys für die wichtigsten Linux-Plattformen bereitstellt, ermöglicht die Software appliance eine schnelle Bereitstellung auf einer Vielzahl von Plattformen, einschließlich Bare-Metal- und virtualisierten Umgebungen.

grommunio wird außerdem als Container-Images ausgeliefert, die auf einem einzelnen Host mit [Docker Compose](/admin/container_core/) oder mit dem grommunio Helm-Chart auf [Kubernetes](/admin/kubernetes/) laufen. Die Images und das Chart sind signiert und werden in der [grommunio Container-Registry](/admin/container_registry/) veröffentlicht.

## Architektur

Der Software-Komponentenstapel des grommunio ist modular aufgebaut und besteht aus den folgenden Hauptkomponenten:

| Komponente | Funktion | Komponentengruppe |
|----|----|----|
| **gromox-delivery**, **gromox-delivery-queue** | Lokaler Zustellagent, der von Postfix empfangene Nachrichten in E-Mail-Speicher ablegt | grommunio Groupware |
| **gromox-event** | Software-Bus-Mechanismus für die Interprozesskommunikation (IPC), der die Kommunikation zwischen mehreren Prozessen ermöglicht, die gleichzeitig auf mehreren Rechnern laufen. | grommunio-Groupware |
| **gromox-http** | HTTP/RPCH-Protokollhandler (RPC-over-HTTP, MAPI-over-HTTP, EWS, optionaler FastCGI-Passthrough); hostet zudem die Informationsspeicher-/Mailbox-Engine (exmdb_provider) | grommunio Groupware |
| **gromox-imap** | IMAP-Schnittstelle, die IMAP-Clients branchenführende Leistung bietet | grommunio Groupware |
| **gromox-pop3** | POP3-Schnittstelle | grommunio-Groupware |
| **gromox-zcore** | Brückenprozess zwischen PHP-MAPI und exmdb | grommunio-Groupware |
| **gromox-midb** | Nachrichtenindex-Datenbank, hauptsächlich ein Beschleunigungsmechanismus zur Nutzung durch IMAP | grommunio-Groupware |
| **grommunio-antispam** | grommunio-antispam hält Ihren E-Mail-Dienst nicht nur frei von Spam, sondern bietet auch Schnittstellen für Virenscans und Filterung | grommunio-Groupware |
| **grommunio-admin-api** | Eine REST-Schnittstelle zur Automatisierung, die die Grundlage für die Verwaltungs-Weboberfläche von grommunio bildet | grommunio Admin |
| **grommunio-admin-web** | grommunio-admin-web ist die zentrale Verwaltungsschnittstelle für die System-, Domänen- und Benutzerverwaltung | grommunio Admin |
| **grommunio-web** | grommunio-web ist die zentrale Weboberfläche für Benutzer und bietet browserbasierten Clients ein reichhaltiges Benutzererlebnis | grommunio-Webdienst |
| **grommunio-sync** | grommunio-sync stellt den zentralen EAS-Dienst (Exchange ActiveSync) für native Clients wie iOS, Android und andere EAS-fähige Clients | grommunio-Webdienst |
| **grommunio-dav** | grommunio-dav stellt den Hauptdienst CardDAV und CalDAV für native Clients bereit, wie z. B. macOS und andere kompatible Clients | grommunio-Webdienst |
| **grommunio-files** | grommunio-files stellt die Funktionen zur Dateisynchronisierung und -freigabe bereit, die für Web- und native Clients verfügbar sind | grommunio Files |
| **grommunio-chat** | grommunio-chat stellt die wichtigsten Chat-Funktionen für Unternehmen bereit, die für Web- und native Clients verfügbar sind | grommunio Chat |
| **grommunio-meet** | grommunio-meet ist die webbasierte Unternehmens-Besprechungsfunktion, die für Web- und native Clients verfügbar ist | grommunio Meet |
| **grommunio-office** | grommunio-office ist die webbasierte Software-Suite für die Zusammenarbeit an Dokumenten, verfügbar für Web-Clients | grommunio Office |
| **grommunio-archive** | grommunio-archive bietet eine rechtskonforme Archivierungslösung, die für Web-Clients verfügbar ist | grommunio Archive |

Weitere Softwarekomponenten, die in Verbindung mit grommunio verwendet werden:

- MariaDB ist die zentrale Datenbank für alle Benutzer-Metadaten und dient als Hauptdatenbank für alle Backend-Dienste. In dieser Datenbank werden keine Benutzer-Nutzdaten (E-Mails usw.) gespeichert.
- Postfix bietet erstklassige Funktionalität und Vielseitigkeit als De-facto-Standard MTA, der selbst die anspruchsvollsten E-Mail-Routing-Konfigurationen ermöglicht.
- nginx ist ein schneller, robuster und moderner Webserver, der als Hauptwebserver fungiert und wichtige Dienste über HTTP und RPC für Clients bereitstellt.
- SQLite dient zur Speicherung der individuellen Postfache der Benutzer.

Einige Komponenten von grommunio werden als Forks anderer erfolgreicher Open-Source-Software ausgeliefert. Während grommunio ausschließlich die Open-Source-Varianten (mit einigen zusätzlichen Integrationsfunktionen) bereitstellt, bieten viele dieser Open-Source-Anbieter auch Enterprise-Varianten ihrer Softwarekomponenten an. Sofern die Softwarekomponente durch das grommunio-Abonnement abgedeckt ist, bietet grommunio auch Support für die Open-Source-Varianten dieser Komponenten an. Die Nutzung der Unternehmensvarianten der jeweiligen Anbieter wird aus Integrationssicht unterstützt, jedoch nicht für das Produkt des Anbieters selbst.

Bei grommunio hat es oberste Priorität, den Benutzern ein nahtloses Kommunikations- und Zusammenarbeitserlebnis und den Administratoren eine schlüsselfertige Installation zu bieten. Diese Ziele haben zur Einbindung weiterer Softwarekomponenten mit zusätzlichen Funktionen (wie beispielsweise der Authentifizierung über einen einzigen Stack) geführt. Auf diese Weise bleibt der Integrationsaufwand für Administratoren gering, während die Nutzer vom Zusammenspiel mehrerer Softwarekomponenten profitieren und so ein nahtloses Erlebnis erhalten.

Zur Information: Die Komponenten der Softwareprodukte, die im Rahmen des grommunio-Stacks abgezweigt wurden, sind:

- grommunio-files ist ein Fork von Nextcloud mit Verbesserungen bei der Authentifizierung und der Einrichtung (<https://nextcloud.com/>)
- grommunio-meet ist ein Fork von Jitsi mit Verbesserungen bei der Integration (<https://jitsi.org/>)
- grommunio-office ist ein Fork von OnlyOffice Web mit Verbesserungen bei der Integration (<https://www.onlyoffice.com/>)
- grommunio-chat ist ein Fork einer Open-Source-Chat-Plattform mit Verbesserungen bei der Authentifizierung und Integration
- grommunio-archive ist ein Fork von Piler mit Verbesserungen bei der Authentifizierung und Integration (<https://www.mailpiler.org/>)
- grommunio-antispam ist ein Fork von rspamd mit Verbesserungen bei der Integration (<https://rspamd.com/>)

grommunio pflegt diese Softwarelösungen und integriert sie in die von grommunio angebotenen Bereitstellungsziele, wie beispielsweise die Software appliance, Container-Images, das Helm-Chart für Kubernetes und gut aufbereitete Softwarekomponenten, die für alle gängigen Linux-Distributionen verfügbar sind. Alle diese Komponenten werden von grommunio entsprechend der jeweiligen Abonnementstufe vollständig unterstützt.

Falls eine Umgebung oder eine ähnliche Installation vorhanden ist, können diese Komponenten auf Schnittstellenebene integriert werden. Beachten Sie, dass grommunio keine Installationen unterstützen kann, die nicht von grommunio bereitgestellt wurden. Sind jedoch bestehende Unternehmensinstallationen vorhanden, ist die Integration dieser Systeme bei korrekter Konfiguration möglich. grommunio-Abonnements bieten Unterstützung für die Integration mit diesen Unternehmensvarianten oder – je nach den verfügbaren Schnittstellen – sogar für alternative Lösungen.

grommunio bietet eine Vielzahl von Schnittstellen, über die andere Lösungen in grommunio integriert werden können. Aufgrund des modularen Aufbaus der grommunio-Software ist die Verwendung der von grommunio mitgelieferten Zusatzkomponenten nicht zwingend erforderlich. Bei schlüsselfertigen Lösungen, insbesondere im KMU-Markt, hilft die Auslieferung dieser Komponenten mit vereinfachtem Integrationsaufwand den Administratoren dabei, den grommunio innerhalb weniger Minuten als umfassende Kommunikationsplattform zu installieren und in Betrieb zu nehmen.

:::tip
Die vollständige Komponentenarchitektur – den Protokoll-/Komponentenablauf, das
Multi-Server-Design und die Beispiele für Lastverteiler (HAProxy/NGINX) – finden Sie unter
[Architektur](/admin/architecture/).
:::
