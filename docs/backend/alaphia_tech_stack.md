# Alaphia - Tech Stack

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

## Tech Stack
TECHNOLOGY STACK: ALAPHIA PLATFORM

1. CORE BACKEND & ARCHITECTURE
---------------------------------------

Technology: NestJS (Node.js Framework)
Justification: Chosen for its robust, scalable structure, built-in TypeScript support, and strong alignment with enterprise-grade application development. It naturally supports modularity, which is critical for implementing Domain-Driven Design (DDD) and Hexagonal (Ports & Adapters) architecture. This ensures the core business logic (Ingestion, Intents, Paths) is decoupled from external concerns (database, external APIs).

Architecture Pattern: Domain-Driven Design (DDD) & Hexagonal Architecture
Justification: Essential for managing the complexity of a human-network intelligence platform. DDD ensures that the core concepts (Contact, Relationship, Path, Intent) are modeled accurately. Hexagonal architecture enforces clean separation: the core graph computation logic remains pristine, interacting with external systems (Postgres, GenAI, Auth0) only through well-defined ports and adapters.

Language: TypeScript
Justification: Mandated by the NestJS framework choice. Provides strong typing throughout the pipeline—from data ingestion validation to graph algorithms—significantly reducing runtime errors, improving maintainability, and providing excellent tooling support for complex domain models.

2. DATA STORAGE & PERSISTENCE
---------------------------------------

Primary Database: PostgreSQL
Justification: A reliable, ACID-compliant relational database required for structured metadata storage (User profiles, declared Intents, relationship scores). Its proven maturity makes it an ideal foundation for the system's core state.

Vector Extension: pgvector
Justification: Critical for integrating GenAI capabilities. Storing relationship metadata vectors (derived from GenAI enrichment) alongside contact nodes allows for fast, nearest-neighbor similarity searches, which will feed into the pathfinding and intent alignment heuristics.

Graph Storage Strategy (MVP Context):
Justification: While dedicated Graph Databases (like Neo4j) are powerful, the MVP relies on Postgres + pgvector to manage node/edge relationships and leverage standardized SQL/vector operations for pathfinding heuristics. The heuristic computation (WarmthScore calculation) is done in the application layer rather than relying on a dedicated graph traversal language for initial iteration speed and reduced stack complexity.

Caching & Queuing: Redis (using Streams)
Justification:
Redis Streams: Used as the primary high-throughput, durable event bus for asynchronous tasks, especially for the Ingestion pipeline (handling batch CSV uploads) and triggering GenAI enrichment jobs. Streams provide necessary persistence and consumer group features superior to simple Pub/Sub for this workload.
Standard Caching: Used for fast access to frequently calculated or relatively static components like frequently accessed contact metadata caches.

3. EXTERNAL INTEGRATIONS & SECURITY
---------------------------------------

Authentication & Authorization: Auth0
Justification: Offloads the complexity of secure user management, identity providers, MFA, and token handling. This is crucial for an MVP targeting professional users where security and compliance are paramount.

GenAI Enrichment (Conceptual/Adapter Layer):
Justification: The architecture requires an adapter layer to communicate with external LLMs (e.g., OpenAI, Anthropic) for the specific tasks: Role Standardization, Sector Classification, and Sentiment Analysis. The stack must support async HTTP client calls with resilient error handling for these external service calls.

4. DEVELOPMENT, DEPLOYMENT & DOCUMENTATION
---------------------------------------

API Specification: REST API (under /v1)
Justification: Standard, widely understood protocol suitable for initial interaction points (Ingestion, Querying Paths).

API Documentation: Swagger (OpenAPI) Generation
Justification: NestJS integrates seamlessly with Swagger module. The resulting documentation UI should align with the desired modern, clean, Claap-like aesthetic (minimalist, high whitespace) through appropriate theming of the generated UI.

Testing Frameworks: Jest (Unit/Integration) / Cypress (E2E - Future)
Justification: Jest is the standard for Node/TypeScript testing, ensuring thorough testing of domain logic, service layers, and adapter interfaces.

5. FUTURE FEATURE CONSIDERATION (Network Merger)
---------------------------------------------

The choice of PostgreSQL/pgvector over a pure graph DB in the MVP is pragmatic. However, the modular design (Hexagonal) allows for a future pivot or dual-write to a dedicated Graph Database (e.g., Neo4j) if the complexity of large-scale graph traversals (like complex network mergers) exceeds the performance capabilities of heuristic path calculation in the application layer. The DDD structure isolates the graph computation logic, making this replacement feasible later.

6. DATA VALIDATION & DOMAIN CONSTRAINTS
---------------------------------------

Input Validation: Class-Validator / Zod integrated via NestJS pipes.
Justification: Enforces strict validation on all incoming data payloads (`/v1/ingest`, `/v1/intents`) based on the required fields (First Name, Last Name, URL, Email, Company, Position, Connected On).

Constraint Handling:
Maximum Connections (10,000): Handled at the boundary layer (Ingestion Adapter) to prevent system overload before data hits the core graph processor.
User Capacity (1,000 users): This scale is well within the expected performance envelope of the chosen stack (NestJS, Postgres).

7. TRUST & REWARD QUANTIFICATION
---------------------------------------

Heuristic Calculation Engine: Custom Service within the Paths Domain (Implemented in TypeScript/Node.js).
Justification: The complex weighted formulas (WarmthScore, Trust Score T) require precise, reproducible logic. Implementing these heuristics directly in the backend service guarantees control over precision and integration with the GenAI enrichment properties (Valence, Context). The results (trust_score, edge weights) are persisted back into Postgres edges.
