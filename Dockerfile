FROM node:13

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8087

#CMD ["/bin/sh", "-c", "envsubst < ./config/adminInfo.js"]

cmd ["npm", "start"]
