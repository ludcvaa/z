'use client'

import Link from 'next/link'
import { ServerActionLoginForm } from '@/components/auth/ServerActionForm'

export default function ServerAuthLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Login com Server Actions
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link
              href="/auth/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              crie uma nova conta
            </Link>
          </p>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-lg">
          <ServerActionLoginForm />
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Versão com Server Actions - Segurança no servidor
          </p>
        </div>
      </div>
    </div>
  )
}