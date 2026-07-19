# ImenSite architecture reference

## Runtime entry and middleware

- `app/server.ts` creates Express and HTTP servers, Socket.IO, Mongo-backed sessions, Passport serialization, static files, route mounts, centralized 404/error handling, startup, and graceful shutdown.
- `app/config.ts` loads optional `.env`, validates `PORT`, constructs the host-side authenticated MongoDB URI, and resolves `app/public` and `app/views` from the repository working directory.
- Middleware helpers live in `app/middleware/`: `async-handler.ts` forwards rejected route promises and `authentication.ts` protects dashboard routes.

## Request routing

- `app/routes/public/public.ts` mounts the home page, article list/detail and comments, login/logout, and registration routers.
- `app/routes/dashboard/dashboard.ts` applies `requireAuthentication` before mounting dashboard, post, category, comment, and support routers.
- Route modules render corresponding files under `app/views/public/` or `app/views/dashboard/`.
- HTML forms use `method-override` for PUT, PATCH, and DELETE requests.

## Data model

- `User`: normalized unique email, bcrypt password hash, and timestamps.
- `Category`: unique name-facing slug and timestamps.
- `Post`: unique slug, description, category ObjectId references, and timestamps.
- `Comment`: approval state and indexed post ObjectId reference.
- Deleting a post also deletes its comments. Deleting a category pulls its ObjectId from posts.

## Authentication and security boundaries

- Passport Local authenticates email/password in `app/routes/public/login.ts`.
- Sessions persist in MongoDB through `connect-mongo`; dashboard routes must remain behind authentication.
- Passwords are hashed asynchronously and must never be logged or sent through Socket.IO.
- State changes use POST with method override, not GET.

## Rendering and assets

- Pug templates contain Persian user-facing copy and depend on route locals such as `post`, `posts`, `categories`, `comments`, `errors`, and `selectedCategoryIds`.
- Application-owned styles and browser behavior live under `app/public/assets/`.
- `app/public/admin/` is a checked-in AdminLTE/vendor bundle. Avoid broad edits there.

## Local infrastructure

- `compose.yaml` runs only `mongo:8.2.11-noble`, publishes `127.0.0.1:27017`, and persists `/data/db` in `mongodb_data`.
- The Node application runs outside Docker and connects to `127.0.0.1`; it must not use the Docker-only hostname `mongodb`.
- `.env.example` documents Mongo initialization, database name, application port, and session secret. `.env` is local and ignored.

## Verification surfaces

- `npm run check`: strict typecheck, ESLint, and unit tests.
- `npm run build`: production TypeScript compilation.
- `scripts/verify-pug.mjs` in this skill: compile all Pug templates.
- `docker compose config`: validate database-only Compose interpolation and structure.
