import {useCallback, useEffect, useRef, useState} from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

function readThemeMode(): ThemeMode {
  const storedTheme = localStorage.getItem('theme');
  return storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : 'system';
}

function applyThemeToDocument(mode: ThemeMode) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = mode === 'dark' || (mode === 'system' && prefersDark);

  root.classList.toggle('dark', isDark);
  root.dataset.theme = mode;
  root.style.colorScheme = isDark ? 'dark' : 'light';

  if (mode === 'system') localStorage.removeItem('theme');
  else localStorage.setItem('theme', mode);
}

export function useNavigationController() {
  const [isOpen, setIsOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [pathname, setPathname] = useState('/');
  const [statusIndex, setStatusIndex] = useState(0);
  const [clockLabel, setClockLabel] = useState('');
  const navRef = useRef<HTMLDivElement>(null);

  const applyTheme = useCallback((mode: ThemeMode) => {
    applyThemeToDocument(mode);
    setThemeMode(mode);
  }, []);

  useEffect(() => {
    setPathname(window.location.pathname);
    setThemeMode(readThemeMode());

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemTheme = () => {
      if (readThemeMode() === 'system') applyTheme('system');
    };
    const updateClock = () => {
      setClockLabel(new Intl.DateTimeFormat('en', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta',
      }).format(new Date()));
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsOpen((open) => !open);
      }
      if (event.key === 'Escape') setIsOpen(false);
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setIsOpen(false);
    };

    updateClock();
    const clockTimer = window.setInterval(updateClock, 60_000);
    const statusTimer = window.setInterval(() => setStatusIndex((index) => (index + 1) % 4), 4_200);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handlePointerDown);
    media.addEventListener('change', handleSystemTheme);

    return () => {
      window.clearInterval(clockTimer);
      window.clearInterval(statusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
      media.removeEventListener('change', handleSystemTheme);
    };
  }, [applyTheme]);

  return {
    navRef,
    isOpen,
    setIsOpen,
    themeMode,
    applyTheme,
    pathname,
    statusIndex,
    clockLabel,
  };
}
