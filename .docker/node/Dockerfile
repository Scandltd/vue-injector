FROM node:10

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
    && apt-get update \
    && apt-get install -y apt-transport-https \
    && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
    && apt-get update \
    && apt-get install -y yarn git make curl zip \
    && mkdir -p /app

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install
COPY . .

EXPOSE 8080

COPY .docker/node/startup.sh /
RUN chmod +x /startup.sh

ENTRYPOINT ["/startup.sh"]
