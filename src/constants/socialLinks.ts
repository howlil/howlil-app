/** @format */

import { Linkedin, Github, Code2, Twitter, Trophy, Clock } from 'lucide-react';
import type { ComponentType } from 'react';

export interface SocialLink {
  href: string;
  icon: ComponentType<{ className?: string; size?: number }>;
  label: string;
  username: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
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
