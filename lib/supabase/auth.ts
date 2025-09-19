import { createClient } from './server'
import { cookies } from 'next/headers'

export async function getSession() {
  const supabase = await createClient()

  try {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Erro ao obter sessão:', error)
      return null
    }

    return session
  } catch (error) {
    console.error('Erro inesperado ao obter sessão:', error)
    return null
  }
}

export async function getCurrentUser() {
  const supabase = await createClient()

  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      console.error('Erro ao obter usuário:', error)
      return null
    }

    return user
  } catch (error) {
    console.error('Erro inesperado ao obter usuário:', error)
    return null
  }
}

export async function signOut() {
  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Erro ao fazer sign out:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Erro inesperado ao fazer sign out:', error)
    return { success: false, error: 'Erro inesperado' }
  }
}