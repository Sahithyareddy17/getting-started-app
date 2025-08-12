FROM node:18-alpine
WORKDIR /app
# Tools for native builds + Yarn via Corepack
RUN apk add --no-cache python3 make g++ bash
RUN corepack enable && corepack prepare yarn@1.22.22 --activate
RUN node -v && yarn --version
# Copy only dependency manifests first
COPY package.json yarn.lock ./

RUN yarn install --production
COPY ..
CMD ["node", "src/index.js"]
EXPOSE 3000
