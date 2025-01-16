import { useState } from 'react';
import { trpc } from '../../../lib/trpc';
import type { RegisterCredentials } from '..';
import { useAuth } from '../../../providers/AuthProvider';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export function RegisterForm() {
  const { setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      setAuth({
        isAuthenticated: true,
        user: data.user
      });
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (credentials.password !== credentials.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    registerMutation.mutate({
      email: credentials.email,
      password: credentials.password,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 h-full">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 
            text-red-600 dark:text-red-400 rounded-xl p-3 text-sm"
        >
          {error}
        </motion.div>
      )}

      <div className="space-y-4">
        <div>
          <input
            type="email"
            required
            placeholder="Email address"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
              bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
              focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
              dark:focus:ring-blue-500/20 outline-none transition-all duration-200
              text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            placeholder="Create password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
              bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
              focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
              dark:focus:ring-blue-500/20 outline-none transition-all duration-200
              text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700
              dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            required
            placeholder="Confirm password"
            value={credentials.confirmPassword}
            onChange={(e) => setCredentials({ ...credentials, confirmPassword: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700
              bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
              focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
              dark:focus:ring-blue-500/20 outline-none transition-all duration-200
              text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700
              dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full py-3 px-4 rounded-xl text-white font-medium
          bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/40
          disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25
          transition-all duration-200"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {registerMutation.isPending ? (
          <span className="flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Creating account...
          </span>
        ) : (
          'Create account'
        )}
      </motion.button>
    </form>
  );
} 