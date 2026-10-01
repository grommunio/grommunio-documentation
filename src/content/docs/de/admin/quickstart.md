---
title: "Schnellstart"
description: "Dieses Kapitel enthält eine kurze Anleitung, die als Checkliste für die Installation und Inbetriebnahme des grommunio dienen kann."
sidebar:
  order: 20
---

Dieses Kapitel enthält eine kurze Anleitung, die als Checkliste für die Installation und Inbetriebnahme des grommunio dienen kann.

- Laden Sie die Installation ISO von <https://download.grommunio.com/appliance/grommunio.x86_64-latest.install.iso> herunter. Bei dem Installationsimage handelt es sich um ein Hybrid-Installationsimage, das sich auch mit USB-Imaging-Tools wie GNU ddrescue oder <https://rufus.ie> auf einen USB-Stick übertragen lässt.
- Verwenden Sie das Installationsmedium von grommunio, um die Installation durchzuführen und die Konfiguration im Schnellstartmodus vorzunehmen, indem Sie die folgenden Kapitel durchgehen.
- Erstellen oder beantragen Sie TLS-Zertifikate für den sicheren, verschlüsselten Betrieb der Hauptdienste.
- Erstellen Sie die entsprechenden DNS-Einträge (A-, MX-, TXT- und CNAME-Einträge).
- Konfigurieren Sie den grommunio appliance, indem Sie grommunio-setup ausführen.

## Mindestanforderungen

Für die Installation von grommunio (oder bei Verwendung von grommunio Appliance) gelten die folgenden Mindestanforderungen:

- Server oder virtuelle Maschine (VMware, Xen, KVM oder Hyper-V) mit mindestens:
  - 4 CPU-Kernen
  - 6 GB RAM
  - 32 GB Systemfestplatte für das Betriebssystem und die Basisinstallation. Das Installationsprogramm
    überschreibt die **gesamte** Zielfestplatte (siehe den Hinweis unter *Installation*).
    Stellen Sie **zusätzlichen** Speicherplatz für Postfachdaten bereit – dies ist der größte Faktor bei der Dimensionierung
    und wächst mit der Benutzeranzahl und der Quote pro Postfach.
- Korrekt konfigurierte DNS-Einträge, mindestens zwei, zum Beispiel:
  - **\<FQDN\>**, zum Beispiel **mail.example.com**
  - **autodiscover.example.com**
- Ein TLS-Zertifikat, das alle DNS-Namen enthält, alternativ ein Wildcard-Zertifikat für die gesamte Domäne. (Let's Encrypt kann über grommunio-setup konfiguriert werden.) Wenn Sie bereits über ein Zertifikat verfügen, kann dieses wiederverwendet werden, sofern es im PEM-Format vorliegt und eine Datei die Zertifikatskette sowie das Serverzertifikat enthält, zusammen mit einer separaten Schlüsseldatei.

:::note
Es wird dringend empfohlen, den entsprechenden Eintrag *autodiscover.example.com* für DNS korrekt einzurichten, da AutoDiscover den Server andernfalls nicht ermitteln kann.
:::

:::caution
IPv6 muss unbedingt aktiviert sein, da viele Vorkonfigurationen darauf basieren. Eine „echte“ IPv6-Adresse ist nicht erforderlich, die Verfügbarkeit von `::1` reicht aus.
:::

Optionale Anforderungen:

- MX-Einträge vom Typ DNS für die Zustellung eingehender E-Mails.
- Zum Zeitpunkt der Zertifikatserstellung durch Let's Encrypt muss Port 80 für alle definierten DNS-Einträge erreichbar sein.

## Installation

1.  Herunterladen des bootfähigen x86-Images von download.grommunio.com: <https://download.grommunio.com/appliance/grommunio.x86_64-latest.install.iso>
2.  Laden Sie die Installationsdatei auf den Server, auf dem grommunio installiert werden soll.
3.  Starten Sie vom Installationsmedium und wählen Sie im Bootmenü **„Install grommunio“**, bevor der 10-Sekunden-Countdown abläuft (der voreingestellte Eintrag *Boot from Hard Disk* startet eine bestehende Installation).

:::caution
Beachten Sie, dass das Installationsprogramm um Bestätigung bittet, bevor die **gesamte** Zielfestplatte gelöscht und überschrieben wird!
:::

![Bootmenü des grommunio-Appliance-Installers](/img/appliance_boot_menu.png)

Nachdem das Image auf die Festplatte kopiert wurde, startet die Appliance das installierte System und ist bereit für die Einrichtung. Screenshots aller Schritte finden Sie unter [Installation der Appliance](/admin/installation/#installing-the-appliance).

## Einrichtung

Nach der Installation zeigt die Appliance die grommunio-Konsolenoberfläche (CUI) an. Ausführlichere Anweisungen zum Einrichtungsprozess finden Sie unter [grommunio Appliance-Konfiguration mit CUI/Einrichtung](/admin/installation/#grommunio-appliance-configuration-with-cuisetup).

:::caution
Das Root-Passwort ist anfangs nicht gesetzt (leer). Solange kein Passwort gesetzt ist, öffnet `F2` das Hauptmenü der CUI ohne Abfrage von Zugangsdaten.
:::

Um grommunio zu konfigurieren, gehen Sie wie folgt vor:

1.  Drücken Sie `F2`, um das Hauptmenü zu öffnen. Passt das Tastaturlayout der Konsole nicht zu Ihrer Tastatur, ändern Sie es zuerst mit **„Keyboard configuration“** (oder `F5`).
2.  Wählen Sie **„Change system password“**, um ein neues Root-Passwort festzulegen.
3.  Wählen Sie **„Network interface configuration“**, um das Netzwerk der Appliance einzurichten (Adresse, Gateway, DNS-Server).
4.  Wählen Sie **„Change hostname“**, um den vollqualifizierten Domänennamen festzulegen, z. B. `mail.example.com`. Stellen Sie sicher, dass er auf die Appliance auflöst (DNS oder `/etc/hosts`).
5.  Wählen Sie **„Timezone configuration“**, um die richtige Zeitzone einzustellen.
6.  Wählen Sie **„timesyncd configuration“**, um die richtigen Zeitserver (NTP) für genaue Datums- und Uhrzeiteinstellungen einzurichten.
7.  Wählen Sie **„grommunio setup wizard“**, um interaktiv durch die weitere Konfiguration geführt zu werden.
8.  (Optional) Wählen Sie **„Change admin-web password“**, um das Passwort der Admin-UI nach der Einrichtung nach Ihren Wünschen zurückzusetzen.

Der „grommunio setup wizard“ ruft *grommunio-setup* auf, das über die CUI oder ein beliebiges anderes Terminal der Appliance gestartet werden kann.

:::note
SSH ist standardmäßig aktiviert, daher kann grommunio-setup auch über eine SSH-Sitzung ausgeführt werden. Beachten Sie, dass Sie zunächst ein Passwort festlegen müssen, bevor Sie sich über SSH anmelden können.
:::

Um innerhalb des grommunio-Setup-Assistenten (grommunio-setup) zu navigieren, beachten Sie bitte die folgenden Navigationstipps:

- *\<TAB\>* dient zur Navigation durch Dialogelemente
- *\<ARROW-UP\>* oder *\<ARROW-DOWN\>* dienen zur Navigation innerhalb von Formularelementen (z. B. bei der Eingabe von Abonnementdaten) oder Menüauswahlen (bei der Datenbankeinrichtung)
- *\<LEERTASTE\>* schaltet Kontrollkästchen um (etwa bei den optionalen Rollen in der Funktionsauswahl)
- Die Tasten *\<j\>* oder *\<k\>* dienen zum Scrollen in längeren, inhaltsreichen Dialogen (wie im Abschlussdialog)
- *\<ESC\>* beendet grommunio-setup in jeder beliebigen Phase der Konfiguration

Weitere Tastenkombinationen werden bei Anzeige von „grommunio-cui“ am unteren Bildschirmrand angezeigt.

grommunio-setup gibt für die meisten Dialogfelder automatisch Standardwerte vor; diese können nach Belieben überschrieben werden. Beispielsweise generiert grommunio-setup automatisch Passwörter, die nach der Installation auch in der grommunio-setup-Protokolldatei */var/log/grommunio-setup.log* verfügbar sind.

:::caution
Sollte die Konfiguration aus irgendeinem Grund fehlschlagen, kann grommunio-setup erneut ausgeführt werden. Aktuelle Versionen erkennen eine bestehende Installation und bieten an, sie zu **behalten**: Die Grundkonfiguration bleibt unverändert, und die optionalen Rollen (Chat, Meet, Files, Office, Archive) können hinzugefügt oder entfernt werden, wobei die Daten einer entfernten Rolle für ein späteres erneutes Hinzufügen erhalten bleiben. Die Alternative, eine Neukonfiguration **von Grund auf**, ist destruktiv und initialisiert die Installation neu; grommunio-setup warnt und verlangt eine Bestätigung, bevor Daten gelöscht werden. Um systembezogene Parameter eines laufenden Systems zu ändern, verwenden Sie stattdessen die grommunio-Verwaltungsoberfläche.
:::

:::caution
Der Installationsvorgang wird in der Datei **/var/log/grommunio-setup.log** protokolliert. Beachten Sie, dass diese Datei alle Instanzkonfigurationen enthält, die zur Konfiguration von grommunio-setup verwendet wurden. Als Abonnementinhaber haben Sie Anspruch auf Support. Wenn Sie Hilfe benötigen, können Sie beispielsweise das Installationsprotokoll an grommunio senden. (Passwortangaben sollten entfernt werden.)
:::

:::caution
Es wird empfohlen, das Installationsprotokoll nach erfolgreicher Installation an einem sicheren Ort aufzubewahren und es vom appliance zu löschen. Alternativ kann das Installationsprotokoll an einem sicheren Ort als Referenz für alle Angaben zu Ihrer Installation zur späteren Verwendung aufbewahrt werden.
:::

### grommunio Admin-Benutzer

Im Rahmen des grommunio-setup-Prozesses werden einige Konten automatisch angelegt – beispielsweise ein Datenbankkonto für die Benutzerverwaltung sowie ein Konto für den anfänglichen grommunio-Administrator (admin).

:::caution
Der Admin-Benutzer von grommunio und der Root-Benutzer von appliance sind voneinander getrennte, nicht synchronisierte Benutzer. Der Admin-Benutzer ist ausschließlich dem grommunio Administration-Framework bekannt und ist (absichtlich) kein Systembenutzer. Die Anmeldedaten beider Benutzer sind sicher aufzubewahren. Der Root-Benutzer ist der Hauptsystemadministrator, während „admin“ der Hauptadministrator von grommunio ist. Sie können (und sollten) unterschiedliche Passwörter haben. Aufgrund des Rollenkonzepts von grommunio wird sogar empfohlen, diese Passwörter in der Produktion nicht zu verwenden, sondern stattdessen für regelmäßig auszuführende Aufgaben Benutzer mit geringeren Berechtigungen anzulegen.
:::

:::note
Das Passwort des Hauptadministrators kann jederzeit mit „grommunio-cui“ oder durch Eingabe von „`grommunio-admin passwd --password "ChangeMe"`“ geändert werden.
:::

### Repository-Konfiguration

Das interaktive Konfigurationstool grommunio-setup fordert während der Ausführung die Anmeldedaten für Ihr Abonnement an. Wenn Sie über ein gültiges Abonnement verfügen, geben Sie bitte Ihre Abonnementdaten ein. Ohne gültiges Abonnement aktiviert grommunio-setup die Community-Repositorys, die nach bestem Bemühen bereitgestellt werden und für die kein Support angeboten wird. Mit einem gültigen Abonnement wird Ihr Abonnement-Repository aktiviert und stellt kommerzielle Pakete für die Installation bereit, damit Sie stets über die neuesten Funktionen und Fehlerbehebungen auf dem Laufenden bleiben.

:::note
Um ein gültiges Abonnement zu erhalten, wenden Sie sich bitte an einen unserer Partner oder nutzen Sie unsere etablierten Kommunikationskanäle unter <https://grommunio.com>
:::

### Zertifikate

grommunio-setup bietet vier Möglichkeiten zur Bereitstellung des von allen Diensten verwendeten TLS-Zertifikats:

- **Selbstsigniertes Zertifikat** – die einfachste Option (Standardeinstellung); Clients müssen dem Zertifikat bei der ersten Verbindung vertrauen. Am besten geeignet für Demos und Validierungen, nicht für den Produktiveinsatz.
- **Eigene Zertifizierungsstelle (CA) + Zertifikat** – Erstellen Sie eine lokale Zertifizierungsstelle und signieren Sie Zertifikate damit; nützlich für größere Validierungsumgebungen mit mehreren Instanzen.
- **Vorhandenes Zertifikat importieren** – Verwenden Sie Ihr eigenes PEM-Zertifikat bzw. Schlüsselpaar (ein SAN- oder Wildcard-Zertifikat wird empfohlen). Die flexibelste Option für öffentlich vertrauenswürdige Zertifizierungsstellen.
- **Let's Encrypt** – kostenlose, automatische Ausstellung und Erneuerung; erfordert während der Validierung (und Erneuerung) für jede Domain einen vom Internet aus erreichbaren Port 80. Empfohlen für die meisten einfachen Installationen.

Die Zertifikate werden in `/etc/grommunio-common/ssl` abgelegt und von den appliance-Diensten automatisch referenziert. Eine detaillierte Anleitung zu den einzelnen Optionen finden Sie unter [TLS-Konfiguration](/admin/installation/#tls-configuration).

## Firewall

Um einen reibungslosen Betrieb zu gewährleisten, öffnet das grommunio appliance verschiedene Ports, damit Clients darauf zugreifen können. Die folgenden Ports stehen standardmäßig zur Verfügung:

- 25 (SMTP)
- 80 (HTTP)
- 110 (POP3)
- 143 (IMAP)
- 443 (HTTPS)
- 587 (Submission – STARTTLS-E-Mail-Übermittlung)
- 993 (IMAPS)
- 995 (POP3S)
- 8080 (Admin, unverschlüsselt)
- 8443 (Admin HTTPS)

:::note
grommunio-setup aktiviert TLS für die Admin-UI auf Port 8443 mit dem bei der Einrichtung gewählten Zertifikat. Der unverschlüsselte Port 8080 bleibt ebenfalls geöffnet; sobald `https://<FQDN>:8443/` funktioniert, schließen Sie Port 8080 in der Firewall oder beschränken ihn auf Administrationsnetze. Port 465 (SMTPS, Übermittlung mit implizitem TLS) ist standardmäßig nicht aktiviert; Mailprogramme übermitteln über Port 587 (STARTTLS).
:::

Generell wird empfohlen, nur die Ports freizugeben, die für den Zugriff auf die Dienste erforderlich sind. Beachten Sie, dass die wichtigsten Protokolle des grommunio, RPC over HTTP, MAPI/HTTP, EWS (Exchange Web Services) und EAS (Exchange ActiveSync) alle über Port 443 (HTTPS) erreichbar sind.

Beachten Sie beim Einsatz von Proxys und Load Balancern, dass für den erfolgreichen Betrieb von RPC über Proxys eine spezielle Konfiguration erforderlich ist. Die für den Betrieb von RPC über Proxys erforderlichen HTTP-Transportmodi sind RPC_IN_DATA und RPC_OUT_DATA. Bekannte Proxy-Software, die diese RPC-Datenkanäle unterstützt, sind: haproxy, squid, nginx und Apache.

## Überprüfen Sie die Installation

Sobald grommunio-setup abgeschlossen ist, verfügen Sie über ein konfiguriertes – aber noch leeres – System. Überprüfen Sie, ob es funktioniert:

- Öffnen Sie die **Admin-Benutzeroberfläche** unter `https://<FQDN>:8443/` und melden Sie sich als **`admin`** mit dem von Ihnen festgelegten Passwort (oder dem von grommunio-setup generierten Passwort, das in der Zusammenfassung angezeigt und in `/var/log/grommunio-setup.log` vermerkt ist) an. Der Statusbildschirm der CUI listet die Adressen der Admin-UI ebenfalls auf.
- Öffnen Sie **grommunio Web** unter `https://<FQDN>/` – die Webmail- und Groupware-Oberfläche für Benutzer.

Wenn beide über HTTPS laden und die Anmeldung an der Admin-UI gelingt, ist die Appliance betriebsbereit.

## Nächste Schritte

Eine neu eingerichtete Appliance enthält noch keine E-Mail-Domänen und keine Benutzer. Fahren Sie fort mit:

- [Checkliste nach der Installation](/guides/post-install/) — Dienste und Ports prüfen, die erste Domäne und den ersten Benutzer anlegen, MX/SPF/DKIM/DMARC veröffentlichen und den Mailfluss Ende-zu-Ende nachweisen.
- [Administration](/admin/administration/) — Erstellen Sie Ihre erste E-Mail-**Domain** und Ihren ersten **Benutzer** und verwalten Sie anschließend Rollen, öffentliche Ordner und Einstellungen.
- [Betrieb](/admin/operations/) — Day-2-Aufgaben, Updates und TLS für die Admin-API.
- [Migration](/migration/) — Importieren Sie Postfächer aus Exchange, Kopano und anderen Systemen.

:::note[Vor der Inbetriebnahme]
Legen Sie eine **Backup**-Strategie fest, die die E-Mail-Speicher, Datenbanken und Konfigurationen abdeckt – siehe [Betrieb → Backup & Notfallwiederherstellung](/admin/operations/#backup--disaster-recovery) – und überprüfen Sie die Sicherheitsmaßnahmen jenseits der Firewall (Schließen des unverschlüsselten Admin-Ports 8080, fail2ban, 2FA/SSO).
:::
