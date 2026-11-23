# Meet Tommy — A Little World of Mine 🎮

一款受到 GBA 時代 2D RPG 啟發的個人互動交友網頁遊戲。專為放置在交友軟體個人簡介設計，讓感興趣的女生能透過復古像素冒險、房間探索、咖啡廳聊天、河濱散步、獨立書店與約會模擬器，在輕鬆、自然且帶有一點浪漫氛圍的情境下，真誠認識真實的 Tommy。

- **純靜態網頁（HTML / CSS / JavaScript）**：零外部相依、無後端、無須建置流程，所有資源皆採相對路徑。
- **本機試玩方式**：在 Windows 直接雙擊開啟 `index.html` 即可於瀏覽器遊玩，不須架設伺服器；亦支援直接部署至 GitHub Pages（含專案子路徑）。
- **操作方式（GBA 掌機介面）**：
  - **移動與游標**：鍵盤方向鍵 / `WASD` 或畫面左側十字鍵（首頁支援 `▶` 游標上下選擇，亦可滑鼠點選／觸控點擊）。
  - **互動／確認**：`Space` / `Enter` / `Z` 對應 `A` 鍵（互動確認／推進對話）；點擊畫面任意處亦可推進對話。
  - **返回／取消**：`Esc` / `X` 對應 `B` 鍵。
  - **音效與音樂**：點擊掌機頂部「🔊 音效」與「🎵 音樂」按鈕隨時開關。
  - **首頁按鈕**：點擊頂部「🏠 首頁」可隨時重開回到標題畫面。

---

## 部署到 GitHub Pages（直接上傳）

本資料夾已去除所有多餘設定與開發套件，為**立即可直接上傳的乾淨檔案**。

### 部署步驟
1. 在 GitHub 上建立一個新的公開倉庫（Repository，例如 `meet-tommy`）。
2. 將本資料夾（`直接上傳github`）內的**所有檔案與子資料夾直接上傳到該倉庫的根目錄（`main` 分支）**：
   - `index.html`
   - `.nojekyll`
   - `README.md`
   - `assets/`
   - `css/`
   - `js/`
3. 進入 GitHub 倉庫的 **Settings → Pages**：
   - **Source** 選擇 `Deploy from a branch`
   - **Branch** 選擇 `main`，資料夾選擇 `/ (root)`
   - 點擊 **Save**。
4. 等候約 1 分鐘，即可透過 GitHub Pages 提供之網址在任何電腦、手機或平板瀏覽器中暢玩！
   👉 **https://tommy1114-commits.github.io/meet-tommy/**
