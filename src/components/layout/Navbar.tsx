/** @format */

import {useEffect, useRef, useState} from "react";
import {BookOpenText, Briefcase, Code2, Home, Info, MapPin, Monitor, Moon, PanelsTopLeft, Star, Sun} from "lucide-react";
import {SITE} from "../../config/site";
import {withBase} from "../../lib/paths";

type ThemeMode = "light" | "dark" | "system";
type SectionId = "home" | "experience" | "projects" | "stack";

const sectionLinks = [
  {id: "home" as SectionId, label: "Home", Icon: Home},
  {id: "experience" as SectionId, label: "Experience", Icon: Briefcase},
  {id: "projects" as SectionId, label: "Projects", Icon: Star},
  {id: "stack" as SectionId, label: "Tech Stack", Icon: Code2},
];

const pageLinks = [
  {href: "/projects", label: "All Projects", Icon: PanelsTopLeft},
  {href: "/blog", label: "Writing", Icon: BookOpenText},
  {href: "/about", label: "About", Icon: Info},
];

function isHomePath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, "");
  return normalized === "" || normalized === withBase("").replace(/\/+$/, "");
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [currentSection, setCurrentSection] = useState<SectionId>("home");
  const [pathname, setPathname] = useState("/");
  const [statusIndex, setStatusIndex] = useState(0);
  const [clockLabel, setClockLabel] = useState("");
  const navRef = useRef<HTMLDivElement>(null);

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = mode === "dark" || (mode === "system" && prefersDark);
    root.classList.toggle("dark", isDark);
    root.dataset.theme = mode;
    root.style.colorScheme = isDark ? "dark" : "light";
    if (mode === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", mode);
    setThemeMode(mode);
  };

  useEffect(() => {
    setPathname(window.location.pathname);
    const storedTheme = localStorage.getItem("theme");
    const nextTheme: ThemeMode = storedTheme === "dark" || storedTheme === "light" ? storedTheme : "system";
    setThemeMode(nextTheme);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemTheme = () => {
      if ((localStorage.getItem("theme") ?? "system") === "system") applyTheme("system");
    };

    const updateClock = () => {
      setClockLabel(new Intl.DateTimeFormat("en", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      }).format(new Date()));
    };

    updateClock();
    const clockTimer = window.setInterval(updateClock, 60_000);
    const statusTimer = window.setInterval(() => setStatusIndex((index) => (index + 1) % 4), 4_200);

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen((open) => !open);
      }
      if (event.key === "Escape") setIsOpen(false);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handlePointerDown);
    media.addEventListener("change", handleSystemTheme);

    const sections = sectionLinks
      .map(({id}) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setCurrentSection(visible.target.id as SectionId);
    }, {rootMargin: "-18% 0px -62%", threshold: [0, 0.15, 0.45]});

    sections.forEach((section) => observer.observe(section));

    return () => {
      window.clearInterval(clockTimer);
      window.clearInterval(statusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handlePointerDown);
      media.removeEventListener("change", handleSystemTheme);
      observer.disconnect();
    };
  }, []);

  const handleSectionClick = (event: React.MouseEvent<HTMLAnchorElement>, id: SectionId) => {
    if (!isHomePath(window.location.pathname)) return;
    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({behavior: reducedMotion ? "auto" : "smooth", block: "start"});
    setCurrentSection(id);
    setIsOpen(false);
  };

  const status = [
    <><span className="identity-status-dot" aria-hidden="true" />Available for new work</>,
    <><MapPin size={12} strokeWidth={2} aria-hidden="true" />Remote · Jakarta</>,
    <>{clockLabel ? `${clockLabel} (UTC+7)` : "Jakarta time"}</>,
    <>Backend & Infrastructure</>,
  ][statusIndex];
  const onHomePage = isHomePath(pathname);

  return (
    <div ref={navRef} className={isOpen ? "reference-nav is-open" : "reference-nav"}>
      <div className="reference-nav-surface">
        <button
          type="button"
          className="identity-pill"
          aria-expanded={isOpen}
          aria-controls="reference-nav-menu"
          onClick={() => setIsOpen((open) => !open)}
        >
          <img src={withBase("/profile.webp")} alt="" className="identity-avatar" />
          <span className="identity-copy">
            <strong>{SITE.name}</strong>
            <small>{status}</small>
          </span>
          <kbd><span className="desktop-modifier">⌘</span><span className="mobile-modifier">Ctrl</span> K</kbd>
        </button>

        <div id="reference-nav-menu" className="reference-menu" role="dialog" aria-label="Site navigation" aria-hidden={!isOpen}>
          <p className="reference-menu-heading">Sections</p>
          <nav aria-label="Primary navigation">
            {sectionLinks.map(({id, label, Icon}) => (
              <a
                key={id}
                href={`${withBase("/")}#${id}`}
                aria-current={onHomePage && currentSection === id ? "location" : undefined}
                onClick={(event) => handleSectionClick(event, id)}
                className={onHomePage && currentSection === id ? "reference-menu-link active" : "reference-menu-link"}
              >
                <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
                <span>{label}</span>
              </a>
            ))}
          </nav>

          <div className="reference-menu-divider" />
          <p className="reference-menu-heading">Pages</p>
          <nav aria-label="Page navigation">
            {pageLinks.map(({href, label, Icon}) => {
              const currentPath = pathname.replace(/\/+$/, "") || "/";
              const targetPath = withBase(href).replace(/\/+$/, "") || "/";
              const active = currentPath === targetPath || (targetPath !== "/" && currentPath.startsWith(`${targetPath}/`));
              return (
                <a
                  key={href}
                  href={withBase(href)}
                  aria-current={active ? "page" : undefined}
                  className={active ? "reference-menu-link active" : "reference-menu-link"}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
                  <span>{label}</span>
                </a>
              );
            })}
          </nav>

          <div className="reference-menu-divider" />
          <div className="reference-theme">
            <span>Theme</span>
            <div role="group" aria-label="Theme">
              {(["light", "dark", "system"] as ThemeMode[]).map((mode) => {
                const Icon = mode === "light" ? Sun : mode === "dark" ? Moon : Monitor;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => applyTheme(mode)}
                    aria-pressed={themeMode === mode}
                    className={themeMode === mode ? "theme-option active" : "theme-option"}
                  >
                    <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
                    {mode[0].toUpperCase() + mode.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
