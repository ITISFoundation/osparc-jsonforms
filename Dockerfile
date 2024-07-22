FROM ubuntu:22.04 as base

RUN useradd -m -r osparcuser

USER root

ENV DEBIAN_FRONTEND noninteractive
ENV DEBCONF_NOWARNINGS="yes"

RUN apt-get update --yes && apt-get upgrade --yes 
RUN apt-get update --yes 
RUN apt-get install --yes \
    apt-utils \
    curl \
    gnupg \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest

USER osparcuser

WORKDIR /home/osparcuser

RUN npm install vite @vitejs/plugin-react --save-dev
RUN npm create vite@latest jsonform -- --template react

WORKDIR /home/osparcuser/jsonform

RUN npm install @jsonforms/core @jsonforms/react @jsonforms/material-renderers @mui/material @emotion/react @emotion/styled
RUN npm install express cors body-parser

COPY docker_scripts/src/App.jsx src
COPY docker_scripts/package.json .
COPY docker_scripts/server.js .

RUN npm run build

USER root

EXPOSE 8888

CMD ["sh", "-c", "node server.js"]
