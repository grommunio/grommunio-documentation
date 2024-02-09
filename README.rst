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
- python3-setuptools
- python3-sphinx_rtd_theme
- texlive-ellipse
- texlive-fira
- texlive-inconsolata
- texlive-pdfpages
- texlive-pict2e
- texlive-wallpaper
- pandoc

Additionally, for API documentation, redoc is used, which is not available with openSUSE per default.
A simple `pip install sphinxcontrib-redoc` installs redoc for build with documentation.

Note: The meta.txt file is included with the deploy script and is a unique meta file which is included in all pages to update all individual pages with the meta tags. Unfortunately, the RST/Sphinx Attribute "include" does not work, which made this workaround necessary. To not pollute the working copy, all changes created in the temporary build process are reverted back again, effectively leading back to the original unmodified RST files.

The man pages' sub-documentation checks out the current (mirrored) Gromox project from github.com and builds all man pages with pandoc. To integrate this into the build process, the deploy script automatically triggers `generate-man-pages.sh`, and `index.rst` picks up all generated rst files thanks to a TOC glob filter. Gromox is placed intentionally at the front.
