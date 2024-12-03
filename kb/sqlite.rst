..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later


Database check
==============

When gromox-http is not running, an integrity check may be performed on SQLite
databases.

Timing anecdote: The entire exchange.sqlite3 file is read. On an AMD 5950X CPU
with sqlite 3.46 (runs single-threaded), the processing speed from an in-memory
file is about 104 MB/s. Thus, slow storage and huge mailboxes influence the
time the operation takes in practice.

.. code-block:: text

	# sqlite3 /var/lib/gromox/domain/1/exmdb/exchange.sqlite3
	sqlite> pragma integrity_check;
	integrity_check
	--------------------------------------------------
	row 202171 missing from index state_username_index
	row 208269 missing from index state_username_index
	row 208282 missing from index state_username_index
	row 208284 missing from index state_username_index
	row 225182 missing from index state_username_index
	row 226595 missing from index state_username_index
	Tree 33990 page 33990 cell 260: invalid page number 4053928964
	Tree 33990 page 33990 cell 259: invalid page number 4050783236
	Tree 33990 page 33990 cell 255: invalid page number 333502732
	Multiple uses for byte 1240 of page 33990


Recovery
========

When (just) indices are broken, the file may be recreated:

.. code-block:: sh

	cd /var/lib/gromox/domain/1/exmdb/
	(echo "PRAGMA foreign_keys=0;"; sqlite3 exchange.sqlite3 ".recover") | sqlite3 new.db
	chmod u=rw,g=rw new.db
	chown grommunio:gromox new.db
	mv exchange.sqlite3 exchange.sqlite3.old
	mv new.db exchange.sqlite3
	systemctl restart gromox-http

We turn off foreign keys (FK) here temporarily because recovery can process
tables in an order that is not supported by FK constraints.

(There is also an alternate command for ``.recover``:)

.. code-block:: sh

	sqlite3 exchange.sqlite3 ".clone new.db"

The efficacy of the recover/clone commands depends on the brokenness level of
the database file. It will repair structural problems (as far as it is able to)
at the SQLite level, but the recovered data may still contain logical problems
as a whole, e.g. two users with the same ID.

Consult with grommunio Support. Keep backups.
