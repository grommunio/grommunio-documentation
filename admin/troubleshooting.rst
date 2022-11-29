..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2022 grommunio GmbH

###############
Troubleshooting
###############

Support package
===============

Subscription customers can generate a support package by executing the command
``grommunio-support`` and send the created support package to grommunio's
support for analysis to `support@grommunio.com
<mailto:support@grommunio.com?subject=%5Bgrommunio%5D%20support%20request%3A%20TOPIC&body=License%3A%0D%0A%0D%0ASteps%20to%20reproduce%3A%0D%0A%0D%0AActual%20result%3A%0D%0A%0D%0AExpected%20result%3A%0D%0A%0D%0A---%0D%0A%0D%0AIf%20supplied%20with%20grommunio-support%20archive%20the%20following%20information%20is%20optional%3A%0D%0A%0D%0AEnvironment%20(Platform%2FOS)%3A%0D%0A%0D%0Agrommunio%20version%3A%0D%0A%0D%0AComponent%20(if%20known)%3A%0D%0A%0D%0ALogs%20(if%20applicable)%3A%0D%0A%0D%0A---%0D%0A%0D%0ACustom%20notes%3A%0D%0A%0D%0A---%0D%0A%0D%0AContact%20information%3A>`_.

The archive generated is made available under the web root of grommunio admin
archive, which is why it is stongly recommended to remove the generated support
archive as soon as it has been transmitted to grommunioi support. The support
archive can be removed by accessing the console and executing the command ``rm
-f /usr/share/grommunio-admin-web/grommunio-support.txz``.

The information collected by grommunio-support contains:

- Crash relevant information (Coredumps)
- Disk layout (incl. LVM layout and SMART and Software RAID)
- Configuration dump (incl. /etc and more specific information e.g. from
  webserver)
- High-availability information
- Memory-related information
- Network configuration
- Process-relevant information
- Sysconfig information

.. important::
   The support package might contain sensitive information. If this is a
   concern to you, it is recommended to prune specific private data from the
   generated archive before sending it to grommunio support. Support data is
   used only for diagnostic purposesi and is considered confidential
   information.

.. note::
   The support is solely available on the appliances provided by grommunio. On
   SUSE-based distributions it can also be made available by repository
   installation via the "grommunio-setup" package, which has a dependency on
   the package "supportutils".

Installation logs
=================

The setup wizard of the grommunio Appliance saves its log to
``/var/log/grommunio-setup.log``. If, for example, the wizard fails the
certificate generation, the reasons should be visible in that file.


System logs
===========

The grommunio Appliance inherits system logging settings from systemd. Refer to
the systemd-journald(8) manpage for details. To display logs, use the
journalctl(8) command from a root login shell prompt::

	journalctl -u gromox-http -n 1000
	journalctl -f

Useful options that can independently be combined are:

	* ``-f`` for follow mode
	* ``-n`` to show that many of the most recent lines
	* ``-u`` to limit the display to one particular service unit

Some logs are emitted to files rather than journald. These include:

+----------------------------------+---------+-----------------------------------------------------------------------------------------+
| URI Prefix                       | Process | Files                                                                                   |
+==================================+=========+=========================================================================================+
| ``/dav``                         | nginx   | ``/var/log/nginx/grommunio-web-access.log``, ``/var/log/nginx/grommunio-web-error.log`` |
+----------------------------------+---------+-----------------------------------------------------------------------------------------+
| ``/dav``                         | php-fpm | ``/var/log/grommunio-dav/grommunio-dav-php.log``                                        |
+----------------------------------+---------+-----------------------------------------------------------------------------------------+
| ``/Microsoft-Server-ActiveSync`` | nginx   | ``/var/log/nginx/grommunio-web-access.log``, ``/var/log/nginx/grommunio-web-error.log`` |
+----------------------------------+---------+-----------------------------------------------------------------------------------------+
| ``/Microsoft-Server-ActiveSync`` | php-fpm | ``/var/log/grommunio-sync/grommunio-sync-fpm.log``                                      |
+----------------------------------+---------+-----------------------------------------------------------------------------------------+
| ``/web``                         | nginx   | ``/var/log/nginx/grommunio-web-access.log``, ``/var/log/nginx/grommunio-web-error.log`` |
+----------------------------------+---------+-----------------------------------------------------------------------------------------+
| ``/web``                         | php-fpm | ``/var/log/gromox``                                                                     |
+----------------------------------+---------+-----------------------------------------------------------------------------------------+


Coredumps
=========

The grommunio Appliance inherits the coredump defaults from systemd. The sysctl
variable for the core pattern is set to::

	kernel.core_pattern = |/usr/lib/systemd/systemd-coredump %P %u %g %s %t %c %e

`systemd-coredump` stores dumps in ``/var/lib/systemd/coredump``. Refer to the
systemd-coredump(8) and coredump.conf(5) manpages for details. Dumps are
normally LZ4-compressed and need to be decompressed before they can be used
with gdb; for this, you will need to install the lz4 program (``zypper in
lz4``).
