#!/bin/bash

if [ -d .aapi ]; then
	pushd .aapi
	git remote update -p
	git checkout origin/HEAD
	popd
else
	git clone --depth=2 https://github.com/grommunio/admin-api.git .aapi
fi
if [ -d .gromox ]; then
	pushd .gromox
	git remote update -p
	git checkout origin/HEAD
	popd
else
	git clone --depth=1 https://github.com/grommunio/gromox.git .gromox
fi

rm -f gromox.7.rst *gx*.rst gromox-*.rst grommunio-admin-*.rst
pushd .gromox/doc/
	for i in *.[0-9]*; do
	       pandoc -s -f man -t rst -o "$OLDPWD/$i.rst" "$i";
	done
popd

pushd .aapi/doc/rst/
	for i in *.rst; do
		echo "$i -> $OLDPWD/$i"
		sed -e 's#(1)##g' <"$i" >"$OLDPWD/$i"
	done
popd
