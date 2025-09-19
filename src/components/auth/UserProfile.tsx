'use client'

import { useAuth, useCurrentUser } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, Settings, User as UserIcon } from 'lucide-react'

interface UserProfileProps {
  showAvatar?: boolean
  showName?: boolean
  dropdown?: boolean
}

export function UserProfile({
  showAvatar = true,
  showName = true,
  dropdown = true,
}: UserProfileProps) {
  const { signOut } = useAuth()
  const { user, loading, error } = useCurrentUser()

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        {showName && <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>}
      </div>
    )
  }

  if (error || !user) {
    return null
  }

  const userInitials = user.email
    ?.split('@')[0]
    .substring(0, 2)
    .toUpperCase() || 'U'

  const userName = user.user_metadata?.full_name || user.email || 'Usuário'

  if (!dropdown) {
    return (
      <div className="flex items-center space-x-3">
        {showAvatar && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={userName} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        )}
        {showName && (
          <span className="text-sm font-medium text-gray-700">{userName}</span>
        )}
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={userName} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}