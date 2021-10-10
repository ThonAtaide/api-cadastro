FROM node:16 as dependencies
WORKDIR /app
COPY /package*.json ./
RUN yarn install
RUN ls

FROM dependencies as x
COPY /tsconfig.json ./
COPY /src ./
RUN yarn build
COPY . .

EXPOSE 5000

ENTRYPOINT ["node", "build"]