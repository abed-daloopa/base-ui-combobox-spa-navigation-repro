# Base UI Combobox popup frozen when a fallback replaces the selecting tree

Selecting a Combobox item that triggers a slow, **suspending** state change
leaves the popup **stuck open on screen for the entire load**, instead of
closing.

<https://github.com/user-attachments/assets/1ef00dad-cbe0-4ed7-a6ad-fc68d03d7122>

## Versions

`@base-ui/react@1.5.0` · `react@19.2`

## Reproduce

```bash
bun install && bun dev
```

1. Open the combobox, select any fruit.
2. Selecting suspends for 5s; `<Suspense>` shows its `Loading…` fallback.
3. The popup stays frozen open over `Loading…` for those 5s, then disappears.

Expected: the popup closes/unmounts immediately on selection.

## Why

On select the popup closes (`open=false`), but Base UI keeps it portaled until
the close animation finishes, deferring the unmount to
`flushSync(setMounted(false))` (`useAnimationsFinished` → `useOpenChangeComplete`).

If, before that deferred unmount runs, the **subtree that owns the combobox is
torn down and replaced by a pending/fallback UI** — a React `<Suspense>` fallback
here, or TanStack Router's `pendingComponent` in the original report — the owner
of the popup's `mounted` state is gone, so the `flushSync` can't commit and the
portaled popup is orphaned on screen until the boundary resolves.

It's the **teardown of the source subtree** that orphans the popup, not a pending
transition:

- A plain suspending `setState` that shows a `<Suspense>` fallback **reproduces**
  it — no router, no `startTransition` (this repro).
- Wrapping the same update in `startTransition` **prevents** it: React keeps the
  committed tree mounted, so the deferred `flushSync` commits and the popup closes.

TanStack SPA mode hits this because `pendingMs: 0` renders the route's
`pendingComponent` (tearing down the source route) while the blocking loader runs;
its `startTransition` is incidental. SSR unmounts normally.

## Key files

- `src/routes/index.tsx` — combobox + `<Suspense>`; selecting suspends 5s (no router navigation)
