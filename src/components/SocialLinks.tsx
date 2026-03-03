import {Linkedin, Github, Code2, Twitter, Trophy, Clock} from 'lucide-react';
import {motion} from 'framer-motion';

interface SocialLinksProps {
  orientation?: 'vertical' | 'horizontal';
}

const SocialLinks = ({ orientation = 'vertical' }: SocialLinksProps) => {
  const links = [
    {
      href: 'https://www.linkedin.com/in/mhdulilabshar/',
      icon: Linkedin,
      label: 'LinkedIn',
      username: 'mhdulilabshar',
    },
    {
      href: 'https://github.com/howlil',
      icon: Github,
      label: 'GitHub',
      username: 'howlil',
    },
    {
      href: 'https://leetcode.com/u/howlil/',
      icon: Code2,
      label: 'LeetCode',
      username: 'howlil',
    },
    {
      href: 'https://x.com/howlildev',
      icon: Twitter,
      label: 'Twitter',
      username: '@howlildev',
    },
    {
      href: 'https://www.hackerrank.com/profile/howlil',
      icon: Trophy,
      label: 'HackerRank',
      username: 'howlil',
    },
    {
      href: 'https://wakatime.com/@howlil',
      icon: Clock,
      label: 'WakaTime',
      username: '@howlil',
    },
  ];

  const isHorizontal = orientation === 'horizontal';

  return (
    <motion.div
      className={`flex gap-3 mb-4 ${isHorizontal ? 'flex-row flex-wrap items-center' : 'flex-col gap-1'}`}
      initial={{opacity: 0, y: 6}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.25}}
    >
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <motion.a
            key={link.label}
            href={link.href}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-2 py-1 text-gray-700 hover:text-gray-900 transition-colors group'
            aria-label={link.label}
            whileHover={{y: -2, scale: 1.02}}
            whileTap={{scale: 0.97}}
          >
            <Icon className='w-3.5 h-3.5 flex-shrink-0' />
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
