..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2025 grommunio GmbH

PHP Environment
===============

opcache
-------

The ``opcache`` extension mis-executes the ZEND_TYPE_CHECK opcode in at least
PHP 8.0.25 and causes a vital PHP expression, ``is_resource($x)``, to curiously
yield ``false`` even when ``$x`` is a valid resource. The issue occurs in the
same spot in grommunio-web, and is reliably reproducible, but we do not know
_why_ exactly. g-web is a big program and attempts to replicate the problem
with a smaller program have been unsuccessful to date.

mapi.so checks whether opcache.so is loaded and refuses operation if this is
the case. (This is in lieu of blocking opcache at the distribution packaging
level from being installed, which sometimes is too much since FPM, CLI and SAPI
can have different INI settings.)

Details:

We find that the Zend engine treats the PHP ``is_resource(...)`` function call
specially (`[1]
<https://github.com/php/php-src/blob/master/Zend/zend_compile.c#L4497>_`):

.. code-block:: c

	} else if (zend_string_equals_literal(lcname, "is_resource")) {
		return zend_compile_func_typecheck(result, args, IS_RESOURCE);

and that Zend compiles it to a ``ZEND_TYPE_CHECK`` opcode with extended_value
being ``(1 << IS_RESOURCE)`` (`[2]
<https://github.com/php/php-src/blob/master/Zend/zend_compile.c#L3945..L3950>`_).

.. code-block:: c

	opline = zend_emit_op_tmp(result, ZEND_TYPE_CHECK, &arg_node, NULL);
	if (type != _IS_BOOL) {
		opline->extended_value = (1 << type);
	} else {
		opline->extended_value = (1 << IS_FALSE) | (1 << IS_TRUE);
	}

When the two lines shown in the first block are removed, the
``is_resource($x)`` expression would instead be compiled to a
``ZEND_INIT_FCALL`` opcode (`[3]
<https://github.com/php/php-src/blob/master/Zend/zend_compile.c#L4612>`_)
and execution would eventually land in the C function corresponding to
``is_resource`` (`[4]
<https://github.com/php/php-src/blob/php-8.0.25/ext/standard/type.c#L240..L276>`_).

.. code-block:: c

	static inline void php_is_type(INTERNAL_FUNCTION_PARAMETERS, int type)
	{
		if (Z_TYPE_P(arg) == type) {
		...

Summarizing our observations:

* Unmodified Zend VM, php-opcache disabled, ``is_resource`` becomes
  ``ZEND_TYPE_CHECK``: good
* Unmodified Zend VM, php-opcache enabled, ``is_resource`` becomes
  ``ZEND_TYPE_CHECK``: bad
* Modified Zend VM, php-opcache enabled, ``is_resource`` becomes
  ``ZEND_INIT_FCALL``: good
* We conclude that php-opcache induces a problem with respect to the
  ``ZEND_TYPE_CHECK`` opcode.

There is a... peculiar comment in php-opcache (``MAY_BE_RESOURCE`` is the same
as ``1 << IS_RESOURCE``) (`[5]
<https://github.com/php/php-src/blob/master/ext/opcache/jit/zend_jit.c#L3515>`_)
that could(?) be relevant:

.. code-block:: c

	case ZEND_TYPE_CHECK:
		if (opline->extended_value == MAY_BE_RESOURCE) {
			// TODO: support for is_resource() ???
			break;
		}
