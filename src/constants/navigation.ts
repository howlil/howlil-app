/** @format */

import { withBase } from '../lib/paths';

export interface NavLink {
  name: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { name: 'Home', href: withBase('/') },
  { name: 'Work', href: withBase('/projects') },
  { name: 'About', href: withBase('/about') },
  { name: 'Writing', href: withBase('/blog') },
  {
    name: 'Resume',
    href: 'https://drive.google.com/file/d/1fvp5VfE-dk3-HzG6vbxfHvEEvAiBkHPQ/view?usp=sharing',
  },
];
