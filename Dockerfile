FROM node:latest

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get -y install docker-compose

# Create app directory
RUN mkdir -p /webapps/the-cua-tui-website
WORKDIR /webapps/the-cua-tui-website

# Install modules

COPY server /webapps/the-cua-tui-website

RUN yarn install

# Bundle app source
#RUN yarn build

CMD ["node", "app.js"]
