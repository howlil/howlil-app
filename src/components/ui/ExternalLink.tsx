/** @format */

import { ExternalLink as ExternalLinkIcon } from 'lucide-react';

interface ExternalLinkProps {
  href: string;
  label?: string;
  className?: string;
  iconSize?: number;
}

export default function ExternalLink({
  href,
  label = 'Open link',
  className = '',
  iconSize = 16,
}: ExternalLinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center p-0.5 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer ${className}`}
      aria-label={label}
      type="button"
    >
      <ExternalLinkIcon size={iconSize} aria-hidden="true" />
    </button>
  );
}
