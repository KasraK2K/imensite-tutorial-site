# ImenSite repository guidance

## Project shape

- This is a Node.js 20+ Express 5 CMS written in strict TypeScript and rendered with Pug.
- MongoDB runs in Docker; the application always runs on the host unless the user explicitly changes that architecture.
- Application source lives in `app/`. Compiled output in `dist/` is generated and must not be edited.
- Checked-in browser libraries under `app/public/admin/` and minified files under `app/public/` are vendored assets. Do not modernize or reformat them as part of unrelated work.
- Read `.agents/skills/imensite-contributor/references/architecture.md` when a task crosses routes, models, views, authentication, Socket.IO, or Docker configuration.

## Implementation rules

- Preserve strict TypeScript and NodeNext ESM imports. Internal TypeScript imports use `.js` suffixes.
- Keep route handlers small. Put async handlers behind `asyncHandler`, await database writes, and let the central error middleware handle unexpected failures.
- Validate and normalize form input with `express-validator` and the helpers in `app/utils/form-data.ts`.
- Return an explicit `404` when a requested document does not exist. Treat malformed MongoDB IDs and duplicate keys through the existing central error behavior.
- Keep Mongoose schemas and their TypeScript interfaces synchronized. Use `required`, references, indexes, and timestamp mappings deliberately.
- Preserve Persian UI copy and UTF-8 encoding. Do not translate or rewrite visible text unless requested.
- When changing a route contract, inspect its Pug form or link, method override field, model operation, and redirect/render target as one vertical slice.
- Keep `/dashboard` protected by `requireAuthentication`. Do not weaken password hashing, session cookies, Mongo-backed sessions, or logout behavior.
- State-changing actions must not use GET routes.
- Do not log credentials, session contents, raw passwords, or sensitive Socket.IO payloads.

## Database and Docker boundary

- `compose.yaml` contains MongoDB only. Do not add an application service or Dockerfile unless explicitly requested.
- The host application connects to `127.0.0.1:27017`. The Compose service name `mongodb` is only valid between containers; `host.docker.internal` is for a container reaching the host.
- Preserve the `mongodb_data` named volume during normal stop/start operations.
- Never commit `.env`. Update `.env.example` and `README.md` when configuration variables change.

## Validation

- Run `npm run check` after application changes.
- Run `npm run build` when TypeScript, configuration, imports, or production startup behavior changes.
- Run `node .agents/skills/imensite-contributor/scripts/verify-pug.mjs` after changing Pug templates or render locals.
- Run `docker compose config` after editing `compose.yaml` or its variables. Supply non-secret temporary interpolation values when `.env` is unavailable.
- Report when live MongoDB or browser verification could not be performed; do not imply it passed.

## Git ownership

- The repository owner exclusively controls staging and commit history. Never run, suggest running on the user's behalf, or request approval for `git add`, `git stage`, `git update-index`, `git commit`, `git commit-tree`, or equivalent index/commit-writing commands.
- This prohibition remains in force even if a task asks Codex to commit. Leave every change unstaged and tell the user what remains for manual review.
- Read-only inspection commands such as `git status`, `git diff`, `git log`, and `git show` are allowed.
- Project rules in `.codex/rules/default.rules` and the `PreToolUse` guard in `.codex/hooks.json` enforce this prohibition, including Git commands nested in shell wrappers. Do not modify, bypass, weaken, or remove either guard unless the repository owner explicitly asks to change this policy itself.

## Subagents

- For unfamiliar cross-cutting work, use the project `imensite_explorer` subagent to map the execution path before editing.
- For substantial authentication, data-integrity, route, or dependency changes, use `imensite_reviewer` for an independent read-only review after local checks pass.
- Skip delegation for routine, isolated changes where a subagent would add no useful independent evidence.
