---
title: "Ordner & Berechtigungen"
description: "Ordner und Favoriten in grommunio Web organisieren, Ordner für Kolleginnen und Kollegen freigeben, Berechtigungen festlegen und gemeinsame Postfächer, Kalender und öffentliche Ordner öffnen."
sidebar:
  order: 65
---

Ordner halten Ihr Postfach in Ordnung, Berechtigungen machen es teilbar. Dieses Kapitel behandelt beides: Ordner anlegen und verwalten, Favoriten, eigene Ordner freigeben und öffnen, was andere für Sie freigegeben haben.

## Der Ordnerbereich

![Der Ordnerbereich mit Favoriten, den Ordnern von Anna Berger, den Projekt-Unterordnern, den öffentlichen Ordnern und der Schaltfläche Gemeinsame E-Mails öffnen](/img/web/de/web_favorites.png)

Von oben nach unten zeigt der Ordnerbereich:

- **Favoriten**: Ihre Ordner für den schnellen Zugriff.
- **Ihr Postfach** (hier *Anna Berger*) mit den Standardordnern und Ihren eigenen Ordnern. Die Standardordner lassen sich weder umbenennen noch löschen:

| Ordner | Inhalt |
|---|---|
| **Posteingang** | eingehende E-Mails |
| **Entwürfe** | E-Mails, die Sie noch nicht gesendet haben |
| **Postausgang** | E-Mails, die auf den Versand warten, auch [später zu versendende](/de/web/mail/#später-versenden) |
| **Gesendete Elemente** | Kopien der E-Mails, die Sie gesendet haben |
| **Gelöschte Elemente** | was Sie gelöscht haben, bis Sie den Ordner leeren |
| **Junk-E-Mail** | als Spam eingestufte E-Mails |
| **Kalender**, **Kontakte**, **Aufgaben**, **Notizen** | die Ordner der anderen Anwendungen |

- **Gemeinsame Postfächer und Ordner**, die Kolleginnen und Kollegen für Sie freigegeben haben.
- die **öffentlichen Ordner** Ihrer Organisation (*Public Folders*).
- ganz unten **Gemeinsame E-Mails öffnen +** (bzw. *Gemeinsame Kalender öffnen +*, …).

## Mit Ordnern arbeiten

Ein Rechtsklick auf einen Ordner zeigt alle Ordneraktionen:

![Das Kontextmenü eines Ordners mit Öffnen, Ordner kopieren/verschieben, Ordner umbenennen, Neuer Ordner, Alle Nachrichten als gelesen markieren, Ordner löschen, Ordner leeren, Neu laden, Elemente wiederherstellen, Farbe auswählen, Den Favoriten hinzufügen, Ordner teilen, E-Mails importieren und Eigenschaften](/img/web/de/web_folder_contextmenu.png)

| Aktion | Funktion |
|---|---|
| **Neuer Ordner** | legt einen Unterordner an. Sie können den Typ wählen: E-Mail, Kalender, Kontakte, Aufgaben oder Notizen. |
| **Ordner umbenennen** (<kbd>F2</kbd>) | benennt den Ordner um. |
| **Ordner kopieren/verschieben** | kopiert oder verschiebt den Ordner mit seinem Inhalt. Sie können Ordner auch in der Liste ziehen. |
| **Ordner löschen** | verschiebt den Ordner nach *Gelöschte Elemente*. |
| **Alle Nachrichten als gelesen markieren** | markiert alles im Ordner als gelesen. |
| **Ordner leeren** | löscht alle Elemente im Ordner. |
| **Elemente wiederherstellen** | holt kürzlich endgültig gelöschte Elemente zurück. |
| **Farbe auswählen** | färbt das Ordnersymbol, bei Kalendern auch die Kalenderfarbe. |
| **Den Favoriten hinzufügen / Aus den Favoriten entfernen** | siehe [Favoriten](#favoriten). |
| **Ordner teilen…** | öffnet die [Berechtigungen](#einen-ordner-freigeben). |
| **E-Mails / Termine / Kontakte importieren** | importiert `.eml`-, `.ics`- oder `.vcf`-Dateien in den Ordner. |
| **Neu laden** | lädt den Ordner neu vom Server. |
| **Eigenschaften** | zeigt Name, Beschreibung, Größe und Anzahl der Elemente sowie die Berechtigungen. |

![Die Registerkarte Allgemein der Kalendereigenschaften mit Typ, Ort, Anzahl der Elemente und Größe](/img/web/de/web_folder_properties.png)

![Der Dialog Neuer Ordner mit dem Ordnernamen Partner, dem Ordnertyp und dem übergeordneten Ordner Posteingang](/img/web/de/web_folder_new.png)

## Favoriten

Favoriten stellen die Ordner, die Sie am häufigsten brauchen, an den Anfang des Ordnerbereichs. Klicken Sie mit der rechten Maustaste auf einen Ordner und wählen Sie **Den Favoriten hinzufügen**. Zum Entfernen wählen Sie **Aus den Favoriten entfernen**. Auch eine Suche lässt sich als Favorit speichern, siehe [Suchen](/de/web/intro/#suchen).

Unter [Einstellungen › Allgemein › Anzeige](/de/web/settings/#allgemein) legen Sie fest, ob Favoriten nur in Mail oder in allen Anwendungen erscheinen und ob sie oben angeheftet bleiben.

## Einen Ordner freigeben

Sie können Kolleginnen und Kollegen Zugriff auf Ihre Ordner geben, etwa auf Ihren Kalender für Ihr Team oder einen Projektordner für eine Kollegin. Sie entscheiden genau, was erlaubt ist.

1. Klicken Sie mit der rechten Maustaste auf den Ordner und wählen Sie **Ordner teilen…** (oder **Eigenschaften** › **Berechtigungen**).
2. Klicken Sie auf **Hinzufügen** und wählen Sie die Person oder Gruppe aus dem Adressbuch.
3. Wählen Sie ein **Profil** oder setzen Sie die einzelnen Berechtigungen.
4. Klicken Sie auf **Ok**.

![Die Registerkarte Berechtigungen der Kalendereigenschaften: Maria Rossi hat das Profil Veröffentlichender Bearbeiter mit Alle Details, allen Schreibrechten und Löschen Alle](/img/web/de/web_folder_permissions.png)

### Berechtigungen

| Bereich | Optionen |
|---|---|
| **Lesen** | **Nichts**, **Frei/Gebucht-Zeiten** (bei Kalendern: nur wann Sie gebucht sind), **Frei/Gebucht-Zeiten, Betreff, Ort**, **Alle Details** |
| **Schreiben** | **Einträge anlegen**, **Unterordner erstellen**, **Eigene bearbeiten**, **Alle bearbeiten** |
| **Einträge löschen** | **Nichts**, **Eigene**, **Alle** |
| **Andere** | **Ordnereigentümer** (darf Berechtigungen ändern), **Ordnerkontakt**, **Ordner anzeigen** (darf den Ordner in der Liste sehen) |

Der Eintrag **Standard** gilt für alle in Ihrer Organisation, die nicht eigens aufgeführt sind, **Anonym** für nicht angemeldete Benutzer. Aktivieren Sie **Geänderte Berechtigungen rekursiv anwenden (kopieren)**, um dieselben Berechtigungen auf alle Unterordner zu übertragen.

### Berechtigungsprofile

| Profil | Lesen | Einträge anlegen | Unterordner erstellen | Bearbeiten | Löschen | Ordnereigentümer | Ordner anzeigen |
|---|---|:-:|:-:|---|---|:-:|:-:|
| **Eigentümer** | Alle Details | ✓ | ✓ | Alle | Alle | ✓ | ✓ |
| **Veröffentlichender Bearbeiter** | Alle Details | ✓ | ✓ | Alle | Alle | | ✓ |
| **Bearbeiter** | Alle Details | ✓ | | Alle | Alle | | ✓ |
| **Veröffentlichender Autor** | Alle Details | ✓ | ✓ | Eigene | Eigene | | ✓ |
| **Autor** | Alle Details | ✓ | | Eigene | Eigene | | ✓ |
| **Nicht bearbeitender Autor** | Alle Details | ✓ | | | Eigene | | ✓ |
| **Prüfer** | Alle Details | | | | | | ✓ |
| **Mitwirkender** | Nichts | ✓ | | | | | ✓ |
| **Nichts** | Nichts | | | | | | |

:::caution[Unterordner freigeben]
Damit Ihre Kollegin einen freigegebenen Unterordner öffnen kann, braucht sie zusätzlich **Ordner anzeigen** auf allen darüberliegenden Ordnern bis zur obersten Ebene Ihres Postfachs. Standardordner wie Posteingang oder Kalender lassen sich auch ohne das öffnen.
:::

:::tip
Für eine Assistenz, die Ihre E-Mails und Ihren Kalender verwaltet, nutzen Sie besser [Stellvertreter](/de/web/settings/#stellvertreter). Ein Stellvertreter erhält die Ordnerberechtigungen in einem Schritt und darf zusätzlich Einladungen und E-Mails in Ihrem Auftrag senden.
:::

## Gemeinsame Postfächer

### Einen gemeinsamen Ordner oder ein Postfach öffnen

1. Klicken Sie unten im Ordnerbereich auf **Gemeinsame E-Mails öffnen +** (bzw. auf die entsprechende Schaltfläche in Kalender, Kontakte, Aufgaben oder Notizen).
2. Geben Sie den Namen der Person oder des gemeinsamen Postfachs ein und drücken Sie <kbd>Enter</kbd>.
3. Wählen Sie den **Ordnertyp**: *Gesamtes Postfach*, *Posteingang*, *Kalender*, *Kontakt*, *Notizen* oder *Aufgabe*.
4. Bei einem einzelnen Ordner aktivieren Sie **Unterordner anzeigen**, um seine Unterordner einzubeziehen.
5. Klicken Sie auf **Öffnen**.

![Der Dialog Gemeinsame Ordner öffnen mit Example Info als Name und Gesamtes Postfach als Ordnertyp](/img/web/de/web_shared_open_dialog.png)

Das Postfach oder der Ordner erscheint in Ihrem Ordnerbereich und bleibt auch bei der nächsten Anmeldung dort:

![Das gemeinsame Postfach Example Info unter dem eigenen Postfach, mit einer E-Mail aus dem Kontaktformular der Website im Lesebereich](/img/web/de/web_shared_mailbox.png)

Postfächer, auf die Ihr Administrator Ihnen Vollzugriff gegeben hat, können auch automatisch erscheinen.

- **Sortieren** Sie gemeinsame Postfächer, indem Sie sie im Ordnerbereich ziehen. Die Reihenfolge gilt in allen Anwendungen.
- **Schließen** Sie ein gemeinsames Postfach mit einem Rechtsklick auf seinen obersten Ordner › **Postfach schließen**, einen einzelnen gemeinsamen Ordner mit **Ordner schließen**.

### Aus einem gemeinsamen Postfach senden

Um eine E-Mail als gemeinsames Postfach zu senden, klicken Sie in der neuen E-Mail auf **Von anzeigen** und wählen das Postfach unter **Von**. Ihr Administrator entscheidet, ob Sie *als* das Postfach oder *im Auftrag* des Postfachs senden dürfen. Die **Eigenschaften** des Postfachs zeigen Ihre **Senderechte** (in der Oberfläche *Send rights*): keine, im Auftrag senden oder senden als.

Senden Sie als [Stellvertreter](/de/web/settings/#stellvertreter), legt die Einstellung **Vom Delegierten gesendete E-Mails speichern** unter [Einstellungen › Mail](/de/web/settings/#mail) fest, ob die Kopie in Ihren *Gesendeten Elementen*, in denen der vertretenen Person oder in beiden gespeichert wird.

## Öffentliche Ordner

**Öffentliche Ordner** (*Public Folders*) sind Ordner für die ganze Organisation, etwa ein Firmenkalender, gemeinsame Kontakte oder ein Support-Postfach. Ihr Administrator richtet sie ein und entscheidet, wer darin lesen oder schreiben darf. Sie arbeiten damit wie mit Ihren eigenen Ordnern und können sie einschließlich ihrer Unterordner durchsuchen.
