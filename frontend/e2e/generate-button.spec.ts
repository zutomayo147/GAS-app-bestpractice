import { test, expect } from '@playwright/test';

test.describe('GenerateButton - プレゼンテーション生成', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('生成ボタンが表示される', async ({ page }) => {
    const generateBtn = page.getByRole('button', { name: /プレゼンテーションを生成/ });
    await expect(generateBtn).toBeVisible();
  });

  test('生成ボタンが初期状態では無効化されていない', async ({ page }) => {
    const generateBtn = page.getByRole('button', { name: /プレゼンテーションを生成/ });
    await expect(generateBtn).toBeEnabled();
  });

  test('不正な JSON 入力時 → エラーメッセージが表示される', async ({ page }) => {
    const textarea = page.locator('textarea');
    await textarea.fill('{ invalid json }');

    const generateBtn = page.getByRole('button', { name: /プレゼンテーションを生成/ });
    await generateBtn.click();

    await expect(
      page.getByText('JSONの形式が正しくありません。確認してください。')
    ).toBeVisible();
  });

  test('正常な JSON 入力 → ローディング → モック完了メッセージが表示される', async ({ page }) => {
    // 新しいタブで開こうとする window.open をブロック
    await page.context().route('**', (route) => route.continue());
    page.on('popup', async (popup) => {
      await popup.close();
    });

    const textarea = page.locator('textarea');
    await textarea.fill(
      JSON.stringify([
        {
          type: 'title',
          title: 'テストスライド',
          subtitle: 'テスト',
        },
      ])
    );

    const generateBtn = page.getByRole('button', { name: /プレゼンテーションを生成/ });
    await generateBtn.click();

    // ローディング表示を確認（非GAS環境なのでモックが走る）
    await expect(page.getByText('生成中...')).toBeVisible();

    // モック完了後（1.5秒 + マージン）に成功メッセージ確認
    await expect(page.getByText('生成完了しました！')).toBeVisible({ timeout: 5000 });
  });

  test('生成ボタンに「推定生成時間」の注記が表示される', async ({ page }) => {
    await expect(page.getByText(/推定生成時間/)).toBeVisible();
  });

  test('エラー表示後、JSONを修正して再生成できる', async ({ page }) => {
    const textarea = page.locator('textarea');

    // まず不正JSONで生成
    await textarea.fill('{ bad }');
    await page.getByRole('button', { name: /プレゼンテーションを生成/ }).click();
    await expect(page.getByText('JSONの形式が正しくありません。確認してください。')).toBeVisible();

    // 正しいJSONに修正して再生成
    page.on('popup', async (popup) => {
      await popup.close();
    });
    await textarea.fill(JSON.stringify([{ type: 'title', title: 'Fix' }]));
    await page.getByRole('button', { name: /プレゼンテーションを生成/ }).click();
    await expect(page.getByText('生成中...')).toBeVisible();
    await expect(page.getByText('生成完了しました！')).toBeVisible({ timeout: 5000 });
  });
});
