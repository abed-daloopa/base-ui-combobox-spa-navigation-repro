# Base UI Combobox popup frozen during slow SPA navigation

Selecting a Combobox item that triggers a slow route navigation leaves the popup
**stuck open on screen for the entire load**, instead of closing.

<https://github.com/user-attachments/assets/1ef00dad-cbe0-4ed7-a6ad-fc68d03d7122>

## Versions

`@base-ui/react@1.5.0` · `@tanstack/react-start@1.168` (SPA mode) · `react@19.2`

## Reproduce

```bash
bun install && bun dev   # http://localhost:5173
```

1. Open the combobox, select any fruit.
2. The destination route has a 5s blocking loader.
3. The popup stays frozen open for those 5s, overlapping the `Loading…` screen.

Expected: the popup closes/unmounts immediately on selection.

## Why

On select, the popup is closed (`open=false`) but Base UI keeps it mounted in a
portal until its close animation finishes — the unmount runs through
`flushSync(setMounted(false))` (`useAnimationsFinished` → `useOpenChangeComplete`).
`navigate()` wraps the transition in `startTransition`, and the blocking loader
keeps it **suspended**. In SPA mode the whole pending boundary is client-side, so
the source route (and its portal) stays in the suspended tree and the `flushSync`
unmount can't commit until the loader resolves.

Only reproduces in **SPA mode** (`tanstackStart({ spa: { enabled: true } })`) —
SSR resolves the navigation server-side and the popup unmounts normally.

## Key files

- `src/routes/index.tsx` — combobox; items navigate on select
- `src/routes/fruit.$fruitId.tsx` — 5s blocking loader
- `vite.config.ts` — `spa.enabled: true`
