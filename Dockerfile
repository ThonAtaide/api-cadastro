FROM node:16 as dependencies
WORKDIR /app
COPY /package*.json ./
COPY /tsconfig.json ./
RUN yarn install

FROM dependencies as build
COPY /src ./
RUN yarn build
COPY . .

EXPOSE 5000

ENTRYPOINT ["node", "build"]