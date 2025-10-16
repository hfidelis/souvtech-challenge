import { Loader2 } from 'lucide-react'

export function FullScreenLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Loader2 className="w-8 h-8 text-purple-300 animate-spin" />
    </div>
  )
}