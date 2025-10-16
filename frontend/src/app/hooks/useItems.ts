import itemsService from '@/services/item.service'
import type { CreateItemDto } from '@/interfaces/item'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useItems(page: number, pageSize = 5) {
  const queryClient = useQueryClient()

  const useListItems = () =>
    useQuery({
      queryKey: ['items', page],
      queryFn: () => itemsService.listItems(page, pageSize),
    })

  const useListCategories = () =>
    useQuery({
      queryKey: ['categories'],
      queryFn: () => itemsService.listCategories(),
      staleTime: 1000 * 60 * 1440,
    })

  const useCreateItem = () =>
    useMutation({
      mutationFn: (payload: CreateItemDto) => itemsService.createItem(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['items'] })
      },
    })

  const useToggleItem = () =>
    useMutation({
      mutationFn: (id: number) => itemsService.toggleIsBought(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['items'] })
      },
    })

  const useDeleteItem = () =>
    useMutation({
      mutationFn: (id: number) => itemsService.deleteItem(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['items'] })
      },
    })

  return {
    useListItems,
    useListCategories,
    useCreateItem,
    useToggleItem,
    useDeleteItem,
  }
}