import { useState, useEffect } from "react";

interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Project", href: "/hackathons" },
  { name: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.body.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    document.body.classList.toggle("dark");
    setIsDark(!isDark);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-2xl mx-auto  py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-serif text-gray-600 hover:text-gray-900 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              // Sun icon
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              // Moon icon
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
