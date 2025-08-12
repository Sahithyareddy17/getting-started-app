FROM node:lts-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --version&&node -v && ls -la
RUN yarn install --production
COPY ..
CMD ["node", "src/index.js"]
EXPOSE 3000
