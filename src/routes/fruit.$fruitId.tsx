import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/fruit/$fruitId")({
  // A slow, BLOCKING loader. This is the crux of the repro: navigate() wraps
  // this in a React transition that stays suspended for the whole 5s. Base
  // UI's popup-unmount runs through `flushSync(setMounted(false))`, which
  // cannot commit while that transition is suspended — so the portaled
  // combobox popup is frozen on screen for the entire load.
  loader: async () => {
    await new Promise((resolve) => setTimeout(resolve, 5000))
    return null
  },
  component: FruitPage,
  pendingComponent: () => (
    <div className="flex min-h-svh items-center justify-center p-6">
      Loading…
    </div>
  ),
  pendingMs: 0,
})

const FRUIT_EMOJI_MAP = {
  Apple: "🍎",
  Banana: "🍌",
  Cherry: "🍒",
  Mango: "🥭",
}

function FruitPage() {
  const { fruitId } = Route.useParams()
  return (
    <div className="flex min-h-svh items-center justify-center p-6 text-6xl">
      {FRUIT_EMOJI_MAP[fruitId as keyof typeof FRUIT_EMOJI_MAP]}
    </div>
  )
}
