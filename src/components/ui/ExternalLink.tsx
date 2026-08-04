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
      className={`ui-icon-button cursor-pointer ${className}`}
      aria-label={label}
      type="button"
    >
      <ExternalLinkIcon size={iconSize} aria-hidden="true" />
    </button>
  );
}
