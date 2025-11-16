# Alaphia - Styling Guidelines

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

## Styling Guidelines
ALAPHIA STYLING GUIDELINES DOCUMENT

1. INTRODUCTION AND VISION

1.1. Purpose
This document outlines the foundational styling principles, visual language, and design direction for the Alaphia platform and its associated documentation (including the generated Swagger/Redoc interfaces). It ensures a cohesive, modern, and professional user experience aligned with the needs of experienced consultants and independent professionals.

1.2. Design Philosophy: Modern Minimalism & Clarity
Alaphia’s styling prioritizes function over ornamentation. The design direction is inspired by modern SaaS tools like Claap, emphasizing clarity, readability, and a sense of sophisticated utility. The aesthetic must support the complex nature of relationship intelligence without overwhelming the user.

Core Tenets:
*   **Clarity Above All:** Visual elements should immediately direct the user toward actionable insights (paths, scores, intents).
*   **Professional Trust:** The interface must convey reliability and precision, mirroring the high-trust environments our users operate in.
*   **Whitespace as Structure:** Generous use of negative space to separate complex data visualizations (the graph) and segment information blocks.

2. COLOR PALETTE

The palette is restrained, utilizing neutrals for structure and one subtle primary accent for focus.

2.1. Primary Colors (Neutrals)
These colors form the canvas for the application, ensuring high contrast and low visual fatigue during intensive analysis.

| Name | Hex Code | Usage |
| :--- | :--- | :--- |
| Background: Canvas | #FFFFFF | Primary application background, documentation pages. |
| Background: Panel/Card | #F9FAFB | Elevated surfaces, modal backgrounds, card backgrounds. |
| Text: Primary | #111827 | Main body copy, headings, critical data points. |
| Text: Secondary | #6B7280 | Supporting text, labels, metadata, disabled states. |
| Border/Divider | #E5E7EB | Subtle separation lines, card borders, input outlines. |

2.2. Accent Color (Action & Data Emphasis)
The accent color is used sparingly to guide the user toward primary actions, highlight high-value connections, or denote positive sentiment/relevance scores.

| Name | Hex Code | Usage |
| :--- | :--- | :--- |
| Primary Accent | #3B82F6 | (Blue - Standard SaaS Action Color) Primary buttons, active states, interactive elements, primary path indicators. |
| Accent Light | #EFF6FF | Hover states, subtle backgrounds for selected items. |

2.3. Data Visualization Colors (Graph & Scores)
Colors used to represent the calculated metrics on nodes and edges.

| Metric | Color Range/Role | Rationale |
| :--- | :--- | :--- |
| Warmth Score / Trust Score | Gradient from Soft Yellow (#FCD34D) to Primary Accent Blue (#3B82F6) | Yellow for low/medium trust; Blue for high trust. |
| Sentiment (GenAI) | Green (#10B981) for positive; Red (#EF4444) for negative/tension. | Direct visual representation of relationship tone. |

3. TYPOGRAPHY

Alaphia uses clean, highly legible sans-serif fonts suitable for data-heavy interfaces and API documentation.

3.1. Font Family
*   **Primary Font:** System Default Sans-Serif (e.g., Inter, Roboto, or OS default like SF Pro/Segoe UI). This ensures excellent rendering performance and platform familiarity.

3.2. Hierarchy and Sizing
Headings should be used strictly to establish hierarchy, particularly in the documentation interface.

| Element | Font Weight | Size (Relative/Approx.) | Usage Example |
| :--- | :--- | :--- | :--- |
| H1 (Document Title) | Bold (700) | 2.25rem | STYLING GUIDELINES DOCUMENT |
| H2 (Section Heading) | Semi-Bold (600) | 1.5rem | 2. COLOR PALETTE |
| H3 (Subsection Heading) | Semi-Bold (600) | 1.25rem | 2.1. Primary Colors (Neutrals) |
| Body Text | Regular (400) | 1rem | General descriptive text. |
| Small Text / Labels | Regular (400) | 0.875rem | Metadata, scores, graph labels. |
| Code/API Snippets | Monospace (e.g., Consolas) | 0.9rem | Showing JSON examples, endpoint paths. |

4. UI/UX PRINCIPLES

4.1. Component Styling
*   **Cards and Containers:** All primary data containers (contact cards, path result boxes, configuration panels) must utilize a light background (#FFFFFF or #F9FAFB) with **subtle rounded corners (e.g., 8px radius)**.
*   **Shadows:** Use **soft, low-opacity drop shadows** to elevate components from the background canvas, reinforcing the "floating" or layered nature of the intelligence visualization. Avoid harsh, dark shadows.
*   **Inputs and Buttons:** Inputs should have subtle 1px borders (#E5E7EB) that gain a light blue (Accent Light) ring on focus. Primary buttons use the full Primary Accent Blue fill.

4.2. Whitespace and Layout
Layouts must adhere to a generous grid system, prioritizing whitespace (negative space).
*   **Padding:** Internal padding within components should be generous (e.g., 24px vertical/horizontal) to prevent density, especially around textual information derived from GenAI enrichment.
*   **Section Separation:** Major functional areas (Network View, Intent Definition, Path Results) should be clearly delineated using ample vertical space or subtle background shifts.

4.3. Data Visualization Cues
*   **Graph Elements:** Nodes (Contacts) should be visually distinct, perhaps as circles or rounded rectangles. Edges (Relationships) should be simple lines, weighted or colored based on their derived **WarmthScore** or **Trust Score**.
*   **Heuristic Visibility:** Scores (WarmthScore, Reciprocity Ratio) derived from the backend heuristics must be displayed clearly using the appropriate data visualization colors, allowing the consultant to immediately assess relationship quality.

4.4. Documentation Styling (Swagger/Redoc Integration)
To maintain visual consistency with the product, the API documentation interface (Swagger/Redoc) must adhere to these styles:
1.  **Background:** Set documentation container backgrounds to pure white (#FFFFFF).
2.  **Code Blocks:** Use the designated Monospace font with a light gray background (#F9FAFB) for request/response examples, ensuring excellent contrast for the Primary Text color.
3.  **Endpoint Highlighting:** Use the Primary Accent Blue (#3B82F6) to highlight the active endpoint or method (GET, POST) being viewed.
4.  **Minimalist Focus:** Ensure any default documentation chrome (lines, dividers) aligns with the Border/Divider color (#E5E7EB).

5. USAGE CONSTRAINTS

5.1. Constraint Adherence
*   **Maximum Scale:** While the styling aims for scalability, the current design is optimized for clarity up to 10,000 connections. Visual density must be managed rigorously in the graph view as this threshold is approached.
*   **No Over-Styling:** Avoid complex gradients, heavy textures, or non-standard UI elements. The focus remains on the data and the paths calculated by the backend.
