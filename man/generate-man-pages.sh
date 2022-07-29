#!/bin/bash

if [ -d "/tmp/gromox" ]; then
	rm -rf /tmp/gromox
fi
mkdir -p /tmp/gromox
if [ -d "/tmp/admin-api" ]; then
	rm -rf /tmp/admin-api
fi
mkdir -p /tmp/admin-api

git clone --depth=2 https://github.com/grommunio/admin-api.git /tmp/admin-api
git clone --depth=1 https://github.com/grommunio/gromox.git /tmp/gromox
pushd /tmp/gromox/doc
	rm -f *.rst
	for i in *.[0-9]*; do
	       pandoc -s -f man -t rst -o "$i.rst" "$i";
	done
popd

rm -f gromox.7.rst gromox-pffimport.8.rst *gx*.rst

mv /tmp/gromox/doc/*.rst .
sed -i 's#(1)##g' /tmp/admin-api/doc/rst/*.rst
mv /tmp/admin-api/doc/rst/*.rst .
