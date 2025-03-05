..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later

Cleaner
=======

Empty Trashbin
--------------

To automatically empty the trashbin of all mailboxes you can extend the
``gromox-cleaner.service`` with the following override:

.. code-block::

        # /etc/systemd/system/gromox-cleaner.service.d/override.conf
        [Service]
        Environment=softdelete_purgetime=30d trashbin_purgetime=7d
        EnvironmentFile=
        EnvironmentFile=-/etc/gromox/gromox.cfg
        ExecStart=
        ExecStart=/usr/sbin/gromox-mbop foreach.here.mb ( purge-softdelete -t ${softdelete_purgetime} -r / ) ( purge-datafiles ) ( emptyfld -R --delempty -t ${trashbin_purgetime} DELETED )
