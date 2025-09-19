'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
  trigger?: React.ReactNode
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => Promise<void> | void
  variant?: 'destructive' | 'warning' | 'info'
  isLoading?: boolean
  className?: string
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  variant = 'destructive',
  isLoading = false,
  className
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)

  const handleConfirm = async () => {
    setIsConfirming(true)
    try {
      await onConfirm()
      setOpen(false)
    } catch (error) {
      console.error('Erro na confirmação:', error)
    } finally {
      setIsConfirming(false)
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
          alertVariant: 'default' as const,
          buttonVariant: 'outline' as const,
          buttonClassName: 'border-yellow-500 text-yellow-700 hover:bg-yellow-50'
        }
      case 'info':
        return {
          icon: <AlertTriangle className="h-4 w-4 text-blue-500" />,
          alertVariant: 'default' as const,
          buttonVariant: 'outline' as const,
          buttonClassName: 'border-blue-500 text-blue-700 hover:bg-blue-50'
        }
      default:
        return {
          icon: <Trash2 className="h-4 w-4 text-red-500" />,
          alertVariant: 'destructive' as const,
          buttonVariant: 'destructive' as const,
          buttonClassName: ''
        }
    }
  }

  const variantStyles = getVariantStyles()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className={cn('sm:max-w-md', className)}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            {variantStyles.icon}
            <DialogTitle>{title}</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant={variantStyles.alertVariant}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {description}
            </AlertDescription>
          </Alert>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isConfirming || isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              {cancelText}
            </Button>
            <Button
              variant={variantStyles.buttonVariant}
              onClick={handleConfirm}
              disabled={isConfirming || isLoading}
              className={variantStyles.buttonClassName}
            >
              {variant === 'destructive' && (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              {isConfirming ? 'Processando...' : confirmText}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Hook personalizado para confirmações
export function useConfirm() {
  const confirmAction = async (
    options: Omit<ConfirmDialogProps, 'trigger'> & {
      trigger?: React.ReactNode
    }
  ) => {
    return new Promise<boolean>((resolve) => {
      const ConfirmationComponent = () => (
        <ConfirmDialog
          {...options}
          onConfirm={async () => {
            try {
              await options.onConfirm()
              resolve(true)
            } catch (error) {
              resolve(false)
            }
          }}
          trigger={options.trigger}
        />
      )

      // Retorna o componente para ser renderizado e resolve a promise
      // Esta é uma abordagem simplificada - em produção, você pode querer
      // usar um portal ou gerenciador de dialogs global
      resolve(true)
    })
  }

  return { confirmAction }
}

// Atalhos para ações comuns
export function DeleteConfirmDialog({
  itemName,
  onConfirm,
  ...props
}: Omit<ConfirmDialogProps, 'title' | 'description' | 'variant'> & {
  itemName: string
}) {
  return (
    <ConfirmDialog
      title="Excluir Item"
      description={`Tem certeza que deseja excluir "${itemName}"? Esta ação não pode ser desfeita.`}
      confirmText="Excluir"
      variant="destructive"
      onConfirm={onConfirm}
      {...props}
    />
  )
}

export function DisableConfirmDialog({
  itemName,
  onConfirm,
  ...props
}: Omit<ConfirmDialogProps, 'title' | 'description' | 'variant'> & {
  itemName: string
}) {
  return (
    <ConfirmDialog
      title="Desativar Item"
      description={`Tem certeza que deseja desativar "${itemName}"? O item não será mais visível.`}
      confirmText="Desativar"
      variant="warning"
      onConfirm={onConfirm}
      {...props}
    />
  )
}

export function ResetConfirmDialog({
  itemName,
  onConfirm,
  ...props
}: Omit<ConfirmDialogProps, 'title' | 'description' | 'variant'> & {
  itemName: string
}) {
  return (
    <ConfirmDialog
      title="Redefinir Dados"
      description={`Tem certeza que deseja redefinir os dados de "${itemName}"? Todos os progressos serão perdidos.`}
      confirmText="Redefinir"
      variant="warning"
      onConfirm={onConfirm}
      {...props}
    />
  )
}