---
title: "E-Mail"
description: "E-Mails in grommunio Web lesen, schreiben, beantworten und organisieren: Lesebereich, Anhänge und Dokumentbetrachter, Verfassen, Signaturen, späteres Senden, Kennzeichnungen, Kategorien, Ordner und Unterhaltungen."
sidebar:
  order: 20
---

In Mail verbringen die meisten Menschen den größten Teil ihres Tages. Dieses Kapitel zeigt, wie Sie E-Mails lesen und beantworten, mit Anhängen arbeiten, neue Nachrichten schreiben und Ihr Postfach in Ordnung halten.

## E-Mails lesen

Wählen Sie eine E-Mail in der Liste aus, um sie im Lesebereich anzuzeigen. Mit einem Doppelklick öffnen Sie sie in einer eigenen Registerkarte.

![Die Mail-Ansicht mit der Liste des Posteingangs und einer E-Mail von Lukas Hofer mit Anhang im Lesebereich](/img/web/de/web_mail_reading.png)

Der Kopf des Lesebereichs zeigt:

- den **Betreff**,
- den **Absender** mit Foto, Initialen oder Firmenlogo und die Uhrzeit,
- die **Empfänger** (An, CC),
- die **Anhänge**,
- die **Kategorien** der E-Mail,
- Hinweisleisten, zum Beispiel dass die Nachricht mit hoher Wichtigkeit gesendet wurde oder als privat gekennzeichnet ist.

![Der Kopf einer E-Mail mit dem Hinweis auf hohe Wichtigkeit und einem PDF-Anhang](/img/web/de/web_mail_infobar.png)

Über der E-Mail finden Sie die Aktionen **Antworten**, **Allen antworten** und **Weiterleiten**, rechts davon **Löschen**, **Weitere Optionen** (⋮), **Abkoppeln** und den [KI-Assistenten](/de/web/ai/) (✦).

:::tip[Absenderlogos]
Bei Absendern, deren Domain ein geprüftes Firmenlogo (BIMI) veröffentlicht und deren E-Mail die DMARC-Prüfung bestanden hat, zeigt grommunio Web das Firmenlogo neben dem Absender. So erkennen Sie echte E-Mails bekannter Unternehmen auf einen Blick. Eigene Kontaktfotos haben Vorrang.
:::

### Gelesen und ungelesen

Eine E-Mail wird als gelesen markiert, sobald Sie sie auswählen. Unter [Einstellungen › Mail › Eingehende E-Mail](/de/web/settings/#mail) können Sie das ändern, zum Beispiel so, dass E-Mails erst nach einigen Sekunden als gelesen gelten. Um den Status selbst zu ändern:

- fahren Sie mit der Maus über die E-Mail und klicken Sie auf das Umschlagsymbol,
- klicken Sie mit der rechten Maustaste und wählen Sie **Als gelesen markieren** oder **Als ungelesen markieren**,
- oder klicken Sie mit der rechten Maustaste auf einen Ordner und wählen Sie **Alle Nachrichten als gelesen markieren**.

### Bilder und externe Inhalte

Zum Schutz Ihrer Privatsphäre lädt grommunio Web in E-Mails unbekannter Absender keine Bilder aus dem Internet. Eine Hinweisleiste zeigt an, dass Inhalte blockiert wurden. Klicken Sie darauf, um:

- **Bilder herunterladen** nur für diese E-Mail,
- **Den Sender der Liste der sicheren Absender hinzufügen**, um Bilder dieses Absenders immer anzuzeigen,
- **Die Domain der Liste der sicheren Absender hinzufügen**, um allen Absendern dieser Domain zu vertrauen.

Diese Listen verwalten Sie unter [Einstellungen › Absenderlisten](/de/web/settings/#absenderlisten). Newsletter mit eingebetteten Bildern werden vollständig angezeigt:

![Ein Newsletter mit großer, farbiger Kopfgrafik und zwei Artikelvorschauen im Lesebereich](/img/web/de/web_mail_newsletter.png)

### Unterhaltungsansicht

Die Unterhaltungsansicht gruppiert die E-Mails einer Unterhaltung in Ihrem Posteingang, einschließlich Ihrer eigenen Antworten aus *Gesendete Elemente*. Schalten Sie sie unter [Einstellungen › Mail › Unterhaltungseinstellungen](/de/web/settings/#mail) ein.

![Der Posteingang in der Unterhaltungsansicht: Die Unterhaltung Website-Relaunch mit drei Beteiligten ist aufgeklappt, der Lesebereich zeigt die Nachrichten der Unterhaltung als Karten](/img/web/de/web_mail_conversation.png)

- Eine Unterhaltung zeigt die Anzahl der Nachrichten und die Beteiligten. Klicken Sie auf den Pfeil, um sie aufzuklappen.
- Wählen Sie eine Unterhaltung aus, zeigt der Lesebereich alle Nachrichten als Karten, die neueste zuerst.
- Unterhaltungen erscheinen, wenn die Liste nach **Empfangen** (neueste zuerst) sortiert ist und keine Suche oder kein Filter aktiv ist. Sonst wird die Liste flach angezeigt.

:::note
Die Unterhaltungsansicht benötigt die Navigation *Endlosem Scrolling* (Einstellungen › Allgemein › Navigation im Posteingang), die Standardeinstellung.
:::

### Layout wechseln

Mit **Ansicht umschalten** in der Symbolleiste legen Sie fest, wo der Lesebereich angezeigt wird:

![Das Menü Ansicht umschalten mit Keine Vorschau, Lesebereich rechts und Lesebereich unten](/img/web/de/web_mail_viewmenu.png)

## Anhänge

Anhänge werden im Kopf einer E-Mail mit Namen und Größe aufgeführt.

### Anhänge im Betrachter öffnen

Klicken Sie auf einen Anhang, um ihn im integrierten Dokumentbetrachter zu öffnen – ganz ohne weiteres Programm:

![Ein PDF-Anhang im Dokumentbetrachter mit Seitennavigation, Zoom und Gliederung](/img/web/de/web_viewer_pdf.png)

Der Betrachter öffnet diese Formate direkt im Browser:

| Art | Formate |
|---|---|
| Dokumente | PDF, Word (.docx, .doc, .docm, .dotx), RTF, OpenDocument-Text (.odt) |
| Tabellen | Excel (.xlsx, .xls, .xlsm, .xlsb), OpenDocument-Tabelle (.ods), CSV, TSV |
| Präsentationen | PowerPoint (.pptx, .ppsx, .potx), OpenDocument-Präsentation (.odp) |
| Bilder | PNG, JPEG, GIF, WebP, AVIF, BMP, SVG, ICO |
| Audio und Video | MP3, M4A, OGG, Opus, WAV, FLAC, MP4, WebM, MOV und mehr |
| Text und Code | TXT, Markdown, JSON, XML, YAML, HTML (als Quelltext), CSS, JavaScript, PHP, Python, Shell-Skripte und mehr |
| E-Mail | angehängte E-Mails (.eml) einschließlich ihrer eigenen Anhänge |

![Ein Tabellenanhang mit dem Marketingbudget Q4 im Dokumentbetrachter](/img/web/de/web_viewer_xlsx.png)

Der Betrachter hat Schaltflächen zum Drucken, Herunterladen, für die Präsentations- und Vollbildansicht, zum Zoomen, Drehen und Blättern. Dateien, für die es keine Vorschau gibt, werden heruntergeladen.

Unter [Einstellungen › Allgemein › Dateivorschau](/de/web/settings/#allgemein) legen Sie fest, ob Vorschauen in einem **Dialog** (Standard), in einem **grommunio Web-Reiter** oder in einem eigenen **Browserfenster** geöffnet werden, und wählen den Standardzoom.

![Ein Bildanhang im Betrachter](/img/web/de/web_viewer_image.png)

### Das Anhangsmenü

Ein Rechtsklick auf einen Anhang bietet weitere Möglichkeiten:

![Das Kontextmenü eines Anhangs mit Vorschau, Vorschau im grommunio Web-Reiter, Vorschau im Browserfenster, Herunterladen, Alle als ZIP-Datei herunterladen, Einfügen in Ordner und Anhang entfernen](/img/web/de/web_mail_attachment_menu.png)

- **Vorschau**, **Vorschau im grommunio Web-Reiter**, **Vorschau im Browserfenster**
- **Herunterladen** speichert die Datei.
- **Alle als ZIP-Datei herunterladen** speichert alle Anhänge der E-Mail in einer ZIP-Datei.
- **Auswahl in Ordner speichern** schreibt die ausgewählten Anhänge in einen Ordner auf Ihrem Computer (erscheint, wenn zwei oder mehr Anhänge ausgewählt sind; Chromium-basierte Browser).
- **Einfügen in Ordner** importiert eine Kontaktkarte (.vcf), Kalenderdatei (.ics) oder E-Mail (.eml) in einen Ihrer Ordner.
- **Anhang entfernen** löscht den Anhang aus einer E-Mail, die in Ihrem Postfach gespeichert ist, etwa um Platz zu sparen. Die E-Mail selbst bleibt unverändert. Dies kann nicht rückgängig gemacht werden.
- **Dem Files-Backend hinzufügen** speichert den Anhang in Ihrem [Dateien](/de/web/files/)-Speicher.

:::tip[Mehrere Anhänge gleichzeitig]
Mit <kbd>Strg</kbd>-Klick oder <kbd>Umschalt</kbd>-Klick wählen Sie mehrere Anhänge aus. Sie können sie dann in eine E-Mail ziehen, die Sie gerade schreiben (auch in einer anderen Registerkarte oder einem anderen Fenster), oder auf Ihren Desktop, wo sie als eine ZIP-Datei ankommen.
:::

## E-Mails schreiben

Klicken Sie in der Symbolleiste auf **Neu**, auf das **+** am Ende der Registerkartenleiste oder drücken Sie mit erweiterten Tastenkombinationen <kbd>Strg</kbd>+<kbd>Alt</kbd>+<kbd>X</kbd>. Eine neue E-Mail öffnet sich in einer eigenen Registerkarte:

![Eine neue E-Mail an Lukas Hofer mit Maria Rossi in CC, einem Betreff, einem angehängten Word-Dokument und einem kurzen Text](/img/web/de/web_compose.png)

1. Geben Sie die Empfänger unter **An** ein. grommunio Web schlägt beim Tippen Adressen vor. Trennen Sie mehrere Empfänger mit einem Semikolon oder drücken Sie nach jedem <kbd>Enter</kbd>.
2. Fügen Sie weitere Empfänger unter **CC** hinzu. Für Blindkopien klicken Sie in der Symbolleiste auf **BCC anzeigen**.
3. Geben Sie einen **Betreff** ein.
4. Schreiben Sie Ihren Text. Der Editor bietet Schriftarten, -größen, Fett, Kursiv, Farben, Listen, Ausrichtung, Links, Tabellen und Bilder.
5. Klicken Sie auf **Senden** oder drücken Sie <kbd>Strg</kbd>+<kbd>Enter</kbd>.

### Die Symbolleiste beim Verfassen

![Die Symbolleiste beim Verfassen mit Senden, Speichern, Löschen, Anhängen, Namen überprüfen, Adressbuch, Signatur, KI-Schreibassistent, Optionen, Kennzeichnung, Wichtigkeit, Lesebestätigung, BCC, Von, Signieren und Verschlüsseln](/img/web/de/web_compose_toolbar.png)

| Schaltfläche | Funktion |
|---|---|
| **Senden** (<kbd>Strg</kbd>+<kbd>Enter</kbd>) | sendet die E-Mail. Der Pfeil bietet **Später versenden**. |
| **Speichern** (<kbd>Strg</kbd>+<kbd>S</kbd>) | speichert die E-Mail in *Entwürfe*. grommunio Web speichert außerdem jede Minute automatisch. |
| **Löschen** | verwirft den Entwurf. |
| **Anhänge** (Büroklammer) | hängt Dateien an. Der Pfeil bietet *Dateiupload*, *Element anhängen* und mit dem Dateien-Plugin *Aus Files einfügen*. |
| **Namen überprüfen** | gleicht die eingegebenen Namen mit dem Adressbuch ab. |
| **Adressbuch öffnen** | wählt Empfänger aus dem Adressbuch. |
| **Signatur hinzufügen** | fügt eine Ihrer [Signaturen](/de/web/settings/#signaturen) ein. |
| **Vorlage einfügen** | fügt einen [Vorlagenausschnitt](/de/web/templates/) ein (mit dem Plugin Vorlagenausschnitte). |
| **KI-Schreibassistent** | verbessert, kürzt oder übersetzt Ihren Text, siehe [KI-Assistent](/de/web/ai/#schreiben-mit-der-ki). |
| **Besprechung hinzufügen** | fügt einen Link zu einer Videokonferenz ein (mit dem Plugin [Meet](/de/web/meet/)). |
| **Optionsdialog öffnen** | Wichtigkeit, Vertraulichkeit, Lesebestätigung. |
| **Zur Nachverfolgung kennzeichnen** | kennzeichnet die E-Mail für die Empfänger zur Nachverfolgung. |
| **Hohe Priorität / Niedrige Priorität** | legt die Wichtigkeit fest. |
| **Lesebestätigung** | bittet die Empfänger zu bestätigen, dass sie die E-Mail gelesen haben. |
| **BCC anzeigen / Von anzeigen** | blendet das Feld BCC oder Von ein. |
| **Signieren / Verschlüsseln** | signiert oder verschlüsselt die E-Mail mit S/MIME oder OpenPGP, siehe [Signieren & Verschlüsseln](/de/web/security/). |
| **Abkoppeln** | öffnet die E-Mail in einem eigenen Browserfenster. |

### Anhänge hinzufügen

Es gibt mehrere Wege, eine Datei anzuhängen:

- Ziehen Sie Dateien von Ihrem Computer an eine beliebige Stelle der E-Mail. *Dateien hier ablegen, um sie anzuhängen* erscheint.
- Klicken Sie auf den Pfeil neben der Büroklammer › **Dateiupload** und wählen Sie die Dateien.
- **Element anhängen** hängt ein Element aus Ihrem Postfach an – eine andere E-Mail, einen Kontakt oder einen Termin –, wahlweise als Anhang oder als Text.
- **Aus Files einfügen** hängt eine Datei aus Ihrem [Dateien](/de/web/files/)-Speicher an.

![Das Anhangsmenü mit Dateiupload, Element anhängen und Aus Files einfügen](/img/web/de/web_compose_attach_menu.png)

Bilder, die Sie in den Text ziehen, werden in die E-Mail eingebettet.

:::tip
Schalten Sie unter [Einstellungen › Mail](/de/web/settings/#mail) die *Anhang-Erinnerung* ein. grommunio Web warnt Sie dann, wenn Ihr Text einen Anhang erwähnt, aber keiner angehängt ist.
:::

### Nachrichtenoptionen

**Optionsdialog öffnen** legt die **Wichtigkeit** (Niedrig, Normal, Hoch) und die **Vertraulichkeit** (Nichts, Persönlich, Privat, Vertraulich) fest und fordert auf Wunsch eine **Lesebestätigung** an:

![Der Dialog mit den Nachrichtenoptionen Wichtigkeit, Vertraulichkeit und Lesebestätigung](/img/web/de/web_compose_options.png)

Die Vertraulichkeit ist ein Hinweis für das E-Mail-Programm des Empfängers. Sie schützt den Inhalt nicht. Um eine E-Mail zu schützen, [verschlüsseln Sie sie](/de/web/security/).

### Später versenden

Klicken Sie auf den Pfeil neben **Senden** und wählen Sie **Später versenden**:

![Das Menü Senden mit Senden und Später versenden](/img/web/de/web_compose_sendmenu.png)

Wählen Sie, wann die E-Mail verschickt werden soll: in einigen Stunden, Tagen oder Monaten oder zu einer definierten Zeit. grommunio Web bestätigt den Zeitpunkt in einem kurzen Satz, bevor Sie auf **Senden** klicken.

![Der Dialog zum Einplanen des Versands mit den Optionen Stunde(n), Tag(e), Monat(e) und zu einer definierten Zeit](/img/web/de/web_compose_sendlater.png)

Bis dahin wartet die E-Mail in Ihrem **Postausgang**, wo Sie sie noch öffnen, ändern oder löschen können.

### Von einer anderen Adresse senden

Dürfen Sie im Namen einer anderen Person oder eines gemeinsamen Postfachs wie *info@* senden, klicken Sie auf **Von anzeigen** und wählen die Adresse unter **Von**:

![Eine neue E-Mail mit Example Info im Feld Von](/img/web/de/web_compose_from.png)

Häufig genutzte Absenderadressen speichern Sie unter [Einstellungen › Absenderadressen](/de/web/settings/#absenderadressen). Die Berechtigung, als oder im Auftrag einer anderen Person zu senden, erteilt Ihr Administrator.

### Entwürfe und automatisches Speichern

grommunio Web speichert die E-Mail, an der Sie schreiben, jede Minute in **Entwürfe**. Schließen Sie die Registerkarte oder stürzt der Browser ab, finden Sie die E-Mail dort und können weiterschreiben. Doppelklicken Sie auf einen Entwurf, um ihn zu öffnen.

## Antworten und weiterleiten

Wählen Sie eine E-Mail aus und klicken Sie über dem Lesebereich auf **Antworten**, **Allen antworten** oder **Weiterleiten** (oder klicken Sie mit der rechten Maustaste auf die E-Mail). Die Antwort öffnet sich in einer neuen Registerkarte, die ursprüngliche E-Mail steht zitiert unter Ihrem Text:

![Eine Antwort an Hannah Schmidt mit der zitierten ursprünglichen Nachricht darunter](/img/web/de/web_mail_reply.png)

- **Antworten** antwortet nur dem Absender.
- **Allen antworten** antwortet dem Absender und allen Empfängern.
- **Weiterleiten** schickt die E-Mail mit ihren Anhängen an jemand anderen.
- **Nachricht als neu bearbeiten** (Rechtsklick) öffnet eine Kopie der E-Mail als neue Nachricht, etwa um sie erneut zu senden.

Standardmäßig schließt grommunio Web die ursprüngliche E-Mail, wenn Sie antworten. Dieses Verhalten und die Betreffpräfixe (AW:, WG:) ändern Sie unter [Einstellungen › Mail](/de/web/settings/#mail).

## E-Mails organisieren

### Das Kontextmenü

Ein Rechtsklick auf eine E-Mail zeigt alles, was Sie damit tun können:

![Das Kontextmenü einer E-Mail mit Öffnen, Antworten, Allen antworten, Weiterleiten, Löschen, Als ungelesen markieren, Nachricht als neu bearbeiten, Kategorien, Nachverfolgung, Kopieren/Verschieben, Nach Junk-E-Mail verschieben, Senden an, Exportieren als, Mit KI zusammenfassen, Mit KI übersetzen, Regeln, Termin erstellen, Aufgabe erstellen, Notiz erstellen, Drucken und Optionen](/img/web/de/web_mail_contextmenu.png)

Neben den in diesem Kapitel beschriebenen Aktionen finden Sie:

- **Senden an…**, um die E-Mail als Anhang weiterzuleiten,
- **Exportieren als** › *EML Datei(en)* oder *ZIP Datei*, um E-Mails auf Ihrem Computer zu speichern,
- **Termin erstellen**, **Aufgabe erstellen** und **Notiz erstellen**, die aus der E-Mail ein neues Element erzeugen,
- **Optionen** mit Wichtigkeit, Vertraulichkeit und den **Internet-Kopfzeilen** der E-Mail, die Ihr IT-Support manchmal benötigt.

### Kennzeichnung und Nachverfolgung

Kennzeichnen Sie E-Mails, um die Sie sich noch kümmern müssen. Fahren Sie mit der Maus über eine E-Mail und klicken Sie auf die Fahne, oder klicken Sie mit der rechten Maustaste und wählen Sie **Nachverfolgung**:

![Das Untermenü Nachverfolgung mit Fälligkeiten wie Heute, Morgen, Diese Woche und Nächste Woche und der Option Erledigt](/img/web/de/web_mail_followup_menu.png)

Gekennzeichnete E-Mails werden in der Liste farbig hinterlegt und erscheinen auch in Ihrer [To-Do-Liste](/de/web/tasks/). Wählen Sie **Erledigt**, wenn Sie fertig sind – die Fahne wird zu einem Haken.

### Kategorien

Kategorien sind farbige Etiketten für E-Mails, Termine, Kontakte, Aufgaben und Notizen, zum Beispiel *Kunde*, *Dringend* oder ein Projektname. Klicken Sie mit der rechten Maustaste auf ein Element und wählen Sie **Kategorien**:

![Das Untermenü Kategorien mit Aurora-Launch, Website, Kunde, Dringend, Privat und Messe sowie Kategorien verwalten](/img/web/de/web_mail_categories_menu.png)

Mit **Kategorien verwalten** erstellen, benennen, färben oder löschen Sie Kategorien und heften Ihre wichtigsten an die Schnellzugriffsliste:

![Der Dialog Kategorien verwalten mit den sechs Kategorien und ihren Farben](/img/web/de/web_categories_dialog.png)

Kategorien werden in Ihrem Postfach so gespeichert wie in Outlook. Sie sehen daher in grommunio Web, Outlook und auf Ihrem Smartphone dieselben Namen und Farben. Ein gemeinsames Postfach hat seine eigenen Kategorien.

### Notizen an E-Mails

Sie können eine Notiz an eine E-Mail heften, etwa um sich zu merken, was Sie besprechen möchten. Klicken Sie mit der rechten Maustaste auf die E-Mail und wählen Sie **Notiz erstellen**. Die Notiz öffnet sich mit einem Link zur E-Mail:

![Eine neue gelbe Notiz mit dem Link zum Partnerschaftsvorschlag und einem kurzen Text](/img/web/de/web_note_linked_create.png)

Speichern Sie die Notiz. Von nun an erscheint sie als farbige Karte oben in der E-Mail – für Sie und für alle, die im selben (gemeinsamen) Postfach arbeiten:

![Der Kopf des Partnerschaftsvorschlags mit der angehefteten gelben Notizkarte](/img/web/de/web_mail_linkednote.png)

Ein Klick auf die Karte öffnet die Notiz. Die E-Mail selbst wird nicht verändert; die Notiz liegt im Ordner Notizen.

### Ordner und Verschieben

Legen Sie eigene Ordner an, um Ihre E-Mails zu sortieren, zum Beispiel pro Projekt. Klicken Sie mit der rechten Maustaste auf einen Ordner und wählen Sie **Neuer Ordner**. Weitere Ordneroptionen beschreibt [Ordner & Berechtigungen](/de/web/folders-permissions/).

So verschieben oder kopieren Sie E-Mails:

- ziehen Sie sie auf einen Ordner (mit <kbd>Strg</kbd> wird kopiert), oder
- klicken Sie mit der rechten Maustaste und wählen Sie **Kopieren/Verschieben** (<kbd>Strg</kbd>+<kbd>M</kbd> mit erweiterten Tastenkombinationen).

![Der Dialog Nachrichten kopieren/verschieben schlägt für eine E-Mail von Maria Rossi den Ordner Aurora-Launch vor](/img/web/de/web_mail_copymove.png)

grommunio Web merkt sich, wohin Sie E-Mails eines Absenders bisher abgelegt haben, und bietet diese Ordner oben im Dialog als **Vorgeschlagene Ordner** an. Sie können auch den Anfang eines Ordnernamens tippen, um direkt dorthin zu springen. **Verschieben** (oder <kbd>Enter</kbd>) verschiebt die E-Mail, **Kopieren** kopiert sie, **Neuer Ordner** legt sofort einen Ordner an.

### Regeln

Regeln sortieren eingehende E-Mails automatisch. Klicken Sie mit der rechten Maustaste auf eine E-Mail und wählen Sie **Regeln** für schnelle Regeln wie *Nachrichten von … immer verschieben* oder **Erstelle eine Regel…** für eine vollständige Regel. Alle Regeln verwalten Sie unter [Einstellungen › Regeln](/de/web/settings/#regeln).

### Junk-E-Mail

E-Mails, die der Server als Spam einstuft, landen im Ordner **Junk-E-Mail**. Ist dort eine erwünschte E-Mail gelandet, klicken Sie mit der rechten Maustaste darauf und wählen **Keine Junk-E-Mail**. Unerwünschte E-Mails verschieben Sie mit **Nach Junk-E-Mail verschieben** dorthin.

### Löschen und wiederherstellen

- **Löschen** (oder die Taste <kbd>Entf</kbd>) verschiebt E-Mails nach **Gelöschte Elemente**.
- <kbd>Umschalt</kbd>+<kbd>Entf</kbd> löscht E-Mails, ohne sie nach Gelöschte Elemente zu verschieben.
- Klicken Sie mit der rechten Maustaste auf *Gelöschte Elemente* und wählen Sie **Gelöschte Objekte leeren**, um aufzuräumen.
- Versehentlich endgültig gelöscht? Klicken Sie mit der rechten Maustaste auf den Ordner und wählen Sie **Elemente wiederherstellen**, um kürzlich gelöschte Elemente zurückzuholen.
- Ist [Rückgängig und Wiederholen](/de/web/intro/#rückgängig-und-wiederholen) eingeschaltet, nimmt <kbd>Strg</kbd>+<kbd>Z</kbd> die letzte Aktion zurück.

### Drucken

Wählen Sie eine oder mehrere E-Mails aus und klicken Sie in der Symbolleiste auf **Drucken** oder drücken Sie <kbd>Strg</kbd>+<kbd>P</kbd>. grommunio Web nutzt den Druckdialog Ihres Browsers, in dem Sie die E-Mail auch als PDF-Datei speichern können.

## Gemeinsame Postfächer

Geben Kolleginnen oder Kollegen ein Postfach für Sie frei, etwa eine Teamadresse wie *info@example.com*, erscheint es in Ihrem Ordnerbereich unter Ihrem eigenen Postfach. Sie arbeiten damit wie mit Ihrem eigenen: lesen, antworten, verschieben und kategorisieren. Wie Sie ein gemeinsames Postfach öffnen und daraus senden, beschreibt [Ordner & Berechtigungen](/de/web/folders-permissions/#gemeinsame-postfächer).
