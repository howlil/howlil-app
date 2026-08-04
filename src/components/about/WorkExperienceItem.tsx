/** @format */

import TimelineItem from '../ui/Timeline/TimelineItem';

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
  const hasBody = (points?.length ?? 0) > 0 || (technologies?.length ?? 0) > 0;

  const header = (
    <>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          {company} — {position}
        </h3>
        {companyDescription && (
          <p className="text-[15px] text-gray-700 leading-6">{companyDescription}</p>
        )}
      </div>
      <p className="text-xs text-gray-600 sm:whitespace-nowrap sm:pt-1">{period}</p>
    </>
  );

  const body = hasBody ? (
    <div className="space-y-3">
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
      {technologies && technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2" role="list" aria-label="Technologies used">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className="ui-chip ui-chip-interactive border border-gray-300 hover:border-gray-400"
              role="listitem"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  ) : null;

  return (
    <TimelineItem header={header} defaultExpanded={true}>
      {body}
    </TimelineItem>
  );
}
