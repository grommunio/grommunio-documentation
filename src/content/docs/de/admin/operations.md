---
title: "Betrieb"
description: "Betrieb von grommunio: TLS für die Admin-API, Zertifikatsverwaltung, Updates, Backup und Notfallwiederherstellung, erneutes Einreihen von E-Mails und Größenbeschränkungen."
sidebar:
  order: 80
---

## Konfiguration

### Konfiguration von Admin API und TLS

Das Paket der Admin-API stellt die Admin-UI unverschlüsselt auf Port 8080 bereit. Auf der grommunio Appliance führt grommunio-setup die folgenden Schritte automatisch aus, sodass die Admin-UI nach der Einrichtung per TLS auf Port 8443 erreichbar ist; dort ist nur Port 8080 zu schließen oder einzuschränken. Bei manuellen Installationen stellen Sie auf eine TLS-basierte Konfiguration um, sobald der Einrichtungsprozess abgeschlossen ist.

Die mitgelieferten grommunio-Konfigurationsdateien dienen dazu, die TLS-Konfiguration auf der Grundlage der bestehenden Konfiguration einzurichten. Um die TLS-Konfiguration des grommunio-admin zu aktivieren, führen Sie die folgenden Schritte aus:

``` bash
ln -s /etc/grommunio-common/nginx/ssl_certificate.conf /etc/grommunio-admin-common/nginx-ssl.conf
```

Dies setzt voraus, dass die Konfiguration der TLS-Zertifikate durch die Bereitstellung des grommunio-Setups erfolgreich installiert wurde.

Als letzten Schritt entfernen Sie wie folgt das Kommentarzeichen vor der vorbereiteten Konfigurationsanweisung in der letzten Zeile der Konfigurationsdatei `/etc/nginx/conf.d/grommunio-admin.conf`:

    vhost_traffic_status_zone shared:vhost_traffic_status:8m;

    # Wenn Sie HTTP deaktivieren möchten, beachten Sie bitte, dass Ihre Konfiguration möglicherweise
    # in der Admin-API-Konfiguration angepasst werden muss:
    #   config.yaml -> options: -> vhosts: -> local:
    include /usr/share/grommunio-admin-common/nginx.conf;

    # Entfernen Sie das Kommentarzeichen vor der folgenden Zeile, um TLS für die Admin-Schnittstelle zu aktivieren.
    # Stellen Sie sicher, dass die Datei /etc/grommunio-admin-common/nginx-ssl.conf
    # mit der Zertifikatskonfiguration erstellt wird
    include /usr/share/grommunio-admin-common/nginx-ssl.conf;

Nach einer anschließenden erfolgreichen Überprüfung der Webserver-Konfiguration kann nginx neu gestartet werden, und der Admin-Server API ist über Port 8443 erreichbar, z. B. <https://mail.example.com:8443> :

``` bash
# nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful

# systemctl restart nginx
```

Beachten Sie, dass durch einen Neustart des Webservers bestehende Verbindungen beendet werden.

### Zertifikatsverwaltung

Für den Betrieb des grommunio ist die Verwendung von Sicherheitsmaßnahmen auf Basis des TLS zwingend erforderlich. Bei Vorhandensein von TLS-Zertifikaten wird jegliche Kommunikation mit den Diensten des grommunio durch modernste Verschlüsselung geschützt, was für viele Clients und Protokolle zwingend vorgeschrieben ist.

Wenn Sie den Einrichtungsweg für grommunio befolgen, lesen Sie bitte auch [TLS-Konfiguration](/admin/installation/#tls-configuration). Während des gesamten Installationsprozesses stehen dem Administrator mehrere Optionen für eine TLS-basierte Installation zur Verfügung. Für einen reibungslosen Betrieb wird empfohlen, über grundlegende Kenntnisse der PKI-Konzepte und des X.509-Standards für Zertifikate zu verfügen. Im Allgemeinen verwendet grommunio PEM-kodierte Zertifikate.

Falls Zertifikate ersetzt werden müssen, befinden sich die von grommunio verwendeten Zertifikate standardmäßig an folgenden Speicherorten:

- `/etc/grommunio-common/ssl/server-bundle.pem` (Zertifikatsbündel einschließlich Zertifizierungsstelle)
- `/etc/grommunio-common/ssl/server.key` (privater Schlüssel)

Wenn die Zertifikate geändert werden, müssen alle Dienste, die diese Zertifikate verwenden, neu gestartet werden, damit das Zertifikat verwendet werden kann.

Wenn Let's Encrypt für die Installation ausgewählt wurde, wird der Dienst `grommunio-certbot-renew.timer` automatisch wöchentlich ausgeführt, um etwaige neue Zertifikatsanforderungen zu bearbeiten. Der Status des Timer-Dienstes kann wie folgt überprüft werden:

``` bash
systemctl status grommunio-certbot-renew.timer
```

## Aktualisierung von grommunio

### Paket-Updates

Bei jeder Installation von grommunio Appliance wird versucht, eine Verbindung zum Community-Repository von grommunio herzustellen. Auf diese Weise stehen Community-Updates den Community-Nutzern direkt zur Verfügung, und sie können Appliance entsprechend aktualisieren. Darüber hinaus stellt grommunio die Betriebssystem-Repositorys bereit, die modernste Pakete mit den neuesten Updates für das Betriebssystem Linux bereitstellen, das auf openSUSE Leap basiert – einer binärkompatiblen Distribution von SUSE Linux Enterprise Server.

:::note
Community-Repositorys werden nach bestem Bemühen bereitgestellt und werden nicht unterstützt. grommunio begrüßt zwar die Nutzung von grommunio durch Community-Mitglieder, doch die im Rahmen der Abonnement-Repositorys verfügbaren Software-Distributionen bieten produktionsrelevante Vorteile. Abonnement-Repositories (nur mit einem gültigen Abonnement verfügbar) enthalten qualitätsgeprüfte Pakete, Hotfixes und zusätzliche Funktionen, die in Community-Repositories nicht verfügbar sind.
:::

Für die Paketverwaltung verwenden die grommunio Appliance-Modelle `zypper`. Zypper ist der Paketmanager, der vorwiegend von SUSE-basierten Distributionen verwendet wird, und ist daher bei den grommunio Appliance-Modellen standardmäßig installiert. Zypper weist viele Ähnlichkeiten mit anderen bekannten Paketmanagern auf, wie beispielsweise `dnf` oder `apt`.

Die Standard-Repository-Datei „`/etc/zypp/repos.d/grommunio.repo`“ wird mit folgendem Inhalt ausgeliefert:

``` ini
[grommunio]
enabled=1
autorefresh=1
baseurl=https://download.grommunio.com/community/packages/openSUSE_Leap_16.0/?ssl_verify=no
type=rpm-md
```

In der Standardkonfiguration werden Zertifikate vom Typ SSL/TLS bewusst nicht überprüft. Dadurch wird die Unterstützung für folgende Funktionen ermöglicht:

- konfigurationsfreie, automatisierte Proxy-Umgebungen mit SSL/TLS-Interception
- Repository-Spiegelung mit ausgewählten Partnern und Kunden (Hosting, Großinstallationen)

Die Integrität aller Pakete wird durch Signaturen auf allen von grommunio verteilten Paketen gewährleistet, die mit dem Schlüssel grommunio GPG signiert sind, dessen öffentlicher Schlüssel unter <https://download.grommunio.com/community/packages/RPM-GPG-KEY-grommunio> verfügbar ist.

Ihre Abonnement-Zugangsdaten erhalten Sie über Ihren grommunio-Partner und ermöglichen Ihnen den Zugriff auf grommunio-Pakete in Produktionsqualität. Diese Pakete sind qualitätsgeprüft und stehen ausschließlich Abonnementkunden zur Verfügung.

Um Ihr grommunio bzw. appliance mit den neuesten verfügbaren Updates zu aktualisieren, führen Sie die folgenden Schritte aus:

``` bash
# zypper ref
Repository 'base' is up to date.
Repository 'debug' is up to date.
Repository 'debug-update' is up to date.
Repository 'grommunio' is up to date.
Repository 'update' is up to date.
All repositories have been refreshed.

# zypper up
Loading repository data...
Reading installed packages...

The following package is going to be upgraded:
 grommunio-admin-web

 1 package to upgrade.
 Overall download size: 1.8 MiB. Already cached: 0 B. After the operation, additional 696.0 B will be used.
 Continue? [y/n/v/...? shows all options] (y):
 Retrieving package grommunio-admin-web-1.0.1.8.6c8842f-lp153.1.1.noarch     (1/1), 1.8 MiB ( 15.0 MiB unpacked)
 Retrieving: grommunio-admin-web-1.0.1.8.6c8842f-lp153.1.1.noarch.rpm ....................................[done]
 Checking for file conflicts: ............................................................................[done]
 (1/1) Installing: grommunio-admin-web-1.0.1.8.6c8842f-lp153.1.1.noarch ..................................[done]
```

Nach der Installation bzw. Aktualisierung einiger Pakete werden Dienste aufgrund der möglichen Auswirkungen eines solchen Neustarts während der Paketinstallation nicht immer automatisch neu gestartet. Für Pakete, die aktualisiert wurden, wird jedoch ein manueller Neustart des Dienstes empfohlen. Der Befehl `zypper ps -s` listet solche Dienste auf, die zu einem geeigneten Zeitpunkt neu gestartet werden sollten, damit das neue Update wirksam wird. Ein Beispiel für einen solchen Vorgang ist:

``` bash
# zypper ps -s

zypper ps -s
The following running processes use deleted files:

PID  | PPID | UID | User | Command   | Service
-----+------+-----+------+-----------+----------
1553 | 1    | 0   | root | saslauthd | saslauthd

You may wish to restart these processes.
See 'man zypper' for information about the meaning of values in the above table.

No core libraries or services have been updated since the last system boot.
Reboot is probably not necessary.

# systemctl restart saslauthd
```

## Datensicherung und Notfallwiederherstellung

grommunio unterstützt Snapshot-basierte Sicherungen aller modernen Dateisysteme und/oder Appliances in vollem Umfang. Die Snapshot-Mechanismen der folgenden Dateisysteme, Sicherungslösungen oder Speichersysteme wurden getestet und werden unterstützt:

- Acronis Backup
- Arcserve Unified Data Protection (UDP)
- Amanda Backup
- Amazon EBS-Snapshots
- Azure-VM-Snapshots
- Bacula Backup
- Bareos-Backup
- btrfs-basierte Snapshots
- CephFS/RBD-Snapshots
- Commvault Hyperscale
- Dell EMC
- Docker-basierte Snapshots (Docker-Checkpoint)
- Google Cloud Persistent Disk-Snapshots
- HP StoreVirtual
- Hitachi Vantara
- Huawei OceanStor
- Hyper-V-Snapshots
- KVM-basierte Snapshots
- Kubernetes-Volume-Snapshots
- LVM-basierte Snapshots
- LXC-basierte Snapshots (LXC-Snapshot)
- NetApp
- NovaStor DataCenter
- Nutanix
- Pure Storage
- VMware-Snapshots
- Veeam Backup
- Veritas
- Xen-basierte Snapshots
- ZFS-basierte Snapshots

Mithilfe des vom Speicheranbieter bereitgestellten Snapshot-Mechanismus lassen sich Snapshots problemlos nutzen, um gesamte Postfächer innerhalb von Sekunden zu sichern und wiederherzustellen. Für die Wiederherstellung von Postfächern unter der Identität eines anderen Postfachs wird empfohlen, sicherzustellen, dass das Postfach nicht aktiv genutzt wird (z. B. auf mobilen Geräten oder bei der Profilsynchronisierung). Nach Abschluss des Wiederherstellungsvorgangs wird empfohlen, die Dienste `gromox-http` und `gromox-midb` neu zu starten, um vorhandene Laufzeit-Caches zu löschen:

``` bash
# systemctl restart gromox-http
# systemctl restart gromox-midb
```

Um Ihre grommunio-Installation zu sichern, sind (standardmäßig) die folgenden Sicherungselemente relevant:

1.  grommunio Groupware (gromox):

- `/var/lib/gromox/user`: Verzeichnishierarchie für private Postfächer
- `/var/lib/gromox/domain`: Verzeichnishierarchie für öffentliche Postfächer (öffentliche Ordner)
- `/var/lib/gromox/user/<domain>/<localpart>`: individueller Postfach-Container
- MySQL-Datenbank: `grommunio`

2.  grommunio Files:

- `/var/lib/grommunio-files`
- MySQL-Datenbank: `grofiles`

3.  grommunio Chat:

- `/var/lib/grommunio-chat`
- MySQL-Datenbank: `grochat`

4.  grommunio Archive:

- `/var/lib/grommunio-archive`
- MySQL-Datenbank: `groarchive`

5.  grommunio Appliance:

- Dateisicherung von `/etc/grommunio*`
- Dateisicherung von `/etc/nginx` (falls nicht standardmäßige Konfigurationsänderungen vorgenommen wurden)
- Dateisicherung von `/etc/php8/fpm/php-fpm.d` (falls nicht standardmäßige Konfigurationsänderungen vorgenommen wurden)
- Dateisicherung von `/etc/letsencrypt` (falls Let's Encrypt-Zertifikate verwendet werden)
- Dateisicherung von `/etc/postfix` (falls nicht standardmäßige Konfigurationsänderungen vorgenommen wurden)

:::note
Durch die Verwendung von grommunio-dbconf entfallen viele dateibasierte Sicherungen. Dies liegt daran, dass dbconf die Konfigurationsanweisungen in der Hauptdatenbank von grommunio speichert.
:::

### Datensicherung

Sichern Sie die grommunio-Datenbanken `grommunio`, `grofiles`, `groarchive` und `grochat` mithilfe von Standardverfahren. Die meisten Sicherungslösungen bieten MySQL-Datenbank-Sicherungsagenten für eine einfache Integration. Detaillierte Informationen zu den Sicherungsoptionen für Ihre MySQL-Datenbanken finden Sie unter: <https://dev.mysql.com/doc/refman/8.0/en/backup-types.html>. Im Zweifelsfall können Sie mit dem integrierten Dienstprogramm `mysqldump` (<https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html>) einzelne SQL-Sicherungsdateien der Datenbanken erstellen. Ein manueller MySQL-Sicherungsdump kann mit folgendem Befehl ausgeführt werden:

``` bash
mysqldump --all-databases --single-transaction --routines --triggers --events --add-drop-database > grommunio-mysql-backup.sql
```

### Dateibasierte Datensicherung

Da grommunio vollständig auf Transaktionen basiert, ist jede dateibasierte Sicherung zum Zeitpunkt der Synchronisierung konsistent, sofern sie auf einem „Deltasync“-basierten Vorgang beruht. Auf Wunsch ist es auch möglich, Dateien vom ursprünglichen Speicherort an einen entfernten oder eingebundenen Speicherort zu synchronisieren, beispielsweise für Disk-to-Disk-Sicherungsszenarien. Mit rsync bietet die grommunio Appliance ein einfaches Tool zur Datensynchronisation für diese Sicherungsmethode. Eine manuelle Dateisicherung auf Basis der Deltasync-Funktionalität von rsync kann wie folgt ausgeführt werden:

``` bash
rsync -HPavS <from-directory> <to-directory>
```

## E-Mails erneut in die Warteschlange stellen

Um Nachrichten in Gromox, deren Zustellung aus irgendeinem Grund fehlgeschlagen ist, erneut in die Warteschlange zu stellen, führen Sie die unten beschriebenen Schritte aus. Dieses Verfahren ist besonders nützlich bei Nachrichten, die aufgrund verschiedener Fehler nicht zugestellt wurden und sich im Verzeichnis `/var/lib/gromox/queue/save` befinden.

Fehlgeschlagene Nachrichten suchen: Wechseln Sie mit dem Befehl `cd /var/lib/gromox/queue/save` in das Verzeichnis, in dem fehlgeschlagene Nachrichten gespeichert sind. Dieses Verzeichnis enthält Nachrichten, die nicht erfolgreich verarbeitet wurden.

Nachrichten auflisten: Verwenden Sie den Befehl `ls -ltr`, um die Nachrichten im Verzeichnis aufzulisten. Dadurch werden alle Dateien nach Änderungsdatum sortiert angezeigt, was es einfacher macht, die Nachrichten zu identifizieren und auszuwählen, die Sie erneut in die Warteschlange stellen möchten.

Nachrichten erneut in die Warteschlange stellen: Um die Nachrichten erneut in die Warteschlange zu stellen, müssen sie in das Verzeichnis `/var/lib/gromox/queue/mess` verschoben werden. Dies kann mit dem Befehl `mv` erfolgen. Um beispielsweise eine bestimmte Nachricht zu verschieben, geben Sie Folgendes ein:

``` bash
mv <filename> /var/lib/gromox/queue/mess/
```

Ersetzen Sie `<filename>` durch den Namen der Nachrichtendatei, die Sie erneut in die Warteschlange stellen möchten. Wenn Sie mehrere Nachrichten erneut in die Warteschlange stellen möchten, können Sie Platzhalter verwenden oder mehrere Dateinamen angeben, die durch Leerzeichen getrennt sind.

Neuverarbeitung: Sobald die Nachrichten in das Verzeichnis `/var/lib/gromox/queue/mess` verschoben wurden, versucht Gromox automatisch, sie neu zu verarbeiten und zuzustellen. Dieser Schritt erfordert keine weiteren Maßnahmen seitens des Benutzers.

Überprüfung: Nach dem erneuten Einreihen empfiehlt es sich, die Systemprotokolle zu überwachen, um sicherzustellen, dass die Nachrichten erfolgreich verarbeitet werden. Verwenden Sie `journalctl -u gromox-delivery -u gromox-delivery-queue`, um nach Protokolleinträgen zu suchen, die sich auf die erneut eingereihten Nachrichten beziehen.

Dieser Vorgang ist unerlässlich, um Zustellungsprobleme innerhalb von Gromox zu beheben und sicherzustellen, dass alle Nachrichten ihre vorgesehenen Empfänger erreichen. Sollte die erneute Einreihung in die Warteschlange die Zustellungsprobleme nicht beheben, ist möglicherweise eine weitere Untersuchung der Fehlerursache erforderlich, einschließlich der Überprüfung der Systemprotokolle auf Fehler und der Kontaktaufnahme mit dem Grommunio-Support, um Unterstützung zu erhalten.

Mit dem folgenden Codeausschnitt lässt sich eine einfache Schleife erstellen, um alle fehlgeschlagenen Nachrichten erneut in die Warteschlange einzureihen:

``` sh
cd /var/lib/gromox/queue/
j=0
for i in save/*; do
        mv "$i" "mess/0$j"
        j=$(($j+1))
        echo "requeued $i"
done
```

## Größenbeschränkungen

Grommunio nutzt nativen MAPI-Speicher, was gewisse (weiche) Einschränkungen mit sich bringt. Obwohl diese in erster Linie theoretischer Natur sind, werden die Einschränkungen für Clients beim Zugriff auf grommunio eher durch die Vorgaben des MAPI-Standards bestimmt als durch die dem MAPI-Standard innewohnenden Grenzen.

Die meisten Einschränkungen ergeben sich aus der Verwendung von Microsoft und Outlook als primären Client. Outlook unterliegt eigenen Einschränkungen, deren Einhaltung wir empfehlen, um die Kompatibilität und volle Funktionalität mit der Microsoft-Produktsuite zu gewährleisten.

Ein Objekt kann in diesem Zusammenhang eine E-Mail, ein Kalendertermin, ein Aufgabeneintrag, ein Kontakt oder eine Notiz sein.

Wir empfehlen, die folgenden Einschränkungen zu beachten:

- Maximale Größe pro Objekt (Größenbeschränkung für Nachrichten): 150 MB
- Maximale Anzahl von Objekten pro Ordner (Anzahl der Nachrichten): 1.000.000
- Maximale Anzahl von Teilen in mehrteiligen Nachrichten (MIME): 250 Teile
- Maximale Speichergröße: 100 GB (Standardwert: 50 GB)

Registrierungspfad zum Anpassen der maximalen OST-Größe in Microsoft und Outlook:

- `HKEY_CURRENT_USER\Software\Microsoft\Office\<version>\Outlook\PST` `MaxLargeFileSize` (DWORD (32 Bit), dezimal: 102400)

Bitte beachten Sie:

:::note
Hierbei handelt es sich nicht um strenge, von grommunio festgelegte Beschränkungen, sondern um Empfehlungen für eine reibungslose Integration mit Microsoft und Outlook. Diese Richtlinien stimmen zudem mit denen überein, die in Microsoft Exchange-On-Premises- und Exchange-Online-Umgebungen verwendet werden. Sollten Sie sich dafür entscheiden, Microsoft und Outlook nicht als Client zu verwenden, unterstützt grommunio deutlich höhere Grenzwerte. Das Überschreiten dieser empfohlenen Grenzwerte kann jedoch je nach Ihrer Konfiguration die Leistung beeinträchtigen.
:::
