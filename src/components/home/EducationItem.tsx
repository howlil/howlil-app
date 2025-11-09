/** @format */

import {useState} from 'react';

interface EducationItemProps {
  institution: string;
  degree: string;
  period: string;
  description?: string;
  points?: string[];
}

export default function EducationItem({
  institution,
  degree,
  period,
  description,
  points,
}: EducationItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className='group py-1.5 border-b border-gray-200 last:border-b-0 cursor-pointer transition-all'
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className='flex items-start justify-between'>
        <div className='flex-1 min-w-0'>
          <div>
            <h3 className='text-base font-semibold text-gray-800'>
              {institution}
            </h3>
          </div>
          <p className='text-sm text-gray-700'>{degree}</p>
        </div>
        <p className='text-xs text-gray-600 whitespace-nowrap'>{period}</p>
      </div>
      {(description || points) && (
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isExpanded
              ? 'max-h-[1000px] opacity-100 mt-2.5'
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className='space-y-2'>
            {description && (
              <p className='text-sm text-gray-700 leading-relaxed'>
                {description}
              </p>
            )}
            {points && points.length > 0 && (
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
