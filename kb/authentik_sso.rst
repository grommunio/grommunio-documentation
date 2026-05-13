..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2026 grommunio GmbH

Authentik SSO Integration
=========================

grommunio-web has built-in support for Keycloak-compatible OIDC authentication.
Since Authentik does not expose Keycloak-format endpoint URLs natively, this guide
uses a small nginx proxy bridge to map the expected Keycloak paths to Authentik's
endpoints — no plugins or forks required.

**Tested with:** grommunio-web 6.x · Authentik 2024.x · PHP 8.4 · nginx · gromox

Architecture Overview
---------------------

.. code-block:: text

    Browser -> https://mail.example.com/web
            |
       nginx (grommunio host)
            |-- /web/*               -> grommunio-web PHP app
            +-- /sso/realms/*/...    -> SSO Bridge -> Authentik (sso.example.com)
                                                           |
                                               issues JWT access_token
                                                           |
                                     gromox validates token via bearer_pubkey

Replace ``mail.example.com`` with your grommunio domain and ``sso.example.com``
with your Authentik domain throughout this guide.

Step 1 — Configure Authentik
-----------------------------

Create OAuth2/OIDC Provider
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In the Authentik admin UI (``https://sso.example.com/if/admin/``):

1. Go to **Applications → Providers → Create**
2. Choose **OAuth2/OpenID Provider**
3. Configure:

.. list-table::
   :header-rows: 1
   :widths: 30 70

   * - Field
     - Value
   * - Name
     - ``grommunio``
   * - Authorization flow
     - your default-authorization-flow
   * - Client type
     - ``Confidential``
   * - Client ID
     - ``grommunio`` (must match ``keycloak.json``)
   * - Client Secret
     - Generate and save securely
   * - Redirect URIs
     - ``https://mail.example.com/web``, ``https://mail.example.com/web/``,
       ``https://mail.example.com/web/index.php``
   * - Signing Key
     - Select your Authentik certificate

Add Required Scope Mappings
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In the provider's **Advanced protocol settings**, ensure these scope mappings
are assigned: ``openid``, ``email``, ``offline_access``.

.. warning::

   ``offline_access`` is critical. Without it, Authentik will not issue a
   ``refresh_token``. grommunio-web's ``validate_grant()`` requires a refresh
   token for session validation — its absence causes an infinite redirect loop
   after login.

To add ``offline_access`` if missing:

1. Go to **Customization → Property Mappings → Create → Scope Mapping**
2. Name: ``offline_access``, Scope name: ``offline_access``, Expression: ``return None``
3. Assign it under your provider's scope mappings

Create Application
~~~~~~~~~~~~~~~~~~~

1. Go to **Applications → Applications → Create**
2. Name: ``grommunio``, Provider: select the provider above
3. Launch URL: ``https://mail.example.com/web``, Slug: ``grommunio``

Get the Signing Public Key
~~~~~~~~~~~~~~~~~~~~~~~~~~~

gromox needs Authentik's public key to validate JWT tokens.

1. Go to **System → Certificates**
2. Open the certificate used by your provider
3. Click **View certificate** and copy the **Public Key** block (PEM)

Or fetch dynamically via JWKS:

.. code-block:: bash

   curl https://sso.example.com/application/o/grommunio/jwks/

Step 2 — Configure gromox (JWT Validation)
-------------------------------------------

Save Authentik's public key to ``/etc/gromox/authentik-pubkey.pem``::

    -----BEGIN PUBLIC KEY-----
    <paste Authentik's EC or RSA public key here>
    -----END PUBLIC KEY-----

Edit ``/etc/gromox/http.cfg`` and add:

.. code-block:: ini

   bearer_pubkey = /etc/gromox/authentik-pubkey.pem

Restart gromox:

.. code-block:: bash

   systemctl restart gromox-http

Step 3 — nginx SSO Bridge
--------------------------

grommunio-web constructs Keycloak-format URLs such as
``/sso/realms/{realm}/protocol/openid-connect/auth``.
Create an nginx bridge that maps these to Authentik's endpoints.
Place the following in your grommunio nginx config, e.g.
``/etc/grommunio-common/nginx/locations.d/sso-bridge.conf``:

.. code-block:: nginx

   # Authorization endpoint
   location ~ ^/sso/realms/[^/]+/protocol/openid-connect/auth {
       proxy_pass https://sso.example.com/application/o/authorize/;
       proxy_set_header Host sso.example.com;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
   }

   # Token endpoint
   location ~ ^/sso/realms/[^/]+/protocol/openid-connect/token {
       proxy_pass https://sso.example.com/application/o/token/;
       proxy_set_header Host sso.example.com;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
   }

   # Token introspection
   location ~ ^/sso/realms/[^/]+/protocol/openid-connect/token/introspect {
       proxy_pass https://sso.example.com/application/o/introspect/;
       proxy_set_header Host sso.example.com;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
   }

   # Logout — redirect directly to Authentik (must NOT use proxy_pass)
   location ~ ^/sso/realms/[^/]+/protocol/openid-connect/logout {
       return 302 https://sso.example.com/application/o/grommunio/end-session/$is_args$args;
   }

.. warning::

   The logout location **must** use ``return 302``, not ``proxy_pass``.
   Proxying logout causes Authentik's redirect response to contain
   ``mail.example.com/flows/...`` as the post-logout URL, which does not exist
   on the grommunio host and results in a 404.

Test and reload:

.. code-block:: bash

   nginx -t && systemctl reload nginx

Step 4 — Configure grommunio-web (keycloak.json)
-------------------------------------------------

Edit ``/etc/grommunio-web/keycloak.json``:

.. code-block:: json

   {
     "realm": "grommunio",
     "auth-server-url": "https://mail.example.com/sso/",
     "ssl-required": "external",
     "resource": "grommunio",
     "credentials": {
       "secret": "YOUR_CLIENT_SECRET_FROM_AUTHENTIK"
     },
     "confidential-port": 0
   }

.. list-table::
   :header-rows: 1
   :widths: 30 70

   * - Field
     - Notes
   * - ``auth-server-url``
     - Point to your grommunio domain + ``/sso/``. The nginx bridge proxies onward.
   * - ``realm``
     - Any string — the nginx regex matches all realms.
   * - ``resource``
     - Must match the Client ID configured in Authentik.
   * - ``credentials.secret``
     - The client secret from Authentik.

Step 5 — Patch grommunio-web: Add offline_access Scope
-------------------------------------------------------

grommunio-web requests only ``openid email`` by default. Without
``offline_access``, Authentik does not issue a ``refresh_token``, and
``validate_grant()`` fails silently — causing a redirect loop.

Edit ``/usr/share/grommunio-web/server/lib/class.keycloak.php``.
Find the scope string (around line 180) and change it in **both** places
(authorization redirect and token request):

.. code-block:: php

   // Before:
   'scope' => 'openid email',

   // After:
   'scope' => 'openid email offline_access',

Reload PHP-FPM:

.. code-block:: bash

   # Adjust version as needed
   systemctl reload php8.4-fpm

.. note::

   This file is overwritten on package updates. Consider submitting a feature
   request to grommunio to make the requested scopes configurable via
   ``keycloak.json`` or ``config.php``.

Step 6 — Verify
---------------

1. Open ``https://mail.example.com/web`` — should redirect to Authentik login
2. Log in — should redirect back and land in grommunio inbox
3. Click **Logout** — should land on Authentik's invalidation page at ``sso.example.com``

Troubleshooting
---------------

Redirect loop after login
~~~~~~~~~~~~~~~~~~~~~~~~~~

* Confirm ``offline_access`` is in the Authentik provider's scope mappings
* Confirm ``offline_access`` is in the ``scope`` string in ``class.keycloak.php``
* Test token exchange manually:

  .. code-block:: bash

     curl -X POST https://sso.example.com/application/o/token/ \
       -d "client_id=grommunio&client_secret=SECRET&grant_type=authorization_code&code=CODE&redirect_uri=https://mail.example.com/web"

  Response must contain ``refresh_token``.

404 on logout
~~~~~~~~~~~~~

Ensure the logout nginx location uses ``return 302`` (redirect) — not ``proxy_pass``.

HTTP 500 on grommunio-web
~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: bash

   journalctl -u php8.4-fpm -n 50
   tail -n 50 /var/log/nginx/grommunio-web-error.log
   php -l /usr/share/grommunio-web/server/lib/class.keycloak.php

JWT validation fails in gromox
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Verify the PEM in ``/etc/gromox/authentik-pubkey.pem`` matches Authentik's
signing cert:

.. code-block:: bash

   curl https://sso.example.com/application/o/grommunio/jwks/

Security Checklist
------------------

* Never commit ``keycloak.json`` to version control (contains client secret)
* Rotate ``bearer_pubkey`` if Authentik's signing certificate changes
* Keep ``ssl-required: external`` in ``keycloak.json``
* The nginx SSO bridge should only be reachable over HTTPS
* Remove any debug code that logs tokens to ``/tmp``

File Summary
------------

.. list-table::
   :header-rows: 1
   :widths: 55 45

   * - File
     - Change
   * - ``/etc/gromox/http.cfg``
     - Add ``bearer_pubkey`` pointing to PEM file
   * - ``/etc/gromox/authentik-pubkey.pem``
     - Create: Authentik signing public key (PEM)
   * - ``/etc/grommunio-common/nginx/locations.d/sso-bridge.conf``
     - Create: nginx Keycloak to Authentik proxy bridge
   * - ``/etc/grommunio-web/keycloak.json``
     - Configure OIDC client (auth-server-url, client-id, secret)
   * - ``/usr/share/grommunio-web/server/lib/class.keycloak.php``
     - Add ``offline_access`` to scope string
