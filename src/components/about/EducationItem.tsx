/** @format */

import TimelineItem from '../ui/Timeline/TimelineItem';

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
  const hasBody = !!description || (points?.length ?? 0) > 0;

  const header = (
    <>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-800">{institution}</h3>
        <p className="text-[15px] text-gray-700 leading-6">{degree}</p>
      </div>
      <p className="text-xs text-gray-600 sm:whitespace-nowrap sm:pt-1">{period}</p>
    </>
  );

  const body = hasBody ? (
    <div className="space-y-3">
      {description && (
        <p className="text-[15px] text-gray-700 leading-6">
          {description}
        </p>
      )}
      {points && points.length > 0 && (
        <ul className="space-y-2">
          {points.map((point, index) => (
            <li
              key={index}
              className="text-[15px] text-gray-700 leading-6 flex items-start gap-2"
            >
              <span className="text-gray-400 mt-0.5 flex-shrink-0" aria-hidden="true">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  ) : null;

  return (
    <TimelineItem header={header} defaultExpanded={true}>
      {body}
    </TimelineItem>
  );
}
