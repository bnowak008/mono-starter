import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({ className, size = "md" }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-8">
        <div className={cn(
          "relative",
          sizeClasses[size]
        )}>
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 dark:border-indigo-400/20" />
          <div className="absolute inset-0 rounded-full border-t-4 border-r-4 border-indigo-500 dark:border-indigo-400 animate-[spin_3s_cubic-bezier(0.5,0.15,0.5,0.85)_infinite]" />
          
          {/* Middle ring */}
          <div className="absolute inset-[15%] rounded-full border-4 border-violet-500/20 dark:border-violet-400/20" />
          <div className="absolute inset-[15%] rounded-full border-t-4 border-l-4 border-violet-500 dark:border-violet-400 animate-[spin_2s_cubic-bezier(0.5,0.15,0.5,0.85)_infinite_reverse]" />
          
          {/* Inner ring */}
          <div className="absolute inset-[30%] rounded-full border-4 border-fuchsia-500/20 dark:border-fuchsia-400/20" />
          <div className="absolute inset-[30%] rounded-full border-b-4 border-r-4 border-fuchsia-500 dark:border-fuchsia-400 animate-[spin_1.5s_cubic-bezier(0.5,0.15,0.5,0.85)_infinite]" />
          
          {/* Center dot */}
          <div className="absolute inset-[45%] rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse" />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <p className="text-base font-medium text-gray-700 dark:text-gray-200">
            Loading
          </p>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-[bounce_1s_infinite]" />
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400 animate-[bounce_1s_infinite_0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 dark:bg-fuchsia-400 animate-[bounce_1s_infinite_0.4s]" />
          </div>
        </div>
      </div>
    </div>
  );
} 