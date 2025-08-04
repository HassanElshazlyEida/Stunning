import { test, expect } from '@playwright/test';

test.describe('Builder Workspace', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Navigate to builder workspace
    const input = page.locator('input[type="text"]');
    await input.click();
    await page.waitForSelector('.fade-in', { timeout: 5000 });
  });

  test('displays builder workspace layout', async ({ page }) => {
    await expect(page.locator('.fade-in')).toBeVisible();
    // Check for sidebar
    await expect(page.locator('.fixed.left-0.top-0.bottom-0')).toBeVisible();
    // Check for main content area
    await expect(page.locator('.flex-1')).toBeVisible();
  });

  test('can submit a prompt and generate sections', async ({ page }) => {
    const input = page.locator('textarea');
    await input.fill('Create a modern bakery website');
    
    const submitButton = page.getByRole('button', { name: /generate/i });
    await submitButton.click();
    
    // Wait for sections to be generated
    await expect(page.locator('.section-card').first()).toBeVisible({ timeout: 10000 });
  });

  test('displays generated sections', async ({ page }) => {
    // Mock API response for consistent testing
    await page.route('**/api/prompts/generate', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          _id: 'test-id',
          text: 'Create a modern bakery website',
          sections: [
            { title: 'Hero', content: '<div>Hero Section</div>' },
            { title: 'About', content: '<div>About Section</div>' },
            { title: 'Contact', content: '<div>Contact Section</div>' }
          ],
          sessionId: 'test-session',
          isActive: true,
          createdAt: new Date().toISOString()
        })
      });
    });

    const input = page.locator('textarea');
    await input.fill('Create a modern bakery website');
    
    const submitButton = page.getByRole('button', { name: /generate/i });
    await submitButton.click();
    
    // Check if sections are displayed
    await expect(page.getByText('Hero', { exact: false })).toBeVisible();
    await expect(page.getByText('About', { exact: false })).toBeVisible();
    await expect(page.getByText('Contact', { exact: false })).toBeVisible();
  });

  test('can toggle between sections and preview mode', async ({ page }) => {
    // First generate some sections (using mock)
    await page.route('**/api/prompts/generate', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sections: [
            { title: 'Hero', content: '<div>Hero Content</div>' }
          ]
        })
      });
    });

    const input = page.locator('textarea');
    await input.fill('Test prompt');
    await page.getByRole('button', { name: /generate/i }).click();
    
    // Wait for sections to load
    await page.waitForSelector('.section-card', { timeout: 5000 });
    
    // Toggle to preview mode
    const previewButton = page.getByRole('button', { name: /preview/i });
    await previewButton.click();
    
    // Check if preview mode is active
    await expect(page.locator('.website-preview')).toBeVisible();
    
    // Toggle back to sections mode
    const sectionsButton = page.getByRole('button', { name: /sections/i });
    await sectionsButton.click();
    
    await expect(page.locator('.section-card')).toBeVisible();
  });

  test('can copy all sections', async ({ page }) => {
    // Mock clipboard API
    await page.addInitScript(() => {
      Object.assign(navigator, {
        clipboard: {
          writeText: () => Promise.resolve(),
        },
      });
    });

    // Generate sections first
    await page.route('**/api/prompts/generate', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sections: [
            { title: 'Hero', content: '<div>Hero Content</div>' }
          ]
        })
      });
    });

    const input = page.locator('textarea');
    await input.fill('Test prompt');
    await page.getByRole('button', { name: /generate/i }).click();
    
    await page.waitForSelector('.section-card', { timeout: 5000 });
    
    // Click share button in header which copies all sections
    const shareButton = page.getByRole('button', { name: /share/i });
    await shareButton.click();
    
    // Check for success toast
    await expect(page.getByText(/copied to clipboard/i, { exact: false })).toBeVisible();
  });

  test('displays prompt history in sidebar', async ({ page }) => {
    // Mock prompt history API
    await page.route('**/api/prompts/history*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            _id: 'prompt-1',
            text: 'Create a bakery website',
            isActive: false,
            createdAt: new Date().toISOString()
          },
          {
            _id: 'prompt-2',
            text: 'Build a portfolio site',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ])
      });
    });

    await page.reload();
    
    // Navigate to builder workspace again
    const input = page.locator('input[type="text"]');
    await input.click();
    await page.waitForSelector('.fade-in', { timeout: 5000 });
    
    // Check if prompt history is displayed in the sidebar
    await expect(page.getByText('Create a bakery website', { exact: false })).toBeVisible();
    await expect(page.getByText('Build a portfolio site', { exact: false })).toBeVisible();
  });

  test('handles error states gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/prompts/generate', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    const input = page.locator('textarea');
    await input.fill('Test prompt');
    await page.getByRole('button', { name: /generate/i }).click();
    
    // Check for error message
    await expect(page.getByText(/error/i, { exact: false })).toBeVisible({ timeout: 5000 });
  });
});
