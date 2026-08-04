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

  const baseClasses = `ui-chip ${className}`;
  
  const interactiveClasses = href || onClick ? 'ui-chip-interactive' : '';
  const activeClasses = isActive ? 'ui-chip-active' : '';

  const classes = `${baseClasses} ${interactiveClasses} ${activeClasses}`;

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
