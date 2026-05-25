# Worknoon Chat Backend — Architecture

## Layer map

```
src/
├── index.ts              # Process bootstrap, graceful shutdown
├── app.ts                # Express app factory (HTTP only)
├── config/               # Environment validation, DB, Socket.io options
├── domain/               # Business rules (framework-agnostic)
│   ├── entities/
│   ├── repositories/     # Interfaces (ports)
│   └── services/
├── infrastructure/       # Adapters (MongoDB, persistence)
├── api/                  # HTTP boundary
│   ├── routes/
│   ├── controllers/
│   └── middleware/
├── socket/               # Real-time boundary (Socket.io)
│   ├── namespaces/
│   └── handlers/
└── shared/               # Cross-cutting types, errors, utilities
```

## Separation of concerns

| Layer | Responsibility | Must not |
|-------|----------------|----------|
| **domain** | Entities, validation rules, use-case orchestration | Import Express, Mongoose, Socket.io |
| **infrastructure** | Persistence, external I/O | Contain HTTP/socket routing |
| **api** | REST mapping, auth middleware, DTO ↔ domain | Embed Mongo queries |
| **socket** | Event contracts, room membership, broadcast | Duplicate business logic (delegate to domain services) |

## Real-time event contract

Namespaces: `/chat`. Events are versioned in `src/shared/types/socket-events.ts`.

## Data flow (message send)

1. Client emits `message:send` with validated payload.
2. Socket handler resolves `MessageService.send()`.
3. Service persists via `IMessageRepository`, returns domain entity.
4. Handler broadcasts `message:new` to room participants.

## Module independence

This package is deployable alone. The Next.js frontend and WordPress plugin consume only the public HTTP + Socket contracts documented in `docs/api-contract.md`.
