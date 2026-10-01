---
title: "Web-Admin"
description: "Diese Web-App nutzt Yarn und Caddy für die Entwicklung."
sidebar:
  order: 60
---

> Quelle: [admin-web](https://github.com/grommunio/admin-web) README.

## Einrichtung für die Entwicklung
 
Diese Web-App verwendet [yarn](https://yarnpkg.com/) und [caddy](https://caddyserver.com/) für die Entwicklung.
Sie benötigen zwei separate Terminals, um diese App auszuführen. Eines zum Ausführen von `yarn` und eines zum Einrichten eines `caddy` Reverse-Proxys für den Zugriff auf den Backend-Server.
Für die Erstellung der Produktionsversion verwendet diese Webanwendung ein `Makefile` mit [GNU Make](https://www.gnu.org/software/make/)

### Garn

#### Pakete installieren
```
yarn
```
oder
```
make
```

#### App ausführen
```
yarn start
```

### Caddy

#### Installation
Gemäß https://caddyserver.com/docs/install
```
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/cfg/gpg/gpg.155B6D79CA56EA34.key' | sudo apt-key add -
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/cfg/setup/config.deb.txt?distro=debian&version=any-version' | sudo tee -a /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```
#### Verwendung von Caddy

##### Caddyfile

Im Stammverzeichnis dieses Repositorys finden Sie eine Datei namens `Caddyfile.example`.
Kopieren Sie diese Datei nach `./Caddyfile`.

```
cp Caddyfile.example Caddyfile
```

Bei Verwendung eines grommunio-VM mit laufendem `grommunio-admin-api.service` sollte die Konfiguration sofort funktionieren.

Die Caddyfile enthält die folgenden erforderlichen Zeilen
```
:4000 # port to run caddy on
reverse_proxy /api/v1/* localhost:8080 # Address of backend
reverse_proxy /config.json localhost:8080 # Address of config.json
reverse_proxy http://127.0.0.1:3000 # Address of webapp (default yarn port)
```
- `:4000`: Gibt den Port an, auf dem der Caddyserver läuft und auf den Sie mit Ihrem Browser zugreifen können.
- `reverse_proxy /api/v1/* localhost:8080`: Gibt die Adresse an, an die HTTP-Anfragen an `/api/v1/*` weitergeleitet werden. Dies muss der Ort sein, an dem `grommunio-admin-api.service` ausgeführt wird.
- `reverse_proxy /config.json localhost:8080`: Gibt den Speicherort von `config.json` an.
- `reverse_proxy http://127.0.0.1:3000`: Gibt die Adresse an, unter der die Webanwendung mit Yarn ausgeführt wird. Standardmäßig läuft Yarn auf Port 3000, daher sollte dieser Wert nur geändert werden, wenn Änderungen an `./.env` vorgenommen werden.

Weitere Einzelheiten werden unter `Caddyfile.example` erläutert oder können unter https://caddyserver.com/docs/quick-starts/reverse-proxy nachgeschlagen werden.

#### Caddy ausführen
In einem separaten Terminal:

```
caddy run
```

Wenn eine Fehlermeldung mit `caddy administration endpoint: listen tcp 127.0.0.1:2019: bind: address already in use` erscheint, versuche Folgendes:
```
caddy stop && caddy run
```

#### Auf die Website zugreifen

Wenn Sie die oben genannten Schritte befolgt haben, sollten Sie nun in Ihrem Browser unter `localhost:4000` auf die laufende Webanwendung zugreifen können.

### Für die Produktion erstellen

#### `make && make dist`

Führen Sie diesen Befehl aus, um Dateien für die Verteilung zu erstellen.

Das Ergebnis wird in `/dist` erstellt.

## Serverseitige Konfiguration

Um die richtige Konfiguration für die Produktion zu erhalten, erstellen Sie ein `config.json` in
`/etc/grommunio-admin-common/config.json`.
Attribute, die in `config.json` manuell festgelegt werden, überschreiben die Standardwerte;
ansonsten werden die Standardwerte verwendet.

Folgende Attribute stehen zur Verfügung:

- `devMode:boolean` Aktiviert den Redux-Logger für die Entwicklung (Standard: `false`)

- `tokenRefreshInterval:int` Legt das Intervall für die Aktualisierung des Tokens in Sekunden fest. (Standard: `86400` (24 Std.))

- `defaultDarkMode:boolean` Wenn `true`, wird die App auf den Dunkelmodus umgestellt, sofern dies nicht ausdrücklich vom Benutzer oder Browser festgelegt wurde

- `defaultTheme:string` Name des zu verwendenden Standarddesigns. Verfügbare Designs: grommunio, grün, lila, magenta (Standard: „grommunio“)

- `loadAntispamData:boolean` Ob Antispam-Daten im Dashboard geladen werden sollen oder nicht (Standard: `true`)

- `rspamdWebAddress:String` URL des Produktionsservers rspamd (Standard: `''`)

- `mailWebAddress:String` URL des Produktions-Mail-Servers (Standard: `''`)

- `chatWebAddress:String` URL des Produktions-Chat-Servers (Standard: `''`)

- `videoWebAddress:String` URL des Produktionsvideoservers (Standard: `''`)

- `fileWebAddress:String` URL des Produktions-Dateiservers (Standard: `''`)

- `archiveWebAddress:String` URL des Produktionsarchivservers (Standard: `''`)

- `searchAttributes:Array<String>` Array von Zeichenfolgen, mögliche Suchattribute: LDAP

- `customImages:Object`: Mit diesem Objekt lässt sich die App als White-Label-Lösung gestalten. Dazu gehören Logos, Symbole und Hintergrundbilder.
Es ist möglich, separate Bildersätze für verschiedene Hostnamen zu erstellen.
Jeder Hostname ist der Schlüssel eines Objekts, das folgende Schlüssel enthält:
  <em> `logo`: Das Logo im Anmeldeformular</em>
  <em> `logoLight`: Das Logo im aufgeklappten Drawer</em>
  <em> `icon`: Das Symbol im zusammengeklappten Drawer</em>
  <em> `background`: Das Hintergrundbild im hellen Modus</em>
  <em> `backgroundDark`: Das Hintergrundbild im dunklen Modus</em>
  Jeder dieser Schlüssel muss eine URL zu einer Bilddatei sein.

  Ein Beispiel für ein `customImages`-Objekt sieht wie folgt aus:

  ```
  "customImages": {
    "localhost": {
      "logo": "url.to/logo.png",
      "logoLight": "url.to/light/logo.png",
      "icon": "url.to/light/icon.svg",
      "background": "url.to/background.svg",
      "backgroundDark": "url.to/dark/background.svg"
    },
    "example.com": {
      "logo": "anotherUrl.to/logo.png",
      "logoLight": "anotherUrl.to/light/logo.png",
      "icon": "anotherUrl.to/light/icon.svg"
    },
  }
  ```
Wie Sie sehen, ist es nicht notwendig, jedes Bild zu überschreiben, aber die Hostnamen müssen korrekt sein.

## Weitere Informationen

### Support

- Support wird von <strong>[grommunio GmbH](https://grommunio.com)</strong> und deren Partnern angeboten.
- Die grommunio Admin-Web-Community finden Sie hier: <strong>[grommunio Community](https://community.grommunio.com)</strong>

Für den direkten Kontakt zu den Betreuern (beispielsweise um Informationen zu einer sicherheitsrelevanten verantwortungsvollen Offenlegung zu übermitteln) können Sie sich direkt an grommunio unter [dev@grommunio.com](mailto:dev@grommunio.com) wenden.

### Mitwirken

Zunächst einmal vielen Dank, dass du dir die Zeit genommen hast, einen Beitrag zu leisten! Es sind gerade diese Beiträge, die die Open-Source-Community zu einem so großartigen Ort zum Lernen, zur Inspiration und zum Schaffen machen. Jeder Beitrag, den du leistest, kommt allen anderen zugute und wird sehr geschätzt.

Bitte lies dir [unsere Richtlinien für Beiträge](doc/CONTRIBUTING.md) durch und vielen Dank für dein Engagement!

### Sicherheit

grommunio Admin Web befolgt bewährte Sicherheitspraktiken. grommunio überwacht kontinuierlich sicherheitsrelevante Probleme.
grommunio Admin Web wird „wie besehen“ ohne jegliche Gewährleistung bereitgestellt. Informationen zu professionellen Support-Optionen im Rahmen von Abonnements finden Sie unter [grommunio](https://grommunio.com).

_Weitere Informationen sowie Hinweise zur Meldung von Sicherheitsproblemen finden Sie in unserer [Sicherheitsdokumentation](doc/SECURITY.md)._

### Programmierstil

Dieses Repository folgt einem Programmierstil, der sich lose am PEP8-Standard orientiert (Ausnahme: maximale Zeilenlänge von 127).

### Lizenz

Dieses Projekt unterliegt der <strong>GNU Affero General Public License v3</strong>.

Weitere Informationen finden Sie unter [LICENSE](LICENSE.txt).
