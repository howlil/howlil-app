/** @format */

import ExpandableSection from './ExpandableSection';

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
          <p className="text-sm text-gray-700 text-justify">{companyDescription}</p>
        )}
      </div>
      <p className="text-xs text-gray-600 whitespace-nowrap">{period}</p>
    </>
  );

  const body = hasBody ? (
    <div className="space-y-2.5">
      {points && points.length > 0 && (
        <ul className="space-y-1.5">
          {points.map((point, index) => (
            <li
              key={index}
              className="text-sm text-gray-700 leading-relaxed flex items-start gap-2"
            >
              <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
              <span className="text-justify">{point}</span>
            </li>
          ))}
        </ul>
      )}
      {technologies && technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {technologies.map((tech, index) => (
            <span
              key={index}
              className="px-2.5 py-1 text-xs border border-gray-300 text-gray-600 rounded-full hover:border-gray-400 transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  ) : null;

  if (!body) {
    return (
      <div className="py-1.5 border-b border-gray-200 last:border-b-0">
        <div className="flex items-start justify-between gap-4">
          {header}
        </div>
      </div>
    );
  }

  return (
    <ExpandableSection header={header} body={body} defaultExpanded={true} />
  );
}
