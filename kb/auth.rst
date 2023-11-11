..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later

Authentication
==============

Before Gromox version 2.17, only HTTP Basic authentication was offered by the
server. (Since then, HTTP Negotiate is available as a second mechanism.) For
Basic, Gromox conveys the desired encoding for usernames and passwords to the
client via the ``WWW-Authentication`` header, particular the ``charset``
parameter as defined in RFC 7617 §2.1. However, the Windows RPC and HTTP
libraries ignore this. We have thus identified problems with non-ASCII
characters in Windows systems:

  * When entering a password with an umlaut, the copy of Windows we used
    transmits in local codepage, but nowhere does it indicate the codepage in
    the HTTP request. This is a serious design deficiency, especially
    considering the MAPI protocols themselves *do* have a means to convey the
    corresponding codepage number when transmitting 8-bit MAPI property string
    values! The HTTP requests are also sent with ample custom headers in
    general.)

  * When entering a password with a Chinese/Japanese character,
    the copy of Windows (10 Workstation Pro) we used does not transmit *any*
    `Authorization` header *at all*.

The Internet Options control panel dialog `[1] <_static/img/auth_intopts.png>`_
`[2] <_static/img/auth_intopts2.png>`_ which concerns itself with system HTTP libraries
of the old days does not influence this.

From this, we conclude that umlauts can only be used from Outlook when it is
using Negotiate authentication.

.. meta::
   :description: grommunio Knowledge Database
   :keywords: grommunio Knowledge Database
   :author: grommunio GmbH
   :publisher: grommunio GmbH
   :copyright: grommunio GmbH, 2022
   :page-topic: software
   :page-type: documentation
   :robots: index, follow
