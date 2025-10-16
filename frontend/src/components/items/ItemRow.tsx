import { MoreVertical } from 'lucide-react'
import type { Item } from '@/interfaces/item'
import { getCategoryInfo } from '@/lib/category.helpers'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ItemRowProps {
  item: Item
  onToggle: (item: Item) => void
  onDelete: (item: Item) => void
}

const unitMap = {
  UNIT: (q: number) => (q > 1 ? 'unidades' : 'unidade'),
  KILOGRAM: 'kg',
  LITER: (q: number) => (q > 1 ? 'litros' : 'litro'),
}

export function ItemRow({ item, onToggle, onDelete }: ItemRowProps) {
  const categoryInfo = item.category ? getCategoryInfo(item.category.name) : null

  const getUnitText = () => {
    const unit = unitMap[item.quantityType]
    return typeof unit === 'function' ? unit(item.quantity) : unit
  }

  return (
    <div className="flex items-center gap-4 rounded-lg bg-card p-4 transition-colors hover:bg-muted/50 border border-border">
      <Checkbox
        id={`item-${item.id}`}
        checked={item.isBought}
        onCheckedChange={() => onToggle(item)}
        className="h-5 w-5 rounded-[4px] border-[#A881E6] data-[state=checked]:bg-accent data-[state=checked]:border-accent"
      />
      <div className="flex-1">
        <label
          htmlFor={`item-${item.id}`}
          className={cn(
            'cursor-pointer font-medium transition-colors',
            item.isBought && 'text-muted-foreground line-through text-green-300',
          )}
        >
          {item.name}
        </label>
        <p
          className={cn(
            'text-sm text-muted-foreground',
            item.isBought && 'line-through text-green-300',
          )}
        >
          {item.quantity} {getUnitText()}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {categoryInfo && (
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              backgroundColor: `${categoryInfo.color}20`,
              color: categoryInfo.color,
            }}
          >
            <categoryInfo.Icon className="h-3.5 w-3.5" />
            <span>{categoryInfo.translation}</span>
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-[#A881E6] hover:bg-muted hover:text-foreground">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-card border-border">
            <DropdownMenuItem onSelect={() => onDelete(item)} className="cursor-pointer">
              Excluir
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onToggle(item)} className="cursor-pointer">
              {item.isBought ? 'Devolver' : 'Marcar como comprado'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

