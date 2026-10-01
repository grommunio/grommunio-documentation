---
title: "ddbg(1gx)"
description: "ddbg — MAPI data debugger"
sidebar:
  order: 50
---

## Name

ddbg — MAPI data debugger

## Synopsis

<strong>/usr/libexec/gromox/ddbg</strong> \[options...\] command \[args...\]

## Description

ddbg can be used to analyze binary blobs, convert between data formats, or query various text/ID mappings commonly used in MAPI. If no arguments are given, input is read from stdin. If arguments are given, they are treated as immediate values (i.e. content, never the name of a file to read).

## Options

<dfn class="gx-param">-p</dfn>, <strong>--pack</strong>  
Employ hex2bin before main action.

<dfn class="gx-param">-X</dfn>  
When converting RTF to HTML, transform images not into \<img\> tags with in-line image data using a `data:` URI, but into external references utilizing a `cid:` URI. ddbg will not emit the image in this case.

## Commands

<dfn class="gx-param">--bin2hex</dfn>  
Convert all bytes to hexnibble representation.

<dfn class="gx-param">--bin2txt</dfn>  
Convert all bytes to a textual representation. The environment variable BIN2TXT_MODE can be used to influence the output. Possible values are <strong>cstr</strong> (output as a C string literal without surrounding quotes), <strong>hex</strong> (hex nibbles like bin2hex), <strong>txt</strong> (custom compact encoding).

<dfn class="gx-param">--cpidtocset</dfn>  
For a given character set identified by numeric IBM/Microsoft codepage identifier, show the corresponding IANA name.

<dfn class="gx-param">--csettocpid</dfn>  
For a given character set identified by its IANA name, show the corresponding numeric IBM/Microsoft codepage identifer.

<dfn class="gx-param">-d</dfn>, <strong>--decode</strong>  
Try all decoders.

<dfn class="gx-param">-A</dfn>, <strong>--decode-action</strong>  
Decode rule action blob.

<dfn class="gx-param">-e</dfn>, <strong>--decode-entryid</strong>  
Decode entryid.

<dfn class="gx-param">--decode-guid</dfn>  
Lookup GUID.

<dfn class="gx-param">--decode-nttime</dfn>  
Decode an NT timestamp and show the equivalent Unix time and calendar-based date.

<dfn class="gx-param">--decode-restrict</dfn>  
Decode restriction blob (e.g. rule condition).

<dfn class="gx-param">--decode-unixtime</dfn>  
Decode an Unix timestamp and show the equivalent NT time and calendar-based date.

<dfn class="gx-param">--exttomime</dfn>  
For a given filename extension (e.g. "bmp"), show the most likely MIME type (IANA Media Type) that it represents.

<dfn class="gx-param">--htmltortf</dfn>  
Convert a HTML document to RTF.

<dfn class="gx-param">--htmltotext</dfn>  
Convert a HTML document to plaintext.

<dfn class="gx-param">--langtocset</dfn>  
Show the preferred 8-bit character set associated with a given language tag (identifier in the style of XPG4 locales, but only a few well-known fixed strings are accepted, e.g. "zh_TW").

<dfn class="gx-param">--langtolcid</dfn>  
For a given language tag (RFC 5646 form, e.g. "en-US"), show the corresponding numeric Windows locale identifier (LCID).

<dfn class="gx-param">--lcidtolang</dfn>  
For a given numeric Windows locale identifier, show the corresponding langauge tag.

<dfn class="gx-param">--mdigest</dfn>  
Produce an MJSON digest object for a RFC5322 message.

<dfn class="gx-param">--mimetoext</dfn>  
For a given MIME type (IANA Media Type), show the typical filename extension used for it.

<dfn class="gx-param">--lzxdec</dfn>  
Uncompress an lzxpress data stream.

<dfn class="gx-param">--lzxenc</dfn>  
Compress data stream with lzxpress.

<dfn class="gx-param">--qpdecode</dfn>  
Decode some Quoted-Printable text.

<dfn class="gx-param">--qpencode</dfn>  
Encode some text as Quoted-Printable (with line wrapping).

<dfn class="gx-param">--rtfcp</dfn>  
Convert RTF to the RTFCP format, particularly the uncompressed "MELA" subformat.

<dfn class="gx-param">--rtftohtml</dfn>  
Convert RTF to HTML.

<dfn class="gx-param">--texttohtml</dfn>  
Convert plaintext to HTML.

<dfn class="gx-param">--unrtfcp</dfn>  
Decompress RTFCP (either "MELA" or "LZFU") to RTF.

## Environment variables

GROMOX_HTMLTOPLAIN can be set to "chawan", "pandoc", "w3m", "internal" to pick one particular htmltoplain implementation. If unset or set to "auto", all of these converters are tried until a working one is found.

GROMOX_HTMLTORTF can be set to "pandoc" or "internal" to pick a particular htmltortf implementation. If unset or set to "auto", all of these converters are tried until a working one is found.

GROMOX_RTFTOHTML can be set to "pandoc", "internal" or "internal.asi" to pick a particular htmltortf implementation. If unset or set to "auto", all of these converters are tried until a working one is found.

## Examples

- ddbg -p --decode-guid 38a1bb1005e5101aa1bb08002b2a56c2

- ddbg --unrtfcp \<body.bin \>body.rtf

- ddbg --proptag 0x3001001f

- ddbg --exttomime bmp

## See also

<strong>gromox</strong>(7)
