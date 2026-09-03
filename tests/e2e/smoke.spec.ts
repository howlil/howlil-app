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

test('homepage leads with engineering identity and flagship evidence', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Mhd Ulil Abshar', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Backend systems for reliable state, data & infrastructure.', exact: true })).toBeVisible();
  await expect(page.getByText('Architecture excerpt · TEDx Payment Service', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Selected Work', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'TEDx Payment Service', exact: true })).toBeVisible();
  await expect(page.getByText('Payment state · Webhook handling · Idempotency', { exact: true })).toBeVisible();
  await expect(page.getByText('Problem', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Decision', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Result', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Experience', exact: true })).toBeVisible();
  await expect(page.getByText('Metro Software', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Writing', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'howlil home' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open search modal' })).toHaveCount(0);
});

test('homepage flagship work continues into the technical case study', async ({ page }) => {
  await page.goto('/');

  await page.locator('a[href$="/projects/tedx-payment-service"]').first().click();

  await expect(page).toHaveURL(/\/projects\/tedx-payment-service$/);
  const summary = page.locator('section[aria-label="Case study summary"]');
  await expect(summary.getByRole('heading', { name: 'Problem', exact: true })).toBeVisible();
  await expect(summary.getByRole('heading', { name: 'Decision', exact: true })).toBeVisible();
  await expect(summary.getByRole('heading', { name: 'Result', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'System architecture', exact: true })).toBeVisible();
});

test('homepage preserves hierarchy without horizontal overflow on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Backend systems for reliable state, data & infrastructure.', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'TEDx Payment Service', exact: true })).toBeVisible();
  await expect(page.locator('figure img[alt*="Architecture diagram"]').first()).toBeVisible();

  const widths = await page.locator('body').evaluate((body) => ({
    clientWidth: body.clientWidth,
    scrollWidth: body.scrollWidth,
  }));
  expect(widths.scrollWidth).toBeLessThanOrEqual(widths.clientWidth + 1);
});

test('flagship project keeps the case study concise and diagram-led', async ({ page }) => {
  await page.goto('/projects/tedx-payment-service');

  await expect(page.getByText('Backend engineer / service owner')).toBeVisible();

  const summary = page.locator('section[aria-label="Case study summary"]');
  await expect(summary.getByRole('heading', { name: 'Problem', exact: true })).toBeVisible();
  await expect(summary.getByRole('heading', { name: 'Decision', exact: true })).toBeVisible();
  await expect(summary.getByRole('heading', { name: 'Result', exact: true })).toBeVisible();

  await expect(page.getByRole('heading', { name: 'System architecture', exact: true })).toBeVisible();
  await expect(page.locator('figure img[alt*="Architecture diagram"]').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Context', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Snapshot', exact: true })).toHaveCount(0);
  await expect(page.getByText('Featured system', { exact: true })).toHaveCount(0);
});
