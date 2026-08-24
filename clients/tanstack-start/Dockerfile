FROM node:26.7.0-bookworm-slim@sha256:cd565714d4da3e84bfd341e31448f81d47c6362198f152345297c9c1154e6341 AS build

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.13.1 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build && pnpm prune --prod

FROM gcr.io/distroless/nodejs24-debian13:nonroot@sha256:ffab599740d4aaa66029d02b9e6d3de4f622fefb7410081c5ef69c86430f364d

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080

WORKDIR /app

COPY --from=build --chown=nonroot:nonroot /app/package.json ./package.json
COPY --from=build --chown=nonroot:nonroot /app/node_modules ./node_modules
COPY --from=build --chown=nonroot:nonroot /app/dist ./dist
COPY --from=build --chown=nonroot:nonroot /app/server.mjs ./server.mjs
COPY --from=build --chown=nonroot:nonroot /app/src/server/access-gate.ts ./src/server/access-gate.ts
COPY --from=build --chown=nonroot:nonroot /app/src/server/deployment-config.ts ./src/server/deployment-config.ts
COPY --from=build --chown=nonroot:nonroot /app/src/server/entur-login.ts ./src/server/entur-login.ts
COPY --from=build --chown=nonroot:nonroot /app/src/server/permission-store.ts ./src/server/permission-store.ts

EXPOSE 8080
USER nonroot:nonroot

CMD ["server.mjs"]
