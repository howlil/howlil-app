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

test('navigation menu exposes Projects terminology', async ({ page }) => {
  await page.goto('/');
  const navToggle = page.getByRole('button', { name: /Mhd Ulil Abshar/ });
  await navToggle.click();

  const nav = page.getByRole('navigation', { name: 'Primary navigation' });
  await expect(nav.getByRole('link', { name: 'Projects', exact: true })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Work', exact: true })).toHaveCount(0);
  const pages = page.getByRole('navigation', { name: 'Page navigation' });
  await expect(pages.getByRole('link', { name: 'All Projects' })).toBeVisible();
  await expect(pages.getByRole('link', { name: 'Writing' })).toBeVisible();
  await expect(pages.getByRole('link', { name: 'About' })).toBeVisible();
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

test('experience renders every real work highlight and brand stack logos', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.experience-item')).toHaveCount(2);
  await expect(page.locator('.experience-points li')).toHaveCount(9);
  await expect(page.locator('.stack-item svg')).toHaveCount(12);
});
