import type { Item } from '@/interfaces/item'
import { ItemRow } from './ItemRow'

interface ItemsListProps {
  items: Item[]
  onToggle: (item: Item) => void
  onDelete: (item: Item) => void
}

export function ItemsList({ items, onToggle, onDelete }: ItemsListProps) {
  if (items.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-[--card]">
        <p className="text-gray-400">Sua lista de compras está vazia!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <ItemRow
          key={item.id}
          item={item}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}