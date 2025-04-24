..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2025 grommunio GmbH

#############
Release Notes
#############

grommunio 2025.01.2
===================

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

This version is the last version to include builds for openSUSE 15.5. Any future updates demand strict PHP 8.1+ compatibility. Please update installations still running on openSUSE 15.5 accordingly (for example by use of ``grommunio-update upgrade``)

The above lists cover the most significant changes in grommunio 2025.01.2. Dozens of smaller fixes and improvements are included in this release to refine overall functionality and security.

grommunio 2025.01.1
===================

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

 - Refined SSO & identity management with expanded security controls.
 - Improved user federation for large-scale deployments, simplifying integration with heterogeneous directory services.
 - Advanced admin console features for streamlined configuration and audit trails.

**TinyMCE Upgrade from 4.9.11 to 7.6.1**

The grommunio Web’s email editor now leverages TinyMCE 7.6.1, providing:

 - Modernized UI/UX, especially on mobile and touch devices.
 - Enhanced performance and security, ensuring a smoother editing experience (like the content hover-bar).

**PHP 8.2 and 8.3 Support**

grommunio’s core and associated services are now fully compatible with PHP 8.2 and 8.3. Key benefits include:

 - Better performance and memory optimization.
 - Enhanced type and error-handling features for developers.
 - Extended grommunio Stack Upgrades and compliance.

**Enhanced Internet Mail Compliance**

grommunio continues to refine support for Internet mail standards. This ensures more robust and accurate parsing and generation of emails across a variety of clients and mail servers.

**New Features & Enhancements**
**Share-Nothing Clusters**

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

We would like to extend our sincere gratitude to our community, customers, and partners for their continued support, feedback, and contributions. A special thanks goes out to our active contributors: crpb, dahan, brad0, kasperk81, robert-scheck, orandev01, rnagy, walter, liske, steve, milotype, clique2015 any many others. Your insights drive our roadmap and make grommunio more robust, secure, and performant with each release.

grommunio 2023.11.3
===================

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
- Resolved a case where four extra bytes where added in front of the first transport header
- Semicolons in "Reply-To" headers are now handled correctly
- Proper handling for log messages enabling better fail2ban processing
- ICS requests can now be dumped for developer inspection
- Extensive dependency updates for Debian/Ubuntu based installations
- Various improvements to migration toolset
- Various mail processing enhancements (e.g. dot-stuffing)

**Notes on EWS**

As mentioned above, with EWS leaving the beta stage, the parameter ``ews_beta=1`` in ``/etc/gromox/ews.cfg`` is now obsolete. EWS is now enabled per default and the parameter is not required anymore.

**Acknowledgements**

We extend our heartfelt thanks to our customers, partners, and the community for their valuable input and feedback. Thanks to feedback from customers and the community, we have been able to track down EWS-related issues properly and have included the feedback in our evaluation process, leading to a better product for all.

We would especially like to thank the community for the overwhelming feedback, especially at FOSDEM https://fosdem.org/2024/ <https://fosdem.org/2024/>_.

**Last remarks**

The development, QA, and release teams, apologize that our public communication has been occasionally delayed. We've been very busy not only delivering a better product to you with a plethora of fixes and new features but also integrating new resources into the entire organization and infrastructure. It's amazing how many installations have hit production in the holiday season which required additional prioritization. Rest assured, there's big news coming up from grommunio, and you'll notice it.

grommunio 2023.11.2
===================

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

- Enable gromox-mbop path specifications, such as `SENT/2024`
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

grommunio 2023.11.1
===================

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

- To activate EWS Beta features, add ``ews_beta=1`` to ``/etc/gromox/ews.cfg``
- Activation of ``ews_pretty_response`` is not supported by Mac Mail and is recommended not to be enabled as such
- The best supported EWS Client is currently Microsoft Outlook for Mac
- The upcoming EWS operations FindFolder and FindItem are expected to be released within the upcoming 2 weeks after release which enhances Apple's macOS apps most.

**Disclaimer: Public Beta Release of EWS Functionality**

- Intensive Development and Testing: The EWS functionality has undergone extensive development to achieve a modern and solid software architecture. This rigorous process ensures a high standard of quality, security, and functionality. However, as with any complex software endeavor, there may be unforeseen nuances in diverse real-world environments.

- Current Limitations: We acknowledge that two features – the FindItem operation and the Impersonation feature – are not yet included in this beta release. These features are currently undergoing thorough quality assurance testing. We anticipate their inclusion still within the 2023 release timeline, further enhancing the EWS functionality.

- Commitment to quality and security: Our team, in collaboration with our technology partners, has repeatedly validated the EWS functionality to ensure its security, data protection, and stability. We adhere to the highest standards to safeguard your experience.

- Feedback and continuous improvement: While we have invested considerable effort in testing, we acknowledge that the diverse and dynamic nature of IT environments can present unique scenarios. Therefore, we welcome and appreciate any feedback or reports of issues from our users. Your insights are invaluable in helping us refine and improve the EWS functionality.

- Support for subscription holders: With the release of this EWS functionality, it becomes a fully supported protocol within grommunio. Subscription holders are entitled to our full support for any queries or assistance related to EWS. For customers and hosters: Please approach your support representative if you need any planing for EWS rollout. As with every new big feature, it is recommended to plan the availability with care and our staff is committed to support you well.

**Acknowledgements**

We extend our heartfelt thanks to our customers, partners, and the community for their invaluable input and feedback, especially to:

- clique2015, robert-scheck, General-Aussie, steve, prandev01, crpb, rnagy, walter any many others

grommunio 2022.12.1
===================

- Release type: Major
- Release date: 24th of December 2022
- General availability: Yes

**Highlights**

- grommunio Appliance now on openSUSE 15.4 with many improvements, such as PHP 8.0
- General Availability of Multi-LDAP, worlds-first multi-backend groupware engine
- General Availability of Admin API for PowerShell (AAPIPS), a PowerShell interface for grommunio Admin
- General Availability of grommunio Desktop, a multi-platform client for grommunio Web
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
- Enhanced navivation controls of grommunio CUI
- Support for hidden contacts
- Automatic mapping of AD/Exchange Store Types (msExchRecipientDisplayType)
- Centralized MAPI header files for PHP consumers
- Default integration of grommunio-dbconf
- Implementation of hierarchy and permission model (ACLs) for public folders in Admin
- Mail-Queue mangement in grommunio Admin
- Large documentation updates, launch of Knowledge Base in Documentation Portal

The above list is not conclusive. As usual, numerous bug fixes and features have been included. The release notes just highlight major changes; Feel free to check out the detailed logs at GitHub (`https://github.com/grommunio <https://github.com/grommunio>`_).

The official documentation covers the necessary steps for the update procedure.

**Contributions & Thanks**

Thanks to customers, partners and the entire community - the community for their ongoing contributions, especially to:

- MrPikPik, tiredofit, maddin200, artem, steve, thermi, milo, Bheam, crpb, rnagy, walter any many others

Special thanks to Microsoft Corporation for the productive cooperation on standards and protocols and to T-Systems International for the collaborative work on scale-out installations with highest enterprise demands.

grommunio 2022.05.2
===================

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
- Added a config directive tls_min_proto so one can set a minimum TLS standard when your distro doesn't have crypto-policies (`https://gitlab.com/redhat-crypto/fedora-crypto-policies <https://gitlab.com/redhat-crypto/fedora-crypto-policies>`_)
- autodiscover.ini: new directives advertise_mh and advertise_rpch for finer grained control over individual protocol advertisements; replaces mapihttp.
- exmdb_provider: lifted the folder limit from 10k to 28 billion
- oxcmail: cease excessive base64 encoding.
- Improvements to Outlook online/interactive search for improved responsiveness in Online Mode.
- Messages are now preferably encoded as quoted-printable during conversion to Internet Mail format. This might help with spam classification.
- delivery-queue: the maximum mail size is now strictly enforced rather than rounded up to the next 2 megabytes
- gromox-dscli: the -h option is no longer strictly needed, it will be derived from the -e argument if absent

The above list is not conclusive. As usual, numerous bug fixes and features have been included. The release notes just highlight major changes; Feel free to check out the detailed logs at GitHub (`https://github.com/grommunio <https://github.com/grommunio>`_).

The official documentation covers the necessary steps for the update procedure.

**Did you know?**

grommunio strives for precise documentation underlying the standards and protocols grommunio builds upon, since these are the foundation for stable communication and functionality. We at grommunio also regularly fix incorrect portions of Microsofts‘ own documentation - example: `https://github.com/MicrosoftDocs/office-developer-client-docs/pull/613/commits/09c4ada5114d8e2d9f65ce29a25f40a6fc6c2278 <https://github.com/MicrosoftDocs/office-developer-client-docs/pull/613/commits/09c4ada5114d8e2d9f65ce29a25f40a6fc6c2278>`_

In this spirit, we have published the grommunio documentation online (`https://github.com/grommunio/grommunio-documentation <https://github.com/grommunio/grommunio-documentation>`_), available for contributions from any source to make the documentation of grommunio as good as possible.

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

grommunio 2022.05.1
===================

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
- grommunio Web: Support for prefix-based search operations, e.g. "gro" -> "grommunio"
- grommunio Web: Translation updates, now including all modules of grommunio Web
- grommunio Sync: Enhanced MIME (rfc822, rfc2822) and S/MIME support
- grommunio Sync: Performance improvements with redis-based state management > 100 kops (thousand operations per second) per instance possible
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

As usual, numerous bug fixes and features have been included. The release notes just highlight the major changes - Feel free to check out the detailed logs at `GitHub <https://github.com/grommunio>`_

The `official documentation <https://docs.grommunio.com/admin/operations.html#updating-grommunio>`_ covers the necessary steps for the update procedure.

We would like to thank the community for their ongoing contributions, but especially to:

- Jens Schleusener, who has provided tools for spell checking via `FOSSIES codespell <https://fossies.org/>`_
- Robert Nagy, who has provided various contributions to support OpenBSD
- Walter Hofstädtler, who has provided various contributions for automating imports from MS Exchange and Kopano.

grommunio 2021.08.3
===================

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
- grommunio Web: Enhancements to user experience (style, compatbility, performance)
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

The `official Documentation <https://docs.grommunio.com/admin/operations.html#updating-grommunio>`_ covers the necessary steps for the update procedure.

grommunio 2021.08.2
===================

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

The `official Documentation <https://docs.grommunio.com/admin/operations.html#updating-grommunio>`_ covers the necessary steps for the update procedure.

Post-update tasks
-----------------

When using the grommunio appliance, some packages (depending on your configuration) might require your configuration to be adapted:

The list of known files that can require adoption are due to configuration file extensions::

1. ``/etc/grommunio-antispam/local.d/redis.conf.rpm*``
2. ``/etc/grommunio-web/config.php.rpm*``
3. ``/etc/grommunio-chat/config.json.rpm*``
4. ``/etc/prosody/prosody.cfg.lua.rpm*``


If the configuration file has been replaced by a package update, the minimal approach is to copy the original configuration file back in place. It is recommended to make a backup beforehand and restart the respective service either via Admin UI/CLI or system console/ssh::

.. code-block: bash

        cp /etc/prosody/prosody.cfg.lua /etc/prosody/prosody.cfg.lua.rpmnew
        cp /etc/prosody/prosody.cfg.lua.rpmsave /etc/prosody/prosody.cfg.lua
        systemctl restart prosody


grommunio 2021.08.1
===================

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

.. important::
   Due to https://grommunio.com/en/news-en/aus-grommunio-wird-grommuniogrommunio-becomes-grommunio , grammm was renamed to grommunio. We are aware that this creates some challenges for the migration of existing platforms. All subscription holders are eligible for free professional services for the migration process. For the migration process, the estimated time required to for the completion of migration is 5000 users per hour.

Due to the nature of the rebranding from ``grammm`` to ``grommunio``, a simple, automated upgrade mechanism was not created. Subscription holders with update services enabled automatically have access to the services available by the distribution upgrade process. The configuration switchover (configuration, data) has not changed much, and therefore the migration process is possible with the respective configuration dumps.

grommunio Admin API
-------------------

Repository: https://github.com/grommunio/admin-api

Code statistics:

- +15323 lines added
- -5131 lines removed

Commits:

- 2021-08: 16
- 2021-07: 33
- 2021-06: 22
- 2021-05: 15
- 2021-04: 20
- 2021-03: 14

New (Improvements)
~~~~~~~~~~~~~~~~~~

- Add (in)active user count to domain
- Add CLI documentation
- Add CLI fs operations
- Add CLI config tracing
- Add CLI mconf reload
- Add IDN support and input validation
- Add LDAP server pooling
- Add access to user store properties
- Add authmgr configuration management
- Add database connection check and CLI safeguard
- Add device delete (resync) endpoint
- Add domain effective sync policy endpoint
- Add endpoints for user delegates
- Add fetchmail management
- Add format validation endpoint
- Add journald log viewer
- Add log message for failed logins
- Add mailq endpoint
- Add man pages
- Add nginx vhost status proxies
- Add permanent domain deletion to API
- Add possibility to filter sync top data
- Add public folder detail endpoint
- Add read-only permissions
- Add separate permissions and ownerships for mconf
- Add support for JSON serialized device states
- Add support for numeric permission strings
- Add systemctl enable/disable commands
- Add user device sync information endpoint
- Allow force updating LDAP config
- Automatically adapt to new schema version
- Change public folder IDs to string
- Change user sync data to normal array
- Enforce user delegate format
- Implement database-stored configurations
- Implement dbconf commit hooks
- Implement domain management via CLI
- Implement grommunio-chat interface
- Implement import of aliases from LDAP
- Implement organizations
- Implement public folder editing
- Implement remote CLI
- Improve API documentation
- Improve CLI logging output
- Improve LDAP configuration check
- Improve LDAP configuration via CLI
- Improve LDAP import "no users" message
- Improve LDAP usability
- Improve automatic service reload
- Improve handling of unreadable config files
- Invalidate redis cache on sync policy update
- Move domain creation to orm
- Move user creation to orm
- Move user store access to separate endpoint
- Optimize domain and user setup
- Provide sync policies
- Relax startup database connection test
- Reload additional services on domain creation
- Reload gromox-adaptor service on domain creation
- Reload gromox-http service on user creation
- Reload services on LDAP config change
- Reload systemd after en- or disabling units
- Reorganize system admin capabilities
- Sort dbconf services and files alphabetically
- Support loading of JSON OpenAPI spec
- Support unlimited storage quotas
- Switch to shell-exec systemd control

Bugfixes
~~~~~~~~

- Fix LDAP check crashing on invalid externalID
- Fix LDAP check not working with AD
- Fix PATCH roles not working properly
- Fix Python version lock in Makefile
- Fix autocomplete
- Fix bad response on domain creation failure
- Fix broken login with PyJWT 2
- Fix clean target grommunio-dbconf
- Fix crashes when MySQL is unavailable on startup
- Fix dbconf service endpoint not working
- Fix declarative base query using wrong session
- Fix handling of broken LDAP IDs
- Fix missing user delegates request body
- Fix numerical file permissions not working
- Fix traceback when aborting password reset
- Fix unaligned reads/writes exmdbpp
- Fix user password attribute
- Fix wrong HTTP status on dashboard service signal
- Fix wrong redis key used for policy invalidation
- Fix wrong service signal response code
- Ignore incomplete LDAP objects

Removed
~~~~~~~

- Remove database URL quoting
- Remove fetchmail entries from profile endpoint
- Remove Flask-SQLAlchemy dependency
- Remove groups
- Remove old systemd code
- Remove permissions and roles on domain purge
- Remove PyJWT version constraint
- Remove unused dbus import

grommunio Admin Web
-------------------

Repository: https://github.com/grommunio/admin-web

Code statistics:

- +43319 lines added
- -18542 lines removed

Commits:

- 2021-08: 10
- 2021-07: 52
- 2021-06: 28
- 2021-05: 46
- 2021-04: 53
- 2021-03: 47

New (Improvements)
~~~~~~~~~~~~~~~~~~

- Add Circular progress to login button while logging in
- Add LDAP config parameter 'aliases'
- Add LDAP filter defaults
- Add auth manager config
- Add autocompletes for domain.org and mlist.class
- Add checkbox to set when putting LDAP config
- Add confirm dialog for stop/restart service buttons
- Add count of tablerows above tables
- Add createRole query param to POST /system/domains
- Add dashboard for domain admin
- Add displayname to headline of user details
- Add email to fetchmail dialog headline
- Add form autofill attributes to LDAP config
- Add human readable MSE to slider
- Add icon to get back to users view when in LDAP view
- Add indication of LDAP user sync at LDAP config view
- Add missing autocompletes
- Add more LDAP tooltips
- Add name and id attribute to login form
- Add new LDAP import buttons
- Add new orgAdmin and DomainPurge role
- Add new table view wrapper
- Add org to domain
- Add placeholder to LDAP server TF
- Add possibility to set 0 MB as quota limits
- Add scroll: auto to drawer
- Add send and receive quota to AddUser dialog
- Add service detail page
- Add sync statistics
- Add sync tab to user page
- Add tooltip with service description to service list
- After successfully adding an item, set loading to false
- After successfully importing/syncing users, refetch users
- Always divide quotas by 1024 before calculating size unit
- Automatically uppercase ssl fingerprints of fetchmail entries
- Button colors expanded with signal colors and adapted according to their function.
- Change AD to ActiveDirectory template
- Change default values of fetchmail dialog
- Change endpoint for quota values
- Change helpertexts of custom mapping
- Change logs hover color to work on light and dark mode
- Change role multiselect to autocomplete
- Check email and domain format with backend endpoint
- Completely remove swap chart if it's 0
- Convert folder match to local filtering
- Convert maxattrsize to MB
- Fetch domain lvl2 in user details to get chat-attribute
- Fill form when selecting LDAP template
- Fully reset store when logging out
- Get command name from code
- Implemented new responsive grid layout for the dashboard
- Implement CRUD for orgs
- Implement DBConf Filecreation
- Implement anti spam statistics into dashboard with a responsive layout
- Implement auto refresh of logs
- Implement autocomplete for AddRoles
- Implement autocomplete for Folders
- Implement class-members /-filters XOR
- Implement db file deletion
- Implement domain editing and deletion for OrgAdmins
- Implement dynamic table row fonts according to device status
- Implement fancy sorting algorithm for domain admin dashboard
- Implement fetchmail crud
- Implement file editing
- Implement folder editing
- Implement full domain deletion
- Implement grommunio chat team/user management
- Implement live server status page
- Implement local services filter
- Implement log viewer
- Implement mailq
- Implement minified sync policy prototype
- Implement new Chart designs
- Implement proper login form autocompletion
- Implement read-only capabilities/permissions
- Implement send/receive quota limit
- Implement service autostart
- Implement service deletion
- Implement service renaming
- Implement sync policy for users
- Implement sync policy prototype
- Implement sync table
- Implement sync table filters
- Implement used space bar
- Implement user delegates
- Implement vhost status endpoints
- Improve design of mailQ
- Improve design of quota graph
- Improve fetchmail
- Improve log viewer
- Improve sync table header
- Improve wording of owner removal
- Improved strings for LDAP configuration
- Increase size of services chart to prevent wrapping of deactivating chip
- LDAP: update textual requirements for server field
- Make all multiline textfields outlined
- Make deactivated domains re-activatable
- Make quotas optional for adding users
- Mark deleted domains as deleted in drawer
- More details in per-domain view
- Move used space percentage to center of bar
- New service chart design
- Rectify default values for LDAP fields
- Redesign quota chart
- Reduce count of mlists when deleting
- Relabel buttons for CNF clause
- Relabel quota error
- Rename RemoveOwner class
- Rename classes to groups on the outside (only displayed text)
- Reorganize ldap config
- Reorganize permission handling
- Resolve eqeqeq warning
- Resolve fetchmail warning
- Separate user and storeprops fetch in 2 different try/catch blocks
- Show domain displayname if it's different than the domainname
- Significantly improve data management
- Significantly improve design of sync policy mask
- Slightly improve padding and margin
- Split spam and performance into 2 chapters by headlines
- Translations
- Trim message about LDAP fields being optional
- Update LDAP tooltip strings
- Update counter after softdeleting domain
- Update mconf and ldap url
- When updating domainStatus, also update drawer domains
- Wrap detail view components in new wrapper
- View: fix also update timestamp

Bugfixes
~~~~~~~~

- Fix broken classes fetch
- Fix broken dashboard layout
- Fix broken default vhost
- Fix broken domain patch
- Fix broken fetchOrgs and edit maillist
- Fix broken folder details
- Fix broken folder sorting
- Fix broken format check
- Fix broken grochat checkbox
- Fix broken ldap template select
- Fix broken parent groups
- Fix broken role editing
- Fix broken service disableing
- Fix broken table filters
- Fix broken toggleswitch
- Fix broken used space labels
- Fix broken user edit
- Fix chart issues
- Fix crashing empty-ldap view
- Fix crashing mlist details
- Fix crashing views
- Fix disk labels
- Fix doubling visual feedback of ldap responses
- Fix non-resizing charts
- Fix non-updating authBackendSelection
- Fix potential live status crashes
- Fix quota absence not displayed properly
- Fix tooltip warnings for link button
- Fix uncaught config.json error
- Fix valid domain names rejection
- Fix warnings
- Fix wrong default searchAttribute
- Fix wrong implementation of ldap enable-available-switch
- Properly show ldap ok-status

Removed
~~~~~~~

- Remove availability text if LDAP is disabled
- Remove chat user option in post dialog
- Remove empty limit parameter from entire app
- Remove error color from cancel button in AddDialogs
- Remove groups
- Remove password and make maxUser mandatory
- Remove redundant home icons in views
- Remove sorting from user list, besides username
- Remove srcFolder from required textfields and disable save-button if a required tf isn't filled

grommunio CUI
-------------

Repository: https://github.com/grommunio/grommunio-cui

Code statistics:

- +2565 lines added
- -2879 lines removed

Commits:

- 2021-08: 10
- 2021-07: 48
- 2021-06: 1
- 2021-05: 50
- 2021-04: 0
- 2021-03: 37

New (Improvements)
~~~~~~~~~~~~~~~~~~

- Add cancel button to admin pw change dialog
- Add cancel button to reboot and shutdown question box
- Add checked information to homescreen
- Add footerbar for better keyboard shortcut readability
- Add help note to "Change password" dialog
- Add last login time to bottom half of homescreen
- Add launcher script
- Add load average to footerbar and introduce quiet mode
- Add menu entry to reset AAPI password
- Add padded Edit class GEdit
- Add shutdown to menu
- Add some kbd layouts
- Add space to "Average load"
- Add status messagebox after admin pw reset
- Add status messagebox after tymesyncd configuration
- Add timesyncd config to main menu
- Add timezone configuration via yast2
- Change Buttons to RadioButtons
- Change column size of menu field descriptions
- Change hidden keyboard switcher to menu guided
- Change netmask to cidr
- Change stupid cat command to pythons internal open
- Change wrap mode of all editable fields to ellipsis
- Check content of netifaces before getting default gw
- Correct indenting after event refactoring
- Create a general input box for changing admin-web password
- Create header for log viewer
- Create message after dns settings apply
- Delete redundant copy of README
- Disable mouse support as mentioned in #9
- Ditch ordered_set from requirement
- Ditch urwid>=2.1 requirement
- Do not check for timesyncd configuration
- Do not show gateway on lo
- Drop menu element number
- Enable /etc/hosts writing
- Enhance GText class with some additional methods
- Enhance dialog sizes of IP address and DNS config
- Escape the quote at the system call for changing admin-web password
- Finish log viewer
- Give menu items more contrast
- Handle footerbar correctly if screen width changes
- Introduce a general Text class padding the correct chars
- Keyboard layout switcher
- Make function check_if_password_is_set available for all
- Make getty upbranding compatible
- Make homescreen more readable
- Make it upbranding compatible
- Make rest upbranding compatible
- Make some checks more exact
- Move timsyncd configuration behind timezone configuration
- New program names in help texts
- Optimize further wording
- Optimize logging support
- Optimize wording
- Read `grommunio-admin config dump` and extract the log units
- Reboot when asked for reboot, don't poweroff
- Recolor footerbar
- Rectify indent of docstrings
- Reduce from unnecessary 3 digits to 2 digits in average load view
- Reduce length of keyb/color line
- Replace custom netconfig implementation by yast2
- Replace incorrect credentials message
- Replace windowed shell by fullscreen one
- Restore termios setting when CUI exits
- Revert "Remove systemd from requirements because it is already in systemd-python."
- Reword main menu texts
- Set up environment variables for terminal shell
- Show IPv6 addresses in overview
- Split large handle_event function
- Stop abusing str() to test for classes/enums
- Suppress messages of shell commands
- Switch to RGB444 format
- Tone down brightness of the "dark" scheme
- Tone down reverse color in light mode
- Trim excessive sentence punctuation/structuring
- Update header to be more suitable to the new footerbar
- Update systemd module requirement
- Use "reboot" command without path
- Use autologin if no initial password is set
- Use long names in binaries again and rename gro* to grommunio-*
- Use systemd-journal instead of viewing log files directly

Bugfixes
~~~~~~~~

- Fix admin api pw reset and use better wording
- Fix bug on keyboard change while in main menu
- Fix correct display of distro and version
- Fix crash on starting if no grommunio-admin was present
- Fix hanging in menu while colormode or kbd switching
- Fix missing captions on some formatting calllls of GEdit
- Fix not closing password change dialog on hitting close with enter
- Fix out of bounds on the right side of log viewer
- Fix returning back from unsupported shell
- Fix shell injection bug on resetting admin pw
- Fix some config file issues on writing
- Fix suboptimal contrast in "light" mode
- Fix tab handling lock after message- or input box call
- Fix that only one time logging is needed
- Fix wrong 'NOTHING' message if only enter being pressed
- Fix wrong admin interface url
- Fix wrong color switching in menues
- Fix wrong current window setting on input boxes
- Fix wrong explaining text on first menu start
- Fix wrong logging formating
- getty: do set up stderr as well

Removed
~~~~~~~

- Remove "activated by what" and check privileges.
- Remove arbitrary startup wait phase
- Remove extraneous HL coloring
- Remove inconsistent status bar coloring
- Remove systemd from requirements because it is already in systemd-python.
- Remove the 'heute' clockstring.
- Remove unnecessary border around mainwindow
- Remove wrong hint to yast.

grommunio Core (gromox)
-----------------------

Repository: https://github.com/grommunio/gromox

Code statistics:

- +65616 lines added
- -95032 lines removed

Commits:

- 2021-08: 78
- 2021-07: 207
- 2021-06: 197
- 2021-05: 159
- 2021-04: 308
- 2021-03: 256

New (Improvements)
~~~~~~~~~~~~~~~~~~

- adaptor: reduce main() unwinding boilerplate
- adaptor: use stdlib containers for data_source
- alias_translator: add PLUGIN_RELOAD functionality
- alias_translator: expand mailaddr buffers to UADDR_SIZE
- all: add <cerrno> include for errno
- all: avoid integer underflow in qsort comparators
- all: check return values of ext_buffer_push_*
- all: delete extra blank lines from header files
- all: disambiguate multiply assigned error/warning codes
- all: drop C (void) argument filler
- all: drop _stop() function return values
- all: ease setting breakpoints on thread entry functions
- all: enlarge buffers for IPv6 addresses
- all: favor simpler x[j] over \*(x+j)
- all: log all pthread_create failures
- all: make use of EXT_PULL::g_*bin* member functions
- all: make use of EXT_PULL::g_bool member functions
- all: make use of EXT_PULL::g_bytes member functions
- all: make use of EXT_PULL::g_guid* member functions
- all: make use of EXT_PULL::g_proptag_a member functions
- all: make use of EXT_PULL::g_restriction member functions
- all: make use of EXT_PULL::g_str* member functions
- all: make use of EXT_PULL::g_tpropval_a member functions
- all: make use of EXT_PULL::g_uint* member functions
- all: make use of EXT_PULL::* member functions
- all: make use of EXT_PUSH::{advance,p_proptag_a} member functions
- all: make use of EXT_PUSH::{check_ovf,p_tpropval_a,p_tarray_set} member functions
- all: make use of EXT_PUSH::{init,p_guid,p_bool} member functions
- all: make use of EXT_PUSH::* member functions
- all: make use of EXT_PUSH::{p_bin,p_bin_s,p_bin_a,p_restriction} member functions
- all: make use of EXT_PUSH::p_int* member functions
- all: make use of EXT_PUSH::{p_msgctnt,p_eid_a,p_abk_eid} member functions
- all: make use of EXT_PUSH::{p_store_eid,p_folder_eid,p_msg_eid} member functions
- all: make use of EXT_PUSH::{p_str,p_wstr,p_bytes} member functions
- all: make use of EXT_PUSH::{p_tagged_pv,p_oneoff_eid,p_proprow} member functions
- all: make use of EXT_PUSH::p_uint* member functions
- all: make use of EXT_PUSH::{release,p_xid,p_bin_ex} member functions
- all: print connecting module together with gx_inet_connect error messages
- all: reduce verbosity of pext->alloc()
- all: replace awkward multiply-by-minus-1
- all: replace memset by shorter initialization
- all: replace memset with hardcoded sizes
- all: replace sprintf by snprintf
- all: reset deserializer struct counts on allocation failure
- all: resolve instances of -Wunintialized
- all: speedier shutdown of sleepy threads
- all: switch plugins to return true for unhandled plugin calls
- all: switch ports to uint16 / resolve instances of -Wformat
- all: switch \*_stop variables to atomic<bool>
- all: switch to EXT_PULL::init
- all: use anonymous namespaces for TU-local struct declarations
- authmgr: delete unused mode argument
- authmgr: implement "allow_all" auth mode
- authmgr: make login check isochronal
- authmgr: move up too-late return value check of mysql_meta
- authmgr: support config reloading
- authmgr: switch default mode to "externid"
- bodyconv: add rtfcptortf to option summary
- bodyconv: better error message when rtfcptortf fails
- build: add another symbol to zendfake
- build: add cryptest.cpp
- build: add ldd check for mapi.so
- build: add libgromox_common to pffimport link
- build: add libgromox_mapi to pffimport link
- build: add missing <mutex> include
- build: add plugin support functions
- build: change qconf to use -O0
- build: deal with php-config which has no --ini-dir
- build: delete sa_format_area.sh
- build: installation order of LTLIBRARIES is significant
- build: libpthread is needed for logthru
- build: make struct BINARY_ARRAY trivial again
- build: make struct PROPTAG_ARRAY trivial again
- build: move ext_buffer.cpp into libgromox_common.la
- build: move pffimport manpage to section 8gx
- build: pass -fsanitize to linker as well when using --with-asan/ubsan
- build: quench compiler warnings on autolocking libcrypto implementations
- build: quench gcc-7 compiler warnings for -Wunused*
- build: reorder php-config calls and show immediate results
- build: resolve instance of -Wformat-overflow
- build: resolve attempts at narrowing conversion under -funsigned-char
- build: scan for more variants of php-config
- build: support OpenLDAP 2.5
- build: use AC_PATH_PROGS to make deptrace recognize the PHP dependency
- build: zendfake needs a non-noinst LTLIB
- daemons: add ctor/dtor for main process contexts
- daemons: add missing reporting of gx_inet_connect failures
- daemons: delete use of ip6_container, ip6_filter
- daemons: set up SIGINT handler like SIGTERM
- daemons: upgrade to POSIX signal functions
- daemons: use inheritance to base off SCHEDULE_CONTEXT
- dbop: add "fetchmail" table
- dbop: add fetchmail table for dbop -C
- dbop: add missing classes.filters for new db setups
- dbop: add table "configs"
- dbop: add users.chat_id and domains.chat_id
- dbop: add users.sync_policy and domains.sync_policy
- dbop: error when schema version unobtainable
- dbop: make user_properties table fit for multivalue props
- delivery: abolish pthread_cancel
- delivery: abolish unnecessary (a+i)-> syntax
- delivery: add missing mutex unlock
- delivery: add missing pthread_join calls
- delivery: delete unneeded pthread_setcanceltype call
- doc: add Autodiscovery manpage
- doc: add document for the RWZ stream/file format
- doc: add general notes for logon_object_get_properties
- doc: add manpage for gromox-abktconv
- doc: add manpage for gromox-abktpull
- doc: add manpages for gromox-kpd2mt
- doc: add Name sections to all pages
- doc: add notes about character set woes
- doc: authmgr has relaxed requirement on ldap_adaptor
- doc: Autodiscover corrections to mod_fastcgi
- doc: bulletize FILES sections
- doc: delete obsolete digest.8gx manpage
- doc: detail on addressEntryDisplayTableMSDOS
- doc: do not escape (
- doc: expand on the relationship between DCERPC, EMSMDB and OXCROPS
- doc: mark up tcp_mss_size default value
- doc: mention caching behavior for PR_EC_WEBACCESS_JSON
- doc: mention exchange_emsmdb.cfg:rop_debug
- doc: mention openldap as build requirement
- doc: move exrpc_debug explanation to exmdb_provider.4gx
- doc: note about variability of ${libdir}
- doc: rearrange aux utilities in gromox.7
- doc: replace roff SS command by TP
- doc: show right option combinations for gromox-pffimport
- doc: turn oxoabkt.txt to rST
- doc: update documentation pertaining to MAPIHTTP and norms
- doc: update event.8gx
- doc: upgrade changelog.txt to changelog.rst
- doc: use default indent for RS command
- doc: use the right rST syntax for literal code blocks
- doc: use the right syntax for literal blocks
- email_lib: qp_decode_ex's return value needs proper type
- emsmdb: deindent logon_object_get_named_{propids,propnames}
- event: add another termination checkpoint
- event: add missing pthread_join for accept/scan threads
- event: kick threads with a signal upon termination request
- event_proxy: reduce excess gx_inet_connect messages
- event: reduce main() unwinding boilerplate
- event: replace pthread_cancel by pthread_join
- event: resolve buffer overrun in ev_deqwork
- event: switch g_dequeue_lists to a stdlib container
- event: switch g_enqueue_lists to a stdlib container
- event: switch g_host_list to a stdlib container
- event: switch HOST_NODE::phash to a stdlib container
- event: switch listnode allocations to new/delete
- event: switch to std::mutex
- exch: add length parameter to common_util_addressbook_entryid_to_username
- exch: add length parameter to common_util_check_delegate
- exch: add length parameter to common_util_essdn_to_username
- exch: add length parameter to common_util_parse_addressbook_entryid
- exch: add length parameter to \*_to_essdn functions
- exchange_emsmdb: add directive exrpc_debug
- exchange_emsmdb: add length parameter to common_util_entryid_to_username
- exchange_emsmdb: add length parameter to common_util_essdn_to_username
- exchange_emsmdb: add variable for enabling trivial ROP status dumps
- exchange_emsmdb: allow setting rop_debug from config file
- exchange_emsmdb: change ATTACHMENT_OBJECT freestanding functions to member funcs
- exchange_emsmdb: change FASTDOWNCTX_OBJECT freestanding functions to member funcs
- exchange_emsmdb: change FASTUPCTX_OBJECT freestanding functions to member funcs
- exchange_emsmdb: change FTSTREAM_PARSER freestanding functions to member funcs
- exchange_emsmdb: change ICSDOWNCTX_OBJECT freestanding functions to member funcs
- exchange_emsmdb: change ICSUPCTX_OBJECT freestanding functions to member funcs
- exchange_emsmdb: change MESSAGE_OBJECT freestanding functions to member funcs
- exchange_emsmdb: change STREAM_OBJECT freestanding functions to member funcs
- exchange_emsmdb: change SUBSCRIPTION_OBJECT freestanding functions to member funcs
- exchange_emsmdb: collect magic array size into a mnemonic
- exchange_emsmdb: compact common subexpressions
- exchange_emsmdb: compact common_util hook definitions
- exchange_emsmdb: compact exmdb_client declaration boilerplate
- exchange_emsmdb: compact exmdb_client hook definitions
- exchange_emsmdb: compact if-1L-1L blocks to use ?:
- exchange_emsmdb: compact if-1L-1L into ?:
- exchange_emsmdb: compact repeated expression (T*)expr
- exchange_emsmdb: const qualifiers for logon_object_check_readonly_property
- exchange_emsmdb: deindent ftstream_parser_read_element
- exchange_emsmdb: deindent oxcfold_deletemessages
- exchange_emsmdb: deindent rop_syncimportdeletes
- exchange_emsmdb: delete unused function folder_object_get_tag_access
- exchange_emsmdb: delete unused function table_object_get_table_id
- exchange_emsmdb: emit MID during rop_sendmessage as hex
- exchange_emsmdb: kick threads with a signal upon termination request
- exchange_emsmdb: make folder_object_* member functions
- exchange_emsmdb: make logon_object_check_private a member function
- exchange_emsmdb: make logon_object_get_account a member function
- exchange_emsmdb: make logon_object_get_dir a member function
- exchange_emsmdb: make logon_object_guid a member function
- exchange_emsmdb: make logon_object_* member functions
- exchange_emsmdb: quench repeated ((T*)expr)
- exchange_emsmdb: reduce indent in ftstream_producer_write_groupinfo
- exchange_emsmdb: reduce indent in rop_querynamedproperties
- exchange_emsmdb: repair botched access check in rop_syncconfigure
- exchange_emsmdb: replace folder_object_get_calculated_property silly casts
- exchange_emsmdb: restore MOH functions
- exchange_emsmdb: rework return codes for emsmdb_interface_connect_ex
- exchange_emsmdb: source inline folder_object_get_id
- exchange_emsmdb: source inline folder_object_get_type
- exchange_emsmdb: source inline logon_object_get_account_id
- exchange_emsmdb: source inline logon_object_get_logon_mode
- exchange_emsmdb: source inline logon_object_get_mailbox_guid
- exchange_emsmdb: source inline table_object_get_rop_id
- exchange_emsmdb: store ownership bit
- exchange_emsmdb: substitute lookalike variable names
- exchange_emsmdb: switch to std::mutex
- exchange_emsmdb: trim goto from emsmdb_interface_connect_ex
- exchange_emsmdb: trim single-use variables in ftstream_producer
- exchange_emsmdb: turn freestanding FTSTREAM_PRODUCER functions into member ones
- exchange_emsmdb: turn freestanding ICS_STATE functions into member ones
- exchange_emsmdb: use "auto" specifier with common_util_get_propvals
- exchange_emsmdb: use "auto" specifier with emsmdb_interface_get_emsmdb_info
- exchange_emsmdb: use "auto" specifier with rop_processor_get_logon_object
- exchange_emsmdb: use mnemonic names for RPC opnums
- exchange_emsmdb: wrap FASTDOWNCTX_OBJECT in unique_ptr
- exchange_emsmdb: wrap FASTUPCTX_OBJECT in unique_ptr
- exchange_emsmdb: wrap FTSTREAM_PARSER in unique_ptr
- exchange_emsmdb: wrap FTSTREAM_PRODUCER in unique_ptr
- exchange_emsmdb: wrap ICS_STATE in unique_ptr
- exchange_emsmdb: wrap LOGON_OBJECT in unique_ptr
- exchange_emsmdb: wrap STREAM_OBJECT in unique_ptr
- exchange_emsmdb: wrap SUBSCRIPTION_OBJECT in unique_ptr
- exchange_nsp: add length parameter to ab_tree_get_display_name
- exchange_nsp: add PLUGIN_RELOAD functionality
- exchange_nsp: adjust ab_tree code to zcore ab_tree again
- exchange_nsp: clear some type overlaps
- exchange_nsp: comapct if-1L-1L blocks to use ?:
- exchange_nsp: combine LPROPTAG_ARRAY / MID_ARRAY
- exchange_nsp: combine STRING_ARRAY / STRINGS_ARRAY
- exchange_nsp: compact repeated expression (T*)expr
- exchange_nsp: deindent ab_tree_get_node_type, ab_tree_get_server_dn
- exchange_nsp: dissolve 11 type aliases
- exchange_nsp: dissolve 4 type aliases
- exchange_nsp: drop implicit conversion of AB_BASE_REF
- exchange_nsp: replace custom AB_BASE_REF by unique_ptr-with-deleter
- exchange_nsp: resolve some copy-paste flagged code
- exchange_nsp: switch g_base_hash to a stdlib container
- exchange_nsp: switch to documented MAPI type names
- exchange_nsp: switch to std::mutex
- exchange_nsp: use implicit conversion from nullptr to AB_BASE_REF
- exchange_nsp: use mnemonic names for RPC opnums
- exchange_rfr: add length parameter to rfr_get_newdsa
- exchange_rfr: use mnemonic names for RPC opnums
- exch: centralize pidlid constants
- exch: change overlapping variable names g_cache_interval
- exch: compact conditional expressions around sqlite3_step
- exch: compact repeated logic involving rop_make_util_*_guid
- exch: compact return expressions
- exch: compact tag list modifications
- exch: construct SQL queries with snprintf rather than sprintf
- exch: CSE-combine permission checks
- exch: cure overlapping variable names (improve debugging)
- exch: deduplicate exmdb_ext.cpp
- exch: deduplicate struct DB_NOTIFY_DATAGRAM
- exch: deduplicate struct EXMDB_REQUEST
- exch: deduplicate struct EXMDB_RESPONSE
- exch: delete empty functions
- exch: delete xstmt::finalize calls before return
- exch: delete xstmt::finalize calls near end of scope
- exch: expand char arrays to hold usernames (emailaddrs)
- exch: implement send quota
- exch: make IDL-generated exmdb_client_ functions part of a namespace
- exch, mda, mra: add SIGHUP handler
- exch: MH support
- exchnage_nsp: make calls to ab_tree_put_base automatic
- exch: read delegates.txt with a consistent list format
- exch: reduce excess gx_inet_connect messages
- exch: reduce verbosity of ndr_stack_alloc
- exch: rename source directory str_filter to match plugin name
- exch: resolve instances of -Wmissing-braces
- exch: resolve cov-scan reports
- exch: roll nullptr check into xstmt::finalize
- exch: switch to std::mutex
- exch: switch to std::shared_mutex
- exch: trim nullptr post-assignment for xstmt
- exch: use "auto" specifier with get_rpc_info
- exch: wrap ATTACHMENT_OBJECT in unique_ptr
- exch: wrap FOLDER_OBJECT in unique_ptr
- exch: wrap ICSDOWNCTX_OBJECT in unique_ptr
- exch: wrap ICSUPCTX_OBJECT in unique_ptr
- exch: wrap MESSAGE_OBJECT in unique_ptr
- exch: wrap TABLE_OBJECT in unique_ptr
- exmdb_client: drop extra payload_cb==0 check
- exmdb_local: silence a cov-scan warning
- exmdb_provider: add destructor for IDSET_CACHE
- exmdb_provider: add length parameter to common_util_entryid_to_username
- exmdb_provider: add missing pointer advancements in message_rectify_message
- exmdb_provider: add missing return statements after db_engine_put_db
- exmdb_provider: add unwinding for plugin startup
- exmdb_provider: add/utilize xstmt::finalize
- exmdb_provider: add variable for enabling trivial RPC status dumps
- exmdb_provider: allow reduction of cache_interval down to 1s
- exmdb_provider: bump default limits for stub threads and router connections
- exmdb_provider: change g_connection_list to a stdlib container
- exmdb_provider: change g_router_list to a stdlib container
- exmdb_provider: compact common subexpressions
- exmdb_provider: compact common_util hook definitions
- exmdb_provider: compact exmdb_client hook registrations
- exmdb_provider: compact if-1L-1L into ?:
- exmdb_provider: compact long common subexpressions
- exmdb_provider: compact repeated error checking
- exmdb_provider: compact repeated expression (T*)expr
- exmdb_provider: cure nullptr dereferences in ext_rule OP_FORWARD processing
- exmdb_provider: cure "SELECT count(idx)" error messages
- exmdb_provider: decide for sqlite3_finalize based upon pointer to be freed
- exmdb_provider: deindent table_load_content_table
- exmdb_provider: deindent table_load_hierarchy
- exmdb_provider: dissolve goto statements in db_engine_notify_content_table_add_row
- exmdb_provider: dissolve goto statements in exmdb_server_get_content_sync
- exmdb_provider: dissolve goto statements in table_load_content_table
- exmdb_provider: emit log message when sqlite DBs cannot be opened
- exmdb_provider: emit warning when folder_type is indeterminate
- exmdb_provider: enable ctor/dtor on OPTIMIZE_STMTS
- exmdb_provider: factor out folder name test into separate function
- exmdb_provider: reduce indent in exmdb_parser.cpp:thread_work_func
- exmdb_provider: reduce indent in folder_empty_folder
- exmdb_provider: reduce variable scope in folder_empty_folder
- exmdb_provider: reload exrpc_debug variable on SIGHUP
- exmdb_provider: reorder error case handling in exmdb_server_create_folder_by_properties
- exmdb_provider: reorder if-else blocks in table_load_content_table to facilitate deindent
- exmdb_provider: reorder if-else blocks in table_load_hierarchy to facilitate deindent
- exmdb_provider: replace pthread_cancel by join procedure
- exmdb_provider: retire W-1299 warning
- exmdb_provider: scoped cleanup for DB_ITEM objects
- exmdb_provider: set PR_READ based upon PR_MESSAGE_FLAG
- exmdb_provider: show exrpc requests with succinct result code
- exmdb_provider: silence unchecked return values in exmdb_server_set_message_instance_conflict
- exmdb_provider: simplify parts of folder_empty_folder
- exmdb_provider: split common_util_get_properties into more sensible subfunctions
- exmdb_provider: stop using strncpy
- exmdb_provider: switch g_hash_list to a stdlib container
- exmdb_provider: switch largely to std::mutex
- exmdb_provider: use "auto" keyword around gx_sql_prep
- exmdb_provider: use "auto" specifier with instance_get_instance
- exmdb_provider: warn when store directory inaccessible
- exmdb_provider: wrap DB_ITEM in a unique_ptr
- exmdb_provider: wrap sqlite3_close in an exit scope
- freebusy: centralize pidlid constants
- freebusy: compact if-1L-1L blocks to use ?:
- http: add idempotent return stmts to facilitate deindent
- http: add plugin support functions
- http: better status codes when FastCGI is not available
- http: centralize call to http_end
- http: compact read/SSL_read calls in http_parser_process
- http: deindent htparse_*
- http: deindent pdu_processor_destroy
- http: drop implicit conversion of VCONN_REF
- http: emit status 503 for "out of resources" cases
- http: factor out building of 408-typed response
- http: factor out building of 4xx-typed response
- http: factor out building of 5xx-typed response
- http: factor out END_PROCESSING code block from http_parser_process
- http: make calls to http_parser_put_vconnection automatic
- http: make the different 503 response codes more discernible
- http: move rfc1123_dstring to lib and add a size argument
- http: narrow the scope of http_parser_process local variables
- http: quench "unloading <nothing>" messages
- http: reduce messages' log level from 8 to 6
- http: reorder if-else branches to facilitate deindent
- http: section htparse_* into lambdas for function splitting
- http: section http_parser_process into lambdas for function splitting
- http: split function http_parse_process
- http: split functions htparse_rdhead, htparse_rdbody, htparse_wrrep, htparse_wait
- http: switch g_vconnection_list to a stdlib container
- http: switch HPM plugin list to a stdlib container
- http: switch largely to std::mutex
- http: switch PDU plugin list to a stdlib container
- http: switch service plugin list to a stdlib container
- http: trim use of strncpy / adjust buffer sizes
- http: use "auto" keyword around http_parser_get_vconnection
- imap: break up imap_parser_process into more sensible subfunctions
- imap: cleanup unused variables
- imap: clear ineffective unsigned comparison
- imap: compact repeated expression (T*)expr
- imap: compact repeated midb error reporting
- imap: compact standardized response line emission
- imap: cure an uninitialized variable issue in ps_stat_appending
- imap: deindent imap_cmd_parser.cpp
- imap: deindent imap_cmd_parser_password2
- imap: deindent imap_parser_process subfunctions
- imap: delete IMAP_CODE enum and reduce numeric range
- imap: delete netconsole routine for imap_code
- imap: delete parsing of imap_code.txt
- imap: do not advertise RFC2971 commands when so disabled
- imap: invert imap_parser_process's if conditions to facilitate deindent
- imap: pass full buffer size to sprintf
- imap: quote folder names in LIST, LSUB, XLIST, STATUS results
- imap: reduce scope of variables imap_parser_process
- imap: reduce scope of variables in imap_parser_process 2
- imap: resolve CHECKED_RETURN cov-scan warning
- imap: resolve memory leak in resource_load_imap_lang_list
- imap: standardized reporting of midb responses
- imap: trim some gotos from imap_parser_process
- imap: unbreak parsing of {} literals
- imap: use "auto" specifier with resource_get_imap_code
- imap: use stdlib container for g_lang_list
- kdb2mt: heed SRCPASS environment variable
- kpd2mt: abandon enable_shared_from_this
- kpd2mt: add YError exception printer
- kpd2mt: support reading attachments
- ldap_adaptor: add missing std::forward<>()
- ldap_adaptor: add option to disable auth connection persistence
- ldap_adaptor: compact config log messages
- ldap_adaptor: establish all server connections on first demand only
- ldap_adaptor: guard against bad_alloc during reload
- ldap_adaptor: ignore search referrals emitted by MSAD
- ldap_adaptor: support config reloading
- ldap_adaptor: unconditionally initialize plugin
- ldap_adaptor: use proper parameters for ldap_sasl_bind simple binding
- lib: add allocator support for EXT_PUSH
- lib: add config_file_get_uint
- lib: add const qualifiers to stream functions
- lib: add const variants for the double_list API
- lib: add ctor/dtor for RTF_READER
- lib: add ctor/dtor to RTF_WRITER
- lib: add default functions for exmdb_rpc hooks
- lib: add dtor to EXT_PUSH
- lib: add exmdb_rpc_free hook
- lib: add generational support to resource_pool
- lib: add hex2bin function
- lib: add initializers for binhex.cpp:READ_STAT
- lib: add ip_filter_add to list of exempted warnings about svc funcs
- lib: add length parameter to GET_USERNAME
- lib: add MAPI_E_ constants as comments to standard ec* codes
- lib: add member initialization to EXT_PULL/EXT_PUSH
- lib: add missing newline in slurp_file
- lib: add more codes to exmdb_rpc_strerror
- lib: add new fields for orgs user table
- lib: add OOP-style interface/member functions to EXT_PULL class
- lib: add OOP-style interface / member functions to EXT_PUSH class
- lib: add plugin call type RELOAD
- lib: add PST properties to mapidefs.h
- lib: add rights flag combinations
- lib: add SCHEDULE_CONTEXT::context_id to easier backreference program contexts
- lib: add textual descriptions for all known EC/RPC errors
- lib: add wrapper for sqlite3_stmt
- lib: adjust mime_get_mimes_digest, mime_get_structure_digest argument and return types
- lib: adjust parse_mime_field argument and return types
- lib: adjust qp_decode return type
- lib: allow redirecting HX_strlcpy to snprintf
- lib: automatic finalization of xstmt
- lib: automatic memory mgt for FOLDER_CONTENT
- lib: avoid double UTF-8 encoding by html_to_plain
- lib: avoid joining a non-existing thread
- lib: cease treating '#' in config values as comment
- lib: change FOLDER_CONTENT freestanding functions to member funcs
- lib: change mail_get_length return type to ssize_t
- lib: change overquota report code to MAPI_E_STORE_FULL
- lib: class maintenance on resource_pool
- lib: collect magic array size into a mnemonic
- lib: combine common expressions into function strange_roundup
- lib: combine copy-and-pasted code into exmdb_rpc_strerror
- lib: combine duplicated unique_tie implementation
- lib: combine underflow/overflow protection logic near add/subtract
- lib: comment out all unused proptags
- lib: compact repeated expression (T*)expr
- lib: consolidate exmdb socket read/write functions
- lib: convert incomplete and syntactically broken RTF anyway
- lib: deduplicate and use ACTTYPE names from documentation
- lib: deduplicate decls for ADVISE_INFO, NOTIF_SINK
- lib: deduplicate decls for FLATUID, FLATUID_ARRAY
- lib: deduplicate decls for MESSAGE_STATE, STATE_ARRAY
- lib: deduplicate decls for NEWMAIL_ZNOTIFICATION, OBJECT_ZNOTIFICATION
- lib: deduplicate decls for PERMISSION_ROW, PERMISSION_SET
- lib: deduplicate decls for PROPERTY_NAME, PROPNAME_ARRAY
- lib: deduplicate decls for PROPID_ARRAY
- lib: deduplicate decls for PROPTAG_ARRAY
- lib: deduplicate decls for RESTRICTION*
- lib: deduplicate decls for RULE_DATA
- lib: deduplicate decls for RULE_LIST
- lib: deduplicate decls for {SHORT,LONG,LONGLONG,STRING}_ARRAY
- lib: deduplicate decls for SORT_ORDER, SORTORDER_SET
- lib: deduplicate decls for struct BINARY, BINARY_ARRAY
- lib: deduplicate decls for struct GUID, GUID_ARRAY
- lib: deduplicate decls for TAGGED_PROPVAL, TPROPVAL_ARRAY, TARRAY_SET
- lib: deduplicate decls for ZNOTIFICATION, ZNOTIFICATION_ARRAY
- lib: deduplicate display type constants
- lib: deduplicate exmdb_client_ declarations
- lib: deduplicate exmdb_rpc.cpp
- lib: deduplicate PidLid constants
- lib: deduplicate PLUGIN_ definitions
- lib: deduplicate resource_get_ defines
- lib: deindent exmdb_ext.cpp
- lib: delete empty function ext_buffer_pull_free
- lib: delete empty function single_list_free
- lib: delete redundant buffer packing functions
- lib: delete unused array.cpp
- lib: delete unused implementation of strcasestr
- lib: delete unused PT_STRING8 variants of MAPI property definitions
- lib: dissolve goto statements in exmdb_ext.cpp
- lib: do away with contexts_pool function pointer casting
- lib: drop 3rd argument from gx_sql_prep
- lib: drop pthread_cancel from console_server_notify_main_stop
- lib: ensure mime_get_length callers check for <0
- lib: expand char arrays to hold usernames (emailaddrs)
- lib: expand field sizes of EMAIL_ADDR
- lib: expand mapidefs comment about MS-OAUT
- lib: handle BinHex repetition char 0x90 at start of buffer
- lib: have unique_tie::operator~ clear all private members
- lib: make arglist part of the EXMIDL/ZCIDL macro
- lib: make ext_buffer_push run in amortized linear
- lib: make LONG_ARRAY et al trivial again
- lib: mark EXT_PULL::init as requiring an allocator
- lib: more detailed error return values for rtf_convert_group_node
- lib: pick a better initial size for dynamic EXT_PUSH buffers
- lib: put Olson tz code into a namespace
- lib: rectify syntax error for beXX_to_cpu
- lib: reduce indent of html_init_library
- lib: reduce requirements for ext_buffer.hpp inclusion
- lib: rename MAPI_ to ZMG_ constants
- lib: replace hard-to-read byteswapping macros
- lib: replace PROP_TAG_ADDRESBOOK* with standardized PR_ names
- lib: rewrite config_file_save for size
- lib: sort proptag lists
- lib: split mysql parts off database.h
- lib: stay silent on absence of optional service functions
- lib: support for reading type-2 ABKT templates
- lib: switch bounce_producer's g_resource_list to a stdlib container
- lib: switch bounce_producer to C++ stdlib mutexes
- lib: switch service.context_num to uint
- lib: switch to ABK display template control type/flag names from the docs
- lib: switch to std::mutex
- lib: trim 3rd arg to contexts_pool_init
- lib: trim gotos from rtf_convert_group_node
- lib: turn MIME_FIELD length values into unsigneds
- lib: use common-place PR_OOF_*/PR_EC_* tag names
- lib: use full 8-char salt for md5crypt
- lib: use size_t for LIST_FILE members
- lib: use standardized folder deletion flag names
- lib: use standardized fright* flag names
- lib: use standardized MAPI_ object type names
- lib: use standardized MSGFLAG_ message flag names
- lib: use standardized PR_ACCESS* tag names
- lib: use standardized PR_ATTACH_DATA_BIN/OBJ tag name
- lib: use standardized PR_ATTACH_* tag names
- lib: use standardized PR_BODY tag name
- lib: use standardized PR_CHANGE_KEY tag name
- lib: use standardized PR_CREATION_TIME tag name
- lib: use standardized PR_DELETED_* tag names
- lib: use standardized PR_DISPLAY_NAME tag name
- lib: use standardized PR_DISPLAY_* tag names
- lib: use standardized PR_EMAIL_ADDRESS tag name
- lib: use standardized PR_ENTRYID tag name
- lib: use standardized PR_INTERNET_CPID, PR_LOCALE_ID
- lib: use standardized PR_IPM_* tag names
- lib: use standardized PR_LAST_MODIFICATION_TIME tag name
- lib: use standardized PR_MESSAGE_FLAGS tag name
- lib: use standardized PR_MESSAGE_SIZE tag name
- lib: use standardized PR_MESSAGE_* tag names
- lib: use standardized PR_OBJECT_TYPE tag name
- lib: use standardized PR_PARENT_* tag names
- lib: use standardized PR_PREDECESSOR_CHANGE_LIST tag name
- lib: use standardized PR_READ tag name
- lib: use standardized PR_RECORD_KEY tag name
- lib: use standardized PR_SMTP_ADDRESS tag name
- lib: use standardized PR_SOURCE_KEY tag name
- lib: use standardized PR_STORE_* tag names
- lib: use standardized PR_*SUBJECT* tag names
- lib: use standardized PR_* tag names
- lib: use stdlib containers for html.cpp
- lib: use std::min for memcpy
- lib: use STREAM_SEEK, BOOKMARK names from documentation
- logthru: add logfile support and reloading
- mapi_lib: add length parameter to common_util_entryid_to_username
- mapi_lib: add length parameter to oxcical_get_smtp_address
- mapi_lib: add length parameter to oxcmail_export_address
- mapi_lib: add length parameter to oxcmail_export_addresses
- mapi_lib: add length parameter to oxcmail_get_smtp_address
- mapi_lib: centralize element growth parameters
- mapilib: combine oxcical pidlid constants
- mapilib: combine oxcmail pidlid constants
- mapi_lib: compact busy status int/string mapping
- mapi_lib: compact calendar scale int/string mapping
- mapilib: compact oxcical if-1L-1L to ?:
- mapi_lib: compact replicated busystatus emission code
- mapi_lib: complete tpropval_array conversion to stdbool
- mapi_lib: delete unnecessary memcpy during EXT_PULL::g_wstr
- mapi_lib: guard against integer underflow in pull_svreid
- mapi_lib: repair RECIPIENT_ROW::pdisplay_type pointing to stack
- mapi_lib: replace address property magic values by standardized mnemonics
- mapi_lib: replace busy status magic values by standardized mnemonics
- mapi_lib: resolve instances of -Wabsolute-value
- mapi_lib: rework code to soothe clang analyzer warning
- mapi_lib: silence clang warning about uninitialized value in RTF parser
- mapi_lib: support for the olWorkingElsewhere busy status
- mapi_lib: support MH encodings
- mapilib: switch oxcical from INT_HASH to unordered_map<int>
- mapilib: switch oxcmail from INT_HASH to unordered_map<int>
- mapi_lib: use standardized calendar scale enum names
- mda, mra: add const/unsigned qualifiers
- mda, mra: compact system_service hook definitions
- mda, mra: expand char arrays to hold usernames (emailaddrs)
- mda, mra: handle multipurpose dispatch return codes
- mda, mra: turn dispatch value into a multi-purpose field
- mda, mra: use stdlib container for g_def_code_table
- mda: switch to std::mutex
- mda: switch to std::shared_mutex
- midb: add additional locking needed for g_server_list
- midb_agent: compact get_connection code
- midb_agent: deindent fetch_detail, fetch_detail_uid
- midb_agent: deindent get_connection
- midb_agent: reduce excess gx_inet_connect messages
- midb_agent: speed up termination during midb connection trying
- midb_agent: use "auto" specifier with get_connection()
- midb: break up if stmt for static analysis
- midb: change silly FDDT return code on absent folder
- midb: check return value of tpropval_array_set_propval
- midb: compact repeated expression (T*)expr
- midb: default REMOTE_CONN_floating(&&)
- midb: drop implicit conversion of IDB_REF
- midb: emit log message when sqlite DBs cannot be opened
- midb: make calls to mail_engine_put_idb automatic
- midb: mark IDB_REF(IDB_ITEM \*) as explicit
- midb: reduce indent in midcl_thrwork
- midb: reduce main() unwinding boilerplate
- midb: replace custom IDB_REF by unique_ptr-with-deleter
- midb: replace magic return values by mnemonics
- midb: replace pthread_cancel by join procedure
- midb: restore str_hash_iter_get_value semantics
- midb: switch g_hash_list to a stdlib container
- midb: switch largely to std::mutex
- midb: use "auto" keyword around gx_sql_prep
- midb: use "auto" keyword around mail_engine_get_idb, mail_engine_get_folder_id
- midb: utilitze xstmt::finalize
- midb: wrap sqlite3_close in an exit scope
- midb: zero-initialize AGENT_THREAD, REMOTE_CONN struct members
- misc: replace more strncpy sites by HX_strlcpy
- mlist_expand: expand mailaddr buffers to UADDR_SIZE
- mod_cache: add missing include <atomic>
- mod_cache: implement fallback to built-in defaults
- mod_cache: move cache.txt reading to separate function
- mod_cache: switch to std::mutex
- mod_cache: use stdlib containers for g_directory_list
- mod_fastcgi: avoid using /../ in path
- mod_proxy: move proxy.txt reading into separate function
- mod_proxy: pick better variable names
- mod_proxy: switch g_proxy_list to a stdlib container
- mra: switch to std::mutex
- mra: switch to std::shared_mutex
- mt2exm: set PR_LAST_MODIFICATION_TIME if not present
- mt2exm: start exmdb connection after base maps have been read
- mysql_adaptor: add manpage reference to logmsg about schema_upgrade skip/abort
- mysql_adaptor: add schema_upgrades=hostid
- mysql_adaptor: change default schema_upgrades action to "skip"
- mysql_adaptor: collect magic array size into a mnemonic
- mysql_adaptor: compact config log messages
- mysql_adaptor: complain if there is an overlap between user and alias table
- mysql_adaptor: deindent svc_mysql_adaptor
- mysql_adaptor: deindent verify_password
- mysql_adaptor: delete duplicate get_username <> get_username_from_id
- mysql_adaptor: disable firsttime password feature by default
- mysql_adaptor: establish server connections on demand only
- mysql_adaptor: heed user_properties.order_id from now on
- mysql_adaptor: move z_null to single user .cpp file
- mysql_adaptor: new config loader with std::string and direct parameter init
- mysql_adaptor: pass length parameter to firsttime_password
- mysql_adaptor: reorder functions
- mysql_adaptor: silence successful reconnect messages
- mysql_adaptor: support config reloading
- mysql_adaptor: use SHA512 crypt for firsttime_pw functionality
- oxdisco: add built-in defaults
- oxdisco: handle empty input XML document
- pam_gromox: set global config file object
- pff2mt: dump MNID_ID names with hex ID
- pff2mt: resolve instances of -Wmismatched-new-delete
- pff2mt: restore folder progress message
- pffimport: abandon libpff item type for parent descriptor
- pffimport: add command for splicing PFF objects into existing store hierarchy
- pffimport: add const qualifiers to some functions
- pffimport: add more dry-run mode checks
- pffimport: add -p option for property detail view
- pffimport: add support for transferring PT_CLSID propvals
- pffimport: attachment support
- pffimport: avoid running into PF-1034/PF-1038 assertions
- pffimport: consistently report errors to stderr
- pffimport: consistent return value checks
- pffimport: cure occurrence of PF-1036 exception
- pffimport: ditch extraneous argument to az_item_get_propv
- pffimport: do not abort when treevisualizing u-0 type nodes
- pffimport: drop extra set of braces from -p output
- pffimport: dump NID_MESSAGE_STORE during -t walk
- pffimport: dump NID_NAME_TO_ID_MAP during -t walk
- pffimport: dump raw mvprop data for analysis
- pffimport: emit all messages to stderr
- pffimport: emit terse progress report in absence of -t
- pffimport: facilitate debugging 0-byte multivalue properties
- pffimport: factorize initial destination mailbox discovery
- pffimport: factor out folder map dumping
- pffimport: factor out part of the namedprop resolution
- pffimport: handle Unicode properties with bogus data
- pffimport: hook up attachments to their message objects
- pffimport: implement named property translation
- pffimport: infrastructure for folder mapping
- pffimport: let az_item_get_string_by_propid take a proptag
- pffimport: limit ASCII string dumps like Unicode dumps
- pffimport: lookup named properties ahead of time
- pffimport: move generic functions to another file
- pffimport: move to pipeline-based importer architecture (pff2mt, mt2exm)
- pffimport: new way to track each item level's parent
- pffimport: partial multivalue property support
- pffimport: recognize --help option
- pffimport: reduce az_item_get_record_entry_by_type arguments
- pffimport: refine check for broken mvprop blocks
- pffimport: reorder blocks in do_item2 for function split
- pffimport: replace manual msg dumper by MESSAGE_CONTENT dumper
- pffimport: replace recordent dumper by TAGGED_PROPVAL dumper
- pffimport: report and skip over broken attachments
- pffimport: report NID_MESSAGE_STORE presence as normal condition
- pffimport: resolve instance of -Wmain
- pffimport: resolve static analyzer warnings
- pffimport: separate function for folder map population
- pffimport: skip server-side propname resolution in dry mode
- pffimport: skip transfer message in dry run
- pffimport: spacing adjustments in tree output
- pffimport: split do_item2 per pff item type
- pffimport: split do_print_extra off do_item2
- pffimport: start analysis at the absolute PFF root
- pffimport: stop showing empty summary displayname/subject in tree mode
- pffimport: stop showing too many commas in -t/-p output
- pffimport: switch mostly to exception-based error reporting
- pffimport: treat contacts, notes, tasks like email messages
- php-lib-db: add log functions and replace die
- php_mapi: address a potential future use-after-free
- php_mapi: better error descriptions for exceptions
- php_mapi: compact if-1L-1L blocks to use ?:
- php_mapi: compact repeated error checking
- php_mapi: deduplicate ext_pack_pull_*
- php_mapi: deduplicate ONEOFF_ENTRYID
- php_mapi: deduplicate PULL_CTX/PUSH_CTX
- php_mapi: deduplicate types.h declarations
- php_mapi: unbreak STREAM_OBJECT seeking
- plugins: compact config file reading
- pop3: add notes for POP3_CONTEXT::array
- pop3: compact standardized response line emission
- pop3: delete netconsole routine for pop3_code
- pop3: delete parsing of pop3_code.txt
- pop3: delete POP3_CODE enum and reduce numeric range
- pop3: delete unused units_allocator.cpp
- pop3: make ip6_filter optional
- pop3: use a stdlib container for MSG_UNIT arrays
- Rebranding followup
- rebuild: employ documented option parsing
- rebuild: trim dead stores
- rebuild: use "auto" keyword around gx_sql_prep
- Revert "ldap_adaptor: add option to disable auth connection persistence"
- smtp: add config directive "command_protocol"
- smtp: bump logmsg severity for rejected deliveries
- smtp: collect smtp_parser_init parameters in a struct
- smtp: compact standardized response line emission
- smtp: delete netconsole routine for smtp_code
- smtp: delete parsing of smtp_code.txt
- smtp: delete SMTP_CODE enum and reduce numeric range
- smtp: join overlapping struct definitions and move to stdlib containers
- smtp: reduce indent in smtp_cmd_handler_check_onlycmd
- smtp: rename to delivery-queue
- str_filter: indent reduction in audit_filter.cpp
- str_filter: replace internal condition for audit-disabled case
- str_filter: switch g_audit_hash to a stdlib container type
- str_table(domain_list): add PLUGIN_RELOAD functionality
- system: add ProtectSystem=yes to systemd units
- system: delete target units
- tests: add more zendfake symbols
- timer: add missing pthread_join for accept thread
- timer: add pthread_kill for speedier shutdown
- timer_agent: reduce excess gx_inet_connect messages
- timer: avoid crash on shutdown
- timer: lambda-ify block of code for outfactoring
- timer: move to std::mutex
- timer: replace pthread_cancel by pthread_join
- timer: split code block into separate function
- timer: switch connection list to std::list
- timer: switch timer list to std::list
- timer: use exit scopes and compact repeated teardown code
- tools: add documented -? option
- tools: add gromox-pffimport script with replacement notice
- tools: construct SQL queries with snprintf rather than sprintf
- tools: delete digest utility
- tools: new utility "gromox-kpd2mt"
- tools: PFF importer
- tools: print conn info when database connection has failed
- tools: reduce code nesting level
- tools: rename kpd2mt to kdb2mt
- tools: utilize xstmt::finalize
- tools: wrap sqlite3_close in an exit scope
- tools: wrap sqlite3_shutdown in an exit scope
- zcore: add directive zrpc_debug
- zcore: add directive zrpc_debug
- zcore: add length parameter to ab_tree_get_display_name
- zcore: add missing free() call when object_tree_create fails
- zcore: add variable for enabling trivial RPC status dumps
- zcore: change ATTACHMENT_OBJECT freestanding functions to member funcs
- zcore: change CONTAINER_OBJECT freestanding functions to member funcs
- zcore: change ICSDOWNCTX_OBJECT freestanding functions to member funcs
- zcore: change ICSUPCTX_OBJECT freestanding functions to member funcs
- zcore: change MESSAGE_OBJECT freestanding functions to member funcs
- zcore: change TABLE_OBJECT freestanding functions to member funcs
- zcore: change USER_OBJECT freestanding functions to member funcs
- zcore: collapse zarafa_server.cpp nested ifs into one
- zcore: compact common subexpressions
- zcore: compact if-1-1 blocks to use ?:
- zcore: compact if-1L-1L near return into ?:
- zcore: compact repeated expression (T*)expr
- zcore: compact repeated logic involving rop_make_util_*_guid
- zcore: compact repeated static_cast exprs
- zcore: CSE-combine multiflag checks
- zcore: defer a few unique_ptr::reset calls on specific paths
- zcore: deindent ab_tree_get_node_type, ab_tree_get_server_dn
- zcore: deindent folder_object.cpp, store_object.cpp
- zcore: deindent object_tree_free_root
- zcore: deindent store_object_get_named_{propids,propnames}
- zcore: deindent zarafa_server_deletemessages
- zcore: deindent zarafa_server_logon
- zcore: deindent zarafa_server_notification_proc
- zcore: deindent zarafa_server_openabentry
- zcore: deindent zarafa_server_submitmessage
- zcore: do not switch to Chinese when store language unresolvable
- zcore: drop implicit conversion of AB_BASE_REF
- zcore: drop implicit conversion of USER_INFO_REF
- zcore: factor PROP_TAG_ECUSERLANGUAGE handling out to split function
- zcore: lambdaify sections of hierconttbl_query_rows
- zcore: lambdaify sections of table_object_get_folder_permission_rights
- zcore: log attempts to send mail to no recipients
- zcore: log failed attempts to use delegate FROM
- zcore: make calls to ab_tree_put_base automatic
- zcore: make calls to zarafa_server_put_user_info automatic
- zcore: make g_notify_table a stdlib container
- zcore: make g_session_table a stdlib container
- zcore: make g_user_table a stdlib container
- zcore: make object_tree_* member functions
- zcore: make OBJECT_TREE::phash a stdlib container
- zcore, php_mapi: deduplicate RPC_REQUEST
- zcore, php_mapi: deduplicate RPC_RESPONSE
- zcore: reduce main() unwinding boilerplate
- zcore: reload zrpc_debug variable on SIGHUP
- zcore: repair inaccurate BOOL value passed to container_object_get_container_table_num
- zcore: replace custom AB_BASE_REF by unique_ptr-with-deleter
- zcore: replace custom USER_INFO_REF by unique_ptr-with-deleter
- zcore: replace pthread_cancel by join procedure
- zcore: resolve instances of -Wformat*
- zcore: resolve deadcode warning for FOLDER_OBJECT::updaterules
- zcore: skip call to table_object_set_table_id for unhandled table types
- zcore: source code indent reduction
- zcore: source-inline folder_object_get_id function calls
- zcore: source-inline folder_object_get_store function calls
- zcore: source-inline folder_object_get_type function calls
- zcore: source-inline store_object_check_private function calls
- zcore: source-inline store_object_get_account_id function calls
- zcore: source-inline store_object_get_mailbox_guid function calls
- zcore: split functions off hierconttbl_query_rows
- zcore: split functions off table_object_get_folder_permission_rights
- zcore: stop using strncpy
- zcore: store ownership bit
- zcore: switch ab_tree from INT_HASH to unordered_map
- zcore: trim braces on if blocks with trivial condition /FALSE == .*b_/
- zcore: trim braces on if blocks with trivial condition /TRUE == .*b_/
- zcore: trim braces on single-expr blocks
- zcore: trim redundant unique_ptr::reset calls
- zcore: turn freestanding FOLDER_OBJECT functions into member ones
- zcore: turn freestanding STORE_OBJECT functions into member ones
- zcore: turn store_object_check_owner_mode into a member function
- zcore: turn store_object_get_account into a member function
- zcore: turn store_object_get_dir into a member function
- zcore: turn store_object_guid into a member function
- zcore: unbreak deletion of origin message during copy-delete moves
- zcore: use "auto" specifier with zarafa_server_get_info
- zcore: use "auto" specifier with zarafa_server_query_session/USER_INFO
- zcore: use stdlib types for USER_INFO members
- zcore: variable scope reduction in table_object_get_folder_permission_rights
- zcore: wrap CONTAINER_OBJECT in unique_ptr
- zcore: wrap OBJECT_TREE in unique_ptr
- zcore: wrap STORE_OBJECT in unique_ptr
- zcore: wrap USER_OBJECT in unique_ptr

Bugfixes
~~~~~~~~

- all: fix instances of -Wmaybe-uninitialized
- all: fix instances of unchecked return values
- all: fix instances of TOCTOU
- all: fix instances of -Wodr
- all: fix instances of -Wformat-truncation
- all: fix instances of -Wsign-compare
- all: fix instances of -Wshadow
- authmgr: fix type mismatch on dlname ldap_auth_login2
- daemons: fix type mismatch on log_info
- daemons: fix unbalanced reference counts on service plugins
- daemons: switch thread numbers to unsigned
- doc: fix wrong file reference in mod_fastcgi.4gx
- email_lib: fix evaluation of undefined variable
- exch: fix instances of -Wunused-*
- exch: fix instances of -Wunused-variable
- exch: fix a number of dead stores
- exch: fix incomplete module teardown on init failure
- exch: fix potential null deref on plugin unload
- exchange_emsmdb: fix an instance of type punning
- exchange_emsmdb: fix comparison against unsigneds
- exchange_emsmdb: fix compiler warning for casting to whacky type
- exchange_emsmdb: fix copy paste error
- exchange_emsmdb: fix crash during getpropertiesall
- exchange_emsmdb: fix crash upon retrieval of some calculated properties
- exchange_emsmdb: fix dereference null return value
- exchange_emsmdb: fix failed substitution logon_object_get_account -> plogon->get_dir
- exchange_emsmdb: fix ftstream_parser_create running into EISDIR error
- exchange_emsmdb: fix incorrect sleep amount
- exchange_emsmdb: fix integer arithmetic and truncation issues in rop_readstream, rop_seekstream
- exchange_emsmdb: fix integer multiplication overflow during quota check
- exchange_emsmdb: fix logical vs. bitwise operator
- exchange_emsmdb: fix read from uninitialized variable
- exchange_emsmdb: fix resource leaks
- exchange_emsmdb: fix ropGetPropertiesList name
- exchange_emsmdb: fix signed arithmetic issues in rop_seekrow
- exchange_emsmdb: fix wrong size argument
- exchange_nsp: fix function signature mismatches
- exchange_nsp: fix nullptr deref in nsp_interface_resolve_names
- exchange_rfr: fix out-of-bounds access
- exmdb_client: fix unspecified state after std::move
- exmdb_provider: fix instance of -Wmissing-declarations
- exmdb_provider: fix instances of FORWARD_NULL
- exmdb_provider: fix a set of unterminated strings
- exmdb_provider: fix an incomplete permission check
- exmdb_provider: fix an out-of-bounds write in common_util_get_proptags
- exmdb_provider: fix an unterminated string buffer in common_util_username_to_essdn
- exmdb_provider: fix broken recursive deletion of folders
- exmdb_provider: fix crash on shutdown near pthread_kill
- exmdb_provider: fix double call to db_engine_put_db
- exmdb_provider: fix hang when aborting midway through db_engine_run
- exmdb_provider: fix illegal mutex double unlock
- exmdb_provider: fix missing calls to db_engine_put_db
- exmdb_provider: fix null dereference in exmdb_parser_stop
- exmdb_provider: fix out-of-bounds write
- exmdb_provider: fix resource leak in exmdb_server_set_message_instance_conflict
- exmdb_provider: fix too early db_engine_put_db calls
- exmdb_provider: fix unchecked return value
- exmdb_provider: fix unchecked return value in exmdb_server_load_message_instance
- exmdb_provider: fix unchecked return values in exmdb_server_flush_instance
- exmdb_provider: fix unused value in exmdb_server_query_table
- exmdb_provider: fix unused value in exmdb_server_store_table_state
- exmdb_provider: fix unused values in table_load_content_table
- exmdb_provider: fix use of wrong quota property
- exmdb_provider: fix wrong serialization of REQ_SET_MESSAGE_READ_STATE
- http: fix a number of dead stores
- http: fix crash when user_default_lang is unset
- http: fix dereference null return value
- http: fix destination buffer too small
- http: fix explicit null dereference
- http: fix ignored return values from ndr_pull_data_*
- http: fix out-of-bounds read
- http: fix out-of-bounds write
- imap: dissolve uses of snprintf to fixed buffer in imap_parser_process
- imap: fix absence of starttls capability keyword
- imap: fix double free during shutdown
- imap: fix garbage listing of folders
- imap: fix off-by-one in literal processing
- imap: fix wrong strptime format for internaldate parsing
- ldap_adaptor: fix incorrect comparison
- ldap_adaptor: fix null deref when LDAP server is away
- lib/mapi: fix possible unsigned underflow
- lib: fix a number of dead stores
- lib: fix comparison against unsigneds (related to mime_get_length)
- lib: fix crash when zcore uses a zero-length name during zcore_callid::COPYFOLDER
- lib: fix inconsistent capacity allocations in ext_buffer
- lib: fix intended return value of gx_snprintf1
- lib: fix multiplication overflow in Olson tz code
- lib: fix out-of-bounds write in parse_mail_addr, parse_mime_addr
- lib: fix parenthesis bugged expression in threads_pool
- lib: fix use-after-destruction near ext_buffer_push_release
- lib: spello fix for pidTag* in comments
- mapi_lib/rtf: fix passing an undefined value between functions
- mapi_lib: fix PidLidIntendedStatus always being olTentative
- mapi_lib: fix an allocation too short
- mapi_lib: fix an out-of-bounds write in oxvcard_import
- mapi_lib: fix memory leak in rtf_load_element_tree
- mapi_lib: fix memory leak in rule_actions_dup
- mapi_lib: fix returns with garbage values
- mda: fix a number of dead stores
- mda: fix spello "envelop"
- midb: fix concurrent use of sqlite data structure
- midb: fix leftover debugging breakpoint infinite loop
- midb: fix out-of-bounds read
- midb: fix unchecked return value
- midb: fix wrong serialization of REQ_LOAD_PERMISSION_TABLE
- misc: fix instances of NULL_RETURNS
- misc: fix two overlapping copy operations
- misc: fix unbounded strcpy calls
- misc: fix uninitialized pointers/scalars
- mod_cache: fix spello "defualt"
- mod_proxy: fix out-of-bounds access parsing proxy.txt
- mra: fix occasional compile error
- mt2exm: add small prefix to log messages
- mt2exm: fix inverted meaning of exm_create_folder::o_excl parameter
- mysql_adaptor: fix unchecked return value
- oxcical: fix possible null deref in oxcical_parse_tzdefinition
- oxdisco: fix incorrect XML tag name "DelpoymentId"
- pff2mt: support oddly-encoded subject prefix length marker
- pffimport: fix cov-scan reports
- pffimport: fix i586 build error
- php_mapi: fix a number of dead stores
- php_mapi: fix signed arithmetic issues in stream_object_seek
- tools: fix crash when /etc/gromox is unreadable
- zcore: fix a number of dead stores
- zcore: fix logical vs. bitwise operator
- zcore: fix mismatch of RESP_CONFIGSYNC, RESP_SYNCMESSAGECHANGE structs
- zcore: fix null deref in delegate rule scenario
- zcore: fix resource leak
- zcore: fix signed arithmetic issues in zarafa_server_seekrow
- zcore: fix unsigned compared against 0
- zcore: fix use after free in zarafa_server_openabentry
- zcore: fix wrong deserialization of DB_NOTIFY_DATAGRAM/FOLDER_MODIFIED
- zcore: fix zarafa_server_openembedded adding wrong message to objtree

Removed
~~~~~~~

- adaptor: remove unused functions
- all: remove config_file_set_value calls with no effect
- all: remove outdated, inaccurate and trivial function descriptions
- all: remove some unused includes
- all: remove unused pthread.h includes
- all: remove unused variables
- exch: remove log_plugin service plugin
- exch: remove mod_proxy
- exchange_emsmdb: remove logically dead code
- exmdb_provider: delete remove() call with garbage parameter
- http: remove unused functions
- ldap_adaptor: remove unnecessary base discovery
- lib: abolish itoa function
- lib: remove ext_pull_ freestanding function variants
- lib: remove ext_push_ freestanding function variants
- lib: remove ineffective unsigned comparison
- lib: remove pointer indirection for PROPERTY_NAME::plid
- lib: remove unused definitions from plugin.hpp
- mda, mra: remove unnecessary decorative comment lines
- midb: remove mail_engine_sync_mailbox's goto spaghetti
- midb: remove unused functions
- midb: remove unused midb protocol commands
- mod_fastcgi: remove unnecessary braces for 1-line blocks
- mysql_adaptor: remove config_file_set_value calls
- mysql_adaptor: remove unused function z_strlen
- php_mapi: remove unused zcore RPC structs
- smtp: remove unused smtp_param::threads_num member
- system: remove obsolete PartOf= directives of systemd units
- zcore: remove constant 2nd argument to table_query_rows
- zcore: remove dead code from storetbl_query_rows
- zcore: remove spurious break in table_object_query_rows
- zcore: remove unused functions

grommunio Sync
--------------

Repository: https://github.com/grommunio/grommunio-sync

Code statistics:

- +23138 lines added
- -25155 lines removed

Commits:

- 2021-08: 5
- 2021-07: 23
- 2021-06: 6
- 2021-05: 1
- 2021-04: 0
- 2021-03: 0

New (Improvements)
~~~~~~~~~~~~~~~~~~

- add missing ADMIN_API_POLICY_ENDPOINT to config.php
- added ProvisioningManager
- added TTL to InterprocessData setData
- added TTL to setKey
- check if contentdata is set before accessing it
- deviceManager is available only when authenticated, adjusting code to match
- enable provisioning by default
- let sync have its own user
- log: assign su permissions for logrotate
- log: update paths
- refactoring provisioning process
- retrieving policies from admin api
- save state data as json
- save states in redis and the user store
- set missing properties for signed emails
- use microtime for start

Bugfixes
~~~~~~~~

- don't serialize json ASDevice in redis
- fix Utils::PrintAsString() to recognize null correctly
- fix fallback to default policies if API endpoint is not available
- rename redis key to statefoldercache

Removed
~~~~~~~

- remove default policies and policyname
- remove grommunio-sync-admin.php

grommunio Setup
---------------

Repository: <internal-only>

Code statistics:

- +2180 lines added
- -1278 lines removed

Commits:

- 2021-08: 18
- 2021-07: 19
- 2021-06: 2
- 2021-05: 8
- 2021-04: 7
- 2021-03: 91

New (Improvements)
~~~~~~~~~~~~~~~~~~

- log: redirect ssl self-generation to log file
- move fullca function to separate script
- move logfile to /var/log/ for persitence
- mysql_adaptor: set schema_upgrade in the right file
- new SQL setup
- new TLS setup dialog
- new hostname dialog
- new repo dialog
- new repo setup
- new setup finish screen
- new welcome screen
- plugin: add onlyoffice as default enabled plugin
- query admin for relayhost and set it in postfix
- rebranding: update URLs / mail
- reject some path injections for FQDN & hostname
- replace cron entry by a persistent systemd timer
- repos: enable autorefresh
- req: add redis new grommunio default service for operation
- res: rename certbot service and timer
- restore sh compatibility
- reword the Lets_Encrypt prompt
- services: don't enable prosody if not checked as to be installed in the first place
- set +x bit on certbot-renew-hook
- setup: be more specific than "Admin UI"
- ssl: adjust to new nginx config structure
- ssl: switch to certbot standalone mode
- strip filler wording from dialog texts
- style/log: re-add indications at which stage the configuration stage runs
- style: avoid mixing double and single quotes in a config file
- style: better dialog in case of failure
- style: better readability through spacing
- style: change idents to one standard
- style: make code-style consistent
- style: put init vars on top, static anyways
- style: re-add unused progress indicators
- style: readability/style
- support "localhost" as a default domain for dirty setups
- support PHP8
- support: add support package
- support: silence killing of bgid
- tls: add the link to the current terms of service from Let's Encrypt
- tls: inform admin about failed certbot command
- tls: move recommended domains to optional
- trim filler wording
- typo: replace _ with space
- typo: stls->starttls
- upgrade to 15.3
- use IPv6 transport and privileged port for LDA
- use mysql to provide virtual_mailbox_domains
- use systemctl, not service
- verify installed amount of memory and warn user
- visibility: don't show all the logs to terminal, pipe to logfile instead.
- workflow: nginx failing start
- write php config to new location

Bugfixes
~~~~~~~~

- nginx: correct replacement of vars
- postfix: FQDN fix
- shellcheck: fix SC2004
- shellcheck: fix SC2006
- shellcheck: fix SC2016
- shellcheck: fix SC2027 && SC2086
- shellcheck: fix SC2046
- shellcheck: fix SC2086
- shellcheck: fix SC2102
- shellcheck: fix SC2129
- shellcheck: fix SC2148
- shellcheck: fix SC2166
- shellcheck: fix SC2223
- shellcheck: fix SC2254
- ssl: fix providing owncert unresolvable loop
- style: readability / style fixes

Removed
~~~~~~~

- Remove \Zb, \Zu escape codes
- Remove inconsistent step counter


grommunio Web
-------------

Repository: https://github.com/grommunio/grommunio-web

Code statistics:

- +15712 lines added
- -4891 lines removed

Commits:

- 2021-08: 18
- 2021-07: 8
- 2021-06: 2
- 2021-05: 3
- 2021-04: 3
- 2021-03: 47

New (Improvements)
~~~~~~~~~~~~~~~~~~

- Add CSS to style popout window
- Add default domain configuration
- Added Development section to Readme
- Disable password plugin server side
- Explicitly show English as British English
- Highlight 'open shared folders' button
- Implement another way to make textareas white without changing notes colors
- Improve darktheme
- Let contact detail dialog show business address by default
- Let web have its own user
- MAPI: add error code to action rejection message dialogs
- MAPI: emit textual error strings
- Plugin: MDM plugin
- Plugin: Meet plugin
- Plugin: Passwd - plugin improvements (handling)
- Plugin: Passwd - reorder conditions for enhancement
- Plugin: Passwd - restore ability to use zcore setpasswd
- Rebrand grammm to grommunio
- Remove redundant error log
- Remove unused themes
- Rename current themes and rename intern light and dark theme
- Reword "Unknown MAPI Error: 0x000003eb"
- Send request to admin API to change the password
- Set page title to something useful
- Sort the language list in the settings dialog
- Style: gradient header in light theme
- Translate ecUnknownUser to a sensible error message
- Try fixing broken popout CSS
- Update border color
- Use DOMPurify as XSS sanitizer
- Use anchored gitignores

Bugfixes
~~~~~~~~

- Fix: ERROR - variable customItems is undeclared
- Fix: broken 'Additional information' textarea
- Fix: color in dropdown box
- Fix: copy & paste from certain browsers end in copy of steuerzeichen.
- Fix: css on firefox
- Fix: dark theme bugs and added css variables to make the code more maintainable
- Fix: invisible settings icon
- Fix: make manifest.xml build and source aware
- Fix: presentation of the topbar with linear-gradient & changed svg color.
- Fix: weird background-color of addressbook

Removed
~~~~~~~

- Core: remove obsolete CmdAgent
- Disable nwjs usage
