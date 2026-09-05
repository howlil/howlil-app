/** @format */

import {useEffect, useState} from 'react';
import {NAV_LINKS} from '../../constants/navigation';

function normalizePath(path: string): string {
  const normalized = path.split(/[?#]/, 1)[0].replace(/\/+$/, '');
  return normalized || '/';
}

function isInternalLinkActive(currentPath: string, href: string): boolean {
  const current = normalizePath(currentPath);
  const target = normalizePath(href);
  return target === '/' ? current === '/' : current === target || current.startsWith(`${target}/`);
}

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  const applyTheme = (nextIsDark: boolean) => {
    const root = document.documentElement;
    root.classList.toggle('dark', nextIsDark);
    root.dataset.theme = nextIsDark ? 'dark' : 'light';
    root.style.colorScheme = nextIsDark ? 'dark' : 'light';
    localStorage.setItem('theme', nextIsDark ? 'dark' : 'light');
    setIsDark(nextIsDark);
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || storedTheme === 'light') setIsDark(storedTheme === 'dark');
    else setIsDark(document.documentElement.classList.contains('dark'));

    const updatePath = () => setCurrentPath(window.location.pathname);
    updatePath();
    window.addEventListener('popstate', updatePath);
    return () => window.removeEventListener('popstate', updatePath);
  }, []);

  const links = ['Home', 'Work', 'Writing', 'About']
    .map((name) => NAV_LINKS.find((link) => link.name === name))
    .filter((link): link is NonNullable<typeof link> => Boolean(link));

  return (
    <div className='site-ui pointer-events-none fixed inset-x-0 z-50 flex justify-center px-3' style={{bottom: 'max(14px, env(safe-area-inset-bottom))'}}>
      <nav
        className='pointer-events-auto flex max-w-full items-center gap-1 rounded-[14px] border border-[var(--color-border-strong)] bg-[var(--floating-nav-bg)] p-1.5 shadow-[0_12px_34px_rgba(24,24,23,0.10)] backdrop-blur-xl'
        aria-label='Primary navigation'
      >
        {links.map((link) => {
          const isActive = isInternalLinkActive(currentPath, link.href);
          return (
            <a
              key={link.name}
              href={link.href}
              aria-current={isActive ? 'page' : undefined}
              className={`rounded-[9px] px-3 py-2 text-[12px] font-medium transition-colors sm:px-3.5 ${
                isActive
                  ? 'bg-[var(--color-floating-active)] text-gray-900'
                  : 'text-gray-600 hover:bg-[var(--color-surface-muted)] hover:text-gray-900'
              }`}
            >
              {link.name}
            </a>
          );
        })}

        <span className='mx-0.5 h-5 w-px bg-[var(--color-border)]' aria-hidden='true' />
        <button
          type='button'
          onClick={() => applyTheme(!isDark)}
          className='flex h-8 w-8 items-center justify-center rounded-[9px] text-[15px] text-gray-600 transition-colors hover:bg-[var(--color-surface-muted)] hover:text-gray-900'
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? '☀' : '☾'}
        </button>
      </nav>
    </div>
  );
}
