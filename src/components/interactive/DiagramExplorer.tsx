import { useState } from 'react';

export interface DiagramItem {
  kind: 'architecture' | 'sequence' | 'state' | 'domain' | 'deployment' | 'activity';
  title: string;
  src: string;
  alt: string;
  caption?: string;
  source?: string;
}

interface DiagramExplorerProps {
  diagrams: DiagramItem[];
}

export default function DiagramExplorer({ diagrams }: DiagramExplorerProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (diagrams.length === 0) return null;

  const active = diagrams[Math.min(activeIndex, diagrams.length - 1)];

  return (
    <section className='not-prose my-10' aria-labelledby='diagram-explorer-title'>
      <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='site-ui text-xs font-medium uppercase tracking-[0.14em] text-gray-500'>System view</p>
          <h2 id='diagram-explorer-title' className='mt-1 text-lg font-semibold tracking-tight text-gray-900'>
            {active.title}
          </h2>
        </div>
        {active.source && (
          <a
            href={active.source}
            target='_blank'
            rel='noopener noreferrer'
            className='site-ui text-xs text-gray-500 underline-offset-4 hover:text-gray-900 hover:underline'
          >
            PlantUML source
          </a>
        )}
      </div>

      {diagrams.length > 1 && (
        <div className='mb-3 flex gap-1 overflow-x-auto border-b border-gray-200' role='tablist' aria-label='Diagram views'>
          {diagrams.map((diagram, index) => {
            const selected = index === activeIndex;
            return (
              <button
                key={`${diagram.kind}-${diagram.title}`}
                type='button'
                role='tab'
                aria-selected={selected}
                onClick={() => setActiveIndex(index)}
                className={`site-ui min-h-10 whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors ${
                  selected
                    ? 'border-gray-900 font-medium text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {diagram.kind.charAt(0).toUpperCase() + diagram.kind.slice(1)}
              </button>
            );
          })}
        </div>
      )}

      <div className='overflow-x-auto rounded-lg border border-gray-200 bg-white p-3 sm:p-4'>
        <img src={active.src} alt={active.alt} loading='lazy' className='mx-auto block h-auto max-w-full' />
      </div>

      {active.caption && (
        <p className='site-ui mt-3 max-w-3xl text-sm leading-6 text-gray-500'>{active.caption}</p>
      )}
    </section>
  );
}
