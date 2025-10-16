export interface CreateItemDto {
  name: string
  categoryId: number
  quantity: number
  quantityType: 'KILOGRAM' | 'UNIT' | 'LITER'
}

export interface Category {
  id: number
  name: string
}

export interface PaginatedResponse<T> {
  page: number
  page_size: number
  count: number
  results: T[]
}

export interface Item {
  id: number
  name: string
  category: Category
  categoryId: number
  quantityType: 'KILOGRAM' | 'UNIT' | 'LITER'
  quantity: number
  isBought: boolean
  createdAt: string
  updatedAt: string
}
