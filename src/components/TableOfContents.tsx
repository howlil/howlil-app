/** @format */

import {useEffect, useState} from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const article = document.querySelector('article');
    if (!article) return;

    const headingElements = article.querySelectorAll('h2, h3');
    const headingsList: Heading[] = [];

    headingElements.forEach((heading) => {
      // Create ID if doesn't exist
      if (!heading.id) {
        const id =
          heading.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || '';
        heading.id = id;
      }

      headingsList.push({
        id: heading.id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.substring(1)),
      });
    });

    setHeadings(headingsList);

    // Intersection Observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -80% 0px',
      }
    );

    headingElements.forEach((heading) => observer.observe(heading));

    return () => {
      headingElements.forEach((heading) => observer.unobserve(heading));
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className='hidden lg:block sticky top-24 self-start'>
      <nav className='max-h-[calc(100vh-8rem)] overflow-y-auto border-l border-gray-500/20 pl-6'>
        <div className='text-sm  font-semibold text-gray-800 mb-4 uppercase tracking-wide'>
          On This Page
        </div>
        <ul className='space-y-2.5'>
          {headings.map((heading) => (
            <li
              key={heading.id}
              style={{
                paddingLeft: heading.level === 3 ? '0.75rem' : '0',
              }}
            >
              <a
                href={`#${heading.id}`}
                onClick={(e) => handleClick(e, heading.id)}
                className={`block text-sm  transition-colors leading-tight ${
                  activeId === heading.id
                    ? 'text-gray-800 font-semibold border-l-2  pl-3 -ml-[1px]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
