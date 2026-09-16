FROM node:24.21.0-trixie-slim@sha256:db3ae80f5d8df06e04dabdf7b44cbf008d32de168205fa0294444aabbc08c590 AS build

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /app

RUN npm install -g corepack@latest && corepack enable && corepack prepare pnpm@11.13.1 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build && pnpm prune --prod

FROM gcr.io/distroless/nodejs24-debian13:nonroot@sha256:bb6b03d81066993293a10feda7250e8e1cc034035fe9b61cfceededa7c8bf04d

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080

WORKDIR /app

COPY --from=build --chown=nonroot:nonroot /app/package.json ./package.json
COPY --from=build --chown=nonroot:nonroot /app/node_modules ./node_modules
COPY --from=build --chown=nonroot:nonroot /app/dist ./dist
COPY --from=build --chown=nonroot:nonroot /app/server.mjs ./server.mjs
COPY --from=build --chown=nonroot:nonroot /app/src/lib/public-pathnames.ts ./src/lib/public-pathnames.ts
COPY --from=build --chown=nonroot:nonroot /app/src/server/access-gate.ts ./src/server/access-gate.ts
COPY --from=build --chown=nonroot:nonroot /app/src/server/deployment-config.ts ./src/server/deployment-config.ts
COPY --from=build --chown=nonroot:nonroot /app/src/server/entur-login.ts ./src/server/entur-login.ts
COPY --from=build --chown=nonroot:nonroot /app/src/server/permission-store.ts ./src/server/permission-store.ts

EXPOSE 8080
USER nonroot:nonroot

CMD ["server.mjs"]
