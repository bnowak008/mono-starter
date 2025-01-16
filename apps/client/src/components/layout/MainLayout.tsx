import { Link } from 'react-router-dom'
import { Navbar } from './Navbar'

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-1 overflow-auto relative dark:text-gray-100">
        {children}
      </main>
    </div>
  )
} 