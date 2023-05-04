FROM node:latest

LABEL version="1.1.4"

LABEL com.github.actions.name="actions-rules-repository"
LABEL com.github.actions.description="set a rules repository for a issue, release, pull request or pull request review"
LABEL com.github.actions.icon="bookmarks"
LABEL com.github.actions.color="green"

LABEL repository="https://github.com/lnavarrocarter/actions-rules-repository"
LABEL homepage="https://github.com/lnavarrocarter/actions-rules-repository"
LABEL maintainer="Nacho Navarro <lnavarro.carter@gmail.com>"

COPY . .
RUN npm install

RUN ls -la

ENV GITHUB_TOKEN=$github_token
ENV GITHUB_REPOSITORY=$github_repository
ENV NUMBER=$number
ENV LABELS=$labels

CMD ["npm","run", "github"]
