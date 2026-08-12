/** @format */

import { useId, useState, type ReactNode } from 'react';
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
  const panelId = useId();
  const hasBody = children !== undefined && children !== null;

  if (!hasBody) {
    return (
      <div
        className={`py-4 ${borderBottom ? 'border-b border-gray-200' : ''} last:border-b-0 ${className}`}
      >
        <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4'>
          {header}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`group py-4 transition-all ${borderBottom ? 'border-b border-gray-200' : ''} last:border-b-0 ${className}`}
      whileHover={prefersReducedMotion ? {} : { y: -1 }}
    >
      <button
        type='button'
        className='w-full cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={() => setIsExpanded((expanded) => !expanded)}
      >
        <span className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4'>
          {header}
        </span>
      </button>
      <motion.div
        id={panelId}
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'mt-2.5 max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        initial={false}
        animate={{ opacity: isExpanded ? 1 : 0 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
        aria-hidden={!isExpanded}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
