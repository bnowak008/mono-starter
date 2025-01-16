import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { useTheme } from '../../providers/ThemeProvider';
import { trpc } from '../../lib/trpc';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

export function Navbar() {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => setAuth({ isAuthenticated: false, user: null })
  });

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
              RUP App
            </h1>
          </div>

          <div className="flex items-center space-x-8">
            <Button
              variant="ghost"
              onClick={toggleTheme}
              className="p-2"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>

            <div className="flex items-center space-x-4 border-l border-gray-200 dark:border-gray-700 pl-8">
              <div className="group relative">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 
                    flex items-center justify-center ring-2 ring-white transition-all duration-200
                    hover:ring-offset-2 hover:ring-offset-white/80"
                >
                  <span className="text-white font-medium text-lg">
                    {auth.user?.email?.[0].toUpperCase()}
                  </span>
                </motion.div>
                
                <div className="absolute right-0 mt-3 w-48 py-2 bg-white dark:bg-gray-800 rounded-lg 
                  shadow-lg ring-1 ring-black/5 dark:ring-white/10
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 
                  transform origin-top scale-95 group-hover:scale-100 z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {auth.user?.email}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 dark:text-red-400 
                      hover:text-red-700 dark:hover:text-red-300 
                      hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => logoutMutation.mutate()}
                  >
                    Sign out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
} 