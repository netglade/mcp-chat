import { AlertCircle, RefreshCw, X } from 'lucide-react'
import { Button } from './ui/Button'

interface ErrorMessageProps {
  title: string
  message: string
  details?: string
  onRetry?: () => void
  onDismiss: () => void
}

export function ErrorMessage({ title, message, details, onRetry, onDismiss }: ErrorMessageProps) {
  return (
    <div className="mb-4 p-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 rounded-lg">
      <div className="flex justify-between">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />
          <h3 className="font-medium text-red-600 dark:text-red-400">{title}</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onDismiss} 
          className="h-6 w-6 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="ml-7 text-sm text-red-600 dark:text-red-400">{message}</p>
      {details && (
        <pre className="mt-2 ml-7 text-xs bg-red-100 dark:bg-red-900/30 p-2 rounded overflow-x-auto">
          {details}
        </pre>
      )}
      {onRetry && (
        <div className="mt-3 ml-7">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="text-xs border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Try Again
          </Button>
        </div>
      )}
    </div>
  )
} 