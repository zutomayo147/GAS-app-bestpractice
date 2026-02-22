# セキュリティを考慮した React ToDo App (GAS)

Google Apps Script (GAS) 上で動作する、セキュリティのベストプラクティスを取り入れたシンプルなToDoアプリケーションです。
React 19 と Tailwind CSS v4 を使用したモダンなUIを備えています。

## 特徴

- **モダンなUI/UX**: React 19、Vite、Tailwind CSS v4 を採用。
- **PropertiesService による永続化**: GASの `PropertiesService` を使用してデータを保存。
- **セキュリティ特化設計**: バックエンド（GAS）側での厳格なバリデーション。
- **TypeScript による一貫性**: フロントエンドからバックエンドまで型安全な開発。

## セキュリティ対策

本アプリでは、GASの特性を考慮した以下のセキュリティ対策を実装しています。

1.  **入力バリデーション (Validation)**:
    - すべての入力値に対して、バックエンド側で型チェックと長さチェックを行っています。
    - ToDoタイトルの最大文字数制限 (500文字) を設定。
2.  **UUID v4 によるID管理**:
    - ToDoのIDには UUID v4 を使用し、バックエンドで正規表現による検証を行っています。
    - これにより、`PropertiesService` のキーに対して任意の文字列を注入することを防いでいます。
3.  **サニタイズ (Sanitization)**:
    - 入力値の余分な空白を `trim()` で除去。
4.  **例外処理**:
    - 不正なリクエストに対しては適切なエラーメッセージを返し、予期せぬ挙動を防止。

## 開発環境

### バックエンド (GAS)

- **TypeScript**: `src/` 配下にソースを配置。
- **Webpack**: モジュールを `code.js` にバンドル。
- **clasp**: デプロイ管理。

### フロントエンド (UI)

- **React 19 + TypeScript + Vite**: `frontend/` 配下で開発。
- **Tailwind CSS v4**: ユーティリティファーストなスタイリング。

## 使い方

### 1. セットアップ

1.  リポジトリのルートで `npm install`
2.  `frontend` ディレクトリでも `npm install`
3.  `.clasp.json.example` を `.clasp.json` にコピーし、`scriptId` を設定。
4.  `npx clasp login` で認証。

### 2. ローカル開発

フロントエンドの編集・確認：

```bash
cd frontend
npm run dev
```

`http://localhost:3000` でUIを確認できます。

### 3. デプロイ

```bash
npm run build
npm run push
```

## コマンド一覧（ルート）

| コマンド        | 内容                                               |
| --------------- | -------------------------------------------------- |
| `npm run build` | フロントエンド・バックエンドのビルドと成果物の集約 |
| `npm run push`  | GASへのデプロイ (`clasp push`)                     |
| `npm run watch` | 変更を監視して自動ビルド                           |
| `npm test`      | Jestによるユニットテスト実行                       |
| `npm run open`  | GASエディタを開く                                  |
