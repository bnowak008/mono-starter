import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/Button';
import { PageLayout } from '@/components/layout/PageLayout';

export function Home() {
  const navigate = useNavigate();

  const utils = trpc.useUtils();

  return (
    <PageLayout
      title="Dashboard"
      description="Cool Dashboard"
      action={
        <Button
          onClick={() => navigate('/')}
          size="sm"
          className={cn(
            "relative overflow-hidden",
            "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500",
            "text-white border-none shadow-sm hover:shadow-md",
            "transition-all duration-200"
          )}
        >
          <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" />
            <span className="font-medium">New Something</span>
          </div>
        </Button>
      }
    >
      <h1>Home</h1>
    </PageLayout>
  );
}
