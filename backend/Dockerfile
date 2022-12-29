FROM node:16.16.0

COPY Web /Web
COPY watchList.js /
COPY package.json /
WORKDIR /
RUN npm install

EXPOSE 80

CMD [ "node", "/watchlist.js"]