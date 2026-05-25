# Public API Contract (v0.1)

Base URL: `http://localhost:4000/api/v1`

## REST

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness + Mongo connectivity |
| GET | `/conversations` | List conversations for authenticated user |
| POST | `/conversations` | Create conversation |
| GET | `/conversations/:id/messages` | Paginated message history |

## Socket.io

- Path: `/socket.io`
- Namespace: `/chat`
- Auth: Bearer token in handshake `auth.token`

See `src/shared/types/socket-events.ts` for event names and payloads.
