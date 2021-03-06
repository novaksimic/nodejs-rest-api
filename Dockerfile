FROM node:latest
WORKDIR usr/src/app
COPY package*.json ./
RUN npm install -g nodemon
RUN npm install 
COPY . .
EXPOSE 3000
CMD ["npm", "start"]