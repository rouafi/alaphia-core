# Alaphia - Product Requirements Document

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

## Product Requirements Document
# Product Requirements Document (PRD) - Alaphia MVP (v1.0)

## 1. Introduction

### 1.1 Goal and Vision

Alaphia is a human-network intelligence platform designed to transform professional contact lists into an active, actionable opportunity engine. The MVP aims to provide independent consultants and fractional executives with the ability to model their professional network as a living graph, leveraging GenAI enrichment and graph heuristics to quantify relationships, discover high-potential connection paths, and reactivate valuable weak ties.

### 1.2 Scope of MVP (v1.0)

The MVP is focused on core data ingestion, relationship scoring via heuristics, GenAI enrichment, and API exposure for path computation. The primary delivery mechanism for the MVP is a robust, secure REST API following Domain-Driven Design principles.

### 1.3 Target Audience

The primary users are experienced independent consultants, advisors, and fractional executives (1-5 person operations) who rely on referrals and high-trust introductions for business generation. They need tools to manage network visibility, prioritize outreach, and overcome relationship anxiety caused by lost context.

## 2. Goals and Success Metrics

| Metric Category | Goal | Success Criteria (MVP) |
| :--- | :--- | :--- |
| **Performance** | API latency for Path computation | P95 response time for `/v1/paths` < 500ms. |
| **Data Quality** | Successful ingestion rate | > 95% of submitted records processed without critical errors. |
| **Graph Health** | Node/Edge storage efficiency | Support up to 10,000 unique connections per user profile. |
| **Path Quality** | Path relevance validation (Internal) | The top 3 paths returned must include at least one path that connects to a contact whose GenAI-inferred sector matches the user's declared intent sector. |
| **Adoption** | User capacity | System must stably support up to 10,000 registered users concurrently. |

## 3. Functional Requirements (FR)

### 3.1 Domain: Ingestion (FR-ING)

**FR-ING-001: Data Sources**
The system MUST support ingestion via dedicated endpoints for:
*   LinkedIn exports (structured format TBD, assumed JSON/CSV compliance).
*   Gmail contact/message exports (structured format TBD).
*   Generic CSV uploads.

**FR-ING-002: Required Ingestion Fields**
For any contact record to be successfully modeled as a Node, it MUST contain sufficient data to validate required fields: First Name, Last Name, URL (for future identity resolution), Email Address, Company, Position, and Connected On Date.

**FR-ING-003: Event Queuing**
All ingestion requests MUST be validated, acknowledged immediately, and processed asynchronously via Redis Streams to decouple the API response from the heavy processing of graph building and GenAI enrichment.

**FR-ING-004: Graph Persistence**
Ingested contacts, explicit connections, and message metadata MUST be persisted in the graph database (Postgres with pgvector). Each relationship MUST be stored as an edge.

### 3.2 Domain: Intents (FR-INT)

**FR-INT-001: Intent Declaration**
Users MUST be able to submit a natural language intent declaration via the `/v1/intents` endpoint.
*   **Structure:** Intents MUST be stored as objects containing a `user_id`, a request string (e.g., \"find the right path to reach COO in agritech\"), and metadata (e.g., \"from\": \"user_a\").

**FR-INT-002: Intent Alignment Scoring**
The system MUST use the GenAI Enrichment service to analyze the declared intent against the profile metadata (roles, sectors) of existing network nodes. This alignment score MUST be stored as a property on the edge connecting the user to the potential path nodes.

### 3.3 Domain: Paths (FR-PATH)

**FR-PATH-001: Path Computation Logic**
The system MUST implement a shortest/warmest path algorithm across the relationship graph, restricted to paths of length 2 or 3 connections between the User Node and any Node matching the criteria derived from the declared Intent.

**FR-PATH-002: Path Ranking and Selection**
Computed paths MUST be ranked primarily using the aggregate relationship scores (WarmthScore and TrustScore) associated with the edges in the path. The system MUST return only the top 2 or 3 ranked, unique paths.

**FR-PATH-003: Path Output Structure**
The path output MUST clearly delineate:
1.  The sequence of connection IDs (nodes).
2.  The aggregated path score (derived from edge weights).
3.  Contextual data for each intervening connection (e.g., their GenAI-inferred role, recent sentiment).

## 4. Non-Functional Requirements (NFR)

### 4.1 Architecture and Technology (NFR-ARC)

**NFR-ARC-001: Backend Architecture**
The backend MUST strictly adhere to Domain-Driven Design (DDD) and Hexagonal Architecture. Ingestion, Intents, and Paths MUST be implemented as modular, isolated domains communicating only through defined Ports and Adapters.

**NFR-ARC-002: Data Layer**
Primary persistent storage MUST be PostgreSQL, utilizing pgvector for storing relationship embeddings (if generated) and relationship metadata.

**NFR-ARC-003: Event Broker**
Redis Streams MUST be used as the asynchronous event queuing mechanism to manage high-volume processing workloads (e.g., GenAI enrichment post-ingestion).

### 4.2 Security and Compliance (NFR-SEC)

**NFR-SEC-001: Authentication**
User authentication and authorization MUST be managed entirely by Auth0. All API endpoints MUST be secured using JWT validation.

**NFR-SEC-002: Data Privacy**
Due to the sensitive nature of professional networks, no explicit data security compliance requirement (e.g., GDPR certification) is mandated for the MVP, but the architecture must isolate tenant data (i.e., User A cannot query User B's graph data).

### 4.3 Performance and Scalability (NFR-PERF)

**NFR-PERF-001: Connection Limit**
The system MUST be designed to efficiently handle a maximum modeled network size of 10,000 connections (Nodes) per authenticated user.

**NFR-PERF-002: User Capacity**
The MVP infrastructure MUST be capable of supporting up to 10,000 registered users without degradation of the P95 latency target for path computation.

### 4.4 API Specification and Documentation (NFR-API)

**NFR-API-001: Endpoint Definition**
The API MUST expose a stable REST interface under the `/v1/` prefix with the following core endpoints:
*   POST `/v1/ingest`
*   POST `/v1/intents`
*   GET `/v1/paths?intent_id={id}` (or similar intent reference)

**NFR-API-002: Documentation Generation**
Swagger documentation MUST be automatically generated from the API definitions and be accessible via a clearly defined endpoint (e.g., `/docs`).

## 5. Data Model & Heuristics (Detailed Specifications)

### 5.1 Node Properties (Contact Level)

Nodes store static and inferred metadata about a person.

| Property | Source/Type | Description |
| :--- | :--- | :--- |
| `user_id` | Auth0 ID | Identifier for the network owner. |
| `contact_id` | UUID | Unique ID for the contact node. |
| `name`, `email`, `url` | Ingestion | Core identity data. |
| `inferred_role` | GenAI | Standardized role (e.g., \"Head of Growth\"). |
| `inferred_sector` | GenAI | Standardized industry classification (e.g., \"HealthTech\"). |
| `node_embedding` | pgvector | Vector representation of profile text (future use/enrichment). |

### 5.2 Edge Properties (Relationship Level)

Edges capture the dynamic relationship strength and history.

#### 5.2.1 Warmth Score Calculation (Graph Heuristics)

The **WarmthScore** is the primary measure of active engagement, calculated as:
$$	ext{WarmthScore} = 	ext{BaseScore} + 	ext{MessageScore} + 	ext{RecencyScore} + 	ext{FrequencyScore} + 	ext{ResponseScore}$$

1.  **BaseScore:** Fixed 20 points for being connected.
2.  **MessageScore (0-35 pts):** Based on total message volume (e.g., > 20 messages = 35 pts).
3.  **RecencyScore (0-20 pts):** Exponential decay based on days since last interaction (e.g., $\le 30$ days = 20 pts).
4.  **FrequencyScore (0-15 pts):** Based on the ratio of messaging months to connection age (capped at 2 years, e.g., ratio $\ge 0.5$ = 15 pts).
5.  **ResponseScore (0-10 pts):** Based on the proportion of conversations where both parties initiated contact (e.g., bidirectional ratio $\ge 0.4$ = 10 pts).

#### 5.2.2 Trust Quantification (Combined Score)

A secondary, decay-resistant score reflecting long-term relationship quality:
$$T = 0.4R + 0.3F_{	ext{recency}} + 0.2V_{	ext{sentiment}} + 0.1C_{	ext{context}}$$
Where $R$ is the Reciprocity Ratio, $F_{	ext{recency}}$ is a normalized recency factor, $V$ is the GenAI Valence score, and $C$ is context diversity (e.g., interaction across multiple data sources/projects). This score is stored as `trust_score` on the edge and influences path ranking inversely against decay.

### 5.3 GenAI Enrichment Scope (MV P)

GenAI enrichment will be triggered asynchronously post-ingestion. It MUST focus on lightweight extraction of the following metadata and store it on the corresponding Node or Edge:

*   **Node Properties:** `inferred_role`, `inferred_sector`.
*   **Edge Properties:** `tie_relevance` (derived from intent alignment), `valence` (sentiment score).

## 6. UI/UX Direction (For Future Alignment)

While the MVP is API-first, the technical implementation (especially the Swagger documentation interface) should align with the desired product aesthetic:

*   **Aesthetic Goal:** Modern, clean, Claap-like SaaS vibe.
*   **Design Elements:** Minimalist layout, high whitespace, light neutral backgrounds (gray/white), subtle shadows, clean sans-serif typography, and rounded components.
*   **Implication:** Ensure that API documentation tooling (Swagger/Redoc) is configured to use themes that reflect this clean, low-friction experience, preventing the documentation from feeling dated or overly technical.

## 7. Future Roadmap (Out of Scope for MVP)

*   **Network Merger:** Implementation of features allowing two users to merge overlapping portions of their networks (requested for next major release).
*   Advanced decay models incorporating user-defined network segmentation weights.
