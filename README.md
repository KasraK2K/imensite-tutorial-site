# ImenSite tutorial CMS

An Express, MongoDB, Pug, and Socket.IO tutorial CMS written in strict TypeScript.

## Requirements

- Node.js 20.19 or newer
- Docker Desktop or another Docker Compose installation for MongoDB

## Setup

1. Copy `.env.example` to `.env`.
2. Replace `MONGO_INITDB_ROOT_PASSWORD` and `SESSION_SECRET` with long random values.
3. Install application packages with `npm install`.
4. Start only the MongoDB container with `npm run db:up`.
5. Start the TypeScript application directly on the host with `npm run dev`.

Docker is used only for MongoDB. The application is not copied into or built as a Docker image. Because the application runs on the host, its generated connection string uses the published `127.0.0.1:27017` port; `mongodb` is a Docker-internal service name and `host.docker.internal` is for the opposite direction, from a container back to the host. You can still set `MONGODB_URI` explicitly to override the generated connection string.

Database files persist in the Compose-managed `mongodb_data` volume. `docker compose down` stops and removes the container but preserves the database volume.

## Commands

- `npm run dev` — run the TypeScript source with automatic restart.
- `npm run db:up` — start the MongoDB container in the background.
- `npm run db:down` — stop and remove the MongoDB container while preserving its data.
- `npm run db:logs` — follow MongoDB container logs.
- `npm run typecheck` — validate strict TypeScript types without emitting files.
- `npm run lint` — run ESLint over application TypeScript.
- `npm test` — run unit tests.
- `npm run check` — run type checking, linting, and tests.
- `npm run build` — compile the server to `dist/`.
- `npm start` — run the compiled server.

## Main routes

- `/`, `/article`, `/article/:slug` — public content.
- `/register`, `/login`, `/logout` — authentication.
- `/dashboard` — authenticated administration area.
- `/dashboard/post/*`, `/dashboard/category/*`, `/dashboard/comment/*` — content management.
- `/dashboard/support` — experimental Socket.IO support chat.

The Pug views and checked-in browser libraries remain under `app/views` and `app/public`; only application-owned server JavaScript was migrated to TypeScript.

The MongoDB username and password are applied only when the data volume is initialized for the first time. Changing them later in `.env` does not change credentials in an existing volume.
