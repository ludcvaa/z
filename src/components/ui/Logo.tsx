import { Focus } from 'lucide-react'

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Focus className="h-8 w-8 text-indigo-600" />
    </div>
  )
}