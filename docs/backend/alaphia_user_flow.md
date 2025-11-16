# Alaphia - User Flow

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

## User Flow
USERFLOW DOCUMENTATION: ALAPHIA (MVP)
======================================

## 1. Overview and Design Philosophy

Alaphia is designed for experienced independent professionals (consultants, fractional executives) whose success relies on activating their weak ties. The user flows focus on three core activities: **Data Onboarding**, **Opportunity Definition (Intent Setting)**, and **Path Discovery**.

The User Experience (UX) will adhere to a modern, clean, SaaS aesthetic (Claap-like direction): minimalist layout, high whitespace, neutral backgrounds, and clean sans-serif typography. Clarity and information hierarchy are paramount, ensuring complex graph metrics are translated into actionable insights.

## 2. Core User Flows

### 2.1. Flow 1: Initial User Onboarding and Data Ingestion (The Foundation)

This flow establishes the user's foundational relationship graph.

**Goal:** Successfully ingest and process existing network data (LinkedIn, Gmail, CSV) to populate the graph database.

**Actors:** New Alaphia User (Consultant/Executive).

| Step | Description | System Interaction | Notes/Expected Outcome |
| :--- | :--- | :--- | :--- |
| **1.1** | User signs up/logs in via Auth0. | Auth0 Authorization | Initial session established. |
| **1.2** | User is directed to the "Network Setup" dashboard. | Initial UI Load | Presents clear options for data sources. |
| **1.3** | User selects data source (e.g., "Import CSV"). | User Action | Triggers the relevant Adapter (e.g., CSV Adapter). |
| **1.4** | User uploads data file (must contain required fields: First Name, Last Name, Email, Company, Position, etc.). | POST `/v1/ingest` (File payload) | Backend validates structure (`ingestion_data_validation`). |
| **1.5** | System queues ingestion and parsing tasks via Redis Streams. | Redis Pub/Sub | User is notified that ingestion is processing (asynchronous). |
| **1.6** | Ingestion Domain processes data, normalizes fields, and commits raw nodes/edges to Postgres. | Postgres Write | Raw contact list is established. |
| **1.7** | Post-Ingestion Enrichment Trigger: System calls GenAI enrichment service for all newly created/updated contacts (nodes and relevant edges). | Internal Microservice Call | Enrichment focuses on Role inference, Sector classification, and initial Sentiment/Tone analysis (MVP Scope). |
| **1.8** | Enrichment results (e.g., `role: \"Head of Growth\"`, `sector: \"HealthTech\"`) are persisted onto nodes/edges. | Postgres Update | Enriched graph data is ready for analysis. |
| **1.9** | User receives notification: "Network successfully imported and enriched." | UI Notification | User proceeds to Intent Setting or Graph Visualization. |

### 2.2. Flow 2: Defining an Opportunity Intent (The Query)

This flow allows the user to translate a business goal into a computable query against the network graph.

**Goal:** Define a specific target outcome that the pathfinding engine can resolve.

**Actors:** Returning Alaphia User.

| Step | Description | System Interaction | Notes/Expected Outcome |
| :--- | :--- | :--- | :--- |
| **2.1** | User navigates to the "Intents" section (Clean UI Card). | UI Navigation | Focus is on clarity: What do I want to achieve? |
| **2.2** | User defines the intent request (e.g., "Find a path to a VP of Marketing at a Series B SaaS company in NYC"). | User Input Field | The input maps directly to the structured `intent_structure_and_usage`. |
| **2.3** | User saves or executes the intent. | POST `/v1/intents` (Request body) | The system receives the unstructured text request. |
| **2.4** | Intent Domain parses the request using GenAI to extract structured parameters: Target Role, Target Sector, Target Geography, etc. | Internal GenAI Parsing | Converts the natural language request into formalized search criteria. |
| **2.5** | The structured intent is stored (or passed directly) to the Path Domain for immediate computation. | Internal Message/Port Call | The system transitions immediately to Path Discovery (Flow 3). |

### 2.3. Flow 3: Path Discovery and Activation (The Output)

This is the core value proposition, calculating the optimal connection routes based on enriched data and relationship scores.

**Goal:** Receive 2-3 actionable, warm connection paths leading from the user to the defined intent target.

**Actors:** Returning Alaphia User (post-Intent definition).

| Step | Description | System Interaction | Notes/Expected Outcome |
| :--- | :--- | :--- | :--- |
| **3.1** | The Path Domain receives the structured Intent (from Flow 2) and the enriched Graph (from Flow 1). | Graph Query Initiation | Utilizes weighted graph traversal algorithms. |
| **3.2** | **Path Weighting Calculation:** For every potential edge in the path, the system calculates the Trust Score (T) and applies GenAI Intent Alignment relevance factors. | Graph Heuristics Engine | Trust Score $T = 0.4R + 0.3F_{recency} + 0.2V_{sentiment} + 0.1C_{context}$ is used for edge weight normalization. |
| **3.3** | **Warm Pathfinding:** The engine computes paths (limit 2-3 hops) optimized for the highest cumulative (or average) Trust Score, prioritizing "warm" edges. | Graph Algorithm Execution | Paths that leverage high `WarmthScore` connections are preferred over long, cold routes. |
| **3.4** | System retrieves metadata for path visualization: intermediary names, their current Trust Score, and the context/reason for the connection. | Postgres Read (Nodes/Edges) | Gathers sufficient context to justify the path (e.g., "You worked with [Mediator] on Project X"). |
| **3.5** | Results are returned to the UI via GET `/v1/paths`. | GET `/v1/paths` | Response contains an ordered list of paths. |
| **3.6** | **Path Visualization (UX):** The UI renders the top 3 paths using the minimalist, card-based design. | UI Rendering | Paths are displayed sequentially (Path 1 is warmest/shortest). Each step shows the **Contact Name**, **Trust Score**, and **Connection Context**. |
| **3.7** | User inspects Path 1, seeing the suggested intermediary and the suggested outreach context (derived from GenAI insights). | User Interaction | User confirms the path is actionable. |

## 3. Interaction Patterns and Detail Views

### 3.1. Contact Node Detail View (Trust Quantification)

When a user clicks an intermediary in a path, a modal/drawer opens displaying the detailed relationship metrics, reflecting the trust quantification model.

**Key Display Elements:**

*   **Overall Warmth Score (0-100):** Prominently displayed.
*   **Breakdown Charts:** Visual representation of the five components of `WarmthScore`:
    *   Base Connection (Static)
    *   Message Volume (Quantity)
    *   Recency (Freshness)
    *   Frequency (Consistency)
    *   Response Balance (Reciprocity)
*   **Reciprocity Ratio (R):** Displayed as a 0-1 meter showing balance of outreach.
*   **GenAI Context Snippets:** Extracted insights like inferred expertise ("High expertise in B2B SaaS pricing strategies") or recent sentiment tone.

### 3.2. Intent Path Step Detail (Activation Context)

When viewing a specific connection point on a suggested path (e.g., connecting User -> Mediator -> Target), the system displays the handover context.

*   **The Ask:** What the user is asking the Mediator for (implicit in the Intent).
*   **The Bridge Context:** Data explaining *why* the Mediator knows the Target, or why they are a good bridge (e.g., "Mediator and Target worked together at Acme Corp 2019-2021").
*   **Recommended Outreach Starter:** A lightweight, AI-generated opening line designed to leverage the historical relationship context without being awkward (e.g., "Hi [Mediator], hope you're well. I saw your recent post on [Topic X]. I'm currently exploring [Intent Goal], and given your background with [Target Contact], I was hoping you might know the best way to connect...").

## 4. API Interaction Patterns (MVP Focus)

All primary external interactions utilize the REST API under `/v1`.

| Endpoint | HTTP Method | Function | Data Flow Implication |
| :--- | :--- | :--- | :--- |
| `/v1/ingest` | POST | Bulk contact upload (CSV/JSON). | Triggers Ingestion Domain and subsequent Redis Stream events for enrichment. |
| `/v1/intents` | POST | Define a new opportunity/search query. | Triggers Intent Domain parsing and immediately invokes Path Domain computation. |
| `/v1/paths` | GET | Retrieve the current computed paths for the user's active/last intent. | Fetches pre-calculated (or calculated on-demand) results from the Path Domain store. |
| `/docs` | GET | Access OpenAPI/Swagger documentation. | For developer reference; UX should align with the minimalist product aesthetic. |
