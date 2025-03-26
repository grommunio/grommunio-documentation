..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later

Mailbox maintenance
===================

Periodic clearing of Trash folder
---------------------------------

To automatically empty the trash folder (a.k.a. wastebasket) of all
mailboxes, you can extend the cleaner service unit with the
following override (``systemctl edit gromox-cleaner.service``):

.. code-block::

        # /etc/systemd/system/gromox-cleaner.service.d/override.conf
        [Service]
        Environment=softdelete_purgetime=30d trashbin_purgetime=7d
        EnvironmentFile=
        EnvironmentFile=-/etc/gromox/gromox.cfg
        ExecStart=
        ExecStart=/usr/sbin/gromox-mbop foreach.here.mb ( purge-softdelete -t ${softdelete_purgetime} -r / ) ( purge-datafiles ) ( emptyfld -R --delempty -t ${trashbin_purgetime} DELETED )
