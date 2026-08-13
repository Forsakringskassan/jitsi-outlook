#!/bin/sh
# vim:sw=4:ts=4:et

set -e

entrypoint_log() {
    if [ -z "${NGINX_ENTRYPOINT_QUIET_LOGS:-}" ]; then
        echo "$@"
    fi
}

ME=$(basename "$0")
VERSION=`if [ ! -d /usr/share/nginx/html/plugin/ ];then echo ""; else ls /usr/share/nginx/html/plugin/; fi`

#check if short version existed
if [ -z "${VERSION}" ]; then
    entrypoint_log "$ME: warn: Could not find plugin version!"
    exit 0
fi

if echo "$VERSION" | grep -Eq '^v[0-9]+\.[0-9]+\.[0-9]+$'; then
    #create links
    ln -s /usr/share/nginx/html/plugin/${VERSION} /usr/share/nginx/html/plugin/${VERSION%%.*}\
    && ln -s /usr/share/nginx/html/configs/${VERSION} /usr/share/nginx/html/configs/${VERSION%%.*} \
    && ln -s /usr/share/nginx/html/manifests/${VERSION} /usr/share/nginx/html/manifests/${VERSION%%.*}
    
    entrypoint_log "$ME: info: Created short links for version: $VERSION"
else
    entrypoint_log "$ME: warn: Version didn't follow pattern vX.X.X, no short links created"
fi
exit 0