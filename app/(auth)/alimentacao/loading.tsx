export default function AlimentacaoLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>

      <div className="flex items-center justify-center space-x-4 bg-muted/50 p-4 rounded-lg">
        <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
        <div className="space-y-1">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-8 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>

          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border rounded-lg p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-5 bg-gray-200 rounded w-5 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-6 bg-gray-200 rounded w-12 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-10 animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>

          <div className="bg-white border rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-5 bg-gray-200 rounded w-5 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
            <div className="space-y-3">
              <div className="text-center space-y-2">
                <div className="h-8 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
                <div className="h-2 bg-gray-200 rounded w-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6 space-y-4">
            <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}