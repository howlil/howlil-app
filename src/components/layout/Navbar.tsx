/** @format */

import { useEffect, useState } from 'react';
import { NAV_LINKS } from '../../constants/navigation';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const homeHref = NAV_LINKS.find((link) => link.name === 'Home')?.href ?? '/';

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
    if (storedTheme === 'dark' || storedTheme === 'light') {
      setIsDark(storedTheme === 'dark');
    } else {
      setIsDark(document.documentElement.classList.contains('dark'));
    }

    const updatePath = () => setCurrentPath(window.location.pathname);
    updatePath();
    window.addEventListener('popstate', updatePath);
    return () => window.removeEventListener('popstate', updatePath);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) setIsMobileMenuOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const desktopLinks = NAV_LINKS.filter((link) => link.name !== 'Home');

  const renderNavLink = (link: (typeof desktopLinks)[number], mobile = false) => {
    const isExternal = /^https?:\/\//.test(link.href);
    const isActive = !isExternal && isInternalLinkActive(currentPath, link.href);

    return (
      <a
        key={`${mobile ? 'mobile' : 'desktop'}-${link.name}`}
        href={link.href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        onClick={mobile ? () => setIsMobileMenuOpen(false) : undefined}
        role={mobile ? 'menuitem' : undefined}
        aria-current={isActive ? 'page' : undefined}
        className={
          mobile
            ? `block py-2 text-sm transition-colors ${isActive ? 'font-medium text-gray-900' : 'text-gray-600 hover:text-gray-900'}`
            : `relative py-4 text-sm transition-colors ${isActive ? 'font-medium text-gray-900 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-current' : 'text-gray-600 hover:text-gray-900'}`
        }
      >
        {link.name}
      </a>
    );
  };

  return (
    <nav
      className='site-ui fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md'
      style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--nav-border)' }}
      aria-label='Main navigation'
    >
      <div className='site-shell'>
        <div className='flex h-[52px] items-center justify-between gap-6'>
          <div className='flex min-w-0 items-center gap-7'>
            <a
              href={homeHref}
              className='shrink-0 font-mono text-xs font-semibold text-gray-900'
              aria-label='howlil home'
            >
              howlil
            </a>

            <div className='hidden items-center gap-6 md:flex'>
              {desktopLinks.map((link) => renderNavLink(link))}
            </div>
          </div>

          <div className='flex items-center gap-1'>
            <button
              type='button'
              onClick={() => applyTheme(!isDark)}
              className='flex min-h-[40px] min-w-[40px] items-center justify-center p-2 text-gray-600 transition-colors hover:text-gray-900'
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' />
                </svg>
              ) : (
                <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' />
                </svg>
              )}
            </button>

            <button
              type='button'
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className='flex min-h-[40px] min-w-[40px] items-center justify-center p-2 text-gray-600 hover:text-gray-900 md:hidden'
              aria-label='Toggle mobile menu'
              aria-expanded={isMobileMenuOpen}
              aria-controls='mobile-menu'
            >
              {isMobileMenuOpen ? (
                <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              ) : (
                <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 7h16M4 12h16M4 17h16' />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div
          id='mobile-menu'
          className={`overflow-hidden transition-all duration-200 md:hidden ${isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
          role='menu'
          aria-hidden={!isMobileMenuOpen}
        >
          <div className='space-y-1 border-t border-gray-200 py-3'>
            {desktopLinks.map((link) => renderNavLink(link, true))}
          </div>
        </div>
      </div>
    </nav>
  );
}
