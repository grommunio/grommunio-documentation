---
title: "Release Notes"
description: "Versionshinweise für grommunio, beginnend mit der neuesten Version. Die aktuelle Version 2026.06.2 bringt Single Sign-On für die gesamte Suite, grommunio Web 5.1 mit Dunkelmodus und OpenPGP sowie gromox 3.11."
sidebar:
  order: 100
---

## grommunio 2026.06.2

- Art der Veröffentlichung: Minor-Release
- Veröffentlichungsdatum: 30. September 2026
- Allgemeine Verfügbarkeit: Ja

grommunio 2026.06.2 ist das erste große Update zu 2026.06.1. Zwei Dinge stechen besonders hervor. Erstens umfasst Single Sign-On nun die gesamte Suite: Mit einer einzigen grommunio-Anmeldung erhalten Sie Zugriff auf Web, Admin, Chat, Files, Meet und Archive. Zweitens ist grommunio Web 5 da – mit neuem Design, vollständigem Dunkelmodus, OpenPGP, einem echten Dokumentenbetrachter und vielem mehr. Im Unterbau wurde gromox auf Version 3.11 aktualisiert, und so gut wie jede andere Komponente ebenfalls.

**Highlights**

- **Ein Login für alles** – grommunio Auth richtet die Keycloak-Clients für Chat, Files, Meet, Archive und Admin selbst ein und hält sie aktuell, wenn Pakete installiert oder aktualisiert werden. Das Durchklicken der Keycloak-Konsole für jede Komponente entfällt.
- **grommunio Web 5.0 und 5.1** – neu gestaltete Oberfläche mit durchgängigem Dunkelmodus, Befehlspalette (Strg+K), Rückgängig und Wiederherstellen, OpenPGP neben S/MIME, Vorschau im Browser für fast alle Anhänge sowie Outlook-kompatible Kategorien.
- **gromox 3.11** – IMAP-Schlüsselwörter und FETCH BINARY, verbesserte Behandlung von Stellvertretern und Besprechungen, Kopien in „Gesendete Elemente“ für freigegebene Postfächer sowie eine lange Liste von Korrekturen für Outlook und EWS.
- **grommunio Files 34** mit grommunio-Branding und SSO-Anmeldung.

**Single Sign-On für die gesamte Suite**

Bisher war es mit erheblichem manuellem Aufwand in Keycloak verbunden, SSO für jede Komponente einzurichten. grommunio Auth erstellt die Clients für Chat, Files, Meet, Archive und Admin nun selbstständig über ein eigenes Dienstkonto und läuft automatisch erneut, sobald eines dieser Pakete installiert oder aktualisiert wird. Rollen, die später mit grommunio-setup hinzugefügt werden, werden ebenfalls in SSO eingebunden.

- **grommunio Admin** bietet auf der Anmeldeseite die Schaltfläche „Mit Single Sign-On anmelden“ (nur über HTTPS). Die lokale Admin-Anmeldung funktioniert weiterhin.
- **grommunio Chat** meldet Benutzer über Keycloak an. Der neue Befehl `grommunio-admin chat sso enable|disable` stellt bestehende Chat-Konten zwischen Passwort-Anmeldung und SSO um, für alle Domänen oder nur für eine (`-d DOMAIN`).
- **grommunio Files** überspringt das eigene Anmeldeformular und leitet direkt zu Keycloak weiter. Das lokale Formular bleibt unter `/files/index.php/login?direct=1` erreichbar.
- **grommunio Meet** authentifiziert ebenfalls über Keycloak.
- **grommunio Archive** unterstützt die Anmeldung über OpenID Connect.
- **grommunio Web** greift mit dem Keycloak-Zugriffstoken auf Files zu, sodass beim Öffnen von Dateien keine zweite Anmeldung nötig ist.

**grommunio Web 5.1**

Das umfangreichste Update, das der Web-Client je erhalten hat – mit mehr als 460 Änderungen seit Version 3.19. Der große Versionssprung ist bewusst gewählt: Code, Plugin-Schnittstellen und Einstellungen tragen nun durchgehend den Namen grommunio, und die letzten Überbleibsel aus der Zarafa-Zeit sind entfernt.

- **Neues Design** – überarbeitete Oberfläche mit größeren Bedienelementen und neuem Anmeldebildschirm; Dunkelmodus für den gesamten Client, die mitgelieferten Plugins und den Dokumentenbetrachter, umschaltbar über die obere Leiste ohne Neuladen; JSON-Themes färben den gesamten Client ein, einschließlich eines eigenen Logos für den Dunkelmodus; zweifarbige Ordnersymbole, Hervorhebung ganzer Ordnerzeilen und sichtbarer Tastaturfokus.
- **Schneller ans Ziel** – Befehlspalette mit Strg+K, um zu jedem Ordner, jeder Ansicht oder Einstellungsseite zu springen oder neue Elemente anzulegen; Strg+F springt direkt ins Suchfeld (unter macOS mit Cmd und Option); Rückgängig und Wiederherstellen (Strg+Z / Strg+Y) für Löschen, Verschieben, Kopieren, Kennzeichnen, Lesestatus, Kategorien und Verschieben im Kalender, zu aktivieren unter Einstellungen › Allgemein.
- **Mail** – OpenPGP (Signieren, Verschlüsseln, Entschlüsseln, Prüfen) direkt neben S/MIME; die gesamte Kryptografie läuft im Browser, private Schlüssel bleiben passphrasengeschützt im Postfach des Benutzers. Ein vollwertiger Dokumentenbetrachter für PDF, Word (auch .doc), Excel und CSV, PowerPoint, OpenDocument, RTF, Markdown, Quellcode, Bilder, Audio, Video und angehängte .eml-Nachrichten; mehrere Anhänge per Drag & Drop in ein anderes Verfassen-Fenster oder als ZIP auf den Desktop ziehen; Anhänge aus bereits abgelegten Nachrichten entfernen (durch Administratoren abschaltbar); aus Word eingefügte Bilder kommen nun tatsächlich an; BIMI-Logos neben Absendern, die eines veröffentlichen und DMARC bestehen; Haftnotizen an E-Mails, sichtbar für alle, die das Postfach gemeinsam nutzen.
- **Funktioniert wie Outlook** – Kategorien werden in der Master-Kategorienliste des Postfachs gespeichert, sodass Web, Outlook und Mobilgeräte dieselben Namen und Farben zeigen (vorhandene Kategorien werden automatisch übernommen); sichere und blockierte Absender verwenden dieselbe Junk-E-Mail-Regel wie Outlook.
- **Freigegebene Postfächer, Suche und Benachrichtigungen** – Unterhaltungsansicht in freigegebenen Postfächern; freigegebene Postfächer lassen sich per Drag & Drop anordnen; die Suche umfasst öffentliche Ordner samt Unterordnern, und Suchpräfixe funktionieren in der Sprache des Benutzers (Deutsch: *von:*, *an:*, *betreff:*); Benachrichtigungen lassen sich auf das eigene Postfach oder ausgewählte Ordner beschränken, zeigen Absender und Betreff und können stumm geschaltet werden; der Dialog „Kopieren/Verschieben“ schlägt Ordner vor, in denen E-Mails dieses Absenders zuvor abgelegt wurden.
- **Neu in 5.1** – Profilbilder aus einer Datei, von Gravatar oder Libravatar, mit Zuschneidedialog; der Termindialog zeigt, in welchen Kalender ein neuer Termin eingetragen wird; die Terminplanungsansicht passt sich der Teilnehmerliste an; alle Stellvertreter werden in den Einstellungen aufgelistet; vollständig in 34 Sprachen übersetzt; eingefügte Inhalte übertragen ihre Schriften und Farben nicht mehr in den Editor; Korrekturen für fehlerhafte Serien, die das Laden des Kalenders verhinderten, für Links in E-Mails, die relativ zu grommunio Web geöffnet wurden, für das Drucken von Bildern, für Zeitzonenverschiebungen bei einigen Terminen sowie für eine Reihe von Darstellungsproblemen im Dunkelmodus.
- **Geschwindigkeit** – Anfragen derselben Anmeldung laufen parallel, sodass ein langsamer Ordner in einem Tab die anderen nicht blockiert; Skripte, Stile und Übersetzungen werden vom Browser zwischengespeichert und vorkomprimiert ausgeliefert; der Ordnerbaum von Files lädt bei 40 Ordnern in unter einer Zehntelsekunde (zuvor über drei Sekunden).
- **Sicherheit und Cyber Resilience Act** – jedes Release enthält eine Software-Stückliste (SBOM) im CycloneDX- und SPDX-Format, alle Quelldateien tragen SPDX-Header, und eine veröffentlichte Sicherheitsrichtlinie beschreibt, wie Schwachstellen behandelt und gemeldet werden. Dazu kommen strengere Prüfungen gegen Cross-Site-Anfragen bei Anmeldung, Token und Abmeldung, ein Einmal-State für Keycloak-Anmeldungen, eine Begrenzung der pro Minute gesendeten Nachrichten je Postfach und ein systemd-Timer, der abgelaufene Sitzungen bereinigt.
- **Für Plugin-Entwickler** – der Namensraum `Zarafa` heißt nun `Grommunio`; `zarafa.*`-xtypes, CSS-Klassen und der Einstellungsstamm wurden entsprechend umbenannt. 5.0 behält vorerst Kompatibilitätsaliase (außer für CSS-Klassen); Details beschreibt `doc/plugin-namespace-migration.rst`.

**gromox 3.11**

Neu:

- IMAP-Schlüsselwörter; IMAP-Flags werden nun im Postfach gespeichert und überstehen so den Verlust von `midb.sqlite3`
- IMAP FETCH BINARY und BINARY.SIZE
- Freigegebene Postfächer können eine Kopie der als oder im Auftrag des Postfachs gesendeten E-Mails in ihren eigenen „Gesendeten Elementen“ ablegen (MessageCopyForSentAs / MessageCopyForSendOnBehalf, einstellbar mit den neuen `gromox-mbop`-Befehlen `get-msgcopy`, `set-msgcopy` und `clear-msgcopy`; von EWS noch nicht berücksichtigt)
- Die neue Option `lda_relay_unknown_recipients` übergibt automatische Antworten und Unzustellbarkeitsberichte für lokale Adressen ohne Postfach an den MTA – für Split-Domain-Szenarien
- EWS unterstützt die Antwort-, Allen-antworten- und Weiterleitungs-Entwürfe von Outlook für Mac; EWS FindPeople und GetUserPhoto durchsuchen auch die persönlichen Kontakte
- Eine .pst-Datei kann in einen öffentlichen Ordner importiert werden
- Kurzlebiger Cache für Benutzer- und Gruppenabfragen, der MariaDB/MySQL entlastet
- OpenPGP- und GpgOL-Nachrichten werden bei der Mail-Konvertierung erkannt
- Der Regelprozessor protokolliert, wie seine Bedingungen ausgewertet wurden, was die Fehlersuche bei Regeln deutlich erleichtert

Korrigiert:

- Beantwortet ein Stellvertreter eine Besprechungsanfrage, sieht der Organisator nun die Antwort der eingeladenen Person statt die des Stellvertreters; Besprechungsantworten enthalten die Eigenschaft ORGANIZER und nennen den Stellvertreter in SENT-BY
- Stellvertreter, die keine Besprechungskopien erhalten sollen, erhalten dennoch korrekte Stellvertreterberechtigungen
- Die Unterhaltungsansicht in Outlook ist wieder schneller (der zugehörige Index wurde wiederhergestellt)
- 32-Bit-Outlook stürzt bei einem ausgegrauten Abwesenheitsdialog nicht mehr ab
- Suchordner werden nicht mehr fortlaufend neu befüllt
- Zuverlässigere Wiederverbindung zu exmdb und LDAP nach Netzwerkproblemen
- HTML-Textkörper werden auch dann korrekt erkannt, wenn Anhänge zuerst kommen
- Mehrere Korrekturen für Serienbesprechungen im Regelprozessor
- Ordner zeigen in manchen Fällen nicht mehr weniger Nachrichten an, als sie enthalten
- Deutlich schnellerer kdb2mt-Import tief verschachtelter Nachrichten
- Ein Absturz des HTTP-Servers beim Herunterfahren sowie eine Reihe von EWS-Korrekturen (MoveItem/CopyItem, FindFolder, FindItem, Verarbeitung von Besprechungsanfragen)

Geändert:

- Die Konvertierung von RTF nach HTML läuft in einem separaten Prozess
- Beim Import aus PST oder Kopano wird der Stammordner nicht mehr automatisch an der Spitze des Postfachs verankert; verwenden Sie `gromox-import -B`, um ihn zu platzieren

**grommunio Sync 2.6**

- Entwürfe von ActiveSync-16-Clients mit leerem Send-Element brechen die Synchronisierung nicht mehr ab
- Das Speichern eines Entwurfs bringt dessen Teilnehmer nicht mehr durcheinander
- Nachrichten können direkt aus einer Synchronisierung heraus gesendet werden, wenn der Client dies anfordert
- Chinesische E-Mails in Codepage 936 werden als GB18030 dekodiert

**grommunio DAV 1.8**

- Identitätswechsel (Impersonation)
- Nur lesbare Kalender werden Clients schreibgeschützt angeboten; nicht lesbare Kalender werden gar nicht aufgelistet
- Private Termine und Aufgaben anderer Benutzer werden ausgeblendet, außer für Stellvertreter; alle anderen sehen nur Frei/Gebucht-Informationen
- Fehlgeschlagene Schreibvorgänge werden an den Client gemeldet, statt stillschweigend verworfen zu werden
- Fehlende Ordner beim Durchsuchen des Postfachs eines anderen Benutzers behoben

**grommunio Admin**

Weboberfläche:

- Neues Dashboard und neuer Anmeldebildschirm, passend zu grommunio Web
- Anmeldung per Single Sign-On
- Ordnerberechtigungen pro Benutzer direkt aus dessen Ordnerbaum bearbeiten
- Eine Schritt-für-Schritt-Anleitung für DKIM mit der Schlüsselausgabe im benötigten Format
- Eigenes Logo, Favicon und eigener Titel
- Funktioniert auch unter einem Unterpfad
- Viele kleinere Korrekturen: Speicherbalken ohne Kontingent, Bearbeitung des Benutzerstatus, Zuordnung der Berufsbezeichnung, DMARC in der DNS-Prüfung

API und CLI:

- Anmeldung über OpenID Connect (eingerichtet durch grommunio Auth)
- `passwd --password-stdin` setzt ein Passwort, ohne dass es in der Prozessliste erscheint
- Verwaltung von Store-Besitzern, Senden-als-Berechtigungen und Stellvertretern in der CLI; `user show` listet sie auf
- Doppelte Aliase werden automatisch bereinigt
- Lizenz- und Domänenlimits werden bei der Reaktivierung eines Benutzers geprüft
- Zuverlässigere LDAP-Gruppenimporte (Groß-/Kleinschreibung) und eine Korrektur für AD-Benutzeranmeldungen
- Berechtigungsprüfungen an den Endpunkten für Benutzer-Ordnerberechtigungen
- Die Konfiguration für Web-Statistiken und Host-Status wurde in ein eigenes, optionales Paket verschoben: `grommunio-admin-api-mod-vts`

**Weitere Komponenten**

- **grommunio Files** – Version 34 mit grommunio-Branding und SSO. Korrigiert wurden die ONLYOFFICE-Verbindungsprüfung bei Ausführung über cron oder occ sowie die Warnung zum X-Robots-Tag-Header; die OPcache-Einrichtungswarnung, die mit gromox kollidierte, wurde abgeschaltet. Files gibt es nun auch als Debian-Paket.
- **grommunio Keycloak** – 26.7.4. Das Update auf 26.7.2 behob CVE-2026-18963 (CVSS 9.1) – bitte nicht überspringen. Nicht-interaktive Debian-Installationen bleiben nicht mehr in einer Schleife hängen.
- **grommunio Meet** – SSO; Konferenz-Geheimnisse werden ordnungsgemäß erzeugt statt abgeleitet; eine doppelte Lobby-Komponente entfällt; aktualisiertes Theme.
- **grommunio Office** – Fehler „ONLYOFFICE cannot be reached“ behoben, der durch eine fehlende `api.js` bei Document Server 9.x entstand.
- **grommunio Archive** – SSO-Unterstützung und eine Korrektur für Upgrades.
- **grommunio Antispam** – aktualisiert auf 4.1.5.
- **grommunio Index 1.7** – indiziert nun auch öffentliche Ordner (neue Option `-P`, in `-A` enthalten; abschaltbar mit `index_public=no`) und baut einen beschädigten Index neu auf, statt bei jedem Lauf zu scheitern.
- **mapi-header-php 2.3** – korrigiert jährliche Serien und die Verarbeitung einiger Keycloak-Token und enthält nun die gemeinsamen MAPI-Hilfsfunktionen von Web, Sync und DAV. Web 5.1, Sync 2.6 und DAV 1.8 setzen es voraus.
- **grommunio CUI** – übergibt das Admin-Passwort nicht mehr auf der Befehlszeile.
- **grommunio-setup** – legt Dateien mit Zugangsdaten mit restriktiven Berechtigungen an und bindet neu hinzugefügte Rollen in SSO ein.

**Paketierung und Plattformen**

- Das neue Paket `grommunio-triggers` bündelt Dienst-Neustarts während Upgrades. Zuvor konnte ein großes Upgrade php-fpm so oft neu starten, dass systemd aufgab.
- Logrotation für php-fpm und DAV
- Builds für Ubuntu 26.04
- Zahlreiche Debian-Korrekturen: nicht-interaktive Installationen, Bereinigung von Konfigurationsdateien beim Purge und Berechtigungsprobleme in grommunio-setup-deb
- Branding für Partner: Logos, Farben und Titel lassen sich einheitlich für Web, Admin, die Keycloak-Anmeldung, Files, Meet, Archive und Antispam festlegen

**Vor dem Upgrade**

- Prüfen Sie Web-Plugins von Drittanbietern auf die Namensraum-Änderung in 5.0. Die meisten funktionieren dank der Kompatibilitätsaliase weiter, Plugin-Stylesheets mit `zarafa-*`-Klassen müssen jedoch umbenannt werden.
- Benutzereinstellungen in grommunio Web werden bei der ersten Anmeldung in das neue Format überführt. Weder Administratoren noch Benutzer müssen etwas tun.
- Wenn Sie PST- oder Kopano-Importe skripten, beachten Sie die geänderte Behandlung des Stammordners (eingeführt mit gromox 3.10, in diesem Release enthalten) und verwenden Sie bei Bedarf `gromox-import -B`.

**Aktualisierung**

Bestehende Installationen werden über den üblichen grommunio-Update-Prozess aktualisiert; siehe [Aktualisierung von grommunio](/admin/operations/#updating-grommunio).

**Danksagungen**

Vielen Dank an alle, die Fehler gemeldet, Vorabversionen getestet und Patches eingesendet haben. Beteiligen Sie sich an der Diskussion in der [grommunio-Community](https://community.grommunio.com/).

## grommunio 2026.06.1

- Art der Veröffentlichung: Hauptversion
- Veröffentlichungsdatum: 30. Juni 2026
- Allgemeine Verfügbarkeit: Ja

grommunio 2026.06.1 ist die bislang umfangreichste Version. Die über ein Jahr andauernde Entwicklungsarbeit erstreckt sich über den gesamten Stack – von der C++-Mail-Engine bis hin zum Boot-Modul ISO –, wobei das Leitprinzip unverändert bleibt: Sie behalten die Kontrolle über Ihre eigene Infrastruktur. E-Mails, Kalender, Dateien, Besprechungen, Identitäten und – neu in dieser Version – Ihre KI laufen alle auf Hardware, die Sie selbst kontrollieren, ohne dass etwas über die Cloud eines Drittanbieters geleitet wird.

**Highlights**

- **grommunio AI** – ein Assistent innerhalb von grommunio Web, bei dem Sie das Modell und den Ausführungsort (Cloud oder vollständig lokal) frei wählen können.
- **gromox** – eine schlankere, schnellere Engine: Informationsspeicher-Worker pro Postfach, IMAP4rev2 (RFC 9051), ein deutlich erweiterter EWS und ein von Grund auf neu entwickelter Offline Address Book.
- **Gemeinsam genutzte Postfächer auf Mobilgeräten** — grommunio-sync übernimmt nun die Identitätsübernahme über Exchange ActiveSync.
- **Überarbeitete Verwaltung** — Die Admin-Weboberfläche basiert nun vollständig auf TypeScript und ermöglicht die domänenbezogene Schlüsselgenerierung für DKIM über die Benutzeroberfläche.
- **Eine überarbeitete Suite** — Meet (verwaltetes TURN-Relay), Files (neue Generation), Archive 1.4, Keycloak 26.6.4 und Desk 1.2.
- **Eine neue Plattform** — Das gesamte appliance wurde auf Basis von openSUSE Leap 16.0 neu entwickelt, ergänzt durch native Debian/Ubuntu `.deb`-Pakete für den gesamten Stack.

**grommunio AI**

Die wichtigste Neuerung ist grommunio AI, ein Assistent, der in grommunio Web integriert ist. Er kann eine einzelne E-Mail oder einen ganzen E-Mail-Thread zusammenfassen, Nachrichten übersetzen und Ihnen beim Verfassen von E-Mails helfen – indem er einen Antwortentwurf erstellt, dessen Länge oder Tonfall anpasst oder die Grammatik korrigiert. Mit „Smart Actions“ lässt sich eine E-Mail in eine Besprechungseinladung, eine Aufgabe, einen Kontakt oder eine Antwort umwandeln; dabei öffnet sich jeweils ein vorausgefülltes Dialogfeld, und es geschieht nichts, bis Sie darauf klicken.

Das Besondere daran ist, dass **Sie entscheiden, welches Modell es ausführt und wo**. grommunio AI unterstützt sowohl die OpenAI-kompatiblen als auch die Anthropic- und API-Standards, die zusammen Folgendes abdecken:

- kostenlose Cloud-Tarife — Google Gemini (Standardausführung), Groq und OpenRouter
- kommerzielle API-Modelle — OpenAI, Anthropic/Claude, Mistral, Azure OpenAI und die übrigen
- Lokale Modelle, die Sie selbst hosten — Ollama, LM Studio, vLLM, llama.cpp oder LocalAI

Richten Sie es auf eine lokale Ollama-Konfiguration aus, und nichts verlässt das Gebäude – kein Schlüssel, kein ausgehender Anruf, kein Dritter, der Ihre E-Mails liest. Der Datenschutz ist darauf abgestimmt: Das Plugin wird standardmäßig deaktiviert ausgeliefert; ein Administrator muss es erst aktivieren, woraufhin sich jeder Nutzer noch individuell dafür entscheiden muss; alle Aufrufe erfolgen auf dem Server, und der API-Schlüssel verbleibt in der Serverkonfiguration, wo der Browser ihn niemals zu Gesicht bekommt. Der einzige Vorbehalt: Bei Verbindung mit einem Cloud-Anbieter gelangt der Text, an dem Sie arbeiten, tatsächlich zu diesem Anbieter – genau deshalb ist die lokale Option, bei der nichts das Gebäude verlässt, nur eine Zeile Code entfernt.

**gromox: ein leichterer, schnellerer Motor**

- **Geringerer Speicherbedarf** — Der Informationsspeicher kann sich aufteilen und unter einem ressourcenschonenden Director für jedes Postfach einen kleinen Worker-Prozess ausführen, anstatt einen einzigen, ständig wachsenden Prozess zu betreiben. In Verbindung mit einem Heap-Reaper, der ungenutzten Speicher planmäßig freigibt, strengeren IMAP-Daemon-Grenzen, einer kürzeren Timeout-Zeit für den Idle-Cache und einer Reihe behobener Speicherlecks ist das Ergebnis einfach: Der Server belegt weniger Speicher, sodass mehr Postfächer auf demselben Server Platz finden.
- **IMAP4rev2 (RFC 9051)** — gromox ist nun einer der wenigen Open-Source-Groupware-Server, die dies implementieren: angekündigt hinter dem ENABLE-Handshake, mit ESEARCH, LIST-EXTENDED, serverseitigem MOVE, gespeicherten Suchergebnissen, UTF-8-Postfachnamen und übersichtlicheren Status-/Antwortcodes.
- **Exchange Web Services** — stark erweitert: Aufgaben, Kalendertermine mit korrekten Zeitzonen, echte Delegationsverwaltung mit Berechtigungsstufen und der vollständige Besprechungs-Workflow (Einladungen, Absagen, Antworten und ein serverseitiger Prozessor, der den Kalender des Organisators auf dem neuesten Stand hält), dazu Streaming-Benachrichtigungen und die Suche nach Räumen/Personen.
- **Offline Address Book** — eine brandneue, von Grund auf neu entwickelte Implementierung des OAB-Formats von Microsoft und dessen LZX-Komprimierung, die von gromox selbst erstellt und bereitgestellt wird und keinen Microsoft-Code enthält.
- **Verbesserte Darstellung von Textinhalten** — Die Konvertierung von HTML, RTF und reinem Text kann zur höheren Genauigkeit an Pandoc und Chawan übergeben werden, und der interne RTF-Reader wurde für CJK-Text, Rechts-nach-Links-Schriften und verschachtelte Tabellen überarbeitet.
- **Wichtige Fehlerbehebungen** — Outlook verliert beim Öffnen eines freigegebenen Kalenders keine Termine mehr; Outlook 2010 kann sich unter OpenSSL 3 wieder anmelden; AutoDiscover gibt keinen nicht existierenden OWA-Endpunkt mehr an (was stillschweigend die Einrichtung von Thunderbird beeinträchtigt hatte); wiederkehrende Besprechungen behalten ihre Zeitzonen bei. Die Import- und Export-Tools wurden außerdem in `gromox-import` und `gromox-export` umbenannt.

**grommunio Web**

Der Web-Client ist nicht nur die neue Heimat von grommunio AI, sondern wurde auch in den entscheidenden Bereichen – Erstellen, S/MIME, Suche und Design – kontinuierlich weiterentwickelt. Dank dieser beständigen Arbeit bleibt er der leistungsfähigste Open-Source-Web-Client für Exchange auf dem Markt.

**Endlich gemeinsame Postfächer auf Mobilgeräten**

grommunio-sync unterstützt nun die Identitätsübernahme über Exchange ActiveSync, sodass ein gemeinsames oder funktionales Postfach mit vollen Rechten auf einem Telefon eingerichtet werden kann, wobei Sie sich mit Ihrem eigenen Konto anmelden – eine Funktion, die Exchange und Microsoft 365 über ActiveSync nicht bieten. Das AutoDiscover von gromox erkennt die kombinierte `sharedmailbox!user`-Anmeldung und setzt diese serverseitig durch, wobei sowohl Ihre Identität als auch die Frage geprüft wird, ob Sie Eigentümerrechte für das Zielobjekt besitzen, sodass das Smartphone direkt mit dem gemeinsam genutzten Speicher eingerichtet wird. Als Sicherheitsmaßnahme wird eine Fernlöschung in einer imitierten Sitzung auf die Ebene des Kontos beschränkt, sodass niemand versehentlich ein persönliches Gerät löscht.

**Ein überarbeitetes Admin-Modul und DKIM direkt aus der Verpackung**

- Die Admin-Weboberfläche wurde in **TypeScript** neu entwickelt – die gesamte Codebasis wurde Datei für Datei auf eine streng typisierte Umgebung umgestellt, sodass kein JavaScript mehr enthalten ist. Dies sorgt für weniger Überraschungen zur Laufzeit und eine Konsole, die wesentlich einfacher zu bearbeiten und zu erweitern ist.
- **DKIM** wird nun für Sie abgewickelt: Generieren Sie direkt über die Admin-Benutzeroberfläche einen Signaturschlüssel pro Domain, und grommunio gibt den öffentlichen Datensatz zurück, den Sie in DNS einfügen können – kein mühsames Suchen nach `rspamadm` und `openssl` mehr. In dieser Version wurden außerdem die Standard- und anonymen Berechtigungen für öffentliche Ordner bereinigt und mehrere Pfade zur Verzeichnisintegration optimiert. Sobald Ihre Einträge veröffentlicht sind, überprüft der bestehende DNS-Zustandscheck von grommunio, ob SPF, DKIM, DMARC, MX und die übrigen Einträge übereinstimmen.

**Der Rest der Suite**

- **grommunio Meet** — eine umfassende Aktualisierung, einschließlich eines zentral verwalteten STUN/TURN-Relays (`turn.grommun.io`) für Selbsthoster, die kein eigenes betreiben können, mit einem Fallback über Port 443, der wie ein gewöhnliches HTTPS aussieht und fast immer durchkommt; Der gesamte Jitsi-Stack wurde auf eine aktuelle Version mit JDK 17 umgestellt, und Lobby sowie Breakout-Räume sind standardmäßig aktiviert. Sie können den Server weiterhin auf Ihren eigenen coturn verweisen.
- **grommunio Files** – eine ganze Generation weiter: aktueller, schneller und sicherer, mit integrierter gemeinsamer Bearbeitung von Office-Dokumenten im Browser, grommunio-Branding und Single Sign-On sowie der Möglichkeit zur Selbstaktualisierung älterer Installationen vor Ort. Die selbst gehostete Alternative zu OneDrive und SharePoint.
- **grommunio Keycloak** – Umstellung auf Keycloak 26.6.4, den Identitätsanbieter hinter dem Single Sign-On für Web, Admin, Files und Meet über einen einzigen grommunio-Login; die Konfiguration befindet sich nun unter `/etc`, sodass Einstellungen bei Upgrades erhalten bleiben.
- **grommunio Archive 1.4** – überarbeitet für die Leap 16.0 / PHP 8-Basis überarbeitet und läuft nun als regulärer Dienst: eine Weboberfläche zum Suchen und Anzeigen von E-Mails, eine zugrunde liegende Volltextsuche sowie ein SMTP-Listener, der Nachrichten beim Durchlaufen kopiert – zusätzlich zu Archivierungs- und Aufbewahrungsregeln, Legal Hold, Deduplizierung, Fingerprinting und Verifizierung, Tagging, Export/Wiederherstellung, Audit-Protokolle, direkter IMAP-Import sowie Massenimport aus Quellen wie Google Workspace und Microsoft 365.
- **grommunio Desk 1.2** – Rechtschreibprüfung in den Systemsprachen, Zoomfunktion in der Serveransicht mit Zurücksetzen, ein Kontextmenü per Rechtsklick (Rechtschreibvorschläge, Kopieren/Einfügen), isolierte Sitzungen pro Server, bearbeitbare Servernamen und eine Neuladeoption, übersichtlichere Symbole in der Titelleiste, automatische Migration der Einstellungen auf einer aktualisierten Electron-Basis sowie verschiedene Fehlerbehebungen (URL-Validierung, macOS-Verknüpfungen, Ladezustand der Serveransicht, Dialogschaltflächen).
- **grommunio DAV** — kann nun die globale Adressliste des Unternehmens als schreibgeschütztes CardDAV-Adressbuch veröffentlichen und speichert die CalDAV/CardDAV-Einstellungen pro Ordner, sodass die im Apple-Kalender festgelegten Kalenderfarben und die Sortierreihenfolge endlich beibehalten werden. **grommunio Index 1.6** hat die serverseitige Volltextsuche konfigurierbarer und unter Last stabiler gemacht.

**Eine neue Plattform: openSUSE Leap 16.0**

Das gesamte appliance wurde auf openSUSE Leap 16.0 umgestellt – eine aktuelle, gepflegte Basis mit einem neueren Kernel, einer neueren Toolchain und einem neueren Krypto-Stack. Und das betrifft nicht nur das VM-Image: Alle Ziele für geführte Installationen wurden auf 16.0 umgestellt – das VMware/OVA appliance, das Installations-ISO, das Offline-All-in-One-ISO für Air-Gapped-Standorte sowie der Container-/Compose-Stack (jetzt Leap 16.0 mit MariaDB 11 und ohne Administratorrechte). Das Netzwerk wurde auf systemd-networkd umgestellt, und grommunio-setup kann nun sicher erneut ausgeführt werden, sodass Rollen auf einem laufenden System ohne vollständige Neuinstallation hinzugefügt oder entfernt werden können – sowohl unter 15.6 als auch unter 16.0.

**Debian, diesmal richtig**

Mit Version 2026.06.1 gibt es native `.deb`-Pakete für den gesamten Stack – die gromox-Engine und jedes Frontend –, die nach den Vorgaben von Debian erstellt wurden. Die Installationswerkzeuge haben gelernt, zu erkennen, auf welcher Umgebung sie laufen, und die richtigen Schritte auszuführen: Es schreibt apt-Quellen, importiert Signaturschlüssel in den Schlüsselring und steuert apt unter Debian 13 sowie Ubuntu 24.04 und 26.04 LTS – direkt neben openSUSE und RHEL. Die Pakete werden bewusst schrittweise allgemein verfügbar gemacht – Komponente für Komponente und zunächst bei ausgewählten Partnern –, damit jedes einzelne getestet ist, bevor es für alle freigegeben wird.

**Dokumentation, überarbeitet**

docs.grommunio.com wurde von Grund auf auf einer modernen Plattform für statische Websites neu aufgebaut und bietet nun eine schnelle Suche auf allen Seiten sowie eine übersichtliche Unterteilung in die Bereiche „Benutzer“, „Administration“ und „Entwicklung“. Zu den neuen Inhalten gehören ein Leitfaden zum Hochverfügbarkeits-Clustering, eine Schritt-für-Schritt-Anleitung zum Single-Sign-On mit Kerberos für transparente Anmeldungen bei domänengebundenen Outlook-Systemen, ein umfassenderes Migrationshandbuch von Exchange zu grommunio sowie ein überarbeitetes Kapitel zu Containern für Leap 16.0.

**Unterstützte Distributionen**

Ab Version 2026.06.1 unterstützt grommunio die Installation und den Betrieb auf folgenden Systemen:

- openSUSE Leap 16.0 / SLES 16 (appliance-Basis)
- Debian 13
- Ubuntu 26.04 LTS

**Aktualisierung**

Bestehende Installationen werden über den üblichen grommunio-Update-Prozess aktualisiert; siehe [Aktualisierung von grommunio](/admin/operations/#updating-grommunio).

**Danksagungen**

Ein großes Dankeschön an die Kunden und Partner, deren Feedback diese Version geprägt hat, sowie an alle, die offen an der Entwicklung von grommunio mitwirken. Beteiligen Sie sich an der Diskussion in der [grommunio-Community](https://community.grommunio.com/).

## grommunio 2025.01.2

- Art der Veröffentlichung: Minor-Release
- Veröffentlichungsdatum: 18. April 2025
- Allgemeine Verfügbarkeit: Ja

**Highlights**

- Überarbeitete Version von grommunio Web mit aktualisierten Editoren (TinyMCE 7.8.0) und Viewern (PDF.js 5.1.91) sowie einer verbesserten Handhabung gemeinsamer Verteilerlisten.
- Die benutzerspezifischen Dienststeuerungen sind nun vollständig durchsetzbar – Administratoren können den Zugriff auf Web, ActiveSync und CalDAV/CardDAV pro Benutzer über Admin API/CLI aktivieren bzw. deaktivieren, und diese Einschränkungen werden in allen Komponenten berücksichtigt.
- Verbesserte Synchronisationszuverlässigkeit für mobile Geräte und CalDAV, einschließlich besserer Kompatibilität mit ganztägigen Kalenderterminen in iOS und Unterstützung für alternative Anmeldenamen.
- Verbesserung der Lizenzierung: Nur aktive (nicht deaktivierte) Benutzerkonten werden nun auf die Lizenzlimits angerechnet, wodurch die Lizenznutzung an die tatsächliche Anzahl aktiver Benutzer angepasst wird.
- Zahlreiche Stabilitäts- und Leistungsverbesserungen im gesamten Stack (E-Mail-Verarbeitung, Protokollierung, Speicherverwaltung usw.) verbessern die Zuverlässigkeit weiter.
- grommunio-Einrichtung für DEB: Ausgeliefert über das Paket grommunio-setup können nun erste halbautomatische Installationen auf DEB-basierten Distributionen (Debian, Ubuntu) durchgeführt werden.
- EWS: Weitere Verbesserungen an unserem EWS verbessern die Interoperabilität, insbesondere mit eM Client.

**Verbesserungen**

- Benutzerdienstverwaltung: Unterstützung für benutzerspezifische Schaltflächen zur Aktivierung von Diensten eingeführt. Der Admin API/CLI ermöglicht nun das Aktivieren bzw. Deaktivieren des Benutzerzugriffs auf Web-, EAS (ActiveSync)- und DAV-Dienste, und die Groupware-Komponenten berücksichtigen diese Einstellungen (wodurch Dienstbeschränkungen für deaktivierte Benutzer durchgesetzt werden).
- Lizenzierung: Die Lizenzierungslogik wurde verbessert, sodass nur aktive Benutzer auf die Lizenzkontingente angerechnet werden. Deaktivierte oder archivierte Benutzer belegen keinen Lizenzplatz mehr, was Unternehmen eine genauere Erfassung der Lizenzauslastung ermöglicht.
- Aktualisierungen der Weboberfläche: Die Komponenten von Drittanbietern in grommunio Web wurden aktualisiert, um die Benutzererfahrung zu verbessern. Der Rich-Text-Editor wurde auf TinyMCE 7.8.0, der PDF-Viewer auf pdf.js 5.1.91 und der HTML-Sanitizer auf DomPurify 3.2.5 aktualisiert, was zu Verbesserungen bei Leistung, Sicherheit und Funktionalität führt. Zudem wird in der Monatsansicht des Kalenders nun wieder das Symbol für wiederkehrende Termine angezeigt, und die Web-Benutzeroberfläche kann Details zu öffentlichen und freigegebenen Verteilerlisten anzeigen (was die Anzeige der Mitglieder freigegebener Kontaktlisten erleichtert).
- Verbesserungen bei Plugins und Kompatibilität: Das optionale Kendox-Plugin ist nun standardmäßig deaktiviert, um die Weboberfläche zu optimieren und Probleme mit ungenutzten Integrationen zu vermeiden. Außerdem haben grommunio Web und zugehörige Dienste die Unterstützung für PHP 7.x offiziell eingestellt, sodass nun PHP 8+ erforderlich ist – dieses Update passt die Plattform an moderne PHP-Versionen an, um Leistung und Sicherheit zu verbessern.
- Mailingliste und Adressbuch: Gromox unterstützt nun verschachtelte Gruppen bei der Berechtigungsprüfung. Diese Erweiterung bedeutet, dass Verteilerlisten andere Listen enthalten können und dennoch korrekt aufgelöst werden, was die Flexibilität bei komplexen Gruppenberechtigungen verbessert. Darüber hinaus wurde die interne Adressbuchverwaltung für internationalisierte Einträge verbessert – zusätzliche UTF-16/32-Codepage-Varianten werden erkannt, was die Unterstützung für Kontakte oder Anhänge mit nicht-lateinischen Zeichen und internationalisierten Domainnamen verbessert.
- CalDAV/CardDAV (grommunio DAV): Der DAV-Dienst wurde optimiert, um die Leistung und Interoperabilität zu verbessern. Die Protokollierungsausführlichkeit wurde durch das Entfernen übermäßig umfangreicher Debug-Ausgaben reduziert (was zu übersichtlicheren Protokollen und geringerem Overhead führt), und der Standardwert für `fastcgi_read_timeout` des DAV-Webdienstes wurde verlängert (auf 360 Sekunden), um langwierige Kalender- oder Adressbuchvorgänge ohne Zeitüberschreitung zu ermöglichen. Der DAV-Dienst leitet nun außerdem Fehlerantworten korrekt an Clients weiter (wodurch sichergestellt wird, dass CalDAV-/CardDAV-Clients die richtigen Fehlercodes erhalten), und sein Abhängigkeitsstapel wurde zur Verbesserung der Stabilität aktualisiert.
- Allgemeine Leistung und Stabilität: In den Kerndiensten wurden zahlreiche Verbesserungen auf niedriger Ebene vorgenommen (Gromox) vorgenommen. Die Speicherverwaltung wurde in mehreren Modulen verbessert (z. B. automatische Puffer-Neuzuweisung und korrekte Signalisierung von Speicherengpässen in den Komponenten zcore und exmdb), um die Skalierbarkeit unter hoher Auslastung zu erhöhen. Diese Änderungen sowie weitere Optimierungen im Hintergrund verringern die Wahrscheinlichkeit von Dienstabstürzen und verbessern die Gesamteffizienz des Systems.

**Fehlerbehebungen**

- Gemeinsame Verteilerlisten: Probleme mit gemeinsamen und öffentlichen Verteilerlisten in grommunio Web wurden behoben. Benutzer können nun erfolgreich E-Mails an eine gemeinsame Verteilerliste senden, und die Benutzeroberfläche zeigt die Mitglieder gemeinsamer/öffentlicher Verteilerlisten korrekt an. (Zuvor konnten Versuche, diese Listen zu verwenden oder deren Mitglieder anzuzeigen, fehlschlagen.)
- Korrekturen bei alternativen Anmeldenamen: Es wurden mehrere Probleme im Zusammenhang mit alternativen Anmeldenamen (Aliasen) behoben. Benutzer, die sich mit einer alternativen E-Mail-Adresse oder einem alternativen Benutzernamen anmelden, können nun ihr Passwort über das Benutzerportal ändern (dies war zuvor nicht möglich). Zudem wurden Synchronisierungsprobleme in grommunio Sync bei der Verwendung alternativer Anmeldungen behoben, sodass mobile Geräte und EAS-Clients korrekt synchronisiert werden, selbst wenn der Benutzer über einen Alias angemeldet ist.
- Ganztägige Kalendertermine: Ein Kalenderfehler in ActiveSync, der Apple- und iOS-Clients betraf, wurde behoben. Ganztägige Termine, die an einem Tag angelegt wurden, wurden auf iOS-Geräten manchmal über zwei Tage hinweg angezeigt – dies wurde behoben, um sicherzustellen, dass ganztägige Termine auf allen Clients einheitlich an dem vorgesehenen einzelnen Tag angezeigt werden.
- IMAP-Protokollkonformität: Ein kleiner Formatierungsfehler in IMAP-Antworten wurde behoben – die BODYSTRUCTURE-Antwort enthält nun ein erforderliches Leerzeichen, das zuvor fehlte. Diese Konformitätskorrektur verbessert die Kompatibilität mit IMAP-E-Mail-Clients und stellt sicher, dass keine Parsing-Probleme aufgrund des fehlenden Leerzeichens auftreten.
- Konvertierung von E-Mail-Inhalten: Ein Problem in der E-Mail-Konvertierungsbibliothek wurde behoben, das dazu führen konnte, dass HTML-formatierte E-Mails falsch konvertiert wurden. E-Mail-Inhalte (von HTML in Klartext oder andere Formate) werden nun wie erwartet konvertiert, wobei die Formatierung beibehalten wird und sichergestellt ist, dass die Nachricht in allen Clients lesbar ist.
- Stabilitätskorrekturen: Seltene Abstürze im Backend der E-Mail-Verarbeitung wurden behoben. Insbesondere wurden Probleme im Regelprozessor und in den Modulen zur E-Mail-Zustellung behoben, die durch Inkompatibilitäten beim Speicherzuordner verursacht wurden. Diese Korrekturen beseitigen bestimmte sporadisch auftretende Abstürze (beispielsweise bei der Verarbeitung serverseitiger E-Mail-Regeln oder beim Zustellen von Nachrichten unter hoher Auslastung), was zu einem robusteren und zuverlässigeren Server führt.
- PST-Export: Ein Problem wurde behoben, das in bestimmten Szenarien den PST-Export von Outlook verhinderte. Gromox enthält in Exportströmen nun keine unbeabsichtigte PR_MESSAGE_SIZE-Eigenschaft mehr, was bedeutet, dass der Export von Postfächern in das PST-Format nun erfolgreich abgeschlossen wird (die zusätzlichen Daten, die zum Fehlschlagen von PST-Exporten führten, wurden entfernt).

**Allgemeine Hinweise**

Diese Version ist die letzte, die Builds für openSUSE 15.5 enthält. Alle zukünftigen Updates erfordern strikte Kompatibilität mit PHP 8.1+. Bitte aktualisieren Sie Installationen, die noch unter openSUSE 15.5 laufen, entsprechend (beispielsweise durch Verwendung von `grommunio-update upgrade`).

Die oben aufgeführten Listen enthalten die wichtigsten Änderungen in grommunio 2025.01.2. Diese Version umfasst Dutzende kleinerer Fehlerbehebungen und Verbesserungen, die der Optimierung der allgemeinen Funktionalität und Sicherheit dienen.

## grommunio 2025.01.1

- Art der Veröffentlichung: Hauptversion
- Veröffentlichungsdatum: 29. Januar 2025
- Allgemeine Verfügbarkeit: Ja

**Highlights**

**Appliances basieren nun auf openSUSE 15.6**

Die neuesten Versionen der Serien grommunio und appliance basieren auf openSUSE 15.6 und profitieren somit von aktuellen Sicherheitspatches, verbesserter Stabilität und Unterstützung für moderne Hardware.

**Leistungssteigerung und geringerer Ressourcenbedarf**

Dank umfangreicher Verbesserungen bei der Parallelisierung (insbesondere für Single-Store-Szenarien mit hoher Parallelisierung) hat sich die Gesamtleistung des grommunio-Stacks verbessert, während der Ressourcenbedarf (RAM, CPU, Festplatte) gesunken ist.

**Keycloak 26.1 Integration**

grommunio wird nun mit Keycloak 26.1 ausgeliefert, einschließlich:

> - Weiterentwicklung von SSO und des Identitätsmanagements mit erweiterten Sicherheitskontrollen.
> - Verbesserte Benutzerföderation für groß angelegte Bereitstellungen, wodurch die Integration mit heterogenen Verzeichnisdiensten vereinfacht wird.
> - Erweiterte Funktionen der Verwaltungskonsole für eine optimierte Konfiguration und Audit-Protokolle.

**TinyMCE-Upgrade von 4.9.11 auf 7.6.1**

Der E-Mail-Editor des grommunio Web nutzt nun TinyMCE 7.6.1 und bietet folgende Funktionen:

> - Modernisierte Benutzeroberfläche und Benutzererfahrung, insbesondere auf Mobilgeräten und Touch-Geräten.
> - Verbesserte Leistung und Sicherheit, was ein flüssigeres Bearbeitungserlebnis gewährleistet (z. B. die Hover-Leiste für Inhalte).

**Unterstützung für PHP 8.2 und 8.3**

Der Kern und die zugehörigen Dienste von grommunio sind nun vollständig kompatibel mit PHP 8.2 und 8.3. Zu den wichtigsten Vorteilen zählen:

> - Bessere Leistung und Speicheroptimierung.
> - Verbesserte Funktionen zur Typ- und Fehlerbehandlung für Entwickler.
> - Erweiterte grommunio-Stack-Upgrades und Konformität.

**Verbesserte Compliance bei der E-Mail-Kommunikation**

grommunio verbessert die Unterstützung von Internet-E-Mail-Standards kontinuierlich weiter. Dies gewährleistet eine robustere und präzisere Analyse und Erstellung von E-Mails bei einer Vielzahl von Clients und Mail-Servern.

**Neue Funktionen und Verbesserungen** **Share-Nothing-Cluster**

Im Vergleich zur vorherigen Version wurden die Cluster erweitert, sodass sie nun ohne gemeinsame Speichersysteme horizontal skaliert werden können. Dies bietet maximale Flexibilität bei Bereitstellungen mit mehreren Knoten und reduziert potenzielle Engpässe oder einzelne Ausfallstellen.

**Parallelisierter Zugriff auf eine einzelne Mailbox**

Ein wichtiges Versprechen wurde eingelöst: Deutliche Leistungssteigerungen, wenn mehrere Benutzer oder Prozesse gleichzeitig auf große Postfächer zugreifen. Die neue Parallelisierungslogik trägt dazu bei, die Last effizienter zu verteilen und so Konflikte bei der Sperrvergabe zu vermeiden.

**Überarbeitete Indizierung und Suche**

Aufbauend auf den jüngsten Verbesserungen bei der Indizierung ist die Suche in E-Mails, Kontakten und anderen Elementen nun schneller und genauer und erfordert gleichzeitig weniger Speicherplatz.

**Deutlich verbessertes S/MIME**

Zu den Neuerungen zählen eine optimierte Verarbeitung von klar signierten Nachrichten, eine verbesserte Zertifikatsvalidierung sowie eine verbesserte Interoperabilität mit verschiedenen Geräteklassen direkt nach der Installation.

**Aktivierung von Funktionen pro Benutzer**

Administratoren können weiterhin detaillierte Ein- und Ausschaltoptionen nutzen, um die Dienste „Web“, „Sync“ (ActiveSync) und „DAV“ benutzerspezifisch zu aktivieren oder zu deaktivieren, wodurch Unternehmen den Zugriff auf Ressourcen präzise steuern können.

**Zeitzone und Migrationskompatibilität**

Laufende Optimierungen gewährleisten eine einheitliche Zeitplanung über mehrere Protokolle hinweg (CalDAV, EWS, MAPI) sowie eine genauere Datenmigration aus Altsystemen (Exchange, Communigate Pro, Kerio, Kopano, Zarafa).

**grommunio – Vorlagen für Web-Signaturen**

Eine neue Funktion, mit der Administratoren und Endbenutzer standardisierte E-Mail-Signaturen unternehmensweit definieren, anpassen und verwalten können. Dazu gehören Variablen (z. B. Name, Titel, Abteilung) für die dynamische Einfügung, wodurch eine einheitliche Markenidentität gewährleistet und gleichzeitig der manuelle Pflegeaufwand für Signaturen reduziert wird.

**Verbesserungen bei der Verarbeitung von EWS**

Angesichts der wachsenden Zahl von EWS-Clients, die grommunio nutzen, erfordern bestimmte Varianten der EWS-Client-Implementierungen Anpassungen in unserem serverseitigen EWS-Verarbeitungscode, um eine verbesserte Kompatibilität zu gewährleisten. So enthält beispielsweise die Version 2025.01.1 eine verbesserte Zeitzonenverwaltung, unter anderem für Apple-Clients, sowie weitere Verbesserungen zur Erhöhung der Kompatibilität mit emClient und Evolution.

**Aktuelles zum Entwicklungsprozess**

- Monatliche Point-Releases: Ab Version 2025.01.1 wird grommunio monatliche Point-Releases bereitstellen (z. B. 2025.01.2 im Februar).
- Jährliches Haupt-Upgrade: Jedes Jahr wird es mindestens eine Hauptversion geben, die umfangreichere Funktionsüberarbeitungen und architektonische Verbesserungen enthält.

**Zertifizierungsinitiativen**

Angesichts der zunehmenden Verbreitung im öffentlichen Sektor und bei Verteidigungsorganisationen strebt grommunio aktiv Zertifizierungen wie FedRAMP/NIST, FISMA und BSI an. Dies unterstreicht das Bekenntnis zu höheren Sicherheitsstandards und zur Einhaltung gesetzlicher Vorschriften.

**Roadmap für 2025.01.2**

- RFC 2184/2231: Verbesserte Verarbeitung erweiterter Parameter in MIME-Headern.
- Gelöschte Postfächer und Migration: Verbesserungen bei der erweiterten Postfachverwaltung über mehrere Migrationen hinweg, einschließlich x400-Adressierung und undokumentierter MAPI-Attribute.
- grommunio Support v2: Erweiterte Unterstützung für die Einrichtungsphase von RHEL9, Debian 12 und Ubuntu 24.04.
- grommunio-files: Aktualisierte Version mit Gruppenordnerverwaltung und moderner Authentifizierung.

**In den nächsten Versionen verfügbar (Vorschau für ausgewählte Partner)**

- Moderne Authentifizierung (OAuth2) für Outlook, IMAP und POP3.
- Vollständige HTML-basierte MR-Verarbeitung (Meeting Request) in der Web-Benutzeroberfläche.
- KI-gestützte Funktionen zur Steigerung der Benutzerproduktivität.
- Erweiterte Unterstützung für Regeln und automatische Verarbeitung

**Unterstützte Distributionen**

Seit dem 1. Januar 2025 unterstützt grommunio aktiv die Installation und den Betrieb auf den folgenden Linux-Distributionen:

- RHEL9 / EPEL9
- openSUSE 15.5+ / SLES 15.5+
- Debian 12
- Ubuntu 24.04

**Danksagungen**

Wir möchten unserer Community, unseren Kunden und Partnern unseren aufrichtigen Dank für ihre anhaltende Unterstützung, ihr Feedback und ihre Beiträge aussprechen. Ein besonderer Dank gilt unseren aktiven Mitwirkenden: crpb, dahan, brad0, kasperk81, robert-scheck, orandev01, rnagy, walter, liske, steve, milotype, clique2015 und vielen anderen. Ihre Erkenntnisse bestimmen unsere Roadmap und machen grommunio mit jeder neuen Version robuster, sicherer und leistungsfähiger.

## grommunio 2023.11.3

- Art der Veröffentlichung: Kleinere Version
- Veröffentlichungsdatum: 16. Februar 2024
- Allgemeine Verfügbarkeit: Ja

**Highlights**

- EWS wird nun vollständig unterstützt und kann mit den nativen Unternehmensanwendungen (E-Mail, Kalender usw.) von Microsoft, Outlook for Mac sowie Apple ausgeführt werden
- S/MIME wurde aktualisiert, um die Validierung über verschiedene Geräteklassen hinweg zu gewährleisten.
- IDN-Domains (internationalisierte Domains) werden nun in GAL (Global Address Lists) unterstützt.
- CalDAV unterstützt nun iCal-Verfügbarkeitsinformationen.
- grommunio Web erhielt seit dem letzten großen Design-Upgrade Korrekturen zur Optimierung.
- Unterstützung für die Passkey-Authentifizierung mit grommunio Auth.
- Die Dokumentation wurde mehrfach aktualisiert, einschließlich einer umfassenden Überarbeitung.

**Neue Funktionen**

- EWS hat die Beta-Phase verlassen und ist nun standardmäßig aktiviert (siehe Hinweise)
- Der neue Regelprozessor (twostep_ruleproc) unterstützt nun öffentliche Ordner im Outlook-Format
- grommunio stellt nun das 389DS-Schema über einen Selektor in grommunio Admin bereit
- Das Einreichen ausgehender Nachrichten über „postdrop“ wird nun unterstützt
- grommunio Next ist nun als Technologievorschau in den Repositories verfügbar (erfordert Graph API)

**Verbesserungen**

- Durch Korrekturen im Zusammenhang mit S/MIME im Web ist nun der Download mehrerer Anhänge möglich
- Unbeabsichtigte doppelte Anführungszeichen in E-Mails werden nun bei RFC-Kodierungen im 2047-Format entfernt
- Ein seltener Fall, bei dem PR_TRANSPORT_MESSAGE_HEADERS ein zusätzliches Byte enthielt, wurde behoben
- Ein Fall, bei dem vier zusätzliche Bytes vor dem ersten Transport-Header hinzugefügt wurden, wurde behoben
- Semikolons in „Reply-To“-Headern werden nun korrekt verarbeitet
- Korrekte Verarbeitung von Protokollmeldungen für eine bessere Fail2ban-Verarbeitung
- ICS-Anfragen können nun zur Überprüfung durch Entwickler ausgegeben werden
- Umfangreiche Aktualisierungen der Abhängigkeiten für Installationen auf Basis von Debian/Ubuntu
- Verschiedene Verbesserungen am Migrations-Toolset
- Verschiedene Verbesserungen bei der E-Mail-Verarbeitung (z. B. Dot-Stuffing)

**Hinweise zu EWS**

Wie oben erwähnt, ist der Parameter `ews_beta=1` in `/etc/gromox/ews.cfg` nun überflüssig, da EWS die Beta-Phase verlassen hat. EWS ist nun standardmäßig aktiviert, und der Parameter wird nicht mehr benötigt.

**Danksagungen**

Wir bedanken uns ganz herzlich bei unseren Kunden, Partnern und der Community für ihre wertvollen Anregungen und ihr Feedback. Dank des Feedbacks von Kunden und der Community konnten wir Probleme im Zusammenhang mit EWS erfolgreich aufspüren und haben diese Rückmeldungen in unseren Bewertungsprozess einbezogen, was zu einem besseren Produkt für alle geführt hat.

Wir möchten uns ganz besonders bei der Community für das überwältigende Feedback bedanken, vor allem auf der FOSDEM <https://fosdem.org/2024/>.

**Abschließende Bemerkungen**

Die Entwicklungs-, Qualitätssicherungs- und Release-Teams entschuldigen sich dafür, dass sich unsere öffentliche Kommunikation gelegentlich verzögert hat. Wir waren sehr damit beschäftigt, euch nicht nur ein besseres Produkt mit einer Vielzahl von Fehlerbehebungen und neuen Funktionen zu liefern, sondern auch neue Ressourcen in die gesamte Organisation und Infrastruktur zu integrieren. Es ist erstaunlich, wie viele Installationen gerade in der Weihnachtszeit in den Produktivbetrieb gegangen sind, was eine zusätzliche Priorisierung erforderlich machte. Seid versichert: Es stehen große Neuigkeiten von grommunio an, und ihr werdet davon erfahren.

## grommunio 2023.11.2

- Art der Veröffentlichung: Kleinere Version
- Veröffentlichungsdatum: 28. Dezember 2023
- Allgemeine Verfügbarkeit: Ja

**Highlights**

- Das appliance wird nun standardmäßig mit XFS als Hauptdateisystem ausgeliefert
- Die Leistung des IMAP hat sich insgesamt um den Faktor 2 oder mehr verbessert (Entfernung der Seqid-Neunummerierung bei SELECT/LIST/FETCH)
- Die Kompatibilität des IMAP wurde durch die korrekte Verarbeitung der Befehle EXPUNGE und STATUS deutlich verbessert
- Windows Mail funktioniert nun auch als EAS-Client
- Aktivierung von Raum- und Ausrüstungsspeichern für den AutoDiscover mit Delegation (gemeinsamer Speicher)
- Benachrichtigungen für Suchordner wurden verbessert (weitere Verbesserungen folgen)

**Neue Funktionen**

- IMAP empfängt nun Löschereignisse von anderen Clients (OL/Web/EAS/EWS)
- gromox-mbop unterstützt nun Zeitangaben, um das Löschen von Nachrichten eines bestimmten Alters zu begrenzen
- Alle Daemons haben verschiedene Konfigurationsanweisungen für Dateideskriptor-Limits erhalten, wobei in systemd-Umgebungen nun 512K anstelle von 2256 gelten
- Unterstützung für XFS-Snapshots

**Verbesserungen**

- gromox-mbop-Pfadangaben wie *SENT/2024* sind nun aktiviert
- RTF-komprimierte MAPI-Eigenschaften generieren nun einen vollständigen Header
- Die Frei/Gebucht-Informationen sind nun widerstandsfähiger gegenüber nicht vorhandenen Daten (keine Informationen verfügbar)
- Der Header für die Basisauthentifizierung ist nun vollständig RFC 7617-konform
- Der Namensdienstanbieter (NSP) unterstützt nun vollständig die Windows-UTF-8-Lokalisierung (Beta-Funktion von Microsoft)
- Verbesserte Abdeckung von Kalendereinträgen für EWS
- Verbessertes EWS CreateItem für Apple Mac Mail
- Behebung des Vertauschens von Eigenschafts-IDs/Tags bei TNEF-Objekten
- Verbesserungen an ICS reduzieren nun die Anzahl der Synchronisierungsprobleme aufgrund fehlerhafter Einträge (die z. B. aus defekten Kopano-Datensätzen importiert wurden)
- Bessere Verarbeitung von Kalenderterminen (RDATE, Weekorder), wodurch ganztägige Ereignisse aus fehlerhaften Quellen gemäß den Empfehlungen der OXCICAL-Spezifikation korrekt angezeigt werden
- Behebung eines „Heap-use-after-free“-Fehlers bei Frei/Gebucht-Anfragen in EWS
- Multi-LDAP erhielt Robustheitsverbesserungen für Sonderfälle (wie z. B. 389DS)
- Verschiedene Korrekturen bei der Frei/Gebucht-Verarbeitung (im Zusammenhang mit der Terminplanung)

**Danksagungen**

Da die Zahl der Mitwirkenden mit jeder neuen Version weiter wächst, verzichten wir nun darauf, eine manuell zusammengestellte Liste zu erstellen, und bitten stattdessen alle Interessierten, einen Blick in unsere Git-Repositorys zu werfen und sich selbst ein Bild von der sich ständig weiterentwickelnden Community zu machen. Seien Sie versichert: grommunio bedankt sich bei allen Beteiligten – Kunden, Partnern und der Community gleichermaßen.

## grommunio 2023.11.1

- Art der Veröffentlichung: Hauptversion
- Veröffentlichungsdatum: 18. November 2023
- Allgemeine Verfügbarkeit: Ja

**Highlights**

Wir freuen uns, die Veröffentlichung von grommunio 2023.11.1 bekannt zu geben. Dieses Update stellt einen bedeutenden Meilenstein auf unserem Weg als führende Open-Source-Groupware-Plattform dar. Mit einer Reihe neuer Funktionen und Verbesserungen unterstreicht diese Version unser Engagement, eine Kommunikationslösung auf Unternehmensniveau anzubieten, die sowohl umfassend als auch sicher ist.

**Was gibt’s Neues?**

- Erweiterte EWS-Funktionalität mit Unterstützung für Microsoft, Outlook for Mac, Apple Mail sowie Microsoft und Outlook für mobile Geräte
- Erweiterte Single Sign-On-Funktionalität (SSO) in Active Directory-Umgebungen (Unterstützung für SPNEGO)
- Überarbeitete Benutzeroberflächen gemäß den WCAG 2.1-Richtlinien für verbesserte Barrierefreiheit
- Leistungsverbesserungen mit grommunio Web und einer um 25 % schnelleren End-to-End-Verarbeitung
- Unterstützung alternativer Anmeldenamen für mehr Flexibilität beim Identitätsmanagement für komplexe Unternehmensanforderungen
- In grommunio Admin integrierte Online-Update- und Upgrade-Funktionen
- „Recipient Plus“-Adressierung und erweiterte Mailbox-DB-Operationen mit grommunio-mbop
- Moderne Authentifizierung in grommunio Web mit OpenID Connect, einschließlich Unterstützung für 2FA (Zwei-Faktor-Authentifizierung)

**Verbesserungen**

- Verschiedene Fehlerbehebungen: Darunter Unterstützung für nicht empfangende gemeinsam genutzte Postfächer sowie Verbesserungen in den Modulen imap, exmdb und alias_resolve.
- Umfassende Verbesserungen an IMAP (große Literale und RFC 7888) sowie Produktivitätssteigerungen
- Unterstützung für vCard 4.0 und Verbesserungen bei „oxvcard“
- Optimierte Ordner- und Nachrichtenzustellung, einschließlich verbesserter RPCs „create_folder“ und „movecopy_folder“

**Hinweise zu EWS**

- Um die Beta-Funktionen von EWS zu aktivieren, fügen Sie `ews_beta=1` zu `/etc/gromox/ews.cfg` hinzu
- Die Aktivierung von `ews_pretty_response` wird von Mac Mail nicht unterstützt; es wird daher empfohlen, diese Option nicht zu aktivieren
- Der derzeit am besten unterstützte EWS-Client ist Microsoft Outlook for Mac
- Die neuen EWS-Funktionen „FindFolder“ und „FindItem“ werden voraussichtlich innerhalb der nächsten zwei Wochen nach der Veröffentlichung bereitgestellt und stellen die größte Verbesserung für die Apple- und macOS-Apps dar.

**Haftungsausschluss: Öffentliche Beta-Version der EWS-Funktionalität**

- Intensive Entwicklung und Tests: Die Funktionalität des EWS wurde umfassend weiterentwickelt, um eine moderne und solide Softwarearchitektur zu erreichen. Dieser strenge Prozess gewährleistet einen hohen Standard in Bezug auf Qualität, Sicherheit und Funktionalität. Wie bei jedem komplexen Softwareprojekt kann es jedoch in den vielfältigen realen Umgebungen zu unvorhergesehenen Feinheiten kommen.
- Aktuelle Einschränkungen: Wir weisen darauf hin, dass zwei Funktionen – die „FindItem“-Operation und die Impersonation-Funktion – in dieser Beta-Version noch nicht enthalten sind. Diese Funktionen durchlaufen derzeit gründliche Qualitätssicherungstests. Wir gehen davon aus, dass sie noch innerhalb des Zeitplans für die Veröffentlichung im Jahr 2023 integriert werden und die Funktionalität von EWS weiter verbessern werden.
- Engagement für Qualität und Sicherheit: Unser Team hat in Zusammenarbeit mit unseren Technologiepartnern die Funktionalität von EWS wiederholt validiert, um deren Sicherheit, Datenschutz und Stabilität zu gewährleisten. Wir halten uns an die höchsten Standards, um Ihre Nutzererfahrung zu schützen.
- Feedback und kontinuierliche Verbesserung: Obwohl wir erheblichen Aufwand in die Tests investiert haben, sind wir uns bewusst, dass die vielfältigen und dynamischen IT-Umgebungen einzigartige Szenarien mit sich bringen können. Daher begrüßen und schätzen wir jegliches Feedback oder Problemberichte unserer Nutzer. Ihre Erkenntnisse sind von unschätzbarem Wert, um die Funktionalität des EWS weiter zu verfeinern und zu verbessern.
- Support für Abonnenten: Mit der Veröffentlichung dieser EWS-Funktionalität wird das Protokoll innerhalb von grommunio vollständig unterstützt. Abonnenten haben Anspruch auf unseren umfassenden Support bei allen Fragen oder für Unterstützung im Zusammenhang mit EWS. Für Kunden und Hoster: Bitte wenden Sie sich an Ihren Support-Ansprechpartner, wenn Sie Unterstützung bei der Planung der Einführung von EWS benötigen. Wie bei jeder neuen großen Funktion empfiehlt es sich, die Verfügbarkeit sorgfältig zu planen, und unsere Mitarbeiter sind bestrebt, Sie dabei bestmöglich zu unterstützen.

**Danksagungen**

Wir bedanken uns von ganzem Herzen bei unseren Kunden, Partnern und der Community für ihre unschätzbaren Beiträge und ihr Feedback, insbesondere bei:

- clique2015, robert-scheck, General-Aussie, steve, prandev01, crpb, rnagy, walter und viele andere

## grommunio 2022.12.1

- Art der Veröffentlichung: Hauptversion
- Veröffentlichungsdatum: 24. Dezember 2022
- Allgemeine Verfügbarkeit: Ja

**Highlights**

- grommunio Appliance ist nun in der Version openSUSE 15.4 mit zahlreichen Verbesserungen verfügbar, darunter PHP 8.0
- Allgemeine Verfügbarkeit von Multi-LDAP, der weltweit ersten Multi-Backend-Groupware-Engine
- Allgemeine Verfügbarkeit von Admin API für PowerShell (AAPIPS), einer PowerShell-Schnittstelle für grommunio Admin
- Allgemeine Verfügbarkeit von grommunio Desk, einem plattformübergreifenden Client für grommunio Web
- Allgemeine Verfügbarkeit von grommunio Meet für Outlook, einem Plugin für Microsoft, Outlook und grommunio Meet
- Allgemeine Verfügbarkeit von grommunio Auth; Verfügbarkeit von SSO mit grommunio (basierend auf Keycloak)
- Allgemeine Verfügbarkeit nativer Docker-Dateien und Kubernetes-Rezepte für Gromox
- Hochleistungsfähige Datenkomprimierung mit zStandard (zstd)
- Synchronisierung öffentlicher Ordner für mobile Geräte
- Hochleistungsfähige Neuprogrammierung von Autodiscover und Autoconfig
- Hochleistungsfähige Neuprogrammierung von EWS (Exchange Web Services)
- DNS-Namensbasiertes OEM-Whitelabeling für individuelles Branding

**Verbesserungen**

- Verfügbarkeit des FIND-Befehls für EAS 16.1
- Vollständige Benutzerauflösung für Kopano-Migrationen (--mbox-name/--user-map)
- Zentralisierung der MAPI-Header-Dateien
- Die grommunio-CUI ist nun vollständig in 22 Sprachen übersetzt
- Verbesserte Navigationssteuerelemente der grommunio-CUI
- Unterstützung für ausgeblendete Kontakte
- Automatische Zuordnung von AD-/Exchange-Speichertypen (msExchRecipientDisplayType)
- Zentralisierte MAPI-Header-Dateien für PHP-Konsumenten
- Standardmäßige Integration von grommunio-dbconf
- Implementierung des Hierarchie- und Berechtigungsmodells (ACLs) für öffentliche Ordner in Admin
- Verwaltung der E-Mail-Warteschlange in grommunio Admin
- Umfangreiche Aktualisierungen der Dokumentation, Einführung der Wissensdatenbank im Dokumentationsportal

Die obige Liste ist nicht vollständig. Wie üblich wurden zahlreiche Fehlerbehebungen und neue Funktionen integriert. Die Versionshinweise heben lediglich die wichtigsten Änderungen hervor; die detaillierten Protokolle können Sie gerne auf GitHub (<https://github.com/grommunio>) einsehen.

In der offiziellen Dokumentation werden die erforderlichen Schritte für das Update-Verfahren beschrieben.

**Beiträge & Danksagungen**

Vielen Dank an unsere Kunden, Partner und die gesamte Community – insbesondere an die Community für ihre kontinuierlichen Beiträge, vor allem an:

- MrPikPik, tiredofit, maddin200, artem, steve, thermi, milo, Bheam, crpb, rnagy, walter und viele andere

Ein besonderer Dank gilt der Microsoft Corporation für die fruchtbare Zusammenarbeit bei der Entwicklung von Standards und Protokollen sowie T-Systems International für die gemeinsame Arbeit an Scale-Out-Installationen, die höchsten Unternehmensanforderungen gerecht werden.

## grommunio 2022.05.2

- Art der Veröffentlichung: Kleinere Version
- Veröffentlichungsdatum: 31. August 2022
- Allgemeine Verfügbarkeit: Ja

**Highlights**

- Unterstützung für PHP 8.0 und 8.1
- Unterstützung für „SendAs“ (zusätzlich zu „Im Namen von senden“)
- Verbessertes Design und verbesserte Handhabung der Admin-Oberfläche, einschließlich Themensuche
- Mehrsprachige Unterstützung mit 22 Sprachen
- Mehrere Abhängigkeitserweiterungen für die Plattformen EL 8, Debian 11 und Ubuntu 22.04
- Hierarchie für öffentliche Ordner in grommunio Admin (API, CLI und Web)
- Unterstützung für ACLs (Zugriffsrechte) für öffentliche Ordner im Admin-Bereich von grommunio Admin (API, CLI und Web)

**Neue Funktionen**

- Unterstützung für mehrere iCal- und vCard-Formate
- Vereinheitlichung der MAPI-Bibliotheken in allen Webkomponenten
- Konfigurierbare Größe des midb-Befehlspuffers für umfangreiche IMAP-Migrationen (80 GB+ pro Postfach)
- Migration: Kopano-Archiver-Stub-Elemente ignorieren

**Verbesserungen**

- Unterstützung für gebündelte LDAP-Verbindungen über TLS (wiederherstellbare Richtlinie)
- Verbesserte Zeitzonenverarbeitung auf Basis der neuesten IANA-Zeitzonenrichtlinien
- kdb2mt: Unterstützung für die Wiederherstellung beschädigter Anhänge, bei denen PR_ATTACH_METHOD fehlt
- kdb2mt: Entfernung der PK-1005-Warnung, da diese nun implementiert ist
- delmsg: Unterstützung für die Suche nach Postfächern allein anhand des Postfachverzeichnisnamens
- http: Hinzufügung der Konfigurationsanweisung „msrpc_debug“
- nsp: Hinzufügung der Konfigurationsanweisung „nsp_trace“
- mh_nsp: Hinzufügen von Delegaten funktionsfähig gemacht
- kdb2mt: Unterstützung für die Wiederherstellung beschädigter Anhänge, bei denen PR_ATTACH_METHOD fehlt
- imap: Ausgabe von überflüssigen CAPABILITY-Zeilen bei Verbindung und Anmeldung
- imap, pop3: Unterstützung für die Erkennung von LF als Zeilenendezeichen (außer CRLF)
- Die Konfigurationsdirektive „tls_min_proto“ wurde hinzugefügt, damit ein Mindeststandard für TLS festgelegt werden kann, wenn Ihre Distribution keine Krypto-Richtlinien enthält (<https://gitlab.com/redhat-crypto/fedora-crypto-policies>)
- „autodiscover.ini“: Neue Direktiven „advertise_mh“ und „advertise_rpch“ für eine feinere Steuerung einzelner Protokollankündigungen; ersetzt „mapihttp“.
- exmdb_provider: Die Ordnergrenze wurde von 10.000 auf 28 Milliarden angehoben
- oxcmail: Übermäßige Base64-Kodierung wird unterbunden.
- Verbesserungen an der Online-/interaktiven Suche von Outlook für eine bessere Reaktionsgeschwindigkeit im Online-Modus.
- Nachrichten werden bei der Konvertierung ins Internet-Mail-Format nun vorzugsweise als „quoted-printable“ kodiert. Dies könnte bei der Spam-Klassifizierung helfen.
- delivery-queue: Die maximale E-Mail-Größe wird nun strikt durchgesetzt und nicht mehr auf die nächsten 2 Megabyte aufgerundet.
- gromox-dscli: Die Option -h ist nicht mehr zwingend erforderlich; sie wird bei Fehlen aus dem Argument -e abgeleitet.

Die obige Liste ist nicht vollständig. Wie üblich wurden zahlreiche Fehlerbehebungen und neue Funktionen integriert. Die Versionshinweise heben lediglich die wichtigsten Änderungen hervor; die detaillierten Protokolle können Sie gerne auf GitHub (<https://github.com/grommunio>) einsehen.

In der offiziellen Dokumentation werden die erforderlichen Schritte für den Aktualisierungsvorgang beschrieben.

**Wusstest du schon?**

grommunio ist bestrebt, die Standards und Protokolle, auf denen grommunio aufbaut, präzise zu dokumentieren, da diese die Grundlage für eine stabile Kommunikation und Funktionalität bilden. Wir bei grommunio korrigieren zudem regelmäßig fehlerhafte Passagen in der Dokumentation von Microsoft – Beispiel: <https://github.com/MicrosoftDocs/office-developer-client-docs/pull/613/commits/09c4ada5114d8e2d9f65ce29a25f40a6fc6c2278>

In diesem Sinne haben wir die Dokumentation zu grommunio online veröffentlicht (<https://github.com/grommunio/grommunio-documentation>), damit Beiträge aus beliebigen Quellen die Dokumentation zu grommunio so gut wie möglich gestalten können.

**Beiträge**

Vielen Dank an unsere Kunden, Partner und die gesamte Community – insbesondere an die Community für ihre kontinuierlichen Beiträge, vor allem an:

- Robert, der mit verschiedenen Beiträgen zur Unterstützung von BSD beigetragen hat.
- Walter, für seine vielfältigen Beiträge im Bereich der Migrationswerkzeuge.
- Christopher, für sein vorbildliches Engagement in der grommunio-Community als Betreuer.
- Michael, für Berichte zur Ausfallsicherheit der Admin-API in verteilten Umgebungen.
- Stefan, Bob und Andreas für ihr Feedback zur Einrichtung von Containern in großem Maßstab.
- Rob und Hannah für ihre Anleitung zum F5 nginx Plus/Unit.
- Microsoft für die Überprüfung, das Feedback und die Akzeptanz von Fehlern in der Dokumentation von Microsoft.
- ILS für die intensive Zusammenarbeit bei der Bereitstellung von grommunio in über 22 Sprachen.
- Artem, Milo, Hugel und viele weitere für verschiedene sprachliche Beiträge.

## grommunio 2022.05.1

- Art der Veröffentlichung: Hauptversion
- Veröffentlichungsdatum: 16. Mai 2022
- Allgemeine Verfügbarkeit: Ja
- grommunio: Unterstützung für Ubuntu 22.04
- grommunio: Unterstützung für NetIQ eDirectory
- grommunio: Unterstützung für 389 Directory Server
- grommunio: Unterstützung für Multi-Forest-Installationen von Active Directory
- grommunio: Unterstützung für den IBM z15 (T02)-Mainframe
- grommunio: API-Erweiterungen zur Unterstützung von Vorgängen auf Store-Ebene, z. B. Festlegen von Store-Berechtigungen und Store-Eigenschaften
- grommunio: Automatische Wiederherstellung von Verbindungen bei lang andauernden und/oder fehleranfälligen Verbindungen (libexmdbpp)
- grommunio: Verfügbarkeit in der OTC (Open Telekom Cloud) über T-Systems
- grommunio: Verfügbarkeit der grommunio Antispam-Weboberfläche über grommunio Admin und API
- grommunio: Verbesserungen bei der BSD- und Bibliothekskompatibilität (z. B. LibreSSL)
- grommunio: Integration von grommunio Office und grommunio Archive nun auch für appliance-Anwender (grommunio-setup)
- grommunio: Multi-Server-Verwaltung mit integrierter Placement-Policy-Engine, integriert in Admin API
- grommunio: Mehrere Aktualisierungen der Dokumentation, darunter Debian und Ubuntu
- grommunio: Mehrere sicherheitsrelevante Verbesserungen und Optimierungen
- grommunio: Vereinfachung der Bereitstellungsarchitektur für hochskalierbare Container-Bereitstellungen (Docker, Kubernetes)
- grommunio: Umstellung auf AF_LOCAL-Sockets, wodurch der Overhead von TCP bei Socket-Verbindungen entfällt
- grommunio: Standardwerte für Benutzervorlagen bei der Benutzererstellung (über CLI und die Benutzeroberfläche) für die Massenbereitstellung
- grommunio Groupware: Konfigurationsparameter, die erweiterte Analysemöglichkeiten für Fachleute ermöglichen, z. B. `imap_cmd_debug`
- grommunio Groupware: Verbesserungen an Service-Plugins und zusätzliche Funktionen wie die Bereinigung des Speichers (gelöschte Elemente)
- grommunio Groupware: Erweiterung der Analyse-Tools, z. B. gromox-dscli für die Autodiscover-Konnektivitätsanalyse
- grommunio Groupware: Einführung von Flags zur Verwaltung des Lesestatus öffentlicher Ordner
- grommunio Groupware: Neue Migrationswerkzeuge für den Import von EML (RFC 5322), iCalendar (ICS) und vCard (VCF)
- grommunio Groupware: Suchverbesserungen, die zu einer etwa 15-fachen Leistungssteigerung bei Online-Suchvorgängen führen
- grommunio Groupware: Mehrere Verbesserungen an den IMAP- und POP-Daemons für mehr Leistung und Stabilität
- grommunio Groupware: Mehrere Verbesserungen an bestehenden Migrationswerkzeugen (imapsync, kdb2mt, ...), die beschädigte Daten filtern und teilweise sogar reparieren sowie Berechtigungen, soweit möglich, aus der Quelle migrieren
- grommunio Groupware: Mehrere Optimierungen bei der Handhabung des Cache-Modus, unter Nutzung alternativer Statusrückmeldungen
- grommunio Groupware: Upgrade auf den FTS5-Suchindex
- grommunio Groupware: Upgrade-Fähigkeit von Benutzerspeichern für weitere Erweiterbarkeit des Funktionsumfangs
- grommunio Web: Möglichkeit zur Festlegung rekursiver Berechtigungen durch Kopieren von Änderungen auf Objekte in untergeordneten Hierarchieebenen
- grommunio Web: Erweiterungen für Szenarien mit mehreren Kontaktordnern und logischen Filtern (Kontakte mit E-Mail-Adressen)
- grommunio Web: Integration der S/MIME-Verwaltung mit Unterstützung für mehrere S/MIME-Schlüssel und Schlüsselverwaltung
- grommunio Web: Integration von grommunio Archive
- grommunio Web: Integration von grommunio Files mit Verwaltung mehrerer Konten
- grommunio Web: Integration von grommunio Office mit gemeinsamer Bearbeitung von Office-Dokumenten in Echtzeit
- grommunio Web: Integration von Online-Karten auf Basis von OSM (OpenStreetMap) für Kontakte und globale Kontakte
- grommunio Web: Leistungsoptimierungen durch Zwischenspeicher und Reduzierung der Objektgröße, was zu einer mehr als vierfachen Übertragungsgeschwindigkeit für den Benutzer führt
- grommunio Web: Mehrere Verbesserungen im Editor, z. B. umfassende Kompatibilität beim Kopieren und Einfügen mit Office-Dokumenten
- grommunio Web: Mehrere Verbesserungen hinsichtlich Design und Kompatibilität, z. B. verbessertes Druckformat und verbesserte Verwaltung von Favoritenordnern
- grommunio Web: Unterstützung für die Suche über mehrere Hierarchieebenen hinweg ohne Leistungseinbußen
- grommunio Web: Unterstützung für Suchvorgänge anhand von Präfixen, z. B. „gro“ → „grommunio“
- grommunio Web: Aktualisierungen der Übersetzungen, die nun alle Module von grommunio Web umfassen
- grommunio Sync: Verbesserte Unterstützung für MIME (rfc822, rfc2822) und S/MIME
- grommunio Sync: Leistungsverbesserungen durch Redis-basiertes Zustandsmanagement – > 100 kops (Tausend Operationen pro Sekunde) pro Instanz möglich
- grommunio Sync: Funktionen zur Freigabe öffentlicher Ordner
- grommunio Chat: Unterstützung für erweiterte Operationen (Löschen)
- grommunio Meet: Automatische Deaktivierung der Medienfreigabe bei Erreichen des Limits für Videosender
- grommunio Meet: Dynamische Ratenbegrenzung, automatische Priorisierung von Videostreams
- grommunio Meet: Integration von Umfragen und Umfrageverwaltung
- grommunio Meet: Verschiedene Verbesserungen im Zusammenhang mit Brücken, insbesondere bei Stream-Brücken
- grommunio Meet: Verschiedene Verbesserungen bei der Verwaltung von Breakout-Räumen (Benachrichtigungen)
- grommunio Archive: Automatische Schlüsselgenerierung, Sphinx-Verbesserungen
- grommunio Archive: Vereinfachte Installation über grommunio-setup
- grommunio Office: Automatische Schriftartenverwaltung/-generierung über systeminstallierte Schriftarten (ds-fontgen)
- grommunio Office: Vereinfachte Installation über grommunio-setup

Nur verfügbar für Kunden/Partner mit privilegiertem Zugriff (Beta-Zulassung):

- grommunio: Vorläufige Unterstützung für Red Hat Enterprise 9 (Stream, Beta)
- grommunio: Vorläufige Unterstützung für SUSE Liberty Linux
- grommunio Meet: Microsoft- und Outlook-Plug-in für das Meeting-Management
- grommunio Meet: Office/Meet-Integration
- grommunio Meet: Whiteboard-Integration
- grommunio Chat: Integration von Matrix (Homeserver+Element)

Wie üblich wurden zahlreiche Fehlerbehebungen und neue Funktionen integriert. Die Versionshinweise heben lediglich die wichtigsten Änderungen hervor – die detaillierten Protokolle finden Sie unter [GitHub](https://github.com/grommunio)

In der [offiziellen Dokumentation](/admin/operations/#updating-grommunio) werden die erforderlichen Schritte für das Update-Verfahren beschrieben.

Wir möchten der Community für ihre kontinuierlichen Beiträge danken, insbesondere aber folgenden Personen:

- Jens Schleusener, der Tools zur Rechtschreibprüfung über [FOSSIES codespell](https://fossies.org/) bereitgestellt hat
- Robert Nagy, der verschiedene Beiträge zur Unterstützung von OpenBSD geleistet hat
- Walter Hofstädtler, der verschiedene Beiträge zur Automatisierung von Importen aus MS Exchange und Kopano geleistet hat.

## grommunio 2021.08.3

- Art der Veröffentlichung: Kleinere Version
- Veröffentlichungsdatum: 8. Februar 2022
- Allgemeine Verfügbarkeit: Ja
- grommunio: Unterstützung für Univention Corporate Server 5
- grommunio: Unterstützung für Red Hat Directory Server
- grommunio: Unterstützung für FreeIPA, einschließlich doppelter Primärattribute
- grommunio: Unterstützung für Kong-Gateway
- grommunio: Unterstützung für APISIX-Gateway
- grommunio: Unterstützung für Kemp-Load-Balancer
- grommunio: Unterstützung für IBM Power10
- grommunio: Verbesserungen bei der Skalierung von haproxy mit Unterstützung für über 100.000 gleichzeitige Eingangsverbindungen
- grommunio: Neuer Indexdienst zur Vorindizierung von Webinhalten
- grommunio: Verfügbarkeit eines Einreichungsdienstes
- grommunio: Höchste SSL/TLS-Standards gemäß der QualysLabs A+-Zertifizierung
- grommunio: Verbesserte Sicherheit und Datenschutz durch den Einsatz von HSTS, CSP und der HTTP-Berechtigungsrichtlinie
- grommunio: Erweiterte Komprimierung von HTTP(S)-fähigen Streams (Brotli)
- grommunio: Einführung von „privilegBits“ (Chat, Video, Dateien, Archiv)
- grommunio: Mainstream-Verfügbarkeit von grommunio-archive (auch für die Community)
- grommunio: Aufgabenverwaltung für die asynchrone Bearbeitung von Aufgaben mit längerer Laufzeit (TasQ)
- grommunio: Thread-sicherer LDAP-Adapterdienst (API)
- grommunio-Groupware: Volle Unterstützung für S/MIME und GPG über (Outlook) MAPI/HTTP, MAPI/RPC und andere Clients (IMAP/POP/SMTP)
- grommunio Groupware: Automatisches Anhängen von gemeinsam genutzten Postfächern über AutoDiscover/Web mit vollständigen Eigentümerrechten
- grommunio-Groupware: Sprachunabhängige Zuordnung bei der Ordnermigration
- grommunio-Groupware: Migrationsskript für Exchange (online/vor Ort) zu grommunio
- grommunio Groupware: Steuerung versteckter Ordner bei Migrationen
- grommunio Groupware: Erweiterte Unterstützung für mehrwertige Eigenschaftstypen mit variabler Länge
- grommunio Groupware: Unterstützung für sprachbasierte Speicher bei der Erstellung (mkprivate / mkpublic)
- grommunio Web: Automatisches Hinzufügen von Speichern mit vollständigen Eigentümerrechten (zusätzliche Postfächer)
- grommunio Web: Festlegen von Out of Office-Informationen für andere Benutzer (mit vollständigen Rechten)
- grommunio Web: Verbesserungen bei der Sitzungs- und Speicherverwaltung (Leistung, Sprachen, …)
- grommunio Web: Unterstützung für Microsoft Exchange-kompatible ACLs und Profile (Redakteur, Autor, …)
- grommunio Web: Erweiterung der Begrenzung der Suchergebnisse auf 1000 Ergebnisse
- grommunio Web: Upgrade des Editors auf TinyMCE 4.9.11 mit Vorbereitung auf Tiny 5+
- grommunio Web: Sprachaktualisierungen (Englisch, Deutsch, Russisch, Ungarisch, Dänisch, …)
- grommunio Web: Verbesserungen der Benutzererfahrung (Design, Kompatibilität, Leistung)
- grommunio Web: Behebung fehlender Schriftartendefinition für neue E-Mails und Inline-Kommentare
- grommunio Web: Behebung von Aufgabenanfragen im Zusammenhang mit der Interoperabilität mit Outlook
- grommunio Web: Korrekturen beim Fingerprinting (Firefox ESR)
- grommunio Web: Unterstützung für „Shallow“-MDM-Geräte
- grommunio Web: W3C CSS 3 + SVG-Zertifizierung
- grommunio Web: Aktualisierung von dompurify (XSS-Schutz)
- grommunio Web: Verbesserungen bei der Bereitstellung statischer Ressourcen für Webanwendungen (Reduzierung der Datenmenge und Leistungssteigerung)
- grommunio Sync: Reduzierung des Speicherbedarfs pro EAS-Gerät um 24 %
- grommunio Sync: Korrekturen/Verbesserungen auf Basis einer statischen Codeanalyse
- grommunio Chat: Update auf 6.2.1

Nur für Kunden/Partnerzugang verfügbar (Beta-Freigabe):

- grommunio Chat: Integration von Matrix (Homeserver+Element)
- grommunio: Unterstützung für den IBM z15 (T02) Mainframe
- grommunio: Vorläufige Unterstützung für Ubuntu 22.04 (ab dem Veröffentlichungsdatum von Ubuntu abgeschlossen)
- grommunio: Vorläufige Unterstützung für SUSE Liberty Linux

In der [offiziellen Dokumentation](/admin/operations/#updating-grommunio) werden die erforderlichen Schritte für den Aktualisierungsvorgang beschrieben.

## grommunio 2021.08.2

- Art der Veröffentlichung: Kleinere Version
- Veröffentlichungsdatum: 24. November 2021
- Allgemeine Verfügbarkeit: Ja

Wesentliche Änderungen:

- grommunio: Produktionsverfügbarkeit von Debian 11 über das Repository
- grommunio: Verfügbarkeit der grommunio-Apps für Mobilgeräte über den App Store und den Play Store
- grommunio: Unterstützung für Stretched-Cluster-Installationen
- grommunio: Vorläufige Unterstützung für OpenID Connect über Keycloak
- grommunio Web: Umfangreiches Upgrade mit über 230 Fehlerbehebungen, aktualisiertem WYSIWYG-Editor sowie Verbesserungen bei Design und Leistung
- grommunio Groupware: Verbesserte Implementierung der Abwesenheitsautomatik
- grommunio Groupware: Verbesserte Unterstützung für die Verarbeitung von OP_MOVE-Regeln
- grommunio Groupware: Verbesserte vCard-Verarbeitung
- grommunio Groupware: Vollständige mehrsprachige Postfachunterstützung für 91 Sprachen
- grommunio Groupware: Vollständige Unterstützung für den Postfachbesitzer-Modus
- grommunio Groupware: Vollständige Unterstützung für gemeinsam genutzte Postfächer
- grommunio Groupware: Import in öffentliche Speicher
- grommunio Groupware: Unterstützung für den Zugriff auf öffentliche Ordner über EAS (Exchange ActiveSync)
- grommunio Groupware: Ausfallsicherheit der Synchronisierung im Offline-Modus bei beschädigten Objekten (benannte Eigenschaften)
- grommunio Admin: Erweiterte Unterstützung für Active Directory-Aliase (kompatibel mit Exchange)
- grommunio Admin: Inline-Hilfe für besseres Verständnis und einfachere Verwaltung
- grommunio Admin: Integration der Fernlöschfunktion für Administratoren über die Admin-Benutzeroberfläche/CLI
- grommunio Admin: Integration des Lizenzmanagers in die Admin-Benutzeroberfläche
- grommunio Admin: Neugestaltung der Admin-Benutzeroberfläche für bessere Benutzerfreundlichkeit
- grommunio Chat: Umfangreiches Upgrade auf 6.1.1 mit zahlreichen Fehlerbehebungen, Anpassungen des Designs und einem nahtlosen Upgrade-Vorgang
- grommunio-Einrichtung: Unterstützung für Sonderzeichen unter besonderen Umständen bei grommunio Meet und grommunio Files

In der [offiziellen Dokumentation](/admin/operations/#updating-grommunio) werden die erforderlichen Schritte für das Update-Verfahren beschrieben.

### Aufgaben nach dem Update

Bei der Verwendung der Modelle grommunio und appliance müssen Sie möglicherweise bei einigen Paketen (abhängig von Ihrer Konfiguration) Anpassungen an Ihrer Konfiguration vornehmen:

Die Liste der bekannten Dateien, für die möglicherweise eine Anpassung erforderlich ist, ergibt sich aus den Dateiendungen der Konfigurationsdateien:

1.  `/etc/grommunio-antispam/local.d/redis.conf.rpm*`
2.  `/etc/grommunio-web/config.php.rpm*`
3.  `/etc/grommunio-chat/config.json.rpm*`
4.  `/etc/prosody/prosody.cfg.lua.rpm*`

Wurde die Konfigurationsdatei durch ein Paket-Update überschrieben, besteht die einfachste Vorgehensweise darin, die ursprüngliche Konfigurationsdatei wieder an ihren ursprünglichen Speicherort zu kopieren. Es wird empfohlen, zuvor eine Sicherungskopie zu erstellen und den entsprechenden Dienst entweder über die Admin-Benutzeroberfläche/CLI oder die Systemkonsole/SSH neu zu starten:

```bash
cp /etc/prosody/prosody.cfg.lua /etc/prosody/prosody.cfg.lua.rpmnew
cp /etc/prosody/prosody.cfg.lua.rpmsave /etc/prosody/prosody.cfg.lua
systemctl restart prosody
```

## grommunio 2021.08.1

- Art der Veröffentlichung: Hauptversion
- Veröffentlichungsdatum: 17. August 2021
- Allgemeine Verfügbarkeit: Ja

Wesentliche Änderungen:

- Erweiterung des Support-Umfangs und der verfügbaren Repositories (SUSE Linux Enterprise Server 15, Red Hat Enterprise Linux 8 inkl. Derivate)
- Erweiterung der verfügbaren Prozessorarchitekturen: ARM64, PowerPC (ppc64le) und IBM zSeries (s390x)
- Neue Installationsimages: OVA (VMware), Docker, Raspberry Pi (4+)
- Live-Statusübersicht und Status mobiler Geräte
- Unterstützung für mobile Richtlinien (MDM)
- Umfangreiche Verbesserungen der Migrationswerkzeuge für die Migration von Exchange (PST), Kopano (DB/Anhänge) und generischen E-Mail-Systemen (IMAP/CalDAV/CardDAV)
- Unterstützung für Active Directory-Forest-Installationen
- Unterstützung für Stellvertreterkonfiguration
- Erweiterungen der Free/Busy-Funktionalität
- Unterstützung für spezielle Steuerzeichen
- Konfigurationsbasierte Integration von grommunio Files, Meet und Chat in grommunio Web
- Einbindung von grommunio Files, Meet, Chat und Archive in die Installationsimages

:::caution
Aufgrund von <https://grommunio.com/en/news-en/aus-grommunio-wird-grommuniogrommunio-becomes-grommunio> wurde „grammm“ in „grommunio“ umbenannt. Wir sind uns bewusst, dass dies einige Herausforderungen bei der Migration bestehender Plattformen mit sich bringt. Alle Abonnenten haben Anspruch auf kostenlose professionelle Unterstützung beim Migrationsprozess. Für den Migrationsprozess wird die erforderliche Zeit auf 5000 Benutzer pro Stunde geschätzt.
:::

Aufgrund der Art der Umstellung von `grammm` auf `grommunio` wurde kein einfacher, automatisierter Upgrade-Mechanismus eingerichtet. Abonnenten, bei denen die Update-Dienste aktiviert sind, haben automatisch Zugriff auf die Dienste, die im Rahmen des Distributions-Upgrade-Prozesses verfügbar sind. Die Konfigurationsumstellung (Konfiguration, Daten) hat sich kaum verändert, sodass die Migration mithilfe der entsprechenden Konfigurations-Dumps möglich ist.

Die Version 2021.08.1 brachte zudem in allen Komponenten erhebliche Fortschritte mit sich. Die wichtigsten Neuerungen nach Bereichen:

- **grommunio Core (gromox)** — vollständige Unterstützung für S/MIME und GPG bei MAPI/HTTP, MAPI/RPC sowie IMAP/POP/SMTP; automatische Zuordnung gemeinsam genutzter Postfächer über AutoDiscover mit vollständigen Eigentümerrechten; sprachenunabhängige Zuordnung bei der Ordnermigration; ein Exchange-Migrationsskript (online/vor Ort); erweiterte Verarbeitung von Eigenschaften mit mehreren Werten und variabler Länge; sowie sprachbasierte Speichererstellung (mkprivate/mkpublic).
- **grommunio Admin (API & Web)** — Organisationen und rollenbasierte Berechtigungen (einschließlich schreibgeschützter Rollen), Hierarchie öffentlicher Ordner und ACLs, LDAP-Server-Pooling und Import von Aliasen, Fetchmail-Verwaltung, datenbankgestützte Konfiguration (dbconf), eine Live-Statusseite, Protokoll- und Mail-Queue-Anzeigen, benutzerspezifische Verwaltung von Synchronisierungsrichtlinien sowie ein neu gestaltetes Dashboard.
- **grommunio CUI** – eine überarbeitete Konsolenoberfläche: YaST-basierte Netzwerk- und Zeitzonenkonfiguration, Umschaltung des Tastaturlayouts, ein Protokoll-Viewer, Journald-Integration sowie zahlreiche Verbesserungen hinsichtlich Benutzerfreundlichkeit und Sicherheit.
- **grommunio Sync** — ein um 24 % geringerer Speicherbedarf pro EAS-Gerät und Absicherung durch statische Analyse.
- **grommunio-Einrichtung** — vereinfachte, integrierte Einrichtung von „Files“, „Meet“, „Chat“ und „Archive“.
- **grommunio Web** – S/MIME-Schlüsselverwaltung, Integration von „Files“, „Office“ und „Archive“, OpenStreetMap-Karten für Kontakte, mehrstufige Suche und Suche nach Präfixen sowie umfassende Leistungs- und Editorverbesserungen.

Die vollständige Commit-Historie für jedes Repository dieser Version ist auf [GitHub](https://github.com/grommunio) verfügbar.

In der [offiziellen Dokumentation](/admin/operations/#updating-grommunio) werden die erforderlichen Schritte für das Update-Verfahren beschrieben.
