import { Toaster as Sonner } from 'sonner'

export function Toast() {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white group-[.toaster]:dark:bg-gray-800 group-[.toaster]:text-gray-900 group-[.toaster]:dark:text-gray-100 group-[.toaster]:border-gray-200 group-[.toaster]:dark:border-gray-700 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-gray-500 group-[.toast]:dark:text-gray-400",
          actionButton: "group-[.toast]:bg-gray-900 group-[.toast]:dark:bg-gray-100 group-[.toast]:text-gray-50 group-[.toast]:dark:text-gray-900",
          cancelButton: "group-[.toast]:bg-gray-100 group-[.toast]:dark:bg-gray-800 group-[.toast]:text-gray-500 group-[.toast]:dark:text-gray-400",
        },
      }}
    />
  )
} 