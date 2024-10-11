..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later

Disclaimer
==========

You might be required (by law) to add a disclaimer on your Server which also
needs to be easily accessible. As the nginx config by default rewrites the URL
to host/web we will do that in grommunio-web.

You just have to create a file called `/etc/grommunio-web/disclaimer.html`
which will be read and displayed on the bottom of the login site.

.. note::
   This currently doesn't work with grommuni-keycloak as it redirects the login
   page.
