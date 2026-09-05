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
    if (storedTheme === 'dark' || storedTheme === 'light') setIsDark(storedTheme === 'dark');
    else setIsDark(document.documentElement.classList.contains('dark'));

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

  const desktopLinks = ['Work', 'Writing', 'About']
    .map((name) => NAV_LINKS.find((link) => link.name === name))
    .filter((link): link is NonNullable<typeof link> => Boolean(link));

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
            ? `block border-b border-gray-200 py-3 text-sm ${isActive ? 'font-semibold text-gray-900' : 'text-gray-600 hover:text-gray-900'}`
            : `py-2 text-[13px] transition-colors ${isActive ? 'font-semibold text-gray-900' : 'text-gray-600 hover:text-gray-900'}`
        }
      >
        {link.name}
      </a>
    );
  };

  return (
    <nav className='site-ui fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-[var(--nav-bg)]' aria-label='Main navigation'>
      <div className='site-shell flex h-[60px] items-center justify-between gap-6'>
        <a href={homeHref} className='shrink-0 text-[15px] font-semibold tracking-[-0.025em] text-gray-900' aria-label='howlil home'>
          howlil
        </a>

        <div className='hidden items-center gap-6 md:flex'>{desktopLinks.map((link) => renderNavLink(link))}</div>

        <div className='ml-auto flex items-center gap-2 md:ml-0'>
          <button
            type='button'
            onClick={() => applyTheme(!isDark)}
            className='flex min-h-[38px] min-w-[38px] items-center justify-center text-[16px] text-gray-600 transition-colors hover:text-gray-900'
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? '☀' : '☾'}
          </button>
          <button
            type='button'
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            className='flex min-h-[38px] items-center justify-center px-1 text-xs font-medium text-gray-600 hover:text-gray-900 md:hidden'
            aria-label='Toggle mobile menu'
            aria-expanded={isMobileMenuOpen}
            aria-controls='mobile-menu'
          >
            {isMobileMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      <div
        id='mobile-menu'
        className={`site-shell overflow-hidden transition-[max-height,opacity] duration-200 md:hidden ${isMobileMenuOpen ? 'max-h-56 pb-3 opacity-100' : 'max-h-0 opacity-0'}`}
        role='menu'
        aria-hidden={!isMobileMenuOpen}
      >
        <div className='border-t border-gray-200'>{desktopLinks.map((link) => renderNavLink(link, true))}</div>
      </div>
    </nav>
  );
}
