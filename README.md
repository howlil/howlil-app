# Howlil Portfolio

A modern, accessible portfolio website built with Astro, React, and Tailwind CSS. Features a clean "Paper Theme" design with dark mode support, optimized for performance and accessibility.

**Live Site**: [howlil.com](https://howlil.com)

## 🚀 Features

- **Performance**: Optimized images, lazy loading, minimal JavaScript
- **Accessibility**: WCAG 2.1 compliant, keyboard navigation, screen reader support
- **SEO**: Open Graph tags, Twitter Cards, structured data (JSON-LD)
- **Responsive**: Mobile-first design, safe area support for iOS
- **Dark Mode**: System preference detection with manual toggle
- **Reduced Motion**: Respects `prefers-reduced-motion` setting

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build/) 5.x
- **UI Library**: [React](https://react.dev/) 19
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [Astro DB](https://docs.astro.build/en/guides/astro-db/)
- **Testing**: [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── Timeline/
│   │   │   └── TimelineItem.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ExternalLink.tsx
│   │   ├── Modal.tsx
│   │   ├── Tag.tsx
│   │   └── index.ts
│   ├── layout/                 # Layout components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── index.ts
│   ├── interactive/            # Interactive components
│   │   ├── ImageModal.tsx
│   │   ├── ImageSlider.tsx
│   │   ├── SearchModal.tsx
│   │   ├── TableOfContents.tsx
│   │   └── index.ts
│   ├── content/                # Content components
│   │   ├── ArrowLink.astro
│   │   ├── ContentListCard.astro
│   │   ├── SectionHeader.astro
│   │   ├── TagFilterWrapper.astro
│   │   └── index.ts
│   ├── about/                  # About page specific
│   │   ├── AwardItem.tsx
│   │   ├── EducationItem.tsx
│   │   ├── OrganizationItem.tsx
│   │   ├── SkillsMotion.tsx
│   │   ├── SocialLinks.tsx
│   │   └── WorkExperienceItem.tsx
│   └── shared/
│       └── ThemeScript.astro
├── hooks/                      # Custom React hooks
│   ├── index.ts
│   ├── useDarkMode.ts
│   ├── useReducedMotion.ts
│   └── useSearch.ts
├── utils/
│   ├── api/                    # API helpers
│   │   ├── index.ts
│   │   ├── likes.ts
│   │   └── views.ts
│   ├── formatters/             # Utility functions
│   │   ├── index.ts
│   │   ├── date.ts
│   │   └── text.ts
│   ├── collectionHelpers.ts
│   └── readingTime.ts
├── constants/                  # Constants
│   ├── navigation.ts
│   ├── projectTypes.ts
│   └── socialLinks.ts
├── layouts/
│   ├── BaseLayout.astro
│   ├── ArticleLayout.astro
│   └── ThreeColumnLayout.astro
├── pages/
│   ├── api/
│   ├── blog/
│   ├── projects/
│   ├── shorts/
│   ├── about.astro
│   └── index.astro
└── styles/
    └── global.css
```

## 🧩 Components

### UI Components

#### `Button`
Reusable button component with multiple variants.

```tsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md">Click me</Button>
<Button variant="secondary" icon={<Icon />}>With Icon</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `fullWidth`: boolean
- `icon`: ReactNode
- `iconPosition`: 'left' | 'right'

#### `Card`
Flexible card component for content display.

```tsx
import { Card } from '@/components/ui';

<Card href="/link">
  <h3>Title</h3>
  <p>Content</p>
</Card>
```

#### `Modal`
Accessible modal dialog with animations.

```tsx
import { Modal } from '@/components/ui';

<Modal isOpen={open} onClose={close} title="Title">
  Content here
</Modal>
```

#### `TimelineItem`
Expandable timeline item for experience/education.

```tsx
import { TimelineItem } from '@/components/ui';

<TimelineItem header={<Header />} defaultExpanded={true}>
  <Content />
</TimelineItem>
```

#### `Tag`
Display tags with optional interactivity.

```tsx
import { Tag } from '@/components/ui';

<Tag label="React" href="/tag/react" />
<Tag label="TypeScript" count={5} />
```

### Layout Components

#### `Navbar`
Responsive navigation with mobile menu and search.

**Features:**
- Keyboard shortcuts (Ctrl+K for search)
- Mobile hamburger menu
- Dark mode toggle
- Active link highlighting

#### `Footer`
Site footer with social links and copyright.

### Interactive Components

#### `ImageModal`
Full-screen image preview modal.

#### `ImageSlider`
Image carousel with navigation dots.

#### `SearchModal`
Search functionality with keyboard navigation.

**Keyboard Shortcuts:**
- `↑` / `↓`: Navigate results
- `Enter`: Select result
- `ESC`: Close modal

#### `TableOfContents`
Auto-generated TOC for articles with scroll spy.

### Content Components

#### `ArrowLink`
Navigation link with arrow icon.

```astro
<ArrowLink href="/about" label="Learn More" direction="forward" />
```

#### `ContentListCard`
Card for blog/project listings.

#### `SectionHeader`
Section header with optional link.

#### `TagFilter`
Filter buttons for content by tags.

## 🪝 Custom Hooks

### `useDarkMode`
Detect and respond to dark mode changes.

```tsx
import { useDarkMode } from '@/hooks';

const { isDark } = useDarkMode();
```

### `useReducedMotion`
Check for reduced motion preference.

```tsx
import { useReducedMotion } from '@/hooks';

const prefersReducedMotion = useReducedMotion();
```

### `useSearch`
Search functionality for content.

```tsx
import { useSearch } from '@/hooks';

const { searchQuery, results, selectedIndex } = useSearch();
```

## 🛠️ Utility Functions

### Date Formatters

```ts
import { formatDate, formatRelativeTime } from '@/utils/formatters';

formatDate('2024-01-15')           // "January 15, 2024"
formatDateShort('2024-01-15')      // "Jan 15, 2024"
formatRelativeTime('2024-01-15')   // "2 months ago"
```

### Text Formatters

```ts
import { truncate, slugify, capitalize } from '@/utils/formatters';

truncate('Hello World', 5)         // "Hello..."
slugify('Hello World')             // "hello-world"
capitalize('hello world')          // "Hello World"
```

### API Helpers

```ts
import { getLikeCount, incrementView } from '@/utils/api';

const likes = await getLikeCount(slug);
const views = await incrementView(slug);
```

## 📝 Constants

### `NAV_LINKS`
Navigation links configuration.

```ts
import { NAV_LINKS } from '@/constants';
```

### `SOCIAL_LINKS`
Social media links configuration.

```ts
import { SOCIAL_LINKS } from '@/constants';
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Preview

```bash
pnpm preview
```

### Test

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e
```

## 📊 Performance Metrics

| Metric | Score |
|--------|-------|
| Lighthouse Performance | 95+ |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

## ♿ Accessibility

This portfolio follows WCAG 2.1 guidelines:

- ✅ Color contrast ratio ≥ 4.5:1
- ✅ Keyboard navigation support
- ✅ Screen reader compatible
- ✅ Focus indicators
- ✅ Skip to content link
- ✅ ARIA labels and roles
- ✅ Reduced motion support

## 🎨 Design System

### Colors (Paper Theme)

**Light Mode:**
- Background: `#FAF8F5`
- Text: `#1C1917`, `#44403C`, `#78716C`

**Dark Mode:**
- Background: `#1C1917`
- Text: `#F5F5F4`, `#D6D3D1`, `#A8A29E`

### Typography

- **Headings**: SF Pro Display
- **Body**: Spectral

### Spacing

Based on 8px grid system:
- `4px` - Extra small
- `8px` - Small
- `16px` - Medium
- `24px` - Large
- `32px` - Extra large

## 📄 License

MIT © 2024 Mhd Ulil Abshar
