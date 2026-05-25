# Worknoon Real-Time Chat Engine v1.0

## 1. Project Header & Mission

**Mission Statement:** To provide a highly concurrent, resilient, and state-aware real-time communication backend that bridges synchronous RESTful architectures with asynchronous WebSocket topologies.

The Worknoon Real-Time Chat Engine is a meticulously engineered Node.js and Express gateway designed for low-latency, strictly-typed data delivery. By leveraging a centralized Socket.IO cluster, this microservice powers seamless bilateral communication channels between users (Buyers, Designers, Merchants, and Agents) while maintaining robust audit trails and persistent message histories via a deeply integrated MongoDB database layer.

---

## 2. Production Stack Breakdown

This project enforces strict boundaries and rigorous type-safety across the entirety of the application lifecycle using a highly specialized production stack:

- **Runtime Environment**: Node.js (v20+) — Asynchronous, event-driven JavaScript runtime optimizing I/O-intensive network operations.
- **HTTP Framework**: Express.js — Unopinionated, minimalist web framework serving foundational REST APIs and middleware ingestion.
- **Type System**: TypeScript (Strict Mode) — Enforces static typing, advanced interface contracts, and compilation-time safety guarantees.
- **Real-Time Engine**: Socket.IO — Bi-directional, event-based communication layer configured for namespace isolation and fallback polling.
- **Database**: MongoDB — High-performance, schema-less NoSQL document store allowing for rapid iteration and horizontal scaling.
- **ODM Layer**: Mongoose — Object Data Modeling library enforcing application-level schema validation and lifecycle hooks.
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs — Cryptographically secure, stateless authorization and immutable password hashing algorithms.

---

## 3. Database Entity-Relationship Mapping

The underlying persistence layer is strictly normalized to separate authentication credentials, conversational metadata, and atomic message nodes.

### `User` Schema (Authentication & State)

| Field          | Type     | Modifiers / Constraints     | Description                                                                    |
| :------------- | :------- | :-------------------------- | :----------------------------------------------------------------------------- |
| `_id`          | ObjectId | Primary Key                 | Unique document identifier.                                                    |
| `email`        | String   | Unique, Required, Lowercase | Cryptographic identifier for JWT binding.                                      |
| `password`     | String   | Required, `select: false`   | Bcrypt-hashed secret. Excluded from query projections.                         |
| `name`         | String   | Required                    | Human-readable display identity.                                               |
| `role`         | Enum     | Default: `'customer'`       | Defines ACL boundaries (`admin`, `agent`, `customer`, `designer`, `merchant`). |
| `onlineStatus` | Boolean  | Default: `false`            | Dynamically toggled via active Socket connections.                             |
| `lastSeen`     | Date     | Default: `Date.now`         | Precise temporal tracking on socket disconnects.                               |

### `Conversation` Schema (Channel Scoping)

| Field          | Type       | Modifiers / Constraints | Description                                                                       |
| :------------- | :--------- | :---------------------- | :-------------------------------------------------------------------------------- |
| `_id`          | ObjectId   | Primary Key             | Unique channel identifier.                                                        |
| `participants` | [ObjectId] | Required, Ref: `User`   | Bounded array dictating authorized room access.                                   |
| `type`         | Enum       | Required                | Contextual relation (`buyer-to-designer`, `buyer-to-merchant`, `buyer-to-agent`). |
| `context`      | String     | Optional                | Associative metadata (e.g., product slugs, WooCommerce order IDs).                |
| `lastMessage`  | ObjectId   | Ref: `Message`          | Pointer for rapid rendering of inbox previews.                                    |

### `Message` Schema (Atomic Payload)

| Field            | Type       | Modifiers / Constraints       | Description                                               |
| :--------------- | :--------- | :---------------------------- | :-------------------------------------------------------- |
| `_id`            | ObjectId   | Primary Key                   | Unique message identifier.                                |
| `conversationId` | ObjectId   | Required, Ref: `Conversation` | Foreign key binding to the parent channel.                |
| `senderId`       | ObjectId   | Required, Ref: `User`         | Foreign key identifying the payload origin.               |
| `text`           | String     | Required                      | UTF-8 encoded textual payload.                            |
| `fileUrl`        | String     | Optional                      | Cloud-hosted CDN reference for attachments.               |
| `readBy`         | [ObjectId] | Ref: `User`                   | Array tracking participant consumption for read-receipts. |

---

## 4. Core Architectural Flows

The architecture guarantees secure, scoped, and instantaneous data distribution using the following operational sequence:

### I. Socket.IO Handshake & JWT Authentication

When a client initiates a WebSocket upgrade, the server intercepts the connection during the `handshake` phase. A custom middleware strictly checks `socket.handshake.auth.token` against the server's cryptographic `JWT_SECRET`. If verification fails, the connection is instantly rejected. Upon success, the decrypted `userId` is mapped to the immutable `socket.data.userId` namespace, and the user's `onlineStatus` is flipped to `true` globally.

### II. Event: `join_conversation`

Clients do not receive global broadcasts. Upon loading a chat interface, a client explicitly emits `join_conversation` with a target `conversationId`. The Socket.IO engine utilizes its low-level Rooms API (`socket.join(roomId)`) to subscribe the client strictly to localized events scoped to that specific context, preventing cross-channel data leaks.

### III. Event: `send_message`

When a client emits `send_message`, the server processes the payload natively. It first safely persists the atomic `Message` document to MongoDB via Mongoose, updates the parent `Conversation.lastMessage` pointer, and then selectively broadcasts the new entity strictly via `io.to(conversationId).emit("receive_message")`.

### IV. Event: `typing_status`

To provide seamless UX, typing events are captured and relayed instantly. The server receives `typing_status` (boolean flag) and uses `socket.to(conversationId).emit(...)` to broadcast the state to all room participants _except_ the sender, significantly reducing redundant local-client processing.

---

## 5. Local Setup & Bootstrap Instructions

### Prerequisites

- Node.js v20.x or higher
- MongoDB Atlas Cluster or Local MongoDB Instance

### Step 1: Clone and Install Dependencies

```bash
git clone <repository-url>
cd worknoon-chat-backend
npm install
```

### Step 2: Environment Configuration

Create a `.env` file in the root directory and populate it with the following explicit runtime configurations:

```env
# The HTTP binding port for the Express/Socket gateway
PORT=4000

# MongoDB Connection String (Provide Atlas URI or local loopback)
MONGODB_URI=mongodb://localhost:27017/worknoon

# Cryptographic key for signing JSON Web Tokens
JWT_SECRET=super_secure_cryptographic_secret_key_123
```

### Step 3: Runtime Execution

We utilize `tsx` for real-time TypeScript compilation during development. Execute the following to boot the ecosystem:

```bash
# Development mode (hot-reloading enabled)
npm run dev

# Production build & execution
npm run build
npm run start
```

_Upon successful execution, the terminal will report: `[Database] Successfully connected to MongoDB.` and `[worknoon-chat] HTTP + Socket.IO server running strictly on :4000`._

---

## 6. Production-Grade Challenge Overcome

### Mitigating State Asynchrony by Harmonizing Scalable Socket Broadcast Streams with Stateless JSON Web Token Verification Layers

**The Challenge:**
Managing real-time bi-directional network layers in a conventionally stateless REST architecture introduces a severe duality problem. While REST APIs natively validate transient stateless JWTs provided via standard HTTP `Authorization` headers on every isolated request, WebSockets maintain long-lived stateful TCP connections. The architectural challenge arises in securing these persistent streams against unauthenticated packet injection without introducing heavy, centralized session stores (e.g., Redis) which create bottlenecks in horizontal scaling environments.

**The Solution:**
To circumvent this, we engineered a hybridized, strict inline verification middleware injected natively into the Socket.IO `handshake` phase. Rather than validating authorization payloads upon every discrete event emission (which introduces massive computational overhead), the architecture intercepts the initial WebSocket upgrade HTTP request.

By extracting the token strictly from `socket.handshake.auth.token`, we execute an asynchronous, cryptographically isolated verification of the JWT signature exactly once. Upon absolute validation, we map the decoded immutable payload context (the distinct `userId`) directly into the persistent `socket.data` heap memory reference.

This methodology guarantees that every subsequent event emitted over that specific socket lifecycle is implicitly trusted and cryptographically bound to the authenticated entity. It fundamentally eliminates the necessity for per-message authorization overhead, entirely mitigates socket state asynchrony, and seamlessly bridges stateless REST paradigms with stateful WebSocket topologies while ensuring O(1) broadcast authorization complexity.
