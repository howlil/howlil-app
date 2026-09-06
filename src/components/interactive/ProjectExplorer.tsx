/** @format */

import {useState, type KeyboardEvent} from 'react';
import {ArrowUpRight} from 'lucide-react';

export interface ProjectExplorerItem {
  slug: string;
  sequence: string;
  title: string;
  year: string;
  summary: string;
  role?: string;
  focus: string[];
  stack: string[];
  result?: string;
  href: string;
  repository?: string;
}

interface Props {
  projects: ProjectExplorerItem[];
}

export default function ProjectExplorer({projects}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (projects.length === 0) return null;

  const active = projects[Math.min(activeIndex, projects.length - 1)];

  const focusTab = (index: number) => {
    const nextIndex = (index + projects.length) % projects.length;
    setActiveIndex(nextIndex);
    window.requestAnimationFrame(() => {
      document.getElementById(`project-tab-${nextIndex}`)?.focus();
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      focusTab(index + 1);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      focusTab(index - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusTab(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusTab(projects.length - 1);
    }
  };

  return (
    <>
      <div className='hidden border border-gray-200 lg:grid lg:grid-cols-[18rem_minmax(0,1fr)]'>
        <div className='border-r border-gray-200' role='tablist' aria-label='Selected projects'>
          {projects.map((project, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={project.slug}
                id={`project-tab-${index}`}
                type='button'
                role='tab'
                aria-selected={isActive}
                aria-controls='project-preview-panel'
                tabIndex={isActive ? 0 : -1}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={`w-full border-b border-gray-200 px-5 py-5 text-left transition-colors last:border-b-0 ${
                  isActive
                    ? 'bg-[var(--color-surface)] text-gray-900'
                    : 'text-gray-600 hover:bg-[var(--color-surface-muted)] hover:text-gray-900'
                }`}
              >
                <span className='flex items-center justify-between gap-4 font-mono text-[10px] text-gray-500'>
                  <span>{project.sequence}</span>
                  <span>{project.year}</span>
                </span>
                <span className='mt-3 block text-[15px] font-semibold leading-6 tracking-[-0.02em]'>{project.title}</span>
                {project.focus.length > 0 && (
                  <span className='mt-2 block text-[11px] leading-5 text-gray-500'>{project.focus.slice(0, 2).join(' · ')}</span>
                )}
              </button>
            );
          })}
        </div>

        <section
          id='project-preview-panel'
          role='tabpanel'
          aria-labelledby={`project-tab-${activeIndex}`}
          className='flex min-h-[29rem] min-w-0 flex-col p-8 xl:p-10'
        >
          <div className='flex items-center justify-between gap-5'>
            <p className='eyebrow'>Project {active.sequence}</p>
            <p className='eyebrow'>{active.year}</p>
          </div>

          <div className='mt-7 max-w-3xl'>
            <h3 className='text-[28px] font-semibold leading-[1.1] tracking-[-0.04em] text-gray-900'>{active.title}</h3>
            <p className='mt-4 max-w-[66ch] text-[16px] leading-7 text-gray-600'>{active.summary}</p>
          </div>

          <dl className='mt-8 grid max-w-3xl gap-7 border-t border-gray-200 pt-6 sm:grid-cols-2'>
            {active.role && (
              <div>
                <dt className='eyebrow'>Ownership</dt>
                <dd className='mt-2 text-[14px] leading-6 text-gray-800'>{active.role}</dd>
              </div>
            )}
            {active.focus.length > 0 && (
              <div>
                <dt className='eyebrow'>Engineering focus</dt>
                <dd className='mt-2 text-[14px] leading-6 text-gray-700'>{active.focus.join(' · ')}</dd>
              </div>
            )}
            {active.stack.length > 0 && (
              <div>
                <dt className='eyebrow'>Implementation</dt>
                <dd className='mt-2 text-[14px] leading-6 text-gray-600'>{active.stack.join(' · ')}</dd>
              </div>
            )}
            {active.result && (
              <div>
                <dt className='eyebrow'>Outcome</dt>
                <dd className='mt-2 text-[14px] leading-6 text-gray-700'>{active.result}</dd>
              </div>
            )}
          </dl>

          <div className='mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-9 text-sm'>
            <a href={active.href} className='signal-link font-medium'>Project details →</a>
            {active.repository && (
              <a href={active.repository} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-1 text-gray-500 hover:text-gray-900'>Repository <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden='true' /></a>
            )}
          </div>
        </section>
      </div>

      <div className='border border-gray-200 lg:hidden'>
        {projects.map((project) => (
          <article key={project.slug} className='border-b border-gray-200 px-4 py-6 last:border-b-0 sm:px-5'>
            <div className='flex items-center justify-between gap-4'>
              <p className='eyebrow'>{project.sequence}</p>
              <p className='eyebrow'>{project.year}</p>
            </div>
            <h3 className='mt-3 text-[20px] font-semibold leading-6 tracking-[-0.025em] text-gray-900'>
              <a href={project.href}>{project.title}</a>
            </h3>
            <p className='mt-2 max-w-[66ch] text-[15px] leading-6 text-gray-600'>{project.summary}</p>
            {project.role && <p className='mt-3 text-[13px] font-medium leading-5 text-gray-700'>{project.role}</p>}
            {project.focus.length > 0 && <p className='mt-2 text-[12px] leading-5 text-gray-500'>{project.focus.join(' · ')}</p>}
            {project.result && <p className='mt-3 max-w-[66ch] text-[14px] leading-6 text-gray-600'>{project.result}</p>}
            <div className='mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm'>
              <a href={project.href} className='signal-link font-medium'>Project details →</a>
              {project.repository && (
                <a href={project.repository} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-1 text-gray-500 hover:text-gray-900'>Repository <ArrowUpRight size={14} strokeWidth={1.8} aria-hidden='true' /></a>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
