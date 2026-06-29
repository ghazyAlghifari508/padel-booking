# Graph Report - frontend  (2026-06-30)

## Corpus Check
- 44 files · ~10,840 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 100 nodes · 173 edges · 6 communities detected
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]

## God Nodes (most connected - your core abstractions)
1. `useAuth()` - 14 edges
2. `formatIDR()` - 12 edges
3. `Button()` - 11 edges
4. `cn()` - 11 edges
5. `PageHeader()` - 8 edges
6. `formatDate()` - 8 edges
7. `Input()` - 7 edges
8. `Guard()` - 6 edges
9. `Logo()` - 6 edges
10. `durationHours()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `ConfirmInner()` --calls--> `useAuth()`  [INFERRED]
  src\app\(app)\booking\confirm\page.tsx → src\lib\auth.tsx
- `MyBookingsInner()` --calls--> `useAuth()`  [INFERRED]
  src\app\(app)\my-bookings\page.tsx → src\lib\auth.tsx
- `ConfirmInner()` --calls--> `durationHours()`  [INFERRED]
  src\app\(app)\booking\confirm\page.tsx → src\lib\format.ts
- `ConfirmInner()` --calls--> `hasConflict()`  [INFERRED]
  src\app\(app)\booking\confirm\page.tsx → src\lib\availability.ts
- `Guard()` --calls--> `useAuth()`  [INFERRED]
  src\components\Guard.tsx → src\lib\auth.tsx

## Communities

### Community 0 - "Community 0"
Cohesion: 0.14
Nodes (5): EmptyState(), Field(), Input(), Select(), Modal()

### Community 1 - "Community 1"
Cohesion: 0.16
Nodes (7): ConfirmInner(), buildSlots(), hasConflict(), durationHours(), formatDateTime(), formatIDR(), overlaps()

### Community 2 - "Community 2"
Cohesion: 0.21
Nodes (8): PageHeader(), formatDate(), byDate(), countByStatus(), courtUsage(), revenue(), Stat(), StatusBadge()

### Community 3 - "Community 3"
Cohesion: 0.17
Nodes (6): BookingCard(), Guard(), RoleSwitcher(), AuthProvider(), useAuth(), MyBookingsInner()

### Community 4 - "Community 4"
Cohesion: 0.18
Nodes (3): CourtCard(), cn(), Logo()

### Community 5 - "Community 5"
Cohesion: 0.22
Nodes (1): Button()

## Knowledge Gaps
- **Thin community `Community 5`** (9 nodes): `bookingOf()`, `formatIDR()`, `markPaid()`, `set()`, `submit()`, `page.tsx`, `page.tsx`, `Button.tsx`, `Button()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useAuth()` connect `Community 3` to `Community 0`, `Community 1`, `Community 4`, `Community 5`?**
  _High betweenness centrality (0.211) - this node is a cross-community bridge._
- **Why does `formatIDR()` connect `Community 1` to `Community 0`, `Community 2`, `Community 4`, `Community 5`?**
  _High betweenness centrality (0.176) - this node is a cross-community bridge._
- **Why does `Button()` connect `Community 5` to `Community 0`, `Community 1`, `Community 2`, `Community 3`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `useAuth()` (e.g. with `ConfirmInner()` and `MyBookingsInner()`) actually correct?**
  _`useAuth()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._