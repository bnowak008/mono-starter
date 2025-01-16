import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  showBackButton?: boolean;
  navigateTo?: string;
  children: React.ReactNode;
}

export function PageLayout({ 
  title, 
  description, 
  action,
  showBackButton,
  navigateTo,
  children 
}: PageLayoutProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(navigateTo || '/')
  };

  return (
    <div className="w-full max-w-[1440px] min-[2000px]:max-w-[1920px] mx-auto">
      {(title || description || action) && (
        <div className="sticky top-0 z-30 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
          <div className="px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
            {showBackButton && (
              <button
                onClick={handleBack}
                className={cn(
                  "flex items-center justify-center flex-shrink-0",
                  "w-8 h-8 rounded-lg transition-colors duration-200",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  "text-gray-600 dark:text-gray-400",
                  "-ml-1" // Negative margin to align with content padding
                )}
                aria-label="Go back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex-1 flex items-center min-w-0">
              {title && (
                <div className="flex items-center gap-3 min-w-0">
                  <h1 className="text-lg font-semibold capitalize text-gray-900 dark:text-gray-100">
                    {title}
                  </h1>
                  {description && (
                    <>
                      <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {description}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
            {action && (
              <div className="flex-shrink-0">
                {action}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </div>
    </div>
  )
}
