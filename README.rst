..
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2024 grommunio GmbH

Notes regarding generating documentation

- The deploy script is the main script to generate and create HTML, EPUB and PDF files.
- The script is intended to run directly on the documentation web server.

This repository can be cloned and run locally if wanted. Yet, there are some dependencies:

- make
- rsync
- python3-Sphinx
- python3-Sphinx-latex
- texlive-fira
- texlive-inconsolata
- texlive-wallpaper
- pandoc

Additionally, for API documentation, redoc is used, which is not available with openSUSE per default.
A simple `pip install sphinxcontrib-redoc` installs redoc for build with documentation.

Note: The meta.txt file is included with the deploy script and is a unique meta file which is included in all pages to update all individual pages with the meta tags. Unfortunately, the RST/Sphinx Attribute "include" does not work, which made this workaround necessary. To not pollute the working copy, all changes created in the temporary build process are reverted back again, effectively leading back to the original unmodified RST files.

Handling the rtd theme under SUSE is a bit of an adventure, since the shipped version is quite outdated and the theme depends on the python3-Sphinx version, which is why the following workaround works:

.. code-block:: text

	# rpm -e python3-sphinx_rtd_theme
	error: Failed dependencies:
		python3-sphinx_rtd_theme is needed by (installed) python3-Sphinx-1.7.6-lp152.5.3.1.noarch

	# pip install sphinx-rtd-theme
	Requirement already satisfied: sphinx-rtd-theme in /usr/lib/python3.6/site-packages (0.2.4)
	pygobject 3.34.0 requires pycairo>=1.11.1, which is not installed.
	You are using pip version 10.0.1, however version 20.3.3 is available.
	You should consider upgrading via the 'pip install --upgrade pip' command.
	# pip install --upgrade pip
	...
	# pip uninstall sphinx-rtd-theme
	Found existing installation: sphinx-rtd-theme 0.2.4
	Uninstalling sphinx-rtd-theme-0.2.4:
	  Would remove:
	    /usr/lib/python3.6/site-packages/sphinx_rtd_theme
	    /usr/lib/python3.6/site-packages/sphinx_rtd_theme-0.2.4-py3.6.egg-info
	Proceed (y/n)? y
	  Successfully uninstalled sphinx-rtd-theme-0.2.4
	# pip install sphinx-rtd-theme
	...
	Successfully installed sphinx-rtd-theme-0.5.1

The man pages' sub-documentation checks out the current (mirrored) Gromox project from github.com and builds all man pages with pandoc. To integrate this into the build process, the deploy script automatically triggers `generate-man-pages.sh`, and `index.rst` picks up all generated rst files thanks to a TOC glob filter. Gromox is placed intentionally at the front.
