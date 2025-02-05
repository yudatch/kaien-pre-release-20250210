FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl && \
    npm config set prefer-offline true

ENV TS_NODE_TRANSPILE_ONLY=true
ENV NODE_ENV=development
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./

RUN npm install --prefer-offline

COPY tsconfig.json ./
COPY src ./src

RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

USER appuser

EXPOSE 3001

HEALTHCHECK --interval=10s --timeout=5s --retries=3 --start-period=30s \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["npm", "run", "dev"]