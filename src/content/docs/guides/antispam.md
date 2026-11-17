---
title: "Antispam with grommunio-antispam (Rspamd)"
description: "Check, test, tune and operate the Rspamd-based grommunio-antispam service: web UI, GTUBE, Bayes training, allow/deny lists, authentication checks, backup."
sidebar:
  label: "Antispam (Rspamd)"
  order: 20
---

grommunio-antispam is the mail filter of a grommunio installation. It is a packaged
build of [Rspamd](https://rspamd.com/) with grommunio integration and a dedicated
Redis instance. Postfix hands every message to it before the message reaches a
mailbox or leaves the system, and its verdict decides whether a message is
delivered, tagged as spam, greylisted or rejected.

This guide walks through the service as it is shipped with the grommunio
Appliance: how mail flows through it, how to read its decisions, how to test it
safely, how to train it without degrading it, and which parts of its state you
must back up. At the end you have a filter whose behaviour you can explain from
its history and logs instead of adjusting thresholds blindly.

:::note[Container and Kubernetes deployments]
With [Docker Compose](/admin/container_core/) or the
[Helm chart](/admin/kubernetes/), grommunio-antispam runs in gromox-core.
The checks and the Rspamd configuration on this page apply, with these
differences:

- Run the commands inside the core container (`docker exec gromox-core ...`,
  `kubectl -n grommunio exec grommunio-core-0 -- ...`) and use
  `supervisorctl status` or `supervisorctl restart grommunio-antispam`
  instead of `systemctl`.
- The web interface password is `ADMIN_PASS`. gromox-core rewrites
  `worker-controller.inc` on every start, so a password reset as described in
  the knowledge base does not last; change `ADMIN_PASS` instead.
- Only `/var/lib/grommunio-antispam` and the Redis data are on volumes.
  Changes under `/etc/grommunio-antispam/local.d/` (thresholds, multimap
  configuration) are lost when the container is recreated. Mount your own
  files into gromox-core (`docker-compose.override.yml`, or
  `core.extraVolumes` and `core.extraVolumeMounts` in the chart). The map
  files from step 8 are below `/var/lib/grommunio-antispam` and persist.
- Junk folder learning (`grommunio-spam-run.sh`) runs daily at 04:40 by
  cron and is enabled by default; there is no `grommunio-spam-run.timer`.
:::

## How it fits together

Rspamd is a modular filter. Each check (SPF, DKIM, DMARC, DNS blocklists, Bayes,
fuzzy hashes, regular-expression rules, URL reputation, anti-virus hooks, ...)
inserts a *symbol* with a weight into the result. The sum of the weights is the
*score*; the score is compared against the configured thresholds and yields an
*action*. There is no single yes/no decision, which is why diagnosing a
misclassified message always means looking at its symbols.

| Component | Listens on | Role |
| --- | --- | --- |
| Postfix `smtpd` | 25, 587 | Receives mail and passes it to grommunio-antispam over the milter protocol (`smtpd_milters = inet:localhost:11332`) |
| `rspamd_proxy` worker | `127.0.0.1:11332`, `[::1]:11332` | Milter endpoint for Postfix; forwards to the scanning workers and applies the verdict |
| `normal` worker | `127.0.0.1:11333`, `[::1]:11333` | Scans messages and produces symbols, score and action |
| `controller` worker | `127.0.0.1:11334`, `[::1]:11334` | Web interface, HTTP API, learning, statistics; reached through the Admin UI path `/antispam/` |
| Redis instance `redis@grommunio` | `127.0.0.1:6379` | Bayes tokens, history, greylisting and rate-limit state, neural network data, DMARC reporting data |
| `gromox-delivery-queue` / `gromox-delivery` | port 24 (`virtual_transport = smtp:[::1]:24`) | Receive the accepted message from Postfix and store it in the mailbox |

The processing sequence for an incoming message is:

1. Postfix receives the message and calls grommunio-antispam through the milter
   interface (`milter_protocol = 6`).
2. grommunio-antispam evaluates the message (and, if configured, hands it to an
   anti-virus scanner) and returns action, score and headers.
3. Postfix applies the action: `reject` becomes a permanent SMTP error,
   `soft reject`/`greylist` a temporary one, `add header` adds the header
   `X-Spam: Yes` to the message, and accepted messages are relayed to
   `gromox-delivery-queue`.
4. `gromox-delivery` converts the message to a MAPI object. If `lda_junk_rules`
   in `/etc/gromox/gromox.cfg` matches one of the message headers, the message
   is placed in *Junk E-mail* instead of the Inbox
   (see [gromox.cfg(5)](/man/gromox-cfg-5/)). The directive is empty by
   default.

Outgoing mail submitted on port 587 passes the same milter; there
grommunio-antispam performs DKIM/ARC signing rather than filtering. Signing is
set up in the [post-installation guide](/guides/post-install/). The overall mail
flow is shown in the [architecture](/admin/architecture/) chapter.

Paths that matter:

| Path | Content |
| --- | --- |
| `/etc/grommunio-antispam/` | Configuration tree of the packaged Rspamd (generic Rspamd documentation uses `/etc/rspamd/` for the same layout) |
| `/etc/grommunio-antispam/local.d/` | Your settings; merged into the shipped defaults |
| `/etc/grommunio-antispam/override.d/` | Your settings; replace the shipped section entirely |
| `/etc/grommunio-antispam/local.d/worker-controller.inc` | Controller password for the web UI |
| `/etc/grommunio-antispam/local.d/redis.conf` | Connection to the `redis@grommunio` instance (`read_servers`/`write_servers`) |
| `/etc/grommunio-antispam/maps.d/` | Shipped maps (allowlists for SPF/DKIM/DMARC, redirectors, suspicious TLDs, ...); do not edit |
| `/etc/grommunio-antispam/modules.d/`, `scores.d/` | Shipped module defaults and symbol scores; do not edit |
| `/var/lib/grommunio-antispam/` | Service data: DKIM keys (`dkim/`), statistics (`stats.ucl`, `rspamd.rrd`), cached maps, the maps you create |
| `/var/log/grommunio-antispam/rspamd.log` | Scan log (one line per message with action, score and symbols) |
| `/etc/redis/grommunio.conf`, `/var/lib/redis/default/` | Configuration and persistence (`dump.rdb`) of the Redis instance, i.e. the learned state |

Files ending in `.conf` configure a module or the actions; files ending in
`.inc` (for example `worker-controller.inc`, `options.inc`) are included into a
section of the main configuration. Never edit the shipped files outside
`local.d/` and `override.d/`; they are replaced on package updates. The service
runs as user `groas`, group `grommunio`; everything it must read has to be
readable by that account.

## Prerequisites

- A working grommunio installation with mail flow, see [Quickstart](/admin/quickstart/)
  and the [post-installation guide](/guides/post-install/).
- Root shell access to the server (all commands below run there).
- A working recursive DNS resolver on the server. Almost every reputation
  check (SPF, DKIM, DMARC, DNS blocklists, URL lists) is a DNS query. Public
  resolvers rate-limit blocklist queries; use a local recursive resolver.
- The Rspamd controller password (set during setup). If you do not know it,
  reset it as described in [Antispam: reset the password](/kb/antispam/).
- Outbound UDP port 11335 if you want the public fuzzy-hash feeds to work.

## 1. Check services and configuration

Start every analysis with a state check. If a service is down or the
configuration does not parse, no filter result is meaningful.

```bash
systemctl is-active grommunio-antispam postfix redis@grommunio
rspamadm configtest
rspamc stat
ss -ltnp | grep -E ':(24|25|587|11332|11333|11334)\b'
postconf -n | grep -Ei 'milter|virtual_transport'
journalctl -u grommunio-antispam --since "30 minutes ago" --no-pager
tail -n 20 /var/log/grommunio-antispam/rspamd.log
```

Expected result:

- all three services report `active`;
- `rspamadm configtest` ends with `syntax OK`;
- `rspamc stat` prints scan counters and the learned counts per statfile
  (both are low on a fresh system);
- the three Rspamd ports are bound to `127.0.0.1` and `::1` only;
- `postconf -n` shows `smtpd_milters = inet:localhost:11332`,
  `milter_protocol = 6` and `milter_default_action = accept`.

`milter_default_action = accept` means that Postfix accepts mail unscanned
when grommunio-antispam is unreachable (fail-open). Change it to `tempfail`
only if you prefer deferred mail over unfiltered mail during an outage.

Warnings in the journal or the log need judgement. DNS failures, unreadable
maps or broken local includes are operational errors; missing statistics on a
system without mail volume are not.

```bash
rspamadm configdump -m
rspamadm configdump actions
rspamadm configdump redis
```

`configdump -m` lists every module and whether it is enabled; `configdump
<section>` prints the effective, merged configuration of one section, which is
the fastest way to see whether a file in `local.d/` had the intended effect.

## 2. Open the web interface

The Rspamd controller is not exposed on its own port. The Admin UI's nginx
vhost proxies it under the Admin port (`location /antispam/` in
`/usr/share/grommunio-admin-common/nginx.d/antispam.conf`):

```plaintext
https://mail.example.com:8443/antispam/
```

The same URL is configured as the *Antispam* application link in the Admin UI
app launcher (`rspamdWebAddress` in `/etc/grommunio-admin-common/config.json`,
see [Application links](/admin/administration/#application-links-and-server-side-configuration)).
Log in with the controller password from
`/etc/grommunio-antispam/local.d/worker-controller.inc`. To change it, follow
[Antispam: reset the password](/kb/antispam/) and restart `grommunio-antispam`.

The interface has these tabs:

| Tab | Use |
| --- | --- |
| Status | Uptime, scanned messages, actions distribution, learned counts |
| Throughput | Rate of scans and actions over time; useful after policy or DNS changes |
| Configuration | Effective action thresholds and the maps Rspamd knows about |
| Symbols | All registered symbols with their weights and descriptions |
| Scan/Learn | Paste a message to scan it or learn it as spam/ham |
| Test selectors | Check which values a selector extracts from a message before writing rules |
| History | The most recent scans with sender, recipient, subject, action, score, symbols and scan time |

The controller distinguishes a read-only password (`password`) from a
privileged one (`enable_password`); learning, editing maps and changing
settings from the UI need the privileged level. The appliance sets only
`password`, so the same password grants both levels. Connections from the
server itself are trusted (`secure_ip = "127.0.0.1"` and `"::1"` in the shipped
`worker-controller.inc`), which is why `rspamc` on the server works without a
password. Keep the controller reachable from the management network only; do
not publish port 11334.

The Admin UI dashboard additionally shows antispam statistics. The Admin API
fetches them from the controller (`antispamUrl`, default
`http://localhost:11334`, endpoints `stat`, `graph`, `errors`) and the Admin
UI displays them when `loadAntispamData` is enabled.

## 3. Understand actions, scores and symbols

Check the thresholds that are in effect:

```bash
rspamadm configdump actions
rspamadm configdump -g
```

The shipped defaults are:

| Action | Threshold | Effect |
| --- | --- | --- |
| `no action` | below 4 | Message is accepted |
| `greylist` | 4 | Message is deferred with a temporary SMTP error on the first attempt (soft reject, "Try again later"); a retry after 5 minutes is accepted |
| `add header` | 6 | Message is accepted and the header `X-Spam: Yes` is added |
| `reject` | 15 | Message is rejected with a permanent SMTP error |

Further actions exist without thresholds: `soft reject` (used by greylisting and
rate limits), `rewrite subject`, `discard` and `quarantine`. Do not change
thresholds before you have observed real mail for a while; almost every
misclassification is better fixed at the symbol that caused it.

To change a threshold, create a file in `local.d/`:

```ini title="/etc/grommunio-antispam/local.d/actions.conf"
reject = 15;
add_header = 6;
greylist = 4;
```

Symbol weights live in group files (`local.d/<module>_group.conf`); the
`Symbols` tab shows the effective values. `configdump -g` prints the same on
the command line. Always run `rspamadm configtest` after editing and reload the
service (the unit defines a reload action that sends `SIGHUP`):

```bash
rspamadm configtest
systemctl reload grommunio-antispam
```

### Headers and Junk folder placement

For the `add header` action the proxy worker sets `X-Spam: Yes` (header name
configurable with `spam_header` in `local.d/worker-proxy.inc`). Additional
diagnostic headers such as `X-Spamd-Result`, `X-Spam-Status` or
`Authentication-Results` are produced by the `milter_headers` module, whose
`use` list is empty by default; enable them in
`local.d/milter_headers.conf` if you want the verdict visible in every
message:

```ini title="/etc/grommunio-antispam/local.d/milter_headers.conf"
use = ["x-spamd-result", "x-spam-status", "authentication-results"];
```

By default a tagged message is delivered to the Inbox with the `X-Spam` header;
it is then up to the client to filter it. To have `gromox-delivery` file tagged
messages into *Junk E-mail* server-side, set `lda_junk_rules` in
`/etc/gromox/gromox.cfg` to the header/value pair the filter adds and restart
`gromox-delivery`:

```ini title="/etc/gromox/gromox.cfg"
lda_junk_rules=X-Spam=Yes
```

Messages filed into Junk E-mail this way are also what the automatic spam
learning run (section 6) picks up, so a wrong `add header` verdict would be
reinforced. Combine server-side Junk placement with a false-positive review.

## 4. Scan a first message

Create a harmless synthetic message and scan it with `rspamc symbols`. Read the
symbols, not only the action: synthetic messages lack a real `Received` chain
and use unresolvable domains, so they score higher than a real message would.

```bash
cat > /tmp/ham.eml <<'EOF'
From: Alice Example <alice@example.com>
To: Bob Example <bob@example.com>
Subject: Antispam validation test
Date: Mon, 7 Sep 2026 10:00:00 +0200
Message-ID: <ham-001@example.com>
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8

Hello,

this is a harmless internal test message for antispam validation.
EOF

rspamc symbols < /tmp/ham.eml
```

Expected result: an action of `no action` or `add header` with symbols that
explain the score, such as missing authentication results (`R_SPF_NA`,
`R_DKIM_NA`, `DMARC_NA`) and symbols about the message structure. A test
message scored as `add header` does not indicate a broken filter; it indicates
that the data does not resemble production mail.

To emulate the SMTP context of a real delivery, pass the connecting IP, HELO,
envelope sender and recipient:

```bash
rspamc --ip 203.0.113.10 --helo mx.partner.example --from alice@partner.example --rcpt bob@example.com symbols < /tmp/ham.eml
```

`rspamc` connects to the local controller; from other hosts, or if the local
addresses are removed from `secure_ip`, pass the controller password with
`-P <password>`.

## 5. Test spam detection with GTUBE

GTUBE is a harmless test string that every spam filter must treat as spam. It
lets you verify the reject path without storing real spam.

```bash
cat > /tmp/gtube.eml <<'EOF'
From: Sender Example <sender@example.net>
To: Alice Example <alice@example.com>
Subject: GTUBE function test
Date: Mon, 7 Sep 2026 10:05:00 +0200
Message-ID: <spam-gtube-001@example.net>
MIME-Version: 1.0
Content-Type: text/plain; charset=UTF-8

This is a safe spam-filter test message.
XJS*C4JDBQADN1.NSBN3*2IDNEN*GTUBE-STANDARD-ANTI-UBE-TEST-EMAIL*C.34X
EOF

rspamc symbols < /tmp/gtube.eml
```

Expected result: `Action: reject`, `Score: 15.00 / 15.00` and the symbol
`GTUBE`. To test the whole chain including Postfix, send the same body from an
external mailbox to a user on the server; the sender should receive a rejection
and the message should appear in the History tab with the `GTUBE` symbol.

:::caution
Rspamd knows additional GTUBE-like patterns for the other actions. They are
disabled by default (`gtube_patterns` in `local.d/options.inc`) and must stay
disabled in production, because they allow a sender to force a verdict.
:::

## 6. Train Bayes in a controlled way

The Bayes classifier (`BAYES_SPAM` / `BAYES_HAM`) is only as good as its
training data. Learn unambiguous spam as spam and confirmed false positives as
ham. Do not feed unreviewed user reports into it.

```bash
rspamc learn_spam /tmp/gtube.eml
rspamc learn_ham /tmp/ham.eml
rspamc stat
```

Expected result: the learned counts in `rspamc stat` and on the Status tab
increase. The classifier stays silent until it has seen `min_learns` messages
(200) in both classes, so a fresh system does not produce `BAYES_*` symbols
for a while. This is normal: rules, reputation and authentication checks carry
the filter until then.

The appliance ships the classifier with the Redis backend and with
`autolearn = true` (`override.d/classifier-bayes.conf`): messages that end in
`reject` are learned as spam and messages with a negative score as ham,
automatically. Check the effective configuration with:

```bash
rspamadm configdump classifier
```

Autolearning fills the classifier quickly, but it also means that the
classifier learns the mistakes of the other modules. If you see `BAYES_SPAM`
on legitimate mail from a sender that was previously rejected for other
reasons, learn a few of those messages as ham to correct it.

### Automatic spam learning from the Junk folder

The package ships `grommunio-spam-run.service` and `grommunio-spam-run.timer`
(daily, `Persistent=true`, randomised start). The service runs
`/usr/sbin/grommunio-spam-run.sh`, which iterates over all users from the
grommunio database, selects the messages in each user's *Junk E-mail* folder
from the mailbox database and learns them as spam with `rspamc learn_spam`
(exporting them with `gromox-exm2eml`, an alias of
[gromox-export(8)](/man/gromox-export-8/), where necessary). The timer is
installed but disabled by default. Inspect it before enabling it:

```bash
systemctl cat grommunio-spam-run.service
systemctl cat grommunio-spam-run.timer
systemctl is-enabled grommunio-spam-run.timer
```

Learning is separate from deleting. The unit invokes the script without
arguments; only when the script is started with `-d` does it also delete the
learned messages with [gromox-mbop(8)](/man/gromox-mbop-8/) `delmsg`, which is
a hard delete. Do not enable deletion blindly: a message a user filed into
Junk by mistake would be learned as spam and then removed. If you want
deletion, create a drop-in that changes `ExecStart` rather than editing the
packaged unit.

Enable the timer once the Junk folder workflow is communicated to users and a
false-positive process exists:

```bash
systemctl enable --now grommunio-spam-run.timer
systemctl start grommunio-spam-run.service
journalctl -t grommunio-spam-run --since "10 minutes ago" --no-pager
rspamc stat
```

The script logs through `systemd-cat` with the identifier
`grommunio-spam-run`, so filter the journal with `-t`, not only with `-u`.
Expected result: one "Learning spam for user ..." line per learned message (none
if no user has filed anything into Junk yet) and a growing spam learn counter
in `rspamc stat`. A "MySQL-Connection couldn't be established" error means the
script could not read `/etc/gromox/mysql_adaptor.cfg` or reach the database.

There is no equivalent automatic ham run in the package. Ham training stays a
manual, reviewed step: collect confirmed false positives, learn them with
`rspamc learn_ham`, and keep the source messages until the next review.

## 7. Read history and symbols to diagnose a misclassification

The History tab is the shortest path from a user complaint to the cause. Open
the message in question and read sender, recipient, subject, action, score,
scan time and the list of symbols with their weights. Only then decide whether
DNS, IP/domain reputation, content, an attachment, a URL, Bayes or a local rule
was responsible.

On the command line, the scan log contains the same information, one line per
message with queue ID, IP, sender, action, scores and symbols; correlate it
with Postfix by queue ID:

```bash
grep '<queue-id>' /var/log/grommunio-antispam/rspamd.log
journalctl -u postfix --since "2 hours ago" --no-pager | grep '<queue-id>'
mailq
```

The `Symbols` tab shows every check that exists and its weight. Use it as the
starting point for tuning: if one symbol regularly fires on legitimate mail,
check DNS, local maps, authentication of the sender and several real examples
before changing its weight. Raising a threshold to hide one symbol lowers the
protection for every other message.

Work through misclassifications in this order:

```plaintext
Message classified wrongly?
  -> Are SPF, DKIM and DMARC results of the sender correct?
  -> Is the reputation of IP, domain and URLs plausible (RBL/URL symbols)?
  -> Did BAYES_* or NEURAL_* contribute, and was the training data right?
  -> Did a local rule, map or override contribute?
  -> Only then: add a narrow allow/deny entry or exception
```

Allowlisting first hides DNS, authentication, reputation or training problems
instead of fixing them.

## 8. Allow and deny lists with multimap

Exceptions are useful and dangerous at the same time. Keep the rule definition
in `local.d/` and the dynamic lists in a separate directory under
`/var/lib/grommunio-antispam/`, so that package defaults stay untouched and the
lists can be backed up, versioned or maintained by a tool. Rspamd watches map
files and reloads them on change; no service reload is required for list
edits.

Create the directory, owned by the service account, and the rules:

```bash
install -d -m 0750 -o groas -g grommunio /var/lib/grommunio-antispam/maps
```

```ini title="/etc/grommunio-antispam/local.d/multimap.conf"
ALLOWLIST_SENDER_DOMAIN {
  type = "from";
  filter = "email:domain";
  map = "/var/lib/grommunio-antispam/maps/allowlist_sender_domain.map";
  score = -5.0;
  description = "Allowlisted sender domains reviewed by mail operations";
}

ALLOWLIST_SENDER_ADDRESS {
  type = "from";
  filter = "email";
  map = "/var/lib/grommunio-antispam/maps/allowlist_sender_address.map";
  score = -5.0;
  description = "Allowlisted sender addresses reviewed by mail operations";
}

DENYLIST_SENDER_DOMAIN {
  type = "from";
  filter = "email:domain";
  map = "/var/lib/grommunio-antispam/maps/denylist_sender_domain.map";
  score = 8.0;
  description = "Denylisted sender domains reviewed by mail operations";
}

DENYLIST_SENDER_ADDRESS {
  type = "from";
  filter = "email";
  map = "/var/lib/grommunio-antispam/maps/denylist_sender_address.map";
  score = 8.0;
  description = "Denylisted sender addresses reviewed by mail operations";
}
```

Create the lists (one entry per line), set permissions and activate:

```bash
printf '%s\n' 'partner.example' > /var/lib/grommunio-antispam/maps/allowlist_sender_domain.map
: > /var/lib/grommunio-antispam/maps/allowlist_sender_address.map
: > /var/lib/grommunio-antispam/maps/denylist_sender_domain.map
: > /var/lib/grommunio-antispam/maps/denylist_sender_address.map
chown groas:grommunio /var/lib/grommunio-antispam/maps/*.map
chmod 0640 /var/lib/grommunio-antispam/maps/*.map
rspamadm configtest
systemctl reload grommunio-antispam
rspamc symbols < /tmp/ham.eml | grep -E 'ALLOWLIST|DENYLIST|Action|Score'
```

Expected result: a message from `partner.example` shows the
`ALLOWLIST_SENDER_DOMAIN` symbol with `-5.0`.

Notes on the rule syntax:

- `type = "from"` matches sender addresses; `filter` selects the part
  (`email` for the full address, `email:domain` for the domain,
  `email:user` for the local part). Add `extract_from = "smtp";` to match
  the envelope sender only, otherwise header and envelope are considered.
- Other useful types are `ip` (connecting IP or network, for trusted relays),
  `rcpt`, `header` and `url`.
- A score adjusts the total; the other checks still run. For an unconditional
  decision use `prefilter = true;` together with `action = "accept";` or
  `action = "reject";`, which short-circuits the scan. Reserve this for
  technical relays whose mail you have verified, never for large freemail or
  cloud provider domains.
- Verify with the *Test selectors* tab what a rule actually sees (envelope
  sender, header sender, IP, URL parts) before adding entries.

Every exception needs an owner, a reason, an example message and a review
date. After each change: `rspamadm configtest`, reload, scan or send a test
message, and check History, score and symbols.

:::note[Mail fetched from external accounts]
The appliance enables the `external_relay` module with a rule
`FETCHMAIL { strategy = "local"; }` (`local.d/external_relay.conf`). For
messages retrieved by fetchmail from external mailboxes, reputation checks
use the first non-local hop from the `Received` headers instead of the
local fetch, so IP-based allow and deny entries apply to the real sending
relay.
:::

## 9. Inbound authentication checks: SPF, DKIM, DMARC and ARC

These modules verify the identity of incoming mail. Outbound signing of your
own domains is a separate task, covered in the
[post-installation guide](/guides/post-install/).

| Module | What it checks | Main symbols |
| --- | --- | --- |
| `spf` | Whether the sending IP is authorised by the sender domain's SPF record | `R_SPF_ALLOW`, `R_SPF_FAIL`, `R_SPF_SOFTFAIL`, `R_SPF_NEUTRAL`, `R_SPF_NA`, `R_SPF_DNSFAIL`, `R_SPF_PERMFAIL` |
| `dkim` | Whether the message's DKIM signature validates | `R_DKIM_ALLOW`, `R_DKIM_REJECT`, `R_DKIM_TEMPFAIL`, `R_DKIM_PERMFAIL`, `R_DKIM_NA` |
| `dmarc` | Whether SPF or DKIM align with the `From:` domain and what the domain's policy requests | `DMARC_POLICY_ALLOW`, `DMARC_POLICY_REJECT`, `DMARC_POLICY_QUARANTINE`, `DMARC_POLICY_SOFTFAIL`, `DMARC_NA`, `DMARC_BAD_POLICY` |
| `arc` | Whether an ARC chain from forwarders or mailing lists is valid, preserving authentication across intermediaries | `ARC_ALLOW`, `ARC_REJECT`, `ARC_INVALID`, `ARC_NA`, `ARC_DNSFAIL` |

```bash
rspamadm configdump spf
rspamadm configdump dkim
rspamadm configdump dmarc
rspamadm configdump arc
```

By default the DMARC symbols only add to the score. The `dmarc` module can be
told to enforce the publisher's policy (`actions` section in
`local.d/dmarc.conf`, with `reject` and `quarantine`), and it can generate
aggregate reports (`reporting { enabled = true; ... }`, which needs Redis).
Enable enforcement only after you have watched the `DMARC_POLICY_*` symbols on
real mail for a while.

Many `*_DNSFAIL` and `*_TEMPFAIL` symbols in History point at the resolver,
not at the senders. Fix DNS first.

For your own domains, verify the published records from the server and use the
DNS health check in the domain view of the Admin UI:

```bash
dig TXT example.com +short
dig TXT _dmarc.example.com +short
dig TXT dkim._domainkey.example.com +short
```

Replace `dkim` with the selector you generated. Start DMARC for a domain in
monitoring mode and tighten it only after the reports show that all legitimate
senders, forwarders, newsletter systems and partner relays pass:

```plaintext
v=DMARC1; p=none; rua=mailto:dmarc@example.com
v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com
v=DMARC1; p=reject; rua=mailto:dmarc@example.com
```

## 10. Reputation and content checks: RBL, URL lists, fuzzy hashes, phishing

The `rbl` module queries DNS blocklists for the connecting IP, the `Received`
chain, HELO, sender domains and the URLs found in the message (Spamhaus ZEN
and DBL, SURBL, URIBL and others). Hits are strong signals but never look at
them in isolation: a legitimate service can be compromised, misconfigured or
listed temporarily.

```bash
rspamadm configdump rbl
rspamc symbols < /tmp/gtube.eml | grep -E 'RBL|URIBL|SURBL|DBL|PHISH|Action|Score'
```

The shipped list providers apply fair-use policies; high-volume commercial
installations may need a subscription with the list operator. All of these
checks depend on a fast local resolver.

The `fuzzy_check` module compares hashes of the message against shared fuzzy
storages, by default the public feeds of rspamd.com (`FUZZY_DENIED`,
`FUZZY_PROB`, `FUZZY_WHITE`). It needs outbound UDP port 11335:

```bash
rspamadm configdump fuzzy_check
rspamadm fuzzyping
```

The `phishing` module flags links whose visible text points to a different
domain than the actual target (`PHISHED_URL`) and can additionally use the
OpenPhish and PhishTank feeds (`openphish_enabled`, `phishtank_enabled`,
disabled by default). Exceptions for known redirectors and legitimate domains
are configured in `local.d/phishing.conf`; the shipped redirector list is
`maps.d/redirectors.inc`.

```bash
rspamadm configdump phishing
grep -Ei 'fuzzy|phish|surbl|resolve|timeout' /var/log/grommunio-antispam/rspamd.log | tail -n 50
```

Timeouts in this output usually mean a firewall, proxy or resolver problem
between the server and the external services.

## 11. Greylisting and rate limits

Both features create friction on purpose and therefore produce complaints if
enabled without monitoring.

Greylisting is active by default. When a message's score reaches the
`greylist` threshold (4), the proxy answers with a temporary SMTP error
("Try again later") and records the sender; a retry after the timeout
(`timeout = 300` seconds) is accepted, and the record expires after one day
(`expire = 86400`). Well-behaved MTAs retry; some notification systems and web
applications do not, which is the main source of false positives. Exempt them
by IP with `whitelisted_ip` in `local.d/greylist.conf`, or by domain in the
file the shipped configuration already references,
`/etc/grommunio-antispam/local.d/greylist-whitelist-domains.inc` (one domain
per line). To disable greylisting entirely, set `enabled = false;` in
`local.d/greylist.conf`.

The `ratelimit` module is loaded but has no rate buckets configured, so it
does nothing until you define them in `local.d/ratelimit.conf`. Buckets use
the syntax `"<messages> / <period>"`, for example `"10 / 1m"`, and can be
keyed by sender IP, sender address or authenticated user. Exceeding a limit
yields a soft reject. `postmaster` and `mailer-daemon` recipients are exempt
by default (`whitelisted_rcpts`); add your own application senders with
`whitelisted_ip` or `whitelisted_user`. A per-user limit also protects your
outbound reputation when an account is compromised and used to send spam.

Both modules store their state in Redis and do nothing without a Redis
connection.

```bash
rspamadm configdump greylist
rspamadm configdump ratelimit
rspamc stat | grep -Ei 'greylist|soft reject|reject|add header|no action'
```

Watch the `soft reject` and `greylist` counters and the History tab after
tightening either feature.

## 12. Neural network and training data

The `neural` module trains a small neural network on the symbol vectors of
messages that were confidently classified (`NEURAL_SPAM`, `NEURAL_HAM`). On
the appliance it is enabled with the default training parameters
(`max_trains = 1000` samples per class before the first training run). It
needs time and a sufficient volume of correctly classified mail before it
contributes anything; on a small installation it may never reach the training
threshold, which is harmless.

```bash
rspamadm configdump neural
rspamc stat
```

Treat Bayes and neural data as operational data. If Redis, the learned
statistics or your maps are lost, the filter still works from rules,
reputation and authentication, but the site-specific experience is gone and
the classifiers start again from zero.

## 13. Spam gets through: false negatives

When spam is delivered, do not raise global weights or lower thresholds
immediately. Work through:

1. Verify that the message passed the filter at all: Postfix must have reached
   the milter, and the message must appear in History or in `rspamd.log`.
2. Read action, score, symbols and scan time of that entry.
3. Check reputation results: RBL, URL lists and the DNS symbols. `*_DNSFAIL` or
   missing RBL symbols point to resolver problems.
4. Check whether `BAYES_HAM` or `NEURAL_HAM` pulled the score down and whether
   similar messages were wrongly learned as ham (autolearn learns ham from
   negative scores).
5. Check whether a local map, allowlist, prefilter or override reduced the
   score.
6. Learn the message as spam and re-scan a comparable message.
7. Write a custom rule only when you have repeatable examples and a clear
   cause.

```bash
postconf -n | grep -Ei 'milter'
journalctl -u postfix --since "2 hours ago" --no-pager | grep -Ei 'milter|reject|warning'
rspamc symbols < /tmp/suspect.eml
rspamc learn_spam /tmp/suspect.eml
rspamadm configtest
```

Save the suspicious message as a raw `.eml` (including all headers) before
scanning; a copy re-sent from a mail client loses the original SMTP context.

## 14. Anti-virus and external services

grommunio-antispam includes the Rspamd `antivirus` module (ClamAV, Sophos and
others) and the `external_services` module (ICAP gateways, oletools for
Office macro analysis, DCC, Pyzor, Razor, SpamAssassin, VirusTotal and more).
Both are inactive until a service block is configured; the package ships
`local.d/antivirus.conf.example` as a starting point. Whether to enable them
depends on your operating model, data protection requirements, latency budget,
licensing and existing security architecture.

```ini title="/etc/grommunio-antispam/local.d/antivirus.conf"
clamav {
  type = "clamav";
  servers = "127.0.0.1:3310";
  symbol = "CLAM_VIRUS";
  action = "reject";
  scan_mime_parts = true;
}
```

Every external check adds latency and a failure mode. Set timeouts
consciously, monitor the symbols and the error log, and make sure that a hung
scanner cannot block the mail flow:

```bash
rspamadm configdump antivirus
rspamadm configdump external_services
grep -Ei 'antivirus|clam|external|timeout|error' /var/log/grommunio-antispam/rspamd.log | tail -n 50
```

## Verification checklist

| Area | Check | Expected result |
| --- | --- | --- |
| Packages | `rpm -q grommunio-antispam postfix redis` | All packages installed |
| Services | `systemctl is-active grommunio-antispam postfix redis@grommunio` | All `active` |
| Configuration | `rspamadm configtest` | `syntax OK` |
| Ports | `ss -ltnp \| grep -E ':1133[234]\b'` | 11332, 11333, 11334 bound to `127.0.0.1` and `::1` only |
| Postfix integration | `postconf -n \| grep smtpd_milters` | `inet:localhost:11332` |
| Web UI | Open `https://mail.example.com:8443/antispam/` | Login works; Status tab shows counters |
| Admin UI | Dashboard | Antispam chart shows data |
| Ham scan | `rspamc symbols < /tmp/ham.eml` | Action and symbols explainable |
| Spam scan | `rspamc symbols < /tmp/gtube.eml` | `reject`, score 15, symbol `GTUBE` |
| End to end | Send a GTUBE message from an external mailbox | Rejected at SMTP level; entry in History and `rspamd.log` |
| Learning | `rspamc learn_spam` / `learn_ham`, then `rspamc stat` | Learned counters increase |
| Junk placement | Send a message that reaches `add header` to a test user | `X-Spam: Yes` header present; in Junk E-mail if `lda_junk_rules` is set |
| DNS | `dig TXT example.com`, `_dmarc.example.com`, selector record | SPF, DMARC and DKIM records resolve |
| Exceptions | Scan a message from an allowlisted domain | `ALLOWLIST_*` symbol present |
| Restart | `systemctl restart grommunio-antispam redis@grommunio postfix` | Services return; learned counts persist |
| Logs | `grep -Ei 'error|cannot|timeout' /var/log/grommunio-antispam/rspamd.log \| tail` | No recurring DNS, Redis or map errors |

## Troubleshooting

| Symptom | Likely cause | What to check / fix |
| --- | --- | --- |
| `rspamadm configtest` reports errors | Syntax error in a file under `local.d/` or `override.d/` | Fix the named file; remember that `.inc` and `.conf` files have different roles |
| Postfix logs `connect to Milter service inet:localhost:11332: Connection refused` | grommunio-antispam not running or proxy worker not bound | `systemctl status grommunio-antispam`, `ss -ltnp \| grep 11332`, journal and `rspamd.log` |
| Mail is accepted unscanned while the filter is down | `milter_default_action = accept` (shipped default, fail-open) | Decide deliberately between `accept` and `tempfail` |
| Web UI rejects the password | Controller password unknown or changed | Reset it as in [Antispam: reset the password](/kb/antispam/), restart the service |
| Web UI unreachable under `/antispam/` | Admin nginx vhost not running, or `rspamdWebAddress` not set | `systemctl status nginx grommunio-admin-api`; check `/etc/grommunio-admin-common/config.json` |
| Admin dashboard shows no antispam data | Admin API cannot reach the controller, or `loadAntispamData` disabled | `antispamUrl` in the Admin API configuration; `journalctl -u grommunio-admin-api` |
| `rspamc` asks for a password or is denied | Local addresses removed from `secure_ip` | Pass `-P <password>` or restore `secure_ip` in `local.d/worker-controller.inc` |
| Many `R_SPF_DNSFAIL`, `R_DKIM_TEMPFAIL`, `*_DNSFAIL`, RBL timeouts | Resolver slow, rate-limited (public resolver) or unreachable | Use a local recursive resolver; `dig` from the server; `rspamd.log` for `resolve`/`timeout` |
| `FUZZY_*` symbols never appear | Outbound UDP 11335 blocked | Firewall; `rspamadm fuzzyping` |
| `BAYES_*` symbols never appear | Fewer than `min_learns` (200) messages learned per class, or Redis unreachable | `rspamc stat`; `systemctl status redis@grommunio`; `rspamadm configdump redis` |
| `BAYES_SPAM` on legitimate mail | Autolearn picked up rejects of a sender that is legitimate | Learn several of the messages as ham; check why they were rejected |
| Redis errors after a package update | `local.d/redis.conf` replaced, leaving `.rpmnew`/`.rpmsave` | Compare and restore the file, see [post-update tasks](/admin/release_notes/#post-update-tasks) |
| Legitimate mail is delayed or bounced by the sender's system | Greylisting and a sender that does not retry | History shows `soft reject`/`GREYLIST`; add the sender to `whitelisted_ip` or `greylist-whitelist-domains.inc` |
| Allowlisted sender still scored | Map not readable by `groas`, wrong `filter`, or header vs envelope mismatch | File owner/permissions; `rspamadm configdump multimap`; *Test selectors* tab; `rspamc symbols` output |
| Junk folder messages are not learned | `grommunio-spam-run.timer` not enabled, or run failed | `systemctl status grommunio-spam-run.timer`; `journalctl -t grommunio-spam-run` |
| Tagged spam lands in the Inbox | `lda_junk_rules` unset (default) or does not match `X-Spam=Yes` | Set `lda_junk_rules` in `/etc/gromox/gromox.cfg`, restart `gromox-delivery`; compare with the headers of a delivered message |
| Spam passes with a low score | Local allowlist, prefilter or wrongly learned ham | Symbols in History; `rspamadm configdump multimap`; re-learn as spam |
| `/var/log/grommunio-antispam/rspamd.log` grows without bound | No log rotation configured for the file | Add a logrotate rule for the file (rotate, compress, `copytruncate` or reload the service) |

## Operating notes

**Monitoring.** Watch more than the reject counter: scan time, Postfix queue
length, DNS resolution, Redis state, mail volume, the error log of the
controller, free disk space and sudden shifts in the action distribution after
policy or DNS changes. The Status and Throughput tabs, the Admin UI dashboard
and the scan log together cover this.

```bash
systemctl is-active grommunio-antispam postfix redis@grommunio
mailq
rspamc stat
df -h /var/log /var/lib
tail -n 200 /var/log/grommunio-antispam/rspamd.log
```

**Logs.** The scan log is `/var/log/grommunio-antispam/rspamd.log`
(`type = "file"`, `level = "info"`, one line per message). The journal of
`grommunio-antispam.service` only holds start/stop messages; Postfix logs to
the journal. The History tab keeps the most recent scans in Redis (200 rows by
default, adjustable in `local.d/history_redis.conf`); it is a diagnostic
window, not an archive. Make sure `rspamd.log` is rotated; it grows by several
hundred megabytes per month on a busy server. For Gromox-side delivery logging
see [Debugging messaging services](/kb/debug_services/).

**Backup.** Rspamd stores no mail. Back up:

- `/etc/grommunio-antispam/` (all local configuration; already part of the
  `/etc/grommunio*` file backup described in
  [Operations](/admin/operations/#backup--disaster-recovery));
- `/var/lib/grommunio-antispam/` (DKIM signing keys under `dkim/`, your map
  files, statistics);
- the Redis snapshot of the `redis@grommunio` instance: `dump.rdb` in the
  directory named by the `dir` directive of `/etc/redis/grommunio.conf`
  (`/var/lib/redis/default/` on the appliance). It holds Bayes tokens,
  history, greylisting and rate-limit state and neural data. Snapshots are
  written according to the `save` rules of that file, so a file copy is at
  most a few minutes behind.

After a restore run `rspamadm configtest`, start the services, open the web
UI, repeat the GTUBE and ham scans and check that History and `rspamc stat`
show the restored state. Mail data itself lives in Gromox, not in Redis; see
[Backup and restore](/guides/backup-restore/).

**Updates.** Package updates may leave `.rpmnew`/`.rpmsave` files under
`/etc/grommunio-antispam/local.d/` (notably `redis.conf`). Compare them after
each update, then run `rspamadm configtest` and restart the service. Update
procedure: [Updating grommunio](/admin/operations/#updating-grommunio).

**High availability.** In a cluster, `/var/lib/grommunio-antispam` and the
Redis persistence live on the shared volume and `grommunio-antispam` is part
of the service resource group; see [High availability](/admin/high-availability/).

## Related pages

- [Antispam: reset the web UI password](/kb/antispam/)
- [Post-installation: DNS, DKIM signing and TLS](/guides/post-install/)
- [Architecture: mail flow](/admin/architecture/)
- [Administration: dashboard and application links](/admin/administration/)
- [Operations: updates and backup](/admin/operations/)
- [High availability](/admin/high-availability/)
- [Backup and restore](/guides/backup-restore/)
- [gromox.cfg(5): `lda_junk_rules`](/man/gromox-cfg-5/)
- [gromox-mbop(8)](/man/gromox-mbop-8/) and [gromox-export(8)](/man/gromox-export-8/)
- [Debugging messaging services](/kb/debug_services/)
