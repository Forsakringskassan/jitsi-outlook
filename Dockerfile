FROM nginx

ARG TAG=v1.0.0

COPY nginxconf/jitsi.conf.template /etc/nginx/templates/jitsi.conf.template
COPY dist/$TAG /usr/share/nginx/html/temp
COPY nginxconf/98-check-data.sh /docker-entrypoint.d/98-check-data.sh
COPY nginxconf/99-short-path-link.sh /docker-entrypoint.d/99-short-path-links.sh

RUN chmod +x /docker-entrypoint.d/99-short-path-links.sh \
    && chmod +x /docker-entrypoint.d/98-check-data.sh

RUN mkdir -p /usr/share/nginx/html/manifests/$TAG \
    && mkdir -p /usr/share/nginx/html/plugin/$TAG \
    && mkdir -p /usr/share/nginx/html/configs/$TAG \
    && mkdir -p /data

RUN mv /usr/share/nginx/html/temp/manifests/* /usr/share/nginx/html/manifests/$TAG/ \
    && mv /usr/share/nginx/html/temp/configs/$TAG/* /usr/share/nginx/html/configs/$TAG/ \
    && rm -r /usr/share/nginx/html/temp/manifests /usr/share/nginx/html/temp/configs/ \
    && mv /usr/share/nginx/html/temp/* /usr/share/nginx/html/plugin/$TAG/

RUN rm /etc/nginx/conf.d/default.conf /etc/nginx/nginx.conf \
    && chown -R nginx:nginx /usr/share/nginx/html \
    && chown -R nginx:nginx /etc/nginx/conf.d \
    && chown -R nginx:nginx /var/log/nginx \
    && chown -R nginx:nginx /var/cache/nginx \
    && touch /var/run/nginx.pid \
    && chown -R nginx:nginx /var/run/nginx.pid \
    && chown -R nginx:nginx /etc/nginx/templates \
    && chown -R nginx:nginx /data

COPY nginxconf/nginx.conf /etc/nginx/nginx.conf

USER nginx

EXPOSE 8080

CMD ["nginx","-g","daemon off;"]
