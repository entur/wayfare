FROM node:26.8.1-bookworm-slim@sha256:367679cf9792759492a486e4aa4b421764d71a9546a6dae8aab81a99eb797b3e AS build

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /app

RUN npm install -g corepack@latest && corepack enable && corepack prepare pnpm@11.13.1 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build && pnpm prune --prod

FROM gcr.io/distroless/nodejs24-debian13:nonroot@sha256:774b7d020b24214835769e24c3544835526cd0288f0b094eae48e8b2c2429a79

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
