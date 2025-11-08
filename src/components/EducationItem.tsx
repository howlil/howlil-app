import { useState } from "react";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group py-1 border-b border-gray-200 last:border-b-0 cursor-pointer transition-all"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-2 flex-1">
          {/* Arrow Icon - visible on hover */}
          <div className="flex-shrink-0 w-5 mt-0.5">
            <span
              className={`inline-block text-gray-400 transition-all duration-300 text-lg ${
                isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
              } ${isExpanded ? "rotate-90" : ""}`}
            >
              ›
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-serif font-semibold text-gray-800 ">
              {institution}
            </h3>
            <p className="text-sm text-gray-600 font-serif italic leading-1">{degree}</p>
          </div>
        </div>

        <p className="text-xs text-gray-500 font-serif whitespace-nowrap">
          {period}
        </p>
      </div>

      {/* Expanded Content */}
      {(description || points) && (
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isExpanded ? "max-h-[1000px] opacity-100 mt-3" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pl-7 pr-4">
            {description && (
              <p className="text-sm text-gray-600 leading-relaxed mb-2 font-serif">
                {description}
              </p>
            )}
            {points && points.length > 0 && (
              <ul className="space-y-1.5">
                {points.map((point, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-600 leading-relaxed font-serif flex items-start gap-2"
                  >
                    <span className="text-gray-400 mt-0.5">•</span>
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
