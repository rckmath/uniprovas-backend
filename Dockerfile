FROM node:12-alpine

ENV HOME=/home/app/unirepo
WORKDIR ${HOME}

COPY package*.json ./

RUN yarn

COPY . .

RUN chmod +x docker-entrypoint.sh
ENTRYPOINT [ "./docker-entrypoint.sh" ]