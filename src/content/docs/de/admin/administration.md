---
title: "Verwaltung"
description: "Dieses Kapitel enthält Einzelheiten zur Verwaltung der Komponenten von grommunio mithilfe der verfügbaren Tools."
sidebar:
  order: 60
---

Dieses Kapitel enthält Einzelheiten zur Verwaltung der Komponenten von grommunio mithilfe der verfügbaren Tools.

## grommunio-Administrationsoberfläche (AUI)

Nach der erfolgreichen Installation der grommunio Appliance erreichen Sie die Benutzeroberfläche im Browser über Port 8443 (HTTPS). Die Admin-UI ist außerdem unverschlüsselt über Port 8080 erreichbar; schließen oder beschränken Sie diesen Port, bevor Sie die Appliance von außen zugänglich machen. Bei manuellen Installationen aktivieren Sie TLS für die Admin-UI wie unter [Konfiguration von Admin API und TLS](/admin/operations/#admin-api-tls-configuration) beschrieben.

Da Sie bei der Installation des Appliance höchstwahrscheinlich ein Passwort für die Admin-Benutzeroberfläche festgelegt haben, können Sie sich sofort mit diesen Zugangsdaten anmelden.

![grommunio login](/img/login.png)

Um durch die Benutzeroberfläche zu navigieren, nutzen Sie einfach die Seitenleiste auf der linken Seite.

![pic1](/img/system_drawer.png) ![pic2](/img/domain_drawer.png)

### Dashboard

Nach erfolgreicher Anmeldung wird das Dashboard mit den Echtzeitdaten der Maschine angezeigt, auf der grommunio läuft.

#### Spamschutz

Da grommunio über einen eigenen Antispam-Dienst verfügt, können die entsprechenden Daten im Dashboard angezeigt werden.

![grommunio antispam chart](/img/antispam.png)

#### Dienstleistungen

Antispam ist nicht der einzige grommunio-Dienst – tatsächlich gibt es noch viele weitere. Der aktuelle Status dieser Dienste wird auf der linken Seite des Dashboards angezeigt.

![grommunio services chart](/img/services.png)

Von hier aus können Sie diese Dienste anhalten, neu starten oder starten, indem Sie auf die Aktionsschaltflächen eines Dienstes in der Liste klicken.

#### CPU

![grommunio cpu chart](/img/cpu.png)

Eine Echtzeit- und Verlaufsanzeige zur Nutzung des CPU.

#### Speicher

![grommunio memory chart](/img/memory.png)

Eine Echtzeit- und Verlaufsanzeige der Speicherauslastung.

#### Versionen

![grommunio versions panel](/img/versions.png)

Eine Übersicht über die Versionen der installierten Komponenten.

### Domains

Klicken Sie in der Seitenleiste auf *Domains*, um zur Listenansicht der vorhandenen Domains zu gelangen. Wenn Sie grommunio gerade erst eingerichtet haben, ist die Tabelle leer. Wenn Sie derzeit deaktivierte Domains anzeigen möchten, aktivieren Sie das Kontrollkästchen *Deaktivierte anzeigen*.

#### Eine Domain hinzufügen

Um eine neue Domain hinzuzufügen, klicken Sie auf die blaue Schaltfläche *NEUE DOMAIN*, um das Formularfenster zu öffnen:

![adding domain](/img/add_domain.png)

Die folgenden Eigenschaften können festgelegt werden:

- Domain (erforderlich): Der Name der Domain (kann später nicht mehr geändert werden)
- Status: Ob die Domain derzeit aktiviert oder deaktiviert sein soll
- Organisation: Organisation der Domain
- Maximale Nutzerzahl (erforderlich): Die maximale Anzahl an Nutzern (E-Mail-Adressen) dieser Domain
- Titel: Titel der Domain
- Adresse: Adresse der Domain
- Administrator: Administrator der Domain
- Telefon: Hotline bei Problemen
- Homeserver: Der Server, auf dem die Daten der Domain gespeichert sind
- Domain-Admin-Rolle erstellen: Erstellt eine Rolle für Benutzer, die als Administratoren für diese Domain fungieren sollen
- grommunio-chat-Team erstellen: Erstellt ein neues grommunio-chat-Team für diese Domain. Wenn Sie möchten, dass sich Nutzer dieser Domain bei grommunio-chat anmelden können, muss dieses Kontrollkästchen aktiviert sein.

Klicken Sie auf *Hinzufügen*, um den Vorgang zu bestätigen, oder auf *Abbrechen*, um ihn abzubrechen.

#### Eine Domain bearbeiten

Um eine vorhandene Domain zu bearbeiten, klicken Sie in der Liste auf eine Domain, um die Detailansicht dieser Domain zu öffnen.

![editing domain](/img/edit_domain.png)

Passen Sie die Attribute einfach an Ihre Bedürfnisse an und klicken Sie anschließend unten auf *Speichern*, um Ihre Änderungen zu speichern.

Um das aktuelle Passwort der Domain zu ändern, klicken Sie neben dem Domainnamen auf *Passwort ändern*. Sie werden aufgefordert, Ihr neues Passwort festzulegen und zu bestätigen.

#### Eine Domain löschen

Um eine Domain zu löschen, klicken Sie in der Domain-Listenansicht auf das Papierkorbsymbol der entsprechenden Domain.

Die folgenden Flags können gesetzt werden:

- Endgültig löschen: Wenn Sie dieses Kontrollkästchen aktivieren, wird die Domain vollständig aus der Datenbank entfernt und nicht nur deaktiviert.
- Dateien löschen: Diese Option ist nur bei endgültiger Löschung verfügbar und löscht alle Dateien dieser Domain.

Klicken Sie auf *Bestätigen*, um den Vorgang zu bestätigen, oder auf *Abbrechen*, um ihn abzubrechen.

#### Domains reaktivieren

Wenn Sie eine Domain nicht endgültig gelöscht haben, wird sie automatisch als deaktiviert markiert. Um eine Domain wieder zu aktivieren, klicken Sie in der Liste auf die betreffende Domain, um zur Detailansicht zu gelangen. Ändern Sie nun den Status von „deaktiviert“ in „aktiviert“.

![editing domain](/img/activate_domain.png)

### Benutzer

Wenn mindestens eine Domäne in der Datenbank vorhanden ist, können Benutzer zu einer Domäne hinzugefügt werden. Um die vorhandenen Benutzer einer Domäne anzuzeigen, wechseln Sie zur Domänenansicht im Menü (*Registerkarte „Domänen“*).

Klicken Sie auf eine Domäne, um die verfügbaren Unterseiten anzuzeigen, und klicken Sie dann auf *Benutzer*. Sie werden daraufhin zur Liste der Benutzer dieser Domäne weitergeleitet. Wenn Sie grommunio gerade erst installiert oder die Domäne hinzugefügt haben, ist die Liste leer.

Um alternativ alle Benutzer aller Domänen anzuzeigen, klicken Sie im Menü auf *Globale Benutzer*.

#### Einen Benutzer hinzufügen

Um einen neuen Benutzer hinzuzufügen, klicken Sie auf die blaue Schaltfläche *NEUER BENUTZER*, um das Formularfenster zu öffnen:

![adding a user](/img/add_user.png)

Die folgenden Eigenschaften können festgelegt werden:

- Modus: Normaler oder gemeinsamer Benutzer
- Benutzername (erforderlich): Benutzername des Benutzers
- Passwort (erforderlich): Passwort des Benutzers
- Anzeigename: Name, der für diesen Benutzer angezeigt werden soll
- Speicherplatzlimit: Speicherplatzlimit des Benutzers
- Typ: Benutzertyp
- Heimserver: Der Server, auf dem die Daten des Benutzers gespeichert sind

Klicken Sie auf *Hinzufügen*, um den Vorgang zu bestätigen, oder auf *Abbrechen*, um ihn abzubrechen. Wenn Sie weitere Benutzereigenschaften festlegen möchten, klicken Sie auf *Hinzufügen und bearbeiten*, um die Detailansicht dieses Benutzers zu öffnen.

#### Einen Benutzer bearbeiten

Um einen bestehenden Benutzer zu bearbeiten, klicken Sie in der Liste auf einen Benutzer, um die Detailansicht dieses Benutzers zu öffnen.

![editing a user](/img/edit_user.png)

Es gibt 10 Hauptkategorien von Benutzereigenschaften:

- Konto: RPC/HTTP (Outlook Anywhere), MAPI/HTTP, IMAP, POP3 usw. – Konfiguration
- Alternative Namen: Alternative Benutzernamen für die Anmeldung bei E-Mail-Clients (muss keine E-Mail-Adresse sein)
- Details: MAPI-Eigenschaften
- Kontakt: Zusätzliche MAPI-Eigenschaften
- Rollen: Rollen des Benutzers
- SMTP: Zusätzliche E-Mail-Adressen für diesen Benutzer (Aliase) und Weiterleitungsregeln
- Berechtigungen: Wählen Sie Benutzer aus, die über spezielle Berechtigungen für das Postfach dieses Benutzers verfügen
- OOF: Abwesenheitsnotiz
- Fetchmail: Konfiguration zum Abrufen von E-Mails von anderen Servern über Fetchmail
- Mobile Geräte: Liste der mobilen Geräte des Benutzers (über MDM)
- Synchronisierungsrichtlinie: MDM-Synchronisierungsrichtlinie (speziell für diesen Benutzer)

##### Konto

Die folgenden Eigenschaften können bearbeitet werden:

- Benutzername

- Modus: Postfachmodus – wählen Sie zwischen einem normalen Benutzer, einem gesperrten Benutzer und einem gemeinsamen Postfach

- Typ: Art des Benutzers

- Homeserver: Server, auf dem die Daten des Benutzers gespeichert sind

- Sprache: Speichert die Sprache des Benutzers (hat keinen Einfluss auf die Sprache der Benutzeroberfläche)

- Belegter Speicherplatz  
  - Sendekontingent: Maximale Größe des Postfachs, bevor das Senden von Nachrichten blockiert wird
  - Empfangskontingent: Maximale Größe des Postfachs, bevor der Empfang von Nachrichten blockiert wird
  - Speicherkontingent: Maximale Größe des Postfachs, bevor das Speichern (jeglicher Art von) Objekten blockiert wird

- Benutzer ausblenden in: Benutzer aus bestimmten Benutzerlisten ausblenden (z. B. aus der globalen Adressliste)

- Automatische Bearbeitung von Terminanfragen: Trivial

- grommunio-chat-Benutzer anlegen: Legt für diesen Benutzer ein grommunio-chat-Konto an. Ist dieses Kontrollkästchen deaktiviert, gibt es für diese Domäne kein grommunio-chat-Team.

- grommunio-chat-Administratorrechte: Weist dem grommunio-chat-Konto dieses Benutzers Administratorrechte für grommunio-chat zu.

- grommunio-chat-Berechtigungen: Erteilt grommunio-chat-Administratorrechte

- SMTP-Versand zulassen: Ermöglicht es dem Benutzer, E-Mails über SMTP zu versenden

- Passwortänderungen zulassen: Ermöglicht es dem Benutzer, sein Passwort zu ändern

- Anmeldungen über POP3/IMAP zulassen: Ermöglicht Anmeldungen über POP3 oder IMAP

- In der GAL ausblenden: Blendet den Benutzer in der globalen Adressliste aus

- Chat/Meet/Dateien/Archiv zulassen: Ermöglicht den Zugriff auf die jeweilige Funktion

Beachten Sie, dass die Speicherquotengrenze auch für den Versand relevant ist, da eine Nachricht intern vorhanden sein muss, bevor sie gesendet werden kann. Umgekehrt muss die Speicherquotengrenze für den Empfang die Speicherung von Nachrichten ermöglichen. (Daher sollte die Speicherquote immer größer sein als die Empfangsquote und größer als die Versandquote.)

Um das aktuelle Passwort des Benutzers zu ändern, klicken Sie neben dem Benutzernamen auf *Passwort ändern*. Sie werden aufgefordert, das neue Passwort festzulegen und zu bestätigen.

##### Benutzer & Kontakt

Gängige MAPI-Zubehörteile. Diese sind selbsterklärend.

##### Rollen

Benutzerrollen, die über das Textfeld mit Autovervollständigung bearbeitet werden können

![editing a user](/img/user_roles.png)

##### SMTP

Benutzer-Aliase: In den Textfeldern können Sie Aliase für den aktuellen Benutzer festlegen. Klicken Sie auf die Schaltfläche „E-Mail hinzufügen“, um einen Alias hinzuzufügen, oder auf das Papierkorbsymbol, um einen Alias zu löschen.

E-Mail-Weiterleitung: Diese Funktion kann verwendet werden, um eine Umleitung oder das Klonen von Nachrichten durchzusetzen, unabhängig von den vom Postfachbesitzer konfigurierten Posteingangsregeln. Der in Ihrem E-Mail-System verwendete Mail Transfer Agent muss diese Funktion unterstützen und entsprechend konfiguriert sein, um die SQL-Tabelle auszuwerten, in der die Weiterleitungsinformationen gespeichert sind (siehe unten).

![editing a user](/img/user_smtp.png)

Konfigurationsfragmente zur Implementierung des CC-Modus (forward_type 0) für z. B. Postfix:

1.  Datei `/etc/postfix/main.cf`: Einstellung `recipient_bcc_maps = mysql:/etc/postfix/grommunio-bcc-forwards.cf`
2.  Datei `grommunio-bcc-forwards.cf`: Einstellung `user = ...`, `password = ...`, `hosts = localhost`, `dbname = grommunio`, `query = SELECT destination FROM forwards WHERE username='%s' AND forward_type = 0`

Der Umleitungsmodus (forward_type 1) wird dem Administrator als Aufgabe überlassen.

##### Berechtigungen

In diesem Dialogfeld können Sie anderen Benutzerkonten bestimmte Berechtigungen auf Postfach-Ebene zuweisen.

- Bevollmächtigte: Benutzer in der Bevollmächtigtenliste können die Funktion „Im Namen von“ nutzen, d. h. Nachrichten mit einer `From:`-Zeile versenden, die die Identität des Bevollmächtigers enthält. *Die Nutzung der Bevollmächtigung wird in den Nachrichten protokolliert.*
- „Als senden“ (auch als „Impersonation“ bezeichnet): Benutzer in der „Als senden“-Liste dürfen Nachrichten mit einer `From:`-Zeile versenden, die die Identität des Beauftragenden enthält. Dies ähnelt der Delegation, jedoch wird die Nutzung der Delegation *nicht* in den Nachrichten protokolliert. „Send-As“ hat Vorrang vor „Send-On-Behalf“ und überdeckt diese Funktion, da die SA/SOB-Berechtigung nur serverseitig bekannt ist und MAPI-Clients keine Möglichkeit haben, zwischen den beiden zu wählen.
- „Vollständige Berechtigungen“: Benutzer in dieser Liste werden wie der Postfachbesitzer behandelt und unterliegen beim Lesen oder Schreiben von Ordner- oder Nachrichtenobjekten keiner Berechtigungsprüfung.

![editing a user](/img/user_permissions.png)

##### OOF

Abwesenheitsbenachrichtigungen (automatische Antwortnachrichten).

![editing a user](/img/user_oof.png)

##### Fetchmail

Über fetchmail ist es möglich, E-Mails von anderen Mailservern abzurufen. Um diese Funktion zu konfigurieren, können Sie mehrere E-Mail-Server und/oder Benutzer hinzufügen, von denen E-Mails abgerufen werden sollen.

![editing a user](/img/fetchmail.png)

Um einen neuen Fetchmail-Eintrag hinzuzufügen, klicken Sie auf das eingekreiste Plus-Symbol. Daraufhin öffnet sich das folgende Eingabeformular:

![editing a user](/img/add_fetchmail.png)

- Quellserver (erforderlich): E-Mail-Server, von dem die Daten abgerufen werden sollen
- Quellbenutzer (erforderlich): E-Mail-Adresse, von der die Daten abgerufen werden sollen
- Quellpasswort (erforderlich): Passwort für das Konto des Quellbenutzers (Hinweis: Einfache oder doppelte Anführungszeichen werden nicht unterstützt)
- Quellordner (erforderlich): Quellordner, aus dem synchronisiert werden soll
- Quellauthentifizierung: Zu verwendende Authentifizierungsart
- Protokoll (erforderlich): Zu verwendendes Protokoll
- SSL-Zertifikatpfad (wenn *SSL verwenden* aktiviert ist): Pfad zum lokalen Zertifikatsverzeichnis oder leer lassen, um die lokale Standardeinstellung zu verwenden
- SSL-Fingerabdruck (wenn *SSL verwenden* aktiviert ist): Fingerabdruck des Serverzertifikats
- Zusätzliche Optionen: (wenn *SSL verwenden* aktiviert ist): Zusätzliche Fetchmail-Optionen
- Aktiv: Gibt an, ob fetchmail derzeit aktiviert ist
- SSL verwenden: Gibt an, ob SSL verwendet werden soll
- Alle abrufen: Gibt an, ob bereits gelesene E-Mails abgerufen werden sollen
- Behalten: Behält die ursprünglichen E-Mails bei
- SSL-Zertifikatsprüfung: Überprüft das SSL-Zertifikat

Um diese Eigenschaften zu bearbeiten, klicken Sie auf eine Zeile in der Tabelle. Um einen Eintrag zu löschen, klicken Sie auf das Papierkorbsymbol einer Tabellenzeile.

:::caution
Änderungen werden erst gespeichert, wenn Sie unten auf der Seite auf *Speichern* klicken.
:::

##### Mobile Geräte

Synchronisierte Mobilgeräte dieses Benutzers

![user mobile devices](/img/user_devices.png)

###### Maßnahmen:

- Fernlöschung: Löst über MDM (Mobile Device Management) eine Fernlöschung für ein Gerät aus
- Fernlöschung abbrechen: Die oben genannte Aktion abbrechen

##### Synchronisierungsrichtlinie

Spezifische MDM-Regeln für diesen Benutzer. Unbearbeitete Regeln (ausgegraut) werden aus der Richtlinie der Domäne übernommen.

![user sync policy](/img/user_sync_policy.png)

#### Einen Benutzer löschen

Um einen Benutzer zu löschen, klicken Sie in der Benutzeransicht auf das Papierkorbsymbol des jeweiligen Benutzers.

Die folgenden Flags können gesetzt werden:

- Dateien löschen: Löscht alle Dateien dieses Benutzers

Klicken Sie auf *Bestätigen*, um den Vorgang zu bestätigen, oder auf *Abbrechen*, um ihn abzubrechen.

### Öffentliche Ordner

Wenn mindestens eine Domäne in der Datenbank vorhanden ist, können einer Domäne öffentliche Ordner hinzugefügt werden. Um die vorhandenen öffentlichen Ordner einer Domäne anzuzeigen, navigieren Sie in der Seitenleiste zur Domänenansicht.

Klicken Sie auf eine Domäne, um die verfügbaren Unterseiten anzuzeigen, und klicken Sie dann auf *Öffentliche Ordner*. Sie werden daraufhin zur Liste der Ordner dieser Domäne weitergeleitet. Es gibt zwei Ansichten: eine hierarchische Ansicht, ähnlich einer üblichen Ordnerstruktur, und eine baumartige Grafikansicht.

![public folders](/img/folders.png)

![public folders](/img/folders_tree.png)

#### Einen Ordner hinzufügen

Um einen Ordner hinzuzufügen, klicken Sie auf das Symbol *Plus-Kreis* des übergeordneten Ordners. *Öffentliche Ordner* ist der Stammordner, in den alle anderen Ordner eingeordnet werden. Daher befindet sich der erste Ordner immer innerhalb von *Öffentliche Ordner (IPM_SUBTREE)*.

![adding a folder](/img/add_folder.png)

Die folgenden Eigenschaften können festgelegt werden:

- Ordnername (erforderlich): Name des Ordners
- Container: Typ des Ordner-Containers
- Kommentar: Kommentar
- Eigentümer: Eigentümer dieses Ordners (Mehrfachauswahl von Benutzern aus der Datenbank)

Klicken Sie auf *Hinzufügen*, um den Vorgang zu bestätigen, oder auf *Abbrechen*, um ihn abzubrechen.

#### Einen Ordner bearbeiten

Um einen vorhandenen Ordner zu bearbeiten, klicken Sie in der Hierarchieansicht auf das Symbol *Bearbeiten* auf der rechten Seite, um die Ordnerdetails zu öffnen.

![editing a folder](/img/edit_folder.png)

Passen Sie die Attribute einfach an Ihre Bedürfnisse an und klicken Sie anschließend unten auf *Speichern*, um Ihre Änderungen zu speichern.

##### Ordnerberechtigungen

Um die Ordnerberechtigungen zu bearbeiten, klicken Sie auf *Berechtigungen öffnen*, um das Berechtigungsdialogfeld zu öffnen.

![editing a folder](/img/folder_permissions.png)

Dieses Formular entspricht genau den Ordnerberechtigungseinstellungen von grommunio-web und Outlook. Wählen Sie oben die Benutzer aus, denen Sie Berechtigungen erteilen möchten, und legen Sie unten deren Berechtigungen fest.

#### Einen Ordner löschen

Um einen Ordner zu löschen, klicken Sie in der Ordneransicht auf das Papierkorbsymbol des Ordners. Klicken Sie auf *Bestätigen*, um den Vorgang zu bestätigen, oder auf *Abbrechen*, um ihn abzubrechen.

### Gruppen

Wenn mindestens eine Domäne in der Datenbank vorhanden ist, können einer Domäne Gruppen hinzugefügt werden. Um die vorhandenen Gruppen einer Domäne anzuzeigen, navigieren Sie in der Seitenleiste zur Domänenansicht.

Klicken Sie auf eine Domäne, um die verfügbaren Unterseiten anzuzeigen, und klicken Sie dann auf *Gruppen*. Sie werden daraufhin zur Liste der Gruppen dieser Domäne weitergeleitet. Wenn Sie grommunio gerade erst installiert oder die Domäne hinzugefügt haben, ist die Liste leer.

#### Eine Gruppe hinzufügen

Um eine neue Gruppe hinzuzufügen, klicken Sie auf die blaue Schaltfläche *NEUE GRUPPE*, um das Formularfenster zu öffnen:

![adding a group](/img/add_group.png)

Die folgenden Eigenschaften können festgelegt werden:

- Gruppenname (erforderlich): E-Mail-Adresse der Gruppe

- Anzeigename: Der angezeigte Name der Gruppe

- Im Adressbuch ausblenden: Wenn diese Option ausgewählt ist, wird die Mailingliste im globalen Adressbuch nicht angezeigt.

- Typ:  
  - Normal: Benutzer als Empfänger auswählen
  - Domäne: Alle Benutzer der Domäne sind Empfänger

- Berechtigung: Benutzer, die E-Mails an die Gruppe senden dürfen  
  - Alle: Jeder
  - Intern: Alle Benutzer der Gruppe
  - Domäne: Alle Benutzer in der Domäne
  - Bestimmt: Bestimmte Benutzer (*Absender*)

- Empfänger: Benutzer der Domäne, die der Gruppe angehören (nicht verfügbar, wenn type=Domain)

- Absender: Benutzer, die E-Mails an die Gruppe senden dürfen (nur verfügbar, wenn „privilege=Specific“ eingestellt ist)

Klicken Sie auf *Hinzufügen*, um den Vorgang zu bestätigen, oder auf *Abbrechen*, um ihn abzubrechen.

#### Eine Gruppe löschen

Um eine Gruppe zu löschen, klicken Sie in der Listenansicht auf das Papierkorbsymbol der entsprechenden Gruppe. Klicken Sie auf *Bestätigen*, um den Vorgang zu bestätigen, oder auf *Abbrechen*, um ihn abzubrechen.

### Rollen

Klicken Sie in der Seitenleiste auf *Rollen*, woraufhin Sie zur Listenansicht der vorhandenen Rollen weitergeleitet werden. Wenn Sie grommunio gerade erst eingerichtet haben, ist die Tabelle leer.

Standardmäßig wird bei jedem Hinzufügen einer Domain eine neue Rolle mit Berechtigungen für die neue Domain angelegt. Darüber hinaus können Sie eigene Rollen erstellen, um Zugriffsrechte für mehrere Domains festzulegen.

#### Eine Rolle hinzufügen

Um eine neue Rolle hinzuzufügen, klicken Sie auf die blaue Schaltfläche *NEUE ROLLE*, um das Formularfenster zu öffnen:

![adding a role](/img/add_role.png)

Die folgenden Eigenschaften können festgelegt werden:

- Name (erforderlich): Name der Rolle

- Benutzer: Benutzer, denen diese Rolle zugewiesen wird

- Berechtigungen:  
  - SystemAdmin: Erlaubt alle Vorgänge
  - SystemAdminRO: Gewährt Lesezugriff auf Systemeinstellungen
  - DomainAdmin: Erlaubt Vorgänge für eine bestimmte Domäne
  - DomainAdminRO: Gewährt Lesezugriff auf eine bestimmte Domäne
  - DomainPurge: Falls vorhanden, gewährt die Berechtigung, jede beschreibbare Domäne zu löschen
  - OrgAdmin: Gewährt DomainAdmin-Berechtigungen für jede Domäne mit übereinstimmender orgID
  - Params: Domäne/Organisation, auf die mit dieser Rolle zugegriffen werden soll

- Beschreibung: Stellenbeschreibung

Klicken Sie auf *Hinzufügen*, um den Vorgang zu bestätigen, oder auf *Abbrechen*, um ihn abzubrechen.

#### Eine Rolle bearbeiten

Um eine vorhandene Rolle zu bearbeiten, klicken Sie in der Liste auf eine Rolle, um die Detailansicht dieser Rolle zu öffnen.

![editing a role](/img/edit_role.png)

Passen Sie die Attribute einfach an Ihre Bedürfnisse an und klicken Sie anschließend unten auf *Speichern*, um Ihre Änderungen zu speichern.

#### Eine Rolle löschen

Um eine Rolle zu löschen, klicken Sie in der Listenansicht auf das Papierkorbsymbol der entsprechenden Rolle. Klicken Sie auf *Bestätigen*, um den Vorgang zu bestätigen, oder auf *Abbrechen*, um ihn abzubrechen.

### Organisationen

Klicken Sie in der Seitenleiste auf *Organisationen*, um zur Listenansicht der vorhandenen Organisationen zu gelangen. Wenn Sie grommunio gerade erst eingerichtet haben, ist die Tabelle leer.

Organisationen dienen dazu, Domänen zu gruppieren und über die Rolle *OrgAdmin* Zugriff auf mehrere Domänen im System zu gewähren. Jede Domäne kann höchstens einer Organisation zugeordnet werden.

#### Eine Organisation hinzufügen

Um eine neue Organisation hinzuzufügen, klicken Sie auf die blaue Schaltfläche *NEUE ORGANISATION*, um das Formularfenster zu öffnen:

![adding an organization](/img/add_organization.png)

Die folgenden Eigenschaften können festgelegt werden:

- Name (erforderlich): Name der Organisation
- Beschreibung: Ausführliche Beschreibung der Organisation
- Domains: Domains, die zu dieser Organisation gehören

Klicken Sie auf *Hinzufügen*, um den Vorgang zu bestätigen, oder auf *Abbrechen*, um ihn abzubrechen.

#### Eine Organisation bearbeiten

Um eine bestehende Organisation zu bearbeiten, klicken Sie in der Liste auf eine Organisation, um die Detailansicht dieser Organisation zu öffnen.

![editing an organization](/img/edit_organization.png)

In dieser Ansicht ist es außerdem möglich, die globale LDAP-Konfiguration für Domänen in dieser Organisation zu überschreiben. Weitere Informationen zum Erstellen einer LDAP-Konfiguration finden Sie im Abschnitt *LDAP* dieser Dokumentation.

#### Eine Organisation löschen

Um eine Organisation zu löschen, klicken Sie in der Listenansicht auf das Papierkorbsymbol der entsprechenden Organisation. Klicken Sie auf *Bestätigen*, um den Vorgang zu bestätigen, oder auf *Abbrechen*, um ihn abzubrechen.

### Standardwerte

Um die Erstellung von Domänen und insbesondere von Benutzern zu vereinfachen, können Standardparameter für die Erstellung festgelegt werden. Sind diese festgelegt, werden die Eingabemasken zum Hinzufügen einer Domäne oder eines Benutzers automatisch mit diesen Werten ausgefüllt.

Benutzer mit SystemAdmin-Berechtigungen können globale Standardeinstellungen festlegen, indem sie im Menü auf *Standardeinstellungen* klicken.

![editing global defaults](/img/defaults.png)

Diese Werte können für jede Domäne in den Domänenübersichten überschrieben werden:

![editing domain defaults](/img/domainsDefaults.png)

### Einstellungen

Über die obere Leiste lassen sich zwei Arten von Einstellungen aufrufen:

- **Lokale Einstellungen** — browserbezogene Einstellungen (**Dunkelmodus** und das
  **Farbschema**) auf der Seite *Einstellungen*. Die Sprache und die Umschaltfunktion für hell/dunkel befinden sich ebenfalls
  in der oberen Leiste.
- **grommunio-Einstellungen** — die serverweite Konfigurationsseite mit den Registerkarten **Lizenz**,
  **Design** und **Updates** (siehe unten).

![grommunio-admin local settings](/img/settings.png)

#### Lizenz

Auf der Registerkarte *Lizenz* laden Sie Ihre Lizenz hoch (klicken Sie auf *Hochladen* und wählen Sie Ihre
erworbene Lizenz aus; mit *Lizenz reaktivieren* wird sie erneut aktiviert). Die folgenden Eigenschaften
werden angezeigt:

![grommunio license](/img/license.png)

- Produkt – Art des grommunio-Abonnements (Community, Enterprise, …)
- Erstellt – Datum der Lizenzausstellung
- Läuft ab – letzter Tag der Gültigkeit der Lizenz
- Benutzer / Max. Benutzer – aktuelle und maximale Anzahl der Benutzer

Wenn Sie die Liste der Benutzer aufklappen, sehen Sie, welche Benutzer die Benutzerplätze der Lizenz belegen.

#### Design

Die Registerkarte *Design* sorgt serverweit für ein **White-Label** der Admin-Benutzeroberfläche. Klicken Sie auf das Plus-Symbol,
um einen Bildsatz für einen Hostnamen hinzuzufügen; jeder Schlüssel ist eine URL zu einer Bilddatei:

- `logo` — Logo im Anmeldeformular
- `logoLight` — Logo im ausgeklappten Menü
- `icon` — Symbol im eingeklappten Menü
- `background` / `backgroundDark` — Hintergrundbild im hellen / dunklen Modus

Sie müssen nur die Bilder überschreiben, die Sie ändern möchten. Mit *Konfiguration anzeigen* wird
das resultierende `customImages`-Objekt angezeigt, das in
`/etc/grommunio-admin-common/config.json` kopiert werden soll.

![design](/img/design.png)

#### Aktuelles

Über die Registerkarte „*Updates*“ lassen sich Aktualisierungen und Upgrades der grommunio-Installation über die Admin-Benutzeroberfläche
vornehmen:

- Wählen Sie das **Repository** aus – *Community* (öffentlich) oder *Supported* (Lizenz
  erforderlich).
- **Suchen Sie nach Updates** und führen Sie anschließend über die
  entsprechenden Schaltflächen ein **Update** oder ein **Upgrade** der Pakete durch.

![updates](/img/updates.png)

### Anwendungslinks und serverseitige Konfiguration

Die externen **Anwendungslinks** im App-Launcher der oberen Leiste werden
serverseitig in `/etc/grommunio-admin-common/config.json` festgelegt (jeweils eine URL, standardmäßig
leer): `rspamdWebAddress`, `mailWebAddress` (grommunio Web), `chatWebAddress`
(Chat), `videoWebAddress` (Meet), `fileWebAddress` (Dateien) und `archiveWebAddress`
(Archiv).

Die gleiche Datei enthält weitere Verhaltensweisen:

- `tokenRefreshInterval` — Intervall für die Aktualisierung des Tokens in Sekunden (Standard: `86400`, 24 h)
- `defaultDarkMode` / `defaultTheme` — Standarddarstellung (Designs: grommunio, grün, lila, magenta, türkis, orange, braun, blaugrau)
- `loadAntispamData` — Antispam-Daten im Dashboard laden (Standard `true`)
- `searchAttributes` — mögliche LDAP-Suchattribute (Standard: alle Attribute)

### LDAP

Es ist möglich, Benutzer aus externen Benutzerverzeichnissen mithilfe von LDAP zu synchronisieren. Um LDAP zu konfigurieren, klicken Sie in der Seitenleiste auf *LDAP*. Sie werden dann zum LDAP-Formular weitergeleitet, in dem Sie eine globale LDAP-Konfiguration festlegen können. Diese Konfiguration kann für jede einzelne Organisation überschrieben werden. Navigieren Sie dazu zu *Organisationen* und öffnen Sie die Detailansicht einer Organisation. Schalten Sie den Schalter *Globale LDAP-Konfiguration überschreiben* um und legen Sie eine Konfiguration gemäß der folgenden Spezifikation fest.

:::caution
Bitte beachten Sie, dass Konfigurationsänderungen nicht automatisch auf bereits laufende Dienste angewendet werden. Starten Sie die Dienste unbedingt neu, damit die LDAP-Authentifizierung zunächst übernommen werden kann.
:::

Nach dem Anwenden einer neuen LDAP-Konfiguration werden die Dienste bewusst nicht automatisch neu gestartet, da dies zu möglicherweise störenden Ausfallzeiten führen würde, wenn bestehende interne Benutzer bereits vom Authentifizierungsmanager (authmgr) verwendet werden. Die Dienste können entweder über die Admin-Benutzeroberfläche im Dashboard-Bereich oder direkt über systemd neu gestartet werden:

`systemctl restart gromox-{http,zcore,pop3,delivery,delivery-queue,midb,imap}`

#### Verfügbarkeit

*LDAP nicht verfügbar* bedeutet, dass die LDAP-Konfiguration nicht korrekt eingerichtet ist oder der Server nicht erreichbar ist. Wenn Sie LDAP manuell deaktivieren möchten, schalten Sie den Schalter *LDAP aktiviert* um.

![LDAP switch](/img/ldap_switch.png)

#### Konfiguration

Mit diesem Formular erstellen Sie eine *ldap.yaml*-Datei, die eine LDAP-Verbindung konfiguriert.

Die Immobilien sind in folgende Kategorien unterteilt:

- LDAP-Server
- Attributkonfiguration
- Benutzerdefinierte Zuordnung

Um eine Konfiguration zu speichern, klicken Sie unten auf *Speichern* oder auf *Konfiguration löschen*, um die aktuelle Konfiguration zu löschen.

#### LDAP-Server

Die folgenden Eigenschaften stehen zur Verfügung:

- LDAP-Server (server): Adresse des LDAP-Servers, mit dem eine Verbindung hergestellt werden soll
- LDAP-Bind-Benutzer (bindUser): DN des Benutzers, mit dem die anfängliche Bindung hergestellt werden soll
- StartTLS: Gibt an, ob der StartTLS-Mechanismus zur Sicherung der Verbindung verwendet werden soll
- LDAP-Basis-DN (baseDn): Basis-DN, die für die Benutzersuche verwendet werden soll

#### Authentifizierungsmanager

Primärer Authentifizierungsmechanismus

- Immer MySQL (Standard): MySQL-Authentifizierung
- Immer LDAP: LDAP-Authentifizierung
- Automatisch: Die Wahl zwischen LDAP und MySQL erfolgt dynamisch, je nachdem, ob der Benutzer ursprünglich aus LDAP importiert wurde.

#### Attributkonfiguration

Die folgenden Eigenschaften stehen zur Verfügung:

- LDAP-Vorlagen (templates): Vorlage zum Vorausfüllen der folgenden Felder. Verfügbar sind: - OpenLDAP - ActiveDirectory
- LDAP-Filter (filters): LDAP-Suchfilter für die Benutzersuche
- Eindeutiges Identifikationsattribut (objectID): Name eines Attributs, das ein LDAP-Objekt eindeutig identifiziert
- LDAP-Benutzernamenattribut (username): Name des Attributs, das dem Benutzernamen (E-Mail-Adresse) entspricht
- LDAP-Standardkontingent (defaultQuota): Speicherkontingent der importierten Benutzer, falls keine Zuordnung vorhanden ist
- LDAP-Anzeigenamen-Attribut (displayName): Name des Attributs, das den Namen enthält

#### LDAP Suchkriterien

Legt fest, welche Attribute die Funktion „Suche in LDAP“ bei der Suche nach einem beliebigen Suchbegriff berücksichtigt.

#### Benutzerdefinierte Zuordnung

LDAP-Attribut –> PropTag-Zuordnung für den LDAP-Import. Alle festgelegten Zuordnungen haben Vorrang vor aktiven Vorlagen.

Sie können eine Liste mit *(Name, Wert)*-Paaren erstellen

- Name: Name des PropTags, dem das Attribut zugeordnet ist
- Wert: Wert des PropTags, dem das Attribut zugeordnet ist

#### Benutzerimport und -synchronisierung

Um Benutzer aus allen Domänen zu importieren bzw. zu synchronisieren, benötigen Sie SystemAdmin-Berechtigungen. Wenn Sie diese haben, klicken Sie auf *BENUTZER IMPORTIEREN* oder *BENUTZER SYNCHRONISIEREN*. Dadurch werden alle Benutzer aller Domänen importiert bzw. synchronisiert.

Falls Sie nicht über diese Berechtigungen verfügen, können Sie Benutzer für Ihre Domain importieren bzw. synchronisieren. Navigieren Sie dazu zur Benutzerliste bzw. zu den Benutzerlisten Ihrer Domain(s).

Beim Importieren von Benutzern werden alle bereits importierten Benutzer synchronisiert und zudem neue Benutzer importiert. Bei der Synchronisierung erfolgt lediglich Ersteres.

#### Import und Synchronisierung von Domänenbenutzern

In der Benutzerliste können Sie entweder alle Benutzer dieser Domäne importieren bzw. synchronisieren, indem Sie auf *LDAP-Benutzer importieren/synchronisieren* klicken. Wenn Sie bestimmte Benutzer importieren möchten, gehen Sie wie folgt vor:

#### Benutzerimport

Klicken Sie auf *In LDAP suchen*, um eine Listenansicht der LDAP-Benutzer zu öffnen. Geben Sie einfach einen Benutzernamen in die Suchleiste ein und klicken Sie auf das Import-Symbol eines Benutzers, um diesen zu importieren.

![search ldap](/img/search_ldap.png)

Es besteht die Möglichkeit, den Import zu erzwingen. Ist diese Option aktiviert, wird ein bereits in der grommunio-Datenbank vorhandener Benutzer mit diesem Benutzernamen überschrieben.

![importing a user](/img/import_user.png)

Sie können diese bestimmten Benutzer synchronisieren, indem Sie in der Listenansicht auf sie klicken und anschließend in der Detailansicht auf die Schaltfläche *Synchronisieren* klicken (gilt nur für Benutzer mit der Kennung LDAP).

#### Einen Benutzer entfernen

Wenn Sie einen LDAP-Benutzer bearbeiten möchten, müssen Sie ihn von LDAP trennen. Klicken Sie dazu in der detaillierten Benutzeransicht auf *Trennen*. Dadurch wird die Synchronisierung im Wesentlichen aufgehoben, bis der Benutzer durch einen weiteren Import zwangsweise überschrieben wird.

#### Entfernen von verwaisten Benutzern

Wenn ein Benutzer aus dem LDAP-Verzeichnis entfernt wurde, wird der importierte Benutzer zu einem verwaisten Benutzer. Um derzeit verwaiste Benutzer anzuzeigen und/oder zu löschen, klicken Sie auf *LDAP-Benutzer prüfen*.

![orphaned users](/img/orphaned_users.png)

### Datenbankkonfiguration

Zur Verwaltung von Diensten können Konfigurationsdateien in der Datenbank angelegt werden. Jede Konfigurationsdatei verwaltet genau eine Datei und enthält Zeilen mit *(Schlüssel, Wert)*-Paaren.

Dadurch entsteht eine hierarchische Struktur:

- ServiceA  
  - DateiA 
 - foo=bar

  - Datei B 
 - test=Beispiel
    - test2=Beispiel2

- ServiceB  
  - DateiC 
 - Schlüssel=Wert

#### Eine Datei hinzufügen

Ein anschauliches Beispiel wäre die Konfiguration eines Relayhosts in Postfix:

![adding a file](/img/add_file.png)

#### Eine Datei bearbeiten

Um eine Datei zu bearbeiten, klicken Sie auf den Dienst, zu dem die Datei gehört. Daraufhin wird eine Detailansicht des Dienstes mit einer Liste seiner Dateien geöffnet. Klicken Sie auf eine Datei, um deren Detailansicht zu öffnen, und passen Sie die *(Schlüssel, Wert)*-Paare nach Ihren Bedürfnissen an.

![editing a file](/img/edit_file.png)

Klicken Sie auf *Speichern*, um die Änderungen zu bestätigen, oder auf *Abbrechen*, um sie zu verwerfen.

#### Eine Datei löschen

Um eine Datei zu löschen, klicken Sie auf den Dienst, zu dem die Datei gehört. Daraufhin öffnet sich eine Detailansicht des Dienstes mit einer Liste seiner Dateien. Klicken Sie auf das Papierkorbsymbol einer Datei, um diese zu löschen, und bestätigen Sie den Vorgang.

#### Konfiguration von grommunio-dbconf

*grommunio-dbconf* ist ein interner Dienst, der bei Änderungen an den Konfigurationen bestimmte Aktionen bzw. Befehle ausführt. Diese Aktionen können für jeden Dienst separat festgelegt werden.

#### Hinzufügen einer grommunio-dbconf-Datei

Maßnahmen, die bei einer Änderung der Konfiguration eines Dienstes *<servicename>* ausgeführt werden sollen, müssen in der Datei *grommunio-dbconf/<servicename>* festgelegt werden.

Es gibt vorgefertigte Befehle, die bei Änderungen an Schlüsseln, Dateien oder Diensten ausgeführt werden können. Diese finden Sie auf der Registerkarte *Befehle*.

![file commands](/img/file_commands.png)

Wenn ein Befehl nicht vorhanden ist, wird der Befehl der nächstniedrigeren Ebene ausgeführt (Dienst -> Datei -> Schlüssel).

Beispielsweise könnten Sie Änderungen an *Postfix* wie folgt konfigurieren:

![adding dbconf](/img/add_dbconf.png)

Dadurch wird unter anderem der Dienst neu gestartet, wenn sich die Dienstkonfiguration ändert.

### Server

Wenn grommunio auf einem verteilten System ausgeführt wird, kann die Liste der Server in dieser Ansicht hinzugefügt werden. Es ist möglich, die Auswahlrichtlinie für die Benutzerverteilung festzulegen. Sie können zwischen folgenden Optionen wählen:

- round-robin: Es wird immer der Server verwendet, auf dem ein Benutzer am längsten *nicht* hinzugefügt wurde (im Kreisverfahren).
- balanced: Der neue Benutzer wird dem Server mit der geringsten Auslastung zugewiesen.
- first: Es wird immer der erste Server verwendet.
- last: Es wird immer der letzte Server verwendet.
- random: Es wird ein zufälliger Server ausgewählt.

![servers](/img/servers.png)

#### Einen Server hinzufügen

Um einen neuen Server hinzuzufügen, klicken Sie auf die blaue Schaltfläche *NEUER SERVER*, um das Formularfenster zu öffnen:

![add server](/img/add_server.png)

Die folgenden Eigenschaften können festgelegt werden:

- Hostname (erforderlich): Interner Server-Hostname
- Extname (erforderlich): Hostname für den externen Zugriff (DNS-Name)

#### Einen Server bearbeiten

Um einen vorhandenen Server zu bearbeiten, klicken Sie in der Liste auf einen Server, um die Detailansicht zu öffnen.

![edit server](/img/edit_server.png)

Passen Sie die Attribute einfach an Ihre Bedürfnisse an und klicken Sie anschließend unten auf *Speichern*, um Ihre Änderungen zu speichern.

### Protokolle

Klicken Sie in der Seitenleiste auf *Logs*, woraufhin Sie zur Liste der verfügbaren Protokolle weitergeleitet werden. In der Regel wird dort eine Liste der grommunio-/gromox-Dienste angezeigt, deren *journalctl*-Protokolle Sie hier einsehen können.

![logs](/img/logs.png)

Klicken Sie auf den Aufwärtspfeil, um frühere Protokolle anzuzeigen. Klicken Sie auf die Schaltfläche „Aktualisieren“, um neue Protokolle abzurufen, oder aktivieren Sie den Schalter „Automatische Aktualisierung“, um die Protokolle des ausgewählten Dienstes alle 5 Sekunden automatisch zu aktualisieren. Klicken Sie auf eine Protokollzeile, um alle Protokolle *nach* dem Zeitstempel der angeklickten Zeile abzurufen.

### E-Mail-Warteschlange

Klicken Sie in der Seitenleiste auf *Mail-Warteschlange*, woraufhin Sie zur Ansicht der aktuellen Postfix- und gromox-Mail-Warteschlange weitergeleitet werden.

![mailQ](/img/mailQ.png)

Diese Listen werden alle 10 Sekunden automatisch aktualisiert.

#### Aktionen

Wählen Sie Tabellenzeilen aus, indem Sie die Kontrollkästchen anklicken. Die Aktionen für die E-Mail-Warteschlange werden auf die ausgewählten Einträge angewendet.

Die Maßnahmen sind:

- Flush: Versuche, die E-Mail-Verarbeitung fortzusetzen
- Requeue: Entferne die E-Mail aus der Warteschlange und füge dieselbe E-Mail als neuen Eintrag wieder in die Warteschlange ein
- Delete: Entferne die E-Mail dauerhaft aus der Warteschlange

### Aufgaben

Klicken Sie in der Seitenleiste auf *Aufgaben*, wodurch Sie zur Aufgabenansicht weitergeleitet werden.

Für Vorgänge, die unter Umständen viel Zeit in Anspruch nehmen könnten, werden Aufgaben erstellt. Derzeit gehören dazu die LDAP-Synchronisierung und das Löschen von Ordnern. Sollte einer dieser Vorgänge zu lange dauern, wird eine Hintergrundaufgabe erstellt, die in dieser Tabelle eingesehen werden kann.

![tasks](/img/tasks.png)

Falls der interne Aufgabenprozessor nicht läuft, kann er manuell gestartet werden, indem Sie auf die Schaltfläche *Server starten* klicken.

Weitere Details zu einer Aufgabe können Sie in der Aufgabenansicht einsehen, indem Sie in der Tabelle auf eine Aufgabe klicken.

### Mobile Geräte

Klicken Sie in der Seitenleiste auf *Mobile Geräte*, um zur Liste der synchronisierten mobilen Geräte zu gelangen. Diese Ansicht ist eine Nachbildung der grommunio-sync-top-CUI.

![sync](/img/sync.png)

Die Ansicht aktualisiert die Geräte alle 2 Sekunden. Oben können Sie Filter für die Tabelle festlegen, beispielsweise eine Textsuche oder die Aktivität der Geräte.

### Synchronisierungsrichtlinien

Das Synchronisationsverhalten von Geräten wird durch die Synchronisierungsrichtlinien festgelegt, bei denen es sich um eine Reihe von Regeln handelt. Wenn sich ein Benutzer bei einem Konto anmeldet, werden diese Richtlinien auf das Gerät angewendet und aktualisiert, sobald sich die Richtlinie ändert. Es ist nicht möglich, die Richtlinien global zu ändern, sondern nur pro Domäne (alle Benutzer einer Domäne) oder pro Benutzer. Um die Richtlinie für alle Benutzer einer Domäne zu ändern, navigieren Sie zur Liste der Domänen und klicken Sie auf die Domäne, für die Sie die Richtlinie ändern möchten. Auf der Registerkarte *Synchronisierungsrichtlinie* können Sie die aktuellen Regeln einsehen.

![sync](/img/syncPolicies.png)

Blaue Kontrollkästchen, Schieberegler oder Textfelder weisen auf Abweichungen von der Standardrichtlinie hin, graue entsprechen dieser.

Um spezifische Regeln für einen Benutzer festzulegen, navigieren Sie zur Benutzerliste und klicken Sie auf den Benutzer, für den Sie die Richtlinie ändern möchten. Genau wie bei domänenspezifischen Richtlinien werden die aktuellen Regeln auf der Registerkarte *Synchronisierungsrichtlinie* angezeigt. Auch hier zeigen blaue Kontrollkästchen, Schieberegler oder Textfelder Abweichungen von der *Domänen*-Richtlinie dieses Benutzers an, während graue Elemente mit dieser übereinstimmen.

### Live-Status

Klicken Sie in der Seitenleiste auf *Live-Status*, um zur Live-Echtzeitansicht der grommunio-Webdienste zu gelangen. Alle HTTP-Anfragen werden im Live-Status angezeigt, einschließlich MAPI/HTTP, EAS, EWS und anderer durchgeführter Anfragen. Alle Verbindungen außer der grommunio-Groupware, z. B. Chat und Dateien, sind ebenfalls einsehbar und können über die Einstiegs-URL in der Liste nachverfolgt werden.

![live status](/img/livestatus.png)

Oben können Sie einen der verfügbaren virtuellen Hosts sowie das Aktualisierungsintervall auswählen.

## grommunio admin CLI (ACLI)

### grommunio-admin

`grommunio-admin` ist das Befehlszeilen-Tool für die grommunio Admin- und API-Modelle. `grommunio-admin` ist ein Low-Level-Verwaltungstool für die Konfiguration des grommunio und bietet eine Vielzahl von Unterbefehlen zur entsprechenden Verwaltung des grommunio.

grommunio-admin bietet außerdem eine Bash-Vervollständigungsfunktion und eine interaktive Shell, wobei folgende Unterbefehle zur Verfügung stehen:

|  |  |
|----|----|
| config | Konfiguration anzeigen oder überprüfen. Siehe [grommunio-admin config](/cli/grommunio-admin/config/). |
| connect | Verbindung zu einem entfernten CLI herstellen. Siehe [grommunio-admin connect](/cli/grommunio-admin/connect/). |
| dbconf | Verwaltung der in der Datenbank gespeicherten Konfiguration. Siehe [grommunio-admin dbconf](/cli/grommunio-admin/dbconf/). |
| domain | Domänenverwaltung. Siehe [grommunio-admin domain](/cli/grommunio-admin/domain/). |
| fetchmail | Fetchmail-Verwaltung zum Abrufen von E-Mails von einem Remote-Server. Siehe [grommunio-admin fetchmail](/cli/grommunio-admin/fetchmail/). |
| fs | Dateisystemoperationen. Siehe [grommunio-admin fs](/cli/grommunio-admin/fs/). |
| ldap | LDAP/Active Directory-Konfiguration, -Diagnose und -Synchronisation. Siehe [grommunio-admin ldap](/cli/grommunio-admin/ldap/). |
| mconf | Bearbeitung verwalteter Konfigurationen. Siehe [grommunio-admin mconf](/cli/grommunio-admin/mconf/). |
| mlist | Verwaltung von Mailing- und Verteilerlisten. Siehe [grommunio-admin mlist](/cli/grommunio-admin/mlist/). |
| passwd | Verwaltung interner Benutzerkennwörter. Siehe [grommunio-admin passwd](/cli/grommunio-admin/passwd/). |
| run | Starten des REST API. Siehe [grommunio-admin run](/cli/grommunio-admin/run/). |
| shell | Interaktive Shell starten. Siehe [grommunio-admin shell](/cli/grommunio-admin/shell/). |
| taginfo | Informationen zu den Eigenschaftstags von MAPI anzeigen. Siehe [grommunio-admin taginfo](/cli/grommunio-admin/taginfo/). |
| user | Benutzerverwaltung. Siehe [grommunio-admin user](/cli/grommunio-admin/user/). |
| version | Versionsinformationen anzeigen. Siehe [grommunio-admin version](/cli/grommunio-admin/version/). |
