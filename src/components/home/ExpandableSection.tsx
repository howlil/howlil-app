/** @format */

import { useState, type ReactNode } from 'react';

interface ExpandableSectionProps {
  header: ReactNode;
  body: ReactNode;
  defaultExpanded?: boolean;
  /** If false, no border-bottom (e.g. last item). Use last:border-b-0 on parent instead. */
  borderBottom?: boolean;
}

export default function ExpandableSection({
  header,
  body,
  defaultExpanded = true,
  borderBottom = true,
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div
      className={`group py-1.5 cursor-pointer transition-all ${borderBottom ? 'border-b border-gray-200' : ''} last:border-b-0`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start justify-between gap-4">
        {header}
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isExpanded ? 'max-h-[1000px] opacity-100 mt-2.5' : 'max-h-0 opacity-0'
        }`}
      >
        {body}
      </div>
    </div>
  );
}
