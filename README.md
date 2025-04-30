# Welcome to the grommunio Documentation


<!--
        SPDX-License-Identifier: CC-BY-SA-4.0 or-later
        SPDX-FileCopyrightText: 2025 grommunio GmbH
-->

![image info](./doc-about-docs/images/grommunio_logo_default_media.png)

Table of Contents
=================

   * [Preparing for Local Generation](#preparing-for-local-generation)
   * [API Documentation](#api-documentation)
   * [Scripts for Deploying the Documentation](#scripts-for-deploying-the-documentation)
   * [man Pages](#man-pages)

## Preparing for Local Generation

Follow the [Prepare the Documentation Environment](./doc-about-docs/prepare-docs-env.md) guide to prepare your environment.

## API Documentation

Note that redoc is used for the API documentation. The preparation steps described above will ensure that everything is installed correctly.

## Scripts for Deploying the Documentation

- The deploy script is the main script for generating and building HTML, EPUB and PDF files.
- The script is designed to run directly on the documentation web server.

Note: The `meta.txt` file is included in the deploy script and is a unique meta file that is included in all pages to update all individual pages with the meta tags. Unfortunately, the RST/Sphinx include attribute does not work, which necessitated this workaround. To avoid contaminating the working copy, any changes made in the temporary build process are reverted, effectively reverting to the original unmodified RST files.

## man Pages

The manpages subdocumentation checks out the current (mirrored) Gromox project from github.com and builds all manpages with pandoc. To integrate this into the build process, the deploy script automatically triggers `generate-man-pages.sh` and `index.rst` picks up all generated rst files thanks to a TOC glob filter. Gromox is intentionally placed on top.
