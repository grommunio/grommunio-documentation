..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2023 grommunio GmbH

Update Cycle
============

RH vs SUSE
----------

	“ *We do not want to update all that often, so we are
	choosing RHEL/CentOS/Alma/etc. [in favor of SLE]* ”

RHEL (and its derivatives) actually release a lot more service packs over time,
and the service packs' individual lifetime is also shorter:

=============  ==========  ================  ========
SP             Release     Last repo change  Lifetime
=============  ==========  ================  ========
AlmaLinux 8.4  2021-05-26  2021-11-22        181 days
AlmaLinux 8.5  2021-11-12  2022-09-28        320 days
AlmaLinux 8.6  2022-05-12  2022-11-03        176 days
AlmaLinux 9.0  2022-05-26  2022-11-03        162 days
=============  ==========  ================  ========

========     ==========  ==============  ========
SP           Release     End of Support  Lifetime
========     ==========  ==============  ========
SLE 15.1     2019-06-21  2021-01-31      591 days
SLE 15.2     2020-06-22  2021-12-31      558 days
SLE 15.3     2021-06-21  2022-12-31      559 days
========     ==========  ==============  ========

For admins with an aversion to periodic invocation of the updater, the update
cadence is in favor of a SUSE-based distribution.

.. meta::
   :description: grommunio Knowledge Database
   :keywords: grommunio Knowledge Database
   :author: grommunio GmbH
   :publisher: grommunio GmbH
   :copyright: grommunio GmbH, 2022
   :page-topic: software
   :page-type: documentation
   :robots: index, follow
