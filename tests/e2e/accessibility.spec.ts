import { expect, test } from '@playwright/test';

test('skip link is first keyboard target and points to main content', async ({ page }) => {
  await page.goto('/about');

  await page.keyboard.press('Tab');
  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/#main-content$/);
  await expect(page.locator('#main-content')).toBeVisible();
});

test('about disclosures work with keyboard alone', async ({ page }) => {
  await page.goto('/about');

  const firstDetails = page.locator('details').first();
  const summary = firstDetails.locator('summary');

  await expect(firstDetails).toHaveAttribute('open', '');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(firstDetails).not.toHaveAttribute('open', '');

  await page.keyboard.press('Space');
  await expect(firstDetails).toHaveAttribute('open', '');
});

test('article image preview opens and restores focus with keyboard', async ({ page }) => {
  await page.goto('/blog/kubernetes-in-simple-concept-terms');

  const cover = page.locator('#cover-image');
  await expect(cover).toBeVisible();
  await cover.focus();
  await page.keyboard.press('Enter');

  const dialog = page.getByRole('dialog', { name: /Image preview:/ });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(cover).toBeFocused();
});

test('work list remains readable and keyboard-navigable on a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/projects');

  await expect(page.getByRole('heading', { name: 'Systems, organized by the engineering problem.', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Selected case studies', exact: true })).toBeVisible();

  const selectedSection = page.locator('section[aria-labelledby="selected-work-heading"]');
  const projectLink = selectedSection.locator('a[href*="/projects/"]').first();
  await expect(projectLink).toBeVisible();
  await expect(projectLink.locator('h3')).toHaveText(/\S+/);
  await expect(projectLink.locator('figure img')).toBeVisible();
  await projectLink.focus();
  await expect(projectLink).toBeFocused();

  const hasPageOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(hasPageOverflow).toBe(false);
});
