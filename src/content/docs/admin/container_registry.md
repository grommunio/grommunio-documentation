---
title: Container registry
description: Pull, verify and mirror the grommunio container images and the Helm chart from container.grommunio.com. Covers editions, tags, pull credentials, cosign signatures and building your own images.
sidebar:
  order: 52
---

grommunio publishes its container images and the Helm chart on
`https://container.grommunio.com`. The images are used by the
[Docker Compose deployment](/admin/container_core/) and by the
[Helm chart for Kubernetes](/admin/kubernetes/); the build files are in the
[gromox-container](https://github.com/grommunio/gromox-container) repository.

## Projects and editions

The registry has one project per edition:

| Path | Access | Content |
| --- | --- | --- |
| `community/gromox-core`, `community/gromox-archive`, `community/gromox-office` | public, anonymous pull | built from the grommunio community packages |
| `supported/gromox-core`, `supported/gromox-archive`, `supported/gromox-office` | grommunio subscription customers | built from the grommunio supported packages |
| `community/mariadb` | public, anonymous pull | mirror of `docker.io/library/mariadb:11.8`, used by the Helm chart |
| `community/charts/grommunio` | public, anonymous pull | Helm chart (OCI artifact) |

The three images are:

| Image | Content |
| --- | --- |
| `gromox-core` | groupware core: Gromox, Postfix, nginx, Admin API, antispam, chat |
| `gromox-archive` | grommunio Archive (optional) |
| `gromox-office` | document editing and grommunio Files (optional) |

Both editions use the same data format. An installation can be switched
between them by changing the image path, for example with a `helm upgrade`
that sets `global.edition`.

## Tags and retention

Every image carries three kinds of tags:

| Tag | Example | Meaning |
| --- | --- | --- |
| `<version>` | `2026.11` | newest build of that release; moves to each new build |
| `<version>-<YYYYMMDDhhmm>` | `2026.11-202611170300` | one specific build; never moves |
| `latest` | `latest` | newest build of the newest release |

Community images are rebuilt daily from the current packages, so the
`<version>` tag picks up package fixes and base OS updates without a new
grommunio release. The registry keeps the last 14 builds of each image; older
build tags are removed.

For reproducible deployments pin a build tag or the digest. List the
available tags and read the digest of a tag with `skopeo`:

```bash
skopeo list-tags docker://container.grommunio.com/community/gromox-core
skopeo inspect --format '{{.Digest}}' \
  docker://container.grommunio.com/community/gromox-core:2026.11
```

The tag list also contains the signature tags (`sha256-<digest>.sig`).

In the Helm chart, set the digest per component in `image.<component>.digest`
(`core`, `archive`, `office`, `mariadb`).

:::caution[Keep a copy of pinned builds]
A build that is older than the last 14 builds is deleted from the registry.
If you pin a build for longer, [mirror it](#mirroring-into-your-own-registry)
into your own registry.
:::

## Pulling images

### Community edition

The community project needs no login:

```bash
docker pull container.grommunio.com/community/gromox-core:2026.11
podman pull container.grommunio.com/community/gromox-core:2026.11
```

The Helm chart is installed directly from the registry:

```bash
helm install grommunio oci://container.grommunio.com/community/charts/grommunio \
  --version 0.2.0 -n grommunio --create-namespace -f values.yaml
```

The chart pulls the community images by default (`global.edition: community`).

The `docker-compose.yml` of the gromox-container repository builds the images
locally. To run the published images with Docker Compose instead, replace the
`build:` section of `gromox-core`, `gromox-archive` and `gromox-office` with an
`image:` line, for example
`image: container.grommunio.com/community/gromox-core:2026.11`. The steps are
described in [Container installation](/admin/container_core/).

### Supported edition

The `supported/` project uses the credentials of your grommunio
subscription, the same user name and password as for the supported package
repositories. Access is read-only (pull) and ends with the subscription.

Log in once per host, then pull:

```bash
docker login container.grommunio.com -u '<subscription user>'
docker pull container.grommunio.com/supported/gromox-core:2026.11
```

With Podman use `podman login` the same way.

### Kubernetes pull secret

For the supported edition, create a pull secret in the namespace of the
release and reference it in the chart values:

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

Alternatively, pass the credentials in the values; the chart then creates a
pull secret itself (`grommunio-registry` for a release named `grommunio`) and
uses it in every pod:

```yaml
global:
  edition: supported
  imageCredentials:
    username: <subscription user>
    password: "<password>"
```

:::note
With `global.imageCredentials` the password is stored in the Helm release.
A secret you create yourself and list in `global.imagePullSecrets` keeps it
out of the release.
:::

The chart itself and the MariaDB mirror stay in the public `community/`
project for both editions.

## Signature verification

All images, the MariaDB mirror and the Helm chart are signed with
[cosign](https://docs.sigstore.dev/cosign/). The registry refuses to serve
unsigned images. Signatures are also recorded in the public Sigstore
transparency log (Rekor).

The public key is the file `cosign.pub` in the root of the
[gromox-container](https://github.com/grommunio/gromox-container) repository:

```text
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEgVmJ7UPppHd0JpNzhWZk8Y2yeagj
dJIyBt0y5fsgPlwa/cigyGO4F3OZYIP9hhXBMtfPPGstrtyMlJmzoP7HmA==
-----END PUBLIC KEY-----
```

| Property | Value |
| --- | --- |
| Algorithm | ECDSA P-256 |
| SHA-256 fingerprint (DER) | `fbc44512234982ede455c69a7386db363bde9c73975016bbbc0794a3515c590f` |

Compare the fingerprint of your copy of the key before you rely on it:

```bash
openssl pkey -pubin -in cosign.pub -outform DER | sha256sum
```

Verify an image or the chart (cosign 2.x or 3.x):

```bash
cosign verify --key cosign.pub container.grommunio.com/community/gromox-core:2026.11
cosign verify --key cosign.pub container.grommunio.com/community/mariadb:11.8
cosign verify --key cosign.pub container.grommunio.com/community/charts/grommunio:0.2.0
```

For the supported edition, log in with `docker login` first; cosign uses the
same credentials.

### Enforcing signatures in Kubernetes

Admission controllers such as [Kyverno](https://kyverno.io/) (`ImageValidatingPolicy`)
or the [Sigstore policy-controller](https://docs.sigstore.dev/policy-controller/overview/)
can reject pods whose images are not signed with the grommunio key. A minimal
Kyverno policy (Kyverno 1.17 or later):

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

The policy checks only images that match `matchImageReferences`; images from
other registries are admitted unchecked. Kyverno also applies the policy to
pod controllers such as Deployments, StatefulSets, Jobs and CronJobs, and adds
the verified digest to
each admitted image reference
(`container.grommunio.com/community/gromox-core:2026.11@sha256:...`).
Kyverno releases before 1.17 use the `ClusterPolicy` format with
`verifyImages` instead, which Kyverno 1.20 no longer accepts.
Notes for specific setups:

- **Supported edition:** Kyverno needs pull credentials to read the
  signatures. Create the pull secret also in the Kyverno namespace and list it
  under `spec.credentials.secrets` of the policy.
- **Own registry:** if the images come from a [mirror](#mirroring-into-your-own-registry),
  change `matchImageReferences` to the mirror path, for example
  `registry.example.com/*`.

## Vulnerability scanning

Every image is scanned for known vulnerabilities after it is uploaded to the
registry. Fixes in the base OS and in the grommunio packages reach the
community images through the daily rebuild; follow the `<version>` tag or
move your digest pin regularly to receive them.

## Mirroring into your own registry

Air-gapped sites and sites that need builds for longer than the retention
period copy the images into their own registry. Keep the path below the
registry host (`community/...` or `supported/...`) so that the Helm chart finds
the images with only `global.imageRegistry` changed.

Copy the images with `skopeo` (`--all` copies the complete manifest list), then copy their
signatures with `cosign`:

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

For the supported edition use the `supported/` paths and log in to both
registries first (`skopeo login`, `docker login`).

`cosign copy` without `--only` copies an artifact together with its
signature in one step; use it for the Helm chart:

```bash
cosign copy $SRC/community/charts/grommunio:0.2.0 $DST/community/charts/grommunio:0.2.0
```

Then point the chart at the mirror and verify a copied image against the
grommunio key:

```yaml
global:
  imageRegistry: registry.example.com
```

```bash
cosign verify --key cosign.pub registry.example.com/community/gromox-core:2026.11
helm install grommunio oci://registry.example.com/community/charts/grommunio \
  --version 0.2.0 -n grommunio --create-namespace -f values.yaml
```

## Building your own images

The script `tools/publish-images.sh` in the gromox-container repository
builds the three images for one edition and pushes them to a registry of your
choice. Each image is pushed under its build tag, signed by digest, and only
then tagged `<version>` (and `latest` with `--latest`), so the moving tags
never point at an unsigned image.

| Option | Effect | Default |
| --- | --- | --- |
| `-c community\|supported` | edition (package channel) | `community` |
| `-r REGISTRY` | target registry | `container.grommunio.com` |
| `-t TAG` | version tag | `appVersion` of the Helm chart |
| `-b BUILD_ID` | suffix of the build tag | UTC date and time (`YYYYMMDDhhmm`) |
| `--latest` | also tag `latest` | off |
| `-n` | build only, do not push | off |
| `--no-sign` | push without signing | off |
| `--no-cache` | rebuild every layer, so updated packages are installed even if the Dockerfiles did not change | off |
| `core archive office` | components to build | all three |

Images are named `<REGISTRY>/<edition>/gromox-<component>`. Log in to the
target registry with an account that can push, then build, sign and push with
your own cosign key; the grommunio signing key is not part of the repository.
Run the commands in the root of the gromox-container repository:

```bash
cosign generate-key-pair
COSIGN_KEY=cosign.key COSIGN_PASSWORD='<key password>' \
  tools/publish-images.sh -r registry.example.com -c community core archive office
```

Pushing without `COSIGN_KEY` is refused unless `--no-sign` is given.
`COSIGN_KEY` also accepts a KMS URI. To test a build without pushing:

```bash
tools/publish-images.sh -n -c community
```

Supported builds need your grommunio subscription credentials in zypper
credentials format. The file is passed to the build as a BuildKit secret and
is not stored in any image layer:

```bash
printf 'username=%s\npassword=%s\n' '<subscription user>' '<subscription password>' \
  > supported.credentials
SUPPORTED_CREDENTIALS=$PWD/supported.credentials COSIGN_KEY=cosign.key \
  COSIGN_PASSWORD='<key password>' \
  tools/publish-images.sh -r registry.example.com -c supported
```

Images built this way are signed with your key: verify and enforce them with
your `cosign.pub`, not with the grommunio key.
