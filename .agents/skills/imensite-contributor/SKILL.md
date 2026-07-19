---
name: imensite-contributor
description: Contribute safely to the ImenSite Express 5, TypeScript, Mongoose, Pug, Passport, Socket.IO, and database-only Docker project. Use when Codex needs to implement, debug, review, refactor, test, or explain ImenSite routes, models, forms, authentication, dashboard behavior, MongoDB data, Pug views, dependencies, or local Docker database setup.
---

# ImenSite Contributor

Follow the repository's established vertical-slice patterns and validate changes at the real runtime boundary.

## Start with evidence

1. Read `AGENTS.md`.
2. Read [references/architecture.md](references/architecture.md) when the task crosses more than one layer or the responsible file is unclear.
3. Inspect the current `package.json`, relevant source, templates, and git status. Preserve unrelated user changes.
4. Use `imensite_explorer` for a read-only map when the flow remains unclear after targeted inspection.
5. Leave every change unstaged. Never run or request approval for staging, index-writing, or commit-creating Git commands; `.codex/rules/default.rules` and `.codex/hooks.json` enforce this repository-owner boundary.

## Map the change

- Trace public requests through `app/routes/public/public.ts`.
- Trace dashboard requests through `app/routes/dashboard/dashboard.ts` and retain `requireAuthentication`.
- Treat a form feature as route validation, normalized input, model operation, render/redirect locals, and its Pug template together.
- Treat data deletion as the primary document plus dependent references or comments.
- Treat database connectivity as a host-side application connecting to the published MongoDB port.

## Implement consistently

- Keep strict TypeScript, ESM, and `.js` suffixes on internal imports.
- Wrap async Express handlers with `asyncHandler` and await all database operations.
- Use `express-validator` and `app/utils/form-data.ts` at request boundaries.
- Return explicit missing-record responses and preserve the central duplicate-key and cast-error handling.
- Keep schemas, interfaces, references, timestamps, and indexes aligned.
- Preserve Persian copy, authentication controls, Mongo-backed sessions, and database-only Docker architecture.
- Avoid editing `dist/` or vendored/minified assets under `app/public/`.

## Verify proportionally

Run the smallest relevant checks, then expand for cross-cutting work:

```powershell
npm run check
npm run build
node .agents/skills/imensite-contributor/scripts/verify-pug.mjs
docker compose config
```

- Run the Pug verifier after template or render-local changes.
- Run Compose validation after database-container configuration changes.
- Use `imensite_reviewer` after substantial route, authentication, data-integrity, or dependency changes.
- Report unavailable MongoDB or browser checks explicitly.

## Keep durable guidance current

Update `AGENTS.md`, this skill, its architecture reference, `.env.example`, or `README.md` only when the underlying project contract changed. Do not duplicate transient implementation details into durable guidance.
