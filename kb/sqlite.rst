..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later


SQLite Recovery
===============

gromox-dbop and gromox-http may refuse a database schema upgrade when a
consistency check is negative. Problems may also be reported if and when SQLite
detects such during normal operation:

.. code-block:: text

	http[2557]: Upgrade of /var/lib/gromox/domain/1/exmdb/exchange.sqlite3 not started because of 6 integrity problems
	http[2557]: dbop_sqlite upgrade /var/lib/gromox/domain/1/exmdb/exchange.sqlite3: Input/output error

.. code-block:: text

	[2023-08-30 12:34:20.626175]: dbop_sqlite: /var/lib/gromox/user/1/0/exmdb/exchange.sqlite3: current schema EV-11; upgrading to EV-12.
	[2023-08-30 12:34:21.037629]: *** in database main ***
	Tree 33990 page 33990 cell 260: invalid page number 4053928964
	Tree 33990 page 33990 cell 259: invalid page number 4050783236
	Tree 33990 page 33990 cell 255: invalid page number 333502732
	Multiple uses for byte 1240 of page 33990
	[2023-08-30 12:34:24.009145]: sqlite3_step(/var/lib/gromox/user/1/0/exmdb/exchange.sqlite3) "PRAGMA integrity_check": database disk image is malformed

A few details may be obtained by rerunning the integrity checker in a sqlite3
command line:

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

When (just) indices are broken, the file may be recreated:

.. code-block:: sh

	cd /var/lib/gromox/domain/1/exmdb/
	sqlite3 exchange.sqlite3 ".recover" | sqlite3 new.db
	chmod u=rw,g=rw new.db
	chown grommunio:gromox new.db
	mv exchange.sqlite3 exchange.sqlite3.old
	mv new.db exchange.sqlite3
	systemctl restart gromox-http

(There is also an alternate command for ``.recover``:)

.. code-block:: sh

	sqlite3 exchange.sqlite3 ".clone new.db"

The efficacy of the recover/clone commands depends on the brokenness level of
the database file. It will repair structural problems (as far as it is able to)
at the SQLite level, but the recovered data may still contain logical problems
as a whole, e.g. two users with the same ID.

By default, foreign key constraints are by turned off for the sqlite
command-line interface. *Do* check what the config setting is, as the
command-line user may have changed it via ``~/.sqlitrc``. If FK is enabled,
recovery could fail if the source data set is logically broken. If FK is
disabled, recovery could succeed even though the result in ``new.db`` still is
not consistent with the expectations of the Gromox data model.

Consult with grommunio Support. Keep backups.
