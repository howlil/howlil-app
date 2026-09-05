/** @format */

import {useEffect, useState} from 'react';

interface Heading { id: string; text: string; level: number; }

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const article = document.querySelector('#article-content');
    if (!article) return;
    const headingElements = article.querySelectorAll('h2, h3');
    const headingsList: Heading[] = [];

    headingElements.forEach((heading) => {
      if (!heading.id) heading.id = heading.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '';
      headingsList.push({id: heading.id, text: heading.textContent || '', level: parseInt(heading.tagName.substring(1))});
    });
    setHeadings(headingsList);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActiveId(entry.target.id); });
    }, {rootMargin: '-10% 0px -78% 0px'});

    headingElements.forEach((heading) => observer.observe(heading));
    return () => headingElements.forEach((heading) => observer.unobserve(heading));
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    element.scrollIntoView({behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start'});
    history.replaceState(null, '', `#${id}`);
  };

  if (headings.length === 0) return null;

  return (
    <nav className='hidden lg:block' aria-label='On this page'>
      <p className='mb-3 font-mono text-[10px] uppercase tracking-[0.04em] text-gray-500'>On this page</p>
      <ul className='border-t border-gray-200'>
        {headings.map((heading) => (
          <li key={heading.id} className='border-b border-gray-200'>
            <a
              href={`#${heading.id}`}
              onClick={(event) => handleClick(event, heading.id)}
              className={`block py-2.5 text-[11px] leading-4 transition-colors ${heading.level === 3 ? 'pl-3' : ''} ${
                activeId === heading.id ? 'font-medium text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
