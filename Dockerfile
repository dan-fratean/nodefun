FROM node:alpine

RUN mkdir -p /nodefun/app           \
    && mkdir -p /nodefun/public     \
    && apk --update add git         \
    && rm -rf /var/cache/apk/*      \
    && npm install -g bower

WORKDIR /nodefun

COPY package.json bower.json server.js /nodefun/
RUN npm install && bower --allow-root install

COPY app/ /nodefun/app
COPY public/ /nodefun/public

EXPOSE 7777

HEALTHCHECK --interval=5s --timeout=5s --retries=3 CMD /usr/bin/nc -z 127.0.0.1 7777

CMD [ "npm", "start" ]

