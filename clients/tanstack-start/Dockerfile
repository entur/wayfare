FROM node:24.21.0-trixie-slim@sha256:173f125896c3b47ddf056734c7ea789d04595a6a08769a8f78e0df642781fb66 AS build

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /app

RUN npm install -g corepack@latest && corepack enable && corepack prepare pnpm@11.13.1 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build && pnpm prune --prod

FROM gcr.io/distroless/nodejs24-debian13:nonroot@sha256:59c479c9b8c123e66047315c968aa2d35e31ae5149c856e4110a79c8b3563f0b

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
