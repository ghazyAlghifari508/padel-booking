# Graph Report - padel-booking  (2026-06-29)

## Corpus Check
- 44 files · ~23,118 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 94 nodes · 150 edges · 6 communities detected
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]

## God Nodes (most connected - your core abstractions)
1. `Button()` - 13 edges
2. `formatIDR()` - 13 edges
3. `useAuth()` - 12 edges
4. `cn()` - 12 edges
5. `PageHeader()` - 8 edges
6. `formatDate()` - 7 edges
7. `Guard()` - 6 edges
8. `Logo()` - 6 edges
9. `Modal()` - 5 edges
10. `StatusBadge()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Guard()` --calls--> `useAuth()`  [INFERRED]
  src\components\Guard.tsx → src\lib\auth.tsx
- `RoleSwitcher()` --calls--> `useAuth()`  [INFERRED]
  src\components\RoleSwitcher.tsx → src\lib\auth.tsx

## Communities

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (7): CourtCard(), buildSlots(), hasConflict(), durationHours(), formatDateTime(), formatIDR(), overlaps()

### Community 1 - "Community 1"
Cohesion: 0.2
Nodes (8): PageHeader(), formatDate(), byDate(), countByStatus(), courtUsage(), revenue(), Modal(), StatusBadge()

### Community 2 - "Community 2"
Cohesion: 0.18
Nodes (4): Guard(), RoleSwitcher(), AuthProvider(), useAuth()

### Community 3 - "Community 3"
Cohesion: 0.18
Nodes (2): cn(), Logo()

### Community 4 - "Community 4"
Cohesion: 0.17
Nodes (1): Button()

### Community 5 - "Community 5"
Cohesion: 0.29
Nodes (2): BookingCard(), EmptyState()

## Knowledge Gaps
- **Thin community `Community 3`** (13 nodes): `cn()`, `AdminSidebar.tsx`, `Navbar.tsx`, `Card.tsx`, `Input.tsx`, `misc.tsx`, `Modal.tsx`, `StatusBadge.tsx`, `cn.ts`, `Card()`, `cn()`, `Logo()`, `Skeleton()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 4`** (12 nodes): `openEdit()`, `openNew()`, `save()`, `toggleStatus()`, `submit()`, `set()`, `submit()`, `page.tsx`, `page.tsx`, `page.tsx`, `Button.tsx`, `Button()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 5`** (7 nodes): `BookingCard()`, `doCancel()`, `page.tsx`, `page.tsx`, `page.tsx`, `EmptyState.tsx`, `EmptyState()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `formatIDR()` connect `Community 0` to `Community 1`, `Community 2`, `Community 4`?**
  _High betweenness centrality (0.206) - this node is a cross-community bridge._
- **Why does `Button()` connect `Community 4` to `Community 0`, `Community 1`, `Community 2`, `Community 3`, `Community 5`?**
  _High betweenness centrality (0.202) - this node is a cross-community bridge._
- **Why does `useAuth()` connect `Community 2` to `Community 0`, `Community 3`, `Community 4`, `Community 5`?**
  _High betweenness centrality (0.184) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `useAuth()` (e.g. with `Guard()` and `RoleSwitcher()`) actually correct?**
  _`useAuth()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._