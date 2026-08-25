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

test('featured system exposes engineering evidence and diagrams before the long-form case study', async ({ page }) => {
  await page.goto('/projects/tedx-payment-service');

  await expect(page.getByText('Snapshot', { exact: true })).toBeVisible();
  await expect(page.getByText('Backend engineer / service owner')).toBeVisible();
  await expect(page.getByText('Duplicate webhook delivery guarded by existing payment/order state')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Architecture', exact: true })).toBeVisible();
  await expect(page.getByRole('img', { name: /Architecture diagram showing the client, Payment API, MySQL, Xendit/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Problem', exact: true })).toBeVisible();
});

test('search opens from keyboard, reports results, and restores focus on close', async ({ page }) => {
  await page.goto('/');

  const searchButton = page.getByRole('button', { name: 'Open search modal' });
  await searchButton.focus();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog', { name: 'Search blog posts and projects' });
  await expect(dialog).toBeVisible();

  const searchInput = page.getByRole('combobox', { name: 'Search blog posts and projects' });
  await expect(searchInput).toBeFocused();
  await searchInput.fill('Kubernetes');
  await expect(page.getByRole('option', { name: /Kubernetes in Simple Concept Terms/i })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(searchButton).toBeFocused();
});

test('search keyboard selection navigates to the selected result', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Open search modal' }).click();
  await page.getByRole('combobox', { name: 'Search blog posts and projects' }).fill('Kubernetes');
  await expect(page.getByRole('option', { name: /Kubernetes in Simple Concept Terms/i })).toBeVisible();

  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/blog\/kubernetes-in-simple-concept-terms\/?$/);
});
