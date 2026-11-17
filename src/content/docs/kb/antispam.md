---
title: "Antispam"
description: "If you have forgotten the initial password or just want to set a new password you can do that with the following commands:"
sidebar:
  order: 10
---

This article only covers resetting the password of the Rspamd web interface. Understanding scores and actions, testing, Bayes training, allow/deny lists and day-to-day operation of grommunio-antispam are described in the [Antispam guide](/guides/antispam/).

## Reset the password

If you have forgotten the initial password or just want to set a new password you can do that with the following commands:

```bash
PASSWORD="YourNewPassword"
NEWPASS=$(printf 'password = "%s";\n' $(rspamadm pw -p "${PASSWORD}"))
sed -i -n -e '/^password/!p;$a \'"$NEWPASS" /etc/grommunio-antispam/local.d/worker-controller.inc
```

:::note[Containers]
The container images rewrite this file from `ADMIN_PASS` on every start, so
manual changes are lost. Change `ADMIN_PASS` instead, see
[Container installation](/admin/container_core/#changing-the-configuration) or
[Kubernetes](/admin/kubernetes/#changing-passwords).
:::
