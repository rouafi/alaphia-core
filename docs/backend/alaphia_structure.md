# Alaphia - Project Structure

## Project Description
   Alaphia is a human-network intelligence platform that models and visualizes relationships 
    as a living graph. It helps professionals and consultants activate their weak ties, 
    discover opportunity paths, and quantify trust and reciprocity. 

    The backend is built with a strongly-typed NestJS stack following Domain-Driven Design (DDD) 
    and Hexagonal architecture principles. Each domain (Ingestion, Intents, Paths) is modular, 
    self-contained, and communicates via ports and adapters.

    The system ingests contact data (LinkedIn, Gmail, CSV), analyzes relationships via GenAI enrichment, 
    stores them in Postgres with pgvector, and computes warm paths using graph-based heuristics. 
    Redis Streams powers event queuing, while Auth0 provides authentication. 

    The MVP exposes a REST API under `/v1` with endpoints for:
      - `/v1/ingest` — ingest contacts or relationships
      - `/v1/intents` — declare user intent (e.g., “looking for freelance GTM in HealthTech”)
      - `/v1/paths` — compute 2–3 warm connection paths from user to opportunity
    Swagger is automatically generated and accessible via `/docs`.

## Project Structure
PROJECT STRUCTURE DOCUMENT (PSD) - ALAPHIA

1. OVERVIEW

1.1 Document Purpose
This document details the file and directory structure for the Alaphia project, emphasizing its modular, Domain-Driven Design (DDD) and Hexagonal Architecture implementation within the NestJS backend framework. This structure supports clear separation of concerns, maintainability, and scalability for features like Ingestion, Intent Matching, and Path Computation.

1.2 Target Audience
Development team, Technical Leads, and Architects responsible for maintaining or extending the Alaphia codebase.

2. HIGH-LEVEL ARCHITECTURE LAYOUT

The root of the application will follow a standard monorepo-like structure, though initially implemented as a single repository focusing on the backend. The primary code resides in the `src/` directory, adhering to DDD principles where domains are primary modules.

```
alaphia/
├── docs/                     # Project documentation, API definitions (OpenAPI/Swagger source)
├── docker-compose.yml        # Docker configurations for Postgres, Redis, etc.
├── nest-cli.json             # NestJS CLI configuration
├── package.json
├── tsconfig.json             # TypeScript configurations
└── src/                      # Application Source Code (Backend Core)
    ├── main.ts               # Application bootstrapping (HTTP server start)
    ├── app.module.ts         # Root module assembly
    ├── shared/               # Cross-cutting concerns, configuration, common utilities
    └── modules/              # Core DDD Modules (Domains)
        ├── ingestion/        # Handles data parsing, validation, and storage of raw contacts/relationships
        ├── intents/          # Manages user goal definition and persistence
        └── paths/            # Graph computation, pathfinding algorithms (Warm Path Engine)
```

3. DETAILED DIRECTORY BREAKDOWN

3.1 `src/` ROOT

*   `main.ts`: Entry point. Initializes NestJS server, loads global configuration, and connects to core services (DB, Message Queue).
*   `app.module.ts`: Imports all primary domain modules (`IngestionModule`, `IntentsModule`, `PathsModule`) and global providers (e.g., Database connection module).
*   `shared/`: Contains code reusable across domains, ensuring separation from specific domain logic.
    *   `config/`: Environment variable loading and configuration settings (e.g., Auth0 settings, DB credentials).
    *   `database/`: Database connection setup, TypeORM/Prisma repositories bootstrapping, and migration scripts configuration.
    *   `exceptions/`: Custom application exceptions (e.g., `NetworkCapacityExceededException`).
    *   `logging/`: Standardized logging mechanisms (Winston integration).
    *   `utils/`: General helper functions (Date manipulation, graph utility functions for heuristics).

3.2 Domain Modules (`src/modules/*`)

Each domain follows the Hexagonal Architecture pattern, clearly separating Application Services (Use Cases) from Infrastructure (Adapters/Persistence).

#### 3.2.1 `src/modules/ingestion/` (Domain: Ingestion)

Responsible for receiving, validating, enriching, and persisting raw network data.

```
ingestion/
├── application/          # Application Services (Use Cases)
│   ├── ingest-contacts.service.ts  # Handles the core logic for processing incoming data files/streams
│   └── data-validation.service.ts  # Logic for checking required fields (FName, LName, URL, Email, etc.)
├── domain/               # Core entities, value objects, repositories interfaces (Ports)
│   ├── entities/
│   │   └── contact.entity.ts
│   │   └── relationship.entity.ts  # Stores edge metadata like initial connection date, message counts
│   ├── ports/
│   │   └── contact-repository.port.ts # Interface for data storage (e.g., saveContact)
│   └── services/
│       └── data-modeling.service.ts # Logic to map raw CSV/JSON fields to internal Entities
├── infrastructure/       # Adapters (Infrastructure/Persistence Implementation)
│   ├── adapters/
│   │   └── postgres-contact-adapter.ts # Concrete implementation of ContactRepositoryPort using PG
│   └── external/
│       └── genai-enrichment-adapter.ts # Adapter for calling external GenAI API for metadata extraction (Role, Sector, Sentiment)
├── controllers/
│   └── ingest.controller.ts    # Exposes REST endpoint POST /v1/ingest
├── dto/
│   └── ingest-request.dto.ts   # Validation schemas for incoming payloads
└── ingestion.module.ts
```

#### 3.2.2 `src/modules/intents/` (Domain: Intents)

Manages user-declared goals (e.g., "Find GTM expertise in HealthTech").

```
intents/
├── application/
│   └── manage-intents.service.ts # Logic for CRUD operations on user intents
├── domain/
│   ├── entities/
│   │   └── user-intent.entity.ts  # Stores {from: user_a, request: "...", parsed_tags: [...] }
│   └── ports/
│       └── intent-repository.port.ts
├── infrastructure/
│   └── adapters/
│       └── postgres-intent-adapter.ts
├── controllers/
│   └── intents.controller.ts     # Exposes REST endpoint POST /v1/intents
├── dto/
│   └── create-intent.dto.ts
└── intents.module.ts
```

#### 3.2.3 `src/modules/paths/` (Domain: Paths)

The core intelligence layer. Responsible for graph storage, traversal, heuristic scoring, and path computation.

```
paths/
├── application/
│   └── compute-paths.service.ts # Orchestrates graph loading, scoring, and pathfinding execution
├── domain/
│   ├── entities/
│   │   └── network-graph.entity.ts # Conceptual structure representing the live graph state
│   ├── ports/
│   │   └── graph-storage.port.ts   # Interface for querying/updating the graph (Postgres/pgvector)
│   ├── heuristics/
│   │   ├── warmth-score.calc.ts      # Implementation of WarmthScore logic (BaseScore, MessageScore, etc.)
│   │   └── trust-score.calc.ts       # Implementation of Trust calculation (T= 0.4R + 0.3F + ...)
│   └── services/
│       └── pathfinding-engine.service.ts # Core algorithm (e.g., modified Dijkstra's or A*) focused on weighted paths
├── infrastructure/
│   └── adapters/
│       ├── neo4j-or-graph-adapter.ts # (Placeholder/Future: if Neo4j is adopted, currently uses PG/pgvector via graph-storage.port)
│       └── redis-event-adapter.ts    # Adapter for publishing events related to graph updates (via Redis Streams)
├── controllers/
│   └── paths.controller.ts       # Exposes REST endpoint GET /v1/paths
├── dto/
│   └── path-request.dto.ts       # Includes parameters like max_depth (2-3)
└── paths.module.ts
```

4. API ENDPOINTS AND DOCUMENTATION STRUCTURE

The API structure will be organized by module, ensuring all endpoints start with `/v1`. Swagger/Redoc generation tools will rely on the decorators within the Controllers.

*   `/v1/ingest` (POST): Handled by `IngestionController`.
*   `/v1/intents` (POST): Handled by `IntentsController`.
*   `/v1/paths` (GET): Handled by `PathsController`.
*   `/docs` (GET): Entry point for auto-generated Swagger/Redoc UI, reflecting the modern, clean aesthetic requested.

5. INFRASTRUCTURE DETAILS

*   **Data Storage**: `src/shared/database/` will manage connections to **PostgreSQL** (primary relational and vector DB using pgvector).
*   **Eventing**: **Redis Streams** handling will be managed within `PathsModule` adapters for asynchronous tasks like triggering GenAI enrichment after ingestion or recalculating scores.
*   **Authentication**: Handled via Auth0 middleware configured in `app.module.ts` and global guards.
