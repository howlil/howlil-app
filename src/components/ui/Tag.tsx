/** @format */

interface TagProps {
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
  showHash?: boolean;
  count?: number;
  className?: string;
}

export default function Tag({
  label,
  href,
  onClick,
  isActive = false,
  showHash = true,
  count,
  className = '',
}: TagProps) {
  const displayLabel = showHash ? `#${label}` : label;

  const baseClasses = `px-3 py-1 text-xs rounded-full transition-colors cursor-pointer ${className}`;
  
  const interactiveClasses = href || onClick
    ? isActive
      ? 'bg-gray-800 text-white font-semibold'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
    : 'bg-gray-100 text-gray-700';

  const classes = `${baseClasses} ${interactiveClasses}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {displayLabel}
        {count !== undefined && (
          <span className="ml-1 opacity-80">({count})</span>
        )}
      </a>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={classes} type="button">
        {displayLabel}
        {count !== undefined && (
          <span className="ml-1 opacity-80">({count})</span>
        )}
      </button>
    );
  }

  return (
    <span className={classes}>
      {displayLabel}
      {count !== undefined && (
        <span className="ml-1 opacity-80">({count})</span>
      )}
    </span>
  );
}
