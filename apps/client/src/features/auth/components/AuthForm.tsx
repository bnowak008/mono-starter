import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_NAME } from '@mono/server/src/consts';
import { QrCode } from 'lucide-react';

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden py-6 sm:py-12">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-violet-200 via-white to-blue-200 dark:from-violet-950 dark:via-gray-900 dark:to-blue-950" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px] opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/0 dark:from-gray-950 dark:via-gray-950/80 dark:to-gray-950/0" />
      </div>

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-4 top-1/4 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -right-4 top-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute left-1/4 bottom-1/4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="w-full max-w-md px-4 relative">
        {/* Logo and Branding */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 relative"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="inline-block relative"
          >
            {/* QR Code icon with animation */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute -right-12 -top-8 bg-gradient-to-br from-violet-600 to-blue-600 dark:from-violet-400 dark:to-blue-400 p-2 rounded-xl shadow-lg"
            >
              <QrCode className="w-8 h-8 text-white" />
            </motion.div>

            <div className="relative">
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 dark:from-violet-400 dark:via-indigo-400 dark:to-blue-400">
                  {APP_NAME}
                </span>
              </h1>
              <div className="absolute -inset-x-4 -inset-y-4 bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-blue-600/20 blur-2xl -z-10 rounded-full" />
            </div>
            <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Cool Mono repo starter
            </p>
          </motion.div>
        </motion.div>

        {/* Auth Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          {/* Glass card effect */}
          <div className="absolute -inset-x-2 -inset-y-2 bg-gradient-to-r from-violet-600/30 via-indigo-600/30 to-blue-600/30 rounded-2xl blur-xl opacity-50" />
          
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl 
            rounded-xl overflow-hidden shadow-2xl shadow-gray-500/10 dark:shadow-gray-950/10
            border border-gray-200/50 dark:border-gray-700/50"
          >
            {/* Auth type selector */}
            <div className="p-2">
              <div className="p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg grid grid-cols-2 gap-1">
                {['Sign In', 'Register'].map((type, index) => (
                  <motion.button
                    key={type}
                    onClick={() => setIsLogin(index === 0)}
                    className={`relative px-8 py-2.5 rounded-md text-sm font-medium 
                      transition-all duration-300 overflow-hidden
                      ${(index === 0 ? isLogin : !isLogin)
                        ? 'text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                      }`}
                    whileHover={{ scale: (index === 0 ? isLogin : !isLogin) ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Animated gradient background for active tab */}
                    {(index === 0 ? isLogin : !isLogin) && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 
                          dark:from-violet-500 dark:via-indigo-500 dark:to-blue-500"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative">{type}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Form content */}
            <div className="p-6">
              <div className="h-[280px] relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isLogin ? 'login' : 'register'}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 flex flex-col"
                  >
                    {isLogin ? <LoginForm /> : <RegisterForm />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
        >
          By continuing, you agree to our{' '}
          <a href="#" className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium">
            Terms
          </a>{' '}
          and{' '}
          <a href="#" className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium">
            Privacy Policy
          </a>
        </motion.p>
      </div>
    </div>
  );
} 