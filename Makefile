SPHINXOPTS    =
SPHINXBUILD   = sphinx-build
#SPHINXPROJ    = GrammmDocumentation

# Default target so it is run when `make is executed without arguments
help:
	${SPHINXBUILD} -M help . .

.PHONY: help Makefile

# Catch-all target: route all unknown targets to Sphinx using the new
# "make mode" option.  $(O) is meant as a shortcut for $(SPHINXOPTS).
%: Makefile
	$(SPHINXBUILD) -M $@ $(DOCDIR) $(BUILDDIR) $(SPHINXOPTS) $(O)
