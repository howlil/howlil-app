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

test('homepage leads with role and selected work', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Backend & Infrastructure', exact: true })).toBeVisible();
  await expect(page.getByText('4 domain systems', { exact: true })).toHaveCount(0);
  await expect(page.getByText('~45 min → 3–5 min', { exact: true })).toHaveCount(0);
  await expect(page.getByText('~90 min → <10 min', { exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Selected Work', exact: true })).toBeVisible();
  await expect(page.getByText('Payment state · Webhook handling · Idempotency', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Experience', exact: true })).toBeVisible();
  await expect(page.getByText('Metro Software', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'howlil home' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open search modal' })).toHaveCount(0);
});

test('flagship project keeps the case study concise and diagram-led', async ({ page }) => {
  await page.goto('/projects/tedx-payment-service');

  await expect(page.getByText('Backend engineer / service owner')).toBeVisible();

  const summary = page.locator('section[aria-label="Case study summary"]');
  await expect(summary.getByText('Problem', { exact: true })).toBeVisible();
  await expect(summary.getByText('Decision', { exact: true })).toBeVisible();
  await expect(summary.getByText('Result', { exact: true })).toBeVisible();

  await expect(page.getByRole('heading', { name: 'System architecture', exact: true })).toBeVisible();
  await expect(page.locator('figure img[alt*="Architecture diagram"]').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Context', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Snapshot', exact: true })).toHaveCount(0);
  await expect(page.getByText('Featured system', { exact: true })).toHaveCount(0);
});
