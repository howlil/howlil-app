/** @format */

import { FaClock, FaCode, FaGithub, FaLinkedinIn, FaTrophy, FaXTwitter } from 'react-icons/fa6';
import type { IconType } from 'react-icons';

export interface SocialLink {
  href: string;
  icon: IconType;
  label: string;
  username: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://www.linkedin.com/in/mhdulilabshar/',
    icon: FaLinkedinIn,
    label: 'LinkedIn',
    username: 'mhdulilabshar',
  },
  {
    href: 'https://github.com/howlil',
    icon: FaGithub,
    label: 'GitHub',
    username: 'howlil',
  },
  {
    href: 'https://leetcode.com/u/howlil/',
    icon: FaCode,
    label: 'LeetCode',
    username: 'howlil',
  },
  {
    href: 'https://x.com/howlildev',
    icon: FaXTwitter,
    label: 'X',
    username: '@howlildev',
  },
  {
    href: 'https://www.hackerrank.com/profile/howlil',
    icon: FaTrophy,
    label: 'HackerRank',
    username: 'howlil',
  },
  {
    href: 'https://wakatime.com/@howlil',
    icon: FaClock,
    label: 'WakaTime',
    username: '@howlil',
  },
];
