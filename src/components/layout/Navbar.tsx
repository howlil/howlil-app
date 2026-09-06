/** @format */

import {AnimatePresence, motion, useReducedMotion} from "motion/react";
import {BookOpenText, Home, Info, MapPin, Monitor, Moon, PanelsTopLeft, Sun} from "lucide-react";
import {SITE} from "../../config/site";
import {
  useNavigationController,
  type ThemeMode,
} from "../../features/navigation/useNavigationController";
import {withBase} from "../../lib/paths";

const pageLinks = [
  {href: "/", label: "Home", Icon: Home},
  {href: "/projects", label: "Projects", Icon: PanelsTopLeft},
  {href: "/blog", label: "Writing", Icon: BookOpenText},
  {href: "/about", label: "About", Icon: Info},
];

function normalizePath(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

export default function Navbar() {
  const reduceMotion = useReducedMotion();
  const {
    navRef,
    isOpen,
    setIsOpen,
    themeMode,
    applyTheme,
    pathname,
    statusIndex,
    clockLabel,
  } = useNavigationController();

  const currentPath = normalizePath(pathname);
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
            <motion.img
              src={withBase("/profile.webp")}
              alt=""
              className="identity-avatar"
              animate={isOpen && !reduceMotion ? {scale: 1.04, rotate: -1.5} : {scale: 1, rotate: 0}}
              transition={{type: "spring", stiffness: 360, damping: 24}}
            />
            <span className="identity-copy">
              <strong>{SITE.name}</strong>
              <small>{status}</small>
            </span>
            <motion.kbd animate={isOpen && !reduceMotion ? {scale: 0.96, opacity: 0.8} : {scale: 1, opacity: 1}}>
              <span className="desktop-modifier">⌘</span><span className="mobile-modifier">Ctrl</span> K
            </motion.kbd>
          </motion.button>

          <AnimatePresence initial={false}>
            {isOpen && <motion.div
              id="reference-nav-menu"
              className="reference-menu"
              role="dialog"
              aria-label="Site navigation"
              initial={reduceMotion ? false : {height: 0, opacity: 0, y: -4}}
              animate={{height: "auto", opacity: 1, y: 0}}
              exit={reduceMotion ? {opacity: 0} : {height: 0, opacity: 0, y: -4}}
              transition={{duration: reduceMotion ? 0.01 : 0.24, ease: [0.22, 1, 0.36, 1]}}
            >
              <p className="reference-menu-heading">Pages</p>
              <nav aria-label="Page navigation">
                {pageLinks.map(({href, label, Icon}, index) => {
                  const targetPath = normalizePath(withBase(href));
                  const active = currentPath === targetPath || (targetPath !== "/" && currentPath.startsWith(`${targetPath}/`));
                  return (
                    <motion.a
                      key={href}
                      href={withBase(href)}
                      aria-current={active ? "page" : undefined}
                      className={active ? "reference-menu-link active" : "reference-menu-link"}
                      onClick={() => setIsOpen(false)}
                      initial={reduceMotion ? false : {opacity: 0, x: -7}}
                      animate={{opacity: 1, x: 0}}
                      transition={reduceMotion ? {duration: 0.01} : {delay: index * 0.035, duration: 0.2, ease: [0.22, 1, 0.36, 1]}}
                      whileHover={reduceMotion ? undefined : {x: 3}}
                      whileTap={reduceMotion ? undefined : {scale: 0.985}}
                    >
                      <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
                      <span>{label}</span>
                    </motion.a>
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
                      <motion.button
                        key={mode}
                        type="button"
                        onClick={() => applyTheme(mode)}
                        aria-pressed={themeMode === mode}
                        className={themeMode === mode ? "theme-option active" : "theme-option"}
                        whileHover={reduceMotion ? undefined : {y: -1, scale: 1.015}}
                        whileTap={reduceMotion ? undefined : {scale: 0.96}}
                        transition={{type: "spring", stiffness: 420, damping: 28}}
                      >
                        <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
                        {mode[0].toUpperCase() + mode.slice(1)}
                      </motion.button>
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
