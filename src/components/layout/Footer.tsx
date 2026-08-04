/** @format */

import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SOCIAL_LINKS } from '../../constants/socialLinks';

export default function Footer() {
  const prefersReducedMotion = useReducedMotion();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className='site-footer border-t border-gray-200'
      style={{ backgroundColor: 'var(--surface-bg)' }}
    >
      <div className='max-w-2xl mx-auto px-4 sm:px-6 py-8'>
        <div className='flex flex-col items-center gap-6'>
          {/* Social Links */}
          <div className='flex items-center gap-4 flex-wrap justify-center'>
            {SOCIAL_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='p-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center'
                  aria-label={link.label}
                  whileHover={prefersReducedMotion ? {} : { y: -2, scale: 1.05 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                >
                  <Icon className='w-5 h-5' aria-hidden='true' />
                </motion.a>
              );
            })}
          </div>

          {/* Copyright */}
          <div className='text-center'>
            <p className='text-sm text-gray-600'>
              &copy; {currentYear} Mhd Ulil Abshar. All rights reserved.
            </p>
            <p className='text-xs text-gray-500 mt-1'>
              Built with Astro, React, and Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
