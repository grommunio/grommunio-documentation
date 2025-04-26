# Prepare the Documentation Environment

To prepare your environment to build documentation locally, you need to take a few steps.

Note that these steps only need to be performed once.

Table of Contents
=================

   * [Common Usage](#common-usage)
   * [Fork the Documentation Repository](#fork-the-documentation-repository)
   * [Required Software](#required-software)
   * [Install Required Software](#install-required-software)
      * [make and rsync](#make-and-rsync)
      * [Python](#python)
         * [Prepare a Python Virtual Environment](#prepare-a-python-virtual-environment)
         * [Create a Python Virtual Environment](#create-a-python-virtual-environment)
         * [Activate the Virtual Environment](#activate-the-virtual-environment)
         * [Deativate the Virtual Environment](#deativate-the-virtual-environment)
         * [Check if PIP Needs an Update](#check-if-pip-needs-an-update)
         * [Install Required Python Libraries](#install-required-python-libraries)
      * [Install pandoc](#install-pandoc)
      * [Install tex-live](#install-tex-live)
         * [Install Required tex-live Packages](#install-required-tex-live-packages)
   * [Final](#final)

## Common Usage

All commands shown are executed in a bash shell and are based on an Ubuntu environment. They can be derived to other OS accordingly or use the referenced commands when appropriate from links. All commands can be copied and pasted as a normal user. If higher privileges are required, it is noted.
 
## Fork the Documentation Repository

grommunio does not allow you to write directly into this repository. You have to fork the grommunio documentation repository and create a local clone of it. Use the git commands or your default environment to clone this repo.

## Required Software

The following tools need to be prepared respectively installed:

* `make` and `rsync` need to be available
* A Python virtual environment with installed libraries
* The [pandoc](https://pandoc.org) converter (*)
* The [Tex Live](https://www.tug.org/texlive/) software tools with defined packeges (*)

\* ... Note that these software components are installed on the OS level.

## Install Required Software

### make and rsync

Type the appropriate commands to see if they are installed. If they are not present, follow the procedures provided by your operating system for installation.

### Python

Change to the root of the local clone of this repository and issue the following commands from there.

Note that *maintenance* of the Python venv follows standard procedures and is not described in detail here.

#### Prepare a Python Virtual Environment

Modern Python installations force users to install all their libraries in a virtual environment and not on a OS level. This step prepares for creating a Python venv.

First check which Python version you have installed:

```
python3 -V
```
The output may look similar to `Python 3.12.3`.

Use the Python version to install the venv requirements. Replace the version according the output. This command does no harm if the venv requirement is already installed:

```
sudo apt install python3.12-venv
```

#### Create a Python Virtual Environment

```
python3 -m venv ./grommunio-venv
```

Note that the venv name is `grommunio-venv`, which is intentional and makes it easier to identify the active venv. The name can be arbitrary.

#### Activate the Virtual Environment

For more details and other OS see: [Creation of virtual environments](https://docs.python.org/3/library/venv.html)

```
source grommunio-venv/bin/activate
```

#### Deativate the Virtual Environment

Deactivating a venv can be done from anywhere because only one venv can be active at a time.

```
deactivate
```

#### Check if PIP Needs an Update

```
pip list --outdated
```

If the list reports a possible update of pip, you can update it by issuing the following command:

```
pip install --upgrade pip
```

#### Install Required Python Libraries

<!--
# note that the sphinx package also provides: sphinx-latex
pip install sphinx sphinx-rtd-theme sphinxcontrib-redoc
pip install setuptools
# https://inventivehq.com/what-is-python-requirements-txt/
pip list --outdated
pip install -U -r requirements.txt

pip freeze > requirements.txt
-->

```
pip install -r requirements.txt
```

### Install pandoc

First, check to see if `pandoc` is already installed by running the following command:

```
pandoc -v
```

If `pandoc` is not installed, follow the procedure described in [Installing pandoc](https://pandoc.org/installing.html).

### Install tex-live

First, check to see if `tex-live` is already installed by running the following command:
```
latex
```

If `tex-live` is not installed, follow the procedure described in [TeX Live - Quick install](https://www.tug.org/texlive/quickinstall.html).

Note that the `tex-live` package for your operating system, especially on Linux, may be quite outdated and customized, and a newer version is available for your distribution at the above URL. We therefore recommend that you use the manual installation rather than the OS-packaged version.

**Important Notes**\
`tex-live` comes in flavors that differ greatly in their install size. The full install consumes +7GB, which includes all schemas and all available language files, while other versions consume only a fraction of that. Technically, only base is required. When using the package installer for your OS, use `texlive-full` for the full version and `texlive-base` for the base version. Do not get confused by the installation type names as they differ depending on whether you are using a package or a manual installation.

**To Facilitate Manual Installation on Linux**\
See the following commands that deviate from the original but install the small scheme (basic, xetex, metapost, a few languages) of `tex-live`:

```
cd /tmp
wget https://mirror.ctan.org/systems/texlive/tlnet/install-tl-unx.tar.gz
zcat < install-tl-unx.tar.gz | tar xf -
cd install-tl-*
sudo time perl ./install-tl --no-interaction --scheme=small
```

As described in the console log of the `tex-live` installation output, you must at least add the `tex-live` path to your PATH permanently. Note that if you want to run the commands as root instead of using sudo, you have to use `sudo su -` (the dash is important!) as first command and omit `sudo` in the commands. Otherwise, the env path will not be used by the root user. To facilitate manual installation on Linux:

```
whereis tlmgr
echo 'PATH=":$PATH:/usr/local/texlive/2025/bin/x86_64-linux"' | sudo tee /etc/profile.d/tex-live.sh
echo 'MANPATH="$MANPATH:/usr/local/texlive/2025/texmf-dist/doc/man"' | sudo tee -a /etc/profile.d/tex-live.sh
echo 'INFOPATH="$INFOPATH:/usr/local/texlive/2025/texmf-dist/doc/info"' | sudo tee -a /etc/profile.d/tex-live.sh
. /etc/profile.d/tex-live.sh
. ~/.bashrc
echo $PATH
whereis tlmgr
```

Note that the paths are now available on the *current* shell. Logging out and logging in again will make the path available on all new shells.

Note that using the small scheme, the installation took only a few hundred megabytes and about 120s on an avarage Ubuntu based notebook.

#### Install Required tex-live Packages

After installing `tex-live`, some additional tex packages need to be installed. For a complete list of available packages and a description, see:
[TeX Live documentation](https://www.tug.org/texlive/Contents/live/doc.html) and [Index of /texlive/Contents](https://www.tug.org/texlive/Contents/live/texmf-dist/tex/latex/).

The general command for installing packages is:

```
sudo -i tlmgr install <package-name> <package-name> ...
```

Use the following command to install required tex-live packages:

```
sudo -i tlmgr install ellipse fira inconsolata pdfpages pict2e wallpaper xurl
```

You can add a `--dry-run` after `install` to check upfront for possible problems.

## Final

All requirements are now satisfied and you can build the documentation locally.
