#!/bin/bash

rm -Rf .aapi .gromox
git clone --depth=2 https://github.com/grommunio/admin-api.git .aapi
git clone --depth=1 https://github.com/grommunio/gromox.git .gromox
pushd .gromox/doc/
	rm -f *.rst
	for i in *.[0-9]*; do
	       pandoc -s -f man -t rst -o "$i.rst" "$i";
	done
popd

rm -f gromox.7.rst gromox-pffimport.8.rst *gx*.rst grommunio-admin-*.rst
mv .gromox/doc/*.rst .
sed -i 's#(1)##g' .aapi/doc/rst/*.rst
mv .aapi/doc/rst/*.rst .
