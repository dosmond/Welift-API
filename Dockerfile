FROM node:14

WORKDIR /app
COPY package*.json \
  nest-cli.json \
  tsconfig*.json \
  ./

RUN yarn