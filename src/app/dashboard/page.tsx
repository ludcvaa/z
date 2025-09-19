'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/Header'

function DashboardContent() {
  const { user, signOut } = useAuth()

  return (
    <div>
      <Header />
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Bem-vindo, {user?.user_metadata?.full_name || user?.email}
            </span>
            <Button onClick={signOut} variant="outline">
              Sair
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-semibold mb-4">Projetos</h2>
            <p className="text-gray-600">Gerencie seus projetos e tarefas</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-semibold mb-4">Tarefas</h2>
            <p className="text-gray-600">Acompanhe suas tarefas diárias</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-semibold mb-4">Análises</h2>
            <p className="text-gray-600">Veja suas estatísticas de produtividade</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Informações do Usuário</h2>
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong>Email:</strong> {user?.email}
              </div>
              <div>
                <strong>ID:</strong> {user?.id}
              </div>
              <div>
                <strong>Nome:</strong> {user?.user_metadata?.full_name || 'Não informado'}
              </div>
              <div>
                <strong>Provider:</strong> {user?.app_metadata?.provider || 'Email'}
              </div>
              <div>
                <strong>Criado em:</strong> {new Date(user?.created_at || '').toLocaleDateString('pt-BR')}
              </div>
              <div>
                <strong>Último login:</strong> {new Date(user?.last_sign_in_at || '').toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}