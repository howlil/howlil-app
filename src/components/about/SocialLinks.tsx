import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { SOCIAL_LINKS } from '../../constants/socialLinks';

interface SocialLinksProps {
  orientation?: 'vertical' | 'horizontal';
}

const SocialLinks = ({ orientation = 'vertical' }: SocialLinksProps) => {
  const prefersReducedMotion = useReducedMotion();
  const isHorizontal = orientation === 'horizontal';

  return (
    <motion.div
      className={`flex gap-3 mb-4 ${isHorizontal ? 'flex-row flex-wrap items-center' : 'flex-col gap-1'}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.25 }}
    >
      {SOCIAL_LINKS.map((link) => {
        const Icon = link.icon;
        return (
          <motion.a
            key={link.label}
            href={link.href}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-2 py-1.5 min-h-[44px] px-2 text-gray-700 hover:text-gray-900 transition-colors group cursor-pointer'
            aria-label={link.label}
            whileHover={prefersReducedMotion ? {} : { y: -2, scale: 1.02 }}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
          >
            <Icon className='w-3.5 h-3.5 flex-shrink-0' aria-hidden="true" />
            <span className='text-xs text-gray-600 group-hover:text-gray-700 truncate'>
              {link.username}
            </span>
          </motion.a>
        );
      })}
    </motion.div>
  );
};

export default SocialLinks;
