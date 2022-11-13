..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later

Authentication
==============

As of Gromox 1.33, only HTTP Basic authentication is offered. We have a patch
that makes Gromox send the WWW-Authentication header with the ``charset``
parameter (RFC 7617 §2.1), however, the MSRPC libraries ignore this. We
recognize there are two bugs with Windows:

  * When entering a password with an umlaut, the copy of Windows we used
    transmits in local codepage, but nowhere does it indicate the codepage in
    the HTTP request. This is a serious design deficiency, especially
    considering the MAPI protocols themselves _do_ have a means to convey the
    corresponding codepage number when transmitting 8-bit MAPI property string
    values! The HTTP requests are also sent with ample custom headers in
    general.)

  * When entering a password with a CJK character, the copy of Windows we used
    does not transmit _any_ `Authorization` header _at all_.

The Internet Options control panel dialog `[1]<auth_intopts.png>`_
`[2]<auth_intopts2.png>`_ which concerns itself with system HTTP libraries
of the old days does not influence this.
