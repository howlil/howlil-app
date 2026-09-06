import {useCallback, useEffect, useRef, useState, type MouseEvent} from 'react';
import {withBase} from '../../lib/paths';

export type ThemeMode = 'light' | 'dark' | 'system';
export type SectionId = 'home' | 'experience' | 'projects' | 'stack';

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

export function isHomePath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '');
  return normalized === '' || normalized === withBase('').replace(/\/+$/, '');
}

export function useNavigationController(sectionIds: readonly SectionId[]) {
  const [isOpen, setIsOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [currentSection, setCurrentSection] = useState<SectionId>('home');
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

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setCurrentSection(visible.target.id as SectionId);
    }, {rootMargin: '-18% 0px -62%', threshold: [0, 0.15, 0.45]});

    sections.forEach((section) => observer.observe(section));

    return () => {
      window.clearInterval(clockTimer);
      window.clearInterval(statusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
      media.removeEventListener('change', handleSystemTheme);
      observer.disconnect();
    };
  }, [applyTheme, sectionIds]);

  const handleSectionClick = useCallback((event: MouseEvent<HTMLAnchorElement>, id: SectionId) => {
    if (!isHomePath(window.location.pathname)) return;
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({behavior: reducedMotion ? 'auto' : 'smooth', block: 'start'});
    setCurrentSection(id);
    setIsOpen(false);
  }, []);

  return {
    navRef,
    isOpen,
    setIsOpen,
    themeMode,
    applyTheme,
    currentSection,
    pathname,
    statusIndex,
    clockLabel,
    onHomePage: isHomePath(pathname),
    handleSectionClick,
  };
}
