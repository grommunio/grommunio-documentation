..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later


SQLite Recovery
===============

gromox-dbop and gromox-http may refuse a database schema upgrade when
a consistency check is negative:

.. code-block:: text

	http[2557]: Upgrade of /var/lib/gromox/domain/1/exmdb/exchange.sqlite3 not started because of 6 integrity problems
	http[2557]: dbop_sqlite upgrade /var/lib/gromox/domain/1/exmdb/exchange.sqlite3: Input/output error

A few details may be obtained by rerunning the same integrity check in a
sqlite3 command line:

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
	sqlite3 exchange.sqlite3 .recover >recover.sql
	mv exchange.sqlite3 exchange.sqlite3.old
	sqlite3 exchange.sqlite3 <recover.sql
	chmod u=rw,g=rw exchange.sqlite3
	chown grommunio:gromox exchange.sqlite3
	systemctl restart gromox-http
