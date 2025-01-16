import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger';
}

const badgeVariants = {
  default: "bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100",
  secondary: "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
  outline: "border border-primary-200 dark:border-primary-800 text-primary-900 dark:text-primary-100",
  success: "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100",
  warning: "bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100",
  danger: "bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100",
}

export function Badge({ 
  className, 
  variant = 'default', 
  ...props 
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
} 