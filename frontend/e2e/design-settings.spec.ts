import { test, expect } from '@playwright/test';

test.describe('DesignSettings - デザイン設定パネル', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('「保存済みプリセット」ラベルが表示される', async ({ page }) => {
    await expect(page.getByText('保存済みプリセット')).toBeVisible();
  });

  test('プリセット select が表示され、オプションが존在する', async ({ page }) => {
    // 最初の select がプリセット選択
    const presetSelect = page.locator('select').first();
    await expect(presetSelect).toBeVisible();
    const options = presetSelect.locator('option');
    await expect(options).not.toHaveCount(0);
  });

  test('プリセットを変更できる', async ({ page }) => {
    const presetSelect = page.locator('select').first();
    const options = await presetSelect.locator('option').allTextContents();
    if (options.length >= 2) {
      await presetSelect.selectOption(options[1]);
      await expect(presetSelect).toHaveValue(options[1]);
    }
  });

  test('プライマリカラーの入力欄が表示される', async ({ page }) => {
    await expect(page.getByText('プライマリカラー')).toBeVisible();
    const colorInput = page.locator('input[type="color"]');
    await expect(colorInput).toBeVisible();
  });

  test('プライマリカラーのテキスト欄に HEX 値を入力できる', async ({ page }) => {
    // type="text" の hex 入力フィールド（colorの隣）
    const hexInput = page.locator('input.font-mono');
    await expect(hexInput).toBeVisible();
    await hexInput.fill('#FF5733');
    await expect(hexInput).toHaveValue('#FF5733');
  });

  test('フォント select が表示され、変更できる', async ({ page }) => {
    // 2番目の select がフォント選択
    const fontSelect = page.locator('select').nth(1);
    await expect(fontSelect).toBeVisible();
    await fontSelect.selectOption('BIZ UDPGothic');
    await expect(fontSelect).toHaveValue('BIZ UDPGothic');
  });

  test('フッターテキスト入力欄が表示され、入力できる', async ({ page }) => {
    await expect(page.getByText('フッターテキスト')).toBeVisible();
    const footerInput = page.locator('input[placeholder*="All Rights Reserved"]');
    await expect(footerInput).toBeVisible();
    await footerInput.fill('My Company 2025');
    await expect(footerInput).toHaveValue('My Company 2025');
  });

  test('保存先フォルダURL入力欄が表示され、入力できる', async ({ page }) => {
    await expect(page.getByText('保存先フォルダURL')).toBeVisible();
    const folderInput = page.locator('input[placeholder*="drive.google.com"]');
    await expect(folderInput).toBeVisible();
    await folderInput.fill('https://drive.google.com/drive/folders/test123');
    await expect(folderInput).toHaveValue('https://drive.google.com/drive/folders/test123');
  });

  test('保存・削除ボタンが表示される', async ({ page }) => {
    await expect(page.getByTitle('保存')).toBeVisible();
    await expect(page.getByTitle('削除')).toBeVisible();
  });

  test('アコーディオン（装飾設定・ロゴ設定・背景設定）が表示される', async ({ page }) => {
    await expect(page.getByRole('button', { name: '装飾設定' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ロゴ設定' })).toBeVisible();
    await expect(page.getByRole('button', { name: '背景設定' })).toBeVisible();
  });
});
