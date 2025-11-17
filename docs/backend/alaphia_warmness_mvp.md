# Alaphia — Warmness Heuristics & Graph Logic (MVP)
## Markdown Canvas – Ready for Cursor Rules / Notion

## 1. Data Sources & Parsing Rules

### 1.1 LinkedIn Connections (../data_sources/Connections.csv)

Columns after skipping:
- First Name
- Last Name
- URL
- Email Address
- Company
- Position
- Connected On

Implementation requirements:
- Skip first 2 lines
- Parse Connected On into a Date object
- Normalize URLs
- Use URL as unique key

### 1.2 LinkedIn Messages (../data_sources/messages.csv)

Columns:
- CONVERSATION ID
- FROM
- SENDER PROFILE URL
- TO
- RECIPIENT PROFILE URLS
- DATE
- SUBJECT
- CONTENT
- FOLDER
- ATTACHMENTS
- IS MESSAGE DRAFT
- IS CONVERSATION DRAFT

---

## 2. Warmness Heuristics (Direct Tie Only)

### 2.1 Interaction Frequency (F)
F = log(1 + totalMessages) / log(1 + maxMessagesAllContacts)

### 2.2 Recency (R)
R = exp(-daysSinceLastMessage / 180)

### 2.3 Reciprocity (H)
H = 1 - |pMe - pContact|

### 2.4 Thread Intensity / Depth (D)
D = 0.6 * normMaxThread + 0.4 * normAvgLen

### 2.5 Tone Warmth (S)
Based on positive patterns: thank, merci, appreciate, great speaking, happy to, pleasure, au plaisir.

### 2.6 Duration of Tie (T)
T = daysSinceConnection / (365*5)

---

## 3. Warmness Final Score

W = 
0.25*F +
0.20*R +
0.15*H +
0.15*D +
0.15*S +
0.10*T

---

## 4. Graph Design (MVP)

Nodes:
- me
- all contacts

Edges:
- me ↔ contact

Attributes:
- warmness
- probability

---

## 5. Path Computation

Edge cost:
cost = -log(p) + lambdaHop

Use Dijkstra (generic, not star-specific)

---

## 6. Centrality

Top warm contacts = edges sorted by warmness.

---

## 7. Cursor Requirements

- Strict TypeScript
- Dedicated modules (parsing, scoring, graph, pathfinding)
- Never mix concerns

---

## 8. Future Expansion
Support multi-hop paths, Gmail, Calendar, WhatsApp, CRM signals, shared groups, LLM-based depth.
