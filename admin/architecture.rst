..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2025 grommunio GmbH

############
Architecture
############

Component architecture
======================

While grommunio is distributed as appliances, grommunio is also available as
packaged software. The packaging is oriented on the modular component structure
of the software modules available by grommunio. The modular component layout of
grommunio allows a component-based deployment for all sorts of deployments and
operations - ranging from single deployments with high-density component layout
to scale-out, distributed component layout.

.. image:: _static/img/component_architecture.png
   :alt: Architecture of grommunio components

The grommunio component layout supports a wide range of deployment types:

- Containers (Docker, LXC)
- Virtual machines (KVM, VMware, Hyper-V)

The appliances shipped by grommunio contain all components required for
operation by the use of packages which are available for updates via
repositories. The appliances ship these packages as part of the appliance
distribution to be able to operate the installation without external repository
activation necessary (whilst deploying with active internet connection for
updates at deployment is strongly encouraged).

To understand the component architecture and the interconnectivity of these
components, the following chapters show the single components and how they
interoperate with other components in the entire component stack.

Multi-Server architecture
=========================

Scaling grommunio across multiple instances ("Multi-Server") requires a
fundamental understanding of scale-out solutions. For most users, the Single
Point of Entry (SPOE) approach is preferable, as it eliminates the need to
remember which specific server their profile resides on. However, in large-scale
environments with tens of thousands of users, even the most advanced server
systems require distribution across multiple nodes to handle the load
efficiently.

**The role of Autodiscover, Autoconfig and Load Balancers**

Autodiscover, in combination with load balancers, provides a unified access
point, ensuring that users can seamlessly connect to their mailboxes without
concern for backend distribution. To make this work, the system must know where
each user’s data is stored—whether they are using an IMAP client or the web
interface.

When a request arrives at a load balancer, it may be directed to Node A, even
though the user's data resides on Node B. Depending on the protocol in use, the
component handling the request will either:

Proxy the request to the appropriate backend node, or access the data directly
through RPC calls (exmdb traffic).

Setting up Multi-Server
-----------------------

To ensure smooth operation across multiple nodes, the following configurations
must be in place:

- Defining Servers in grommunio Admin:

  - The internal hostname should reflect the actual hostname of the server.

  - The external hostname should match the name communicated in client requests
    (e.g., for AutoDiscover).

- User Assignment:

  - Users must be associated with specific servers. If multiple servers are
    configured, the system’s selection policy will determine automatic
    placement.

- Network Service Configuration:

  - Core services must be configured to listen for network requests based on the
    architecture.

.. important::
   Functional redirects require that internal hostnames remain accessible even
   in a proxied environment. Load balancers must respond to both internal and
   external hostnames. Additionally, inter-component traffic must resolve correctly
   via internal hostnames. A proper TLS certificate setup is critical for secure
   traffic exchange between components. A multi-SAN or wildcard certificate is
   recommended.

.. important::
   Depending on your environment, additional tuning may be required. Parameters
   like notify_stub_threads_num or rpc_proxy_connection_num should be adjusted
   based on your specific scale and workload. Refer to the man pages for details on
   these settings.

Shared storage
--------------

To configure gromox for multi-server operation, follow these steps for a
three-node setup (with IPv4 traffic enabled):

**Configuration Files**

.. code-block:: text

	# /etc/gromox/exmdb_provider.cfg
	exmdb_hosts_allow=:: ::ffff:10.10.10.20 ::ffff:10.10.10.30 ::ffff:10.10.10.40 ::1
	listen_ip=::

	# /etc/gromox/exmdb_list.txt
	/var/lib/gromox/user/mail1.gro.at/ private ::ffff:10.10.10.20 5000
	/var/lib/gromox/user/mail2.gro.at/ private ::ffff:10.10.10.30 5000
	/var/lib/gromox/user/mail3.gro.at/ private ::ffff:10.10.10.40 5000
	/var/lib/gromox/domain/ public ::ffff:10.10.10.20 5000

	# /etc/gromox/midb.cfg
	midb_hosts_allow=:: ::ffff:10.10.10.20 ::ffff:10.10.10.30 ::ffff:10.10.10.40 ::1
	midb_listen_ip=::

	# /etc/gromox/midb_list.txt
	/var/lib/gromox/user/mail1.gro.at ::ffff:10.10.10.20 5555
	/var/lib/gromox/user/mail2.gro.at ::ffff:10.10.10.30 5555
	/var/lib/gromox/user/mail3.gro.at ::ffff:10.10.10.40 5555
	/var/lib/gromox/domain/ ::ffff:10.10.10.20 5555

	# /etc/gromox/event.cfg
	event_hosts_allow=:: ::ffff:10.10.10.20 ::ffff:10.10.10.30 ::ffff:10.10.10.40 ::1
	event_listen_ip=::

	# /etc/gromox/timer.cfg
	timer_hosts_allow=:: ::ffff:10.10.10.20 ::ffff:10.10.10.30 ::ffff:10.10.10.40 ::1
	timer_listen_ip=::

.. important::
   Please note that the *.txt files include the ACLs and are named as such (not *.cfg)

.. important::
   Please make sure that your firewall configuration enables the additional ports used:
   exmdb(tcp/5000), midb (5555/tcp), timer (6666/tcp) and event (33333/tcp).

**Central Admin API control**

Since using multiple servers requires some logic also for the mailbox store creation
process, using the topology of Share-nothing clusters still would require the
``gromox-mbop`` mailbox creation process to be able to access the nodes storage.

Generally, in multi-server environments, it is recommended to use the hostname prefixing
technique as outlined in the above section. This way, the mailbox is "pinned" as per its
directory to the mailbox directory it has defined. This only means that this mailbox
is associated with the hostname (primarily), however the real "processing" hostname is
defined by the user<>mailbox relation.

To create the mailboxes with the hostname-included pathname, this setting is required for
grommunio-admin API to create the mailbox appropriately:

.. code-block:: text

	options:
	  serverExplicitMount: true

Ideally, this configuration block would be included in the grommunio Admin API config
tree, for example as a new yaml under ``/etc/grommunio-admin-api/conf.d/multiserver.yaml``.

.. important::
   Just because your nodes have shared access to all the nodes configured does not mean
   that the applications serving the mailboxes are strictly tied to the hostname. The
   effective processing is determined by the relationship of the user<>server association.

**Storage Structure**

This setup distributes user directories across multiple nodes while maintaining
a unified logical structure. Traditionally, shared-storage clusters use a
clustered filesystem, ensuring efficient replication by storing different user
directories as separate inode entries. This reduces filesystem load and improves
performance.

.. note::
   Before the release of 2025.01.1 it was required for all nodes to have access to
   ``/var/lib/gromox/user`` in this example, because some components (especially IMAP
   and POP3) were accessing the object files via direct IO.

.. note::
   Depending on the type of setup for the Admin API, it might still be viable to have
   shared storage access available. If the Admin API is a headless node (for example),
   you might want to have access to the storage so that the API is able to create
   the stores for you.

Share-nothing clusters
----------------------

With grommunio 2025.01.1, components no longer require direct I/O access to
mailbox storage. Instead, requests are handled as follows:

- If a request does not belong to the local node, the system will:

  - Retrieve data via RPC from the node where the mailbox resides, or

  - Use proxy mode to forward the request and return the response.

**Key Benefits of Share-Nothing Clusters**

- No shared storage required:
  Each node operates independently, eliminating the need for a common filesystem.

- Improved high availability:
  Nodes can be distributed across different locations without centralized storage dependencies.

- Compatibility with modern HA solutions:

This architecture natively supports cloud-native environments such as
Kubernetes, other containerized environments, and various replication techniques
for failover scenarios.

From a configuration standpoint, share-nothing clusters remain identical to
shared-storage setups, except that nodes do not need access to each other’s
mailboxes. Production deployments may benefit from additional replication
techniques for high availability.

Failover
--------

A cluster can also have strictly high availability requirements (e.g. five nines >99.999%). This
level of availability does require some cluster suite software to be able to failover in these
second-level failover switches. For implementing such scenarios covered by the enterprise
subscription, the workflow is roughly:

- Detect application/container/VM fail
- Activate standby application/container/VM
- Switch over application-level requests to new standby system

Failing over the entire cluster-stack of grommunio requires in its core a simple mysql-query to
be executed as well as a reload signal (SIGHUP) to main services (gromox-*). As per example:

.. code-block:: sql

	UPDATE users SET homeserver=8 WHERE homeserver=4;

and a subsequent following reload signal to reload any application caches.

All of this can be well controlled by well-established cluster services, such as Pacemaker or
similar products.

Switching "back" to normal operation can be done by for example re-balancing all users to all
available nodes in your installation:

.. code-block:: sql

	-- prepare environment
	SET @rownum = 0;
	SELECT COUNT(*) INTO @server_count FROM servers;

	-- reassign homeservers evenly
	UPDATE users
	JOIN (
	    SELECT
		maildir,
		(@rownum := @rownum + 1) AS rownum
	    FROM users
	    WHERE homeserver != 0
	    ORDER BY maildir
	) AS u_ordered
	ON users.maildir = u_ordered.maildir
	SET users.homeserver = (u_ordered.rownum - 1) % @server_count + 1
	WHERE users.homeserver != 0;

and again, followed by a subsequent reload of the core services (gromox-*).

Protocol / Component Flow
=========================

grommunio is a comprehensive communication and collaboration solution that
covers and delivers protocols with a vast variety of computer standards for
communication. The main protocols delivered by grommunio are:

Wire-level protocols:

- SMTP
- IMAP
- POP3

Application-level protocols (HTTP-based):

- RPC/HTTP (OutlookAnywhere)
- MAPI/HTTP
- EWS (Exchange Web Services)
- EAS (Exchange ActiveSync)
- CalDAV
- CardDAV

With these numerous protocols available, grommunio needs to have an effictient
component flow. Since protocols may be accessed in parallel for the same
dataset, grommunio takes care of parallelization and protocol tracking. To
ensure operation, security and functionality, grommunio uses a set of different
components as well as a plugin-based structure for larger components. This way,
components may be extended for future feature expansion and allows
nearly-realtime patches and updates. More complex setups gain from the
component/plugin architecture as the scalability of the components allow
various flavors of containerization and orchestration.

The following illustration shows the combined protocol and component flow for
grommunio Groupware based components:

.. image:: _static/img/diag_workflow_protocol.png
   :alt: Protocol and component flow of grommunio Groupware

Proxy capabilities
------------------

By default, grommunio's HTTP-based services are exposed through nginx. This
recommended mode of operation adds an additional layer of protection for
gromox's components, as nginx validates incoming HTTP requests before they are
processed by gromox. The internal nginx proxy configuration is not designed (nor
required) to horizontally scale requests; instead, grommunio supports load
balancers placed in front of it. These load balancers effectively serve as
reverse proxies with built-in load balancing logic. In such cases, it is
advisable to use a separate proxy in front of any services provided by
grommunio.

When gromox needs to process requests for a different node it is running on, the
internal exmdb logic code comes into play and forwards the traffic to the
appropriate node.

Grommunio supports various load balancers capable of handling tens of thousands
of connections per node. Since each installation may have unique configuration
requirements, the following sections aim to provide a foundation and inspire
custom setups. Please note that there are various extra options not directly
covered which are provided by other load balancers as well, such as NGINX Plus,
KEMP and/or others.

.. important::
   Please use these configuration sections as mere inspiration for a template
   of your own requirements. These examples do not claim to be complete in
   any way, as for example the forwarding of POP3 and IMAP are not available
   and your individual installation requirements might vary. The below shows an
   example with a distributed setup for users of a ~75k user environment. Also,
   these configuration files do not take specialized OpenID Connect or 2FA
   installations into account.

HAPROXY
~~~~~~~

.. code-block:: haproxy

	global
	 chroot /var/lib/haproxy
	 daemon
	 log /dev/log local0

	 group haproxy
	 user haproxy

	 maxconn 80000
	 stats timeout 30s
	 ulimit-n 165000

	 ca-base /etc/ssl/certs
	 crt-base /etc/ssl/private
	 ssl-default-bind-ciphers AES128-GCM-SHA256:AES128-SHA:AES128-SHA256:AES256-GCM-SHA384:AES256-SHA:AES256-SHA256:DES-CBC3-SHA:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-SHA256:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-CHACHA20-POLY1305:TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256
	 ssl-default-bind-options ssl-min-ver TLSv1.2 no-tls-tickets
	 tune.ssl.default-dh-param 2048

	defaults
	 log global
	 mode http
	 option httplog
	 option dontlognull

	 retries 3
	 timeout connect 5s
	 timeout queue 30s
	 timeout client 300s
	 timeout server 300s

	frontend fe_http

	 bind :80
	 http-response set-header Strict-Transport-Security max-age=31536000
	 http-response set-header X-Content-Type-Options nosniff
	 http-response set-header X-Forwarded-Proto https
	 http-response set-header X-Frame-Options SAMEORIGIN

	 acl whitelist-ip src -f /etc/haproxy/ha_whitelist_main.txt
	 http-request silent-drop if HTTP_1.0
	 acl blacklist-ip src -f /etc/haproxy/ha_blacklist_main.txt
	 http-request deny if blacklist-ip

	 mode http
	 maxconn 80000

	 bind *:443 ssl crt /etc/haproxy/proxy.pem alpn h2,http/1.1
	 no option httpclose
	 option forwardfor
	 redirect scheme https code 301 if !{ ssl_fc }

	 # bind quic4@:443 ssl crt /etc/haproxy/proxy.pem alpn h3
         # http-after-response add-header alt-svc 'h3=":443"; ma=60'

	 acl fe_haproxy hdr(host) -i mail.grommunio.at
	 acl admin dst_port 8443
	 acl auth path_beg /auth
	 acl autodiscover path_beg -i /autodiscover
	 acl chat path_beg /chat
	 acl colibri path_beg /colibri-ws
	 acl dav path_beg /dav
	 acl default path_beg /
	 acl eas path_beg /Microsoft-Server-ActiveSync
	 acl ews path_beg /EWS
	 acl files path_beg /files
	 acl hdr_connection_upgrade hdr(Connection) -i upgrade
	 acl hdr_upgrade_websocket hdr(Upgrade) -i websocket
	 acl mapi path_beg /mapi
	 acl meet path_beg /meet
	 acl oab path_beg /OAB
	 acl office path_beg /office
	 acl rpc path_beg /rpc/rpcproxy.dll
	 acl web path_beg /web

	 use_backend be_adminnodes if admin fe_haproxy
	 use_backend be_authnodes if auth fe_haproxy
	 use_backend be_chatnodes if chat fe_haproxy
	 use_backend be_filesnodes if files fe_haproxy
	 use_backend be_gromoxnodes if autodiscover
	 use_backend be_gromoxnodes if ews fe_haproxy
	 use_backend be_gromoxnodes if mapi fe_haproxy
	 use_backend be_gromoxnodes if rpc fe_haproxy
	 use_backend be_meetnodes if colibri fe_haproxy
	 use_backend be_meetnodes if hdr_connection_upgrade hdr_upgrade_websocket meet fe_haproxy
	 use_backend be_meetnodes if meet fe_haproxy
	 use_backend be_officenodes if office fe_haproxy
	 use_backend be_webnodes if dav fe_haproxy
	 use_backend be_webnodes if default fe_haproxy
	 use_backend be_webnodes if eas fe_haproxy
	 use_backend be_webnodes if web fe_haproxy

	frontend fe_imaps
	 mode tcp
	 option tcplog
	 bind :993 name imaps
	 acl blocklist-imap src -f /etc/haproxy/ha_blacklist_imap.txt
	 tcp-request connection reject if blocklist-imap
	 default_backend be_imaps

	frontend fe_pop3s
	 mode tcp
	 option tcplog
	 bind :995 name pop3s
	 acl blocklist-pop3s src -f /etc/haproxy/ha_blacklist_pop3.txt
	 tcp-request connection reject if blocklist-pop3s
	 default_backend be_pop3s

	frontend fe_smtp
	 mode tcp
	 option tcplog
	 bind :25 name smtp
	 acl blocklist-smtp src -f /etc/haproxy/ha_blacklist_smtp.txt
	 tcp-request connection reject if blocklist-smtp
	 default_backend be_smtp

	frontend fe_submission
	 mode tcp
	 option tcplog
	 bind :587 name submission
	 acl blocklist-submission src -f /etc/haproxy/ha_blacklist_submission.txt
	 tcp-request connection reject if blocklist-submission
	 default_backend be_submission

	frontend fe_admin
	 mode http
	 option httplog
	 option forwardfor
	 bind *:8443 ssl crt /etc/haproxy/proxy.pem alpn h2,http/1.1
	 acl whitelist-admin src -f /etc/haproxy/ha_whitelist_admin.txt
	 http-request deny if !whitelist-admin
	 default_backend be_adminnodes

	backend be_gromoxnodes
	 stick-table type ip size 10240k expire 60m
	 stick on src
	 balance roundrobin
	 option forwardfor
	 option redispatch
	 server gromox01 mail01.grommunio.at:443 check ssl verify none
	 server gromox02 mail02.grommunio.at:443 check ssl verify none
	 server gromox03 mail03.grommunio.at:443 check ssl verify none
	 server gromox04 mail04.grommunio.at:443 check ssl verify none
	 server gromox05 mail05.grommunio.at:443 check ssl verify none

	backend be_chatnodes
	 stick-table type ip size 10240k expire 60m
	 stick on src
	 balance roundrobin
	 option forwardfor
	 option http-server-close
	 option redispatch
	 server chat01 chat01.grommunio.at:443 check ssl verify none
	 server chat02 chat02.grommunio.at:443 check ssl verify none

	backend be_webnodes
	 stick-table type ip size 10240k expire 60m
	 stick on src
	 balance roundrobin
	 option forwardfor
	 option http-server-close
	 option redispatch
	 server web01 web01.grommunio.at:443 check ssl verify none
	 server web02 web02.grommunio.at:443 check ssl verify none

	backend be_meetnodes
	 stick-table type ip size 10240k expire 60m
	 stick on src
	 balance url_param room
	 hash-type consistent
	 option forwardfor
	 option http-server-close
	 option redispatch
	 server meet01 meet01.grommunio.at:443 check ssl verify none
	 server meet02 meet02.grommunio.at:443 check ssl verify none

	backend be_filesnodes
	 stick-table type ip size 10240k expire 60m
	 stick on src
	 balance roundrobin
	 option forwardfor
	 option http-server-close
	 option redispatch
	 server files01 files01.grommunio.at:443 check ssl verify none
	 server files02 files02.grommunio.at:443 check ssl verify none

	backend be_officenodes
	 stick-table type ip size 10240k expire 60m
	 stick on src
	 balance roundrobin
	 option forwardfor
	 option http-server-close
	 option redispatch
	 server office01 office01.grommunio.at:443 check ssl verify none

	backend be_authnodes
	 stick-table type ip size 10240k expire 60m
	 stick on src
	 balance roundrobin
	 option forwardfor
	 option http-server-close
	 option redispatch
	 server auth01 auth01.grommunio.at:443 check ssl verify none

	backend be_adminnodes
	 stick-table type ip size 10240k expire 60m
	 stick on src
	 balance roundrobin
	 option forwardfor
	 option http-server-close
	 option redispatch
	 server admin01 admin01.grommunio.at:8443 check ssl verify none

	backend be_imaps
	 stick-table type ip size 10240k expire 60m
	 mode tcp
	 balance source
	 stick on src
	 server imap01 classic01.grommunio.at:993 check
	 server imap02 classic02.grommunio.at:993 check

	backend be_pop3s
	 stick-table type ip size 10240k expire 60m
	 mode tcp
	 balance source
	 stick on src
	 server pop01 classic01.grommunio.at:995 check
	 server pop02 classic02.grommunio.at:995 check

	backend be_smtp
	 mode tcp
	 balance source
	 server smtp01 classic01.grommunio.at:25 send-proxy
	 server smtp02 classic02.grommunio.at:25 send-proxy

	backend be_submission
	 mode tcp
	 balance source
	 server submission01 classic01.grommunio.at:587 send-proxy
	 server submission02 classic02.grommunio.at:587 send-proxy


NGINX
~~~~~

Please note that this configuration does not cover other relevant settings from
nginx in a large scale-out installation, please consult nginx manual of certain
sclability related configuration directives, for example (but not limited to)
`worker_processes`.

The optimal value depends on many factors including the the number of available
CPU cores, the load pattern and more. When in doubt, setting the number of
available CPU cores is a good starting point.

.. code-block:: nginx

	upstream be_smtp {
	 server classic01.example.com:25;
	 server classic02.example.com:25;
	}

	upstream be_submission {
	 server classic01.example.com:587;
	 server classic02.example.com:587;
	}

	upstream be_imaps {
	 server classic01.example.com:993;
	 server classic02.example.com:993;
	}

	upstream be_pop3s {
	 server classic01.example.com:995;
	 server classic02.example.com:995;
	}

	upstream be_gromoxnodes {
	 server mail01.grommunio.at:443;
	 server mail02.grommunio.at:443;
	 server mail03.grommunio.at:443;
	 server mail04.grommunio.at:443;
	 server mail05.grommunio.at:443;
	}

	upstream be_adminnodes {
	 server admin01.grommunio.at:8443;
	}

	upstream be_archivenodes {
	 server archive01.grommunio.at:443;
	}

	upstream be_chatnodes {
	 server chat01.grommunio.at:443;
	 server chat02.grommunio.at:443;
	}

	upstream be_webnodes {
	 server web01.grommunio.at:443;
	 server web02.grommunio.at:443;
	}

	upstream be_filesnodes {
	 server files01.grommunio.at:443;
	 server files02.grommunio.at:443;
	}

	upstream be_officenodes {
	 server office01.grommunio.at:443;
	}

	upstream be_meetnodes {
	 server meet01.grommunio.at:443;
	 server meet02.grommunio.at:443;
	}

	upstream be_authnodes {
	 server auth01.grommunio.at:443;
	}

	stream {
	 server {
	  listen 25;
	  proxy_pass be_smtp;
	 }
	 server {
	  listen 587;
	  proxy_pass be_submission;
	 }
	 server {
	  listen 993;
	  proxy_pass be_imaps;
	 }
	 server {
	  listen 995;
	  proxy_pass be_pop3s;
	 }
	}

	server {
	 listen 80;
	 listen [::]:80;

	 server_name _;

	 error_log /var/log/nginx/error.log;
	 access_log /var/log/nginx/access.log;

	 return 301 https://$server_name$request_uri;
	}

	server {
	 listen 443 ssl http2;
	 listen [::]:443 ssl http2;
	 # listen 443 quic reuseport;
	 # listen [::]:443 quic reuseport;

	 server_name _;

	 ssl_certificate /etc/nginx/proxy.pem;
	 ssl_certificate_key /etc/nginx/proxy.key;
	 include ssl_params;

	 error_log /var/log/nginx/error.log;
	 access_log /var/log/nginx/access.log;

	 charset utf-8;

	 proxy_buffers 4 256k;
	 proxy_buffer_size 128k;
	 proxy_busy_buffers_size 256k;
	 proxy_http_version 1.1;
	 proxy_pass_header Authorization;
	 proxy_pass_header Date;
	 proxy_pass_header Server;
	 proxy_pass_request_headers on;
	 proxy_read_timeout 3h;
	 proxy_read_timeout 60s;

	 more_set_input_headers 'Authorization: $http_authorization';
	 more_set_headers -s 401 'WWW-Authenticate: Basic realm="mail.grommunio.at"';
	 proxy_set_header Accept-Encoding "";
	 proxy_set_header Connection "Keep-Alive";
	 proxy_set_header Host $host;
	 proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	 proxy_set_header X-Forwarded-Proto $scheme;
	 proxy_set_header X-Real-IP $remote_addr;

	 client_max_body_size 0;

	 location ~* /admin { proxy_pass https://be_adminnodes; }
	 location ~* /auth { proxy_pass https://be_authnodes; }
	 location ~* /antispam { proxy_pass https://be_adminnodes/antispam; }
	 location ~* /archive { proxy_pass https://be_gromoxnodes/archive; }
	 location ~* /autodiscover { proxy_pass https://be_gromoxnodes/Autodiscover; }
	 location ~* /colibri-ws { proxy_pass https://be_meetnodes/meet; }
	 location ~* /chat { proxy_pass https://be_chatnodes/chat; }
	 location ~* /EWS { proxy_pass https://be_gromoxnodes/EWS; }
	 location ~* /files { proxy_pass https://be_filesnodes/files; }
	 location ~* /mapi { proxy_pass https://be_gromoxnodes/mapi; }
	 location ~* /meet { proxy_pass https://be_meetnodes/meet; }
	 location ~* /office { proxy_pass https://be_officenodes/office; }
	 location ~* /Microsoft-Server-ActiveSync { proxy_pass https://be_webnodes/Microsoft-Server-ActiveSync; }
	 location ~* /oab { proxy_pass https://be_gromoxnodes/OAB; }
	 location ~* /Rpc { proxy_pass https://be_gromoxnodes/Rpc; }
	 location ~* /web { proxy_pass https://be_webnodes/web; }

	 location / { proxy_pass https://be_gromoxnodes/; }
	}


SMTP
----

SMTP is the main protocol used for mail transport. For illustration purposes,
there is a distinction made of the internal mail flow as well as external mail
flow.

The entire transport is configured to be gapless in terms of email processing.
This way, grommunio protects also from internal outbreaks (for example spam or
virus distribution).

The configuration outlined here defines the default configuration set. In many
cases, even more sophisticated setups might be envisioned, as with extended
integration of security appliances. The following workflows provide the process
definition which provides a view to where a preferred hook might be
implemented.

Incoming
~~~~~~~~

.. image:: _static/img/diag_workflow_smtpin.png
   :alt: SMTP workflow of incoming mails

Mails are processed as follows (applies to incoming and outgoing):

#. The included Postfix MTA receives messages and passes them to
   grommunio-antispam via the *Milter* mail filter protocol.
#. grommunio-antispam checks the message for spam.
   If configured, grommunio-antispam (optionally) passes the message to an
   anti-virus processing service.
#. The response from the anti-virus check is read back by antispam.
#. The response from antispam is read back by Postfix.
#. Postfix evaluates the contents of the Envelope-From and Envelope-To address
   pair to make the decision if this is i incoming or outgoing mail.
#. Incoming mail is relayed to the gromox-delivery process, which converts the
   mail to a MAPI object and places it in the user's mailbox.
#. Outgoing mail is delivered to a configured relayhost or to the next MX
   destination that is responsible for the target address.

.. image:: _static/img/diag_workflow_smtpout.png
   :alt: SMTP workflow of outgoing mails

RPC/HTTP, MAPI/HTTP & EWS workflow
----------------------------------

.. image:: _static/img/diag_workflow_rpcews.png
   :alt: RPC & EWS workflow

The main protocols used by grommunio for MAPI-based connectivity - as used for
example with Microsoft Outlook - are:

- RPC/HTTP (OutlookAnywhere)
- MAPI/HTTP
- EWS (Exchange Web Services)

All of these protocols are HTTP-based which is why these are routed through the
shipped nginx web server, primarily for security, scalability and monitoring
reasons.

MAPI-based connections are processed as follows:

#. In the first stage, the endpoint utilizes AutoDiscover
   (`https://docs.microsoft.com/en-us/exchange/architecture/client-access/autodiscover <https://docs.microsoft.com/en-us/exchange/architecture/client-access/autodiscover>`_)
   technology (with Authentication) to discover which service endpoint URL is
   responsible for it.
#. If the AutoDiscover endpoint ends up at the same service (If not, it will be
   redirected to the other endpoint URL), nginx routes the connection directly
   to the gromox-http service which handles the connection.
#. For access to the users' mailbox, gromox-http's emsmdb plugin connects to
   the exmdb plugin for mailbox data delivery.

Exchange ActiveSync (EAS)
-------------------------

.. image:: _static/img/diag_workflow_eas.png
   :alt: Exchange ActiveSync (EAS) workflow

The main protocol used for mobile devices and tablets is Exchange ActiveSync
(EAS). EAS is a synchronization state-based protocol which uses state data to
determine its current synchronization status. EAS is often synonymously
referred to as "Push Mail", since it is permanently connected to its service
and listening for updates. As such, EAS is recommended as protocol for mobile
devices especially over unreliable networks, such as cellular networks. While
it is possible to connect certain clients, including Microsoft Mail and
Microsoft Outlook, it is strongly discouraged to do so. Compared to its more
performing alternatives, such as MAPI/HTTP, the EAS protocol is slower for bulk
data transfer or large to very large (10 GB+) mailboxes. At last, the EAS
protocol only delivers a subset of features available to other protocols.

EAS-based connections are processed as follows:

#. In the first stage, the endpoint utilizes AutoDiscover
   (`https://docs.microsoft.com/en-us/exchange/architecture/client-access/autodiscover <https://docs.microsoft.com/en-us/exchange/architecture/client-access/autodiscover>`_)
   technology (with Authentication) to discover which service endpoint URL is
   responsible for it.
#. If the AutoDiscover endpoint ends up at the same service (If not, it will be
   redirected to the other endpoint URL), nginx routes the connection to
   grommunio-sync which natively provides the /Microsoft-Server-ActiveSync
   endpoint to its device.
#. For access to the users' mailbox, grommunio-sync connects to gromox-zcore
   which delivers PHP-MAPI interfaces to access
#. gromox-http via exmdb plugin for mailbox data delivery.

POP3
----

.. image:: _static/img/diag_workflow_pop3.png
   :alt: POP3 workflow

POP3 workflow

IMAP
----

.. image:: _static/img/diag_workflow_imap.png
   :alt: IMAP workflow

IMAP workflow

Authentication
--------------

.. image:: _static/img/diag_workflow_auth.png
   :alt: Authentication workflow

Authentication workflow
