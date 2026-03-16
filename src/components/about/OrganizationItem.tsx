/** @format */

import TimelineItem from '../ui/Timeline/TimelineItem';

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
  const hasBody = (points?.length ?? 0) > 0;

  const header = (
    <>
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-800">
          {community} — {position}
        </h3>
        {description && (
          <p className="text-sm text-gray-700 text-justify">{description}</p>
        )}
      </div>
      <p className="text-xs text-gray-600 whitespace-nowrap">{period}</p>
    </>
  );

  const body = hasBody ? (
    <ul className="space-y-1.5">
      {points!.map((point, index) => (
        <li
          key={index}
          className="text-sm text-gray-700 leading-relaxed flex items-start gap-2"
        >
          <span className="text-gray-400 mt-0.5 flex-shrink-0" aria-hidden="true">•</span>
          <span className="text-justify">{point}</span>
        </li>
      ))}
    </ul>
  ) : null;

  return (
    <TimelineItem header={header} defaultExpanded={true}>
      {body}
    </TimelineItem>
  );
}
