import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/fruit/$fruitId")({
  // A slow, BLOCKING loader.
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
