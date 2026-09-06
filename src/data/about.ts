export interface WorkExperience {
  company: string;
  position: string;
  period: string;
  logo: string;
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

export interface CapabilityGroup {
  title: string;
  description: string;
  items: string[];
}

export const workExperiences: WorkExperience[] = [
  {
    company: 'Metro Software',
    position: 'Software Engineer',
    period: 'Jun 2024 - Jun 2025',
    logo: '/images/companies/metro-logo.webp',
    companyDescription: 'Software development agency serving 10+ clients with custom solutions.',
    points: [
      'Shipped four domain systems across logistics, mentoring, school operations, and ticketing; automated deployments with GitHub Actions, reducing a manual ~45 minute release process to roughly 3-5 minutes.',
      "Logistics (Full-stack): Implemented shipping/tracking APIs and a webhook-driven status pipeline; reduced observed status-update lag from roughly 90 minutes to under 10 minutes.",
      'Mentoring (Front-End): Built authentication, routing, forms, and state flows; integrated video/chat APIs with retry, reconnect, and explicit user-facing failure states.',
      'School management (Back-End): Delivered payment, scheduling, attendance, payout, and payroll workflows with RBAC and OpenAPI documentation; moved attendance submission from a manual multi-minute workflow to seconds.',
      'Ticketing (Full-stack): Implemented order → payment provider → webhook → ticket confirmation flow with Xendit, email, and QR delivery; no oversell incident was observed during the delivered event flow.',
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
    logo: '/images/companies/meets.jpg',
    companyDescription: 'B2C mentoring platform connecting individuals with industry professionals.',
    points: [
      'Assisted in automating CI/CD with GitHub Actions, cutting the observed release process from roughly 60 minutes to about 7 minutes and removing several manual deployment steps.',
      'Improved application delivery with code splitting, lazy loading, image/bundle optimization, API pagination, database indexes, and pragmatic caching for frequently accessed data.',
      'Built a lightweight analytics dashboard and instrumented product events to give the team near-real-time visibility into user behavior and sales.',
      'Shipped CSV/Excel exports and scheduled email reports so non-engineering stakeholders could self-serve recurring operational metrics.',
    ],
    technologies: ['React', 'Express.js', 'PostgreSQL', 'GitHub Actions', 'DigitalOcean'],
  },
  {
    company: 'Pusdatin KKP',
    position: 'Software Engineer Intern',
    period: 'Jan 2025 - Feb 2025 · Jakarta, Indonesia',
    logo: 'https://www.kkp.go.id/assets/brand/struktur_organisasi/logo_1.svg',
    companyDescription: "Pusat Data dan Informasi within Indonesia's Ministry of Marine Affairs and Fisheries.",
    points: [
      'Shipped RuangIn, a full-stack internal room-booking and attendance platform used by 100+ employees, replacing spreadsheet- and manual-based workflows.',
      'Engineered booking workflows with role-based access control for 3 user roles, schedule-conflict detection, public-holiday validation, and automated booking-state transitions to prevent invalid and overlapping reservations.',
      'Built a digital attendance system with time-bound access, electronic signatures, and automated PDF/Excel reporting, reducing manual administrative work for meeting attendance and documentation.',
    ],
    technologies: ['React', 'Express.js', 'MySQL', 'Prisma', 'JWT', 'Tailwind CSS', 'Axios', 'PDFKit', 'ExcelJS'],
  },
];

export const education: Education[] = [
  {
    institution: 'Bangkit Academy led by Google, Tokopedia, Gojek, & Traveloka',
    degree: 'Cloud Computing Cohort - Distinction Graduate',
    period: 'Jan 2025',
    description:
      'Graduated with Distinction in the Cloud Computing path, ranked in the top 10% (147/1,470) with a final score of 93.20.',
    points: [
      'Completed 500+ hours across cloud infrastructure, backend development, deployment, and professional skills.',
      'Ranked 147 out of 1,470 students in the Cloud Computing path.',
      'Built and deployed a capstone backend on Google Cloud with infrastructure-as-code and CI/CD.',
    ],
  },
  {
    institution: 'Universitas Andalas',
    degree: 'Bachelor of Information Systems',
    period: '2022 - 2026',
    description:
      'GPA: 3.79/4.0 - Expected graduation Sept 2026. Coursework includes data structures and algorithms, software design, object-oriented programming, and databases.',
    points: [
      'Coursework: Data Structures & Algorithms; Clean Code and Design Patterns; Object-Oriented Programming; Databases.',
      "Completed Google Cloud Platform's Cloud Engineer track and backend-on-GCP coursework through Dicoding/Bangkit.",
      '[National] 3rd Place at Better Day Project 3.0 Business Idea Competition.',
    ],
  },
];

export const awards: Award[] = [
  {
    title: 'IDEA REGENERATION EXPO 2025 MSU Malaysia Bronze Medal - Tangkapin',
    date: 'Jan 2025',
    description:
      'Developed an AI-powered weapon detection system with measured 90% precision and 88% recall in the project evaluation dataset.',
  },
  {
    title: 'IDEA REGENERATION EXPO 2025 MSU Malaysia Silver Medal - StunBy',
    date: 'Nov 2024',
    description:
      'Built an end-to-end baby growth tracking application with a cloud backend for measurements, nutrition records, and analysis results.',
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
      'Student technology community focused on practical engineering education and peer mentoring.',
    points: [
      'Led a community of 50+ members across core team, mentors, and mentees.',
      'Supervised four technical bootcamp programs and mentored 25+ participants.',
      'Designed three recurring programs for technical learning, mentoring, and community engagement.',
    ],
  },
  {
    community: 'GDSC Universitas Andalas',
    position: 'Core Member Front End Developer',
    period: 'Dec 2023 - Jun 2024',
    description:
      'Google Developer Student Club community for students learning and applying developer technologies.',
    points: [
      'Led HTML, CSS, and React learning sessions for a small study group through project completion.',
      'Conducted a hands-on React workshop for 25 participants covering application development, state management, and deployment.',
    ],
  },
];

export const capabilityGroups: CapabilityGroup[] = [
  {
    title: 'Backend systems',
    description: 'Designing APIs and workflows with explicit state, ownership, and failure boundaries.',
    items: ['API design', 'Authentication & RBAC', 'Webhooks', 'Idempotency', 'Background workflows'],
  },
  {
    title: 'Data & consistency',
    description: 'Using relational data models and storage primitives with correctness and query behavior in mind.',
    items: ['PostgreSQL', 'MySQL', 'Redis', 'Transactions', 'Indexing & query design'],
  },
  {
    title: 'Infrastructure & delivery',
    description: 'Making systems reproducible, deployable, and operable rather than stopping at application code.',
    items: ['Docker', 'Kubernetes', 'Google Cloud', 'Terraform', 'CI/CD'],
  },
  {
    title: 'Production engineering',
    description: 'Reasoning about reliability through observability, retries, testing, recovery, and performance.',
    items: ['Observability', 'Retry & recovery', 'Health/readiness', 'Integration testing', 'Performance analysis'],
  },
];

export const skills = [
  'Go',
  'TypeScript',
  'JavaScript',
  'Python',
  'Java',
  'Express',
  'Express.js',
  'NestJS',
  'Gin',
  'Spring Boot',
  'FastAPI',
  'PostgreSQL',
  'MySQL',
  'Redis',
  'Docker',
  'Kubernetes',
  'Google Cloud Run',
  'Google Cloud Platform',
  'Terraform',
  'GitHub Actions',
  'Socket.io',
  'WebRTC',
] as const;
