..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2023 grommunio GmbH

PHP Environment Notes
=====================

calendar
--------

The ``calendar`` extension (php-calendar) defines ``CAL_GREGORIAN`` for the the
PHP environment, which clashes with equally-named defines in our
*mapi-php-header* package.

php-calender even eschews Windows's own definitions.

.. code-block:: c

   #ifdef PHP_WIN32
   /* This conflicts with a define in winnls.h, but that header is needed
      to have GetACP(). */
   #undef CAL_GREGORIAN
   #endif


opcache
-------

The ``opcache`` extension is incompatible with the PHP JIT in at least php
8.0.25 and causes a vital function to mis-execute. The php-opcache extension
should be deinstalled.

Details:

``zend_compile.c`` treats the ``is_resource(...)`` function call specially and
resolves it here:

.. code-block:: c

   } else if (zend_string_equals_literal(lcname, "is_resource")) {
           return zend_compile_func_typecheck(result, args, IS_RESOURCE);

In conjunction with php-opcache, the logic inside the
``zend_compile_func_typecheck`` C function causes ``is_resource($x)`` in PHP to
spuriously return false.

We can comment out these two lines, at which point ``is_resource`` will not be
JIT-ed, and instead be evaluated by:

.. code-block:: c

    PHP_FUNCTION(is_resource)
    {
            php_is_type(INTERNAL_FUNCTION_PARAM_PASSTHRU, IS_RESOURCE);
    }

We conclude that PHP's JIT logic and php-opcache are incompatible with each
other.
