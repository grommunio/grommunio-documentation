---
title: Container-Registry
description: Container-Images und Helm-Chart von container.grommunio.com beziehen, prüfen und spiegeln. Behandelt Editionen, Tags, Zugangsdaten, cosign-Signaturen und das Erstellen eigener Images.
sidebar:
  order: 52
---

grommunio veröffentlicht seine Container-Images und das Helm-Chart unter
`https://container.grommunio.com`. Die Images werden von der
[Docker-Compose-Bereitstellung](/admin/container_core/) und vom
[Helm-Chart für Kubernetes](/admin/kubernetes/) verwendet; die Build-Dateien liegen im
Repository [gromox-container](https://github.com/grommunio/gromox-container).

## Projekte und Editionen

Die Registry enthält ein Projekt pro Edition:

| Pfad | Zugriff | Inhalt |
| --- | --- | --- |
| `community/gromox-core`, `community/gromox-archive`, `community/gromox-office` | öffentlich, anonymer Pull | aus den grommunio-Community-Paketen erstellt |
| `supported/gromox-core`, `supported/gromox-archive`, `supported/gromox-office` | Kunden mit grommunio-Subskription | aus den grommunio-Supported-Paketen erstellt |
| `community/mariadb` | öffentlich, anonymer Pull | offizielles `docker.io/library/mariadb:11.8` mit aktuellen Sicherheitsupdates, täglich neu gebaut, wird vom Helm-Chart verwendet |
| `community/charts/grommunio` | öffentlich, anonymer Pull | Helm-Chart (OCI-Artefakt) |

Die drei Images sind:

| Image | Inhalt |
| --- | --- |
| `gromox-core` | Groupware-Kern: Gromox, Postfix, nginx, Admin API, Antispam, Chat |
| `gromox-archive` | grommunio Archive (optional) |
| `gromox-office` | Dokumentbearbeitung und grommunio Files (optional) |

Beide Editionen verwenden dasselbe Datenformat. Eine Installation lässt sich
zwischen ihnen wechseln, indem Sie den Image-Pfad ändern, zum Beispiel mit einem
`helm upgrade`, das `global.edition` setzt.

## Tags und Aufbewahrung

Jedes Image trägt drei Arten von Tags:

| Tag | Beispiel | Bedeutung |
| --- | --- | --- |
| `<version>` | `2026.11` | neuester Build dieses Releases; wandert mit jedem neuen Build mit |
| `<version>-<YYYYMMDDhhmm>` | `2026.11-202611170300` | ein bestimmter Build; ändert sich nie |
| `latest` | `latest` | neuester Build des neuesten Releases |

Die Community-Images werden täglich aus den aktuellen Paketen neu erstellt. Der
Tag `<version>` erhält dadurch Paketkorrekturen und Updates des Basisbetriebssystems,
ohne dass ein neues grommunio-Release nötig ist. Die Registry bewahrt die letzten
14 Builds jedes Images auf; ältere Build-Tags werden entfernt.

Für reproduzierbare Bereitstellungen fixieren Sie einen Build-Tag oder den Digest.
Die verfügbaren Tags listen Sie mit `skopeo` auf, ebenso lesen Sie damit den Digest
eines Tags aus:

```bash
skopeo list-tags docker://container.grommunio.com/community/gromox-core
skopeo inspect --format '{{.Digest}}' \
  docker://container.grommunio.com/community/gromox-core:2026.11
```

Die Tag-Liste enthält auch die Signatur-Tags (`sha256-<digest>.sig`).

Im Helm-Chart setzen Sie den Digest je Komponente in `image.<component>.digest`
(`core`, `archive`, `office`, `mariadb`).

:::caution[Fixierte Builds sichern]
Ein Build, der älter als die letzten 14 Builds ist, wird aus der Registry gelöscht.
Wenn Sie einen Build länger fixieren, [spiegeln Sie ihn](#spiegeln-in-eine-eigene-registry)
in Ihre eigene Registry.
:::

## Images beziehen

### Community-Edition

Für das Community-Projekt ist keine Anmeldung nötig:

```bash
docker pull container.grommunio.com/community/gromox-core:2026.11
podman pull container.grommunio.com/community/gromox-core:2026.11
```

Das Helm-Chart wird direkt aus der Registry installiert:

```bash
helm install grommunio oci://container.grommunio.com/community/charts/grommunio \
  --version 0.2.0 -n grommunio --create-namespace -f values.yaml
```

Standardmäßig bezieht das Chart die Community-Images (`global.edition: community`).

Die `docker-compose.yml` des Repositorys gromox-container erstellt die Images
lokal. Um stattdessen die veröffentlichten Images mit Docker Compose zu betreiben,
ersetzen Sie den Abschnitt `build:` von `gromox-core`, `gromox-archive` und
`gromox-office` jeweils durch eine `image:`-Zeile, zum Beispiel
`image: container.grommunio.com/community/gromox-core:2026.11`. Die Schritte sind
unter [Container-Installation](/admin/container_core/) beschrieben.

### Supported-Edition

Für das Projekt `supported/` verwenden Sie die Zugangsdaten Ihrer
grommunio-Subskription, also denselben Benutzernamen und dasselbe Passwort wie
für die Supported-Paketquellen. Der Zugriff ist rein lesend (Pull) und endet mit
der Subskription.

Melden Sie sich einmal pro Host an und beziehen Sie dann die Images:

```bash
docker login container.grommunio.com -u '<subscription user>'
docker pull container.grommunio.com/supported/gromox-core:2026.11
```

Mit Podman verwenden Sie `podman login` auf dieselbe Weise.

### Pull-Secret für Kubernetes

Für die Supported-Edition legen Sie im Namespace des Releases ein Pull-Secret an
und referenzieren es in den Chart-Values:

```bash
kubectl -n grommunio create secret docker-registry grommunio-registry \
  --docker-server=container.grommunio.com \
  --docker-username='<subscription user>' \
  --docker-password='<password>'
```

```yaml
global:
  edition: supported
  imagePullSecrets: [grommunio-registry]
```

Alternativ übergeben Sie die Zugangsdaten in den Values; das Chart legt dann
selbst ein Pull-Secret an (`grommunio-registry` für ein Release namens
`grommunio`) und verwendet es in jedem Pod:

```yaml
global:
  edition: supported
  imageCredentials:
    username: <subscription user>
    password: "<password>"
```

:::note
Mit `global.imageCredentials` wird das Passwort im Helm-Release gespeichert.
Ein selbst angelegtes Secret, das Sie in `global.imagePullSecrets` angeben, hält
es aus dem Release heraus.
:::

Das Chart selbst und das MariaDB-Image bleiben für beide Editionen im
öffentlichen Projekt `community/`.

## Signaturprüfung

Alle Images, das MariaDB-Image und das Helm-Chart sind mit
[cosign](https://docs.sigstore.dev/cosign/) signiert. Die Registry liefert keine
unsignierten Images aus. Die Signaturen werden zusätzlich im öffentlichen
Sigstore-Transparenzprotokoll (Rekor) erfasst.

Der öffentliche Schlüssel ist die Datei `cosign.pub` im Wurzelverzeichnis des
Repositorys [gromox-container](https://github.com/grommunio/gromox-container):

```text
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEgVmJ7UPppHd0JpNzhWZk8Y2yeagj
dJIyBt0y5fsgPlwa/cigyGO4F3OZYIP9hhXBMtfPPGstrtyMlJmzoP7HmA==
-----END PUBLIC KEY-----
```

| Eigenschaft | Wert |
| --- | --- |
| Algorithmus | ECDSA P-256 |
| SHA-256-Fingerabdruck (DER) | `fbc44512234982ede455c69a7386db363bde9c73975016bbbc0794a3515c590f` |

Vergleichen Sie den Fingerabdruck Ihrer Kopie des Schlüssels, bevor Sie sich
darauf verlassen:

```bash
openssl pkey -pubin -in cosign.pub -outform DER | sha256sum
```

Ein Image oder das Chart prüfen Sie so (cosign 2.x oder 3.x):

```bash
cosign verify --key cosign.pub container.grommunio.com/community/gromox-core:2026.11
cosign verify --key cosign.pub container.grommunio.com/community/mariadb:11.8
cosign verify --key cosign.pub container.grommunio.com/community/charts/grommunio:0.2.0
```

Für die Supported-Edition melden Sie sich zuerst mit `docker login` an; cosign
verwendet dieselben Zugangsdaten.

### Signaturen in Kubernetes erzwingen

Admission-Controller wie [Kyverno](https://kyverno.io/) (`ImageValidatingPolicy`)
oder der [Sigstore policy-controller](https://docs.sigstore.dev/policy-controller/overview/)
können Pods ablehnen, deren Images nicht mit dem grommunio-Schlüssel signiert sind.
Eine minimale Kyverno-Policy (Kyverno 1.17 oder neuer):

```yaml
apiVersion: policies.kyverno.io/v1
kind: ImageValidatingPolicy
metadata:
  name: verify-grommunio-images
spec:
  validationActions: [Deny]
  failurePolicy: Fail
  webhookConfiguration:
    timeoutSeconds: 30
  matchConstraints:
    resourceRules:
      - apiGroups: [""]
        apiVersions: [v1]
        operations: [CREATE, UPDATE]
        resources: [pods]
  matchImageReferences:
    - glob: "container.grommunio.com/*"
  attestors:
    - name: grommunio
      cosign:
        key:
          data: |
            -----BEGIN PUBLIC KEY-----
            MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEgVmJ7UPppHd0JpNzhWZk8Y2yeagj
            dJIyBt0y5fsgPlwa/cigyGO4F3OZYIP9hhXBMtfPPGstrtyMlJmzoP7HmA==
            -----END PUBLIC KEY-----
  validations:
    - expression: >-
        images.containers.map(image, verifyImageSignatures(image, [attestors.grommunio])).all(e, e > 0)
      message: image is not signed with the grommunio key
```

Die Policy prüft nur Images, die zu `matchImageReferences` passen; Images aus
anderen Registrys werden ungeprüft zugelassen. Kyverno wendet die Policy auch auf
Pod-Controller wie Deployments, StatefulSets, Jobs und CronJobs an und ergänzt
jede zugelassene Image-Referenz um den geprüften Digest
(`container.grommunio.com/community/gromox-core:2026.11@sha256:...`).
Kyverno-Versionen vor 1.17 verwenden stattdessen das Format `ClusterPolicy` mit
`verifyImages`, das Kyverno 1.20 nicht mehr akzeptiert.
Hinweise für bestimmte Umgebungen:

- **Supported-Edition:** Kyverno benötigt Zugangsdaten, um die Signaturen zu
  lesen. Legen Sie das Pull-Secret zusätzlich im Kyverno-Namespace an und tragen
  Sie es in der Policy unter `spec.credentials.secrets` ein.
- **Eigene Registry:** Stammen die Images aus einem [Spiegel](#spiegeln-in-eine-eigene-registry),
  ändern Sie `matchImageReferences` auf den Pfad des Spiegels, zum Beispiel
  `registry.example.com/*`.

## Schwachstellenscan

Jedes Image wird nach dem Hochladen in die Registry auf bekannte Schwachstellen
geprüft. Korrekturen im Basisbetriebssystem und in den grommunio-Paketen gelangen
über den täglichen Neubau in die Community-Images. Folgen Sie dem Tag `<version>`
oder aktualisieren Sie Ihre Digest-Fixierung regelmäßig, um sie zu erhalten.

## Spiegeln in eine eigene Registry

Umgebungen ohne Internetzugang (Air-Gap) und Installationen, die Builds länger als
die Aufbewahrungsfrist benötigen, kopieren die Images in ihre eigene Registry.
Behalten Sie den Pfad unterhalb des Registry-Hosts bei (`community/...` oder
`supported/...`), damit das Helm-Chart die Images findet, wenn nur
`global.imageRegistry` geändert wird.

Kopieren Sie die Images mit `skopeo` (`--all` kopiert die vollständige
Manifest-Liste) und anschließend ihre Signaturen mit `cosign`:

```bash
SRC=container.grommunio.com
DST=registry.example.com
for img in community/gromox-core community/gromox-archive community/gromox-office; do
  skopeo copy --all docker://$SRC/$img:2026.11 docker://$DST/$img:2026.11
  cosign copy --only=sig $SRC/$img:2026.11 $DST/$img:2026.11
done
skopeo copy --all docker://$SRC/community/mariadb:11.8 docker://$DST/community/mariadb:11.8
cosign copy --only=sig $SRC/community/mariadb:11.8 $DST/community/mariadb:11.8
```

Für die Supported-Edition verwenden Sie die Pfade unter `supported/` und melden
sich zuvor an beiden Registrys an (`skopeo login`, `docker login`).

`cosign copy` ohne `--only` kopiert ein Artefakt zusammen mit seiner Signatur in
einem Schritt; verwenden Sie es für das Helm-Chart:

```bash
cosign copy $SRC/community/charts/grommunio:0.2.0 $DST/community/charts/grommunio:0.2.0
```

Richten Sie das Chart anschließend auf den Spiegel aus und prüfen Sie ein
kopiertes Image gegen den grommunio-Schlüssel:

```yaml
global:
  imageRegistry: registry.example.com
```

```bash
cosign verify --key cosign.pub registry.example.com/community/gromox-core:2026.11
helm install grommunio oci://registry.example.com/community/charts/grommunio \
  --version 0.2.0 -n grommunio --create-namespace -f values.yaml
```

## Eigene Images erstellen

Das Skript `tools/publish-images.sh` im Repository gromox-container erstellt die
drei Images für eine Edition und überträgt sie in eine Registry Ihrer Wahl. Jedes
Image wird unter seinem Build-Tag hochgeladen, per Digest signiert und erst danach
mit `<version>` getaggt (mit `--latest` zusätzlich mit `latest`). So zeigen die
beweglichen Tags nie auf ein unsigniertes Image.

| Option | Wirkung | Standard |
| --- | --- | --- |
| `-c community\|supported` | Edition (Paketkanal) | `community` |
| `-r REGISTRY` | Ziel-Registry | `container.grommunio.com` |
| `-t TAG` | Versions-Tag | `appVersion` des Helm-Charts |
| `-b BUILD_ID` | Suffix des Build-Tags | UTC-Datum und -Uhrzeit (`YYYYMMDDhhmm`) |
| `--latest` | zusätzlich `latest` taggen | aus |
| `-n` | nur erstellen, nicht hochladen | aus |
| `--no-sign` | ohne Signatur hochladen | aus |
| `--no-cache` | jede Schicht neu erstellen, sodass aktualisierte Pakete auch dann installiert werden, wenn sich die Dockerfiles nicht geändert haben | aus |
| `core archive office` | zu erstellende Komponenten | alle drei |

Die Images heißen `<REGISTRY>/<edition>/gromox-<component>`. Melden Sie sich an
der Ziel-Registry mit einem Konto an, das Images hochladen darf, und erstellen,
signieren und übertragen Sie die Images dann mit Ihrem eigenen cosign-Schlüssel;
der grommunio-Signaturschlüssel ist nicht Teil des Repositorys. Führen Sie die
Befehle im Wurzelverzeichnis des Repositorys gromox-container aus:

```bash
cosign generate-key-pair
COSIGN_KEY=cosign.key COSIGN_PASSWORD='<key password>' \
  tools/publish-images.sh -r registry.example.com -c community core archive office
```

Ohne `COSIGN_KEY` wird das Hochladen verweigert, sofern nicht `--no-sign`
angegeben ist. `COSIGN_KEY` akzeptiert auch eine KMS-URI. Einen Build ohne
Hochladen testen Sie so:

```bash
tools/publish-images.sh -n -c community
```

Für Supported-Builds benötigen Sie Ihre grommunio-Subskriptionszugangsdaten im
Credentials-Format von zypper. Die Datei wird dem Build als BuildKit-Secret
übergeben und in keiner Image-Schicht gespeichert:

```bash
printf 'username=%s\npassword=%s\n' '<subscription user>' '<subscription password>' \
  > supported.credentials
SUPPORTED_CREDENTIALS=$PWD/supported.credentials COSIGN_KEY=cosign.key \
  COSIGN_PASSWORD='<key password>' \
  tools/publish-images.sh -r registry.example.com -c supported
```

Auf diese Weise erstellte Images sind mit Ihrem Schlüssel signiert: Prüfen und
erzwingen Sie sie mit Ihrer `cosign.pub`, nicht mit dem grommunio-Schlüssel.
