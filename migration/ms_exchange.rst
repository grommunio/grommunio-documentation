..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2024 grommunio GmbH

##################
Microsoft Exchange
##################

PFF (cf. `summary from the Forensics Wiki
<https://forensicswiki.xyz/wiki/index.php?title=Personal_Folder_File_(PAB,_PST,_OST)>`_)
is a format exportable from Outlook and Exchange. Outlook makes use of this
format for different scenarios, and calls them different names (`.pst`,
`.ost`), but it is just one file type.

* `.pst` files can be generated with Outlook interactively
* `.ost` files can be taken from `C:\Users\...`
* `.pst` files can be also generated from an Exchange Server's PowerShell in a
  mostly unattended fashion


Outlook interactive export
==========================

Once the Outlook main window is open, go to “File”, “Open & Export”,
“Import/Export”:

.. image:: olexport1.png

.. image:: olexport2.png

Then follow the usual dialog chain.

.. image:: olexport3.png

.. image:: olexport4.png

.. image:: olexport5.png

.. image:: olexport6.png

.. important::
   Before attempting to copy PFF files, ensure the file(s) is/are not open
   anywhere anymore. Even after closing Outlook, Outlook may still execute in
   the background for some seconds, *in particular* when the MAPI profile used
   Exchange *Cached Mode*. Various failure modes trying to access active PFF
   files have been observed, such as:

   1. Under the ``cmd.exe`` shell, the command ``type
   stillactive.pst >new.pst`` produces new.pst with just 512 bytes before
   aborting with the message ``The process cannot access the file because
   another process has locked a portion of the file``.

   2. Under the ``cmd.exe`` shell, the command ``scp stillactive.pst a@b.com:``
   can produce the file on the target, but all bytes are ASCII NUL bytes.
   (So observed with Powershell-OpenSSH v8.x; fixed in 9.x).
   A log message ``Domain error`` is output by scp.

   3. PFF files contain a CRC-32 checksum, which can readily change while the
   file is in use. Attempts to read the file from underneath Windows (e.g. at
   the storage or hardware level), or attempting to use a PFF file that was not
   cleanly closed may result in gromox-pff2mt rejecting the input.


gromox-pff2mt import
====================

On the grommunio system, PFF files can be imported on the command-line with
`gromox-pff2mt </man/gromox-pff2mt.8.html>`_ and `gromox-mt2exm
</man/gromox-mt2exm.8.html>`_. These are two commands meant to be chained
together by way of a pipe; tend to the linked manual pages to read about the
invocation syntax.

.. image:: gxpff2mt.png

.. image:: gxdone.png


Exchange PowerShell export
==========================

Contributors have written `a PowerShell script
<https://github.com/grommunio/gromox/blob/master/tools/exchange2grommunio.ps1>`_
for the mass export of .pst files from an Exchange Management Console (a
PowerShell instance with Exchange commands loaded) with a subsequent mass
import via ssh commands that it issues. Inspect the first 130 or so lines of
the script for **mandatory adjustable parameters**.
