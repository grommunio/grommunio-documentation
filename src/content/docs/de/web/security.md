---
title: "Signieren & Verschlüsseln"
description: "E-Mails in grommunio Web mit S/MIME-Zertifikaten oder OpenPGP-Schlüsseln signieren und verschlüsseln: Schlüssel einrichten, geschützte E-Mails senden und signierte und verschlüsselte Nachrichten lesen."
sidebar:
  order: 68
---

Eine **digitale Signatur** belegt, wer eine E-Mail gesendet hat und dass sie unterwegs nicht verändert wurde. **Verschlüsselung** stellt sicher, dass nur die Empfänger sie lesen können. grommunio Web unterstützt beide gängigen Standards:

| | S/MIME | OpenPGP |
|---|---|---|
| **Grundlage** | Zertifikate einer Zertifizierungsstelle | Schlüssel, die Sie selbst erzeugen |
| **Typischer Einsatz** | Unternehmen und Behörden | Einzelpersonen, Entwickler, datenschutzbewusste Anwender |
| **Vertrauen** | über die Zertifizierungsstelle | über Fingerabdrücke, die Sie selbst prüfen |
| **In grommunio Web** | Zertifikat auf dem Server, durch eine Passphrase geschützt | Schlüssel werden im Browser erzeugt und verwendet und passphrasegeschützt in Ihrem Postfach gespeichert |

Beide nutzen im E-Mail-Editor dasselbe Schaltflächenpaar: **Signieren** und **Verschlüsseln**. Eine E-Mail kann mit einem der beiden Standards geschützt werden, nicht mit beiden zugleich.

![Die Symbolleiste beim Verfassen mit den Schaltflächen Signieren und Verschlüsseln rechts](/img/web/de/web_compose_pgp_toolbar.png)

:::note
S/MIME ist standardmäßig verfügbar. OpenPGP ist ein optionales Plugin, das Ihr Administrator freischalten muss; danach schalten Sie es unter [Einstellungen › Plugins](/de/web/settings/#plugins) ein.
:::

## S/MIME

### Das eigene Zertifikat hochladen

Ihr persönliches Zertifikat erhalten Sie von Ihrer IT-Abteilung oder einer Zertifizierungsstelle, meist als `.p12`- oder `.pfx`-Datei mit einer Passphrase.

1. Öffnen Sie **Einstellungen › S/MIME**.
2. Klicken Sie unter **Zertifikat hochladen** auf **Auswählen** und wählen Sie die Datei.
3. Geben Sie die **Passphrase des Zertifikates** ein.
4. Klicken Sie auf **Hochladen**.

![Die S/MIME-Einstellungen mit einem gültigen persönlichen Zertifikat, dem Upload-Bereich und der Liste der öffentlichen und persönlichen Zertifikate](/img/web/de/web_smime_settings.png)

Die Statuszeile lautet dann *Sie haben ein gültiges Zertifikat, das zu Ihrem Account passt*. Die Liste **Öffentliche & persönliche Zertifikate** zeigt Ihr eigenes Zertifikat und die öffentlichen Zertifikate Ihrer Kontakte. Mit **Details** sehen Sie sich ein Zertifikat an, mit **Entfernen** löschen Sie es.

Unter **Persönliches Zertifikat** ändern Sie die Passphrase und wählen den **Standard-Verschlüsselungsalgorithmus** (empfohlen: AES-256-GCM) und die **Standard-Signaturprüfung** (empfohlen: SHA-256).

### Signierte oder verschlüsselte E-Mails senden

Klicken Sie in einer neuen E-Mail auf **Signieren**, **Verschlüsseln** oder beides. Über den Pfeil neben jeder Schaltfläche wählen Sie **S/MIME** oder **OpenPGP** und finden die S/MIME-Optionen für diese E-Mail.

- **Signieren** fragt beim Senden nach der Passphrase Ihres Zertifikats. Wenn Ihr Administrator es erlaubt, kann Ihr Browser sie für die Sitzung behalten.
- **Verschlüsseln** benötigt das öffentliche Zertifikat jedes Empfängers. grommunio Web sammelt Zertifikate automatisch aus signierten E-Mails, die Sie erhalten, und aus dem Adressbuch. Fehlt eines, nennt grommunio Web die Empfänger, die keine verschlüsselte E-Mail erhalten können.

:::tip
Senden Sie den Personen, mit denen Sie verschlüsselte E-Mails austauschen möchten, eine signierte E-Mail und bitten Sie sie, dasselbe zu tun. So erhalten Sie gegenseitig Ihre Zertifikate.
:::

### S/MIME-E-Mails lesen

Signierte und verschlüsselte E-Mails zeigen im Kopf eine Statuszeile, zum Beispiel *Die Signatur hat die Prüfung bestanden* oder *Nachricht wurde erfolgreich entschlüsselt*. Bei einer verschlüsselten E-Mail entsperren Sie zuerst Ihr Zertifikat mit Ihrer Passphrase. Ein Klick auf die Statuszeile zeigt die Details: wer die E-Mail signiert hat, ob das Zertifikat gültig und vertrauenswürdig ist und welche Algorithmen verwendet wurden.

## OpenPGP

### Den eigenen Schlüssel erzeugen

1. Öffnen Sie **Einstellungen › OpenPGP**.
2. Klicken Sie auf **Schlüssel erzeugen**.
3. Geben Sie Ihren **Namen** ein und prüfen Sie die **E-Mail**-Adresse.
4. Wählen Sie den **Algorithmus** (RSA 3072, RSA 4096, Ed25519 oder Curve25519) und die **Gültigkeitsdauer**.
5. Geben Sie zweimal eine **Passphrase** mit mindestens 12 Zeichen ein. Wählen Sie eine starke, die Sie sich merken können – niemand kann sie für Sie wiederherstellen.
6. Klicken Sie auf **Erzeugen**.

![Der Dialog OpenPGP-Schlüssel erzeugen mit Name, E-Mail, Algorithmus, Gültigkeitsdauer und Passphrase](/img/web/de/web_pgp_generate.png)

Der Schlüssel wird in Ihrem Browser erzeugt. Danach zeigt grommunio Web Ihr **Widerrufszertifikat**. Laden Sie es herunter und bewahren Sie es sicher auf: Damit können Sie Ihren Schlüssel für ungültig erklären, falls Sie ihn oder die Passphrase verlieren.

![Das Fenster Widerrufszertifikat — sicher aufbewahren mit dem Zertifikat und der Schaltfläche Herunterladen](/img/web/de/web_pgp_revocation.png)

### Schlüssel verwalten

![Die OpenPGP-Einstellungen mit der Schlüsselliste, den Schaltflächen Schlüssel erzeugen, Schlüssel importieren und Öffentlichen Schlüssel suchen sowie den Vorgaben für neue Nachrichten](/img/web/de/web_pgp_keys.png)

- **Schlüssel importieren** importiert einen Schlüssel aus einer `.asc`-Datei oder eingefügtem Text, zum Beispiel Ihren vorhandenen privaten Schlüssel oder den öffentlichen Schlüssel eines Kontakts.
- **Öffentlichen Schlüssel suchen** sucht einen öffentlichen Schlüssel anhand seines vollständigen Fingerabdrucks auf einem Schlüsselserver.
- **Details / bestätigen** zeigt einen Schlüssel und lässt Sie seinen **Fingerabdruck bestätigen**. Vergleichen Sie den Fingerabdruck über einen anderen Kanal mit Ihrem Kontakt, etwa telefonisch, und aktivieren Sie dann *Ich habe diesen Fingerabdruck bestätigt*. Zum Verschlüsseln werden nur bestätigte Schlüssel verwendet.
- **Öffentlichen Schlüssel exportieren** liefert Ihren öffentlichen Schlüssel zur Weitergabe. Das Menü bietet außerdem **Privaten Schlüssel sichern** (mit Ihrer Passphrase verschlüsselt).
- **Privater Schlüssel** ▸ **In diesem Browser entsperren** oder **Passphrase ändern**. **Alle sperren** sperrt alle entsperrten Schlüssel wieder.
- **Löschen** entfernt einen Schlüssel; Sie bestätigen durch Eingabe seines Fingerabdrucks.
- **Privater Standardschlüssel**, **Neue Nachrichten standardmäßig signieren** und **Neue Nachrichten standardmäßig verschlüsseln** legen die Vorgaben für neue E-Mails fest.
- **Schlüsselserver verwalten** listet die Schlüsselserver für *Öffentlichen Schlüssel suchen*.

:::note
grommunio Web lädt Ihre Schlüssel niemals auf einen Schlüsselserver hoch. Ihr privater Schlüssel liegt nur passphrasegeschützt in Ihrem Postfach; Signieren, Verschlüsseln und Entschlüsseln geschehen in Ihrem Browser.
:::

### OpenPGP-E-Mails senden

1. Schreiben Sie Ihre E-Mail.
2. Klicken Sie auf den Pfeil neben **Verschlüsseln** (und/oder **Signieren**) und wählen Sie **OpenPGP**.

![Das Menü Verschlüsseln mit den Optionen S/MIME und OpenPGP und den OpenPGP-Optionen](/img/web/de/web_compose_encrypt_menu.png)

3. Klicken Sie auf **Senden**. Haben Sie mehrere Schlüssel, fragt grommunio Web, welcher verwendet werden soll:

![Der Dialog OpenPGP-Schlüssel auswählen](/img/web/de/web_pgp_choose_key.png)

4. Geben Sie Ihre Passphrase ein, um Ihren privaten Schlüssel zu entsperren:

![Der Dialog Privaten OpenPGP-Schlüssel entsperren mit dem Feld für die Passphrase](/img/web/de/web_pgp_unlock.png)

Der Schlüssel bleibt in diesem Browser-Tab einige Minuten entsperrt, damit Sie die Passphrase nicht für jede E-Mail eingeben müssen. Danach – oder wenn Sie den Tab schließen – wird er automatisch wieder gesperrt.

Zum Verschlüsseln benötigt grommunio Web einen **bestätigten** öffentlichen Schlüssel jedes Empfängers. Fehlt einer oder ist er nicht bestätigt, erfahren Sie, welcher Empfänger betroffen ist. Lösen Sie Verteilerlisten vor dem Verschlüsseln in einzelne Empfänger auf.

:::caution
Solange die Verschlüsselung ausgewählt ist, speichert grommunio Web keine automatischen Entwürfe, damit keine unverschlüsselte Kopie Ihres Textes auf dem Server liegt. Sichern Sie wichtige Texte selbst.
:::

### OpenPGP-E-Mails lesen

Eine verschlüsselte E-Mail zeigt den Hinweis, dass Sie Ihren privaten Schlüssel entsperren müssen, um sie zu lesen:

![Eine verschlüsselte E-Mail im Lesebereich mit dem Hinweis zum Entsperren des privaten Schlüssels](/img/web/de/web_pgp_encrypted.png)

Klicken Sie auf den Hinweis und geben Sie Ihre Passphrase ein – die E-Mail wird in Ihrem Browser entschlüsselt:

![Eine entschlüsselte E-Mail mit dem Status: Nachricht entschlüsselt, gültige Signatur eines bestätigten Absenders](/img/web/de/web_pgp_decrypted.png)

Die Statuszeile zeigt, ob die Signatur gültig ist und ob der Schlüssel des Absenders bestätigt ist. Ein Klick darauf zeigt die Details. Antworten und Weiterleiten funktionieren wie gewohnt; der entschlüsselte Text verlässt Ihren Browser nicht.
