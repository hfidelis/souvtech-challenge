'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { usePageMetadata } from '@/app/hooks/useMetaData'
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

import { useAuthStore } from '@/store/auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { FullScreenLoader } from '@/components/shared/FullScreenLoader'

const loginSchema = z.object({
  email: z.string().email('Por favor, insira um e-mail válido.'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { login, loading, error, token } = useAuthStore()
  const [open, setOpen] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  usePageMetadata('Login - Lista de Compras', 'Página de login do aplicativo')

  useEffect(() => {
    if (token) {
      router.push('/items')
    } else {
      setIsCheckingAuth(false)
    }
  }, [token, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (values: LoginForm) => {
    const success = await login(values.email, values.password)
    if (!success) {
      setOpen(true)
      return
    }
    router.push('/items')
  }

  if (isCheckingAuth) {
    return <FullScreenLoader />
  }

  return (
    <>
      <div className="relative flex items-center justify-center min-h-screen w-full bg-background p-4">
        <Image
          src="/images/fruits-bg.png"
          alt="Plano de fundo de frutas"
          fill
          className="object-cover opacity-5 blur-sm"
          priority
          aria-hidden="true"
        />
        <Card className="relative w-full max-w-md bg-gray-500/10 backdrop-blur-md border border-gray-400/20 text-gray-100 shadow-2xl shadow-black/40 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-gray-100">
              SOUV - Shopping List
            </CardTitle>
            <CardDescription className="text-center text-gray-300 p-2 italic">
              Bem vindo de volta! Faça login para continuar e acessar sua lista.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-gray-300">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register('email')}
                  className="bg-gray-500/30 border-gray-400/50 text-gray-100 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background h-12 text-base rounded-lg"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-gray-300">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="bg-gray-500/30 border-gray-400/50 text-gray-100 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background h-12 text-base rounded-lg"
                />
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 h-12 text-base font-bold rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>

              <Button
                variant="link"
                onClick={() => router.push('/register')}
                className="mt-2 text-gray-300 hover:text-gray-100 underline cursor-pointer"
              >
                Não tem uma conta? Registre-se
              </Button>
            </form>
          </CardContent>
        </Card>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bg-gray-800/80 backdrop-blur-md text-gray-100 border-gray-700/50">
            <DialogHeader>
              <DialogTitle>Erro de login</DialogTitle>
              <DialogDescription className="text-gray-300">
                {error ||
                  'Credenciais inválidas. Verifique e tente novamente.'}
              </DialogDescription>
            </DialogHeader>
            <Button
              onClick={() => setOpen(false)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Fechar
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
