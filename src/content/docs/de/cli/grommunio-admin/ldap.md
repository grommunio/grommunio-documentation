---
title: "grommunio-admin ldap"
description: "grommunio-admin ldap — LDAP-Tools"
sidebar:
  label: "ldap"
  order: 10
---

### Name

grommunio-admin ldap — LDAP-Tools

### Zusammenfassung

<strong>grommunio-admin ldap</strong> <strong>check</strong> \[<em>-o ORGSPEC</em>\] \[<em>-r</em> \[<em>-m</em>\] \[<em>-y</em>\]\]  
<strong>grommunio-admin ldap</strong> <strong>configure</strong> \[<em>-d</em>\] \[<em>-o ORGSPEC</em>\]  
<strong>grommunio-admin ldap</strong> <strong>downsync</strong> \[<em>-c</em>\] \[-f-27\] \[-l-29\] \[-o ORGSPEC-31\] \[<em>-p PAGE_SIZE</em>\] \[<em>USER</em> \[<em>USER</em> …\]\]  
<strong>grommunio-admin ldap</strong> <strong>dump</strong> \[<em>-o ORGSPEC</em>\] <em>USER</em>  
<strong>grommunio-admin ldap</strong> <strong>info</strong> \[<em>-o ORGSPEC</em>\]  
<strong>grommunio-admin ldap</strong> <strong>reload</strong> \[<em>-o ORGSPEC</em>\]  
<strong>grommunio-admin ldap</strong> <strong>search</strong> \[<em>-a</em>\] \[<em>--format FORMAT</em>\] \[<em>-n MAX_RESULTS</em>\] \[<em>-o ORGSPEC</em>\] \[<em>-p PAGE_SIZE</em>\] \[<em>USER</em>\]

### Beschreibung

Das grommunio-Admin-LDAP-Modul bietet Funktionen zum Konfigurieren und Testen der LDAP-Verbindung sowie zum Herunterladen oder Aktualisieren von Benutzern.

### Befehle

`check`  
Überprüfen Sie, ob die LDAP-Objekte, mit denen die importierten Benutzer verknüpft sind, noch vorhanden sind, und entfernen Sie gegebenenfalls verwaisten Benutzer.

`configure`  
LDAP-Verbindung interaktiv konfigurieren oder ändern

`downsync`  
Benutzer aus LDAP synchronisieren oder importieren

`dump`  
Objekt LDAP drucken

`info`  
Verbindungsstatus anzeigen

`reload`  
Laden Sie die Konfiguration des LDAP neu und stellen Sie die Verbindung wieder her.

`search`  
Nach Benutzern suchen

### Optionen

`USER`  
LDAP Objekt-ID oder Suchbegriff

`-a`, `--all`  
Alle Ergebnisse anzeigen, nicht nur importierbare Objekte

`--auth-backend <automatic|externid|always_ldap|always_mysql>`  
Nur für <em>reload</em>. Legt das globale System-Authentifizierungs-Backend „authmgr“ fest. Kann einer der folgenden Werte sein: <em>automatic</em> (entspricht <em>externid</em>), <em>externid</em>, <em>always_ldap</em>, <em>always_mysql</em>. Standardwert ist <em>externid</em>, falls nicht festgelegt.

`-f`, `--force`  
Benutzer, die mit einem anderen oder gar keinem LDAP-Objekt verknüpft sind, zur Aktualisierung zwingen

`--format FORMAT`  
Ausgabeformat. Kann einer der folgenden Werte sein: <em>csv</em>, <em>json-flat</em>, <em>json-kv</em>, <em>json-object</em>, <em>json-structured</em> und <em>pretty</em>. Die Standardeinstellung ist <em>pretty</em>.

`-i`, `--import`  
Neue Benutzer aus LDAP importieren

`-l`, `--lang`  
Sprache für importierte Benutzer festlegen. Standardmäßig wird keine Sprache festgelegt.

`-m`, `--remove-maildirs`  
Entfernen Sie außerdem die Benutzerdateien von der Festplatte

`-n MAX_RESULTS`, `--max-results MAX_RESULTS`  
Maximale Anzahl der Ergebnisse oder 0, um die Begrenzung zu deaktivieren (Standardwert: 0). Beachten Sie, dass die tatsächliche Anzahl der Ergebnisse aufgrund von Paginierung und Filterung die Begrenzung überschreiten kann.

`-o ORGSPEC`, `--organization ORGSPEC`  
Verwenden Sie die organisationsspezifische Verbindung LDAP. Unterstützt die Organisations-ID oder den Organisationsnamen.

`-p PAGE_SIZE`, `--page-size PAGE_SIZE`  
Legt die Batchgröße für die paginierte Suche fest. Kann verringert werden, wenn bei langsamen LDAP-Servern Timeout-Fehler auftreten. Der Standardwert beträgt 1000.

`-r`, `--remove`  
Importierte Benutzer entfernen, für die das verknüpfte Objekt „LDAP“ nicht gefunden werden konnte

`-t TYPES`, `--types TYPES`  
Durch Kommas getrennte Liste der zu suchenden Objekttypen. Unterstützt werden <em>user</em>, <em>contact</em> und <em>group</em>.

`-x <bool>`, `--disable-ldap <bool>`  
Nur zum Neuladen. Setzen Sie den Schalter „LDAP deaktivieren“ für die Organisation oder systemweit.

`-y`, `--yes`  
Keine Bestätigung abfragen, „Ja“ annehmen

### Siehe auch

<strong>grommunio-admin</strong>(1), <strong>grommunio-admin-fs</strong>(1), <strong>grommunio-admin-user</strong>(1)
