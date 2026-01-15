#!/bin/bash

if [ -d .aapi ]; then
	pushd .aapi
	git clean -dfx
	git remote update -p
	git checkout origin/HEAD
	popd
else
	git clone --depth=2 https://github.com/grommunio/admin-api.git .aapi
fi
if [ -d .gromox ]; then
	pushd .gromox
	git reset --hard
	git clean -dfx
	git remote update -p
	git checkout origin/HEAD
	popd
else
	git clone --depth=1 https://github.com/grommunio/gromox.git .gromox
fi

for i in *.rst; do
	if [ "$i" = "index.rst" ] || [ "$i" = "legal_notice.rst" ]; then
		continue
	fi
	rm -fv "$i"
done
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
