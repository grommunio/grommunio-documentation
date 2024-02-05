..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later

Memory usage
============

.. code-block:: text

	$ ps auwwx | grep gromox
	USER       PID %CPU %MEM     VSZ     RSS COMMAND
	gromox    2273  0.0  0.1  226612   68804 /usr/libexec/gromox/delivery-queue
	gromox    2274  0.0  0.0  753708   46168 /usr/libexec/gromox/pop3
	gromox    2275  0.0  0.0 4294568   10652 /usr/libexec/gromox/timer
	gromox    2329  0.0  0.3 2757436  239096 /usr/libexec/gromox/midb
	gromox    2551  0.0  1.7 2476752 1123772 /usr/libexec/gromox/imap
	gromox    2575  0.0  0.0 4425996   14016 /usr/libexec/gromox/event
	gromox    2744  0.0  0.0  134888   12348 php-fpm: pool gromox
	gromox    3017 53.5  2.3 6187236 1570196 /usr/libexec/gromox/http
	gromox    3170  3.0  0.7 2169468  525840 /usr/libexec/gromox/zcore
	gromox    3191  0.0  0.1  701932   97788 /usr/libexec/gromox/delivery

glibc's malloc has a peculiar reservation strategy. The first call to malloc()
inside any given thread allocates a large virtual memory block (`128 MB
<https://github.com/bminor/glibc/blob/master/malloc/arena.c#L414>`_ on x86_64)
to serve as a default heap for that thread. The higher the thread count, the
higher the VSS/VSZ number.

In addition, because the heap is never really returned to the operating system
under normal operation, if each thread (even in the best case scenario of
serial execution) gets to work on sufficiently big datasets, all the individual
heaps eventually get touched. On systems with memory overcommit enabled, the
RSS number rises as memory is first touched; when overcommit is disabled, RSS
will be accounted upfront on memory block allocation.

This wastefulness has been observed previously by other parties, e.g.

* https://sourceware.org/bugzilla/show_bug.cgi?id=11261
* https://bugs.openjdk.org/browse/JDK-8193521
* https://github.com/JuliaLang/julia/issues/42566

Switching Gromox to jemalloc or tcmalloc did not show any notable reduction so
far. If you like to experiment, you can do so by starting one or more Gromox
services with the environment variables
``LD_PRELOAD=/usr/lib64/libjemalloc.so.2`` or
``LD_PRELOAD=/usr/lib64/libtcmalloc.so.4`` set to make use of these alternate
allocators. (On the grommunio Appliance, you need to install the
``libjemalloc2`` and/or ``libtcmalloc4`` packages first.)

.. code-block:: text

	# systemctl edit gromox-http

	-- add to edit field --

	[Service]
	Environment=LD_PRELOAD=/usr/lib64/libjemalloc.so.2
