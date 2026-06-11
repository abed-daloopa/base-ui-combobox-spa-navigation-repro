import { createFileRoute, Link } from "@tanstack/react-router"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/ui/item"

export const Route = createFileRoute("/")({ component: App })

type Fruit = { id: string; name: string; description: string }

const FRUITS: Array<Fruit> = [
  { id: "1", name: "Apple", description: "Malus domestica" },
  { id: "2", name: "Banana", description: "Musa acuminata" },
  { id: "3", name: "Cherry", description: "Prunus avium" },
  { id: "4", name: "Mango", description: "Mangifera indica" },
]

function App() {
  const anchorRef = useComboboxAnchor()

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <Combobox<Fruit> items={FRUITS}>
        <div ref={anchorRef}>
          <ComboboxInput
            className="h-12 w-80 text-base"
            placeholder="Search fruits…"
          />
        </div>
        <ComboboxContent anchor={anchorRef}>
          <ComboboxList>
            {(fruit: Fruit) => (
              <ComboboxItem
                key={fruit.id}
                value={fruit.name}
                render={
                  <Link to="/fruit/$fruitId" params={{ fruitId: fruit.id }} />
                }
              >
                <Item size="xs" className="p-0">
                  <ItemContent>
                    <ItemTitle>{fruit.name}</ItemTitle>
                    <ItemDescription>{fruit.description}</ItemDescription>
                  </ItemContent>
                </Item>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
