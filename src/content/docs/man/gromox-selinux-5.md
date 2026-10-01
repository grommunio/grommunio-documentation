---
title: "gromox-selinux(5)"
description: "gromox_selinux - Security Enhanced Linux Policy for the gromox processes"
sidebar:
  order: 50
---

## NAME

gromox_selinux - Security Enhanced Linux Policy for the gromox processes

## DESCRIPTION

Security-Enhanced Linux secures the gromox processes via flexible mandatory access control.

The gromox processes execute with the gromox_t SELinux type. You can check if you have these processes running by executing the <strong>ps</strong> command with the <strong>-Z</strong> qualifier.

For example:

<dfn class="gx-param">ps -eZ \| grep gromox_t</dfn>

## ENTRYPOINTS

The gromox_t SELinux type can be entered via the <strong>gromox_exec_t</strong> file type.

The default entrypoint paths for the gromox_t domain are the following:

/usr/libexec/gromox(/.\*)?

## PROCESS TYPES

SELinux defines process types (domains) for each process running on the system

You can see the context of a process using the <strong>-Z</strong> option to <strong>ps</strong>.

Policy governs the access confined processes have to files. SELinux gromox policy is very flexible allowing users to setup their gromox processes in as secure a method as possible.

The following process types are defined for gromox:

    gromox_t

Note: <strong>semanage permissive -a gromox_t</strong> can be used to make the process type gromox_t permissive. SELinux does not deny access to permissive process types, but the AVC (SELinux denials) messages are still generated.

## BOOLEANS

SELinux policy is customizable based on least access required. gromox policy is extremely flexible and has several booleans that allow you to manipulate the policy and run gromox with the tightest access possible.

If you want to dontaudit all daemons scheduling requests (setsched, sys_nice), you must turn on the daemons_dontaudit_scheduling boolean. Enabled by default.

    setsebool -P daemons_dontaudit_scheduling 1

If you want to allow all domains to execute in fips_mode, you must turn on the fips_mode boolean. Enabled by default.

    setsebool -P fips_mode 1

## MANAGED FILES

The SELinux process type gromox_t can manage files labeled with the following file types. The paths listed are the default paths for these file types. Note the processes UID still need to have DAC permissions.

\
<dfn class="gx-param">cluster_conf_t</dfn>

/etc/cluster(/.\*)?\

\
<dfn class="gx-param">cluster_var_lib_t</dfn>

/var/lib/pcsd(/.\*)?\
/var/lib/cluster(/.\*)?\
/var/lib/openais(/.\*)?\
/var/lib/pengine(/.\*)?\
/var/lib/corosync(/.\*)?\
/usr/lib/heartbeat(/.\*)?\
/var/lib/heartbeat(/.\*)?\
/var/lib/pacemaker(/.\*)?\

\
<dfn class="gx-param">cluster_var_run_t</dfn>

/var/run/crm(/.\*)?\
/var/run/cman\_.\*\
/var/run/rsctmp(/.\*)?\
/var/run/aisexec.\*\
/var/run/heartbeat(/.\*)?\
/var/run/pcsd-ruby.socket\
/var/run/corosync-qnetd(/.\*)?\
/var/run/corosync-qdevice(/.\*)?\
/var/run/corosync.pid\
/var/run/cpglockd.pid\
/var/run/rgmanager.pid\
/var/run/cluster/rgmanager.sk\

\
<dfn class="gx-param">gromox_log_t</dfn>

/var/log/gromox(/.\*)?\

\
<dfn class="gx-param">gromox_var_lib_t</dfn>

/var/lib/gromox(/.\*)?\

\
<dfn class="gx-param">gromox_var_run_t</dfn>

/var/run/gromox(/.\*)?\

\
<dfn class="gx-param">root_t</dfn>

/sysroot/ostree/deploy/.\*-atomic/deploy(/.\*)?\
/\
/initrd\

## FILE CONTEXTS

SELinux requires files to have an extended attribute to define the file type.

You can see the context of a file using the <strong>-Z</strong> option to <strong>ls</strong>.

Policy governs the access confined processes have to these files. SELinux gromox policy is very flexible allowing users to setup their gromox processes in as secure a method as possible.

<dfn class="gx-param">STANDARD FILE CONTEXT</dfn>

SELinux defines the file context types for the gromox, if you wanted to store files with these types in a different paths, you need to execute the semanage command to specify alternate labeling and then use restorecon to put the labels on disk.

<strong>semanage fcontext -a -t gromox_var_run_t '/srv/mygromox_content(/.\*)?'</strong>\
<dfn class="gx-param">restorecon -R -v /srv/mygromox_content</dfn>

Note: SELinux often uses regular expressions to specify labels that match multiple files.

<em>The following file types are defined for gromox:</em>

    gromox_exec_t

\- Set files with the gromox_exec_t type, if you want to transition an executable to the gromox_t domain.

    gromox_log_t

\- Set files with the gromox_log_t type, if you want to treat the data as gromox log data, usually stored under the /var/log directory.

    gromox_var_lib_t

\- Set files with the gromox_var_lib_t type, if you want to store the gromox files under the /var/lib directory.

    gromox_var_run_t

\- Set files with the gromox_var_run_t type, if you want to store the gromox files under the /run or /var/run directory.

Note: File context can be temporarily modified with the chcon command. If you want to permanently change the file context you need to use the <strong>semanage fcontext</strong> command. This will modify the SELinux labeling database. You will need to use <strong>restorecon</strong> to apply the labels.

## COMMANDS

<strong>semanage fcontext</strong> can also be used to manipulate default file context mappings.

<strong>semanage permissive</strong> can also be used to manipulate whether or not a process type is permissive.

<strong>semanage module</strong> can also be used to enable/disable/install/remove policy modules.

<strong>semanage boolean</strong> can also be used to manipulate the booleans

<strong>system-config-selinux</strong> is a GUI tool available to customize SELinux policy settings.

## AUTHOR

This manual page was auto-generated using <strong>sepolicy manpage .</strong>

## SEE ALSO

selinux(8), gromox(8), semanage(8), restorecon(8), chcon(1), sepolicy(8), setsebool(8)
