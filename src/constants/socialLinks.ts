/** @format */

import { FaClock, FaCode, FaGithub, FaLinkedinIn, FaTrophy, FaXTwitter } from 'react-icons/fa6';
import type { IconType } from 'react-icons';
import { PROFILE } from '../config/profile';

export interface SocialLink {
  href: string;
  icon: IconType;
  label: string;
  username: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: PROFILE.links.linkedin,
    icon: FaLinkedinIn,
    label: 'LinkedIn',
    username: 'mhdulilabshar',
  },
  {
    href: PROFILE.links.github,
    icon: FaGithub,
    label: 'GitHub',
    username: 'howlil',
  },
  {
    href: PROFILE.links.leetcode,
    icon: FaCode,
    label: 'LeetCode',
    username: 'howlil',
  },
  {
    href: PROFILE.links.x,
    icon: FaXTwitter,
    label: 'X',
    username: '@howlildev',
  },
  {
    href: PROFILE.links.hackerrank,
    icon: FaTrophy,
    label: 'HackerRank',
    username: 'howlil',
  },
  {
    href: PROFILE.links.wakatime,
    icon: FaClock,
    label: 'WakaTime',
    username: '@howlil',
  },
];
