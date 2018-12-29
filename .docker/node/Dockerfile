FROM node:8.11.1

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && apt-get update \
    && apt-get install -y apt-transport-https \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update \
    && apt-get install -y yarn git make curl zip \
    && mkdir -p /app

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force && npm install && npm cache clean --force
COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]
