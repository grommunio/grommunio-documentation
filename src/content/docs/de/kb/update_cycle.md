---
title: "Aktualisierungszyklus"
description: "Für RHEL (und seine Derivate) werden im Laufe der Zeit tatsächlich deutlich mehr Service Packs veröffentlicht, und auch die Lebensdauer der einzelnen Service Packs ist kürzer:"
sidebar:
  order: 170
---

## RH vs. SUSE

> „ *Wir möchten nicht allzu oft Updates durchführen, daher entscheiden wir uns für RHEL/CentOS/Alma/etc. \[anstelle von SLE\]* “

Für RHEL (und seine Derivate) werden im Laufe der Zeit tatsächlich deutlich mehr Service Packs veröffentlicht, und auch die Lebensdauer der einzelnen Service Packs ist kürzer:

| SP | Veröffentlichung    | Letzte Repo-Änderung | Gesamtdauer |
|---------------|------------|------------------|----------|
| AlmaLinux 8.4 | 26.05.2021 | 22.11.2021 | 181 Tage |
| AlmaLinux 8.5 | 12.11.2021 | 28.09.2024 | 320 Tage |
| AlmaLinux 8.6 | 12.05.2024 | 03.11.2024 | 176 Tage |
| AlmaLinux 9.0 | 26.05.2024 | 03.11.2024 | 162 Tage |

| SP | Veröffentlichung    | Ende des Supports | Laufzeit |
|----------|------------|----------------|----------|
| SLE 15.1 | 21.06.2019 | 31.01.2021     | 591 Tage |
| SLE 15.2 | 22.06.2020 | 31.12.2021     | 558 Tage |
| SLE 15.3 | 21.06.2021 | 31.12.2024     | 559 Tage |

Für Administratoren, die den regelmäßigen Aufruf des Updaters scheuen, spricht die Aktualisierungshäufigkeit für eine SUSE-basierte Distribution.

## Container-Images

Die Container-Images auf `container.grommunio.com` folgen den Paket-Repositorys.
Community-Images werden täglich aus den aktuellen Community-Paketen neu gebaut,
sodass Updates des Basisbetriebssystems und Paketkorrekturen auch ohne neues
grommunio-Release in die Images gelangen. Jedes Image trägt drei Arten von Tags:

| Tag | Beispiel | Bedeutung |
|-----|---------|---------|
| `<version>` | `2026.11` | Neuester Build dieses Releases; wird mit jedem Neubau weitergezogen |
| `<version>-<YYYYMMDDhhmm>` | `2026.11-202611170300` | Ein bestimmter Build; die letzten 14 Builds jedes Images werden aufbewahrt |
| `latest` | `latest` | Neuester Build des neuesten Releases |

Für reproduzierbare Bereitstellungen sollten Sie einen Build-Tag oder einen Digest
festlegen und diesen im Rahmen Ihres regulären Aktualisierungszyklus weiterziehen.

Um eine **Docker-Compose**-Bereitstellung zu aktualisieren, die die Images lokal
baut, führen Sie `git pull`, `docker compose build --pull` und `docker compose up -d`
aus; mit den vorgefertigten Images führen Sie `docker compose pull` und
`docker compose up -d` aus, siehe [Container-Installation](/admin/container_core/#updating).
Eine **Kubernetes**-Bereitstellung wird mit `helm upgrade` auf eine neue Chart-Version
aktualisiert; der Pod einer Komponente wird ersetzt, sobald sich ihr Image ändert,
und Upgrades des Datenbankschemas laufen beim Start, siehe
[Kubernetes](/admin/kubernetes/#upgrades-and-rollbacks). Standardmäßig verwendet das
Chart den Tag `<version>` mit `pullPolicy: IfNotPresent`. Ein täglicher Neubau
erreicht den Cluster daher erst, wenn Sie `image.<component>.tag` auf einen Build-Tag
oder `image.<component>.digest` setzen und `helm upgrade` ausführen.

Editionen, Tags und Signaturprüfung sind unter
[Container-Registry](/admin/container_registry/) beschrieben.
