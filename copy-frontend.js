const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, 'frontend/dist/index.html');
const dest = path.resolve(__dirname, 'dist/index.html');

console.log('Copying frontend build to dist...');

if (fs.existsSync(src)) {
    // distディレクトリが存在しない場合は作成
    const distDir = path.dirname(dest);
    if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
    }

    fs.copyFileSync(src, dest);
    console.log('Successfully copied index.html to dist/');
} else {
    console.error('Error: frontend/dist/index.html not found. Run "npm run build:frontend" first.');
    process.exit(1);
}
