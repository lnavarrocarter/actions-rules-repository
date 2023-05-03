FROM node:latest

LABEL version="1.0.0"

LABEL com.github.actions.name=""
LABEL com.github.actions.description=""
LABEL com.github.actions.icon=""
LABEL com.github.actions.color=""

LABEL repository="https://github.com/lnavarrocarter/node-script-action"
LABEL homepage="https://github.com/lnavarrocarter/node-script-action"
LABEL maintainer="Nacho Navarro <lnavarro.carter@gmail.com>"

COPY . .
RUN npm install

RUN ls -la

ENV GITHUB_TOKEN=$github_token

CMD ["npm","run", "github"]
