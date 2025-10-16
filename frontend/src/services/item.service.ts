import axiosService from './axios.service'
import type { AxiosInstance } from 'axios'
import { Item, CreateItemDto, PaginatedResponse, Category } from '@/interfaces/item'

class ItemsService {
  private static instance: ItemsService
  private axios: AxiosInstance

  private constructor() {
    this.axios = axiosService.getAxios()
  }

  public static getInstance(): ItemsService {
    if (!ItemsService.instance) {
      ItemsService.instance = new ItemsService()
    }
    return ItemsService.instance
  }

  async listItems(page = 1, pageSize = 5): Promise<PaginatedResponse<Item>> {
    const { data } = await this.axios.get<PaginatedResponse<Item>>('items', {
      params: { page, page_size: pageSize },
    })
    return data
  }

  async listCategories(): Promise<Category[]> {
    const { data } = await this.axios.get<Category[]>('items/categories')
    return data
  }

  async createItem(payload: CreateItemDto): Promise<Item> {
    const { data } = await this.axios.post<Item>('items', payload)
    return data
  }

  async toggleIsBought(id: number): Promise<Item> {
    const { data } = await this.axios.patch<Item>(`items/${id}/toggle`)
    return data
  }

  async deleteItem(id: number): Promise<{ message: string }> {
    const { data } = await this.axios.delete<{ message: string }>(`items/${id}`)
    return data
  }
}

const itemsService = ItemsService.getInstance()

export default itemsService
