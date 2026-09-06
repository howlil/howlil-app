import { expect, test, type Page } from '@playwright/test';

const routes = [
  '/',
  '/about',
  '/projects',
  '/blog',
  '/blog/kubernetes-in-simple-concept-terms',
  '/projects/tedx-payment-service',
];

const viewports = [
  { name: 'mobile', width: 360, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 },
] as const;

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.viewport + 1);
}

async function expectReferenceNavigationInsideViewport(page: Page) {
  const navToggle = page.getByRole('button', { name: /Mhd Ulil Abshar/ });
  await expect(navToggle).toBeVisible();
  const box = await navToggle.boundingBox();
  expect(box).not.toBeNull();
  if (!box) return;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual((await page.evaluate(() => window.innerWidth)) + 1);
}

for (const viewport of viewports) {
  test.describe(viewport.name + ' ' + viewport.width + 'px', () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const route of routes) {
      test(route + ' stays inside the viewport', async ({ page }) => {
        const response = await page.goto(route);
        expect(response?.ok()).toBeTruthy();
        await expect(page.locator('#main-content')).toBeVisible();
        await expectNoHorizontalOverflow(page);
        await expectReferenceNavigationInsideViewport(page);
      });
    }
  });
}

test('navigation menu exposes page-level destinations only', async ({ page }) => {
  await page.goto('/');
  const navToggle = page.getByRole('button', { name: /Mhd Ulil Abshar/ });
  await navToggle.click();

  const dialog = page.getByRole('dialog', { name: 'Site navigation' });
  const pages = page.getByRole('navigation', { name: 'Page navigation' });
  await expect(dialog.getByText('Sections', { exact: true })).toHaveCount(0);
  await expect(pages.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
  await expect(pages.getByRole('link', { name: 'Projects', exact: true })).toBeVisible();
  await expect(pages.getByRole('link', { name: 'Writing', exact: true })).toBeVisible();
  await expect(pages.getByRole('link', { name: 'About', exact: true })).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'Experience', exact: true })).toHaveCount(0);
  await expect(dialog.getByRole('link', { name: 'Tech Stack', exact: true })).toHaveCount(0);
});

test('about portrait stays subordinate to the narrative at each breakpoint', async ({ page }) => {
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/about');

    const portrait = page.locator('[data-about-portrait]');
    const box = await portrait.boundingBox();
    expect(box).not.toBeNull();
    if (!box) continue;

    if (viewport.width < 640) expect(box.width).toBeLessThanOrEqual(96);
    else expect(box.width).toBeLessThanOrEqual(112);
  }
});

test('about narrative uses readable body type and measure', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/about');

  const metrics = await page.locator('[data-reading-measure]').evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      fontSize: Number.parseFloat(style.fontSize),
      lineHeight: Number.parseFloat(style.lineHeight),
      width: element.getBoundingClientRect().width,
    };
  });

  expect(metrics.fontSize).toBeGreaterThanOrEqual(16);
  expect(metrics.lineHeight / metrics.fontSize).toBeGreaterThanOrEqual(1.5);
  expect(metrics.width).toBeLessThanOrEqual(700);
});

test('index and article routes keep the shared narrow shell', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const route of ['/projects', '/blog', '/about', '/projects/tedx-payment-service', '/blog/kubernetes-in-simple-concept-terms']) {
    await page.goto(route);
    const shell = page.locator('main#main-content > .site-shell').first();
    const box = await shell.boundingBox();
    expect(box).not.toBeNull();
    if (box) expect(box.width).toBeLessThanOrEqual(642);
  }
});

test('long-form prose remains readable without a competing TOC rail', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('/projects/tedx-payment-service');

  const proseMetrics = await page.locator('#article-content').evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      fontSize: Number.parseFloat(style.fontSize),
      lineHeight: Number.parseFloat(style.lineHeight),
      width: element.getBoundingClientRect().width,
    };
  });

  expect(proseMetrics.fontSize).toBeGreaterThanOrEqual(16);
  expect(proseMetrics.lineHeight / proseMetrics.fontSize).toBeGreaterThanOrEqual(1.5);
  expect(proseMetrics.width).toBeLessThanOrEqual(700);
  await expect(page.getByRole('navigation', { name: 'On this page' })).toHaveCount(0);

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/projects/tedx-payment-service');
  await expect(page.getByRole('navigation', { name: 'On this page' })).toHaveCount(0);
});

test('experience renders every real work highlight and technology icon badge', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.experience-item')).toHaveCount(3);
  await expect(page.locator('.experience-company-name img')).toHaveCount(3);
  await expect(page.locator('.experience-points li')).toHaveCount(12);
  await expect(page.locator('.technology-badge')).toHaveCount(22);
  await expect(page.locator('.technology-badge svg')).toHaveCount(22);
  await expect(page.getByText('Pusdatin KKP', { exact: true })).toBeVisible();
  await expect(page.getByText('RuangIn', { exact: false })).toBeVisible();
  await expect(page.locator('.stack-item svg')).toHaveCount(12);
});

test('contact, real GitHub activity, social previews, and floating navigation expose the new interactions', async ({ page }) => {
  const contributionDays = Array.from({ length: 364 }, (_, index) => ({
    date: new Date(Date.UTC(2025, 8, 8 + index)).toISOString().slice(0, 10),
    count: index % 5,
    level: (index % 5) as 0 | 1 | 2 | 3 | 4,
  }));

  await page.route('https://api.github.com/users/howlil', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        login: 'howlil',
        name: 'Mhd Ulil Abshar',
        avatar_url: 'https://avatars.githubusercontent.com/u/87646428?v=4',
        bio: 'Backend systems and infrastructure.',
        followers: 42,
        public_repos: 24,
        html_url: 'https://github.com/howlil',
      }),
    });
  });

  await page.route('https://github-contributions-api.jogruber.de/v4/howlil?y=last', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ total: { lastYear: 321 }, contributions: contributionDays }),
    });
  });

  await page.goto('/');

  await expect(page.getByRole('button', { name: 'Copy my email' })).toBeVisible();

  await page.getByRole('link', { name: 'GitHub', exact: true }).hover();
  await expect(page.getByRole('group', { name: 'GitHub profile preview' })).toBeVisible();
  const contributionGrid = page.getByLabel('321 GitHub contributions in the last year');
  await expect(contributionGrid).toBeVisible();
  await expect(contributionGrid.locator('span')).toHaveCount(364);

  await page.getByRole('link', { name: 'LinkedIn', exact: true }).hover();
  await expect(page.getByRole('group', { name: 'LinkedIn profile preview' })).toBeVisible();

  await page.getByRole('link', { name: 'X', exact: true }).hover();
  await expect(page.getByRole('group', { name: 'X profile preview' })).toBeVisible();

  await page.locator('.reference-nav').hover();
  await expect(page.getByRole('dialog', { name: 'Site navigation' })).toBeVisible();
});
