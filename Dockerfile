FROM node:16-alpine

WORKDIR /frontend

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build

EXPOSE 3000

CMD npm run start