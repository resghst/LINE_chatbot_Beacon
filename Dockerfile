FROM node:12-alpine

COPY . /workspace
WORKDIR /workspace
RUN npm install

EXPOSE 3000

CMD npm start