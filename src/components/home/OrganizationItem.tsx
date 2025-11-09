/** @format */

import {useState} from 'react';

interface OrganizationItemProps {
  community: string;
  position: string;
  period: string;
  description?: string;
  points?: string[];
}

export default function OrganizationItem({
  community,
  position,
  period,
  description,
  points,
}: OrganizationItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className='group py-1.5 border-b last:border-b-0 cursor-pointer transition-all'
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className='flex items-start justify-between gap-4'>
        <div className='flex-1 min-w-0'>
          <h3 className='text-base font-semibold text-gray-800'>
            {community} — {position}
          </h3>
          {description && (
            <p className='text-sm text-gray-700'>{description}</p>
          )}
        </div>

        <p className='text-xs text-gray-600 whitespace-nowrap'>{period}</p>
      </div>

      {points && points.length > 0 && (
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isExpanded
              ? 'max-h-[1000px] opacity-100 mt-2.5'
              : 'max-h-0 opacity-0'
          }`}
        >
          <ul className='space-y-1.5'>
            {points.map((point, index) => (
              <li
                key={index}
                className='text-sm text-gray-700 leading-relaxed flex items-start gap-2'
              >
                <span className='text-gray-400 mt-0.5'>•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
