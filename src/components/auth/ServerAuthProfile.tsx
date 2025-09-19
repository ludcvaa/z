'use client'

import { useState, useEffect } from 'react'
import { useServerAuth } from '@/hooks/useServerAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

export function ServerAuthProfile() {
  const { getProfile, updateProfile, loading, error } = useServerAuth()
  const [profile, setProfile] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    avatarUrl: '',
  })
  const [updateResult, setUpdateResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const result = await getProfile()
    if (result.success && result.data) {
      setProfile(result.data)
      setFormData({
        fullName: result.data.fullName || '',
        avatarUrl: result.data.avatarUrl || '',
      })
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await updateProfile(formData)
    setUpdateResult(result)

    if (result.success) {
      setIsEditing(false)
      await loadProfile() // Recarregar perfil
    }
  }

  if (loading && !profile) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Perfil do Usuário</h3>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancelar' : 'Editar'}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {updateResult && (
        <Alert variant={updateResult.success ? 'default' : 'destructive'}>
          {updateResult.success ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          <AlertDescription>{updateResult.message}</AlertDescription>
        </Alert>
      )}

      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <Label htmlFor="avatarUrl">URL do Avatar</Label>
            <Input
              id="avatarUrl"
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              placeholder="https://exemplo.com/avatar.jpg"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div>
            <strong>Nome:</strong> {profile?.fullName || 'Não informado'}
          </div>
          <div>
            <strong>Email:</strong> {profile?.email}
          </div>
          <div>
            <strong>ID:</strong> {profile?.id}
          </div>
          <div>
            <strong>Provider:</strong> {profile?.provider || 'Email'}
          </div>
          <div>
            <strong>Criado em:</strong> {new Date(profile?.createdAt).toLocaleDateString('pt-BR')}
          </div>
          {profile?.avatarUrl && (
            <div>
              <strong>Avatar:</strong>
              <div className="mt-2">
                <img
                  src={profile.avatarUrl}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}