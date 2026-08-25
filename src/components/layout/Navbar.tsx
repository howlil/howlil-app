/** @format */

import { useEffect, useRef, useState } from 'react';
import { SearchModal } from '../interactive';
import { NAV_LINKS } from '../../constants/navigation';

function normalizePath(path: string): string {
  const normalized = path.split(/[?#]/, 1)[0].replace(/\/+$/, '');
  return normalized || '/';
}

function isInternalLinkActive(currentPath: string, href: string, homeHref: string): boolean {
  const current = normalizePath(currentPath);
  const target = normalizePath(href);
  const home = normalizePath(homeHref);

  if (target === home) return current === home;
  return current === target || current.startsWith(`${target}/`);
}

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
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
    applyTheme(localStorage.getItem('theme') === 'dark');

    const updatePath = () => setCurrentPath(window.location.pathname);
    updatePath();
    window.addEventListener('popstate', updatePath);
    return () => window.removeEventListener('popstate', updatePath);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
      }

      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
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

  const renderNavLink = (link: (typeof NAV_LINKS)[number], mobile = false) => {
    const isExternal = /^https?:\/\//.test(link.href);
    const isActive = !isExternal && isInternalLinkActive(currentPath, link.href, homeHref);

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
            ? `block py-2 text-sm transition-colors ${
                isActive
                  ? 'font-semibold text-gray-800 underline decoration-2 underline-offset-4'
                  : 'text-gray-700 hover:text-gray-900'
              }`
            : `text-sm transition-colors duration-200 ${
                isActive
                  ? 'text-gray-800 underline decoration-2 underline-offset-4'
                  : 'text-gray-800 hover:text-gray-500'
              }`
        }
      >
        {link.name}
      </a>
    );
  };

  return (
    <>
      <nav
        className='fixed left-0 right-0 top-0 z-50 border-b backdrop-blur-md'
        style={{ backgroundColor: 'var(--nav-bg)', borderColor: 'var(--nav-border)' }}
        aria-label='Main navigation'
      >
        <div className='mx-auto max-w-4xl px-6'>
          <div className='flex h-14 items-center justify-between'>
            <div className='hidden items-center gap-8 md:flex'>
              {NAV_LINKS.map((link) => renderNavLink(link))}
            </div>

            <button
              type='button'
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className='flex min-h-[44px] min-w-[44px] items-center justify-center p-3 text-gray-800 hover:text-gray-500 md:hidden'
              aria-label='Toggle mobile menu'
              aria-expanded={isMobileMenuOpen}
              aria-controls='mobile-menu'
            >
              {isMobileMenuOpen ? (
                <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              ) : (
                <svg className='h-6 w-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                </svg>
              )}
            </button>

            <div className='flex items-center gap-1'>
              <button
                ref={searchButtonRef}
                type='button'
                onClick={() => setIsSearchOpen(true)}
                className='flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-md px-2 py-1.5 text-sm text-gray-800 hover:bg-gray-500/20 sm:px-3'
                aria-label='Open search modal'
                aria-haspopup='dialog'
                aria-expanded={isSearchOpen}
              >
                <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                </svg>
                <span className='hidden sm:inline'>Search</span>
                <kbd className='pointer-events-none hidden rounded bg-gray-800/10 px-1.5 py-0.5 text-xs lg:inline'>⌘K</kbd>
              </button>

              <button
                type='button'
                onClick={() => applyTheme(!isDark)}
                className='flex min-h-[44px] min-w-[44px] items-center justify-center p-2 text-gray-800 transition-colors hover:text-gray-500'
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? (
                  <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z' />
                  </svg>
                ) : (
                  <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div
            id='mobile-menu'
            className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
              isMobileMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            }`}
            role='menu'
            aria-hidden={!isMobileMenuOpen}
          >
            <div className='space-y-3 border-t border-gray-200 py-4'>
              {NAV_LINKS.map((link) => renderNavLink(link, true))}
            </div>
          </div>
        </div>
      </nav>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        returnFocusRef={searchButtonRef}
      />
    </>
  );
}