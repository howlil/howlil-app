export const PROFILE = {
  email: 'mhdulilabshar27@gmail.com',
  resume: 'https://drive.google.com/file/d/1fvp5VfE-dk3-HzG6vbxfHvEEvAiBkHPQ/view?usp=sharing',
  links: {
    github: 'https://github.com/howlil',
    linkedin: 'https://www.linkedin.com/in/mhdulilabshar/',
    x: 'https://x.com/howlildev',
    leetcode: 'https://leetcode.com/u/howlil/',
    hackerrank: 'https://www.hackerrank.com/profile/howlil',
    wakatime: 'https://wakatime.com/@howlil',
  },
} as const;

export const PROFILE_SOCIAL_URLS = Object.values(PROFILE.links);
