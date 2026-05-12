# Node Dependency Security Baseline

Use this baseline for Node-based example clients in this repository.

## Required defaults

- Use `pnpm` as package manager with `packageManager` pinned in `package.json`.
- Pin direct dependencies to exact versions (no `latest`, `^`, `~`).
- Commit and use `pnpm-lock.yaml` as the single lockfile source of truth.
- Run installs in CI with `pnpm install --frozen-lockfile`.
- Keep dependency build scripts restricted to an explicit allowlist.

## Recommended pnpm settings

For project-level `pnpm-workspace.yaml`:

```yaml
packages:
  - .

minimumReleaseAge: 1440
blockExoticSubdeps: true
strictDepBuilds: true
savePrefix: ""
```

For `package.json` build-script allowlist:

```json
{
  "pnpm": {
    "onlyBuiltDependencies": ["esbuild", "lightningcss"]
  }
}
```

## CI checks

Minimum CI checks for Node example clients:

1. `pnpm install --frozen-lockfile`
2. `pnpm typecheck`
3. `pnpm lint`
4. `pnpm test`
5. `pnpm build`
6. `pnpm audit --audit-level high --ignore GHSA-rmmr-r34h-pfm5`

`GHSA-rmmr-r34h-pfm5` is currently over-broad for TanStack dependencies. Keep this ignore narrow and temporary, and remove it once upstream advisory metadata is corrected.
