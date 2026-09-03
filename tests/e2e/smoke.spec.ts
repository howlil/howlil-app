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

test('homepage leads with a distinct engineering identity and one flagship', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Mhd Ulil Abshar', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'I build systems that stay correct when the happy path ends.', exact: true })).toBeVisible();
  await expect(page.getByText('Backend & platform engineering', { exact: true })).toBeVisible();
  await expect(page.getByText('01 / FLAGSHIP', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'TEDx Payment Service', exact: true })).toBeVisible();
  await expect(page.getByText('The engineering decision', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'More selected work', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Experience', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Notes', exact: true })).toBeVisible();
  await expect(page.locator('img[alt*="diagram" i]')).toHaveCount(0);
});

test('homepage flagship continues into the technical case study', async ({ page }) => {
  await page.goto('/');

  await page.locator('a[href$="/projects/tedx-payment-service"]').first().click();

  await expect(page).toHaveURL(/\/projects\/tedx-payment-service$/);
  const summary = page.locator('section[aria-label="Case study summary"]');
  await expect(summary.getByText('Constraint', { exact: true })).toBeVisible();
  await expect(summary.getByRole('heading', { name: 'Engineering decision', exact: true })).toBeVisible();
  await expect(summary.getByText('Outcome', { exact: true })).toBeVisible();
  await expect(page.locator('img[alt*="diagram" i]')).toHaveCount(0);
});

test('homepage preserves hierarchy without horizontal overflow on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'I build systems that stay correct when the happy path ends.', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'TEDx Payment Service', exact: true })).toBeVisible();

  const widths = await page.locator('body').evaluate((body) => ({
    clientWidth: body.clientWidth,
    scrollWidth: body.scrollWidth,
  }));
  expect(widths.scrollWidth).toBeLessThanOrEqual(widths.clientWidth + 1);
});

test('flagship project stays decision-led without a diagram surface', async ({ page }) => {
  await page.goto('/projects/tedx-payment-service');

  await expect(page.getByText('Backend engineer / service owner')).toBeVisible();

  const summary = page.locator('section[aria-label="Case study summary"]');
  await expect(summary.getByText('Constraint', { exact: true })).toBeVisible();
  await expect(summary.getByRole('heading', { name: 'Engineering decision', exact: true })).toBeVisible();
  await expect(summary.getByText('Outcome', { exact: true })).toBeVisible();

  await expect(page.locator('img[alt*="diagram" i]')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Context', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Snapshot', exact: true })).toHaveCount(0);
});
