/** @format */

import {AnimatePresence, motion, useReducedMotion} from "motion/react";
import {BookOpenText, Briefcase, Code2, Home, Info, MapPin, Monitor, Moon, PanelsTopLeft, Star, Sun} from "lucide-react";
import {SITE} from "../../config/site";
import {
  useNavigationController,
  type SectionId,
  type ThemeMode,
} from "../../features/navigation/useNavigationController";
import {withBase} from "../../lib/paths";

const sectionIds: readonly SectionId[] = ["home", "experience", "projects", "stack"];
const sectionLinks = [
  {id: "home" as const, label: "Home", Icon: Home},
  {id: "experience" as const, label: "Experience", Icon: Briefcase},
  {id: "projects" as const, label: "Projects", Icon: Star},
  {id: "stack" as const, label: "Tech Stack", Icon: Code2},
];
const pageLinks = [
  {href: "/projects", label: "All Projects", Icon: PanelsTopLeft},
  {href: "/blog", label: "Writing", Icon: BookOpenText},
  {href: "/about", label: "About", Icon: Info},
];

export default function Navbar() {
  const reduceMotion = useReducedMotion();
  const {
    navRef,
    isOpen,
    setIsOpen,
    themeMode,
    applyTheme,
    currentSection,
    pathname,
    statusIndex,
    clockLabel,
    onHomePage,
    handleSectionClick,
  } = useNavigationController(sectionIds);

  const status = [
    <>
      <motion.span
        className="identity-status-dot"
        aria-hidden="true"
        animate={reduceMotion ? undefined : {
          scale: [1, 1.18, 1],
          opacity: [0.82, 1, 0.82],
          boxShadow: [
            "0 0 0 2px rgba(94,227,154,.13), 0 0 0 rgba(94,227,154,0)",
            "0 0 0 4px rgba(94,227,154,.09), 0 0 11px rgba(94,227,154,.62)",
            "0 0 0 2px rgba(94,227,154,.13), 0 0 0 rgba(94,227,154,0)",
          ],
        }}
        transition={reduceMotion ? undefined : {duration: 1.8, repeat: Infinity, ease: "easeInOut"}}
      />
      Available for new work
    </>,
    <><MapPin size={12} strokeWidth={2} aria-hidden="true" />Remote · Jakarta</>,
    <>{clockLabel ? `${clockLabel} (UTC+7)` : "Jakarta time"}</>,
    <>Backend & Infrastructure</>,
  ][statusIndex];

  return (
    <>
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-36"
        aria-hidden="true"
        style={{
          background: "linear-gradient(to bottom, color-mix(in srgb, var(--color-page) 80%, transparent) 0%, color-mix(in srgb, var(--color-page) 48%, transparent) 58%, transparent 100%)",
          backdropFilter: "blur(18px) saturate(1.12)",
          WebkitBackdropFilter: "blur(18px) saturate(1.12)",
          maskImage: "linear-gradient(to bottom, black 0%, black 68%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 68%, transparent 100%)",
        }}
      />

      <motion.div
        ref={navRef}
        layout="size"
        className={isOpen ? "reference-nav is-open" : "reference-nav"}
        onHoverStart={() => setIsOpen(true)}
        onHoverEnd={() => {
          if (!navRef.current?.contains(document.activeElement)) setIsOpen(false);
        }}
        transition={{layout: reduceMotion ? {duration: 0.01} : {type: "spring", stiffness: 420, damping: 38}}}
      >
        <motion.div
          layout
          className="reference-nav-surface"
          style={{
            background: "color-mix(in srgb, var(--color-surface) 74%, transparent)",
            backdropFilter: "blur(22px) saturate(1.18)",
            WebkitBackdropFilter: "blur(22px) saturate(1.18)",
          }}
        >
          <motion.button
            type="button"
            className="identity-pill"
            aria-expanded={isOpen}
            aria-controls="reference-nav-menu"
            onClick={() => setIsOpen((open) => !open)}
            whileTap={reduceMotion ? undefined : {scale: 0.985}}
          >
            <img src={withBase("/profile.webp")} alt="" className="identity-avatar" />
            <span className="identity-copy">
              <strong>{SITE.name}</strong>
              <small>{status}</small>
            </span>
            <kbd><span className="desktop-modifier">⌘</span><span className="mobile-modifier">Ctrl</span> K</kbd>
          </motion.button>

          <AnimatePresence initial={false}>
            {isOpen && <motion.div
              id="reference-nav-menu"
              className="reference-menu"
              role="dialog"
              aria-label="Site navigation"
              initial={reduceMotion ? false : {height: 0, opacity: 0}}
              animate={{height: "auto", opacity: 1}}
              exit={reduceMotion ? {opacity: 0} : {height: 0, opacity: 0}}
              transition={{duration: reduceMotion ? 0.01 : 0.24, ease: [0.22, 1, 0.36, 1]}}
            >
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
            </motion.div>}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}
