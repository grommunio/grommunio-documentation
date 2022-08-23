Analyzing broken mails or behavior
==================================

Incoming messages
-----------------

If any part of a mail is considered broken or if the way it is displayed in
Outlook, grommunio-web, etc. is disputed, Grommunio Support can take a look at
the matter. For that, we need the original form of the message.

*Provided the message was received through SMTP*, the original transmission
before it is chopped up to fit the MAPI data model -- is recorded into
`/var/lib/gromox/user/XXX/eml/ZZZZZ`, for some values of X and Z, e.g.
`/var/lib/gromox/user/0/1/eml/166031254.1688`. You may need to use a bit of
Linux command-line `grep` command exercising to find the right one. File
timestamps may prove useful to limit the scope.

With the right eml file, we can retrace the steps in the RFC5322-to-MAPI
(Internet Message to MAPI Message) conversion through with the help of the
gromox-eml2mt utility.

*For messages that were sourced by gromox-kdb2mt*, it is possible to send us
the MT stream output that gromox-kdb2mt produces on stdout (do redirect this
into file). The `--only-obj` option can help produce a minimal-size MT file.
Though, depending on circumstances, we may need access to the entire database
(interactively or a mysqldump) if the MT file is not informative enough.

*For messages that were sourced by gromox-pff2mt*, it is possible to send us
the MT stream output thta pff2mt produces on stdout. The `--only-nid` option
can help produce a minimal-size MT file. Though, depending on circumstnaces, we
may need access to the PFF/PST/OST file if the MT file is not informative
enough.

*For objects sourced by gromox-eml2mt, gromox-ical2mt, gromox-vcf2mt*, send the
original file (it should be reasonably small compared to entire mailboxes).


Messages at rest
----------------

If some operation on a mailbox with existing messages does not work as
expected, we may require the sqlite mailbox, which is located in
`/var/lib/gromox/X/exmdb/exchange.sqlite3` to reproduce. Example use
case that would fall under this:

* moving messages between folders
* setting categories on messages
* composing or submitting messages
* MAPI-to-RFC5322 conversions for outgoing mail


Outgoing messages
-----------------

If sending a message fails with Outlook and gromox-http emits a log message like
this,

```
user=test@a4.inai.de host=::ffff:162.55.248.37  W-1281: Failed to export to RFC5322 mail while sending mid:0x5001b
```

then gromox-exm2eml can be used by with a debugger to step into the
`oxcmail_export` routine without stopping the server itself. (`gromox-exm2eml
-u test@a4.inai.de 0x5001b`)

If a message is received on a remote syste in an unexpectedly broken fashion,
there may be a problem with the sending path. If the issue is visible with the
message that is placed in the Sent Items folder, confer with the section
"Messages at rest". The gromox-exm2eml utility is eml2mt-mt2exm but in reverse,
and can be used to produce the RFC5322 form that is normally used for messages
leaving the system through SMTP. It can help determine if the MAPI-to-RFC5322
(MAPI Message to Internet Message) conversion has a problem, or the SMTP
transport.
