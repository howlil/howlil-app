/** @format */

import {useState} from 'react';

interface WorkExperienceItemProps {
  company: string;
  position: string;
  period: string;
  companyDescription?: string;
  points?: string[];
  technologies?: string[];
}

export default function WorkExperienceItem({
  company,
  position,
  period,
  companyDescription,
  points,
  technologies,
}: WorkExperienceItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className='group py-1.5 border-b border-gray-200 last:border-b-0 cursor-pointer transition-all'
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className='flex items-start justify-between gap-4'>
        <div className='flex-1 min-w-0'>
          <h3 className='text-base font-semibold text-gray-800 mb-1'>
            {company} — {position}
          </h3>
          {companyDescription && (
            <p className='text-sm text-gray-700'>{companyDescription}</p>
          )}
        </div>

        <p className='text-xs text-gray-600 whitespace-nowrap'>{period}</p>
      </div>

      {(points || technologies) && (
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isExpanded
              ? 'max-h-[1000px] opacity-100 mt-2.5'
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className='space-y-2.5'>
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
            {technologies && technologies.length > 0 && (
              <div className='flex flex-wrap gap-2 mb-2'>
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className='px-2.5 py-1 text-xs border border-gray-300 text-gray-600 rounded-full hover:border-gray-400 transition-colors'
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
