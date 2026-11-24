# Meet Tommy — A Little World of Mine
## 直接上傳 GitHub Pages 專案包

本資料夾內為完整、已打包好的純靜態網站檔案，**完全不需要 Node.js、Vite 或任何編譯建置流程**。

### 🚀 快速部署步驟（推薦方式）

1. 打開您的 GitHub 儲存庫：`tommy1114-commits/meet-tommy`
2. 將本資料夾（`直接上傳github`）**裡面的所有檔案與子資料夾**：
   - `index.html`
   - `.nojekyll`
   - `js/`
   - `css/`
   - `assets/`
   直接拖曳或上傳到 GitHub 儲存庫的根目錄（`main` 分支）。
3. 前往 GitHub 儲存庫的 **Settings** -> **Pages**。
4. 在 **Build and deployment** 下方的 **Source** 選擇 **Deploy from a branch**：
   - Branch: `main`
   - Folder: `/ (root)`
5. 點擊 **Save**。
6. 等候約 1~2 分鐘，即可透過網址遊玩：
   👉 **https://tommy1114-commits.github.io/meet-tommy/**

---

### 💻 本機預覽

以本資料夾為網站根目錄啟動靜態 HTTP 伺服器，再從瀏覽器開啟。若本機已安裝 Python，可在這個資料夾執行 `python -m http.server 8000`，再開啟 `http://localhost:8000/`。

### 體驗 Tommy 的一天

在主選單選擇「體驗 Tommy 的一天｜平日版」。可用方向鍵或掌機十字鍵移動，靠近有框線提示的物件按 A，也可直接點選物件。路線從 06:30 早餐到 23:00 熄燈，包含文湖線轉公車、公司工作情境與 19:00 大湖公園夜跑。

在大湖公園的步道入口戴上耳機，沿湖往右跑到出口。晚上可以點選房間的桌機，選擇看 YouTube 或用 AI 開發 App。

上班時按 A 打開工作台，再按 A 依序看看 NDA、營業秘密、專利申請和技轉授權的日常。看到下班畫面後按 A 去吃晚餐。

早上選的 Podcast 主題會延續到夜跑。23:00 熄燈時，晚安卡會回顧今天的行程和實際體驗過的睡前活動。

這份部署包基於 20261124 公司版。平日版的流程與動畫放在 `js/weekday-*.js`，新增的場景背景放在 `assets/weekday/`。
