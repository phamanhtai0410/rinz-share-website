FROM node:latest

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get -y install docker-compose

# Create app directory
RUN mkdir -p /webapps/rinz-share-website
WORKDIR /webapps/rinz-share-website

# Install modules

COPY server /webapps/rinz-share-website

RUN yarn install

# Bundle app source
#RUN yarn build

CMD ["node", "app.js"]
