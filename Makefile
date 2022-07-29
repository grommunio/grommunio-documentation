SPHINXOPTS    =
SPHINXBUILD   = sphinx-build
#SPHINXPROJ    = GrammmDocumentation

# Default target so it is run when `make is executed without arguments
help:
	${SPHINXBUILD} -M help . .

.PHONY: help Makefile

# Catch-all target: route all unknown targets to Sphinx using the new
# "make mode" option.  $(O) is meant as a shortcut for $(SPHINXOPTS).
# (-M is not documented by sphinx-build's internal help; see external
# document https://www.sphinx-doc.org/en/master/man/sphinx-build.html )
%: Makefile
	@if test -z "${DOCDIR}"; then echo "You must specify the book to compile, e.g. make DOCDIR=admin"; exit 1; fi
	@if test -z "${BUILDDIR}"; then echo "You must specify an output dir, e.g. make BUILDDIR=xyz"; exit 1; fi
	${SPHINXBUILD} -M $@ "${DOCDIR}" "${BUILDDIR}" ${SPHINXOPTS} ${O}
