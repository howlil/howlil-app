/** @format */

import {useEffect, useState} from 'react';
import {motion} from 'framer-motion';

interface Heading { id: string; text: string; level: number; }

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const prefersReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  useEffect(() => {
    const article = document.querySelector('article');
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
    }, {rootMargin: '-96px 0px -80% 0px'});

    headingElements.forEach((heading) => observer.observe(heading));
    return () => headingElements.forEach((heading) => observer.unobserve(heading));
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.pageYOffset - 96;
    window.scrollTo({top, behavior: prefersReducedMotion ? 'auto' : 'smooth'});
  };

  if (headings.length === 0) return null;

  return (
    <motion.nav
      className='hidden max-h-[calc(100vh-7rem)] overflow-y-auto rounded-xl border border-gray-200 bg-[var(--color-surface)] p-3 lg:block'
      aria-label='On this page'
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      transition={prefersReducedMotion ? {duration: 0} : {duration: 0.2}}
    >
      <div className='mb-2 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.04em] text-gray-500'>On this page</div>
      <ul className='space-y-0.5'>
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? 'pl-2' : ''}>
            <a
              href={`#${heading.id}`}
              onClick={(event) => handleClick(event, heading.id)}
              className={`block rounded-lg px-2 py-1.5 text-xs leading-5 transition-colors ${activeId === heading.id ? 'bg-[var(--color-accent-soft)] font-medium text-gray-900' : 'text-gray-500 hover:bg-[var(--color-surface-muted)] hover:text-gray-900'}`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
