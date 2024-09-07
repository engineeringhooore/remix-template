# base node image
FROM node:22.7.0-alpine3.19 AS base

# set for base and all layer that inherit from it
ENV NODE_ENV=production

# Install openssl for Prisma
RUN apk update && apk add openssl

# Install all node_modules, including dev dependencies
FROM base AS deps

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile --production=false; \
  elif [ -f package-lock.json ]; then npm ci --include=dev; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --prod false; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Setup production node_modules
FROM base AS production-deps

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile --production=true --ignore-scripts; \
  elif [ -f package-lock.json ]; then npm prune --omit=dev --ignore-scripts; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm prune --prod --ignore-scripts; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Build the app
FROM base AS build

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S remix -u 1001

COPY --from=production-deps /app/node_modules /app/node_modules

COPY --from=build --chown=nextjs:nodejs /app/build /app/build
COPY --from=build /app/public /app/public
ADD . .

USER remix

ARG PORT=3000
EXPOSE ${PORT}

CMD ["npm", "start"]