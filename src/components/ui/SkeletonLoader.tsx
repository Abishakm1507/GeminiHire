import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'circle' | 'list';
  lines?: number;
}

export function SkeletonLoader({ variant = 'text', lines = 3 }: SkeletonLoaderProps) {
  if (variant === 'card') {
    return (
      <div className="glass rounded-xl p-6 shimmer">
        <div className="space-y-4">
          <div className="h-6 w-3/4 rounded-lg bg-muted animate-pulse" />
          <div className="h-4 w-full rounded-lg bg-muted animate-pulse" />
          <div className="h-4 w-5/6 rounded-lg bg-muted animate-pulse" />
          <div className="h-4 w-2/3 rounded-lg bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-muted animate-pulse shimmer" />
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-muted animate-pulse" />
          <div className="h-3 w-16 rounded bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 shimmer">
            <div className="w-8 h-8 rounded-lg bg-muted animate-pulse" />
            <div className="flex-1 h-4 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3 shimmer">
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className="h-4 rounded-lg bg-muted animate-pulse"
          style={{ width: `${100 - i * 15}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        />
      ))}
    </div>
  );
}
