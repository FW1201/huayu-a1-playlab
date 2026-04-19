# Huayu A1 Playlab

華語文 A1-A2 互動學習網頁，使用繁體中文、漢語拼音與英文釋義，提供詞彙與語法各 5 種互動活動。

## Features

- 詞彙學習：詞彙翻牌、圖詞配對、詞義快選、句中填詞、分類挑戰。
- 語法學習：句型拼圖、語法轉換機、情境選句、錯誤修正、對話排序。
- A1-A2 日常主題範例：打招呼、教室、家庭、食物、時間、日常動作。
- `localStorage` 保存活動完成狀態、最佳分數與練習次數。
- 原創 SVG 視覺素材放在 `public/assets`，可作為 GitHub raw URL 圖床。

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Asset Hosting

Production uses GitHub raw assets by default:

```txt
https://raw.githubusercontent.com/FW1201/huayu-a1-playlab/main/public/assets
```

To override the asset base for another GitHub owner or repo, set:

```bash
VITE_GITHUB_ASSET_BASE=https://raw.githubusercontent.com/<owner>/<repo>/main/public/assets
```
