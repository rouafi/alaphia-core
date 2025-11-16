# Alaphia - Schema Design

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

## Schema Design
# SCHEMA DESIGN DOCUMENT: ALAPHIA HUMAN-NETWORK INTELLIGENCE PLATFORM

**Document Version:** 1.0
**Date:** 2024-05-15
**Author:** [System Generated]
**Scope:** MVP Database Structure, Domain Models, and Relationships (PostgreSQL/pgvector)

---

## 1. Introduction and Architectural Context

This document outlines the core database schema design for Alaphia, reflecting Domain-Driven Design (DDD) boundaries and supporting the primary functional requirements: network ingestion, GenAI enrichment, relationship modeling (scoring), and warm path computation.

The system utilizes PostgreSQL, leveraging JSONB fields for flexible metadata and `pgvector` for storing relationship embeddings derived from GenAI processes (though direct embedding storage is deferred to future scope, the structure supports it). Relationships are modeled as a graph structure mapped onto relational tables.

## 2. Core Entities (Domains)

The MVP revolves around three primary conceptual domains: Users (the system owner), Contacts (Nodes in the graph), and Interactions (Edges in the graph).

### 2.1. User Aggregate Root (`users`)

Represents the primary Alaphia user (the consultant/advisor).

| Column Name | Data Type | Constraints/Notes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Unique identifier. |
| `auth0_id` | VARCHAR(255) | UNIQUE, NOT NULL | Identifier linked to Auth0 principal. |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Primary contact email. |
| `display_name` | VARCHAR(100) | NOT NULL | User's preferred name. |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Record creation time. |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Last update time. |

### 2.2. Contact Aggregate Root (`contacts`)

Represents an entity (person or organization) in the user's network (Graph Nodes).

| Column Name | Data Type | Constraints/Notes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Unique identifier for the contact. |
| `user_id` | UUID | FK to `users.id`, NOT NULL | The owner of this relationship graph. |
| `source_id` | VARCHAR(255) | | Original unique ID from source (e.g., LinkedIn ID). |
| `first_name` | VARCHAR(100) | | Ingestion validation: Required. |
| `last_name` | VARCHAR(100) | | Ingestion validation: Required. |
| `email` | VARCHAR(255) | | Optional contact email. |
| `url` | VARCHAR(512) | | Profile URL (e.g., LinkedIn). |
| `company` | VARCHAR(255) | | Company name. |
| `position` | VARCHAR(255) | | Raw job title/role. |
| `connected_on` | DATE | | Date of initial connection/import. |
| **Enrichment Metadata (GenAI)** | | | |
| `inferred_role` | JSONB | | Standardized role (e.g., \"Head of Growth\"). |
| `inferred_sector` | VARCHAR(100) | | Classified industry (e.g., \"HealthTech\"). |
| `embedding_vector` | VECTOR(1536) | | Placeholder for future vector storage. |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | |

### 2.3. Interaction/Relationship Edge (`interactions`)

Represents the dynamic, weighted connection (Edge) between a `user` and a `contact`. This table stores the derived graph metrics.

| Column Name | Data Type | Constraints/Notes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Unique ID for the interaction record. |
| `user_id` | UUID | FK to `users.id`, NOT NULL | Owner context. |
| `contact_id` | UUID | FK to `contacts.id`, NOT NULL | The connected contact. |
| `interaction_type` | VARCHAR(50) | NOT NULL | e.g., 'LINKEDIN', 'GMAIL_MESSAGE', 'CSV_IMPORT'. |
| `is_mutual` | BOOLEAN | NOT NULL | Flag if relationship is confirmed mutual (for future merger scope). |
| **Heuristic Scores (Weighting Factors)** | | Stored as per design documentation | |
| `base_score` | INTEGER | 20 (Fixed MVP) | Score component from BaseScore. |
| `message_score` | INTEGER (0-35) | Recalculated | Score based on message volume. |
| `recency_score` | INTEGER (0-20) | Recalculated | Score based on time decay. |
| `frequency_score` | INTEGER (0-15) | Recalculated | Score based on consistent interaction months. |
| `response_score` | INTEGER (0-10) | Recalculated | Score based on bidirectional initiation. |
| **Derived Trust Metrics (Quantification)** | | Stored per edge | |
| `warmth_score` | DECIMAL(5,2) | NOT NULL | **SUM of all scores** (Total potential 100). Primary metric for path ranking. |
| `trust_score_T` | DECIMAL(4,3) | Reciprocity-weighted trust (0.000 - 1.000). | `T = 0.4R + 0.3F_recency + 0.2V + 0.1C`. |
| `decay_rate_factor` | DECIMAL(3,2) | | Used by pathfinding engine to slow down score degradation. |
| **GenAI Edge Enrichment** | | | |
| `tie_relevance` | DECIMAL(3,2) | | AI-derived relevance to user goals (0.0 to 1.0). |
| `valence_sentiment` | DECIMAL(3,2) | | Sentiment/Tone score from recent exchanges (-1.0 to 1.0). |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Last time scores were recalculated. |
| **Unique Constraint** | | (user\_id, contact\_id) | Ensures one relationship record per user-contact pair. |

## 3. Supporting Domains

### 3.1. User Intents (`intents`)

Stores the specific goals users are trying to achieve, feeding the pathfinding algorithm.

| Column Name | Data Type | Constraints/Notes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | |
| `user_id` | UUID | FK to `users.id`, NOT NULL | Owner. |
| `intent_name` | VARCHAR(255) | NOT NULL | A friendly, short name for the intent. |
| `request_text` | TEXT | NOT NULL | Raw request text (e.g., "find the right path to reach COO in agritech"). |
| `target_keywords` | JSONB | | Parsed keywords for graph traversal matching (e.g., sectors, roles). |
| `ai_alignment_scores` | JSONB | | Stores alignment results for each contact against this specific intent. |
| `is_active` | BOOLEAN | DEFAULT TRUE | Ability to retire old goals. |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | |

### 3.2. Ingestion Tracking (`ingestions`)

Tracks the history and status of data imports.

| Column Name | Data Type | Constraints/Notes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | |
| `user_id` | UUID | FK to `users.id`, NOT NULL | |
| `source_type` | VARCHAR(50) | NOT NULL | e.g., 'LINKEDIN_EXPORT', 'GMAIL_SYNC', 'CSV_UPLOAD'. |
| `record_count` | INTEGER | | Number of records processed in this batch. |
| `status` | VARCHAR(50) | NOT NULL | 'SUCCESS', 'PROCESSING', 'FAILED'. |
| `metadata` | JSONB | | Details about the file or sync window. |
| `processed_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | |

### 3.3. Message Logs (`message_logs`)

Detailed log of interactions required to calculate MessageScore, RecencyScore, and ResponseScore. This is the raw input for the heuristic engine.

| Column Name | Data Type | Constraints/Notes | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | |
| `user_id` | UUID | FK to `users.id`, NOT NULL | Owner context. |
| `contact_id` | UUID | FK to `contacts.id`, NOT NULL | Target contact. |
| `interaction_time` | TIMESTAMP WITH TIME ZONE | NOT NULL | Exact time of message send/receive. |
| `sender_type` | VARCHAR(10) | NOT NULL | 'USER' or 'CONTACT'. |
| `body_preview` | VARCHAR(500) | | Sanitized first part of the message for debugging. |
| `is_user_initiated` | BOOLEAN | NOT NULL | TRUE if this message starts a new conversation thread or continues one where the user sent the last message. (Used for ResponseScore). |
| `is_response` | BOOLEAN | NOT NULL | TRUE if this message is a reply to the other party. (Used for Reciprocity R). |
| `source_system` | VARCHAR(50) | | e.g., 'GMAIL', 'LINKEDIN_DM'. |

## 4. Relationships and Graph Modeling

Alaphia models relationships using a **Bipartite Graph Pattern** stored relationally, where the `users` table is conceptually one side of the graph, and `contacts` are the other. The `interactions` table acts as the core edge set, explicitly linking the User to the Contact and storing all calculated relationship metadata.

### 4.1. Foreign Key Relationships Summary

1.  `contacts.user_id` -> `users.id` (One User owns many Contacts).
2.  `interactions.user_id` -> `users.id` (One User owns many Relationship Records).
3.  `interactions.contact_id` -> `contacts.id` (The edge points to the Contact node).
4.  `intents.user_id` -> `users.id`.
5.  `ingestions.user_id` -> `users.id`.

### 4.2. Data Flow for Pathfinding

Pathfinding relies on aggregated metrics stored on the `interactions` edge:

1.  **Node Context:** Pathfinding uses `contacts.inferred_role` and `contacts.inferred_sector` to match against `intents.target_keywords`.
2.  **Edge Weighting:** The primary weight used by the pathfinding heuristic (e.g., Dijkstra's or A*) will be an inverse function of the `warmth_score` (or a decay factor based on `trust_score_T`) to prioritize warmer, higher-trust paths.
3.  **Reciprocity:** The `ResponseScore` and `trust_score_T` directly model reciprocity, ensuring paths through highly balanced relationships are preferred over one-sided ones.

## 5. Future Feature Support (Network Merger)

The **Network Merger** feature (Future Roadmap) requires careful schema consideration:

1.  **Contact Merging:** When merging Contact A and Contact B (belonging to the same external entity but imported separately), the system must reconcile their records in the `contacts` table (likely designating one as canonical).
2.  **Interaction Aggregation:** Crucially, all `message_logs` associated with the merged contacts must be reassigned to the canonical `contact_id`.
3.  **Edge Consolidation:** The respective `interactions` records (if they existed, though the unique constraint `(user_id, contact_id)` mitigates this for a single user) would need resolution. For the future scenario where Alaphia supports multiple principals sharing a network view, the `user_id` would become part of the composite key for relationship tracking.

## 6. Data Security and Privacy Note

The MVP schema is designed under the assumption that **Data Security and Privacy (GDPR/CCPA)** compliance regarding contact data access and deletion must be managed at the application and infrastructure layers (e.g., Auth0 scope enforcement, data retention policies). The database schema itself is designed around the `user_id` boundary to ensure data segmentation between different Alaphia clients. No PII fields are marked for anonymization within the structure itself, relying instead on access control provided by the User Aggregate Root.
