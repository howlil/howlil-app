import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/about',
  '/blog',
  '/projects',
  '/blog/kubernetes-in-simple-concept-terms',
  '/projects/farm-hub',
  '/projects/tedx-payment-service',
];

for (const route of routes) {
  test(`${route} renders without a page error`, async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));

    const response = await page.goto(route);

    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('#main-content')).toBeVisible();
    expect(pageErrors).toEqual([]);
  });
}

test('homepage presents a compact developer profile and engineering index', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Mhd Ulil Abshar', exact: true })).toBeVisible();
  await expect(page.getByText('Software Engineer · Backend & Infrastructure', { exact: true })).toBeVisible();
  await expect(page.getByText('PROFILE', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Selected work', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'TEDx Payment Service', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Experience', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Notes', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'I build systems that stay correct when the happy path ends.', exact: true })).toHaveCount(0);
  await expect(page.locator('img[alt*="diagram" i]')).toHaveCount(0);
});

test('homepage work item continues into the technical case study', async ({ page }) => {
  await page.goto('/');

  await page.locator('a[href$="/projects/tedx-payment-service"]').first().click();

  await expect(page).toHaveURL(/\/projects\/tedx-payment-service$/);
  const summary = page.locator('section[aria-label="Case study summary"]');
  await expect(summary.getByText('Constraint', { exact: true })).toBeVisible();
  await expect(summary.getByRole('heading', { name: 'Decision', exact: true })).toBeVisible();
  await expect(summary.getByText('Outcome', { exact: true })).toBeVisible();
  await expect(page.locator('#article-content')).toHaveClass(/prose-technical/);
  await expect(page.locator('img[alt*="diagram" i]')).toHaveCount(0);
});

test('homepage preserves compact hierarchy without horizontal overflow on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Mhd Ulil Abshar', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'TEDx Payment Service', exact: true })).toBeVisible();

  const widths = await page.locator('body').evaluate((body) => ({
    clientWidth: body.clientWidth,
    scrollWidth: body.scrollWidth,
  }));
  expect(widths.scrollWidth).toBeLessThanOrEqual(widths.clientWidth + 1);
});

test('project case study stays technical and diagram-free', async ({ page }) => {
  await page.goto('/projects/tedx-payment-service');

  await expect(page.getByText('Backend engineer / service owner')).toBeVisible();

  const summary = page.locator('section[aria-label="Case study summary"]');
  await expect(summary.getByText('Constraint', { exact: true })).toBeVisible();
  await expect(summary.getByRole('heading', { name: 'Decision', exact: true })).toBeVisible();
  await expect(summary.getByText('Outcome', { exact: true })).toBeVisible();

  await expect(page.locator('#article-content')).toHaveClass(/prose-technical/);
  await expect(page.locator('img[alt*="diagram" i]')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Context', exact: true })).toBeVisible();
});
