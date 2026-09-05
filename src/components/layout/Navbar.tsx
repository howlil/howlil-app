/** @format */

import {useEffect, useState} from "react";
import {NAV_LINKS} from "../../constants/navigation";
import {withBase} from "../../lib/paths";

function normalizePath(path: string): string {
  const normalized = path.split(/[?#]/, 1)[0].replace(/\/+$/, "");
  return normalized || "/";
}

function isInternalLinkActive(currentPath: string, href: string): boolean {
  const current = normalizePath(currentPath);
  const target = normalizePath(href);
  return target === "/" ? current === "/" : current === target || current.startsWith(target + "/");
}

type ThemeMode = "light" | "dark" | "system";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [currentPath, setCurrentPath] = useState("");

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
    const storedTheme = localStorage.getItem("theme");
    const nextTheme: ThemeMode = storedTheme === "dark" || storedTheme === "light" ? storedTheme : "system";
    setThemeMode(nextTheme);

    const updatePath = () => setCurrentPath(window.location.pathname);
    updatePath();

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen((open) => !open);
      }
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("popstate", updatePath);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("popstate", updatePath);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const links = ["Home", "Projects", "Writing", "About"]
    .map((name) => NAV_LINKS.find((link) => link.name === name))
    .filter((link): link is NonNullable<typeof link> => Boolean(link));

  return (
    <div className="reference-nav">
      <button
        type="button"
        className="identity-pill"
        aria-expanded={isOpen}
        aria-controls="reference-nav-menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <img src={withBase("/profile.webp")} alt="" className="identity-avatar" />
        <span className="identity-copy">
          <strong>Mhd Ulil Abshar</strong>
          <small>Backend & Infrastructure</small>
        </span>
        <kbd><span className="desktop-modifier">⌘</span><span className="mobile-modifier">Ctrl</span> K</kbd>
      </button>

      {isOpen && (
        <div id="reference-nav-menu" className="reference-menu" role="dialog" aria-label="Site navigation">
          <div className="reference-menu-heading">
            <span>Sections</span>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close navigation">×</button>
          </div>
          <nav aria-label="Primary navigation">
            {links.map((link) => {
              const isActive = isInternalLinkActive(currentPath, link.href);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={isActive ? "reference-menu-link active" : "reference-menu-link"}
                >
                  <span>{link.name}</span>
                  <span aria-hidden="true">→</span>
                </a>
              );
            })}
          </nav>
          <div className="reference-menu-divider" />
          <div className="reference-theme">
            <span>Theme</span>
            <div role="group" aria-label="Theme">
              {(["light", "dark", "system"] as ThemeMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => applyTheme(mode)}
                  aria-pressed={themeMode === mode}
                  className={themeMode === mode ? "theme-option active" : "theme-option"}
                >
                  {mode[0].toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
