FROM node:16.16.0

COPY watchlistbackend.js /
COPY package.json /

RUN mkdir -p config
COPY config/default.json config

RUN mkdir -p models
COPY models/* models/

WORKDIR /

RUN npm install

EXPOSE 8085

CMD [ "node" , "/watchlistbackend.js" ]
