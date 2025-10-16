import {
  Milk,
  Beef,
  Carrot,
  Sandwich,
  Apple,
  type LucideIcon,
} from 'lucide-react'

export interface CategoryInfo {
  id: number
  name: 'bakery' | 'drink' | 'meat' | 'vegetable' | 'fruit'
  translation: string
  Icon: LucideIcon
  color: string
}

export const categoryInfoMap: Record<string, Omit<CategoryInfo, 'id' | 'name'>> = {
  bakery: {
    translation: 'Padaria',
    Icon: Sandwich,
    color: '#BB9F3A',
  },
  drink: {
    translation: 'Bebidas',
    Icon: Milk,
    color: '#7B94CB',
  },
  meat: {
    translation: 'Carnes',
    Icon: Beef,
    color: '#DB5BBF',
  },
  vegetable: {
    translation: 'Legumes',
    Icon: Carrot,
    color: '#8CAD51',
  },
  fruit: {
    translation: 'Frutas',
    Icon: Apple,
    color: '#E07B67',
  },
}

export const getCategoryInfo = (
  name: string,
): Omit<CategoryInfo, 'id' | 'name'> | null => {
  return categoryInfoMap[name] || null
}
