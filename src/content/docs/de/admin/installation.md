---
title: "Installationsanleitung (grommunio Appliance)"
description: "Die grommunio Appliance vom ISO installieren, mit der Konsolenoberfläche (CUI) vorbereiten und mit dem grommunio-Einrichtungsassistenten konfigurieren."
sidebar:
  label: "Geführte Installation"
  order: 30
---

grommunio liefert einsatzbereite Appliances für:

- Bare-Metal- oder virtualisierte Umgebungen (ISO)
- Container-Umgebungen (Docker)
- Spezialisierte, automatisierte Virtualisierungsumgebungen (OVA)

sowie ein Community-Image, um grommunio auf einem Raspberry Pi auszuführen.

:::note
Für grommunio stehen verschiedene Möglichkeiten zur Automatisierung und Bereitstellung zur Verfügung. Es ist nicht möglich, alle diese Methoden hier zu beschreiben – sollten Sie nach einer bestimmten Art der Bereitstellung suchen, wenden Sie sich bitte an einen der Partner von grommunio oder direkt an grommunio. grommunio ist sowohl für sehr kleine Installationen als auch für große Hyperscale-Installationen mit Millionen von Nutzern verfügbar.
:::

Um grommunio über ISO bereitzustellen, müssen Sie das Installationsmedium auf Ihrem Installationsziel bereitstellen. Das ISO ist ein generisches, bootfähiges Installationsmedium, das in den meisten Szenarien funktioniert. Um das ISO auf einem Bare-Metal-System bereitzustellen, kann das ISO zur Vereinfachung der Installation auf USB-Sticks kopiert werden.

Die grommunio Appliance ist eine universell einsetzbare Installationsplattform, die alle für den erfolgreichen Betrieb von grommunio erforderlichen Komponenten enthält. Sie basiert auf openSUSE Leap 16.0 und umfasst bereits das Betriebssystem für eine vereinfachte Verwaltung. Bei jeder Appliance-Installation werden automatisch vorkonfigurierte Update-Server bereitgestellt und Dienste für die Nutzung vorbereitet. Wenn Sie eine universelle und einfache Bereitstellung suchen, ist die grommunio Appliance genau das Richtige für Sie. Dank vereinfachter Update-Verwaltung, Backups und vollständiger Portabilität kann die Appliance bei entsprechender Hardwareausstattung für 1 bis 2000 Benutzer betrieben werden. Für größere Installationen oder Installationen mit besonderen Anforderungen, wie beispielsweise – aber nicht beschränkt auf – geografisch verteilte, Cluster- oder Hyperscale-Installationen, wenden Sie sich bitte an unsere Partner und/oder unser Support-/Professional-Services-Team. Alternativ reichen die kombinierten Informationen aus der manuellen Installation in diesem Kapitel zusammen mit den Man-Pages aus, um grommunio nach Ihren Anforderungen einzurichten.

Die geführte Installation besteht aus drei Schritten:

1. [Installation der Appliance](#installation-der-appliance) vom ISO auf das Zielsystem.
2. Vorbereitung des Betriebssystems mit der [Konsolenoberfläche](#konfiguration-der-grommunio-appliance-über-cuisetup) (`grommunio-cui`): Root-Passwort, Netzwerk, Hostname, Zeit.
3. Konfiguration von grommunio mit dem [grommunio-Einrichtungsassistenten](#grommunio-einrichtungsassistent) (`grommunio-setup`): Rollen, Datenbank, Admin-Passwort, Domäne und TLS.

## Installation der Appliance

Starten Sie das Zielsystem vom ISO. Das Bootmenü bietet drei Einträge:

- **Boot from Hard Disk** – die Voreinstellung, die nach 10 Sekunden automatisch startet. Sie bootet ein bereits installiertes System; wählen Sie den Installer daher vor Ablauf des Countdowns.
- **Install grommunio 2026.06.2** – installiert die Appliance.
- **Failsafe -- Install grommunio 2026.06.2** – derselbe Installer mit konservativen Kernel-Optionen, für Hardware, auf der der reguläre Eintrag nicht startet.

![Bootmenü des grommunio-Appliance-Installers](/img/appliance_boot_menu.png)

Der Installer fragt vor dem Schreiben auf die Zielfestplatte nach einer Bestätigung. Die Appliance verwendet immer die **gesamte** Festplatte; alle Daten darauf werden gelöscht.

![Bestätigung vor dem Überschreiben der Zielfestplatte](/img/appliance_install_confirm.png)

Anschließend kopiert der Installer das Appliance-Image auf die Festplatte und startet das installierte System. Weitere Fragen gibt es nicht: Partitionierung, Bootloader und Grundkonfiguration sind Teil des Images.

![Der Installer kopiert das Appliance-Image](/img/appliance_install_progress.png)

:::caution
Entfernen Sie nach der Installation das Installationsmedium (oder ändern Sie die Bootreihenfolge). Andernfalls startet das System erneut in das Bootmenü des ISO; es fällt zwar nach dem Countdown auf **Boot from Hard Disk** zurück, verzögert aber jeden Neustart.
:::

## Konfiguration der grommunio Appliance über CUI/Setup

Die grommunio-Konsolenoberfläche (`grommunio-cui`) läuft auf der ersten Konsole (tty1) der Appliance. Über sie erledigt der Administrator die grundlegenden Aufgaben, um die Appliance für die Admin-UI (Admin-Weboberfläche) oder die Admin-CLI (Admin-Befehlszeile) vorzubereiten – etwa Netzwerkkonfiguration und Zeitsynchronisation – und startet den grommunio-Einrichtungsassistenten.

Die CUI konfiguriert das System mit den systemd-Standardwerkzeugen – `localectl`, `hostnamectl`, `timedatectl`, `systemd-timesyncd` – und bearbeitet die Netzwerkkonfiguration des jeweils aktiven Netzwerk-Backends (`systemd-networkd` auf der Appliance; NetworkManager oder wicked auf anderen Systemen). YaST wird nicht mehr verwendet.

### Statusbildschirm

Nach dem Start zeigt die CUI einen Statusbildschirm. Die obere Hälfte zeigt die Version der Appliance, die CPU und die Speicherauslastung. Die untere Hälfte listet noch offene Aufgaben auf – bei einer frisch installierten Appliance sind das:

- *System password is not set.* (Kein Systempasswort gesetzt.)
- *grommunio-setup has not been run yet.* (grommunio-setup wurde noch nicht ausgeführt.)
- *nginx is not running.* (nginx läuft nicht.)

![Statusbildschirm einer frisch installierten Appliance](/img/appliance_cui_status_initial.png)

Nach abgeschlossener Einrichtung zeigt die untere Hälfte stattdessen die Adressen, unter denen die Admin-UI erreichbar ist.

![Statusbildschirm nach abgeschlossener Einrichtung](/img/appliance_cui_status.png)

Die Kopfzeile zeigt das aktive Tastaturlayout und den Farbsatz. Die Fußleiste zeigt die aktuelle Uhrzeit, die Systemlast und folgende Tastenkürzel:

- `F1`: Farbsatz wechseln
- `F2`: Anmelden, um das Hauptmenü freizuschalten
- `F5`: Tastaturlayout auswählen
- `L`: Protokollanzeige öffnen

### Protokollanzeige

Die Protokollanzeige (`L`) zeigt das Journal der grommunio-Dienste. Mit den Pfeiltasten `LINKS` und `RECHTS` wechseln Sie zwischen den Diensten (gromox-http, gromox-imap, gromox-delivery, grommunio-antispam, …), mit `+`/`-` ändern Sie die Anzahl der angezeigten Zeilen. `ESC` kehrt zum Statusbildschirm zurück.

![Protokollanzeige](/img/appliance_cui_logs.png)

### Anmelden

Um das Hauptmenü zu öffnen, drücken Sie `F2`.

Solange kein Root-Passwort gesetzt ist, öffnet `F2` das Hauptmenü direkt. Sobald ein Root-Passwort gesetzt ist, fragt die CUI nach den Zugangsdaten des System-Superusers (`root`).

![Anmeldedialog](/img/appliance_cui_login.png)

:::caution
Das Root-Passwort ist anfangs nicht gesetzt (leer). Setzen Sie als allerersten Schritt ein Root-Passwort. SSH ist auf der Appliance aktiviert, eine Anmeldung per SSH ist aber erst möglich, nachdem ein Passwort gesetzt wurde.
:::

:::tip
Die CUI lässt sich auch aus einer SSH-Sitzung mit `grommunio-cui` starten. In diesem Fall enthält das Hauptmenü zusätzlich den Eintrag `Exit` (sowie `F10`), um zur Shell zurückzukehren.
:::

## Hauptmenü

Das Hauptmenü bietet folgende Funktionen:

- Language configuration (Sprache)
- Keyboard configuration (Tastatur)
- Change system password (Systempasswort ändern)
- Network interface configuration (Netzwerkschnittstellen)
- Change hostname (Hostname ändern)
- Timezone configuration (Zeitzone)
- timesyncd configuration (Zeitsynchronisation)
- Select software repositories (Software-Repositories)
- Update the system (System aktualisieren)
- grommunio setup wizard (grommunio-Einrichtungsassistent)
- Change admin-web password (Admin-Web-Passwort ändern)
- Terminal
- Reboot (Neustart)
- Shutdown (Herunterfahren)

Navigieren Sie mit den Pfeiltasten und bestätigen Sie mit `ENTER`. In Dialogen wechselt `TAB` zwischen Feldern und Schaltflächen, `ESC` bricht den Dialog ab. Die rechte Bildschirmhälfte beschreibt den gerade ausgewählten Eintrag.

![Hauptmenü von grommunio-cui](/img/appliance_cui_mainmenu.png)

Arbeiten Sie bei einer neuen Appliance das Menü von oben nach unten ab: Root-Passwort setzen, Netzwerk, Hostname und Zeit konfigurieren, dann den grommunio-Einrichtungsassistenten starten.

### Sprache

Wählt die Systemsprache (Locale) über `localectl`. Dies ändert die Sprache der CUI und der Systemmeldungen; die Sprache von grommunio Web wählen die Benutzer selbst.

![Auswahl der Systemsprache](/img/appliance_cui_language.png)

### Tastatur

Wählt das Tastaturlayout der Konsole über `localectl`. Das Layout gilt an der Konsole der Appliance, etwa bei der Eingabe von Passwörtern in der CUI. `F5` öffnet denselben Dialog von jedem Bildschirm aus, auch ohne vorherige Anmeldung – nützlich, wenn das Konsolenlayout bei der Eingabe des Root-Passworts nicht zu Ihrer Tastatur passt.

![Auswahl des Tastaturlayouts](/img/appliance_cui_keyboard.png)

### Systempasswort ändern

Setzt das Passwort des System-Superusers (`root`). Erledigen Sie dies direkt nach der Installation. Verwenden Sie ein sicheres Passwort; wir empfehlen eine Passphrase aus mindestens vier Wörtern. Danach können Sie sich per SSH anmelden und `grommunio-cui` oder `grommunio-setup` von dort ausführen.

![Root-Passwort ändern](/img/appliance_cui_rootpw.png)

### Netzwerkschnittstellen

Listet die Netzwerkschnittstellen der Appliance mit ihren aktuellen Adressen sowie das aktive Netzwerk-Backend (`networkd` auf der Appliance). Wählen Sie eine Schnittstelle und dann **Edit**, um sie zu konfigurieren, oder *Create new bond device*, um mehrere Schnittstellen zu einem Bond zusammenzufassen.

![Liste der Netzwerkschnittstellen](/img/appliance_cui_network_list.png)

Der Schnittstellendialog konfiguriert:

- **DHCPv4 / DHCPv6** – automatische Konfiguration von Adressen, Gateway und DNS-Servern
- **Addresses** – statische Adressen in CIDR-Notation (`192.0.2.10/24`, `2001:db8::10/64`), eine pro Zeile
- **Default gw v4 / v6** – die Standard-Gateways
- **Static routes** – zusätzliche Routen, eine pro Zeile, in der Form `<Ziel> via <Gateway>`
- **DNS servers** – die Nameserver, einer pro Zeile

![Bearbeiten einer Netzwerkschnittstelle](/img/appliance_cui_network_edit.png)

Auf einer frisch installierten Appliance ist jede Ethernet-Schnittstelle über ein generisches `systemd-networkd`-Profil für DHCP konfiguriert; der Dialog zeigt dann die aktuell verwendeten Adressen, wobei beide DHCP-Kästchen nicht angehakt sind. Für den Produktivbetrieb konfigurieren Sie eine statische Adresse, das Standard-Gateway und die DNS-Server. Beim Speichern schreibt der Dialog ein schnittstellenspezifisches Profil, `/etc/systemd/network/50-grommunio-<Schnittstelle>.network`, das Vorrang vor dem generischen hat, und wendet es sofort an.

Die Appliance betreibt keinen lokalen DNS-Resolver-Dienst. Die in diesem Dialog eingetragenen DNS-Server schreibt die CUI nach `/etc/resolv.conf`. Per DHCP gelieferte Nameserver werden **nicht** übernommen; tragen Sie daher immer **DNS servers** ein, auch wenn die Adressen per DHCP bezogen werden.

:::caution
Mindestens anzupassen sind: Netzwerkadressierung (IP-Adresse), DNS (Nameserver) und Routing (Standard-Gateway). Prüfen Sie anschließend die Namensauflösung, zum Beispiel mit `getent hosts download.grommunio.com` im [Terminal](#terminal): Der grommunio-Einrichtungsassistent benötigt funktionierendes DNS, um die Software-Repositories zu erreichen.
:::

### Hostname ändern

Setzt den System-Hostnamen über `hostnamectl` (`/etc/hostname`). Geben Sie den vollqualifizierten Domänennamen (FQDN) der Appliance ein, zum Beispiel `mail.example.com`.

![Hostname setzen](/img/appliance_cui_hostname.png)

:::caution
`localhost` ist kein gültiger Hostname und `local` kein gültiger Domänenname. Setzen Sie Hostname und FQDN korrekt, bevor Sie den grommunio-Einrichtungsassistenten ausführen, und stellen Sie sicher, dass der FQDN auf die Appliance auflöst – entweder per DNS oder über einen Eintrag in `/etc/hosts`:

``` text
192.0.2.10   mail.example.com mail
```

Zur Überprüfung sollte der Befehl `hostname -f` den FQDN des Systems ausgeben. Eine korrekte Hostname-/DNS-Konfiguration ist zwingend erforderlich, insbesondere bei Setups mit mehreren Hosts.
:::

### Zeitzone

Setzt die Zeitzone über `timedatectl`. Die Zeitzone wird unter anderem in Serverprotokollen verwendet. Auf E-Mails hat sie praktisch keinen Einfluss, da Mailprogramme wie grommunio Web Zeitstempel ohnehin in die Zeitzone des jeweiligen Geräts umrechnen. Die Hardware-Uhr läuft in UTC – das empfohlene, zeitzonenunabhängige Verhalten für Dienste.

![Auswahl der Zeitzone](/img/appliance_cui_timezone.png)

### Zeitsynchronisation

Konfiguriert `systemd-timesyncd`, den schlanken NTP-Client der Appliance, und aktiviert die Zeitsynchronisation über das Netzwerk. Tragen Sie die zu verwendenden NTP-Server durch Leerzeichen getrennt im Feld **NTP** ein; die Server unter **FallbackNTP** werden verwendet, wenn keiner der primären Server erreichbar ist. Verwenden Sie, falls vorhanden, die Zeitserver Ihres Netzwerks.

![Konfiguration von timesyncd](/img/appliance_cui_timesync.png)

Mit `timedatectl timesync-status` im [Terminal](#terminal) sehen Sie, mit welchem Server die Appliance synchronisiert.

Nach diesen grundlegenden Schritten sollte Ihre grommunio Appliance:

- eine Verbindung zum Internet herstellen können (Verfügbarkeit von Updates usw.)
- einen gültigen Hostnamen haben, der auf die Appliance auflöst
- eine gültige Zeitzone eingestellt haben
- einen gültigen Zeitserver konfiguriert haben, mit entsprechend synchronisierter Systemzeit

### Software-Repositories

Wechselt das grommunio-Paket-Repository zwischen dem *community*-Repository und dem *supported*-Repository (Subskription). Für das supported-Repository geben Sie Benutzername und Passwort der Subskription ein. Der grommunio-Einrichtungsassistent fragt dieselben Angaben ab; dieser Dialog ist daher vor allem nützlich, um das Repository später zu wechseln, etwa nach dem Kauf einer Subskription.

![Auswahl des Software-Repositorys](/img/appliance_cui_repositories.png)

### System aktualisieren

Führt den Paketmanager (`zypper`) aus, um die Repositories zu aktualisieren und verfügbare Updates zu installieren. Die Ausgabe erscheint in der unteren Bildschirmhälfte; drücken Sie nach Abschluss `ENTER`, um zum Menü zurückzukehren. Weitere Möglichkeiten zur Aktualisierung finden Sie unter [Aktualisierung von grommunio](/admin/operations/#updating-grommunio).

## grommunio-Einrichtungsassistent

Nach den grundlegenden Schritten führen Sie den grommunio-Einrichtungsassistenten aus, um die Konfiguration nach Ihren Anforderungen abzuschließen.

Der Menüeintrag `grommunio setup wizard` startet das Programm `grommunio-setup`, das Sie durch die Ersteinrichtung von grommunio führt. `grommunio-setup` kann auch aus einer SSH-Sitzung ausgeführt werden.

Navigation in `grommunio-setup`:

- `TAB` wechselt zwischen den Elementen eines Dialogs
- `PFEIL-AUF` / `PFEIL-AB` bewegen sich in Formularen und Menüs; `LEERTASTE` schaltet Kontrollkästchen um
- `j` / `k` scrollen in längeren Dialogen (etwa der abschließenden Zusammenfassung)
- `ESC` bricht `grommunio-setup` in jeder Phase ab

grommunio-setup gibt für die meisten Dialoge Standardwerte vor, einschließlich zufällig erzeugter Passwörter; alle werden in der Setup-Protokolldatei `/var/log/grommunio-setup.log` festgehalten.

### Willkommensbildschirm

Beim Start zeigt `grommunio-setup` einen Willkommensbildschirm. Wählen Sie **Continue**, um fortzufahren; die voreingestellte Schaltfläche ist **Cancel**.

![grommunio-setup: Willkommensbildschirm](/img/appliance_setup_welcome.png)

### Auswahl der Funktionen

Wählen Sie die zu installierenden und zu konfigurierenden Funktionen (Rollen). **core** – die Groupware selbst mit grommunio Web, Admin-UI, Sync, DAV und Antispam – wird immer installiert. Die optionalen Rollen sind:

| Rolle | Installiert |
| --- | --- |
| chat | grommunio Chat |
| meet | grommunio Meet (Videokonferenzen) |
| files | grommunio Files (Dateisynchronisation und -freigabe) |
| office | grommunio Office (Online-Dokumentbearbeitung, zusammen mit Files) |
| archive | grommunio Archive (E-Mail-Archivierung) |

![grommunio-setup: Auswahl der Funktionen](/img/appliance_setup_features.png)

Rollen lassen sich auch später hinzufügen oder entfernen, indem Sie `grommunio-setup` erneut ausführen (siehe [grommunio-setup erneut ausführen](#grommunio-setup-erneut-ausführen)).

### Repository-Einrichtung

`grommunio-setup` fragt Ihre Subskriptionsdaten ab. Diese sind im Kauf des Produkts enthalten. Bleiben die Felder leer, richtet grommunio-setup die Community-Repositories ein.

:::note
Community-Repositories werden nach bestem Bemühen bereitgestellt und nicht unterstützt. grommunio heißt Community-Mitglieder ausdrücklich willkommen, die über die Subskriptions-Repositories verteilte Software bietet jedoch für den Produktivbetrieb relevante Vorteile. Subskriptions-Repositories (nur mit gültiger Subskription verfügbar) enthalten qualitätsgeprüfte Pakete, Hotfixes und zusätzliche Funktionen, die in den Community-Repositories nicht verfügbar sind.
:::

![grommunio-setup: Repository-Einrichtung](/img/appliance_setup_repository.png)

Nach diesem Schritt richtet grommunio-setup das Repository ein und installiert oder aktualisiert alle für die gewählten Rollen benötigten Pakete. Der Fortschritt wird auf dem Bildschirm angezeigt.

### Datenbankvariante

Legen Sie fest, welche Datenbank verwendet werden soll. Die meisten Installationen verwenden die lokale Datenbank, bei der die MariaDB-Datenbank automatisch initialisiert und vorbereitet wird. Für größere und/oder besondere Setups, z. B. Cluster, Multi-Node- und verteilte Setups, kann es sinnvoll sein, stattdessen eine bestehende Datenbank anzubinden.

![grommunio-setup: Auswahl der Datenbankvariante](/img/appliance_setup_dbchoice.png)

### Datenbankeinstellungen

Bei „lokaler Datenbank“ zeigt der nächste Schritt die Werte zur Initialisierung der Datenbank: Host, Benutzer, Passwort und Datenbankname. Für Standard-Setups empfiehlt es sich, die Vorgaben zu übernehmen. Das Passwort wird zufällig erzeugt, was Ihre Installation vor unbefugtem Zugriff schützt. Bei „bestehender Datenbank“ geben Sie die Zugangsdaten der anzubindenden Datenbank ein; grommunio-setup prüft die Verbindung, bevor es fortfährt.

![grommunio-setup: Einstellungen zur Datenbankinitialisierung](/img/appliance_setup_dbsettings.png)

### Administrationsbenutzer

Der nächste Schritt fragt das Passwort des Standard-Administrators (`admin`) für die grommunio Admin-UI und die Admin-API ab. Ein zufällig erzeugtes Passwort ist vorausgefüllt; es wird in der Zusammenfassung am Ende der Einrichtung angezeigt. Sie können auch ein eigenes Passwort eingeben.

:::caution
Am Ende der Einrichtung wird das Passwort in der Zusammenfassung angezeigt. Stellen Sie sicher, dass keine unbefugten Personen auf die Systemkonsole zugreifen oder sie einsehen können, um diese wichtigen Zugangsdaten abzulesen.
:::

:::note
Sie können dieses Passwort jederzeit über `grommunio-cui` oder mit `grommunio-admin passwd` zurücksetzen.
:::

![grommunio-setup: Festlegen des Admin-Passworts](/img/appliance_setup_adminpw.png)

### Vollqualifizierter Domänenname

Als Nächstes wird der vollqualifizierte Domänenname (FQDN) des Systems abgefragt. Der FQDN besteht aus dem **Hostnamen** und der primären **Domäne** des Systems, zum Beispiel `mail.example.com`. Mit diesem Namen verbinden sich Clients wie Outlook, und er wird in die in einem späteren Schritt erzeugten Zertifikate aufgenommen (bzw. muss in importierten Zertifikaten enthalten sein).

grommunio-setup füllt das Feld mit dem Ergebnis von `hostname -f` vor. Ist das Feld leer, wurde der Hostname nicht gesetzt oder er löst nicht auf; siehe [Hostname ändern](#hostname-ändern).

![grommunio-setup: Festlegen des vollqualifizierten Domänennamens (FQDN)](/img/appliance_setup_fqdn.png)

### Primäre Mail-Domäne

Geben Sie die primäre Mail-Domäne ein, zum Beispiel `example.com`. Sie dient als Hauptdomäne des Systems, etwa für Unzustellbarkeitsberichte, und für die Namen in erzeugten Zertifikaten. Geben Sie hier nur **eine** Domäne an; weitere Domänen fügen Sie später in der Admin-UI hinzu.

:::caution
Das Feld ist mit dem FQDN vorausgefüllt. Ersetzen Sie ihn durch die Mail-Domäne: In den meisten Setups ist die Mail-Domäne (`example.com`) nicht identisch mit dem FQDN des Servers (`mail.example.com`).
:::

![grommunio-setup: Festlegen der primären Mail-Domäne](/img/appliance_setup_maildomain.png)

### Relayhost-Konfiguration

Soll die Installation E-Mails nicht direkt versenden (durch direkte Auflösung der MTAs der Empfänger), empfiehlt sich ein Relayhost. In diesem Schritt konfigurieren Sie einen Relayhost, der zum Beispiel zur Anbindung an bestehende Firewalls oder Mail-Security-Appliances dienen kann. Soll das konfigurierte Ziel direkt verwendet werden (Abfrage der IP-Adresse über DNS-A-Einträge statt über die zugehörigen MX-Einträge), setzen Sie den Relayhost in eckige Klammern, etwa „\[mail.isp.com\]“. Lassen Sie das Feld leer, um E-Mails direkt zuzustellen.

![grommunio-setup: Konfiguration des Relayhosts](/img/appliance_setup_relayhost.png)

### TLS-Konfiguration

Der nächste Schritt bietet ein Menü zur Wahl der gewünschten TLS-Einrichtung:

![grommunio-setup: Auswahl des TLS-Installationsmodus](/img/appliance_setup_tlsmode.png)

0: **Create self-signed certificate** (selbstsigniertes Zertifikat erstellen)

> Ein selbstsigniertes Zertifikat ist die einfachste Option und erfordert keine weiteren Eingaben. Das Zertifikat wird beim ersten Verbindungsaufbau allerdings als nicht vertrauenswürdig angezeigt und muss zunächst als vertrauenswürdig akzeptiert werden. Das ist normal, da ein Client nicht prüfen kann, ob das Zertifikat aus einer gültigen Quelle stammt. grommunio empfiehlt diese Option nicht für Produktivumgebungen, da jeder Client dem Zertifikat zunächst vertrauen muss. Sie eignet sich am besten für Test- und Demo-Installationen.

1: **Create own CA and certificate** (eigene CA und Zertifikat erstellen)

> Mit einer eigenen Zertifizierungsstelle erstellen Sie Zertifikate unter dem Dach einer eigenen CA. So können Sie (manuell) weitere Serverzertifikate von derselben CA signieren lassen. Clients müssen dem CA-Zertifikat nur einmal vertrauen; es steht nach der Einrichtung unter `https://<FQDN>:8443/rootCA.crt` zum Download bereit. Diese Option eignet sich am besten für Test- und Demo-Installationen größerer Umgebungen mit mehreren Instanzen.
>
> grommunio-setup fragt den Zertifikatsinhaber (Land, Bundesland, Ort, Organisation, Organisationseinheit, E-Mail-Adresse) und die Gültigkeitsdauer ab. Die voreingestellte Gültigkeit beträgt nur **30 Tage**; wählen Sie einen längeren Zeitraum, zum Beispiel 365 Tage.

![grommunio-setup: Erstellen einer eigenen Zertifizierungsstelle (CA) und eines Zertifikats](/img/appliance_setup_ownca.png)

2: **Import an existing TLS certificate from files** (vorhandenes Zertifikat aus Dateien importieren)

> Damit verwenden Sie ein beliebiges externes, PEM-kodiertes Zertifikatspaar. Geben Sie den Pfad des Zertifikats-Bundles (Serverzertifikat gefolgt von den Zwischenzertifikaten) und des privaten Schlüssels an; kopieren Sie beide Dateien vorher auf die Appliance, zum Beispiel mit `scp`. Empfohlen werden SAN-Zertifikate mit mehreren Domänen oder ein Wildcard-Zertifikat. Mit eigenen TLS-Zertifikaten haben Sie die größte Flexibilität, sowohl für eine eigene vertrauenswürdige CA als auch für Zertifikate einer öffentlich vertrauenswürdigen Zertifizierungsstelle.

![grommunio-setup: Import eines vorhandenen Zertifikats](/img/appliance_setup_importcert.png)

3: **Automatically generate Let's Encrypt certificate** (Let's-Encrypt-Zertifikat automatisch erzeugen)

> Diese Option erzeugt Zertifikate automatisch über die Zertifizierungsstelle Let's Encrypt. Let's-Encrypt-Zertifikate sind kostenlos, es gelten jedoch die Nutzungsbedingungen von Let's Encrypt, auf die während der Installation verwiesen wird. Let's Encrypt prüft alle angeforderten Domänennamen über eine Challenge auf der Appliance. Dafür muss Port 80 (HTTP) während der Prüfung (und jeder späteren automatischen Verlängerung) aus dem Internet erreichbar sein, und alle Domänen müssen auf die Appliance zeigen. Diese Option wird für alle einfachen Installationen empfohlen und ermöglicht bei guter Vorbereitung die reibungsloseste Installation.
>
> grommunio-setup bietet die in das Zertifikat aufzunehmenden Namen zur Auswahl an. Haken Sie auch `autodiscover.<Domäne>` an, sofern Sie diesen DNS-Eintrag angelegt haben, damit AutoDiscover ohne Zertifikatswarnungen funktioniert. Abschließend geben Sie eine E-Mail-Adresse an, unter der Let's Encrypt Sie zu Ihren Zertifikaten kontaktieren kann.

![grommunio-setup: Auswahl der Namen für das Let's-Encrypt-Zertifikat](/img/appliance_setup_letsencrypt.png)

![grommunio-setup: Kontaktadresse für Let's Encrypt](/img/appliance_setup_letsencrypt_mail.png)

3.a: **Erzeugung von Let's-Encrypt-Zertifikaten für mehrere Domänen**

> Um Ihrem Let's-Encrypt-Zertifikat weitere Domänen hinzuzufügen, können Sie folgenden Befehl verwenden:

``` bash
certbot certonly -n --standalone --agree-tos \
--preferred-challenges http \
--cert-name="<domain1>" \
-d "<domain1>" \
-d "<domain2>" \
-d "<domain3>" \
-d "<domain4>" \
-d "<domain5>" \
-m "me@domain1.com" \
--pre-hook "service nginx stop" \
--deploy-hook /usr/share/grommunio-setup/grommunio-certbot-renew-hook \
--post-hook "service nginx start"
```

Dabei steht `--cert-name="<domain1>"` für die ursprüngliche Domäne, und `-d "<domain2>"` bis `-d "<domain5>"` sind die weiteren Domänen, die dem Zertifikat hinzugefügt werden. `-m "me@domain1.com"` ist Ihre E-Mail-Adresse; `--pre-hook "service nginx stop"` stoppt nginx vor der Änderung des Zertifikats, `--deploy-hook /usr/share/grommunio-setup/grommunio-certbot-renew-hook` übernimmt die Änderungen, und `--post-hook "service nginx start"` startet nginx danach wieder.

Alle so erzeugten Zertifikate werden in `/etc/grommunio-common/ssl` abgelegt und von allen Diensten der Appliance automatisch verwendet, einschließlich der Admin-UI auf Port 8443.

### Optionale Rollen

Für jede in der [Auswahl der Funktionen](#auswahl-der-funktionen) gewählte optionale Rolle fragt grommunio-setup deren Datenbank-Zugangsdaten ab (sofern die Rolle eine Datenbank verwendet) und, wenn die Rolle ein eigenes Administrationskonto hat (Chat, Files, Archive), dessen Passwort. Wie bei der Core-Datenbank sind zufällig erzeugte Werte vorausgefüllt.

![grommunio-setup: Datenbank-Zugangsdaten einer optionalen Rolle](/img/appliance_setup_role_db.png)

![grommunio-setup: Administratorpasswort einer optionalen Rolle](/img/appliance_setup_role_adminpw.png)

Nach der letzten Frage konfiguriert grommunio-setup Datenbanken, Dienste, Webserver, Firewall und die gewählten Rollen. Ist grommunio Auth (Keycloak) installiert, werden neu hinzugefügte Rollen ebenfalls in Single Sign-On eingebunden.

![grommunio-setup: Konfiguration läuft](/img/appliance_setup_progress.png)

### Abschluss der Einrichtung

Nach Abschluss aller Schritte zeigt der letzte Dialog eine Zusammenfassung der Installation: die Adresse der Admin-UI, die Zugangsdaten von `admin` und, falls eine eigene CA erstellt wurde, die Download-Adresse des CA-Zertifikats.

![grommunio-setup: Abschluss der Einrichtung](/img/appliance_setup_final.png)

:::caution
Alle für die Installation relevanten Informationen werden in `/var/log/grommunio-setup.log` gespeichert. Diese Datei enthält die bei der Initialisierung verwendeten Passwörter; kopieren Sie sie an einen sicheren Ort oder löschen Sie sie, wenn sie nicht mehr benötigt wird.
:::

Fahren Sie mit [Installation überprüfen](/admin/quickstart/#verify-the-installation) und der [Checkliste nach der Installation](/guides/post-install/) fort.

### grommunio-setup erneut ausführen

grommunio-setup kann mehrfach ausgeführt werden. Erkennt es einen abgeschlossenen früheren Lauf, bietet es zwei Möglichkeiten:

- **reconfigure** – behält die bestehende Installation samt Daten, Passwörtern und Zertifikaten. Abgeglichen wird nur die Auswahl der optionalen Rollen (Chat, Meet, Files, Office, Archive): Die Funktionsauswahl zeigt die aktuell installierten Rollen, neu gewählte Rollen werden installiert und konfiguriert, abgewählte Rollen werden entfernt, wobei ihre Daten für ein späteres erneutes Hinzufügen erhalten bleiben.
- **scratch** – setzt die gesamte Installation zurück. grommunio-setup verlangt zur Bestätigung die Eingabe von `removealldata`, löscht dann alle Datenbanken, Postfächer und Zertifikate und führt eine neue Einrichtung durch.

![grommunio-setup: Auswahl bei bereits eingerichteter Appliance](/img/appliance_setup_rerun.png)

## Admin-Web-Passwort ändern

Der Menüeintrag `Change admin-web password` ändert das Passwort des Hauptadministrators (`admin`) der Admin-UI. Dies ist auch jederzeit in einer Shell mit `grommunio-admin passwd` möglich (mit `--password-stdin` wird das Passwort nicht-interaktiv übergeben, ohne in der Prozessliste zu erscheinen).

![Admin-UI-Passwort zurücksetzen](/img/appliance_cui_adminpw.png)

## Terminal

Die Option `Terminal` öffnet eine Root-Shell innerhalb der CUI. Mit dem Befehl `exit` kehren Sie zur CUI zurück. Diese Option sollte mit Bedacht und nur von erfahrenen Administratoren verwendet werden.

![Terminal (Root-Rechte)](/img/appliance_cui_terminal.png)

:::caution
Das hier gestartete Terminal verfügt über volle Administratorrechte (Root-Zugriff) auf der Appliance. Gehen Sie mit diesen Berechtigungen äußerst vorsichtig vor.
:::

## Neustart

Die Option `Reboot` startet die gesamte grommunio Appliance nach einer Bestätigung neu. Während des Neustarts sind die bereitgestellten Dienste nicht verfügbar.

![Neustart der grommunio Appliance](/img/appliance_cui_reboot.png)

## Herunterfahren

Die Option `Shutdown` fährt die gesamte grommunio Appliance nach einer Bestätigung herunter und schaltet sie aus. Bis die Appliance wieder gestartet wird, sind die Dienste nicht verfügbar.

![Herunterfahren der grommunio Appliance](/img/appliance_cui_shutdown.png)
