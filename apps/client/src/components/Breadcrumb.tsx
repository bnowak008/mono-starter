import { Link, useLocation, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { trpc } from '../lib/trpc';

interface BreadcrumbItem {
  label: string;
  path: string;
}

export function Breadcrumb() {
  const location = useLocation();
  const { projectId } = useParams();
  const { data: project } = trpc.project.get.useQuery(
    { id: projectId ?? '' },
    { enabled: !!projectId }
  );

  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  const breadcrumbs: BreadcrumbItem[] = pathSegments.reduce<BreadcrumbItem[]>((acc, segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    let label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    
    // Handle projects path
    if (segment === 'projects') {
      label = 'Projects';
    }
    
    // Replace project ID with truncated title when available
    if (index > 0 && pathSegments[index - 1] === 'projects' && project) {
      if (segment !== 'setup' && segment !== 'new') {
        // Truncate project title if it's longer than 20 characters
        label = project.title.length > 20 
          ? `${project.title.substring(0, 20)}...`
          : project.title;
      }
    }
    
    // Special cases for known routes
    if (segment === 'new') label = 'New Project';
    if (segment === 'setup') label = 'Setup';
    
    // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
        return [...acc, { label, path }];
  }, [{ label: 'Home', path: '/' }]);

  return (
    <nav className="mb-6">
      <div className="inline-flex items-center relative group">
        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-transparent dark:from-blue-400/10 dark:via-indigo-400/10 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-lg" />
        <div className="relative flex items-center">
          {breadcrumbs.map((crumb, index) => (
            <motion.div
              key={crumb.path}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              className="relative"
            >
              {index > 0 && (
                <motion.span 
                  className="mx-2 text-indigo-300/50 dark:text-indigo-400/50 select-none font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  •
                </motion.span>
              )}
              <Link
                to={crumb.path}
                className={`relative px-2 py-1 rounded-md hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors duration-200 ${
                  index === breadcrumbs.length - 1
                    ? 'text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                <span className="relative z-10 text-sm">
                  {crumb.label}
                </span>
                <motion.div
                  initial={false}
                  animate={{
                    opacity: index === breadcrumbs.length - 1 ? 1 : 0,
                    scale: index === breadcrumbs.length - 1 ? 1 : 0.95
                  }}
                  className="absolute inset-0 bg-blue-50/50 dark:bg-blue-900/20 rounded-md -z-0"
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </nav>
  );
} 