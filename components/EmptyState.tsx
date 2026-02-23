import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 sm:py-16 px-4"
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-accent/5 border border-border flex items-center justify-center mb-4 sm:mb-6">
        <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-accent/20" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-accent/60 text-center max-w-sm mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 sm:px-6 py-2.5 sm:py-3 premium-gradient text-white text-xs sm:text-sm font-bold uppercase tracking-wide rounded-lg shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
