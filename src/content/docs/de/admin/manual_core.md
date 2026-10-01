---
title: "Manuelle Installation (benutzerdefinierte Integration)"
description: "Zwar bietet das grommunio Appliance eine umfassende Lösung für die meisten Installationen, doch können bestimmte Sonderanforderungen einen anderen Ansatz erfordern…"
sidebar:
  label: "Manuelle Installation"
  order: 40
---

Zwar bietet das grommunio Appliance eine umfassende Lösung für die meisten Installationen, doch können bestimmte Sonderanforderungen einen anderen Ansatz erfordern. In diesen Fällen können das grommunio-Basissystem und der Kern (Groupware) anhand der Anleitungen in diesem Kapitel manuell installiert werden.

:::note
grommunio ist eine umfassende Kommunikations- und Kollaborationslösung mit zahlreichen Diensten und Komponenten. Dank dieser Modularität ist grommunio äußerst vielseitig und ermöglicht verschiedene Installationsarten, auf die hier nicht im Detail eingegangen werden kann. Dieser Abschnitt ist bewusst so allgemein wie möglich gehalten.
:::

:::caution
Bitte beachten Sie, dass sich dieser Abschnitt an versierte Administratoren richtet, die über Erfahrung in der fortgeschrittenen Linux-Administration und -Konfiguration verfügen.
:::

In diesem Kapitel wird davon ausgegangen, dass bereits ein Basissystem läuft. „Basis“ bedeutet in diesem Zusammenhang:

- Es sollte ein Systemdienstmanager laufen (systemd, sysvinit usw.)
- Das System sollte sich in seinem typischen Mehrbenutzermodus befinden (bei systemd sollte zumindest *multi-user.target* gestartet worden sein; bei sysvinit sollte die Init-Stufe 3 oder 5 aktiv sein)
- Es sollte eine interaktive Shell zur Verfügung stehen, die Sie nutzen können.
- Es sollte nicht kurzlebig sein und seinen Zustand beim Herunterfahren nicht verlieren.

## Netzwerke aufbauen

\[Textbasierter Screenshot der Ausführung von „networkctl“ in einer Befehlszeile.\]

``` text
localhost:~ # networkctl
IDX LINK  TYPE     OPERATIONAL SETUP
  1 lo    loopback carrier     unmanaged
  2 host0 ether    routable    configured

2 links listed.

localhost:~ # networkctl status host0
* 2: host0
             Link File: n/a
          Network File: /etc/systemd/network/host0.network
              Type: ether
             State: routable (configured)
          Online state: online
            HW Address: aa:b2:5f:b1:9d:46
               MTU: 1500 (min: 68, max: 65535)
             QDisc: noqueue
  IPv6 Address Generation Mode: none
      Queue Length (Tx/Rx): 32/32
          Auto negotiation: no
             Speed: 10Gbps
            Duplex: full
              Port: tp
               Address: 192.0.2.196
                2001:db8:10b:45d8::f27
               Gateway: 192.0.2.1
                2001:db8:10b:45d8::1
         Activation Policy: up
       Required For Online: yes

Mar 31 23:47:13 localhost systemd-networkd[22]: host0: Link UP
Mar 31 23:47:13 localhost systemd-networkd[22]: host0: Gained carrier
```

Für diese Konfiguration haben wir `systemd-networkd` aktiviert und die zuvor eingerichtete Netzwerkkonfiguration übernommen. Dieser Abschnitt dient als Erinnerung daran, den Host mit dem Internet zu verbinden, da dies später für den Abruf der Paket-Repositorys erforderlich ist. Die konkrete Vorgehensweise bei der Netzwerkkonfiguration variiert stark je nach Betriebssystem, und nicht jedes System verwendet `systemd-networkd`. Lesen Sie die für Ihre Umgebung relevante Dokumentation, um eine Internetverbindung herzustellen.

\[Textbasierter Screenshot der Ausführung von „iproute2“ in einer Befehlszeile.\]

``` text
localhost:~ # ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: host0@if17: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default qlen 1000
    link/ether aa:b2:5f:b1:9d:46 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 192.0.2.196/24 scope global host0
       valid_lft forever preferred_lft forever
    inet6 2001:db8:10b:45d8::f27/64 scope global
       valid_lft forever preferred_lft forever
```

IPv6 ist auf dem Host selbst obligatorisch. Wenn Ihnen `::1` zugewiesen wurde, reicht das aus.

Wir empfehlen, einen Paketfilter (d. h. eine Firewall) zu installieren und standardmäßig so zu konfigurieren, dass alle Dienste blockiert werden. Weitere Einzelheiten werden in den folgenden Abschnitten erläutert. Damit das grommunio jedoch ordnungsgemäß funktioniert, müssen die folgenden Ports geöffnet sein:

- VPN, SSH und/oder Port 8443 (AWEB) für den Administrator
- SMTP/25 für den E-Mail-Austausch zwischen Servern
- HTTPS/443 für die Interaktion mit Endnutzern
- IMAPS, POP3S für die Interaktion mit Endnutzern, falls gewünscht

## Hostnamen-Identität deklarieren

\[Textbasierter Screenshot von Shell-Eingabeaufforderungen (nicht Teil des Befehls) und auszuführenden Befehlen.\]

``` text
localhost:~ # echo mail.example.net >/etc/hostname
localhost:~ # hostname mail.example.net
localhost:~ # exec bash --login
mail:~ #
```

Falls Sie noch keinen Hostnamen festgelegt haben, sollten Sie dies tun – insbesondere, wenn aufgrund einer Standardeinstellung „localhost“ als Hostname verwendet wird. Es ist kaum möglich, „localhost“ von einem anderen Rechner aus ohne unnötigen Aufwand zu erreichen.

Für den Domain-Teil späterer E-Mail-Adressen haben wir `example.net` verwendet (z. B. `someuser@example.net`), und dieser Rechner, auf dem Grommunio installiert werden soll, hat den Hostnamen `mail.example.net`. Es können beliebige Namen gewählt werden, solange sie für das jeweilige Netzwerk aussagekräftig sind.

:::note
In der Handbuchseite „hostname(5)“, die auf Systemen vom Typ Linux/systemd bereitgestellt wird, heißt es, dass der Name in `/etc/hostname` aus einem einzigen Label (ohne Punkte) bestehen sollte. Wenn Sie sich dafür entscheiden und die einzelne Bezeichnung noch keinen vollqualifizierten Namen darstellt, müssen Sie die Anweisung `host_id` in `/etc/gromox/http.cfg` auf den vollqualifizierten Namen setzen. (Antworten von AutoDiscover enthalten Verweise auf den Server. Andere Dienste wie zcore, imap usw. sind nicht auf FQDNs angewiesen.)
:::

## Einrichtung des Paketmanagers

Auf <https://download.grommunio.com> stehen vorgefertigte Pakete für verschiedene Plattformen zur Verfügung. Verschiedene Betriebssysteme können dasselbe Archivformat (RPM, DEB usw.) oder dieselben Metadatenformate für Repositorys (wie z. B. rpm-md, apt) verwenden. Verwenden Sie jedoch kein Repository, das nicht *genau* zu Ihrem System passt, und versuchen Sie auch nicht, zwischen den Formaten zu konvertieren. Dies könnte zu unnötigen Problemen führen.

### zypp

openSUSE verwendet „yum-artige“ `.repo`-Dateien zur Deklaration von Repositories. Für openSUSE Leap 16.0 können Sie eine Datei `/etc/zypp/repos.d/grommunio.repo` erstellen und diese wie folgt ausfüllen:

``` ini
[grommunio]
enabled=1
autorefresh=1
baseurl=https://download.grommunio.com/community/openSUSE_Leap_16.0
type=rpm-md
keeppackages=0
```

Rufen Sie den Schlüssel „GPG“ ab und importieren Sie ihn in die RPM-Datenbank, um ihn als vertrauenswürdig zu kennzeichnen. Laden Sie anschließend optional die Metadaten des Repositorys herunter (falls Sie dies nicht tun, erfolgt dies bei der nächsten Installation automatisch).

\[Textbasierter Screenshot von Shell-Eingabeaufforderungen (nicht Teil des Befehls) und auszuführenden Befehlen.\]

``` text
mail:~ # curl https://download.grommunio.com/RPM-GPG-KEY-grommunio >gr.key
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  3175  100  3175    0     0  18021      0 --:--:-- --:--:-- --:--:-- 18039
mail:~ # rpm --import gr.key
```

\[Textbasierter Screenshot von Shell-Eingabeaufforderungen (nicht Teil des Befehls) und auszuführenden Befehlen.\]

``` text
mail:~ # zypper ref grommunio
Retrieving repository 'grommunio' metadata ... [done]
Building repository 'grommunio' cache ... [done]
Specified repositories have been refreshed.
```

### dnf

RHEL verwendet ebenfalls `.repo`-Dateien, allerdings in einem anderen Verzeichnis. Die zu bearbeitende Datei wäre `/etc/yum.repos.d/grommunio.repo` mit folgendem Inhalt:

``` ini
[grommunio]
name=grommunio for Enterprise Linux 10
baseurl=https://download.grommunio.com/community/EL10/
enabled=1
gpgcheck=1
gpgkey=https://download.grommunio.com/RPM-GPG-KEY-grommunio
```

Akzeptieren Sie den Schlüssel „GPG“ bei der ersten Paketinstallation oder -aktualisierung, wenn Sie Befehle mit „dnf“ oder „yum“ ausführen.

:::note
Unsere Pakete hängen von Paketen im Repository [CodeReady Linux Builder](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html-single/package_manifest/index#CodeReadyLinuxBuilder-repository) und im Repository [EPEL](https://docs.fedoraproject.org/en-US/epel/) ab. Um sie zu aktivieren, führen Sie `dnf install epel-release` und anschließend `crb enable` aus.
:::

### apt

Bei Systemen auf Basis von Debian müssen die Repository-Informationen hinzugefügt werden. Erstellen Sie eine neue Datei in `/etc/apt/sources.list.d/`, z. B. `grommunio.sources`:

``` debcontrol
Types: deb
URIs: https://download.grommunio.com/community/Debian_13
Suites: Debian_13
Components: main
Signed-By: /usr/share/keyrings/download.grommunio.com.gpg
```

``` text
# wget -qO - https://download.grommunio.com/RPM-GPG-KEY-grommunio | gpg --dearmor --output /usr/share/keyrings/download.grommunio.com.gpg
```

(Dies gilt beispielsweise auch für *Ubuntu_24.04*. Im speziellen Fall von Ubuntu-Installationen ist jedoch *zusätzlich* das Repository Ubuntu `universe` erforderlich; stellen Sie daher sicher, dass Sie es aktivieren. Für Debian reicht die Basisdistribution aus.)

Importieren Sie anschließend den Schlüssel „GPG“ und aktualisieren Sie die Repositories.

\[Textbasierter Screenshot von Shell-Eingabeaufforderungen (nicht Teil des Befehls) und auszuführenden Befehlen.\]

``` text
# curl https://download.grommunio.com/RPM-GPG-KEY-grommunio >/etc/apt/trusted.gpg.d/download.grommunio.com.asc
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                 Dload  Upload   Total   Spent    Left  Speed
100  3175  100  3175    0     0  50396      0 --:--:-- --:--:-- --:--:-- 50396
```

:::note
Der Befehl `apt-key` ist veraltet und sollte nicht mehr verwendet werden. Weitere Informationen finden Sie in der Manpage zu [apt-key(8)](https://manpages.debian.org/apt-key).
:::

\[Textbasierter Screenshot von Shell-Eingabeaufforderungen (nicht Teil des Befehls) und auszuführenden Befehlen.\]

``` text
# apt-get update
Hit:1 http://gb.archive.ubuntu.com/ubuntu noble InRelease
Hit:2 http://gb.archive.ubuntu.com/ubuntu noble-updates InRelease
Hit:3 http://gb.archive.ubuntu.com/ubuntu noble-backports InRelease
Get:4 https://download.grommunio.com/community/Ubuntu_24.04 Ubuntu_24.04 InRelease [4,692 B]
Hit:5 http://security.ubuntu.com/ubuntu noble-security InRelease
Get:6 https://download.grommunio.com/community/Ubuntu_24.04 Ubuntu_24.04/main amd64 Packages [7,072 B]
Get:7 https://download.grommunio.com/community/Ubuntu_24.04 Ubuntu_24.04/main i386 Packages [4,637 B]
Fetched 16.4 kB in 1s (23.8 kB/s)
Reading package lists... Done
```

## TLS-Zertifikate

Informationen zum Erhalt eines Zertifikats finden Sie in der externen Dokumentation.

- Selbstsigniertes Zertifikat: <https://stackoverflow.com/a/10176685>
- Let's Encrypt-Zertifikat: <https://certbot.eff.org/instructions>

Der Schlüssel des Zertifikats darf kein Passwort enthalten, da keine interaktive Passwortabfrage implementiert ist.

Wenn Sie vorhaben, mehrere Subdomains für Ihre Bereitstellung zu verwenden, z. B. `meet.example.net` für *grommunio-meet* und `mail.example.net` für *grommunio-web*, kann die Erstellung eines Zertifikats mit einem *subjectAltName*-Feld (SAN) oder sogar eines Wildcard-Zertifikats gegenüber einzelnen Zertifikaten vorteilhaft sein. Nicht alle Netzwerkprotokolle verfügen über eine Funktion wie Server Name Indication (SNI), und noch weniger Systemdienste unterstützen mehrere einzelne Zertifikate, selbst wenn sie mehrere IP-Adressen bedienen.

Autodiscover-Clients versuchen im Rahmen ihrer Routine, neben `example.net` auch `autodiscover.example.net` aufzulösen und zu verwenden. Da mehrere Namen ausprobiert werden, ist ein SAN-Eintrag für die Subdomain `autodiscover.` nicht unbedingt erforderlich. Weitere Einzelheiten finden Sie unter [MS-OXDISCO §3.1.5](https://docs.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-oxdisco/d56ae3c6-bf29-4712-b274-2e4cc5fdaa64).

Die folgenden Dienste benötigen Zugriff auf das/die Zertifikat(e):

- gromox
- nginx
- Nachsatz (optional)

Einige Prozesse lesen TLS-Zertifikate und deren Schlüsseldateien *erst* nach dem Wechsel zu einer nicht privilegierten Benutzeridentität. Aus diesem Grund müssen Zertifikatsdateien möglicherweise mit einer Dateisystem-ACL versehen oder Kopien mit entsprechenden Eigentumsrechten erstellt werden.

## nginx

nginx wird als Frontend zur Bearbeitung von HTTP-Anfragen verwendet. Anfragen an RPC/HTTP werden an Gromox weitergeleitet, Anfragen an das Verwaltungsmodul API (kurz: AAPI) werden an eine uwsgi-Instanz weitergeleitet und Anfragen an den Chat-Dienst API werden an eine Mattermost-Instanz weitergeleitet.

Sie können auch einen alternativen HTTP-Server verwenden, wenn Sie mit der Konfiguration *aller* Einstellungen vertraut sind; in dieser Anleitung wird jedoch ab hier ausschließlich auf den nginx eingegangen.

Laden Sie das nginx-Paket für Ihr Betriebssystem herunter und stellen Sie sicher, dass der Dienst sowohl beim nächsten Systemstart als auch sofort gestartet wird.

\[Textbasierter Screenshot von Shell-Eingabeaufforderungen (nicht Teil des Befehls) und auszuführenden Befehlen.\]

``` text
mail:~ # zypper in nginx nginx-module-vts
Loading repository data...
Reading installed packages...
Resolving package dependencies...

The following 26 NEW packages are going to be installed:
  fontconfig libX11-6 libX11-data libXau6 libXpm4 libaom3 libavif13 libdav1d5
  libdb-4_8 libexslt0 libfontconfig1 libfreetype6 libgd3 libgdbm6
  libgdbm_compat4 libjbig2 libjpeg8 libpng16-16 librav1e0 libtiff5 libwebp7
  libxcb1 libxslt1 nginx nginx-module-vts perl

26 new packages to install.
Overall download size: 15.2 MiB. Already cached: 0 B. After the operation,
additional 68.4 MiB will be used.
Continue? [y/n/v/...? shows all options] (y):
```

\[Textbasierter Screenshot von Shell-Eingabeaufforderungen (nicht Teil des Befehls) und auszuführenden Befehlen.\]

``` text
(22/26) Installing: libXpm4-3.5.13-1.8.x86_64 ... [done]
(23/26) Installing: libfontconfig1-2.13.1-2.12.x86_64 ... [done]
(24/26) Installing: libgd3-2.3.3-2.2.x86_64 ... [done]
(25/26) Installing: nginx-1.21.5-1.1.x86_64 ... [done]
Additional rpmoutput:
/usr/bin/systemd-sysusers --replace=/usr/lib/sysusers.d/nginx.conf -
Creating group nginx with gid 477.
Creating user nginx (User for nginx) with uid 477 and gid 477.
(26/26) Installing: nginx-module-vts-0.1.116-1.1.x86_64 ... [done]
mail:~ # systemctl enable --now nginx
Created symlink /etc/systemd/system/multi-user.target.wants/nginx.service → /usr/lib/systemd/system/nginx.service
```

In diesem Screenshot haben wir außerdem die Installation des VTS-Moduls nginx angefordert, das AAPI zur Erfassung von Verkehrsstatistiken verwendet. VTS ist **nicht** für alle Plattformen verfügbar, sodass Sie es weglassen können.

Da der Netzwerkdienst „nginx HTTPS“ als zentraler Einstiegspunkt für alle Vorgänge dient, muss er im Paketfilter so konfiguriert werden, dass er öffentlich zugänglich ist. Mit anderen Worten: Öffnen Sie Port 443.

Standardmäßig enthalten auf Debian basierende Distributionen Standardkonfigurationen für den Webserver, die mit grommunio in Konflikt stehen. Es wird empfohlen, den Standard-Webservice-Eintrag zu entfernen, der sich in der Regel unter `/etc/nginx/sites-enabled/default` befindet. Durch das Entfernen dieses Verweises wird die Standard-Website des Webservers deaktiviert.

Konfigurationsausschnitte sollten ausschließlich unter `/etc/` bearbeitet werden. Dateien in `/usr` gehören zum Anbieter bzw. zur Distribution und können bei der Durchführung eines Updates durch den Paketmanager (ohne Vorankündigung) geändert werden.

## nginx-Supportpaket

Das Paket `grommunio-common` enthält die ersten Konfigurationsfragmente für nginx. Installieren Sie es.

``` sh
zypper in grommunio-common
```

Die Standardkonfiguration des nginx, wie sie in den Linux-Distributionen ausgeliefert wird (Datei `/etc/nginx/nginx.conf`), enthält eine Zeile `include conf.d/*`. Das Support-Paket legt eine Datei unter `/etc/nginx/conf.d/grommunio.conf` ab, sodass die nginx-bezogene grommunio-Konfiguration beim nächsten (Neu-)Start von nginx automatisch geladen wird.

Die eigentlichen Fragmentdateien für nginx befinden sich aus Gründen der Paketierungsrichtlinien unter `/usr/share/grommunio-common`; sie sind nicht dazu gedacht, geändert zu werden. Sie enthalten jedoch weitere `include`-Anweisungen, die auf `/etc` verweisen, um das Überschreiben bestimmter Aspekte zu erleichtern.

`/usr/share/grommunio-common/nginx/locations.d/autodiscover.conf` enthält beispielsweise das Fragment, das nginx anweist, den Bereich `/Autodiscover` zu erkennen und entsprechende Anfragen an gromox-http auf Port 10443 weiterzuleiten (siehe nachfolgenden Abschnitt).

## TLS für nginx

Erstellen Sie die Datei „`/etc/grommunio-common/nginx/ssl_certificate.conf`“ und fügen Sie die Zertifikatsanweisungen ein, wobei Sie die Pfade entsprechend anpassen:

``` nginx
ssl_certificate zzz.pem;
ssl_certificate_key zzz.key;
```

(Die genaue Reihenfolge der Einbindungen lautet `/etc/nginx/nginx.conf` \> `/etc/nginx/conf.d/grommunio.conf` \> `/usr/share/grommunio-common/nginx.conf` \> `/etc/grommunio-common/nginx/ssl_certificate.conf`.)

Die Erklärungen zum Abhören der Ports 80 und 443 werden von `/usr/share/grommunio-common/nginx.conf` bereitgestellt.

Die Konfiguration von nginx kann getestet bzw. angezeigt werden:

``` sh
nginx -t
nginx -T
```

## MariaDB

MariaDB/MySQL dient zur Speicherung der Benutzerdatenbank und weiterer Hilfs-Konfigurationsparameter. Wenn Sie die Einrichtung eines Gromox-Clusters planen, muss diese Datenbank für alle Knoten, auf denen Gromox-Dienste gehostet werden sollen, global verfügbar sein.

Ein bereits vorhandener MariaDB-Server kann verwendet werden. Alle Standardwerkzeuge und -verfahren, die die Datenbank-Community rund um SQL entwickelt hat, sind anwendbar, beispielsweise in Bezug auf Konfiguration, Sicherung/Wiederherstellung und Replikation.

Angenommen, Sie möchten eine neue SQL-Server-Instanz einrichten, dann beziehen Sie die MariaDB-Pakete aus Ihrem Betriebssystem und stellen Sie sicher, dass der Dienst sowohl beim nächsten Systemstart als auch sofort gestartet wird.

\[Textbasierter Screenshot von Shell-Eingabeaufforderungen (nicht Teil des Befehls) und auszuführenden Befehlen.\]

``` text
mail:~ # zypper in mariadb mariadb-client
Loading repository data...
Reading installed packages...
Resolving package dependencies...

The following 15 NEW packages are going to be installed:
  libJudy1 libaio1 libedit0 libltdl7 liblzo2-2 libmariadb3 libodbc2
  libpython3_8-1_0 libwrap0 mariadb mariadb-client mariadb-errormessages
  python38-base python38-mysqlclient

15 new packages to install.
Overall download size: 33.3 MiB. Already cached: 0 B. After the operation,
additional 160.7 MiB will be used.
Continue? [y/n/v/...? shows all options] (y):
```

``` text
(13/15) Installing: python38-base-3.8.12-3.2.x86_64 ... [done]
(14/15) Installing: python38-mysqlclient-2.0.3-2.2.x86_64 ... [done]
(15/15) Installing: mariadb-10.6.5-4.1.x86_64 ... [done]
mail:~ # systemctl enable --now mariadb
Created symlinks /etc/systemd/system/mysql.service → /usr/lib/systemd/system/mariadb.service.
Created symlink /etc/systemd/system/multi-user.target.wants/mariadb.service → /usr/lib/systemd/system/mariadb.service
```

Erstellen Sie nach der Installation eine leere Datenbank und einen Benutzer für den Zugriff darauf.

\[Screenshot einer interaktiven MySQL-Sitzung im Terminal.\]

``` text
mail:~ # mariadb
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 4
Server version: 10.6.5-MariaDB MariaDB package

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> CREATE DATABASE `grommunio`;
Query OK, 1 row affected (0.001 sec)

MariaDB [(none)]> GRANT ALL ON `grommunio`.* TO 'grommunio'@'localhost' IDENTIFIED BY 'freddledgruntbuggly';
Query OK, 0 rows affected (0.004 sec)

MariaDB [(none)]>
```

``` sql
CREATE DATABASE `grommunio`;
GRANT ALL ON `grommunio`.* TO 'grommunio'@'localhost' IDENTIFIED BY 'freddledgruntbuggly';
```

Der Netzwerkdienst MariaDB ist nicht dafür vorgesehen, für das öffentliche Internet zugänglich zu sein. Innerhalb Ihres privaten Netzwerks muss er möglicherweise freigeschaltet werden, wenn (und nur wenn) Sie beabsichtigen, ihn in einer Grommunio-Konfiguration mit mehreren Hosts zu nutzen, oder wenn Ihre Pläne zur Datenbankreplikation dies erfordern.

In bestimmten Versionen, wie beispielsweise MySQL 8 (z. B. auf Ubuntu 20.04), werden durch die GRANT-Anweisung keine Benutzer mehr implizit angelegt, sodass stattdessen [CREATE USER](https://dev.mysql.com/doc/refman/8.0/en/create-user.html) verwenden. Darüber hinaus kann die Authentifizierung mit MariaDB/älteren MySQL-Clients aufgrund einer offenbar geänderten Hash-Methode fehlschlagen; Abhilfe schafft ein zusätzlicher Parameter für CREATE USER oder [ALTER USER](https://stackoverflow.com/questions/49194719/).

## Gromox im Allgemeinen

Gromox ist die zentrale Groupware-Serverkomponente von grommunio. Er stellt die Dienste für Outlook RPC, IMAP/POP3, einen LDA für die Datenerfassung sowie ein PHP-Modul für Z-MAPI bereit.

Das vorgefertigte Paket ist in den Grommunio-Repositories verfügbar. Diese Anleitung basiert daher auf einem solchen vorgefertigten Gromox. Experten, die das Programm aus dem Quellcode kompilieren möchten und über allgemeine Kenntnisse dazu verfügen, werden für spezifische Aspekte des Kompilierungsvorgangs auf die [Gromox-Installationsdokumentation](https://github.com/grommunio/gromox/blob/master/doc/install.rst) verwiesen.

\[Textbasierter Screenshot von Shell-Eingabeaufforderungen (nicht Teil des Befehls) und auszuführenden Befehlen.\]

``` text
mail:~ # zypper in gromox
Loading repository data...
Reading installed packages...
Resolving package dependencies...

The following 26 NEW packages are going to be installed:
  gromox libHX32 libbfio1 libcdata1 libcerror1 libcfile1 libclocale1 libcnotify1
  libcpath1 libcsplit1 libcthreads1 libfcache1 libfdata1 libfmapi1 libgumbo1
  libjsoncpp25 libpff1 libuna1 php8 php8-cli php8-mysql php8-pdo php8-soap
  system-user-gromox system-user-wwwrun timezone

26 new packages to install
Overall download size: 5.8 MiB. Already cached: 0 B. After the operation,
additional 19.3 MiB will be used.
Continue? [y/n/v/...? shows all options] (y):
```

Gromox führt eine Reihe von Prozessen und Netzwerkdiensten aus. Keiner davon ist für den öffentlichen Internetzugang vorgesehen, da nginx bereits als wichtiger Zugangspunkt dient. Der Dienst Gromox exmdb (standardmäßig Port 5000/TCP) muss in einer grommunio-Konfiguration mit mehreren Hosts von anderen Gromox-Knoten aus erreichbar sein, um die interne Weiterleitung an den Heimserver eines Postfachs zu ermöglichen.

Daemon-Programme befinden sich in `/usr/libexec/gromox` und haben kurze Namen wie `http`, `zcore` usw. Die Manpage trägt denselben Namen, daher würden Sie `man http` verwenden, um die entsprechende Manpage aufzurufen. Die standardmäßig gelesenen Konfigurationsdateien folgen demselben Schema, z. B. `/etc/gromox/http.cfg`. Dienstprogramme zur Prozessanzeige wie ps(1) zeigen je nach Verwendung dieser Diagnoseprogramme entweder den vollständigen Pfad der ausführbaren Datei oder nur `http` an. Der Name der Einheit systemd lautet jedoch `gromox-http.service`.

Die gesamte Protokollausgabe wird an stderr gesendet. Bei Ausführung über systemd wird diese automatisch in das Journal umgeleitet.

## Gromox-Benutzerdatenbank

Die Verbindungsparameter für MariaDB müssen mit der Datei `/etc/gromox/mysql_adaptor.cfg` an Gromox übermittelt werden, deren Inhalt etwa wie folgt aussehen könnte:

    mysql_username=grommunio
    mysql_password=freddledgruntbuggly
    mysql_dbname=grommunio
    schema_upgrade=host:mail.example.net

Stellen Sie sicher, dass Sie für diese Datei restriktive Berechtigungen festlegen (siehe Abschnitt [Berechtigungen](#permissions)).

Die in MariaDB gespeicherten Daten werden von allen Mailbox-Knoten in einer Cluster-Konfiguration gemeinsam genutzt. Änderungen am Tabellenschema (DDL) sind gelegentlich erforderlich, sollten jedoch höchstens von einem Knoten in einem solchen Cluster vorgenommen werden, um das Risiko einer Datenbeschädigung zu vermeiden. Der Hostname nach `host:` gibt an, welcher Rechner gegebenenfalls als maßgebend gilt. Die Zeile `schema_upgrade=host:...` sollte auf allen Mailbox-Knoten einheitlich sein. Es ist möglich, `schema_upgrade` vollständig wegzulassen; in diesem Fall werden keine automatischen Aktualisierungen durchgeführt.

Nachdem die Datenbankparameter in der Konfigurationsdatei festgelegt wurden, können die Anfangstabellen durch Ausführen des Befehls gromox-dbop angelegt werden:

\[Textbasierter Screenshot von Shell-Eingabeaufforderungen (nicht Teil des Befehls) und auszuführenden Befehlen.\]

``` text
mail:~ # gromox-dbop -C
Creating admin_roles
Creating associations
Creating configs
Creating domains
Creating forwards
Creating groups
Creating hierarchy
Creating members
Creating mlists
Creating options
Creating orgs
Creating specifieds
Creating users
Creating aliases
Creating user_properties
Creating admin_role_permission_relation
Creating admin_user_role_relation
Creating classes
Creating fetchmail
Creating secondary_store_hints
Creating user_devices
Creating user_device_history
Creating task_queue
mail:~ #
```

Wenn automatische Schema-Upgrades deaktiviert sind, können manuelle Aktualisierungen später wie folgt durchgeführt werden:

``` sh
gromox-dbop -U
```

## gromox-Ereignis/Timer

gromox-event ist ein Benachrichtigungs-Daemon für einen Interprozess-Kanal zwischen gromox-imap und gromox-midb. Es ist keine Konfiguration erforderlich.

gromox-timer ist ein at(1)/atd(8)-ähnlicher Daemon für die verzögerte Zustellung. Es ist keine Konfiguration erforderlich.

``` sh
systemctl enable --now gromox-event gromox-timer
```

## gromox-http

Da nginx zuvor als Frontend eingerichtet wurde, um auf den Ports 80 und 443 zu lauschen, muss gromox-http „aus dem Weg“ geräumt werden (seine integrierten Standardwerte sind ebenfalls 80/443). Außerdem müssen dem Daemon die Pfade zu den TLS-Zertifikaten mitgeteilt werden. Eine Manpage mit allen Konfigurationsanweisungen liegt bei und kann mit `man 8gx http` aufgerufen werden. Legen Sie vorerst die Lausch-Adressen in `/etc/gromox/gromox.cfg` fest (um gromox-http von nginx' Ports 80/443 wegzubewegen):

``` ini
http_listen = [::]:10080
http_listen_tls = [::]:10443
```

und die Pfade zu den TLS-Zertifikaten in `/etc/gromox/http.cfg`:

``` ini
http_support_tls=yes
http_certificate_path=zzz.pem
http_private_key_path=zzz.key
```

Starten Sie den Dienst.

``` sh
systemctl enable --now gromox-http
```

Führen Sie einen Verbindungstest durch. Das erwartete Ergebnis bei der Anfrage der URI `/` ist ein 404-Statuscode. (Es könnte zwar eine statische HTML-Datei ausgeliefert werden, aber in der Standardkonfiguration ist keine solche Datei vorhanden, und `/` ist nirgendwo zugeordnet.)

``` sh
curl -kv https://localhost:10443/
```

Erwartetes Ergebnis:

``` text
> GET / HTTP/1.1
> Host: localhost:10443
…
< HTTP/1.1 404 Not Found
…
```

Die Standardkonfiguration von Gromox enthält jedoch eine Zuordnung für `/web` (zu `/usr/share/grommunio-web`). Wenn Sie das `grommunio-web`-Paket bereits installiert haben, werden Anfragen an dieses Unterverzeichnis erfolgreich sein. Sie können die folgenden URLs (Port 10443 für gromox-http direkt, bzw. 443 für nginx) mit `curl` über die Befehlszeile des Servers testen; dabei sollte eine statische Datei bereitgestellt werden:

``` sh
curl -kv https://localhost:10443/web/version
curl -kv https://localhost:443/web/version
# firefox https://mail.example.net/web/version
```

Die Nutzung eines Browsers auf einem separaten Desktop-Rechner ist ebenfalls möglich, sofern der Port 10443 freigegeben wurde. (Normalerweise muss Port 10443 nicht für andere Hosts freigegeben werden.) Das Ergebnis für localhost:10443 und localhost:443 sollte identisch sein. Erwartete Ausgabe:

``` text
< HTTP/1.1 200 OK
< Date: Tue, 29 Mar 2024 23:08:33 GMT
< Content-Type: text/plain
< Content-Length: 26
< Accept-Ranges: bytes
< Last-Modified: Tue, 29 Mar 2024 07:09:12 GMT
< ETag: "19165e1100000000-1a000000-98b0426200000000"
<
User-agent: *
Disallow: /
```

## gromox–midb & zcore

gromox-midb ist die Nachrichtenindexdatenbank für IMAP, und gromox-zcore ist der Brückenprozess für PHP-MAPI. Es ist keine weitere Konfiguration erforderlich.

``` sh
systemctl enable --now gromox-midb gromox-zcore
```

## gromox – IMAP & POP3

Konfigurieren Sie die Zertifikatspfade für TLS analog zu `http.cfg` für die IMAP-/POP3-Daemons. Überspringen Sie diesen Abschnitt, wenn Sie diese Protokolle nicht ausführen möchten.

IMAP/POP3 können im unverschlüsselten Modus betrieben werden, allerdings nur für Entwickler. Daher wird hier „imap_force_tls“ gesetzt. Deklarieren Sie in `/etc/gromox/imap.cfg`:

``` ini
imap_support_tls=true
imap_certificate_path=zzz.pem
imap_private_key_path=zzz.key
imap_force_tls=true
```

Im Jahr `/etc/gromox/pop3.cfg`:

``` ini
pop3_support_tls=true
pop3_certificate_path=zzz.pem
pop3_private_key_path=zzz.key
pop3_force_tls=true
```

Aktivieren und starten Sie die Dienste, die Sie nutzen möchten. Passen Sie die Konfiguration Ihres Paketfilters bei Bedarf an diese neuen Ports an.

``` sh
systemctl enable --now gromox-imap gromox-pop3
```

Manuelle Tests können mit Dienstprogrammen wie *telnet*, *socat* und *curl* durchgeführt werden, mit denen sich komplexere Befehlsketten für das IMAP/POP3-Protokoll ausführen lassen.

``` sh
curl -kv imaps://localhost/
curl -kv pop3s://localhost/
```

Erwartete Ausgabe für IMAP:

``` text
*   Trying ::1:993...
…
< * OK mail.example.net service ready
> A001 CAPABILITY
< * CAPABILITY IMAP4rev1 XLIST SPECIAL-USE UNSELECT UIDPLUS IDLE AUTH=LOGIN STARTTLS
< A001 OK CAPABILITY completed
…
```

Erwartete Ausgabe für POP3:

``` text
*   Trying ::1:995...
* TCP_NODELAY set
* Connected to localhost (::1) port 995 (#0)
…
< +OK mail.example.net pop service ready
> CAPA
< +OK capability list follows
< STLS
< TOP
< USER
< PIPELINING
< UIDL
< TOP
< .
> LIST
< -ERR login first
```

## PHP-FPM

Bei der Installation des Pakets `gromox` wird php-fpm bereits als Abhängigkeit mitinstalliert.

Überprüfen Sie der Vollständigkeit halber, ob PHP das Modul MAPI erkennt.

``` sh
echo -en '<?php phpinfo(); ?>' | php | grep mapi
```

Stellen Sie sicher, dass die Pool-Datei „gromox“ abgelegt wurde.

``` sh
ls -al /etc/php8/fpm/php-fpm.d/gromox.conf
```

Aktivieren bzw. starten Sie anschließend php-fpm:

``` sh
systemctl enable --now php-fpm
```

Überprüfen Sie der Vollständigkeit halber, ob der Socket in der Pool-Datei angelegt wurde:

``` sh
ls -al /run/gromox/php-fpm.sock
```

Versuchen Sie, über gromox-http (10443) und/oder nginx (443) eine Antwort vom Autodiscover-Code zu erhalten. (`/usr/share/grommunio-common/nginx/locations.d/autodiscover.conf` definiert den Handler für den URI-Pfad `/Autodiscover`, um alle Anfragen an gromox-http auf Port 10443 weiterzuleiten. gromox-http leitet diese an php-fpm weiter. Auf diese Weise funktioniert Autodiscover auch in Testumgebungen ohne Frontend wie nginx.)

``` sh
curl -kv https://localhost:10443/Autodiscover/Autodiscover.xml
curl -kv https://localhost:443/Autodiscover/Autodiscover.xml
# firefox https://mail.example.net/Autodiscover/Autodiscover.xml
```

Erwartetes Ergebnis dieser Operation:

``` text
> GET /Autodiscover/Autodiscover.xml HTTP/1.1
> Host: localhost:10443
…
< HTTP/1.1 200 Success
< Date: Tue, 29 Mar 2024 23:54:16 GMT
< Transfer-Encoding: chunked
< Content-type: text/html; charset=UTF-8
<
E-2000: invalid request method, must be POST!
```

## Verwaltung API (AAPI)

Installieren Sie das `grommunio-admin-api`-Paket. Dieses Paket enthält eine Befehlszeilenschnittstelle sowie einen Anwendungsserver, der mit uwsgi implementiert wurde.

``` sh
zypper in grommunio-admin-api
```

Bearbeiten Sie `/etc/grommunio-admin-api/conf.d/database.yaml`, damit AAPI die Konfiguration von MariaDB erkennt:

``` yaml
DB:
  host: 'localhost'
  user: 'grommunio'
  pass: 'freddledgruntbuggly'
  database: 'grommunio'
```

Legen Sie das Passwort für den AAPI-Administrator fest. Dieser Shell-Befehl kann später auch verwendet werden, um ein vergessenes Passwort wiederherzustellen.

``` sh
grommunio-admin passwd
```

grommunio Admin Web unterstützt die Anzeige der verfügbaren Funktionen in der oberen linken Ecke. Da grommunio dezentral installiert werden kann, kann diese Einstellung unter `/etc/grommunio-admin-common/config.json` konfiguriert werden.

``` json
{
        "mailWebAddress": "https://mail.example.com/web",
        "chatWebAddress": "https://mail.example.com/chat",
        "videoWebAddress": "https://mail.example.com/meet",
        "fileWebAddress": "https://mail.example.com/files",
        "archiveWebAddress": "https://mail.example.com/archive"
}
```

Diese Konfigurationsdatei muss für nginx bereitgestellt werden, idealerweise am steckbaren Speicherort `/etc/grommunio-admin-common/nginx.d/web-config.conf`.

``` nginx
location /config.json {
  alias /etc/grommunio-admin-common/config.json;
}
```

Der uwsgi-Server wird hauptsächlich von der Administrator-Weboberfläche (AWEB) genutzt. Aktivieren bzw. starten Sie den Dienst daher bitte jetzt.

``` sh
systemctl enable --now grommunio-admin-api
```

### Berechtigungen

Die vorgefertigten Pakete erstellen die folgenden Identitäten:

- Gruppe `gromox`, die für Objekte im Informationsspeicher (`/var/lib/gromox`) verwendet wird
- Gruppe `gromoxcf`, die für Konfigurationsdateien (`/etc/gromox`) verwendet wird
- Gromox-Dienstbenutzer: `gromox` der Gruppe `gromox`, mit der Zusatzgruppe `gromoxcf`
- AAPI-Dienstbenutzer: `grommunio` der Gruppe `grommunio`, mit den zusätzlichen Gruppen `gromox` und `gromoxcf`

Es ist vorgesehen, dass die Dienste Gromox und AAPI mit dem Informationsspeicher und den Konfigurationsdateien interagieren können.

Das Verzeichnis `/var/lib/gromox` und alle darin enthaltenen Dateien sollen dem Benutzer `gromox` oder `grommunio` gehören. Die Eigentümergruppe soll `gromox` sein, mit Lese- und Schreibrechten. Andere Personen sollen keinerlei Zugriff haben.

``` text
drwxrwx--- 5 gromox gromox 62 Feb 13 23:15 /var/lib/gromox
```

Das Verzeichnis `/etc/gromox` und alle darin enthaltenen Dateien sollen entweder dem Benutzer `root` oder `grommunio` gehören, der Gruppe `gromoxcf` mit Lesezugriff gehören und ansonsten nicht zugänglich sein. Gromox muss die Konfigurationsdateien überhaupt nicht aktualisieren, sondern nur lesen. AAPI muss dort schreiben können (was über die Eigentumsrechte des Benutzers `grommunio` möglich ist). Alle anderen Benutzer sollten keinen Zugriff auf dieses Verzeichnis haben, da es Anmeldedaten für MySQL und LDAP enthält.

``` text
drwxr-x--- 2 grommunio gromoxcf 125 Feb 20 21:47 /etc/gromox
```

## nginx-Supportpaket für AAPI/AWEB

Bei der Installation von `grommunio-admin-api` oder `grommunio-admin-web` wird auch `grommunio-admin-common` mitinstalliert, wodurch ähnlich wie bei dem zuvor genannten `grommunio-common` eine Reihe von nginx-Fragmenten im Dateisystem abgelegt werden.

Das Paket fügt nginx-Konfigurationsfragmente hinzu, damit es unverschlüsselt auf Port 8080 lauscht. Sie können `/etc/nginx/conf.d/grommunio-admin.conf` bearbeiten und die Einbindung von `/usr/share/grommunio-admin-common/nginx.conf` deaktivieren und/oder den verschlüsselten Zugriff aktivieren, indem Sie die Auskommentierung von `/usr/share/grommunio-admin-common/nginx-ssl.conf` aufheben. Letzteres bewirkt, dass nginx auf Port 8443 lauscht.

Erstellen Sie `/etc/grommunio-admin-common/nginx-ssl.conf` als Datei oder als symbolischen Link zu `/etc/grommunio-common/nginx/ssl_certificate.conf` zu den vorhandenen TLS-Anweisungen.

``` sh
ln -s /etc/grommunio-common/nginx/ssl_certificate.conf /etc/grommunio-admin-common/nginx-ssl.conf
```

Laden Sie nginx bei Bedarf neu oder starten Sie es neu. Passen Sie die Konfiguration Ihres Paketfilters gegebenenfalls an die neuen Ports an.

Die Fragmentdateien haben eine Route eingerichtet, über die der `/api/v1`-URI-Bereich an den uwsgi-Prozess weitergeleitet wird. Es ist nun möglich, Anfragen an die AAPI-Endpunkte zu stellen, und wir können dies mit curl oder sogar mit Firefox testen.

``` sh
curl -kv https://localhost:8443/api/v1/login
# firefox https://mail.example.net:8443/api/v1/login
```

Das erwartete Ergebnis ist eine JSON-Antwort.

``` text
…
< HTTP/1.1 405 METHOD NOT ALLOWED
…
{"message":"Method 'GET' not allowed on this endpoint"}
```

Es kann auch eine authentifizierte Anfrage gestellt werden:

``` sh
curl -kv https://localhost:8443/api/v1/login -d 'user=admin&pass=freddledgruntbuggly'
```

Erwartetes Ergebnis:

``` json
{"grommunioAuthJwt":"eyJ0…"}
```

## Verwaltungs-Weboberfläche (AWEB)

AWEB ist ein Paket, das ein HTML/JavaScript-Frontend enthält und die Endpunkte von AAPI über REST nutzt.

``` sh
zypper in grommunio-admin-web
```

Da dieses Paket ausschließlich statische Dateien enthält, ist die Anmeldeseite nun bereit. Rufen Sie `https://mail.example.net:8443/` auf und melden Sie sich mit den zuvor von Ihnen festgelegten Zugangsdaten an (Benutzername: `admin`, Passwort: wie von Ihnen festgelegt).

Einzelheiten zur Verwendung von AWEB (manchmal auch als AUI bezeichnet) finden Sie auf der [Grommunio-Dokumentationswebsite](/admin/administration/#grommunio-admin-ui-aui).

### Bekannte Probleme

Die Dienstliste „systemd“ im Dashboard (Unterabschnitt „Leistung“, Feld im linken Drittel) enthält Aktionsschaltflächen zum Auslösen von systemctl `enable/disable/start/stop/restart`. Trotz der Platzierung der Datei `/usr/share/polkit-1/rules.d/pkit-10-gromox.rules` kann AAPI keine systemctl-Befehle ausführen, und es erscheint ein rotes Fehlerfeld mit dem Text `Interactive authentication required`.

### Domäne und Benutzer anlegen

Erstellen Sie die Domäne `example.net` und einen Benutzer mit dem Namen AWEB. Anschließend können Sie die Anmeldung und Nutzung auf verschiedene Weise testen. So können Sie beispielsweise den Autodiscover-Vorgang über die Befehlszeile ausführen:

``` sh
PASS=abcdef /usr/libexec/gromox/autodiscover -e boop@example.net
```

Erwartetes Ergebnis:

``` xml
<?xml version="1.0" encoding="utf-8"?>
<Autodiscover xmlns="http://schemas.microsoft.com/exchange/autodiscover/responseschema/2006">
<Response xmlns=…
```

Bei Bedarf können Sie sich an Outlook wenden.

Um sich bei IMAP/POP3 anmelden zu können, muss der Benutzer diese Funktion ausdrücklich aktivieren. Dies kann über AWEB geändert werden, indem Sie im linken Navigationsbereich auf die Registerkarte *Domains* \> *example.net* \> *Benutzer* klicken. Sobald die Funktion aktiviert ist,

``` sh
curl -kv imaps://localhost/ -u boop@example.net:abcdef
```

Erwartetes Ergebnis:

``` text
…
> A001 CAPABILITY
< * CAPABILITY IMAP4rev1 XLIST SPECIAL-USE UNSELECT UIDPLUS IDLE AUTH=LOGIN STARTTLS
< A001 OK CAPABILITY completed
> A002 AUTHENTICATE LOGIN
< + VXNlciBOYW1lAA==
> Ym9ua0Byb3V0ZTM4LnRlc3Q=
< + UGFzc3dvcmQA
> YWJjZGVm
< A002 OK logged in
> A003 LIST "" *
< * LIST (\HasNoChildren) "/" {5}
* LIST (\HasNoChildren) "/" {5}
< INBOX
…
```

## grommunio-web

Installieren Sie `grommunio-web`. Vergewissern Sie sich, dass Sie die Anmeldeseite aufrufen und sich anmelden können:

``` sh
curl -kv https://localhost:443/web/
# firefox https://mail.example.net/web/
```

## Loopback-E-Mail

Die Dienste *gromox-delivery-queue* und *gromox-delivery* bilden zusammen den Local Delivery Agent (LDA). Dieser LDA unterstützt eine kleine Erweiterung von SMTP, um den Einsatz in einem filterfreien Loopback-Szenario zu ermöglichen. Das heißt, man kann E-Mails von example.net (ausschließlich) an example.net senden, ohne dass SMTP nach außen übertragen wird.

(Eine mit grommunio-web verfasste und versendete E-Mail wird letztendlich vom Prozess *gromox-zcore* versendet, der sie an *localhost:25* weiterleitet. Alternativ sendet bei Verwendung von Outlook der Prozess *gromox-http* die E-Mail an *localhost:25*. Und auf Port 25 kann man entweder den LDA ausführen oder sogar ein vollwertiges MTA wie Postfix.)

Auf einigen Systemen, auf denen Dienste übermäßig häufig gestartet werden (z. B. Debian), müssen Sie möglicherweise zunächst einen vorhandenen MTA-Dienst deaktivieren, bevor Sie diesen Test durchführen können. (Alternativ können Sie direkt zum Abschnitt „Postfix“ weiter unten springen.)

``` sh
systemctl stop postfix
systemctl enable --now gromox-delivery gromox-delivery-queue
```

## Postfix

Da *gromox-delivery-queue* standardmäßig auf Port 25 lauscht, muss es aus dem Weg geräumt werden, wenn an seiner Stelle ein vollwertiges MTA installiert wird. Bearbeiten Sie `/etc/gromox/smtp.cfg` und definieren Sie:

``` ini
lda_listen = [::]:24
```

Im Rahmen der Postfix-Konfiguration werden wir das *mysql*-Lookup-Plugin verwenden. Installieren Sie dieses daher bitte zusammen mit Postfix selbst:

``` sh
zypper in postfix postfix-mysql
```

Richten Sie einige Postfix-Anweisungen ein:

``` sh
postconf -e virtual_mailbox_domains=mysql:/etc/postfix/mbxdom.cf
postconf -e virtual_mailbox_maps=mysql:/etc/postfix/mbxmaps.cf
postconf -e virtual_alias_maps=mysql:/etc/postfix/alias.cf,mysql:/etc/postfix/mbxmaps.cf
postconf -e virtual_transport="smtp:[localhost]:24"
```

Die Dateinamen für diese zusätzlichen Konfigurationsfragmente, `mbxdom.cf`, `mbxmaps.cf` und `alias.cf`, können frei gewählt werden. Fügen Sie die MariaDB-Parameter dem Alias-Auflösungsfragment hinzu, das (hier) in `/etc/postfix/alias.cf` eingefügt wird:

``` ini
user = grommunio
password = freddledgruntbuggly
hosts = localhost
dbname = grommunio
query = SELECT mainname FROM aliases WHERE aliasname='%s'
```

Fügen Sie anschließend die Verbindungsparameter für MariaDB in das Domänenauflösungsfragment ein, das (hier) in `/etc/postfix/mbxdom.cf` eingefügt wird:

``` ini
user = grommunio
password = freddledgruntbuggly
hosts = localhost
dbname = grommunio
query = SELECT 1 FROM domains WHERE domain_status=0 AND domainname='%s'
```

Fügen Sie außerdem die Parameter MariaDB zum Fragment für die Mailbox-Auflösung hinzu, hier in `/etc/postfix/mbxmaps.cf`:

``` ini
user = grommunio
password = freddledgruntbuggly
hosts = localhost
dbname = grommunio
query = SELECT username FROM users WHERE username='%s'
```

Wenn Sie beabsichtigen, `reject_authenticated_sender_login_mismatch` für die Übermittlung von SMTP zu verwenden, z. B. in der Postfix-Anweisung `smtpd_sender_restrictions` oder `smtpd_recipient_restrictions`, um sicherzustellen, dass der SASL-Anmeldename Eigentümer der E-Mail-Absenderadresse ist, legen Sie eine weitere Postfix-Anweisung fest:

``` sh
postconf -e smtpd_sender_login_maps=mysql:/etc/postfix/mbxmaps.cf,mysql:/etc/postfix/alias.cf
```

Aktivieren bzw. starten Sie abschließend die Dienste neu, damit sie ihre neuen Positionen einnehmen können:

``` sh
systemctl enable --now gromox-delivery gromox-delivery-queue postfix
systemctl restart gromox-delivery-queue postfix
```

## Sonstige Dienstleistungen

Dieses Kapitel befasst sich ausschließlich mit der Kernkomponente. Optionale Komponenten wie Chat, Meet, Files, Office und/oder Archive werden zu einem späteren Zeitpunkt in einem eigenen Kapitel behandelt.
