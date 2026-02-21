import { test, expect } from '@playwright/test';

test.describe('App - ページ基本表示', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('ヘッダーに "スライドジェネレーター Created by Yamashita" が表示される', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'スライドジェネレーター Created by Yamashita' })).toBeVisible();
  });

  test('スライドデータ入力セクションが表示される', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'スライドデータ入力' })).toBeVisible();
  });

  test('デザインカスタマイズセクションが表示される', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'デザインカスタマイズ' })).toBeVisible();
  });

  test('ページタイトルが設定されている', async ({ page }) => {
    await expect(page).toHaveTitle(/frontend/);
  });

  test('フッターが表示される', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
  });

  test('2カラムのグリッドレイアウトが存在する', async ({ page }) => {
    const grid = page.locator('.grid').first();
    await expect(grid).toBeVisible();
  });

  test('Readmeセクションが表示される', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '使い方 (README)' })).toBeVisible();
  });

  test('未実装機能のトースト表示が動作する', async ({ page }) => {
    // "② JSONフォーマットを確認" をクリック
    await page.getByText('② JSONフォーマットを確認').click();
    // トーストが表示されるか
    await expect(page.getByText('この機能はアップデートで実装予定です')).toBeVisible();
  });

  test('デザイン設定の各項目が表示される', async ({ page }) => {
    await expect(page.getByText('保存済みプリセット', { exact: true })).toBeVisible();
    await expect(page.getByText('プライマリカラー', { exact: true })).toBeVisible();
    await expect(page.getByText('フォント', { exact: true })).toBeVisible();
    await expect(page.getByText('フッターテキスト', { exact: true })).toBeVisible();
    await expect(page.getByText('保存先フォルダURL', { exact: true })).toBeVisible();
  });

  test('プレゼンテーション生成ボタンが表示される', async ({ page }) => {
    const generateBtn = page.getByRole('button', { name: 'プレゼンテーションを生成' });
    await expect(generateBtn).toBeVisible();
    await expect(generateBtn).toBeEnabled();
  });
});
