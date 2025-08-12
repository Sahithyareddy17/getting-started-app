FROM node:lts-alpine
WORKDIR /app
# Install build toold(needed if you have native modules)
RUN apk add --no-cache python3 make g++

# Enable Yarn (needed for Node>=16 with Corepack)
RUN corepack enable && corepack prepare yarn@1.22.22 --activate
# Copy only dependency manifests first
COPY package.json yarn.lock ./

RUN yarn install --production
COPY ..
CMD ["node", "src/index.js"]
EXPOSE 3000
