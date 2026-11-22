#!/bin/sh
# vim:sw=4:ts=4:et

set -e

entrypoint_log() {
    if [ -z "${NGINX_ENTRYPOINT_QUIET_LOGS:-}" ]; then
        echo "$@"
    fi
}
touch /etc/nginx/conf.d/http.inc
touch /etc/nginx/conf.d/ssl.inc
ME=$(basename "$0")
if [ "z_$NGINX_PORT" = "z_" ] && [ "z_$NGINX_PORTS" = "z_" ];then
  entrypoint_log "$ME: info: No port provided using default"
  sed 's/${NGINX_PORT}/8080/' /tmp/http.inc.template > /etc/nginx/templates/http.inc.template
  cat /etc/nginx/templates/http.inc.template
fi

entrypoint_log "$ME: info: Check http settings: port=${NGINX_PORT}"

if [ "z_$NGINX_PORT" != "z_" ]; then
  entrypoint_log "$ME: info: Moving http.inc.template"
  cp /tmp/http.inc.template /etc/nginx/templates/http.inc.template
fi
entrypoint_log "$ME: info: Check ssl settings: port=${NGINX_PORTS}"
if [ "z_$NGINX_PORTS" != "z_" ]; then
  entrypoint_log "$ME: info: Moving ssl.inc.template"
  cp /tmp/ssl.inc.template /etc/nginx/templates/ssl.inc.template
  SSL_KEY_FILE=$(ls /cert/*-key.pem | head -n 1)
  SSL_CERT_FILE=$(ls /cert/*.pem | grep -v -- '-key\.pem$' | head -n 1)
  entrypoint_log "$ME: info: Found key: $SSL_KEY_FILE, linking it"
  cp ${SSL_KEY_FILE} /var/run/ssl/key.pem
  chmod 600 /var/run/ssl/key.pem
  entrypoint_log "$ME: info: Found cert: $SSL_CERT_FILE"
  cp ${SSL_CERT_FILE} /var/run/ssl/cert.pem
  chmod 644 /var/run/ssl/cert.pem
fi

exit 0
