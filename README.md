# MemoryEcho（記憶迴響）
> **獨居長者跨世代生命故事共創與智慧陪伴系統**  
> 智慧人機互動與使用介面研究 (Intelligent HCI & UI Research) 期末小組專案需求調查報告與高保真實體互動原型

![GitHub Pages Ready](https://img.shields.io/badge/GitHub%20Pages-Ready-brightgreen)
![Tech Stack](https://img.shields.io/badge/Tech-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-blue)
![Dependencies](https://img.shields.io/badge/Dependencies-Zero%20External%20Libraries-orange)

---

## 📌 專案簡介與調研核心

本專案依據 **智慧人機互動與使用介面研究 期末小組專案報告【作業一】** 之完整實證調查內容建置，針對超高齡社會下獨居長者高發之**孤獨感、社交隔離、代溝斷層與生命經驗流失**，提出具身多模態（Multimodal Embodied UI）與混合主動（Mixed-Initiative）之跨世代生命故事共創系統。

- **指導單位**：授課教師團隊 / 智慧人機互動實驗室
- **專案小組**：第 8 小組（成員：林OO、張OO）
- **分工比例**：需求調查 (25%) + HCI 範式規劃 (25%)、XAI與容錯設計 (25%) + 報告撰寫 (25%)
- **調研實證方法**：深度訪談（In-depth Interview，N=10）與居家脈絡訪談（Contextual Inquiry，N=3）

---

## 🎨 視覺與互動設計規範 (Figma 1:1 還原)

網頁頂部搭載完整高保真互動原型，依據 Figma 視覺稿精準重現：

1. **具身木質收音機造型外殼**：
   - 復古木質溫潤外殼（`#A0703F`）、頂部提把（`#6E4A2E`）與圓角幾何比例。
   - 7 吋大字體高對比防眩螢幕（`#2B211A`）。
2. **多模態三色 XAI 記憶比對信心燈 (Confidence Indicator LED)**：
   - **綠燈（≥85% 高把握度）**：AI 100% 聽懂長者原話且歷史資料吻合。
   - **暖黃燈（60-84% 中把握度）**：包含 AI 根據時代背景所進行的推測與合成。
   - **藍燈閃爍**：AI 正在進行對話修復與細節確認。
3. **實體黃金大按鈕與具身觸感**：
   - **「說故事」大按鈕（`#F2B544`）**：按下即時啟動麥克風採集與多模態語音轉譯。
   - **「一鍵復原」黃色按鈕（`#FFD84D`）**：長者可一鍵清空上一輪對話，無心理負擔。
   - **「音量」旋鈕**：圓形旋鈕支援點擊切換、滑鼠滾輪與拖曳旋轉。
4. **Web Audio API 原生音效合成器（無外部音檔依賴）**：
   - 機械按鍵觸感敲擊音（Tactile Click）。
   - 耗時運算時之復古廣播調頻白噪音（White Noise 心理撫慰回饋，符合表 6 規格）。
   - 青年回饋抵達時之溫馨風鈴雙向提示音（Cross-generation Echo Chime）。
   - 原生 Web SpeechSynthesis 語音播報支援。

---

## 📱 跨世代雙軌閉環互動體驗

本網頁同時具備**長者端實體收音機**與**青年端智慧手機 App（外孫陳家豪視角）**之雙軌同屏互動：
- **階段 1：觸發陪伴 (Trigger)** — 午後 15:00 混合主動問候「阿姨，要不要聊聊年輕的事？」。
- **階段 2：生命敘事 (Storytelling)** — 口述 1970 年代大稻埕回憶，螢幕逐字顯示，綠色信心燈點亮。
- **階段 3：記憶共創 (Co-Creation)** — 掃描老照片，AI 生成復古插圖，展示「模擬生成標章」與 XAI 語音溯源卡。
- **階段 4：跨世代連結 (Bridging)** — 推播至青年端，家豪一鍵點讚與語音留言，收音機發出溫馨風鈴回響並朗讀。
- **容錯與 HITL 備援情境**：
  - 語音誤辨識修復（ASR 溫和確認：「阿姨，我耳朵有點背…」）。
  - 生成幻覺校正（青年端遠端更正「老橋頭」為「台北橋頭」）。
  - 情緒波動安撫（停止追問，切換安撫音樂並觸發親屬安全通知）。

---

## 📑 調查報告全文結構導航

網頁完整收錄並呈現 PDF 調查報告全文（絕無杜撰，百分之百忠於原始資料）：
- **一、執行摘要 (Abstract)**
- **二、問題陳述與背景 (Problem Statement & Background)**
  - 1. 未來社會真實痛點（情感孤立、世代斷層、生命經驗流失）
  - 2. 現有 AI 技術缺口（被動模式、數位排斥、缺乏容錯與雙向連結）
- **三、目標用戶與脈絡研究 (User & Context Research)**
  - 1. 實證需求蒐集方法論（深度訪談、脈絡訪談）
  - 2. 代表性 Persona 描繪（主要長者林秀英女士 vs 次要青年陳家豪 — 表 1）
  - 3. 同理地圖結構化分析（Says, Thinks, Does, Feels — 表 2）
  - 4. 跨世代生命故事共創四階段旅程圖（表 3）
- **四、智慧人機互動系統設計規格 (System Specifications)**
  - 1. 核心 AI 功能需求清單（功能 A、B、C — 表 4）
  - 2. 互動範式設計（混合主動 Mixed-Initiative、多模態具身介面）
  - 3. 人機互動雙軌閉環流程圖
  - 4. 可解釋性 AI (XAI) 介面設計策略（信心燈、溯源卡、語音推理揭示、線索鏈）
  - 5. AI 錯誤復原與人類接管 (HITL) 備援對照表（表 5）
- **五、非功能需求與倫理風險評估 (Non-Functional & Ethical)**
  - 1. 非功能需求規格（回應延遲與調頻白噪音、256-bit 去識別化、離線模式 — 表 6）
  - 2. 倫理風險評估與防範策略（情緒過度依賴、文化偏見、隱私侵犯 — 表 7）
- **六、結論與後續原型開發計畫 (Conclusion & Next Steps)**
  - Phase 1（1-2 週）：3D 列印外殼、Raspberry Pi 4、7 吋觸控螢幕
  - Phase 2（3-4 週）：Wizard of Oz (WoO) 實驗室與居家綠野仙蹤實測
  - Phase 3（5 週）：SUS 易用性量表與 NASA-TLX 認知負荷評估
- **七、附錄與參考文獻 (Appendix & References)**
  - 附錄一：訪談大綱題項全貌摘要（長者端 4 題、青年端 3 題）
  - 附錄二：逐字稿精華摘要紀錄（P1 林女士、P7 陳先生）
  - 附錄三：學術參考文獻（CHI 2019, Horvitz 1999, Norman 2013, Schoonderwoerd 2021）

---

## 🚀 GitHub Pages 部署指南

本專案為 **純靜態網頁（Vanilla HTML5 / CSS3 / ES6 JavaScript）**，無需安裝 Node.js、npm 或任何後端伺服器：

1. **直接開啟**：以任何現代瀏覽器直接雙擊開啟 `index.html` 即可使用。
2. **GitHub Pages 部署步驟**：
   - 前往 GitHub 儲存庫：`Settings` → `Pages`
   - 在 **Build and deployment** 下選擇 **Branch: main**，資料夾選擇 **/ (root)**
   - 點擊 **Save**，即可透過 GitHub Pages 網址線上瀏覽！
