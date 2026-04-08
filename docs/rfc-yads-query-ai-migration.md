# RFC: Migrate Weather AI App to Yads UI, TanStack Query, and TanStack AI

## Status

Draft

## Author

Codex

## Date

2026-04-02

## Summary

This RFC proposes refactoring the current weather app to:

- replace the local custom UI layer with `yads-ui`
- introduce `@tanstack/react-query` for server-state management
- replace the current Vercel AI SDK chat flow with TanStack AI
- adopt `json-renderer` for rendering structured AI widget payloads

This is not a pure UI migration. The UI swap is straightforward, but the data and AI layers require architectural changes.

## Current State

The app is currently:

- built on TanStack Router / TanStack Start
- using a custom UI layer under `src/components/ui`
- using direct weather fetches and tool execution without TanStack Query
- using Vercel AI SDK chat (`@ai-sdk/react`, `ai`, `@ai-sdk/google`) for streaming and tool calls

Key files:

- [package.json](/Users/gerieshandal/Workspace/weather-ai-tanstack/package.json)
- [src/routes/\_pathlessLayout/index.tsx](/Users/gerieshandal/Workspace/weather-ai-tanstack/src/routes/_pathlessLayout/index.tsx)
- [src/routes/api/weather.ts](/Users/gerieshandal/Workspace/weather-ai-tanstack/src/routes/api/weather.ts)
- [src/features/weather/index.ts](/Users/gerieshandal/Workspace/weather-ai-tanstack/src/features/weather/index.ts)
- [src/features/weather/tools/weatherInfo.ts](/Users/gerieshandal/Workspace/weather-ai-tanstack/src/features/weather/tools/weatherInfo.ts)
- [src/features/location/tools/userLocation.ts](/Users/gerieshandal/Workspace/weather-ai-tanstack/src/features/location/tools/userLocation.ts)
- [src/features/messages/MessagesContainer.tsx](/Users/gerieshandal/Workspace/weather-ai-tanstack/src/features/messages/MessagesContainer.tsx)
- [src/styles/app.css](/Users/gerieshandal/Workspace/weather-ai-tanstack/src/styles/app.css)

## Goals

- Standardize the app UI on `yads-ui`
- Move server-state and forecast fetching to TanStack Query
- Align the AI/chat layer with the TanStack ecosystem by using TanStack AI
- Improve cacheability, type safety, and route-data loading
- Keep the app shippable during migration through phased delivery
- Prepare the architecture for more AI tools later
- ai chat should render widgets using the json-renderer https://json-render.dev/

## Non-Goals

- Full visual redesign in the first pass
- Building a production-grade playlist write integration on day one
- Migrating all app behavior to route loaders immediately if a smaller Query-first step is cleaner
- Rewriting weather providers unless needed for data quality or cost reasons

## Relevant External Context

### Yads UI

`yads-ui` already exists locally at:

- `/Users/gerieshandal/Workspace/yads-ui`

The migration target should consume the published package:

- https://www.npmjs.com/package/@yaip/yads-ui

Relevant files:

- [src/docs/getting-started.mdx](/Users/gerieshandal/Workspace/yads-ui/src/docs/getting-started.mdx)
- [src/index.ts](/Users/gerieshandal/Workspace/yads-ui/src/index.ts)
- [src/client.ts](/Users/gerieshandal/Workspace/yads-ui/src/client.ts)
- [src/theme.css](/Users/gerieshandal/Workspace/yads-ui/src/theme.css)
- [package.json](/Users/gerieshandal/Workspace/yads-ui/package.json)

`yads-ui` is a packaged React 19 + Tailwind v4 component library with:

- server-safe exports from `@yaip/yads-ui`
- client component exports from `@yaip/yads-ui/client`
- required CSS setup via `@import "@yaip/yads-ui/theme.css"`
- required Tailwind v4 `@source` entry for the library dist

## Proposal

### 1. Replace the local UI primitives with `yads-ui`

The app currently has a partial local design system under `src/components/ui`. That should be replaced with `yads-ui` components where equivalents exist.

Expected mapping includes:

- `Alert` -> `Alert`
- `Card`, `CardContent` -> `Card`, `CardContent`
- `Textarea` -> `Textarea`
- `Skeleton` -> `Skeleton`
- `Button` -> `Button`
- `HStack` / `VStack` / `Box` -> `Stack`, `Group`, and regular layout classes

This migration should also simplify maintenance by removing duplicated primitive code from the app repo.

### 2. Introduce TanStack Query for weather and location data

Current weather fetches are invoked indirectly through AI tools. That works, but it hides the data layer inside tool execution and prevents standard caching/prefetch patterns.

Refactor weather and geocoding access into reusable query functions and query options:

- forecast by city
- forecast by coordinates
- reverse geocode for coordinates
- optional city search / location autocomplete

These query functions should be usable by:

- route loaders
- widgets
- AI tools

This creates one typed data surface instead of parallel fetch paths.

### 3. Replace Vercel AI SDK with TanStack AI

The current AI flow is:

- `useChat` from `@ai-sdk/react` in the home route
- `streamText` from `ai` in the server route
- tool definitions based on `tool(...)` from `ai`

TanStack AI should replace this with:

- TanStack AI chat state on the client
- TanStack AI server route / SSE integration
- typed tool definitions that separate browser-only and server-only behavior
- structured widget payloads rendered through `json-renderer`

This is the highest-risk part of the migration because it changes the protocol and abstractions used by the app, not just imports.

### 4. Render AI widgets through `json-renderer`

The assistant should not rely only on ad hoc message-part conditionals for rich output. Structured payloads should be emitted in a stable schema and rendered through `json-renderer`.

This should be used for:

- current weather widget output
- daily forecast widget output
- future tool-driven cards or multi-tool responses

This gives the app a cleaner path for adding more tools later without hardcoding each rendering case into the chat transcript component.

## Why This Direction

### Why `yads-ui`

- It already matches the project’s Tailwind v4 + React 19 stack.
- It provides a broader, more consistent component surface than the local custom primitives.
- You own the source, so missing components or migration pain can be fixed at the library level.

### Why TanStack Query

- Weather and location data are standard server-state problems.
- Query gives caching, deduplication, refetch behavior, and route-prefetch integration.
- It reduces coupling between widgets, tools, and direct fetch calls.

### Why TanStack AI

- It aligns the app with the rest of the TanStack stack.
- It should integrate more cleanly with Router/Start patterns long term.
- It avoids continuing to build around a mixed ecosystem where routing/data and AI use unrelated primitives.

### Why `json-renderer`

- It gives the chat UI an explicit structured rendering boundary.
- It reduces bespoke rendering logic in `MessagesContainer`.
- It makes future multi-tool output easier to add and reason about.

## Migration Tasks

### Phase 0: Baseline and package strategy

- Consume `yads-ui` from the published npm package.
- Confirm the target TanStack AI package/version and compatibility with the existing TanStack Start version.
- Add or update dependencies for Query and TanStack AI.
- Add `json-renderer` and define the first widget schema contracts.
- Record the migration seam in this RFC before code changes begin.

### Phase 1: `yads-ui` adoption

- Add `@yaip/yads-ui` and `@phosphor-icons/react`.
- Import `@yaip/yads-ui/theme.css` in the app stylesheet.
- Add Tailwind v4 `@source` for the library dist.
- Replace shared primitives in the app shell and feature components.
- Remove or deprecate redundant local primitives once replacements are stable.

### Phase 2: TanStack Query foundation

- Create a `QueryClient`.
- Add `QueryClientProvider` at the root.
- Start with component-level Query usage first.
- Add route-loader hydration/dehydration after the component-level migration if it materially improves SSR/prefetch behavior.
- Define query keys and query option factories for weather and location flows.
- Convert feature components to consume queries instead of hidden direct fetch paths where appropriate.

### Phase 3: AI migration to TanStack AI

- Replace `useChat` in the home route.
- Rebuild the `/api/weather` endpoint around TanStack AI server expectations.
- Port tool definitions:
  - `userLocation`
  - `weatherInfoWithCity`
  - `weatherInfoWithCoordinates`
- Preserve browser geolocation for client-side tool execution.
- Preserve streamed assistant responses and tool rendering behavior.
- Make TanStack AI the only chat path. No feature-flagged dual implementation.

### Phase 4: Structured widget rendering with `json-renderer`

- Define JSON schemas for forecast widgets.
- Emit structured assistant/tool payloads instead of relying on handwritten UI branching alone.
- Render weather results through `json-renderer`.
- Ensure the renderer can support additional tool/widget types later.

### Phase 5: Cleanup and hardening

- Remove dead Vercel AI SDK code.
- Remove obsolete local UI primitives.
- Add tests around Query loading, AI tool execution, and `json-renderer` widget rendering.
- Review SSR/client boundaries and bundle size.

## Detailed Work Breakdown

### UI migration work

- Audit all imports from `src/components/ui`
- Replace common primitives first
- Normalize spacing/layout using `Stack` and `Group`
- Re-test storybook-like component states in-app because visual parity is not guaranteed
- Decide whether any app-specific wrappers should remain

### Data layer work

- Extract reusable fetch/query modules for weather data
- Define stable query keys
- Decide which data is route-prefetched versus component-fetched
- Ensure AI tools reuse the same weather service layer used by Query

### AI layer work

- Redefine the client chat state contract
- Redefine the server streaming contract
- Port tool input/output schemas
- Define stable JSON widget contracts for weather responses
- Update message rendering to the new event/parts model if it differs from the current one
- Route structured outputs through `json-renderer`
- Preserve graceful fallback UI for in-flight tool calls

## Architecture After Migration

### UI

- `yads-ui` is the default component surface
- app-local UI code exists only for true app-specific composition

### Data

- weather and location data live behind shared query/service functions
- TanStack Query owns caching and stale/fresh behavior

### AI

- TanStack AI owns client chat state and server streaming
- tools call the same domain services used elsewhere in the app
- rich weather output is rendered via `json-renderer` from structured payloads

## Risks

### 1. TanStack AI migration risk

This is the biggest uncertainty. The current app already works with Vercel AI SDK, and TanStack AI is a real architecture change. The protocol, tool APIs, and rendering model may require non-trivial rewiring.

Mitigation:

- migrate UI and Query first
- isolate AI migration in its own phase
- keep the current weather domain services independent of the chat framework

### 2. SSR/client boundary issues with `yads-ui`

`yads-ui` has separate server-safe and client entry points. TanStack Start SSR boundaries need to be respected carefully.

Mitigation:

- import only server-safe components from `@yaip/yads-ui`
- import interactive components from `@yaip/yads-ui/client`
- validate route rendering after each component group migration

### 3. Tailwind v4 integration drift

If `theme.css` and `@source` are wired incorrectly, components may render unstyled or partially styled.

Mitigation:

- update stylesheet first
- verify one or two representative components before broader replacement

### 4. `json-renderer` schema drift

If widget payloads are not kept stable and typed, rendering will become brittle and tightly coupled to model output details.

Mitigation:

- define explicit schemas for renderer payloads
- validate tool/model outputs before rendering
- keep widget types versioned if payloads evolve

## Open Questions

1. Should we stop at component-level TanStack Query usage first, or also wire route-level prefetching in the same pass?

Clarification:

- component-level Query means widgets and pages call `useQuery(...)` directly and rely on client fetching/caching
- route-level prefetch means route loaders fetch/dehydrate Query data ahead of render so SSR and navigation can start with warm cache

Recommendation:

- first pass: component-level Query
- second pass: add route-level prefetch only where it improves UX enough to justify the extra complexity SKIP this

2. Would TanStack DB help in this migration?

Recommendation:

- no, not in the first pass

Reasoning:

- this app’s immediate problem is server-state fetching, cache orchestration, and AI/tool integration
- TanStack Query directly addresses that
- TanStack DB would only make sense if we later introduce a richer client-side entity graph, local-first sync patterns, or more complex relational state than simple weather/query results
- adding DB now would increase moving parts without solving the main migration risk

## Recommended First Delivery Slice

The lowest-risk order is:

1. wire `yads-ui`
2. add TanStack Query
3. refactor weather fetching behind shared query/service functions
4. migrate from Vercel AI SDK to TanStack AI
5. render weather widgets through `json-renderer`

This sequence keeps the highest-risk step isolated until the UI and data layers are already cleaner.

## Acceptance Criteria

- App uses `yads-ui` for its shared UI layer
- Weather data is fetched through TanStack Query-backed services
- Chat flow runs on TanStack AI instead of Vercel AI SDK
- Existing weather behavior still works:
  - ask for city weather
  - ask for current-location weather
  - stream assistant response
  - render current and daily forecast widgets
- weather widgets render through `json-renderer`

## Suggested Review Focus

Please review and comment on:

- migration sequencing
- whether the component-level Query first approach is the right initial scope
- whether TanStack DB should stay out of scope for this migration
- whether the `json-renderer` widget boundary is the right long-term rendering model

## References

- TanStack Query quick start: https://tanstack.com/query/latest/docs/framework/react/quick-start
- TanStack Router external data loading: https://tanstack.com/router/latest/docs/framework/react/guide/external-data-loading
- TanStack Router Query integration: https://tanstack.com/router/latest/docs/integrations/query
- TanStack AI overview: https://tanstack.com/ai/latest/docs/getting-started/overview
- TanStack AI quick start: https://tanstack.com/ai/latest/docs/getting-started/quick-start
- json-renderer: https://json-render.dev/
