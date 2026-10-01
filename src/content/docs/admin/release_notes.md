---
title: "Release Notes"
description: "Release notes for grommunio, newest first. The current release, 2026.06.2, brings single sign-on across the whole suite, grommunio Web 5.1 with dark mode and OpenPGP, and gromox 3.11."
sidebar:
  order: 100
---

## grommunio 2026.06.2

- Release type: Minor
- Release date: 30th of September 2026
- General availability: Yes

grommunio 2026.06.2 is the first big update to 2026.06.1. Two things stand out. First, single sign-on now covers the whole suite: one grommunio login gets you into Web, Admin, Chat, Files, Meet and Archive. Second, grommunio Web 5 is here, with a new look, full dark mode, OpenPGP, a real document viewer and a lot more. Underneath, gromox moves to 3.11, and pretty much every other component got updated too.

**Highlights**

- **One login for everything** — grommunio Auth now sets up the Keycloak clients for Chat, Files, Meet, Archive and Admin for you, and keeps them up to date when packages are installed or upgraded. No more clicking through the Keycloak console per component.
- **grommunio Web 5.0 and 5.1** — redesigned interface with dark mode everywhere, a command palette (Ctrl+K), undo and redo, OpenPGP next to S/MIME, in-browser previews for almost any attachment, and Outlook-compatible categories.
- **gromox 3.11** — IMAP keywords and FETCH BINARY, better delegate and meeting handling, Sent Items copies for shared mailboxes, and a long list of Outlook and EWS fixes.
- **grommunio Files 34** with grommunio branding and SSO login.

**Single sign-on across the suite**

Until now, getting SSO to work for every component meant a fair amount of manual work in Keycloak. grommunio Auth now creates the clients for Chat, Files, Meet, Archive and Admin on its own, using a dedicated service account, and runs again automatically whenever one of those packages is installed or updated. Roles added later with grommunio-setup are hooked into SSO as well.

- **grommunio Admin** has a "Sign in with single sign-on" button on its login page (offered over HTTPS only). Local admin logins still work.
- **grommunio Chat** logs users in through Keycloak. The new `grommunio-admin chat sso enable|disable` command moves existing chat accounts between password login and SSO, for all domains or just one (`-d DOMAIN`).
- **grommunio Files** skips its own login form and sends users straight to Keycloak. The local form remains reachable at `/files/index.php/login?direct=1`.
- **grommunio Meet** authenticates through Keycloak too.
- **grommunio Archive** gained OpenID Connect login.
- **grommunio Web** talks to Files with the Keycloak access token, so there is no second login when opening files.

**grommunio Web 5.1**

The biggest update the web client has ever had, with more than 460 changes since 3.19. The major version jump is deliberate: the code, plugin interfaces and settings now carry the grommunio name throughout, and the last leftovers from the Zarafa days are gone.

- **New look** — redesigned interface with larger controls and a new sign-in screen; dark mode for the whole client, the bundled plugins and the document viewer, switchable from the top bar without a reload; JSON themes colour the entire client, including a separate logo for dark mode; two-tone folder icons, full-row folder highlighting and visible keyboard focus.
- **Getting around faster** — command palette on Ctrl+K to jump to any folder, view or settings page, or create new items; Ctrl+F goes straight to the search box (macOS users get Cmd and Option); undo and redo (Ctrl+Z / Ctrl+Y) for delete, move, copy, flag, read state, categories and calendar moves, enabled under Settings › General.
- **Mail** — OpenPGP (sign, encrypt, decrypt, verify) right next to S/MIME, with all cryptography in the browser and private keys stored in the user's mailbox, protected by their passphrase; a real document viewer for PDF, Word (including .doc), Excel and CSV, PowerPoint, OpenDocument, RTF, Markdown, code, images, audio, video and attached .eml messages; dragging several attachments into another compose window or onto the desktop as a ZIP; removing attachments from stored messages (can be switched off by admins); pictures pasted from Word; BIMI logos for senders that publish one and pass DMARC; sticky notes on mails, visible to everyone sharing the mailbox.
- **Works like Outlook** — categories are stored in the mailbox's master category list, so Web, Outlook and phones show the same names and colours (existing categories are carried over automatically); safe and blocked senders use the same Junk Email rule as Outlook.
- **Shared mailboxes, search and notifications** — conversation view in shared mailboxes; shared mailboxes can be reordered by drag and drop; search covers public folders and their subfolders, and search prefixes work in the user's language (German: *von:*, *an:*, *betreff:*); notifications can be limited to the own mailbox or chosen folders, show sender and subject, and can be silenced; the Copy/Move dialog suggests folders where mail from that sender was filed before.
- **New in 5.1** — profile pictures from a file, Gravatar or Libravatar, with a crop dialog; the appointment dialog shows which calendar a new appointment goes into; the scheduling view adapts to the attendee list; all delegates are listed in the settings; fully translated into 34 languages; pasted content no longer drags its fonts and colours into the editor; fixes for broken recurrences stopping the calendar from loading, links in mails opening relative to grommunio Web, printing images, timezone shifts on some appointments, and a batch of dark mode and layout issues.
- **Speed** — requests from the same login run in parallel, so a slow folder in one tab does not freeze the others; scripts, styles and translations are cached by the browser and shipped pre-compressed; the Files folder tree loads in under a tenth of a second for 40 folders (previously more than three seconds).
- **Security and the Cyber Resilience Act** — every release ships a software bill of materials in CycloneDX and SPDX format, all source files carry SPDX headers, and a published security policy covers how vulnerabilities are handled and reported. On top of that: stricter checks against cross-site requests on login, token and logout, one-time state for Keycloak logins, a per-mailbox limit on messages sent per minute, and a systemd timer that cleans up expired sessions.
- **For plugin developers** — the `Zarafa` namespace is now `Grommunio`, and `zarafa.*` xtypes, CSS classes and the settings root were renamed accordingly. 5.0 keeps compatibility aliases for now (except for CSS classes); `doc/plugin-namespace-migration.rst` explains the details.

**gromox 3.11**

New:

- IMAP keywords; IMAP flags are now stored in the mailbox, so they survive the loss of `midb.sqlite3`
- IMAP FETCH BINARY and BINARY.SIZE
- Shared mailboxes can keep a copy of mail sent as or on behalf of them in their own Sent Items (MessageCopyForSentAs / MessageCopyForSendOnBehalf, set with the new `gromox-mbop` commands `get-msgcopy`, `set-msgcopy` and `clear-msgcopy`; not honoured by EWS yet)
- New `lda_relay_unknown_recipients` option hands autoreplies and bounces for local addresses without a mailbox to the MTA, for split-domain setups
- EWS supports the Outlook for Mac reply, reply-all and forward drafts; EWS FindPeople and GetUserPhoto also look in personal contacts
- A .pst file can be imported into a public folder
- Short-lived cache for user and group lookups, which takes load off MariaDB/MySQL
- OpenPGP and GpgOL messages are recognised when converting mail
- The rule processor logs how its conditions were evaluated, which makes debugging rules a lot easier

Fixed:

- When a delegate answers a meeting request, the organiser now sees the invited person respond, not the delegate; meeting replies include the ORGANIZER property and name the delegate in SENT-BY
- Delegates who should not receive meeting copies still get proper delegate permissions
- Outlook's conversation view is faster again (its index was restored)
- 32-bit Outlook no longer crashes on a greyed-out out-of-office dialog
- Search folders no longer repopulate over and over
- More reliable reconnects to exmdb and LDAP after network trouble
- HTML bodies are detected correctly even when attachments come first
- Several recurring meeting fixes in the rule processor
- Folders no longer show fewer messages than they contain in some cases
- Much faster kdb2mt import of deeply nested messages
- A crash in the HTTP server on shutdown, and a number of EWS fixes (MoveItem/CopyItem, FindFolder, FindItem, meeting request handling)

Changed:

- RTF to HTML conversion runs in a separate process
- When importing from PST or Kopano, the root folder is no longer anchored to the top of the mailbox automatically; use `gromox-import -B` to place it

**grommunio Sync 2.6**

- Drafts from ActiveSync 16 clients with an empty Send element no longer abort the sync
- Saving a draft no longer messes up its attendees
- Messages can be sent straight from a sync when the client asks for it
- Chinese mail in codepage 936 is decoded as GB18030

**grommunio DAV 1.8**

- User impersonation
- Calendars that can only be read are offered read-only to clients; calendars that cannot be read are not listed at all
- Private appointments and tasks of other users are hidden, except for delegates; everyone else only sees free/busy
- Failed writes are reported back to the client instead of being silently dropped
- Fixed missing folders when browsing another user's mailbox

**grommunio Admin**

Web interface:

- New dashboard and login screen, matching grommunio Web
- Single sign-on login
- Folder permissions can be edited per user, straight from the user's folder tree
- A step-by-step DKIM guide, with the key output in the format you need
- Custom logo, favicon and title
- Works when served from a subpath
- Many smaller fixes: storage bars with no quota, user status editing, job title mapping, DMARC in the DNS check

API and CLI:

- OpenID Connect login (configured by grommunio Auth)
- `passwd --password-stdin` sets a password without it showing up in the process list
- Store owner, send-as and delegate management in the CLI; `user show` lists them
- Duplicate aliases are cleaned up automatically
- License and domain limits are checked when a user is reactivated
- More reliable LDAP group imports (case sensitivity) and a fix for AD user logins
- Permission checks on the user folder permission endpoints
- The web statistics and host status configuration moved into its own optional package, `grommunio-admin-api-mod-vts`

**Other components**

- **grommunio Files** — version 34, with grommunio branding and SSO. Fixed the ONLYOFFICE connection check when running from cron or occ and the X-Robots-Tag header warning, and turned off the OPcache setup warning that clashed with gromox. Files is now also packaged for Debian.
- **grommunio Keycloak** — 26.7.4. The update to 26.7.2 fixed CVE-2026-18963 (CVSS 9.1), so please do not skip this one. Non-interactive Debian installs no longer get stuck in a loop.
- **grommunio Meet** — SSO; conferencing secrets are generated properly instead of derived; a duplicate lobby component was dropped; updated theme.
- **grommunio Office** — fixed "ONLYOFFICE cannot be reached" caused by a missing `api.js` with Document Server 9.x.
- **grommunio Archive** — SSO support and an upgrade fix.
- **grommunio Antispam** — updated to 4.1.5.
- **grommunio Index 1.7** — indexes public folders as well (new `-P` option, included in `-A`; turn it off with `index_public=no`), and rebuilds a damaged index instead of failing every run.
- **mapi-header-php 2.3** — fixes yearly recurrences and some Keycloak token handling, and now carries the shared MAPI helpers that Web, Sync and DAV use. Web 5.1, Sync 2.6 and DAV 1.8 require it.
- **grommunio CUI** — no longer passes the admin password on the command line.
- **grommunio-setup** — creates credential files with tight permissions and connects newly added roles to SSO.

**Packaging and platforms**

- The new `grommunio-triggers` package bundles service restarts during upgrades. Before, a big upgrade could restart php-fpm so often that systemd gave up on it.
- Log rotation for php-fpm and DAV
- Builds for Ubuntu 26.04
- Plenty of Debian fixes: non-interactive installs, config file cleanup on purge, and permission issues in grommunio-setup-deb
- Branding for partners: logos, colours and titles can be set consistently across Web, Admin, the Keycloak login, Files, Meet, Archive and Antispam

**Before you upgrade**

- Check third-party grommunio Web plugins against the namespace change in 5.0. Most keep working thanks to the compatibility aliases, but plugin stylesheets using `zarafa-*` classes need to be renamed.
- User settings in grommunio Web move to the new format on first login. Nothing to do for administrators or users.
- If you script PST or Kopano imports, note the root folder change (introduced with gromox 3.10, included in this release) and use `gromox-import -B` where needed.

**Update**

Existing installations update through the usual grommunio update process; see [Updating grommunio](/admin/operations/#updating-grommunio).

**Acknowledgements**

Thanks to everyone who reported bugs, tested pre-releases and sent patches. Join the conversation in the [grommunio community](https://community.grommunio.com/).

## grommunio 2026.06.1

- Release type: Major
- Release date: 30th of June 2026
- General availability: Yes

grommunio 2026.06.1 is the largest release to date. Over a year of work reaches across the whole stack — from the C++ mail engine up to the boot ISO — with the guiding principle unchanged: you stay in charge of your own infrastructure. Mail, calendars, files, meetings, identities and, new in this release, your AI, all run on hardware you control, with nothing forced through someone else's cloud.

**Highlights**

- **grommunio AI** — an assistant inside grommunio Web, with your choice of model and where it runs (cloud or fully local).
- **gromox** — a lighter, faster engine: per-mailbox information-store workers, IMAP4rev2 (RFC 9051), a much-expanded EWS, and a from-scratch Offline Address Book.
- **Shared mailboxes on mobile** — grommunio-sync now does impersonation over Exchange ActiveSync.
- **Rebuilt admin** — the Admin Web interface is now fully TypeScript, with per-domain DKIM key generation from the UI.
- **A refreshed suite** — Meet (managed TURN relay), Files (new generation), Archive 1.4, Keycloak 26.6.4 and Desk 1.2.
- **A fresh platform** — the whole appliance rebuilt on openSUSE Leap 16.0, plus native Debian/Ubuntu `.deb` packages for the entire stack.

**grommunio AI**

The headline addition is grommunio AI, an assistant that lives inside grommunio Web. It can summarise a single mail or a whole thread, translate messages, and help you write — draft a reply, adjust its length or tone, fix the grammar. Smart Actions turn a mail into a meeting invitation, a task, a contact or a reply; each opens a pre-filled dialog, and nothing happens until you click.

What sets it apart is that **you decide which model runs it, and where**. grommunio AI speaks both the OpenAI-compatible and Anthropic API standards, which between them cover:

- free cloud tiers — Google Gemini (the shipped default), Groq and OpenRouter
- commercial APIs — OpenAI, Anthropic/Claude, Mistral, Azure OpenAI and the rest
- local models you host yourself — Ollama, LM Studio, vLLM, llama.cpp or LocalAI

Point it at a local Ollama setup and nothing leaves the building — no key, no outbound call, no third party reading your mail. Privacy was built to match: the plugin ships switched off; an admin must enable it, after which every user still opts in individually; all calls happen on the server and the API key stays in the server config where the browser never sees it. The one caveat: pointed at a cloud provider, the text you are working on does go to that provider — which is exactly why the local, nothing-leaves option is a one-line change away.

**gromox: a lighter, faster engine**

- **Lower memory** — the information store can split itself up, running a small worker process per mailbox under a lightweight director instead of one ever-growing process. Joined by a heap reaper that returns unused memory on a schedule, tighter IMAP-daemon limits, a shorter idle-cache timeout and a stack of plugged leaks, the result is simple: the server holds onto less memory, so more mailboxes fit on the same box.
- **IMAP4rev2 (RFC 9051)** — gromox is now one of the few open-source groupware servers to implement it: advertised behind the ENABLE handshake, with ESEARCH, LIST-EXTENDED, server-side MOVE, saved search results, UTF-8 mailbox names and the cleaner status/response codes.
- **Exchange Web Services** — greatly expanded: tasks, calendar occurrences with proper timezones, real delegate management with permission levels, and the full meeting workflow (invitations, cancellations, responses, and a server-side processor that keeps the organiser's calendar in step), plus streaming notifications and room/people lookups.
- **Offline Address Book** — a brand-new, from-scratch implementation of Microsoft's OAB format and its LZX compression, built and served by gromox itself, with no Microsoft code in it.
- **Better body rendering** — HTML/RTF/plain-text conversion can hand off to Pandoc and Chawan for higher fidelity, and the in-house RTF reader was overhauled for CJK text, right-to-left scripts and nested tables.
- **Notable fixes** — Outlook no longer loses appointments when opening a shared calendar; Outlook 2010 can log in again under OpenSSL 3; AutoDiscover stopped advertising a non-existent OWA endpoint (which had quietly broken Thunderbird setup); recurring meetings keep their timezones straight. The import and export tools were also renamed `gromox-import` and `gromox-export`.

**grommunio Web**

Besides being the new home of grommunio AI, the web client kept getting polished where it counts — composing, S/MIME, search and theming — the steady work that keeps it the most capable open-source Exchange web client around.

**Shared mailboxes on mobile, at last**

grommunio-sync now supports impersonation over Exchange ActiveSync, so a shared or functional mailbox can be put on a phone with full rights, signing in with your own account — something Exchange and Microsoft 365 do not offer over ActiveSync. gromox's AutoDiscover understands the combined `sharedmailbox!user` login and enforces it server-side, checking both who you are and whether you hold owner rights on the target, so the phone is set up straight against the shared store. As a safety net, a remote wipe on an impersonated session is dialled back to account-only, so nobody wipes a personal device by accident.

**A rebuilt admin, and DKIM out of the box**

- The Admin Web interface has been rebuilt in **TypeScript** — the whole codebase moved over, file by file, to a strictly-typed setup with no JavaScript left behind, for fewer runtime surprises and a console that is far easier to work on and contribute to.
- **DKIM** is now handled for you: generate a per-domain signing key right from the Admin UI and grommunio hands back the public record to paste into DNS — no more fishing around with `rspamadm` and `openssl`. This release also sorted out default and anonymous permissions on public folders and tightened several directory-integration paths. Once your records are published, grommunio's existing DNS health check confirms whether SPF, DKIM, DMARC, MX and the rest line up.

**The rest of the suite**

- **grommunio Meet** — a big refresh, including a central managed STUN/TURN relay (`turn.grommun.io`) for self-hosters who can't run their own, with a fallback over port 443 that looks like ordinary HTTPS and nearly always gets through; the whole Jitsi stack moved to a current build on JDK 17, and lobby and breakout rooms are on by default. You can still point it at your own coturn.
- **grommunio Files** — up a full generation: fresher, faster and more secure, with built-in collaborative in-browser editing of office documents, grommunio branding and single sign-on, and in-place self-upgrade of older installs. The self-hosted answer to OneDrive and SharePoint.
- **grommunio Keycloak** — moved to Keycloak 26.6.4, the identity provider behind single sign-on across Web, Admin, Files and Meet from one grommunio login; its configuration now lives under `/etc`, so settings survive upgrades.
- **grommunio Archive 1.4** — overhauled for the Leap 16.0 / PHP 8 base and running as a regular service: a web interface for searching and reviewing mail, full-text search underneath, and an SMTP listener that copies messages as they pass through — on top of archiving and retention rules, legal hold, deduplication, fingerprinting and verification, tagging, export/restore, audit logs, direct IMAP import, and bulk import from sources like Google Workspace and Microsoft 365.
- **grommunio Desk 1.2** — spell checking from your system languages, server-view zoom with reset, a right-click context menu (spelling suggestions, copy/paste), isolated per-server sessions, editable server names and a reload option, clearer title-bar icons, automatic settings migration on an updated Electron base, and assorted fixes (URL validation, macOS shortcuts, the server-view loading state, dialog buttons).
- **grommunio DAV** — can now publish the company Global Address List as a read-only CardDAV address book, and remembers per-folder CalDAV/CardDAV settings, so calendar colours and ordering set in Apple Calendar finally stick. **grommunio Index 1.6** made server-side full-text search more configurable and steadier under load.

**A fresh platform: openSUSE Leap 16.0**

The whole appliance was rebuilt on openSUSE Leap 16.0 — a current, maintained base with a newer kernel, toolchain and crypto stack. And it is not only the VM image: every guided install target moved to 16.0 — the VMware/OVA appliance, the install ISO, the offline all-in-one ISO for air-gapped sites, and the container/compose stack (now Leap 16.0 with MariaDB 11 and de-privileged). Networking switched to systemd-networkd, and grommunio-setup is now safe to re-run, so roles can be added or removed on a live system without a clean reinstall — on both 15.6 and 16.0.

**Debian, properly this time**

With 2026.06.1 there are native `.deb` packages for the whole stack — the gromox engine and every front-end — built the proper Debian way. The setup tooling learned to work out what it is running on and do the right thing: write apt sources, import signing keys into the keyring, and drive apt on Debian 13 and Ubuntu 24.04 and 26.04 LTS, right next to openSUSE and RHEL. The packages are reaching general availability deliberately, one component at a time and with selected partners first, so each one is proven before it goes out to everyone.

**Documentation, rebuilt**

docs.grommunio.com has been rebuilt from the ground up on a modern static-site stack, with fast search across every page and a clean split into User, Administration and Development sections. New material includes a high-availability clustering guide, a Kerberos single sign-on walkthrough for transparent domain-joined Outlook logins, a fuller Exchange-to-grommunio migration guide, and a rewritten container chapter for Leap 16.0.

**Supported Distributions**

As of 2026.06.1, grommunio supports installation and operation on:

- openSUSE Leap 16.0 / SLES 16 (appliance base)
- Debian 13
- Ubuntu 26.04 LTS

**Update**

Existing installations update through the usual grommunio update process; see [Updating grommunio](/admin/operations/#updating-grommunio).

**Acknowledgements**

A big thank-you to the customers and partners whose feedback shaped this release, and to everyone who builds grommunio out in the open. Join the conversation in the [grommunio community](https://community.grommunio.com/).

## grommunio 2025.01.2

- Release type: Minor
- Release date: 18th of April 2025
- General availability: Yes

**Highlights**

- Polished grommunio Web with updated editors (TinyMCE 7.8.0) and viewers (PDF.js 5.1.91), plus improved handling of shared distribution lists.
- Per-user service controls are now fully enforceable – administrators can enable/disable Web, ActiveSync, and CalDAV/CardDAV access per user via Admin API/CLI, and these restrictions are honored across all components.
- Enhanced mobile and CalDAV synchronization reliability, including better compatibility with iOS all-day calendar events and support for alternate login names.
- Licensing improvement: Only active (non-disabled) user accounts count toward license limits now, aligning license usage with actual active users.
- Numerous stability and performance fixes across the stack (mail processing, logging, memory management, etc.) further improve reliability.
- grommunio Setup for DEB: Shipping through the package grommunio-setup, first semi-automatic installations can be made on DEB-based distributions (Debian, Ubuntu)
- EWS: Further improvements in our EWS improve interoperability, especially with eM Client.

**Enhancements**

- User Service Management: Introduced support for per-user service enablement toggles. The Admin API/CLI now allows toggling user access to Web, EAS (ActiveSync), and DAV services, and the groupware components respect these settings (enforcing service restrictions for disabled users).
- Licensing: Improved licensing logic by counting only active users against license limits. Disabled or archived users no longer consume a license slot, providing more accurate license utilization for organizations.
- Web Interface Updates: Upgraded grommunio Web’s third-party components for a better user experience. The rich text editor was updated to TinyMCE 7.8.0, the PDF viewer to pdf.js 5.1.91, and the HTML sanitizer to DomPurify 3.2.5, bringing performance, security, and functionality improvements. Additionally, the calendar’s monthly view now once again displays the recurring-event icon, and the Web UI can show details of public and shared distribution lists (making it easier to view members of shared contacts lists).
- Plugin and Compatibility Improvements: The optional Kendox plugin is now disabled by default to streamline the Web interface and avoid issues with unused integrations. Also, grommunio Web and related services have officially dropped support for PHP 7.x, requiring PHP 8+ — this update aligns the platform with modern PHP versions for better performance and security.
- Mailing List and Address Book: Gromox now supports nested groups in permission checks. This enhancement means distribution lists can contain other lists and still resolve correctly, improving flexibility in complex group permissions. Furthermore, internal address-book handling was improved for internationalized entries – additional UTF-16/32 codepage variants are recognized, enhancing support for contacts or attachments with non-Latin characters and internationalized domain names.
- CalDAV/CardDAV (grommunio DAV): Refined the DAV service for better performance and interoperability. Logging verbosity has been reduced by removing overly extensive debug output (resulting in cleaner logs and lower overhead), and the default fastcgi_read_timeout for the DAV web service was extended (to 360 seconds) to accommodate lengthy calendar or address book operations without timing out. The DAV service also now passes through error responses to clients correctly (ensuring CalDAV/CardDAV clients receive proper error codes), and its dependency stack was updated for stability.
- General Performance & Stability: Numerous low-level enhancements were made in the core services (Gromox). Memory management was improved in several modules (e.g., automatic buffer reallocation and proper out-of-memory signaling in zcore and exmdb components) to increase scalability under high load. These changes, along with other under-the-hood optimizations, reduce the likelihood of service crashes and improve overall system efficiency.

**Bug Fixes**

- Shared Mailbox Distribution Lists: Fixed issues with shared and public distribution lists in grommunio Web. Users can now successfully send emails to a shared distribution list, and the UI properly expands and displays members of shared/public distribution lists. (Previously, attempts to use or view members of these lists could fail.)
- Alternate Login Name Fixes: Resolved multiple problems related to alternate user login names (aliases). Users who log in with an alternate email/username can now change their password from the user portal (this was not possible before). In addition, synchronization issues in grommunio Sync when using alternate logins have been addressed, so mobile devices and EAS clients will sync correctly even if the user is logged in via an alias.
- Calendar All-Day Events: Corrected an ActiveSync calendaring bug that affected Apple iOS clients. All-day events created on one day would sometimes appear spanning two days on iOS devices – this has been fixed to ensure all-day events consistently show on the intended single day across all clients.
- IMAP Protocol Compliance: Fixed a minor formatting error in IMAP responses – the BODYSTRUCTURE response now includes a needed space that was previously omitted. This compliance fix improves compatibility with IMAP email clients and ensures no parsing issues due to the missing whitespace.
- Email Content Conversion: Fixed an issue in the email conversion library that could cause HTML-formatted emails to be converted incorrectly. Email content (HTML to plain text or other formats) now converts as expected, preserving formatting and ensuring the message is readable in all clients.
- Stability Fixes: Addressed rare crashes in the mail processing backend. In particular, issues in the rule processor and mail delivery modules caused by memory allocator mismatches have been resolved. These fixes eliminate certain intermittent crashes (for example, when processing server-side mail rules or delivering messages under high load), resulting in a more robust and reliable server.
- PST Export: Resolved a problem that prevented Outlook PST exports in certain scenarios. Gromox no longer includes an unintended PR_MESSAGE_SIZE property in export streams, which means exporting mailboxes to PST format will now complete successfully (the extra data that caused PST exports to fail has been removed).

**General Notes**

This version is the last version to include builds for openSUSE 15.5. Any future updates demand strict PHP 8.1+ compatibility. Please update installations still running on openSUSE 15.5 accordingly (for example by use of `grommunio-update upgrade`)

The above lists cover the most significant changes in grommunio 2025.01.2. Dozens of smaller fixes and improvements are included in this release to refine overall functionality and security.

## grommunio 2025.01.1

- Release type: Major
- Release date: 29th of January 2025
- General availability: Yes

**Highlights**

**Appliances now based on openSUSE 15.6**

The latest grommunio appliance releases ship with openSUSE 15.6 as their foundation, benefiting from up-to-date security patches, improved stability, and modern hardware support.

**Performance Boost & Lower Resource Requirements**

Thanks to extensive enhancements in parallelization (especially for single-store, highly parallelized scenarios), the overall performance of the grommunio stack has improved while resource requirements (RAM, CPU, disk) have decreased.

**Keycloak 26.1 Integration**

grommunio now ships with Keycloak 26.1, including:

> - Refined SSO & identity management with expanded security controls.
> - Improved user federation for large-scale deployments, simplifying integration with heterogeneous directory services.
> - Advanced admin console features for streamlined configuration and audit trails.

**TinyMCE Upgrade from 4.9.11 to 7.6.1**

The grommunio Web’s email editor now leverages TinyMCE 7.6.1, providing:

> - Modernized UI/UX, especially on mobile and touch devices.
> - Enhanced performance and security, ensuring a smoother editing experience (like the content hover-bar).

**PHP 8.2 and 8.3 Support**

grommunio’s core and associated services are now fully compatible with PHP 8.2 and 8.3. Key benefits include:

> - Better performance and memory optimization.
> - Enhanced type and error-handling features for developers.
> - Extended grommunio Stack Upgrades and compliance.

**Enhanced Internet Mail Compliance**

grommunio continues to refine support for Internet mail standards. This ensures more robust and accurate parsing and generation of emails across a variety of clients and mail servers.

**New Features & Enhancements** **Share-Nothing Clusters**

Expanded from the previous release, clusters can be scaled out without relying on shared storage. This provides maximum flexibility in multi-node deployments and reduces potential bottlenecks or single points of failure.

**Parallelized Single Mailbox Access**

A key promise fulfilled: significant performance gains when multiple users or processes access large mailboxes simultaneously. The new parallelization logic helps distribute loads more efficiently, avoiding lock contention scenarios.

**Overhauled Indexing & Search**

Building on recent indexing improvements, search across emails, contacts, and other items is now quicker and more accurate while requiring less storage overhead.

**Massively Improved S/MIME**

Updates include refined clear-signed message handling, upgraded certificate validation, and improved out-of-the-box interoperability with various device classes.

**Per-User Feature Enablement**

Administrators can continue to leverage granular toggles to enable or disable Web, Sync (ActiveSync), and DAV services on a per-user basis, helping organizations fine-tune resource access.

**Timezone & Migration Compatibility**

Ongoing refinements ensure consistent scheduling across multiple protocols (CalDAV, EWS, MAPI) and more accurate data migration from legacy systems (Exchange, Communigate Pro, Kerio, Kopano, Zarafa).

**grommunio-Web Signature Templating**

A new feature allowing administrators and end users to define, customize, and manage standardized email signatures across the organization. This includes variables (e.g., name, title, department) for dynamic insertion, ensuring a consistent brand identity while reducing manual signature maintenance.

**EWS processing enhancements**

With a growing number of EWS clients using grommunio, certain specific flavors of EWS client implementations show the need for adoption in our EWS server-side processing code for enhanced compatibility. For example, 2025.01.1 includes improved timezone management for example with Apple clients and further enhancements for enhanced compatibility with emClient and Evolution.

**Development Process Updates**

- Monthly Point Releases: Starting with 2025.01.1, grommunio will deliver monthly point releases (e.g., 2025.01.2 in February).
- Annual Major Upgrade: There will be at least one major release each year, with larger feature overhauls and architectural improvements.

**Certification Initiatives**

With growing adoption by public sector and defense organizations, grommunio is actively pursuing certifications such as FedRAMP/NIST, FISMA, and BSI. This underscores the commitment to higher security standards and regulatory compliance.

**Roadmap for 2025.01.2**

- RFC 2184/2231: Enhanced handling of extended parameters in MIME headers.
- Trashed Mailboxes & Migration: Improvements for advanced mailbox handling across multiple migrations, including x400 addressing and undocumented MAPI attributes.
- grommunio Support v2: Expanding support for the setup stage for RHEL9, Debian 12, and Ubuntu 24.04.
- grommunio-files: Updated version with group folder management and modern authentication.

**Forthcoming in the next releases (previews available to selected partners)**

- Modern Authentication (OAuth2) for Outlook, IMAP, and POP3.
- Full HTML-based MR (Meeting Request) Processing in the Web UI.
- AI-Powered Features for enhanced user productivity.
- Extended rules & autoprocessing support

**Supported Distributions**

As of 2025.01.1, grommunio actively supports installation and operation on the following Linux distributions:

- RHEL9 / EPEL9
- openSUSE 15.5+ / SLES 15.5+
- Debian 12
- Ubuntu 24.04

**Acknowledgements**

We would like to extend our sincere gratitude to our community, customers, and partners for their continued support, feedback, and contributions. A special thanks goes out to our active contributors: crpb, dahan, brad0, kasperk81, robert-scheck, orandev01, rnagy, walter, liske, steve, milotype, clique2015 and many others. Your insights drive our roadmap and make grommunio more robust, secure, and performant with each release.

## grommunio 2023.11.3

- Release type: Minor
- Release date: 16th of February 2024
- General availability: Yes

**Highlights**

- EWS is now fully supported to run with Microsoft Outlook for Mac as well as Apple native organization apps (Mail, Calendar, ...)
- S/MIME received updates for validation across various device classes
- IDN (internationalized) domains are now supported in GAL (Global Address Lists)
- CalDAV now supports iCalender free/busy information
- grommunio Web received polishing fixes since the last major design upgrade
- Support for Passkey authentication with grommunio Auth
- Documentation has received numerous updates, including a major documentation overhaul

**New Features**

- EWS has left the beta stage and is now enabled by default (See notes)
- The new rule processor (twostep_ruleproc) now supports Outlook-style public folders
- grommunio now provides 389DS schema via a selector in grommunio Admin
- Outgoing messages submission via postdrop is now supported
- grommunio Next is now available as technology preview in the repositories (requires Graph API)

**Enhancements**

- S/MIME related fixes to Web now enable multiple attachment download
- Unintended double-quotes in mails are now dropped around RFC 2047-style encodings
- Resolved a rare case where PR_TRANSPORT_MESSAGE_HEADERS had an extra byte
- Resolved a case where four extra bytes were added in front of the first transport header
- Semicolons in "Reply-To" headers are now handled correctly
- Proper handling for log messages enabling better fail2ban processing
- ICS requests can now be dumped for developer inspection
- Extensive dependency updates for Debian/Ubuntu based installations
- Various improvements to migration toolset
- Various mail processing enhancements (e.g. dot-stuffing)

**Notes on EWS**

As mentioned above, with EWS leaving the beta stage, the parameter `ews_beta=1` in `/etc/gromox/ews.cfg` is now obsolete. EWS is now enabled per default and the parameter is not required anymore.

**Acknowledgements**

We extend our heartfelt thanks to our customers, partners, and the community for their valuable input and feedback. Thanks to feedback from customers and the community, we have been able to track down EWS-related issues properly and have included the feedback in our evaluation process, leading to a better product for all.

We would especially like to thank the community for the overwhelming feedback, especially at FOSDEM <https://fosdem.org/2024/>.

**Last remarks**

The development, QA, and release teams, apologize that our public communication has been occasionally delayed. We've been very busy not only delivering a better product to you with a plethora of fixes and new features but also integrating new resources into the entire organization and infrastructure. It's amazing how many installations have hit production in the holiday season which required additional prioritization. Rest assured, there's big news coming up from grommunio, and you'll notice it.

## grommunio 2023.11.2

- Release type: Minor
- Release date: 28th of December 2023
- General availability: Yes

**Highlights**

- The appliance now ships with XFS as the default main filesystem
- IMAP performance has improved overall by a factor of 2 or more (SELECT/LIST/FETCH seqid renumbering removal)
- IMAP compatibility has significantly improved by handling EXPUNGE and STATUS commands properly
- Windows Mail now also works as an EAS client
- Enable Room and Equipment stores for AutoDiscover with Delegation (Shared Store)
- Enhanced search folder notifications (more improvements to come)

**New Features**

- IMAP now receives deletion events from other clients (OL/Web/EAS/EWS)
- gromox-mbop now supports time specifications to limit the deletion of messages of a certain age
- All daemons have received various config directives for file descriptor limits, with 512K instead of 2256 in systemd environments
- Support for XFS snapshots

**Enhancements**

- Enable gromox-mbop path specifications, such as *SENT/2024*
- RTF compressed MAPI properties now generate a complete header
- Free busy information is now more resilient to non-existing data (no information available)
- The basic authentication header is now fully RFC 7617 compliant
- The name service provider (NSP) now fully supports the Windows UTF-8 locale (Beta feature by Microsoft)
- Improved calendar item coverage for EWS
- Enhanced EWS CreateItem for Apple Mac Mail
- Repair Property ID/Tag swapping with TNEF objects
- Enhancements to ICS now reduce the number of sync issues due to broken items (imported e.g. from defective Kopano datasets)
- Better processing for calendar appointments (RDATE, Weekorder), displaying correct all-day events from broken sources as per OXCICAL spec recommendations
- Heap-use-after-free fix for free/busy requests in EWS
- Multi-LDAP has received robustness fixes for special cases (such as 389DS)
- Various fixes to free busy handling (related to scheduling)

**Acknowledgements**

Since the number of contributors keeps growing with each release, we now refrain from compiling a hand-curated list and instead ask anyone interested to head over to our git repositories and see the evolving community for yourself. Rest assured, grommunio thanks all its stakeholders: customers, partners, and the community alike.

## grommunio 2023.11.1

- Release type: Major
- Release date: 18th of November 2023
- General availability: Yes

**Highlights**

We are excited to announce the release of grommunio 2023.11.1. This update marks a significant milestone in our journey as a leading open-source groupware platform. With a suite of new features and enhancements, this release underscores our commitment to providing an enterprise-grade communication solution that is both comprehensive and secure.

**What's New**

- Enhanced EWS Functionality with support for Microsoft Outlook for Mac, Apple Mail, and Microsoft Outlook for Mobile
- Advanced Single Sign-On (SSO) with Active Directory environments (SPNEGO support)
- Redesigned User Interfaces, adhering to WCAG 2.1 guidelines for improved accessibility
- Performance improvements with grommunio Web and 25% faster end-to-end processing
- Alternative Logon Names Support, offering greater flexibility in identity management for complex enterprise needs
- Online Update and Upgrade Capabilities integrated with grommunio Admin
- Recipient Plus-Addressing and enhanced Mailbox DB Operations with grommunio-mbop
- Modern Authentication in grommunio Web with OpenID Connect including support for 2FA (Two-Factor Authentication)

**Enhancements**

- Various Fixes: Including support for non-receiving shared mailboxes and enhancements in imap, exmdb, and alias_resolve modules.
- Comprehensive IMAP (Large Literals and RFC 7888) and Productivity Enhancements
- Support for vCard 4.0 and improvements in 'oxvcard'
- Refined Folder and Message Delivery including improved 'create_folder' and 'movecopy_folder' RPCs

**Notes on EWS**

- To activate EWS Beta features, add `ews_beta=1` to `/etc/gromox/ews.cfg`
- Activation of `ews_pretty_response` is not supported by Mac Mail and is recommended not to be enabled as such
- The best supported EWS Client is currently Microsoft Outlook for Mac
- The upcoming EWS operations FindFolder and FindItem are expected to be released within the upcoming 2 weeks after release which enhances Apple's macOS apps most.

**Disclaimer: Public Beta Release of EWS Functionality**

- Intensive Development and Testing: The EWS functionality has undergone extensive development to achieve a modern and solid software architecture. This rigorous process ensures a high standard of quality, security, and functionality. However, as with any complex software endeavor, there may be unforeseen nuances in diverse real-world environments.
- Current Limitations: We acknowledge that two features – the FindItem operation and the Impersonation feature – are not yet included in this beta release. These features are currently undergoing thorough quality assurance testing. We anticipate their inclusion still within the 2023 release timeline, further enhancing the EWS functionality.
- Commitment to quality and security: Our team, in collaboration with our technology partners, has repeatedly validated the EWS functionality to ensure its security, data protection, and stability. We adhere to the highest standards to safeguard your experience.
- Feedback and continuous improvement: While we have invested considerable effort in testing, we acknowledge that the diverse and dynamic nature of IT environments can present unique scenarios. Therefore, we welcome and appreciate any feedback or reports of issues from our users. Your insights are invaluable in helping us refine and improve the EWS functionality.
- Support for subscription holders: With the release of this EWS functionality, it becomes a fully supported protocol within grommunio. Subscription holders are entitled to our full support for any queries or assistance related to EWS. For customers and hosters: Please approach your support representative if you need any planning for EWS rollout. As with every new big feature, it is recommended to plan the availability with care and our staff is committed to support you well.

**Acknowledgements**

We extend our heartfelt thanks to our customers, partners, and the community for their invaluable input and feedback, especially to:

- clique2015, robert-scheck, General-Aussie, steve, prandev01, crpb, rnagy, walter and many others

## grommunio 2022.12.1

- Release type: Major
- Release date: 24th of December 2022
- General availability: Yes

**Highlights**

- grommunio Appliance now on openSUSE 15.4 with many improvements, such as PHP 8.0
- General Availability of Multi-LDAP, worlds-first multi-backend groupware engine
- General Availability of Admin API for PowerShell (AAPIPS), a PowerShell interface for grommunio Admin
- General Availability of grommunio Desk, a multi-platform client for grommunio Web
- General Availability of grommunio Meet for Outlook, a plugin for Microsoft Outlook and grommunio Meet
- General Availability of grommunio Auth, SSO availability with grommunio (based on Keycloak)
- General Availability of native Dockerfiles and Kubernetes recipes for Gromox
- High performance data compression with zStandard (zstd)
- Public Folder synchronization for mobile devices
- High-performance rewrite of Autodiscover and Autoconfig
- High-performance rewrite of EWS (Exchange Web Services)
- DNS-Name based OEM whitelabeling for custom branding

**Enhancements**

- Availability of EAS 16.1 FIND command
- Full user resolution for Kopano migrations (--mbox-name/--user-map)
- Centralization of MAPI header files
- grommunio CUI is now fully translated in 22 languages
- Enhanced navigation controls of grommunio CUI
- Support for hidden contacts
- Automatic mapping of AD/Exchange Store Types (msExchRecipientDisplayType)
- Centralized MAPI header files for PHP consumers
- Default integration of grommunio-dbconf
- Implementation of hierarchy and permission model (ACLs) for public folders in Admin
- Mail-Queue management in grommunio Admin
- Large documentation updates, launch of Knowledge Base in Documentation Portal

The above list is not conclusive. As usual, numerous bug fixes and features have been included. The release notes just highlight major changes; Feel free to check out the detailed logs at GitHub (<https://github.com/grommunio>).

The official documentation covers the necessary steps for the update procedure.

**Contributions & Thanks**

Thanks to customers, partners and the entire community - the community for their ongoing contributions, especially to:

- MrPikPik, tiredofit, maddin200, artem, steve, thermi, milo, Bheam, crpb, rnagy, walter and many others

Special thanks to Microsoft Corporation for the productive cooperation on standards and protocols and to T-Systems International for the collaborative work on scale-out installations with highest enterprise demands.

## grommunio 2022.05.2

- Release type: Minor
- Release date: 31st of August 2022
- General availability: Yes

**Highlights**

- Support for PHP 8.0 and 8.1
- "SendAs" support (additionally to "Send on behalf of")
- Improved admin interface design and handling, including topic search
- Multi-Language Support with 22 languages
- Multiple dependency extensions for Platforms EL 8, Debian 11 and Ubuntu 22.04
- Hierarchy for Public Folders in grommunio Admin (API, CLI and Web)
- Public Folder ACL support admin grommunio Admin (API, CLI and Web)

**New Features**

- Support for multi-iCal and multi-vCard formats
- Unification of MAPI libraries throughout web components
- Configurable midb command buffer size for large IMAP migrations (80GB+ per mailbox)
- Migration: Ignore Kopano Archiver stub elements

**Enhancements**

- Support for pooled LDAP connections via TLS (restartable Policy)
- Enhanced Timezone handling based on most recent IANA Timezone policies
- kdb2mt: support recovering broken attachments lacking PR_ATTACH_METHOD
- kdb2mt: remove PK-1005 warning since now implemented
- delmsg: support mailbox lookup using just the mailbox directory name
- http: added the "msrpc_debug" config directive
- nsp: added the "nsp_trace" config directive
- mh_nsp: make the addition of delegates functional
- kdb2mt: support recovering broken attachments lacking PR_ATTACH_METHOD
- imap: emit gratuitous CAPABILITY lines upon connect and login
- imap, pop3: support recognizing LF as a line terminator as well (other than CRLF)
- Added a config directive tls_min_proto so one can set a minimum TLS standard when your distro doesn't have crypto-policies (<https://gitlab.com/redhat-crypto/fedora-crypto-policies>)
- autodiscover.ini: new directives advertise_mh and advertise_rpch for finer grained control over individual protocol advertisements; replaces mapihttp.
- exmdb_provider: lifted the folder limit from 10k to 28 billion
- oxcmail: cease excessive base64 encoding.
- Improvements to Outlook online/interactive search for improved responsiveness in Online Mode.
- Messages are now preferably encoded as quoted-printable during conversion to Internet Mail format. This might help with spam classification.
- delivery-queue: the maximum mail size is now strictly enforced rather than rounded up to the next 2 megabytes
- gromox-dscli: the -h option is no longer strictly needed, it will be derived from the -e argument if absent

The above list is not conclusive. As usual, numerous bug fixes and features have been included. The release notes just highlight major changes; Feel free to check out the detailed logs at GitHub (<https://github.com/grommunio>).

The official documentation covers the necessary steps for the update procedure.

**Did you know?**

grommunio strives for precise documentation underlying the standards and protocols grommunio builds upon, since these are the foundation for stable communication and functionality. We at grommunio also regularly fix incorrect portions of Microsofts‘ own documentation - example: <https://github.com/MicrosoftDocs/office-developer-client-docs/pull/613/commits/09c4ada5114d8e2d9f65ce29a25f40a6fc6c2278>

In this spirit, we have published the grommunio documentation online (<https://github.com/grommunio/grommunio-documentation>), available for contributions from any source to make the documentation of grommunio as good as possible.

**Contributions**

Thanks to customers, partners and the entire community - the community for their ongoing contributions, especially to:

- Robert, who has provided various contributions to support BSD.
- Walter, for his various contributions in the migration tools area.
- Christopher, for his role-model involvement in grommunio community as maintainer.
- Michael, for reports on admin api resiliency in distributed environments.
- Stefan, Bob and Andreas for large scale container setup feedback.
- Rob and Hannah, for guidances path on F5 nginx plus/unit.
- Microsoft, for review, feedback and acceptance of errors in Microsofts' documentation.
- ILS, for intense collaborative contributions to deliver grommunio in over 22 languages.
- Artem, Milo, Hugel and many more for various language contributions.

## grommunio 2022.05.1

- Release type: Major
- Release date: 16th of May 2022
- General availability: Yes
- grommunio: Support for Ubuntu 22.04
- grommunio: Support for NetIQ eDirectory
- grommunio: Support for 389 Directory Server
- grommunio: Support for Multi-Forest Active Directory installations
- grommunio: Support for IBM z15 (T02) mainframe
- grommunio: API extensions to support store-level operations, e.g. setting store permissions and store properties
- grommunio: Automatic restore of connections for long-lived and/or error-prone connections (libexmdbpp)
- grommunio: Availability in OTC (Open Telekom Cloud) via T-Systems
- grommunio: Availability of grommunio Antispam web interface via grommunio Admin API
- grommunio: Enhancements to BSD and library compatibility (e.g. LibreSSL)
- grommunio: Integration of grommunio Office and grommunio Archive now also for appliance users (grommunio-setup)
- grommunio: Multi-Server management with integrated placement policy engine, integrated in Admin API
- grommunio: Several documentation upgrades, including Debian and Ubuntu
- grommunio: Several security-related enhancements and optimizations
- grommunio: Simplification of deployment architecture ultra-scalable container deployments (docker, kubernetes)
- grommunio: Switch to AF_LOCAL sockets eliminating TCP overhead for socket connections
- grommunio: User template defaults for user creation (via CLI and UI) for mass deployment
- grommunio Groupware: Configuration parameters enabling enhanced analysis for professionals, e.g. imap_cmd_debug
- grommunio Groupware: Enhancements to service plugins and additional capabilities such as store cleanup (deleted items)
- grommunio Groupware: Extension of analytic tools, such as gromox-dscli for autodiscover connectivity analysis
- grommunio Groupware: Introduction of public folder read-state management flags
- grommunio Groupware: New migration tools for EML (rfc5322), iCalendar (ics) and vCard (vcf) import
- grommunio Groupware: Search enhancements, resulting in ~15-fold performance improvement with online search operations
- grommunio Groupware: Several enhancements to IMAP & POP daemons for more performance and stability
- grommunio Groupware: Several enhancements to existing migration tools (imapsync, kdb2mt, ...), filtering and partially even repairing broken data and migrating permissions where possible from the source
- grommunio Groupware: Several optimizations to cached mode handling, also making use of alternative return of states
- grommunio Groupware: Upgrade to FTS5 search index
- grommunio Groupware: Upgrade-capability of user stores for further extensibility in feature set
- grommunio Web: Allow setting recursive permissions by copying changes to lower hierarchy objects
- grommunio Web: Enhancements to multiple contactfolder scenarios with logical filters (contacts with e-mail addresses)
- grommunio Web: Integration of S/MIME management with support for multiple S/MIME keys and key management
- grommunio Web: Integration of grommunio Archive
- grommunio Web: Integration of grommunio Files with multiple account management
- grommunio Web: Integration of grommunio Office with realtime collaboration editing on Office Documents
- grommunio Web: Integration of online maps, based on OSM (OpenStreetMap), for contacts and global contacts
- grommunio Web: Performance optimizations, delivering with intermediary caches and large object size reduction, resulting in 4+-fold delivery speed to user
- grommunio Web: Several editor enhancements, e.g. extensive copy & paste compatibility with office documents
- grommunio Web: Several style and compatibility enhancements, e.g. enhanced printing format and favorite folder handling
- grommunio Web: Support for multi-hierarchy-level search without performance penalties
- grommunio Web: Support for prefix-based search operations, e.g. "gro" -\> "grommunio"
- grommunio Web: Translation updates, now including all modules of grommunio Web
- grommunio Sync: Enhanced MIME (rfc822, rfc2822) and S/MIME support
- grommunio Sync: Performance improvements with redis-based state management \> 100 kops (thousand operations per second) per instance possible
- grommunio Sync: Public folder sharing capabilities
- grommunio Chat: Support for enhanced operations (delete)
- grommunio Meet: Automatic disabling of media sharing when video sender limit reached
- grommunio Meet: Dynamic rate limiting, automatic video stream prioritization
- grommunio Meet: Integration of polls and polls management
- grommunio Meet: Various bridge-related enhancements, especially with stream bridges
- grommunio Meet: Various enhancements to breakout room management (notifications)
- grommunio Archive: Automatic key generation, sphinx enhancements
- grommunio Archive: Simplified installation via grommunio-setup
- grommunio Office: Automatic font management/generation via system-installed fonts (ds-fontgen)
- grommunio Office: Simplified installation via grommunio-setup

Only Available for customers/partner with privileged access (beta approval):

- grommunio: Preliminary Support for Red Hat Enterprise 9 (Stream, beta)
- grommunio: Preliminary Support for SUSE Liberty Linux
- grommunio Meet: Microsoft Outlook plug-in for meeting management
- grommunio Meet: Office/Meet integration
- grommunio Meet: Whiteboard integration
- grommunio Chat: Integration of Matrix (Homeserver+Element)

As usual, numerous bug fixes and features have been included. The release notes just highlight the major changes - Feel free to check out the detailed logs at [GitHub](https://github.com/grommunio)

The [official documentation](/admin/operations/#updating-grommunio) covers the necessary steps for the update procedure.

We would like to thank the community for their ongoing contributions, but especially to:

- Jens Schleusener, who has provided tools for spell checking via [FOSSIES codespell](https://fossies.org/)
- Robert Nagy, who has provided various contributions to support OpenBSD
- Walter Hofstädtler, who has provided various contributions for automating imports from MS Exchange and Kopano.

## grommunio 2021.08.3

- Release type: Minor
- Release date: 8th of February 2022
- General availability: Yes
- grommunio: Support for Univention Corporate Server 5
- grommunio: Support for Red Hat Directory Server
- grommunio: Support for FreeIPA, incl. duplicate primary attributes
- grommunio: Support for Kong gateway
- grommunio: Support for APISIX gateway
- grommunio: Support for Kemp load balancer
- grommunio: Support for IBM Power10
- grommunio: Enhancements to haproxy scaling with support for 100k+ concurrent ingres connections
- grommunio: New index service for pre-indexing of web contents
- grommunio: Availability of submission service
- grommunio: Highest SSL/TLS standards according to QualysLabs A+ certification
- grommunio: Enhanced security/privacy by use of HSTS, CSP and HTTP Permissions-Policy
- grommunio: Advanced compression of HTTP(S)-enabled streams (Brotli)
- grommunio: Introduction of privilegeBits (Chat, Video, Files, Archive)
- grommunio: Mainstream availability of grommunio-archive (also to community)
- grommunio: Task management for asynchronous handling of tasks with longer duration (TasQ)
- grommunio: Thread-safe LDAP adaptor service (API)
- grommunio Groupware: Full support for S/MIME and GPG via (Outlook) MAPI/HTTP, MAPI/RPC and other clients (IMAP/POP/SMTP)
- grommunio Groupware: Auto-attach of shared mailboxes via AutoDiscover/Web with full owner permissions
- grommunio Groupware: Language-independent folder migration mapping
- grommunio Groupware: Migration script for Exchange (online/on-premise) to grommunio
- grommunio Groupware: Hidden folder control with migrations
- grommunio Groupware: Enhanced support for multi-value variable-length property types
- grommunio Groupware: Support for language-based stores at creation time (mkprivate / mkpublic)
- grommunio Web: Automatic addition of stores with full owner permissions (additional mailboxes)
- grommunio Web: Set Out of Office information for other users (with full permissions)
- grommunio Web: Enhancements to session & store management (Performance, Languages, ...)
- grommunio Web: Support for Microsoft Exchange compatible ACLs and profiles (editor, author, ...)
- grommunio Web: Enhance search result limit to 1000 results
- grommunio Web: Editor upgrade to TinyMCE 4.9.11 with preparation to Tiny 5+
- grommunio Web: Language updates (English, German, Russian, Hungarian, Danish, ...)
- grommunio Web: Enhancements to user experience (style, compatibility, performance)
- grommunio Web: Fix missing font definition for new mails and inline comments
- grommunio Web: Fix Task requests with Outlook interoperability
- grommunio Web: Fingerprinting fixes (Firefox ESR)
- grommunio Web: Support for shallow MDM devices
- grommunio Web: W3C CSS 3 + SVG certification
- grommunio Web: Update dompurify (XSS protection)
- grommunio Web: Web application static resource delivery (payload reduction & performance) enhancements
- grommunio Sync: Reduction of memory footprint per EAS device by 24%
- grommunio Sync: Fixes/Enhancements based on static code analysis
- grommunio Chat: Update to 6.2.1

Only Available to customers/partner access (beta approval):

- grommunio Chat: Integration of Matrix (Homeserver+Element)
- grommunio: Support for IBM z15 (T02) mainframe
- grommunio: Preliminary Support for Ubuntu 22.04 (finished at Ubuntu's release date)
- grommunio: Preliminary Support for SUSE Liberty Linux

The [official Documentation](/admin/operations/#updating-grommunio) covers the necessary steps for the update procedure.

## grommunio 2021.08.2

- Release type: Minor
- Release date: 24th of November 2021
- General availability: Yes

Major changes:

- grommunio: Production availability of Debian 11 via repository
- grommunio: Availability of grommunio mobile apps via the App Store and Playstore
- grommunio: Support for stretched cluster installations
- grommunio: Preliminary support for OpenID Connect via Keycloak
- grommunio Web: Major upgrade including over 230 fixes, updated WYSIWYG editor, design and performance improvements
- grommunio Groupware: Enhanced Out-of-Office autoresponder implementation
- grommunio Groupware: Enhanced support for OP_MOVE rules processing
- grommunio Groupware: Enhanced vCard processing
- grommunio Groupware: Full multilingual mailbox support for 91 languages
- grommunio Groupware: Full support for mailbox owner mode
- grommunio Groupware: Full support for shared mailboxes
- grommunio Groupware: Import into public stores
- grommunio Groupware: Support for public folder access via EAS (Exchange ActiveSync)
- grommunio Groupware: Synchronization resiliency for offline mode with broken objects (named properties)
- grommunio Admin: Enhanced Active Directory Alias Support (Exchange compatible)
- grommunio Admin: Inline help for better understanding and easier administration
- grommunio Admin: Integration of remote wipe for Administrators via Admin UI/CLI
- grommunio Admin: License manager integration within Admin UI
- grommunio Admin: Reorganization of Admin UI for better usability
- grommunio Chat: Major upgrade to 6.1.1 with many fixes, style adoptions and seamless upgrade procedure
- grommunio Setup: Support for special characters under special circumstances with grommunio Meet and grommunio Files

The [official Documentation](/admin/operations/#updating-grommunio) covers the necessary steps for the update procedure.

### Post-update tasks

When using the grommunio appliance, some packages (depending on your configuration) might require your configuration to be adapted:

The list of known files that can require adoption are due to configuration file extensions:

1.  `/etc/grommunio-antispam/local.d/redis.conf.rpm*`
2.  `/etc/grommunio-web/config.php.rpm*`
3.  `/etc/grommunio-chat/config.json.rpm*`
4.  `/etc/prosody/prosody.cfg.lua.rpm*`

If the configuration file has been replaced by a package update, the minimal approach is to copy the original configuration file back in place. It is recommended to make a backup beforehand and restart the respective service either via Admin UI/CLI or system console/ssh:

```bash
cp /etc/prosody/prosody.cfg.lua /etc/prosody/prosody.cfg.lua.rpmnew
cp /etc/prosody/prosody.cfg.lua.rpmsave /etc/prosody/prosody.cfg.lua
systemctl restart prosody
```

## grommunio 2021.08.1

- Release type: Major
- Release date: 17th of August 2021
- General availability: Yes

Major changes:

- Extension of distribution support and available repositories (SUSE Linux Enterprise Server 15, Red Hat Enterprise Linux 8 incl. derivatives)
- Extension of available processor architectures: ARM64, PowerPC (ppc64le) and IBM zSeries (s390x)
- New installation images: OVA (VMware), Docker, Raspberry Pi (4+)
- Live Status Overview and Mobile Device Status
- Support for Mobile Policies (MDM)
- Extensive enhancements to migration tools for migrating Exchange (PST), Kopano (DB/Attachments) and generic mail systems (IMAP/CalDAV/CardDAV)
- Support for Active Directory Forest installations
- Support for deputy configuration
- Extensions of the Free/Busy functionality
- Support for special control characters
- Configuration based integration of grommunio Files, Meet, Chat into grommunio Web
- Inclusion of grommunio Files, Meet, Chat and Archive in the installation images

:::caution
Due to <https://grommunio.com/en/news-en/aus-grommunio-wird-grommuniogrommunio-becomes-grommunio> , grammm was renamed to grommunio. We are aware that this creates some challenges for the migration of existing platforms. All subscription holders are eligible for free professional services for the migration process. For the migration process, the estimated time required for the completion of migration is 5000 users per hour.
:::

Due to the nature of the rebranding from `grammm` to `grommunio`, a simple, automated upgrade mechanism was not created. Subscription holders with update services enabled automatically have access to the services available by the distribution upgrade process. The configuration switchover (configuration, data) has not changed much, and therefore the migration process is possible with the respective configuration dumps.

The 2021.08.1 release also brought large advances across every component. The most notable, by area:

- **grommunio Core (gromox)** — full S/MIME and GPG support across MAPI/HTTP, MAPI/RPC and IMAP/POP/SMTP; auto-attach of shared mailboxes via AutoDiscover with full owner permissions; language-independent folder migration mapping; an Exchange (online/on-premise) migration script; expanded multi-value, variable-length property handling; and language-based store creation (mkprivate/mkpublic).
- **grommunio Admin (API & Web)** — organizations and role-based permissions (including read-only roles), public-folder hierarchy and ACLs, LDAP server pooling and import of aliases, fetchmail management, database-stored configuration (dbconf), a live status page, log and mail-queue viewers, per-user sync-policy management, and a redesigned dashboard.
- **grommunio CUI** — a reworked console interface: YaST-based network and timezone configuration, keyboard-layout switching, a log viewer, journald integration, and numerous usability and safety fixes.
- **grommunio Sync** — a 24% lower memory footprint per EAS device and static-analysis hardening.
- **grommunio Setup** — simplified, integrated setup of Files, Meet, Chat and Archive.
- **grommunio Web** — S/MIME key management, integration of Files, Office and Archive, OpenStreetMap maps for contacts, multi-level and prefix search, and broad performance and editor improvements.

The full per-repository commit history for this release is available on [GitHub](https://github.com/grommunio).

The [official documentation](/admin/operations/#updating-grommunio) covers the necessary steps for the update procedure.
