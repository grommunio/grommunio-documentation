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
	$(SPHINXBUILD) -M $@ $(DOCDIR) $(BUILDDIR) $(SPHINXOPTS) $(O)
