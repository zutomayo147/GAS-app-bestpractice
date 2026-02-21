import { test, expect } from '@playwright/test';

test.describe('SlideEditor - JSONエディタ操作', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('テキストエリアが表示され、初期JSONが入力されている', async ({ page }) => {
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();
    const value = await textarea.inputValue();
    expect(value.length).toBeGreaterThan(0);
    // 初期値がJSONとしてパースできることを確認
    expect(() => JSON.parse(value)).not.toThrow();
  });

  test('テキストエリアにJSONを入力できる', async ({ page }) => {
    const textarea = page.locator('textarea');
    await textarea.fill('{"test": "value"}');
    await expect(textarea).toHaveValue('{"test": "value"}');
  });

  test('テキストエリアのプレースホルダーが "input.json" ファイル名で表示される', async ({ page }) => {
    // ターミナル風タイトルバーに "input.json" が表示される
    await expect(page.getByText('input.json')).toBeVisible();
  });

  test('コピーボタンが表示される', async ({ page }) => {
    const copyButton = page.getByTitle('コピー');
    await expect(copyButton).toBeVisible();
  });

  test('コピーボタンをクリックできる', async ({ page }) => {
    // クリップボードの権限を付与
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    const copyButton = page.getByTitle('コピー');
    await copyButton.click();
    // エラーが発生しないことを確認（クリックが通ること）
    await expect(copyButton).toBeVisible();
  });

  test('isLoading 時はオーバーレイが表示されない（初期状態）', async ({ page }) => {
    // 初期状態ではオーバーレイは非表示
    const overlay = page.locator('text=Wait for processing...');
    await expect(overlay).toBeHidden();
  });
});
