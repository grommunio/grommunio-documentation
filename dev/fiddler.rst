..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2024 grommunio GmbH

Fiddler installs itself as a system proxy, i.e. when Fiddler is set to capture
traffic, the system proxy setting is changed to point to 127.0.0.1:8888.
Therefore, Fiddler is not entirely transparent.

When capture has just been activated, it may take a few HTTPS connection
attempts before things actually work. So, if opening a MAPI profile fails,
retry a few times.

Be aware that TLS certificate warning dialogs (which are normal under these
circumstances) might pop up *under* other windows and go unnoticed.

The MAPI Inspector for Fiddler does support both EMSMDB and NSP.

Fiddler is not able to deal with RPCH requests at all, and connecting to EXC in
this mode will fail. Only MAPIHTTP will work. The EAC Shell command
`Get-OrganizationConfig` and `Set-OrganizationConfig -MapiHttpEnabled $true`
can be used to read/write the setting. A change seems to necessitate a reboot
to activate.
