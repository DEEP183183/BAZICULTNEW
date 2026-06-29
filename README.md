# Master6 Bazi Pure Frontend - Vercel Static

純前端八字排盤網站，無後端、無 API、無資料庫、無登入、無 AI。

## Vercel 部署設定

匯入 GitHub repo 時請用：

- Framework Preset: Other
- Root Directory: 專案根目錄，即包含 `index.html` 的資料夾
- Build Command: 留空 / None
- Output Directory: 留空，或 `.`
- Install Command: 留空 / None

重點：`index.html` 必須放在 repo 根目錄，不可以只放在子資料夾內。

## 本機測試

```bash
python -m http.server 8080
```

然後打開：

```txt
http://localhost:8080
```

## 檔案

- `index.html`：首頁入口，Vercel 會自動讀取
- `style.css`：手機版友善樣式
- `lunar.js`：曆法庫
- `shensha.js`：神煞規則與計算器
- `app.js`：八字、五行百分比、大運等前端計算邏輯
- `standalone.html`：單檔版本，可直接雙擊測試
- `vercel.json`：指定 Vercel 使用純靜態 Other preset
