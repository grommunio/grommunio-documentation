---
title: "Gromox"
description: "Gromox ist die zentrale Groupware-Serverkomponente von grommunio. Es kann als direkter Ersatz für Microsoft Exchange eingesetzt werden. Konnektivitätsopt…"
sidebar:
  order: 10
---

> Quelle: [gromox](https://github.com/grommunio/gromox) README.

## Gromox

Gromox ist die zentrale Groupware-Serverkomponente von grommunio. Es kann als direkter Ersatz für Microsoft Exchange eingesetzt werden. Zu den Anschlussmöglichkeiten gehören RPC/HTTP (Outlook Anywhere), MAPI/HTTP, EWS, IMAP, POP3, einen SMTP-kompatiblen LDA sowie ein PHP-Modul mit einer Teilmenge der Funktionen von MAPI. Die Komponenten lassen sich über mehrere Hosts hinweg skalieren.

   

Gromox ist modular aufgebaut und besteht aus einer Reihe von Komponenten und Programmen, die den Funktionsumfang des Systems bereitstellen. Dieses Repository enthält eine Reihe von Handbuchseiten, deren gerenderte Version unter [docs.grommunio.com](https://docs.grommunio.com/man/gromox.7.html) zu finden ist.

Anweisungen zur Kompilierung finden Sie in [doc/install.rst](doc/install.rst). Im Verzeichnis [doc/](doc/) befindet sich außerdem weitere, überwiegend technische Dokumentation.

Gromox ist auf andere Komponenten angewiesen, um ein sinnvolles, vollständiges E-Mail-System bereitzustellen,

- Admin API/CLI (Verwaltung): [grommunio Admin API/CLI](https://github.com/grommunio/admin-api)
- Admin-Weboberfläche (Verwaltung): [grommunio Admin Web](https://github.com/grommunio/admin-web)
- Benutzer-Weboberfläche (Web-UI): [grommunio Web](https://github.com/grommunio/grommunio-web)
- Exchange ActiveSync (EAS) (Mobile Geräte): [grommunio Sync](https://github.com/grommunio/grommunio-sync)
- CalDAV & CardDAV (Interoperabilität mit Clients): [grommunio DAV](https://github.com/grommunio/grommunio-dav)
- ein Mail-Transfer-Agent wie Postfix, Exim und weitere
- E-Mail-Sicherheitslösungen wie rspamd und andere (einschließlich kommerzieller Lösungen)

Das grommunio Appliance enthält diese wesentlichen Komponenten und verfügt über eine betriebsbereite Installation von Gromox.

## Support

Support wird von der grommunio GmbH und ihren Partnern angeboten. Weitere Informationen finden Sie unter <https://grommunio.com/>. Ein Community-Forum finden Sie unter <https://community.grommunio.com/>.

Das Quellcode-Repository und der technische Issue-Tracker sind unter <https://github.com/grommunio/gromox> zu finden.

Für direkten Kontakt und die Übermittlung von Informationen zu einer sicherheitsrelevanten verantwortungsvollen Offenlegung wenden Sie sich bitte an [dev@grommunio.com](dev@grommunio.com).

## Standards und Protokolle

Eine Erläuterung dazu finden Sie unter [doc/protocols.rst](doc/protocols.rst).

## Mitwirken

- <https://docs.github.com/en/get-started/quickstart/contributing-to-projects>
- Alternativ können Sie die Commits in einen Git-Speicher Ihrer Wahl hochladen oder die Serie mithilfe von [git format-patch](https://git-scm.com/docs/git-format-patch) als Patchset exportieren und uns den Git-Link bzw. die Patches dann über unsere direkte Kontaktadresse (siehe oben) zukommen lassen.

### Programmieren und Sozialverhalten

Wenn man in Rom ist, sollte man es den Römern gleichtun.

### Quelltext-Layout

- `exch`/:
  - `emsmdb/`: Decoder für EMSMDB/OXCROPS-Aufrufe (guter Ausgangspunkt/mit grep suchbares Schlüsselwort: `rop_ext_pull(EXT_PULL &x, ROP_BUFFER &r)`-Funktion) und Handler-Einstiegspunkt für diese Aufrufe (gsp.: `rop_dispatch`)
  - `ews/`: Logik zur Verarbeitung von EWS-Anfragen (z. B.: `EWSPlugin::dispatch`)
  - `exmdb/`: Der <em>Information Store</em>-Server. Der Decoder für EXRPC-Aufrufe befindet sich in `lib/exmdb_ext.cpp:exmdb_ext_pull_request`; die große Funktion `switch()` wird während <em>make</em> automatisch in `include/exmdb_dispatch.cpp` generiert; Funktionen der Mailbox-Logik beginnen mit der grepbaren Teilzeichenfolge `BOOL exmdb_server::`.
  - `http/`: HTTP-Server
    - HTTP-Anfrage-Parser (z. B.: `htparse_rdhead` und `htparse_rdhead_st` in der Nähe von `/* met the end of request header */`)
    - MSRPC-Parser (z. B.: `pdu_processor_input`)
  - `mh/`: Handler für OXCMAPIHTTP-Anfragen. Es gibt kaum eigentliche Mailbox-Logik, da der Code an emsmdb/nsp-Funktionen weiterleitet.
  - `midb/`: Ein Support-Server speziell für gromox-imap/gromox-pop3, siehe z. B. `mail_engine_commands`. Textbasiertes Eingabeprotokoll.
  - `mysql_adaptor/`: Unterstützungsfunktionen für die Benutzerdatenbank
  - `nsp/`: Dekoder für OXNSPI-Anfragen (gsp.: `exchange_nsp_ndr_pull`) und Logik zur Verarbeitung dieser Anfragen (gsp.: `exchange_nsp_dispatch`)
  - `zcore/`: Statusverwalter für Anfragen von PHP-MAPI. Decoder für ZRPC-Anfragen (gsp. `rpc_parser_dispatch`) und Mailbox-Logik (gsp. `ec_error_t zs_`)
  - `authmgr.cpp`: Komponente zur Steuerung der Authentifizierung zwischen MySQL und LDAP
  - `oxdisco.cpp`: Handler für AutoDiscover-Anfragen
- `lib/`: Funktionen, die in großem Umfang gemeinsam genutzt werden
  - `lib/email/`: Parser für E-Mail, Kalender, Kontakte (RFC 5322, 5545, 6350)
  - `lib/mapi/`: Datenstrukturen, die größtenteils spezifisch für MAPI sind
    - `oxcical.cpp`: Logik für die Konvertierung zwischen geparsten iCalendar- und MAPI-Kalenderelementen
    - `oxcmail.cpp`: Logik für die Konvertierung zwischen geparsten E-Mails und MAPI-Nachrichtenelementen
    - `oxvcard.cpp`: Logik für die Konvertierung zwischen geparsten vCards und MAPI-Kontaktelementen
- `mda/`: Nachrichtenzustellungsagent
  - `exmdb_local/` gsp. `exmdb_local_hook`
  - `delivery_app/`: Zustellungsagent
  - `smtp/`: SMTP-Protokollhandler des MDA
- `mra/`: Nachrichtenabruf-Agenten (IMAP, POP3); hierbei handelt es sich um midb-Clients (keine exrpc-Clients), gsp. `imap_parser_dispatch_cmd2` und `pop3_parser_dispatch_cmd2`.
