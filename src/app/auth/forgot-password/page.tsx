import Link from 'next/link'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Esqueceu sua senha?
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Lembrou da senha?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Faça login
          </Link>
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        <p className="text-sm text-gray-600 mb-6">
          Digite seu email e enviaremos um link para você redefinir sua senha.
        </p>
        <ForgotPasswordForm />
      </div>
    </div>
  )
}