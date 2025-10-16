import { z } from 'zod'

export const itemSchema = z.object({
  name: z.string().min(1, { message: 'O nome do item é obrigatório.' }),
  quantity: z.coerce
    .number({
      error: 'A quantidade deve ser um número válido',
    })
    .min(0.1, { message: 'A quantidade deve ser maior que zero.' }),
  quantityType: z.enum(['UNIT', 'KILOGRAM', 'LITER']),
  categoryId: z.coerce
    .number({
      error: 'Selecione uma categoria',
    })
    .min(1, { message: 'Selecione uma categoria.' }),
})

export type CreateItemForm = z.infer<typeof itemSchema>
