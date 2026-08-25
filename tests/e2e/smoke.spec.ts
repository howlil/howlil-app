import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/about',
  '/blog',
  '/projects',
  '/blog/kubernetes-in-simple-concept-terms',
  '/projects/farm-hub',
  '/projects/tedx-payment-service',
  '/projects/tracer-survey',
  '/projects/stunby-cloud-api',
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

test('homepage leads with role, selected work, and professional evidence', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Software Engineer — Backend & Infrastructure', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Selected Work', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Experience', exact: true })).toBeVisible();
  await expect(page.getByText('Metro Software', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'howlil home' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open search modal' })).toHaveCount(0);
});

test('TEDx case study exposes diagram views and duplicate-safe payment simulation', async ({ page }) => {
  await page.goto('/projects/tedx-payment-service');

  await expect(page.getByText('Backend engineer / service owner')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'System architecture', exact: true })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Architecture' })).toHaveAttribute('aria-selected', 'true');

  await page.getByRole('tab', { name: 'State' }).click();
  await expect(page.getByRole('heading', { name: 'Payment state transitions', exact: true })).toBeVisible();
  await expect(page.locator('img[alt*="State diagram"]')).toBeVisible();

  await page.getByRole('button', { name: 'PAYMENT_PAID' }).click();
  await expect(page.getByText('CONFIRMED', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'DUPLICATE_CALLBACK' }).click();
  await expect(page.getByText(/Duplicate callback: payment is already PAID/)).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Context', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Snapshot', exact: true })).toHaveCount(0);
  await expect(page.getByText('Featured system', { exact: true })).toHaveCount(0);
});

test('Tracer case study makes persisted branching explorable', async ({ page }) => {
  await page.goto('/projects/tracer-survey');

  await expect(page.getByRole('tab', { name: 'Activity' })).toBeVisible();
  await page.getByRole('button', { name: 'No', exact: true }).click();
  await expect(page.getByText('Q5 — Why are you currently not employed?', { exact: true })).toBeVisible();
  await expect(page.getByText('Q8', { exact: true })).toBeVisible();
});

test('StunBy case study exposes failure isolation boundaries', async ({ page }) => {
  await page.goto('/projects/stunby-cloud-api');

  await expect(page.getByRole('tab', { name: 'Deployment' })).toBeVisible();
  await page.getByRole('button', { name: 'Fail Cloud Run' }).click();
  await expect(page.getByText('Cloud Run unavailable', { exact: true })).toBeVisible();
  await expect(page.getByText(/PostgreSQL records and GCS objects remain durable/)).toBeVisible();
});
