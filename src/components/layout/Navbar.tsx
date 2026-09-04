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
            ? `block rounded-lg px-3 py-2.5 text-sm transition-colors ${isActive ? 'bg-[var(--color-surface-muted)] font-medium text-gray-900' : 'text-gray-600 hover:bg-[var(--color-surface-muted)] hover:text-gray-900'}`
            : `rounded-lg px-2.5 py-2 text-sm transition-colors ${isActive ? 'font-medium text-gray-900' : 'text-gray-600 hover:bg-[var(--color-surface-muted)] hover:text-gray-900'}`
        }
      >
        {link.name}{isExternal ? ' ↗' : ''}
      </a>
    );
  };

  return (
    <nav className='site-ui fixed inset-x-0 top-0 z-50 pt-3' aria-label='Main navigation'>
      <div className='site-shell'>
        <div
          className='rounded-2xl border px-3 shadow-[0_8px_30px_rgba(30,26,21,0.06)] backdrop-blur-md'
          style={{backgroundColor: 'var(--nav-bg)', borderColor: 'var(--nav-border)'}}
        >
          <div className='flex h-[52px] items-center justify-between gap-5'>
            <div className='flex min-w-0 items-center gap-4'>
              <a href={homeHref} className='shrink-0 px-1 text-[14px] font-semibold tracking-[-0.025em] text-gray-900' aria-label='howlil home'>
                howlil
              </a>
              <div className='hidden items-center gap-0.5 md:flex'>{desktopLinks.map((link) => renderNavLink(link))}</div>
            </div>

            <div className='flex items-center gap-1'>
              <button
                type='button'
                onClick={() => applyTheme(!isDark)}
                className='flex min-h-[38px] min-w-[38px] items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-[var(--color-surface-muted)] hover:text-gray-900'
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? '☀' : '☾'}
              </button>
              <button
                type='button'
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                className='flex min-h-[38px] items-center justify-center rounded-lg px-3 text-xs font-medium text-gray-600 hover:bg-[var(--color-surface-muted)] hover:text-gray-900 md:hidden'
                aria-label='Toggle mobile menu'
                aria-expanded={isMobileMenuOpen}
                aria-controls='mobile-menu'
              >
                {isMobileMenuOpen ? 'Close' : 'Menu'}
              </button>
            </div>
          </div>

          <div id='mobile-menu' className={`overflow-hidden transition-all duration-200 md:hidden ${isMobileMenuOpen ? 'max-h-72 pb-3 opacity-100' : 'max-h-0 opacity-0'}`} role='menu' aria-hidden={!isMobileMenuOpen}>
            <div className='border-t border-gray-200 pt-2'>{desktopLinks.map((link) => renderNavLink(link, true))}</div>
          </div>
        </div>
      </div>
    </nav>
  );
}
