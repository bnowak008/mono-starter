import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Loading...', className }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
      <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
} 