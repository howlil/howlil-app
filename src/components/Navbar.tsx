/** @format */

import {useState, useEffect} from 'react';
import SearchModal from './SearchModal';

interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  {name: 'Home', href: '/'},
  {name: 'Project', href: '/projects'},
  {name: 'Blog', href: '/blog'},
  {name: 'Shorts', href: '/shorts'},
  {
    name: 'Resume',
    href: 'https://drive.google.com/file/d/1fvp5VfE-dk3-HzG6vbxfHvEEvAiBkHPQ/view?usp=sharing',
  },
];

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark';

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setIsDark(isDarkMode);

    const updatePath = () => {
      setCurrentPath(window.location.pathname);
    };

    updatePath();

    window.addEventListener('popstate', updatePath);

    return () => {
      window.removeEventListener('popstate', updatePath);
    };
  }, []);

  useEffect(() => {
    // Ctrl+K or Cmd+K to open search
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      // ESC to close mobile menu
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    // Close mobile menu on window resize to desktop
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;

    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    setIsDark(newIsDark);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className='fixed top-0 left-0 right-0 backdrop-blur-md border-b z-50'
        style={{
          backgroundColor: 'var(--nav-bg)',
          borderColor: 'var(--nav-border)',
        }}
      >
        <div className='max-w-2xl mx-auto px-4 sm:px-6'>
          <div className='flex items-center justify-between h-14'>
            {/* Desktop Navigation Links */}
            <div className='hidden md:flex items-center gap-8'>
              {navLinks.map((link) => {
                const isExternal =
                  link.href.startsWith('http://') ||
                  link.href.startsWith('https://');
                const isActive =
                  !isExternal &&
                  (currentPath === link.href ||
                    (link.href !== '/' && currentPath.startsWith(link.href)));

                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    className={`text-sm transition-colors duration-200 ${
                      isActive
                        ? 'text-gray-800  underline underline-offset-4 decoration-2'
                        : 'text-gray-800  hover:text-gray-500'
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={toggleMobileMenu}
              className='md:hidden p-2 text-gray-800  hover:text-gray-500'
              aria-label='Toggle menu'
            >
              {isMobileMenuOpen ? (
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              ) : (
                <svg
                  className='w-6 h-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              )}
            </button>

            {/* Right Side Actions */}
            <div className='flex items-center gap-2'>
              <button
                onClick={() => setIsSearchOpen(true)}
                className='flex items-center gap-2 px-2 sm:px-3 py-1.5 text-sm text-gray-800  hover:text-gray-800 hover:bg-gray-500/20 rounded-md group'
                aria-label='Search'
              >
                <svg
                  className='w-4 h-4 duration-200'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
                <span className='hidden sm:inline'>Search</span>
                <kbd className='hidden lg:inline px-1.5 py-0.5 text-xs bg-gray-800/40 text-gray-800  rounded pointer-events-none transition-none'>
                  ⌘K
                </kbd>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className='p-2 text-gray-800  hover:text-gray-500 transition-colors'
                aria-label='Toggle dark mode'
              >
                {isDark ? (
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
                    />
                  </svg>
                ) : (
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className='py-4 space-y-3 border-t border-gray-200'>
              {navLinks.map((link) => {
                const isExternal =
                  link.href.startsWith('http://') ||
                  link.href.startsWith('https://');
                const isActive =
                  !isExternal &&
                  (currentPath === link.href ||
                    (link.href !== '/' && currentPath.startsWith(link.href)));

                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    onClick={closeMobileMenu}
                    className={`block text-sm transition-colors duration-200 py-2 ${
                      isActive
                        ? 'text-gray-800  font-semibold underline underline-offset-4 decoration-2'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
