FROM node:24.15.0-bookworm-slim@sha256:4e6b70dd6cbfc88c8157ba19aa3d9f9cce6ba4703576d55459e45efcbc9c5f5d AS build

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.13.1 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build && pnpm prune --prod

FROM gcr.io/distroless/nodejs24-debian13:nonroot@sha256:fbbdda866ea71aef98c4abece17e3d61fbf820cc2ef3961522caa2478716171a

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
