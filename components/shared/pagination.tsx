'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  total: number
  page: number
  limit: number
  onPageChange: (page: number) => void
  onLimitChange?: (limit: number) => void
  className?: string
  showLimitSelector?: boolean
  maxVisiblePages?: number
}

export function Pagination({
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
  className,
  showLimitSelector = true,
  maxVisiblePages = 5
}: PaginationProps) {
  const [inputPage, setInputPage] = useState(page.toString())

  useEffect(() => {
    setInputPage(page.toString())
  }, [page])

  const totalPages = Math.ceil(total / limit)
  const startItem = (page - 1) * limit + 1
  const endItem = Math.min(page * limit, total)

  // Gerar números de página visíveis
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | 'ellipsis')[] = []
    const halfVisible = Math.floor(maxVisiblePages / 2)

    // Primeira página
    pages.push(1)

    if (page > halfVisible + 2) {
      pages.push('ellipsis')
    }

    // Páginas ao redor da página atual
    const startPage = Math.max(2, page - halfVisible)
    const endPage = Math.min(totalPages - 1, page + halfVisible)

    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i)
      }
    }

    if (page < totalPages - halfVisible - 1) {
      pages.push('ellipsis')
    }

    // Última página
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const handlePageInput = (e: React.FormEvent) => {
    e.preventDefault()
    const newPage = parseInt(inputPage)
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      onPageChange(newPage)
    } else {
      setInputPage(page.toString())
    }
  }

  const visiblePages = getVisiblePages()

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-4', className)}>
      {/* Informações de itens */}
      <div className="text-sm text-gray-600">
        Mostrando {startItem}-{endItem} de {total} itens
      </div>

      {/* Controles de paginação */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        {/* Números de página */}
        <div className="flex items-center gap-1">
          {visiblePages.map((pageNum, index) => (
            <div key={index}>
              {pageNum === 'ellipsis' ? (
                <span className="px-2 py-1 text-sm text-gray-400">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              ) : (
                <Button
                  variant={pageNum === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className={cn(
                    'w-10 h-10',
                    pageNum === page && 'pointer-events-none'
                  )}
                >
                  {pageNum}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Input de página direta */}
        <form onSubmit={handlePageInput} className="flex items-center gap-1">
          <input
            type="number"
            min="1"
            max={totalPages}
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value)}
            className="w-16 h-10 px-2 py-1 text-sm border border-gray-300 rounded-md text-center"
          />
          <span className="text-sm text-gray-600">/ {totalPages}</span>
        </form>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Próximo
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Seletor de limite */}
      {showLimitSelector && onLimitChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Itens por página:</span>
          <Select value={limit.toString()} onValueChange={(value) => onLimitChange(parseInt(value))}>
            <SelectTrigger className="w-20 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}

// Hook para paginação
interface UsePaginationProps {
  total: number
  initialPage?: number
  initialLimit?: number
}

export function usePagination({
  total,
  initialPage = 1,
  initialLimit = 20
}: UsePaginationProps) {
  const [page, setPage] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  const totalPages = Math.ceil(total / limit)
  const offset = (page - 1) * limit

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }

  const nextPage = () => goToPage(page + 1)
  const prevPage = () => goToPage(page - 1)
  const firstPage = () => goToPage(1)
  const lastPage = () => goToPage(totalPages)

  const changeLimit = (newLimit: number) => {
    setLimit(newLimit)
    setPage(1) // Resetar para primeira página
  }

  return {
    page,
    limit,
    offset,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    changeLimit,
    setPage,
    setLimit
  }
}

// Componente Infinite Scroll
interface InfiniteScrollProps {
  children: React.ReactNode
  hasMore: boolean
  onLoadMore: () => void
  threshold?: number
  loader?: React.ReactNode
  className?: string
}

export function InfiniteScroll({
  children,
  hasMore,
  onLoadMore,
  threshold = 100,
  loader = <div className="text-center py-4">Carregando mais...</div>,
  className
}: InfiniteScrollProps) {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || !hasMore) return

      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      const clientHeight = document.documentElement.clientHeight || window.innerHeight

      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        loadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isLoading, hasMore, threshold])

  const loadMore = async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      await onLoadMore()
    } catch (error) {
      console.error('Erro no infinite scroll:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={className}>
      {children}
      {hasMore && loader}
    </div>
  )
}

// Hook para infinite scroll
export function useInfiniteScroll<T>(
  fetchData: (page: number, limit: number) => Promise<{ data: T[]; total: number }>,
  initialLimit: number = 20
) {
  const [data, setData] = useState<T[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [total, setTotal] = useState(0)

  const loadMore = async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const result = await fetchData(page, initialLimit)

      setData(prev => [...prev, ...result.data])
      setTotal(result.total)
      setPage(prev => prev + 1)
      setHasMore(result.data.length === initialLimit)
    } catch (error) {
      console.error('Erro ao carregar mais dados:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setData([])
    setPage(1)
    setHasMore(true)
    setTotal(0)
  }

  return {
    data,
    hasMore,
    isLoading,
    total,
    loadMore,
    reset
  }
}