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
folders="manifests configs assets"

#check if short version existed
if [ -z "${VERSION}" ]; then
    entrypoint_log "$ME: warn: Could not find plugin version!"
    exit 0
fi

for folder in ${folders}; do
    if [ ! -d "/data/${folder}" ]; then
        entrypoint_log "$ME: info: Folder not found, $folder."
        continue
    fi
    entrypoint_log "$ME: info: Try to merge /data/$folder into /usr/share/nginx/html/$folder/$VERSION."
    case $folder in
        manifests)
            cp -r /data/manifests/* /usr/share/nginx/html/manifests/${VERSION}
            ;;
        assets)
            cp -r /data/assets/* /usr/share/nginx/html/plugin/${VERSION}/assets
            ;;
        configs)
            cp -r /data/configs/* /usr/share/nginx/html/configs
            ;;
        *)
            entrypoint_log "$ME: warn: Unknown folder, /data/$folder, continues."
            ;;
    esac
    entrypoint_log "$ME: info: Merge of /data/$folder into /usr/share/nginx/html/$folder/$VERSION completed."
done

entrypoint_log "$ME: info: Merging data folder completed succesfully."

exit 0
