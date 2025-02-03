..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2025 grommunio GmbH

##############
Administration
##############

This chapter includes details on how to administrate components of
grommunio with the available toolset.

grommunio admin UI (AUI)
========================

After successfully installing the grommunio Appliance, you can access the UI
through your browser on port 8080 (8443 with https soon).

Since you most likely set a password for admin UI while installing the
Appliance, you can immediately use these credentials to login.

.. image:: _static/img/login.png
   :alt: grommunio login

To navigate through the UI, simply use the drawer on the left side of the page.

|pic1| |pic2|

.. |pic1| image:: _static/img/system_drawer.png

.. |pic2| image:: _static/img/domain_drawer.png


Dashboard
---------

After a successful login, you can see the dashboard with live data of the
machine grommunio runs on.


Antispam
~~~~~~~~

Since grommunio has its own antispam service, according data can be displayed
in the Dashboard.

.. image:: _static/img/antispam.png
   :alt: grommunio antispam chart


Services
~~~~~~~~

Antispam isn't the only grommunio service, in fact there are lots more. The
current state of these services can be seen on the left side of the dashboard.

.. image:: _static/img/services.png
   :alt: grommunio services chart

You can stop, restart or start these services from here by clicking the action
buttons of a service in the list.


CPU
~~~

.. image:: _static/img/cpu.png
   :alt: grommunio cpu chart

A live and history display of the CPU usage.


Memory
~~~~~~

.. image:: _static/img/memory.png
   :alt: grommunio memory chart

A live and history display of the memory usage.


Disks and swap
~~~~~~~~~~~~~~

.. image:: _static/img/disks.png
   :alt: grommunio disks chart

A live display of the disks and swap.


Load
~~~~

.. image:: _static/img/load.png
   :alt: grommunio load chart

A display of the system load over the last 1, 5 and 15 minutes.


Versions
~~~~~~~~

.. image:: _static/img/versions.png
   :alt: grommunio load chart

A display of installed component versions.


Domains
-------

Click on `Domains` in the drawer, which will redirect you to the list view
of existing domains.
If you just set up grommunio, the table will be empty.
If you want to show currently deactivated domains check the checkbox `show
deactivated`.

Adding a domain
~~~~~~~~~~~~~~~

To add a new domain, click the blue `NEW DOMAIN` button to open the form
dialog:

.. image:: _static/img/add_domain.png
   :alt: adding domain

The following properties can be set:

- Domain (required): The name of the domain (cannot be changed afterwards)
- Status: Whether the domain should be currently activated or deactivated
- Organization: Organization of the domain
- Maximum users (required): The maximum amount of users (e-mails) of this
  domain
- Title: Title of the domain
- Address: Address of the domain
- Administrator: Administrator of the domain
- Telephone: Hotline for problems
- Homeserver: The server on which the domain's data is stored
- Create domain admin role: Creates a role for users, who will be admins for this domain
- Create grommunio-chat team: Creates a new grommunio-chat team for this domain. If you want users of this domain to be able to log into grommunio-chat, this has to be checked.

Click `Add` to confirm or `Cancel` to cancel.

Editing a domain
~~~~~~~~~~~~~~~~

To edit an existing domain, click on a domain in the list to open the detailed
view of a domain.

.. image:: _static/img/edit_domain.png
   :alt: editing domain

Simply change attributes to your needs, then click `Save` on the bottom to save
your changes.

To change the current password of the domain, click `Change password` next to
the domain name. You will be prompted to set and repeat your new password.


Deleting a domain
~~~~~~~~~~~~~~~~~

To delete a domain, click on the trash icon of a domain in the domain list
view.

The following flags can be set:

- Delete permanently: Checking this, will completely remove the domain out of
  the database, not just deactivate it
- Delete files: Only available if permanently deleting, will delete all files
  of this domain

Click `Confirm` to confirm or `Cancel` to cancel


Reactivating domains
~~~~~~~~~~~~~~~~~~~~

If you didn't delete a domain permanently, it will automatically be set to
deactivated. To reactivate a domain, click on a domain in the list to get to
the detailed view. Now change the status from deactivated to activated.

.. image:: _static/img/activate_domain.png
   :alt: editing domain


Users
-----

If at least one domain exists in the database, users can be added to a domain.
To show existing users of a domain, navigate to the domain view in the drawer (`Domains` tab).

Click on a domain to expand available sub-pages and click on `Users`, which
will redirect you to the list of users of this domain. If you just installed
grommunio or added the domain, the list will be empty.

Alternatively, to see all users across all domains, click on `Global users` in the drawer.


Adding a user
~~~~~~~~~~~~~

To add a new user, click the blue `NEW USER` button to open the form dialog:

.. image:: _static/img/add_user.png
   :alt: adding a user

The following properties can be set:

- Mode: Normal or shared user
- Username (required): Username of the user
- Password (required): Password of the user
- Display name: Name to be displayed for this user
- Storage quota limit: Storage limit of the user
- Type: Type of user
- Homeserver: The server on which the user's data is stored

Click `Add` to confirm or `Cancel` to cancel.
If you need to further specify user properties, click `Add and Edit` to open
the detailed view of this user.

Editing a user
~~~~~~~~~~~~~~

To edit an existing user, click on a user in the list to open the detailed view
of a user.

.. image:: _static/img/edit_user.png
   :alt: editing a user

There are 10 main categories of user properties:

- Account: RPC/HTTP (Outlook Anywhere), MAPI/HTTP, IMAP, POP3 etc.
  configuration 
- Alt names: Alternative usernames to log into mail-clients with (does not have to be an e-mail address)
- Details: MAPI props
- Contact: Additional MAPI props
- Roles: Roles of the user
- SMTP: Additional e-mails for this user (aliases) and forwarding rules
- Permission: Select users which have special permissions for this user's mailbox
- OOF: Out of office settings
- Fetchmail: Configuration to fetch mails from other servers via fetchmail
- Mobile devices: List of user's mobile devices (via MDM)
- Sync policy: MDM sync policy (specifically for this user)


Account
^^^^^^^

The following properties can be edited:

- Username
- Mode: Mailbox mode, select between a normal user, a suspended user and a shared mailbox
- Type: Type of user
- Homeserver: Server on which the user's data is stored
- Language: Store language of the user (does not effect the language of the UI)
- Used space
   - Send quota limit: Maximum size of the mailbox before sending messages is
     blocked
   - Receive quota limit: Maximum size of the mailbox before message reception
     is blocked
   - Storage quota limit: Maximum size of the mailbox before storing (any kind
     of) objects is blocked
- Hide user from: Hide user from specific user lists (e.g. the global address list)
- Automatic processing of meeting requests: Trivial
- Create grommunio-chat user: Creates a grommunio-chat account for this user. If this checkbox is disabled, there is no grommunio-chat team for this domain.
- grommunio-chat admin permission: Gives administrative permissions for grommunio-chat to this user's grommunio-chat account.
- grommunio-chat permissions: Grants grommunio-chat admin permissions
- Allow SMTP sending: Allows the user to send e-mails via SMTP
- Allow password changes: Allows the user to change his/her password
- Allow POP3/IMAP logins: Allows logins via POP3 or IMAP
- Hide from GAL: Hides the user from the Global Address List
- Allow Chat/Meet/Files/Archive: Allows access to respective feature

Note that, because a message needs to exist internally before it can
be sent, the storage quota limit is also relevant for sending. Conversely,
for reception, the storage quota limit must allow storing messages.
(Thus, the storage quota should always be more than receive quota, and more than
send quota.)

To change the current password of the user, click `Change password` next to the
username.
You will be prompted to set and repeat the new password.


User & Contact
^^^^^^^^^^^^^^

Common MAPI props. These are self-explanatory.


Roles
^^^^^

Roles of the user, which can be edited with the autocompleting textfield

.. image:: _static/img/user_roles.png
   :alt: editing a user


SMTP
^^^^

User aliases:. Edit the textfield to edit an alias, click `ADD E-MAIL` to add or
click the delete icon to delete an alias.

E-Mail forward: Select forward type (CC or Redirect) and the destination e-mail.

.. image:: _static/img/user_smtp.png
   :alt: editing a user


Permissions
^^^^^^^^^^^

Granting other users access to this mailbox.
Available permissions:

- Delegates: Permission to send 'on behalf of' this user
- Send as: Permission to set this user as the sender of an email
- Full permissions: Grants full mailbox permission

.. image:: _static/img/user_permissions.png
   :alt: editing a user


OOF
^^^

Out of office settings (auto-reply messages).

.. image:: _static/img/user_oof.png
   :alt: editing a user


Fetchmail
^^^^^^^^^

It is possible to fetch e-mails from other mailserver via fetchmail.
To configure this feature, you can add several e-mail servers and/or users to
fetch mails from.

.. image:: _static/img/fetchmail.png
   :alt: editing a user

To add new fetchmail entry, click the circled plus icon, which will open the following input form:

.. image:: _static/img/add_fetchmail.png
   :alt: editing a user

- Source server (required): E-Mail server to fetch from
- Source user (required): E-Mail address to fetch from
- Source password (required): Password to the source users account (Hint: Single or double quotes are not supported)
- Source folder (required): Source folder to sync from
- Source auth: Type of authentication to use
- Protocol (required): Protocol to use
- SSL certificate path (if `Use SSL` is checked): Path to local certificate
  directory or empty to use local default
- SSL fingerprint (if `Use SSL` is checked): Fingerprint of the server
  certificate
- Extra options: (if `Use SSL` is checked): Additional fetchmail options
- Active: Whether fetchmail is currently activated
- Use SSL: Whether to use SSL
- Fetch all: Whether to fetch seen mails
- Keep: Keep original e-mails
- SSL certificate check: Check ssl certificate


To edit these properties, click on a row in the table.
To delete an entry, click the trash icon of a table row.

.. important::
   Any changes will only be saved after clicking the click `Save` on
   the bottom of the page.

Mobile Devices
^^^^^^^^^^^^^^

Synchronized mobile devices of this user

.. image:: _static/img/user_devices.png
   :alt: user mobile devices


Actions:
""""""""
- Remote wipe: Engages a remote wipe for a device via MDM (Mobile Device Management)
- Cancel remote wipe: Cancel above action


Sync policy
^^^^^^^^^^^

Specific MDM rules for this user. Unedited rules (greyed out) are adopted from the domain's policy.

.. image:: _static/img/user_sync_policy.png
   :alt: user sync policy


Deleting a user
~~~~~~~~~~~~~~~

To delete a user, click on the trash icon of a user in the user view.

The following flags can be set:

- Delete files: Will delete all files of this user

Click `Confirm` to confirm or `Cancel` to cancel.


Public folders
--------------

If at least one domain exists in the database, public folders can be added to a
domain.
To show existing public folders of a domain, navigate to the domain view in the
drawer.

Click on a domain to expand available sub-pages and click on `Public folders`, which
will redirect you to the list of folders of this domain.
There are two views: A hierarchical view, like a common folder structure and a tree-like graph view.

.. image:: _static/img/folders.png
   :alt: public folders

.. image:: _static/img/folders_tree.png
   :alt: public folders


Adding a folder
~~~~~~~~~~~~~~~

To add a folder, click the `Plus Circle` icon of the folder's parent folder.
`Public Folders` is the root folder, all other folders are put into. Thus the first folder is always within `Public Folders (IPM_SUBTREE)`.

.. image:: _static/img/add_folder.png
   :alt: adding a folder

The following properties can be set:

- Folder name (required): Name of folder
- Container: Type of folder container
- Comment: Comment
- Owners: Owners of this folder (Multi-select of users in the database)

Click `Add` to confirm or `Cancel` to cancel.


Editing a folder
~~~~~~~~~~~~~~~~

To edit an existing folder, click on the right `Edit` icon inside the hierarchy view to open the folder details.

.. image:: _static/img/edit_folder.png
   :alt: editing a folder

Simply change attributes to your needs, then click `Save` on the bottom to save
your changes.


Folder permissions
^^^^^^^^^^^^^^^^^^

To edit folder permission click on `Open permissions` to open the permissions dialog.

.. image:: _static/img/folder_permissions.png
   :alt: editing a folder

This form is a direct replica of grommunio-web's and outlook's folder permission settings.
Select users to grant permissions at the top and set their permissions at the bottom.


Deleting a folder
~~~~~~~~~~~~~~~~~

To delete a folder, click on the trash icon of a folder in the folder view.
Click `Confirm` to confirm or `Cancel` to cancel.


Groups
------

If at least one domain exists in the database, groups can be added to a
domain. To show existing groups of a domain, navigate to the domain view in
the drawer.

Click on a domain to expand available sub-pages and click on `Groups`,
which will redirect you to the list of groups of this domain. If you have
just installed grommunio or added the domain, the list will be empty.


Adding a group
~~~~~~~~~~~~~~

To add a new group, click the blue `NEW GROUP` button to open the form
dialog:

.. image:: _static/img/add_group.png
   :alt: adding a group

The following properties can be set:

- Group name (required): E-Mail address of the group
- Displayname: Displayed name of the group
- Hide from addressbook: If selected, the mailing list won't be visible in the Global Address Book
- Type:
   - Normal: Select users as recipients
   - Domain: All users of the domain will be recipients
- Privilege: Users who are allowed to send E-Mails to the group
   - All: Everyone
   - Internal: All users of the group
   - Domain: All users in the domain
   - Specific: Specific users (`Senders`)
- Recipients: Users of the domain, who are part of the group (not available if type=Domain)
- Senders: Users, who are allowed to send e-mails to the group (only available if privilege=Specific)

Click `Add` to confirm or `Cancel` to cancel.


Deleting a group
~~~~~~~~~~~~~~~~

To delete a group, click on the trash icon of a group in the list view.
Click `Confirm` to confirm or `Cancel` to cancel.


Roles
-----

Click on `Roles` in the drawer, which will redirect you to the list view of
existing roles.
If you have just set up grommunio, the table will be empty.

By default, every time a domain is added, a new role with rights for the new
domain will be added.
Additionally, you can create your own roles to specify access rights for
multiple domains.


Adding a role
~~~~~~~~~~~~~

To add a new role, click the blue `NEW ROLE` button to open the form dialog:

.. image:: _static/img/add_role.png
   :alt: adding a role

The following properties can be set:

- Name (required): Name of the role
- Users: Users to which this role will be assigned to
- Permissions:
   - SystemAdmin: Permits any operation
   - SystemAdminRO: Grants read-only permissions to system settings
   - DomainAdmin: Permits operations on for specific domain
   - DomainAdminRO: Grants read-only permissions to specific domain
   - DomainPurge: If present, grants permission to purge any writable domain
   - OrgAdmin: Grants DomainAdmin permission to any domain with matching orgID
   - Params: Domain/Organisation to get access to with this role
- Description: Role description

Click `Add` to confirm or `Cancel` to cancel.


Editing a role
~~~~~~~~~~~~~~

To edit an existing role, click on a role in the list to open the detailed view
of a role.

.. image:: _static/img/edit_role.png
   :alt: editing a role

Simply change attributes to your needs, then click `Save` on the bottom to save
your changes.


Deleting a role
~~~~~~~~~~~~~~~

To delete a role, click on the trash icon of a role in the list view.
Click `Confirm` to confirm or `Cancel` to cancel.


Organizations
-------------

Click on `Organizations` in the drawer, which will redirect you to the list
view of existing organizations.
If you have just set up grommunio, the table will be empty.

Organizations are used to group domains, and give access to multiple domains in
the system by using the `OrgAdmin` role.
Every domain can be associated with at most one organization.


Adding an organization
~~~~~~~~~~~~~~~~~~~~~~

To add a new organization, click the blue `NEW ORGANIZATION` button to open the
form dialog:

.. image:: _static/img/add_organization.png
   :alt: adding an organization

The following properties can be set:

- Name (required): Name of the organization
- Description: Detailed description of the organization
- Domains: Domains which are part of this organization

Click `Add` to confirm or `Cancel` to cancel.


Editing an organization
~~~~~~~~~~~~~~~~~~~~~~~

To edit an existing organization, click on an organization in the list to open
the detailed view of an organization.

.. image:: _static/img/edit_organization.png
   :alt: editing an organization

In this view, it is also possible to override the global LDAP configuration for domains in this organisation.
To get more information about creating an LDAP config, see the `LDAP` section of this documentation.


Deleting an oranization
~~~~~~~~~~~~~~~~~~~~~~~

To delete an oranization, click on the trash icon of a role in the list view.
Click `Confirm` to confirm or `Cancel` to cancel.


Defaults
--------

To simplify the creation of domains and especially users, it is possible to set default create parameters.
If set, the input masks for adding a domain or user will automatically be filled with these values.

Users with SystemAdmin permissions, can set global defaults by clicking on `Defaults` in the drawer.

.. image:: _static/img/defaults.png
   :alt: editing global defaults

These values can be overwritten for each domain in the domain overviews:

.. image:: _static/img/domainsDefaults.png
   :alt: editing domain defaults


Settings
--------

Settings are split into server and user settings.

To change language, darkmode or theme, use the respective buttons in the topbar or the user icon

.. image:: _static/img/user_settings.png
   :alt: user icon

Server settings can be changed by clicking the settings icon in the topbar:

.. image:: _static/img/server_settings.png
   :alt: server settings

License
-------

To use the full potential of grommunio you can upload your license by clicking
`Upload` and selecting your purchased license.
If you do not have a grommunio license yet, but want to upgrade, you can click
on `Buy now`.

.. image:: _static/img/license.png
   :alt: grommunio license

The following license properties are display:

- Product: Type of grommunio subscription (Community, Business, etc...)
- Created: Date on which the license was created
- Expires: Last day on which the license needs to be renewed
- Users: Current amount of users on this license
- Max users: Maximum amount of users that can be created with the current
  license

If you click on the expansion icon next to the users count, you can see what users are occupying user slots of the license.


Design
------

Admins have the ability to whitelabel the grommunio-admin-web for `all` grommunio-admin-web users.
There is a basic input mask, which helps you set custom app icons and background images.

It is possible to create separate sets of images for different hostnames.
Click the plus icon to create a new set of images for a hostname.
Following images can be set:

- ``logo``: The logo in the login form
- ``logoLight``: The logo in the expanded drawer
- ``icon``: The icon in the collapsed drawer
- ``background``: The background image in light mode
- ``backgroundDark``: The background image in dark mode

Each of these keys must be an URL to an image file.

.. image:: _static/img/design.png
   :alt: design

As you can see, it is not necessary to overwrite every image, but the hostnames need to be accurate.

Click on the `Show config` button to display the ``customImages`` config object,
which needs to be copied into ``/etc/grommunio-admin-common/config.json`` on the server.


Application links
-----------------

.. image:: _static/img/topbar.png
   :alt: topbar

Links to external applications need to be configured in ``/etc/grommunio-admin-common/config.json`` on the server.

Following attributes are available:

- ``rspamdWebAddress:String``: Url of rspamd server (default: ``''``)
- ``mailWebAddress:String``: Url of mail webapp (e.g. grommunio-web) (default: ``''``)
- ``chatWebAddress:String``: Url of grommunio-chat (default: ``''``)
- ``videoWebAddress:String``: Url of grommunio-meet (default: ``''``)
- ``fileWebAddress:String``: Url of grommunio-files (default: ``''``)
- ``archiveWebAddress:String``: Url of grommunio-archive (default: ``''``)


Additional server-side configuration
------------------------------------

Following additional attributes can be configured at ``/etc/grommunio-admin-common/config.json`` on the server.

- ``devMode:boolean``: For development, enables redux logger (default: ``false``)
- ``tokenRefreshInterval:int``: Sets token refresh interval in seconds. (default: ``86400`` (24h))
- ``defaultDarkMode:boolean``: If ``true``, the app will be set to dark mode, if not explicitly set by the user/browser (default: ``false``)
- ``defaultTheme:string``: Name of the default theme to use. Available themes: grommunio, green, purple, magenta, teal, orange, brown, bluegrey (default: ``"grommunio"``)
- ``loadAntispamData:boolean``: Whether or not to load antispam data in the dashboard (default: ``true``)
- ``searchAttributes:Array<String>``: Array of strings, possible LDAP Search attributes (default: All attributes)

Updates
-------

It is possible to update and upgrade server packages within grommunio-admin-web.

- Choose repository: Community (publicly available) or Supported (license required)
- Check for updates, update or upgrade packages by clicking the respective buttons

.. image:: _static/img/updates.png
   :alt: updates


LDAP
----

It it possible to synchronise users from external user directories using LDAP.
To configure LDAP, click on `LDAP` in the drawer, which will redirect you to
the LDAP form to define a global LDAP configuration.
This config can be overwritten for each individual organisation.
To do so, navigate to `Organisations` and open the detailed view of an organisation.
Flip the `Override global LDAP config` switch and set a config according to the following specification.

.. important::
   Please note that configuration changes are not automatically applied to the
   services already running. Make sure to restart the services to be able to
   pick up the LDAP authentication first.

After applying a new LDAP configuration, the services are intentionally not automatically
restarted as this would result into possibly inconvenient downtime if existing internal users
are already used by the authentication manager (authmgr). Services can either be restarted
through admin UI in the dashboard section or via systemd directly:

``systemctl restart gromox-{http,zcore,pop3,delivery,delivery-queue,midb,imap}``


Availability
~~~~~~~~~~~~

`LDAP not available` means the LDAP config isn't set up correctly or the server
can't be reached.
If you want to disable LDAP manually, flip the `LDAP enabled` switch.

.. image:: _static/img/ldap_switch.png
   :alt: LDAP switch


Configuration
~~~~~~~~~~~~~

Through this form, you create a `ldap.yaml` file, which configures an LDAP
connection.

Properties are split into the following categories:

- LDAP Server
- Attribute Configuration
- Custom Mapping

To save a configuration, click `Save` at the bottom or click `Delete Config` to
delete the current configuration.


LDAP Server
~~~~~~~~~~~

The following properties are available:

- LDAP Server (server): Address of the LDAP server to connect to
- LDAP Bind User (bindUser): DN of the user to perform initial bind with
- StartTLS: Whether to utilize the StartTLS mechanism to secure the connection
- LDAP Base DN (baseDn): Base DN to use for user search


Authentication manager
~~~~~~~~~~~~~~~~~~~~~~

Primary authentication mechanism

- Always MySQL (default): MySQL authentication
- Always LDAP: LDAP authentication
- Automatic: The choice between LDAP/MySQL occurs dynamically, depending on
  whether the user was imported from LDAP originally.


Attribute Configuration
~~~~~~~~~~~~~~~~~~~~~~~

The following properties are available:

- LDAP Templates (templates): Template to prefill any fields below. Available
  are:
   - OpenLDAP
   - ActiveDirectory
- LDAP Filter (filters): LDAP search filter to apply to user lookup
- Unique Identifier Attribute (objectID): Name of an attribute that uniquely
  identifies an LDAP object
- LDAP Username Attribute (username): Name of the attribute that corresponds to
  the username (e-mail address)
- LDAP Default Quota (defaultQuota): Storage quota of imported users if no
  mapping exists
- LDAP Display Name Attribute (displayName): Name of the attribute that
  contains the name


LDAP Search Attributes
~~~~~~~~~~~~~~~~~~~~~~

Controls which attributes the "Search in LDAP" functionality will look at when
searching using an arbitrary search string.


Custom Mapping
~~~~~~~~~~~~~~

LDAP attribute -> PropTag mapping to use for LDAP import.
Any mappings specified take precedence over active templates.

You can create a list of `(Name, Value)` pairs

- Name: Name of the PropTag the attribute maps to
- Value: Value of the PropTag the attribute maps to


User import and synchronisation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To import/sync users from all domains, you have to have SystemAdmin permissions.
If you do, click on `IMPORT USERS` or `SYNC USERS`.
This will import/sync all users of all domains.

If you don't have these permissions, you can import/sync users for your domain.
To do that, navigate to the user list(s) of your domain(s).

Importing users will synchronise all already imported users and also import new
ones.
Synchronising will only do the first.


Domain user import and synchronisation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In the users list, you can either import/sync all users of this domain by
clicking `Import/Sync ldap users`.
If you want to import specific users, you can do the following:


User import
~~~~~~~~~~~

Click on `Search in ldap` to open a list view of ldap users.
Simply enter a username at the searchbar and click the import icon of a user to
import.

.. image:: _static/img/search_ldap.png
   :alt: search ldap

There is the option to force the import. If checked, an existing user with this
usename in the grommunio database will be overwritten.

.. image:: _static/img/import_user.png
   :alt: importing a user


You can sync these specific users by clicking on them in the list view and
clicking the `Sync` button in the detailed view (only for LDAP users).


Detaching a user
~~~~~~~~~~~~~~~~

If you want to modify an ldap user, you need to detach it from ldap.
You can achieve this by clicking `Detach` in the detailed user view.
This essentially removes the synchronisation until forcefully overwriting the
user via another import.


Removing orphaned users
~~~~~~~~~~~~~~~~~~~~~~~

If a user was removed from the ldap directory, the imported user will be
orphaned.
To show and/or delete currently orphaned users, click on `Check ldap users`.

.. image:: _static/img/orphaned_users.png
   :alt: orphaned users



DB Configuration
----------------

It is possible to create config files in the database to manage services.
Every config file manages exactly one file and includes lines of `(key, value)`
pairs.

This creates a hierarchical structure:

- ServiceA
   - FileA
      - foo=bar
   - FileB
      - test=example
      - test2=example2
- ServiceB
   - FileC
      - key=value


Adding a file
~~~~~~~~~~~~~

A useful example would be to configure a relayhost in postfix:

.. image:: _static/img/add_file.png
   :alt: adding a file


Editing a file
~~~~~~~~~~~~~~

To edit a file, click on the service the file belongs to.
This will open a detailed view of the service with a list of its files.
Click on a file to open its detailed view and edit the `(key, value)` pairs to
your needs.

.. image:: _static/img/edit_file.png
   :alt: editing a file

Click `Save` to confirm or `Cancel` to discard your changes.


Deleting a file
~~~~~~~~~~~~~~~

To delete a file, click on the service the file belongs to.
This will open a detailed view of the service with a list of its files.
Click on the trash icon of a file to delete it and confirm.


Configuring grommunio-dbconf
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

`grommunio-dbconf` is an internal service, that will execute actions/commands
when configs change.
These actions can be specified for every service separately.

Adding a grommunio-dbconf file
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Actions to be executed when a config of a service `<servicename>` changes,
need to be set in the file `grommunio-dbconf/<servicename>`.

There are pre-made commands to set for either key, file or service changes.
Those can be found on the `Commands` tab.

.. image:: _static/img/file_commands.png
   :alt: file commands

If a command doesn't exist, the next lower level command will be executed
(service -> file -> key).

For example, you could configure `postfix` changes like this:

.. image:: _static/img/add_dbconf.png
   :alt: adding dbconf

This will, among else, restart the service if the service config changes.


Servers
-------

If grommunio is running on a distributed system, the list of servers can be added in this view.
It is possible to specify the selection policy for user distribution.
You can select from:

- round-robin: Always use the server on which a user has *not* been added for the longest time (in a circle-like manner).
- balanced: Put new user on server with least workload
- first: Always use the first server
- last: Always use the last server
- random: Pick a random server

.. image:: _static/img/servers.png
   :alt: servers

Adding a server
~~~~~~~~~~~~~~~

To add a new server, click the blue `NEW SERVER` button to open the form dialog:

.. image:: _static/img/add_server.png
   :alt: add server

The following properties can be set:

- Hostname (required): Internal server hostname
- Extname (required): Hostname for external access (DNS-Name)


Editing a server
~~~~~~~~~~~~~~~~

To edit an existing server, click on a server in the list to open the detailed view.

.. image:: _static/img/edit_server.png
   :alt: edit server

Simply change attributes to your needs, then click `Save` on the bottom to save
your changes.


Logs
----

Click on `Logs` in the drawer, which will redirect you to the list of available
logs.
Usually, you will see a list of grommunio/gromox services, which `journalctl`
logs you can view here.

.. image:: _static/img/logs.png
   :alt: logs

Click on the uparrow to show previous logs.
Click on the the refresh button to fetch new logs or toggle the autorefresh
switch to automatically refresh logs of the selected service every 5 seconds.
Click on a log line to fetch every log *after* the timestamp of the clicked
line.


Mail queue
----------

Click on `Mail queue` in the drawer, which will redirect you to the view of the
current postfix and gromox mail queue.

.. image:: _static/img/mailQ.png
   :alt: mailQ

These lists will update automatically every 10 seconds.


Actions
~~~~~~~

Select table rows by clicking the checkboxes. Mail queue actions will be used on the selected entries.

The actions are:

- Flush: Try to continue mail processing
- Requeue: Remove mail from queue and add queue the same mail as new entry
- Delete: Permanently remove mail from queue


Tasks
-----

Click on `Mail queue` in the drawer, which will redirect you to the Tasks view.

Tasks are created for operations which could potentially take a long time.
Currently, this includes LDAP sync and folder deletion.
If one of these operations take too long, a background task is created, which can be viewed in this table.

.. image:: _static/img/tasks.png
   :alt: tasks

In case the internal task processor is not running, it can be started manually by clicking the `Start server` button.

Further task details can be seen in the task details view, by clicking on a task in the table.


Mobile devices
--------------

Click on `Mobile devices` in the drawer, which will redirect you to the list of
synchronised mobile devices.
This view is a recreation of the grommunio-sync-top CUI.

.. image:: _static/img/sync.png
   :alt: sync

The view will update the devices every 2 seconds.
On the top, you can specify filters for the table, like text-based search or
activity of devices.


Sync policies
-------------

The synchronisation behavior of devices is specified by the sync policies,
which are a set of rules.
When a user logs into an account, these policies will be applied to the device
and updated as soon as the policy is changed.
It is not possible to change the policies globally, but per domain (all users
of a domain) or per user.
To change the policy for all users of a domain, navigate to the list of domains
and click on the domain for which you want to change the policy.
Under the `Sync policy` tab, you can see the current rules.

.. image:: _static/img/syncPolicies.png
   :alt: sync

Blue checkboxes, sliders or textfields indicate deviations from the default
policy, grey ones match it.

To specify specific rules for a user, navigate to list of users and click on
the user for whom you want to change the policy.
Just like domain-specific policies, current rules are displayed under the `Sync
policy` tab.
Again, blue checkboxes, sliders or textfields indicate deviations from the
`domain` policy of this user, grey ones match it.


Live Status
-----------

Click on `Live Status` in the drawer, which will redirect you to the live,
realtime view of the grommunio web services. Any HTTP request shows up in live
status, including MAPI/HTTP, EAS, EWS and other requests made. All connections
other than grommunio Groupware, e.g. Chat and Files are also viewable and can
be tracked by the entrypoint URL in the list.

.. image:: _static/img/livestatus.png
   :alt: live status

At the top you can select one of the available vhosts and the update interval.


grommunio admin CLI (ACLI)
==========================

grommunio-admin
---------------

``grommunio-admin`` is the command line interface tool of the grommunio Admin
API. ``grommunio-admin`` is a low level administrative tool for grommunio
configuration and provides a large number of subcommands to administrate
grommunio accordingly.

grommunio-admin also provides bash completion functionality and an interactive
shell, with the following subcommands available:

+----------------------------------+------------------------------------------------------------------------------------------------------------------------------+
| config                           | Show or check configuration. See `grommunio-admin-config`_.                                                                  |
+----------------------------------+------------------------------------------------------------------------------------------------------------------------------+
| connect                          | Connect to remote CLI. See `grommunio-admin-connect`_.                                                                       |
+----------------------------------+------------------------------------------------------------------------------------------------------------------------------+
| dbconf                           | Database-stored configuration management. See `grommunio-admin-dbconf`_.                                                     |
+----------------------------------+------------------------------------------------------------------------------------------------------------------------------+
| domain                           | Domain management. See `grommunio-admin-domain`_.                                                                            |
+----------------------------------+------------------------------------------------------------------------------------------------------------------------------+
| fetchmail                        | Fetchmail management for retrieval of remote mails. See `grommunio-admin-fetchmail`_.                                        |
+----------------------------------+------------------------------------------------------------------------------------------------------------------------------+
| fs                               | Filesystem operations. See `grommunio-admin-fs`_.                                                                            |
+----------------------------------+------------------------------------------------------------------------------------------------------------------------------+
| ldap                             | LDAP/Active Directory configuration, diagnostics and synchronization. See `grommunio-admin-ldap`_.                           |
+----------------------------------+------------------------------------------------------------------------------------------------------------------------------+
| mconf                            | Managed configurations manipulation. See `grommunio-admin-mconf`_.                                                           |
+----------------------------------+------------------------------------------------------------------------------------------------------------------------------+
| mlist                            | Mailing/distribution list management. See `grommunio-admin-mlist`_.                                                          |
+----------------------------------+------------------------------------------------------------------------------------------------------------------------------+
| passwd                           | Internal user password management. See `grommunio-admin-passwd`_.                                                            |
+----------------------------------+------------------------------------------------------------------------------------------------------------------------------+
| run                              | Run the REST API. See `grommunio-admin-run`_.                                                                                |
+----------------------------------+------------------------------------------------------------------------------------------------------------------------------+
| shell                            | Start interactive shell. See `grommunio-admin-shell`_.                                                                       |
+----------------------------------+------------------------------------------------------------------------------------------------------------------------------+
| taginfo                          | Print information about MAPI property tags. See `grommunio-admin-taginfo`_.                                                  |
+----------------------------------+------------------------------------------------------------------------------------------------------------------------------+
| user                             | User management. See `grommunio-admin-user`_.                                                                                |
+----------------------------------+------------------------------------------------------------------------------------------------------------------------------+
| version                          | Show version information. See `grommunio-admin-version`_.                                                                    |
+----------------------------------+------------------------------------------------------------------------------------------------------------------------------+

.. include:: admin-api.rst
