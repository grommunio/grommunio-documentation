---
title: "Update Cycle"
description: "RHEL (and its derivatives) actually release a lot more service packs over time, and the service packs' individual lifetime is also shorter:"
sidebar:
  order: 170
---

## RH vs SUSE

> “ *We do not want to update all that often, so we are choosing RHEL/CentOS/Alma/etc. \[in favor of SLE\]* ”

RHEL (and its derivatives) actually release a lot more service packs over time, and the service packs' individual lifetime is also shorter:

| SP            | Release    | Last repo change | Lifetime |
|---------------|------------|------------------|----------|
| AlmaLinux 8.4 | 2021-05-26 | 2021-11-22       | 181 days |
| AlmaLinux 8.5 | 2021-11-12 | 2022-09-28       | 320 days |
| AlmaLinux 8.6 | 2022-05-12 | 2022-11-03       | 176 days |
| AlmaLinux 9.0 | 2022-05-26 | 2022-11-03       | 162 days |

| SP       | Release    | End of Support | Lifetime |
|----------|------------|----------------|----------|
| SLE 15.1 | 2019-06-21 | 2021-01-31     | 591 days |
| SLE 15.2 | 2020-06-22 | 2021-12-31     | 558 days |
| SLE 15.3 | 2021-06-21 | 2022-12-31     | 559 days |

For admins with an aversion to periodic invocation of the updater, the update cadence is in favor of a SUSE-based distribution.

## Container images

The container images on `container.grommunio.com` follow the package
repositories. Community images are rebuilt daily from the current community
packages, so base OS updates and package fixes reach the images without a new
grommunio release. Each image carries three kinds of tags:

| Tag | Example | Meaning |
|-----|---------|---------|
| `<version>` | `2026.11` | Newest build of that release; moves with every rebuild |
| `<version>-<YYYYMMDDhhmm>` | `2026.11-202611170300` | One specific build; the last 14 builds of each image are kept |
| `latest` | `latest` | Newest build of the newest release |

Pin a build tag or a digest for reproducible deployments and move it forward
as part of your regular update cycle.

To update a **Docker Compose** deployment that builds the images locally, run
`git pull`, `docker compose build --pull` and `docker compose up -d`; with the
prebuilt images, run `docker compose pull` and `docker compose up -d`, see
[Container installation](/admin/container_core/#updating). A **Kubernetes**
deployment is updated with `helm upgrade` to a new chart version; each
component's pod is replaced when its image changes, and database schema
upgrades run on start, see [Kubernetes](/admin/kubernetes/#upgrades-and-rollbacks).
By default the chart uses the `<version>` tag with `pullPolicy: IfNotPresent`,
so a daily rebuild reaches the cluster only when you set
`image.<component>.tag` to a build tag or `image.<component>.digest` and run
`helm upgrade`.

Editions, tags and signature verification are described in
[Container registry](/admin/container_registry/).
