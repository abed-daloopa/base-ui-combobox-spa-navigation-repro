import { createFileRoute, Link } from "@tanstack/react-router"
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

export const Route = createFileRoute("/")({ component: App })

const FRUITS = ["Apple", "Banana", "Cherry", "Mango"]

function App() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <Combobox items={FRUITS}>
        <ComboboxInput className="w-80" placeholder="Search fruits…" />
        <ComboboxContent>
          <ComboboxList>
            {(fruit: string) => (
              <ComboboxItem
                key={fruit}
                value={fruit}
                render={
                  <Link to="/fruit/$fruitId" params={{ fruitId: fruit }} />
                }
              >
                {fruit}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
