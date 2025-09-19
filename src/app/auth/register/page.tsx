'use client'

import Link from 'next/link'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { SocialAuth } from '@/components/auth/SocialAuth'

export default function RegisterPage() {
  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Crie sua conta
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Faça login
          </Link>
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
        <SocialAuth />

        <RegisterForm />
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Ao criar uma conta, você concorda com nossos{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-500">
            Termos de Serviço
          </a>{' '}
          e{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-500">
            Política de Privacidade
          </a>
        </p>
      </div>
    </div>
  )
}