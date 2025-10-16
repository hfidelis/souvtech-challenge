'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

import { getCategoryInfo } from '../../lib/category.helpers'
import { CreateItemForm, itemSchema } from '../../lib/schemas'
import { useItems } from '@/app/hooks/useItems'
import type { Category } from '@/interfaces/item'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface AddItemFormProps {
  categories: Category[]
}

export function AddItemForm({ categories }: AddItemFormProps) {
  const { useCreateItem } = useItems(1)
  const createItemMutation = useCreateItem()
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  )

  const form = useForm<CreateItemForm>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: '',
      quantity: 1,
      quantityType: 'UNIT',
      categoryId: undefined,
    },
  })

  async function onSubmit(data: CreateItemForm) {
    await createItemMutation.mutateAsync(data, {
      onSuccess: () => {
        toast.success('Item adicionado com sucesso!')
        form.reset()
        setSelectedCategoryId(null)
      },
      onError: (error) => {
        toast.error('Erro ao adicionar item.', {
          description: 'Por favor, tente novamente mais tarde.',
        })
        console.error(error)
      },
    })
  }

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId)
  const selectedCategoryInfo = selectedCategory
    ? getCategoryInfo(selectedCategory.name)
    : null

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row items-end gap-4 w-full"
      >
        <div className="w-full sm:w-1/2">
          <FormField<CreateItemForm>
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Item</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Maçã" {...field} />
                </FormControl>
                <div className="min-h-5">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>

  <div className="w-full sm:w-1/2 flex items-end gap-4 flex-nowrap">
          <div className="flex items-end gap-0">
            <FormField<CreateItemForm>
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem className="w-28 flex-shrink-0">
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      className="rounded-r-none"
                      {...field}
                    />
                  </FormControl>
                  <div className="min-h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField<CreateItemForm>
              control={form.control}
              name="quantityType"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-20 rounded-l-none border-l-0">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="UNIT">un.</SelectItem>
                      <SelectItem value="KILOGRAM">kg</SelectItem>
                      <SelectItem value="LITER">L</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="min-h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField<CreateItemForm>
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="flex-1 min-w-0">
                <FormLabel>Categoria</FormLabel>
                <div className="flex items-end gap-2">
                  <div className="flex-1 min-w-0">
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedCategoryId(Number(value))
                      }}
                      value={field.value ? String(field.value) : ''}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full text-left">
                          {selectedCategoryInfo ? (
                            <div className="flex items-center gap-2">
                              <selectedCategoryInfo.Icon
                                style={{ color: selectedCategoryInfo.color }}
                                className="h-4 w-4"
                              />
                              <span style={{ color: selectedCategoryInfo.color }}>
                                {selectedCategoryInfo.translation}
                              </span>
                            </div>
                          ) : (
                            <SelectValue placeholder="Selecione" />
                          )}
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => {
                          const info = getCategoryInfo(category.name)
                          if (!info) return null
                          return (
                            <SelectItem key={category.id} value={String(category.id)}>
                              <div className="flex items-center gap-2">
                                <info.Icon
                                  style={{ color: info.color }}
                                  className="h-4 w-4"
                                />
                                <span>{info.translation}</span>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    disabled={createItemMutation.isPending}
                    className="h-10 w-10 flex-shrink-0 p-0 bg-[#7450AC] rounded-full text-white hover:bg-[#523480]"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>

                <div className="min-h-5">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}
