import { z } from 'zod'

// Esquemas de validação Zod
export const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  redirectTo: z.string().optional(),
})

export const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  redirectTo: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

export const signOutSchema = z.object({
  redirectTo: z.string().optional(),
})

export const resetPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
  redirectTo: z.string().optional(),
})

export const updatePasswordSchema = z.object({
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').optional(),
  avatarUrl: z.string().url('URL inválida').optional(),
})

// Tipos derivados dos esquemas
export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type SignOutInput = z.infer<typeof signOutSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

// Tipos de resposta
export interface AuthResponse {
  success: boolean
  message: string
  data?: any
  error?: string
}

export interface SignInResponse extends AuthResponse {
  data?: {
    user: {
      id: string
      email: string
      fullName?: string
      avatarUrl?: string
    }
    session: {
      accessToken: string
      expiresAt: number
    }
  }
}

export interface SignUpResponse extends AuthResponse {
  data?: {
    user: {
      id: string
      email: string
      fullName?: string
    }
    emailConfirmationRequired: boolean
  }
}

export interface ResetPasswordResponse extends AuthResponse {
  data?: {
    emailSent: boolean
    redirectTo: string
  }
}

// Tipos de erro personalizados
export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message)
    this.name = 'AuthError'
  }
}

export const AuthErrorCodes = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_FOUND: 'EMAIL_NOT_FOUND',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  RATE_LIMITED: 'RATE_LIMITED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const