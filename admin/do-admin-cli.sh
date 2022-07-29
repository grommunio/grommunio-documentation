#!/bin/bash

if [ -d "/tmp/admin-api" ]; then
	rm -rf /tmp/admin-api
fi
mkdir -p /tmp/admin-api

git clone --depth=2 https://github.com/grommunio/admin-api.git /tmp/admin-api

cat /tmp/admin-api/doc/rst/grommunio-admin.rst /tmp/admin-api/doc/rst/grommunio-admin-*.rst /tmp/admin-api/doc/rst/grommunio-dbconf.rst

if [ -e "admin-api.rst" ]; then
	rm -f admin-api.rst
fi

for rst in /tmp/admin-api/doc/rst/grommunio-admin-*.rst /tmp/admin-api/doc/rst/grommunio-dbconf.rst; do
	sed -i '1s/.*//' $rst
	(
	sed '3!b;s/=/\&/g' $rst | sed 's#(1)##' |
	perl -lpe 's{^-{3,}}{"^" x length($&)}e' |
	perl -lpe 's{^={3,}}{"~" x length($&)}e' |
	perl -lpe 's{^&{3,}}{"-" x length($&)}e' | sed '/^See Also$/,$d'
	) >>admin-api.rst
done

