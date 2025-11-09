import {Linkedin, Github, Code2, Twitter, Trophy, Clock} from 'lucide-react';

const SocialLinks = () => {
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

  return (
    <div className='flex flex-col gap-1 mb-4'>
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.label}
            href={link.href}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-2 py-1 text-gray-700 hover:text-gray-900 transition-colors group'
            aria-label={link.label}
          >
            <Icon className='w-3.5 h-3.5 flex-shrink-0' />
            <span className='text-xs text-gray-600 group-hover:text-gray-700 truncate'>
              {link.username}
            </span>
          </a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
