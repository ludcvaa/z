'use client'

import { useState } from 'react'
import {
  signInAction,
  signUpAction,
  signOutAction,
  resetPasswordAction,
  updatePasswordAction,
  updateProfileAction,
  getProfileAction,
  type SignInInput,
  type SignUpInput,
  type UpdatePasswordInput,
  type UpdateProfileInput,
} from '@/server-actions/auth'

interface UseServerAuthReturn {
  signIn: (data: SignInInput) => Promise<{ success: boolean; message: string; data?: any }>
  signUp: (data: SignUpInput) => Promise<{ success: boolean; message: string; data?: any }>
  signOut: (options?: { redirectTo?: string }) => Promise<{ success: boolean; message: string }>
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>
  updatePassword: (data: UpdatePasswordInput) => Promise<{ success: boolean; message: string }>
  updateProfile: (data: UpdateProfileInput) => Promise<{ success: boolean; message: string; data?: any }>
  getProfile: () => Promise<{ success: boolean; message: string; data?: any }>
  loading: boolean
  error: string | null
}

export function useServerAuth(): UseServerAuthReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signIn = async (data: SignInInput) => {
    setLoading(true)
    setError(null)

    try {
      const result = await signInAction(data)
      if (!result.success) {
        setError(result.message)
      }
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (data: SignUpInput) => {
    setLoading(true)
    setError(null)

    try {
      const result = await signUpAction(data)
      if (!result.success) {
        setError(result.message)
      }
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async (options?: { redirectTo?: string }) => {
    setLoading(true)
    setError(null)

    try {
      const result = await signOutAction(options)
      if (!result.success) {
        setError(result.message)
      }
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer logout'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await resetPasswordAction({ email })
      if (!result.success) {
        setError(result.message)
      }
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao solicitar reset de senha'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (data: UpdatePasswordInput) => {
    setLoading(true)
    setError(null)

    try {
      const result = await updatePasswordAction(data)
      if (!result.success) {
        setError(result.message)
      }
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar senha'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: UpdateProfileInput) => {
    setLoading(true)
    setError(null)

    try {
      const result = await updateProfileAction(data)
      if (!result.success) {
        setError(result.message)
      }
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar perfil'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const getProfile = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await getProfileAction()
      if (!result.success) {
        setError(result.message)
      }
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao obter perfil'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    getProfile,
    loading,
    error,
  }
}