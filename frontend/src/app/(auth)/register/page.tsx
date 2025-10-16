'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

import { usePageMetadata } from '@/app/hooks/useMetaData'
import authService from '@/services/auth.service'
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

const registerSchema = z
  .object({
    email: z.string().email('Por favor, insira um e-mail válido.'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  })

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successDialogOpen, setSuccessDialogOpen] = useState(false)

  usePageMetadata('Registro - Lista de Compras', 'Crie sua conta no aplicativo')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (values: RegisterForm) => {
    setLoading(true)
    setError(null)
    try {
      await authService.register({ email: values.email, password: values.password })
      setSuccessDialogOpen(true)
    } catch (error) {
      setError('Este e-mail já está em uso. Tente outro.')
    } finally {
      setLoading(false)
    }
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
              Crie sua conta
            </CardTitle>
            <CardDescription className="text-center text-gray-300 pt-1">
              É rápido e fácil!
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

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">
                  Confirme sua senha
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  className="bg-gray-500/30 border-gray-400/50 text-gray-100 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-background h-12 text-base rounded-lg"
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 h-12 text-base font-bold rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                {loading ? 'Criando conta...' : 'Registrar'}
              </Button>
            </form>
            <p className="text-center text-sm text-gray-300 mt-6">
              Já tem uma conta?{' '}
              <Link href="/" className="font-semibold text-purple-300 hover:underline">
                Faça login
              </Link>
            </p>
          </CardContent>
        </Card>

        <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
          <DialogContent className="bg-gray-800/80 backdrop-blur-md text-gray-100 border-gray-700/50">
            <DialogHeader>
              <DialogTitle>✅ Conta criada com sucesso!</DialogTitle>
              <DialogDescription className="text-gray-300 pt-2">
                Agora você já pode fazer login com suas credenciais.
              </DialogDescription>
            </DialogHeader>
            <Button
              onClick={() => router.push('/')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Ir para Login
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog open={!!error} onOpenChange={() => setError(null)}>
          <DialogContent className="bg-gray-800/80 backdrop-blur-md text-gray-100 border-gray-700/50">
            <DialogHeader>
              <DialogTitle>❌ Erro no registro</DialogTitle>
              <DialogDescription className="text-gray-300 pt-2">
                {error}
              </DialogDescription>
            </DialogHeader>
            <Button
              onClick={() => setError(null)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Tentar novamente
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
