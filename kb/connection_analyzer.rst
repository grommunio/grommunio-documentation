..
	SPDX-License-Identifier: CC-BY-SA-4.0 or-later
	SPDX-FileCopyrightText: 2024 grommunio GmbH

Connection Analyzer
===================

Silly check for fixed RSA cipher types
--------------------------------------

When the server certificate's private key is of RSA type, all is fine:

.. code-block:: text

	$ openssl s_client -no_tls1_3 -connect mail.grommunio.com:443
	 0 s:CN = mail.grommunio.com
	   i:C = US, O = Let's Encrypt, CN = R3
	   a:PKEY: rsaEncryption, 2048 (bit); sigalg: RSA-SHA256
	   v:NotBefore: Aug 27 21:02:07 2024 GMT; NotAfter: Nov 25 21:02:06 2024 GMT
	    ...
	    Protocol  : TLSv1.2
	    Cipher    : ECDHE-RSA-AES256-GCM-SHA384

.. image:: _static/img/connan_rsa.png

Let's Encrypt (certbot) produces ECDSA signatures, which means the ciphers will
be ECDHE-ECDSA instead, and Connection Analyzer behaves completely stupid.

.. code-block:: text

	$ openssl s_client -no_tls1_3 -connect a4.inai.de:443
	 0 s:CN = a4.inai.de
	   i:C = US, O = Let's Encrypt, CN = R3
	   a:PKEY: id-ecPublicKey, 256 (bit); sigalg: RSA-SHA256
	   v:NotBefore: Sep 23 22:10:43 2024 GMT; NotAfter: Dec 22 22:10:42 2024 GMT
	    ...
	    Protocol  : TLSv1.2
	    Cipher    : ECDHE-ECDSA-AES256-GCM-SHA384

.. image:: _static/img/connan_dsa.png
