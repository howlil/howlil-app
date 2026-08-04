/** @format */

import React from 'react';
import {ExternalLink} from 'lucide-react';

interface AwardItemProps {
  title: string;
  date: string;
  description: string;
  certificateUrl?: string;
}

const AwardItem: React.FC<AwardItemProps> = ({
  title,
  date,
  description,
  certificateUrl,
}) => {
  return (
    <div className='py-4 border-b border-gray-200 last:border-b-0'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-8'>
        <div className='flex items-center gap-2 flex-1 min-w-0'>
          <h3 className='text-base font-semibold text-gray-800'>{title}</h3>
          {certificateUrl && (
            <button
              type='button'
              onClick={() =>
                window.open(certificateUrl, '_blank', 'noopener,noreferrer')
              }
              className='flex min-h-6 min-w-6 items-center justify-center text-gray-700 hover:text-gray-900 transition-colors flex-shrink-0 cursor-pointer'
              aria-label='View Certificate'
            >
              <ExternalLink className='w-4 h-4' />
            </button>
          )}
        </div>
        <p className='text-xs text-gray-600 sm:whitespace-nowrap sm:flex-shrink-0 sm:pt-1'>
          {date}
        </p>
      </div>
      <p className='text-[15px] text-gray-700 leading-6 mt-2'>{description}</p>
    </div>
  );
};

export default AwardItem;
