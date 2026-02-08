/** @format */

import ExpandableSection from './ExpandableSection';

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
          <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
          <span className="text-justify">{point}</span>
        </li>
      ))}
    </ul>
  ) : null;

  if (!body) {
    return (
      <div className="py-1.5 border-b border-gray-200 last:border-b-0">
        <div className="flex items-start justify-between gap-4">{header}</div>
      </div>
    );
  }

  return (
    <ExpandableSection header={header} body={body} defaultExpanded={true} />
  );
}
