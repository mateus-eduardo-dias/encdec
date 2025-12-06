FROM node:25-alpine3.23
COPY package.json /app/
COPY index.js /app/
WORKDIR /app
ENTRYPOINT ["node", "index.js"]
