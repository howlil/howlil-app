export interface WorkExperience {
  company: string;
  position: string;
  period: string;
  companyDescription: string;
  points: string[];
  technologies: string[];
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  description: string;
  points: string[];
}

export interface Award {
  title: string;
  date: string;
  description: string;
  certificateUrl?: string;
}

export interface Organization {
  community: string;
  position: string;
  period: string;
  description: string;
  points: string[];
}

export const workExperiences: WorkExperience[] = [
  {
    company: 'Metro Software',
    position: 'Software Engineer',
    period: 'Jun 2024 - Jun 2025',
    companyDescription: 'Software development agency serving 10+ clients with custom solutions.',
    points: [
      'Shipped 4 domain APIs (logistics, mentoring, school, ticketing) end-to-end; set up CI/CD on GitHub Actions, reducing manual deploy time ~45 min → ~3-5 min. (Express.js, React, MySQL)',
      "Logistics (Full-stack): Implemented shipping & tracking API plus webhook pipeline; cut status update lag ~90 min → <10 min and reduced 'where is my order' tickets to near zero.",
      'Mentoring (Front-End): Built end-to-end FE (auth, routing, forms, state); integrated Video and Chat APIs; added retry/reconnect and clear error/notification handling to improve session reliability and chat responsiveness.',
      'School management (Back-End): Delivered payments, teacher/student, scheduling, attendance, payout & payroll with RBAC and OpenAPI docs; reduced attendance submission from minutes to seconds, improved payout reconciliation to near 100%, and kept service uptime around ~99%',
      'Ticketing (Full-stack): Launched ticket purchase flow with Xendit (order → webhook → status) and email/QR; payment success 100%, oversell incidents: 0',
    ],
    technologies: [
      'Express.js',
      'React',
      'MySQL',
      'Socket.io',
      'WebRTC',
      'GitHub Actions',
      'Zustand',
      'Xendit',
    ],
  },
  {
    company: 'Meets Indonesia',
    position: 'Software Engineer - Internship',
    period: 'Nov 2024 - Mar 2025',
    companyDescription: 'B2C mentoring platform connecting individuals with industry professionals.',
    points: [
      'Assisted in automating CI/CD with GitHub Actions, cutting release time from ~60 min → ~7 min and reducing manual deployment mistakes',
      'Code-split/lazy-loaded the FE, optimized images/bundles; on the BE added pagination, query indexes, and pragmatic caching—resulting in noticeably faster page loads and lower p95 API latency under peak',
      'Built a lightweight analytics dashboard in React and instrumented events to give the team near-real-time visibility into user behavior and sales',
      'Shipped CSV/Excel exports and scheduled email reports; standardized key metrics so non-engineers could self-serve without ad-hoc requests',
    ],
    technologies: ['React', 'Express.js', 'PostgreSQL', 'GitHub Actions', 'DigitalOcean'],
  },
];

export const education: Education[] = [
  {
    institution: 'Bangkit Academy led by Google, Tokopedia, Gojek, & Traveloka',
    degree: 'Cloud Computing Cohort - Distinction Graduate',
    period: 'Jan 2025',
    description:
      'Graduated with Distinction (Best Graduate) - Top 147 out of 1,470 Students in Cloud Computing Path with score 93.20.',
    points: [
      "Became the most active student in total 3 Facilitator of 45,841 applicants across Indonesia, successfully completed 500+ hours of Cloud Computing path, gaining both theoretical knowledge and practical skills that are aligned with industry demands in today's digital era",
      'Top 10% (147) out of 1,470 students in Cloud Computing path',
      'Top 1000 out of 4,636 most active student in ILT (soft Cloud Computing and soft skills)',
      'Top 5 students out of 25 with most active interaction on weekly consultation CC-57',
      'Achieved 7750 points in tier 5 (up to Bangkit T-Shirt)',
      'Top 100 out of 4,636 Scoring Students in Soft Skill Assignment 3',
    ],
  },
  {
    institution: 'Universitas Andalas',
    degree: 'Bachelor of Information System',
    period: '2022 - 2026',
    description:
      'GPA: 3.79/4.0 - Expected graduate Sept 2026. Studying Data Structures & Algorithms, Clean Code and Design Pattern, Object-Oriented Programming, and Database.',
    points: [
      'Coursework: Data Structures & Algorithms; Clean Code and Design Pattern; Object-Oriented Programming; Database',
      "Certifications: Google Cloud Platform's Cloud Engineer Track; Dicoding's Backend using GCP",
      '[National] 3rd Place at Better Day Project 3.0. Business Idea Competition',
    ],
  },
];

export const awards: Award[] = [
  {
    title: 'IDEA REGENERATION EXPO 2025 MSU Malaysia Bronze Medal - Tangkapin',
    date: 'Jan 2025',
    description:
      'Developed an AI-powered weapon detection system, achieving 90% precision and 88% recall with sub-second response time.',
  },
  {
    title: 'IDEA REGENERATION EXPO 2025 MSU Malaysia Silver Medal - StunBy',
    date: 'Nov 2024',
    description:
      'Built an end-to-end AI-based baby growth tracking app, helping parents track development milestones.',
  },
  {
    title: 'Better Day Project 3.0 3rd Place - Business Idea Competition',
    date: '2024',
    description: 'National-level business idea competition for innovative startup concepts.',
  },
];

export const organizations: Organization[] = [
  {
    community: 'Metro Institute',
    position: 'Community Lead',
    period: 'Jan 2025 - Sep 2025',
    description:
      'Student organization dedicated to advancing IT skills through innovation, collaboration, and inclusive education while preparing students for global professional challenges.',
    points: [
      'Formulated and executed strategies for leading a community of 50+ members, including core team members, mentors, and mentees',
      'Supervised and managed four tech bootcamp programs, mentoring 25+ mentees',
      'Designed and developed three core programs to foster growth and engagement within the community',
    ],
  },
  {
    community: 'GDSC Universitas Andalas',
    position: 'Core Member Front End Developer',
    period: 'Dec 2023 - Jun 2024',
    description:
      'Google Developer Student Club is a community for students interested in Google developer technologies where students learn and build solutions for local businesses and their community.',
    points: [
      'Led educational sessions on HTML, CSS, and ReactJS for a study group of 3 members, improving their proficiency and ensuring successful project completion',
      'Conducted a hands-on React.js workshop for 25 participants covering development, state management, and live deployment, which enhanced practical skills and understanding',
    ],
  },
];

export const skills = [
  'Python',
  'Go',
  'Java',
  'JavaScript',
  'TypeScript',
  'Express.js',
  'Spring Boot',
  'Gin',
  'Django',
  'FastAPI',
  'NestJS',
  'Tailwind CSS',
  'React.js',
  'Next.js',
  'PostgreSQL',
  'MySQL',
  'Firebase',
  'Redis',
  'Docker',
  'Kubernetes',
  'Google Cloud Platform',
  'CI/CD',
  'GitHub Actions',
  'Terraform',
  'Socket.io',
  'WebRTC',
  'tRPC',
  'System Design',
  'Problem Solving',
  'Technical Communication',
] as const;
