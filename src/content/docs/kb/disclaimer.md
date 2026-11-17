---
title: "Disclaimer"
description: "You might be required (by law) to add a readily visible disclaimers or imprint notices on webpages emitted by your web server."
---

You might be required (by law) to add a readily visible disclaimers or imprint notices on webpages emitted by your web server.

The grommunio-web login page can be extended to show some custom text in the page bottom by populating the `/etc/grommunio-web/disclaimer.html` file with the desired contents.

:::note
This currently does not work with grommunio-keycloak, as keycloak has its own login page.
:::

In the container images, `/etc/grommunio-web` is not on a volume. Mount the
file into gromox-core (Compose: an additional volume entry; Helm chart:
`core.extraVolumes` and `core.extraVolumeMounts`), otherwise it is lost when
the container is recreated.
