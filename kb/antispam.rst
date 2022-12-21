..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later

Grommunio-Antispam
==================

Reset the Password
------------------

If you have forgotten the initial Password or just want to set a new Password 
you can do that with the following commands:

.. code-block::

	 PASSWORD="YourNewPassword"
	NEWPASS=$(printf 'password = "%s";\n' $(rspamadm pw -p "${PASSWORD})")
	sed -i -n -e '/^password/!p;$a \'"$NEWPASS/" /etc/grommunio-antispam/local.d/worker-controller.inc
