'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Head from 'next/head'
import { Loader2, LogOut } from 'lucide-react'
import { toast } from 'sonner'

import type { Item } from '@/interfaces/item'
import { useItems } from '../hooks/useItems'
import { useAuthStore } from '@/store/auth'

import { AddItemForm } from '@/components/items/AddItemForm'
import { ItemsList } from '@/components/items/ItemsList'
import { PaginationControls } from '@/components/items/PaginationControl'
import { ConfirmationDialog } from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { usePageMetadata } from '../hooks/useMetaData'

interface DialogState {
  isOpen: boolean
  title: string
  description: string
  onConfirm: () => void
}

export default function ItemsPage() {
  const router = useRouter()
  const logout = useAuthStore((state) => state.logout)
  const [page, setPage] = useState(1)
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  })

  usePageMetadata('Lista de Compras - SouvTech Shopping List', 'App de lista de compras')

  const {
    useListItems,
    useListCategories,
    useToggleItem,
    useDeleteItem,
  } = useItems(page)

  const { data: itemsResponse, isLoading: isLoadingItems } = useListItems()
  const { data: categories, isLoading: isLoadingCategories } =
    useListCategories()

  const toggleItemMutation = useToggleItem()
  const deleteItemMutation = useDeleteItem()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleToggle = (item: Item) => {
    setDialogState({
      isOpen: true,
      title: item.isBought ? 'Devolver Item?' : 'Marcar como Comprado?',
      description: `Você tem certeza que deseja ${
        item.isBought ? 'devolver' : 'marcar como comprado'
      } o item "${item.name}"?`,
      onConfirm: async () => {
        await toggleItemMutation.mutateAsync(item.id, {
          onSuccess: () => {
            toast.success('Status do item atualizado!')
            setDialogState({ ...dialogState, isOpen: false })
          },
          onError: () => toast.error('Erro ao atualizar item.'),
        })
      },
    })
  }

  const handleDelete = (item: Item) => {
    setDialogState({
      isOpen: true,
      title: 'Excluir Item?',
      description: `Você tem certeza que deseja excluir "${item.name}" da sua lista? Esta ação não pode ser desfeita.`,
      onConfirm: async () => {
        await deleteItemMutation.mutateAsync(item.id, {
          onSuccess: () => {
            toast.success('Item excluído com sucesso!')
            setDialogState({ ...dialogState, isOpen: false })
          },
          onError: () => toast.error('Erro ao excluir item.'),
        })
      },
    })
  }

  const totalPages = itemsResponse
    ? Math.ceil(itemsResponse.count / itemsResponse.page_size)
    : 1

  const renderContent = () => {
    if (isLoadingItems || isLoadingCategories) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      )
    }

    return (
      <>
        <div className="mb-8">
          <AddItemForm categories={categories || []} />
        </div>
        <ItemsList
          items={itemsResponse?.results || []}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
        {totalPages > 1 && (
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Lista de Compras - SouvTech Shopping List</title>
        <meta name="description" content="App de lista de compras" />
      </Head>

      <div className="relative w-full min-h-screen">
        <div className="absolute top-0 left-0 w-full h-[30dvh] -z-10">
          <Image
            src="/images/fruits-bg.png"
            alt="Plano de fundo de frutas"
            fill
            className="object-cover"
            priority
          />
        </div>

        <main className="flex flex-col items-center justify-center w-full min-h-screen p-4">
          <section className="w-full max-w-4xl min-h-[650px]">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-100">
                Lista de Compras
              </h1>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-gray-300 bg-accent hover:bg-muted hover:text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
            {renderContent()}
          </section>

          <ConfirmationDialog
            isOpen={dialogState.isOpen}
            onOpenChange={(isOpen) =>
              setDialogState({ ...dialogState, isOpen })
            }
            title={dialogState.title}
            description={dialogState.description}
            onConfirm={dialogState.onConfirm}
          />
        </main>
      </div>
    </>
  )
}