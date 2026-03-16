/** @format */

import { useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

interface TimelineItemProps {
  header: ReactNode;
  children?: ReactNode;
  defaultExpanded?: boolean;
  borderBottom?: boolean;
  className?: string;
}

export default function TimelineItem({
  header,
  children,
  defaultExpanded = true,
  borderBottom = true,
  className = '',
}: TimelineItemProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const prefersReducedMotion = useReducedMotion();

  const hasBody = children !== undefined && children !== null;

  if (!hasBody) {
    return (
      <div
        className={`py-1.5 ${borderBottom ? 'border-b border-gray-200' : ''} last:border-b-0 ${className}`}
      >
        <div className="flex items-start justify-between gap-4">{header}</div>
      </div>
    );
  }

  return (
    <motion.div
      className={`group py-1.5 cursor-pointer transition-all ${borderBottom ? 'border-b border-gray-200' : ''} last:border-b-0 ${className}`}
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={prefersReducedMotion ? {} : { y: -1 }}
    >
      <div className="flex items-start justify-between gap-4">{header}</div>
      <motion.div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-h-[1000px] opacity-100 mt-2.5' : 'max-h-0 opacity-0'
        }`}
        initial={false}
        animate={{ opacity: isExpanded ? 1 : 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
