FROM alpine

RUN apk add --no-cache nodejs nginx \
    && mkdir /run/nginx

COPY ./index.html /app/index.html
COPY ./dist/bundle.js /app/dist/bundle.js
COPY ./nginx.conf.d /etc/nginx/conf.d/default.conf

WORKDIR /app
CMD nginx -g "daemon off;"