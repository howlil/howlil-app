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
    <div className='py-1.5 border-b border-gray-200 last:border-b-0'>
      <div className='flex items-center justify-between gap-8'>
        <div className='flex items-center gap-2 flex-1 min-w-0'>
          <h3 className='text-base font-semibold text-gray-800'>{title}</h3>
          {certificateUrl && (
            <p
              onClick={() =>
                window.open(certificateUrl, '_blank', 'noopener,noreferrer')
              }
              className='flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors flex-shrink-0 p-0.5 cursor-pointer m-0'
              aria-label='View Certificate'
            >
              <ExternalLink className='w-4 h-4' />
            </p>
          )}
        </div>
        <p className='text-xs text-gray-600 whitespace-nowrap flex-shrink-0 self-center'>
          {date}
        </p>
      </div>
      <p className='text-sm text-gray-700'>{description}</p>
    </div>
  );
};

export default AwardItem;
