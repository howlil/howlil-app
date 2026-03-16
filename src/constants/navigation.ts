/** @format */

export interface NavLink {
  name: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Project', href: '/projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'Shorts', href: '/shorts' },
  {
    name: 'Resume',
    href: 'https://drive.google.com/file/d/1fvp5VfE-dk3-HzG6vbxfHvEEvAiBkHPQ/view?usp=sharing',
  },
];
