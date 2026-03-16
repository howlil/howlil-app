/** @format */

import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  hoverable?: boolean;
}

export default function Card({
  children,
  href,
  onClick,
  className = '',
  hoverable = false,
}: CardProps) {
  const baseClasses = `block p-4 rounded-lg border transition-colors ${className}`;
  
  const interactiveClasses = hoverable || href || onClick
    ? 'border-gray-200 hover:border-gray-400 cursor-pointer'
    : 'border-gray-200';

  const classes = `${baseClasses} ${interactiveClasses}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={classes} type="button">
        {children}
      </button>
    );
  }

  return (
    <article className={classes}>
      {children}
    </article>
  );
}
