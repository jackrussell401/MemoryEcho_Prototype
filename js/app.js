/**
 * MemoryEcho (記憶迴響) - Core Application Logic
 * Vanilla JavaScript (ES6+), Zero External Dependencies
 * GitHub Pages Compatible
 */

(function () {
  'use strict';

  // State Management
  const state = {
    currentStage: 1, // 1: Trigger, 2: Storytelling, 3: Co-Creation, 4: Bridging
    currentScenario: null, // 'asr', 'hallucination', 'emotion', or null
    volume: 75, // 0 - 100
    soundEnabled: true,
    isListening: false,
    knobAngle: 45,
    speechAvailable: 'speechSynthesis' in window
  };

  // Content Data according to the PDF Source of Truth
  const SCENARIO_DATA = {
    // Stage 1: Trigger (午後主動問候 - Figma image 1)
    stage1: {
      screenText: "阿姨，要不要\n聊聊年輕的事？",
      ledClass: "state-standby",
      ledTitle: "待機 / 混合主動問候 (灰色 / 暖黃色)",
      badge: "午後 15:00 混合主動問候 (Proactive Prompt)",
      explanation: "【旅程階段 1：觸發陪伴】系統排程於午後 15:00 偵測長者活動，收音機發出溫柔黃光並用語音詢問：「阿姨，要不要聊聊年輕的事？」，打破午後深層寂寞與安靜鐘擺聲。",
      phoneStatus: "外婆收音機處於午後陪伴時段",
      phoneStoryPreview: "等待外婆開啟今天的話題…",
      phoneActionText: "外婆尚未送出故事"
    },

    // Stage 2: Storytelling (生命敘事 - Figma image 2)
    stage2: {
      screenText: "正在聆聽…\n「1970 年代，大稻埕…」",
      ledClass: "state-green",
      ledTitle: "綠色信心燈 (把握度 ≥85%)",
      badge: "多模態語音 CUI 即時採集與語意轉譯",
      explanation: "【旅程階段 2：生命敘事】長者按壓黃金『說故事』按鈕，口述 1970 年代在大稻埕的過往故事。AI 即時進行語音轉文字、語意潤飾與實時對話確認，綠色信心燈亮起表示理解把握度高於 85%。",
      phoneStatus: "連線中：外婆正在口述回憶",
      phoneStoryPreview: "「那時候大稻埕迪化街每到過年就擠滿了人，我們家在巷口開裁縫店…」",
      phoneActionText: "錄製轉譯中 (12s)"
    },

    // Stage 3: Co-Creation (記憶共創與 XAI 溯源)
    stage3: {
      screenType: "card",
      screenText: "【1970 年代大稻埕時裝布莊】\n「阿姨，這是根據您說的木頭餐桌，加上 1970 年代大稻埕老街景幫您合成的記憶圖喔！」",
      ledClass: "state-yellow",
      ledTitle: "暖黃信心燈 (60-84% 中把握度推測合成)",
      badge: "多模態記憶影像復原 + XAI 溯源標章",
      explanation: "【旅程階段 3：記憶共創】長者拿出泛黃黑白舊照，AI 結合口述細節進行超解析度修復與歷史場景生成。介面標註『模擬生成標章』與暖黃信心燈（表示包含 AI 依時代背景之推測合成），點擊可語音溯源，防止長者將 AI 生成圖誤認為真實照片。",
      phoneStatus: "收到外婆生成的記憶故事卡！",
      phoneStoryPreview: "外婆林秀英的故事卡已生成完成，包含原始語音檔與歷史考據標記。",
      phoneActionText: "等待長者確認發送"
    },

    // Stage 4: Bridging (跨世代連結與雙向回傳)
    stage4: {
      screenText: "孫子家豪回覆：\n「外婆！這張大稻埕照片好酷喔！\n原來你年輕時那麼時髦❤️」",
      ledClass: "state-green",
      ledTitle: "綠色信心燈 (跨世代閉環連結成功)",
      badge: "跨世代記憶迴響橋接器 (Bridging Completed)",
      explanation: "【旅程階段 4：跨世代連結】長者確認後一鍵推播至孫子家豪手機端。家豪以碎片化限動形式閱讀並一鍵語音回覆；長者收音機立即響起清脆風鈴提示音，暖光閃爍並溫馨朗讀孫子留言，達成雙向情感閉環！",
      phoneStatus: "家豪已回覆語音與愛心！",
      phoneStoryPreview: "已向外婆發送回饋：「外婆！這張大稻埕照片好酷喔！原來你年輕時那麼時髦❤️」",
      phoneActionText: "情感連結已建立"
    },

    // Error Scenario 1: ASR Mishearing
    asrError: {
      screenText: "阿姨，我剛才耳朵有點背，\n您說的是『老麵店』還是『老裁縫店』呢？",
      ledClass: "state-blue",
      ledTitle: "藍燈閃爍 (進行對話修復與細節確認)",
      badge: "AI 錯誤修復：不傷尊嚴的溫和確認",
      explanation: "【AI 錯誤復原：語音辨識錯誤】AI 絕不上責長者，而是主動承擔責任，以溫和口吻確認。若長者想重新講，可直接按下右下角黃色『一鍵復原』實體按鈕，一鍵清空上一輪對話。",
      phoneStatus: "對話修復中",
      phoneStoryPreview: "長者端正在進行語音微調確認",
      phoneActionText: "對話修復中"
    },

    // Error Scenario 2: AI Hallucination & HITL
    hallucinationError: {
      screenText: "【地名校正通知】\n已遠端同步家豪校正：\n將『老橋頭』更正為『台北橋頭』！",
      ledClass: "state-green",
      ledTitle: "人類接管備援 (HITL 遠端更正完成)",
      badge: "人機協作 (HITL)：青年端遠端校正模式",
      explanation: "【AI 錯誤復原：生成幻覺/歷史不符】當生成內容出現偏差時，青年家屬可於 App 遠端啟動『遠端協助編輯模式』，手動校正歷史專有名詞，收音機即時同步並感謝長者與家人。",
      phoneStatus: "家豪已協助更正歷史專有名詞",
      phoneStoryPreview: "更正紀錄：將『老橋頭』修改為正確史實『台北橋頭』。",
      phoneActionText: "更正已同步"
    },

    // Error Scenario 3: Emotional Distress
    emotionError: {
      screenText: "秀英阿姨，那些辛苦的日子都過去了。\n您現在想休息一下，\n聽首溫暖的鄧麗君老歌嗎？",
      ledClass: "state-yellow",
      ledTitle: "情緒安撫模式 (停止追問，同理共情)",
      badge: "倫理機制：情緒同理共情與親屬警示",
      explanation: "【AI 錯誤復原：情緒波動/離題】若長者因回憶悲傷往事而情緒低落，AI 立即停止追問，切換為溫和同理與安撫語音；系統同時於青年端觸發安全關懷警示通知，提醒家屬致電關懷。",
      phoneStatus: "⚠️ 親屬溫馨提醒：外婆今日回憶情緒較低落，建議抽空去電關心！",
      phoneStoryPreview: "系統已自動切換為音樂陪伴安撫模式。",
      phoneActionText: "建議致電外婆"
    }
  };

  // Web Audio Synthesizer (Zero External Dependencies)
  class AudioEngine {
    constructor() {
      this.ctx = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    // Mechanical Tactile Button Click
    playClick() {
      if (!state.soundEnabled) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

      gain.gain.setValueAtTime(0.3 * (state.volume / 100), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    }

    // Vintage Radio White Noise / Tuning Sound (Table 6 Non-functional spec)
    playRadioTuning(duration = 1.2) {
      if (!state.soundEnabled) return;
      this.init();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.15;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter to simulate analog radio tuning
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18 * (state.volume / 100), now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    }

    // Warm Notification Chime (Cross-generation Echo)
    playChime() {
      if (!state.soundEnabled) return;
      this.init();
      if (!this.ctx) return;

      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      freqs.forEach((freq, index) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + index * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.2 * (state.volume / 100), startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.8);
      });
    }

    // Knob rotation tick
    playKnobTick() {
      if (!state.soundEnabled) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'square';
      osc.frequency.setValueAtTime(900, now);
      gain.gain.setValueAtTime(0.05 * (state.volume / 100), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.02);
    }
  }

  const audio = new AudioEngine();

  // Speech Synthesizer for Elder Accessibility
  function speakScreenText(text) {
    if (!state.soundEnabled || !state.speechAvailable) return;
    try {
      window.speechSynthesis.cancel();
      // Clean up bracket annotations for natural voice
      const cleanText = text.replace(/【.*?】/g, '').replace(/[「」『』]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.95; // slightly slower for elderly comfort
      utterance.pitch = 1.0;
      utterance.volume = state.volume / 100;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  }

  // Toast notification
  function showToast(message) {
    let toast = document.getElementById('soundToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'soundToast';
      toast.className = 'sound-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>📢</span> <span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(toast.timeoutId);
    toast.timeoutId = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // DOM Elements
  const elements = {
    screenText: document.getElementById('radioScreenText'),
    screenIndicator: document.getElementById('screenIndicatorLed'),
    btnStory: document.getElementById('btnStory'),
    btnReset: document.getElementById('btnReset'),
    rotaryKnob: document.getElementById('rotaryKnob'),
    knobVolReadout: document.getElementById('knobVolReadout'),
    radioStatusDot: document.getElementById('radioStatusDot'),
    radioStatusText: document.getElementById('radioStatusText'),
    feedbackExplain: document.getElementById('feedbackExplain'),
    soundToggleBtn: document.getElementById('soundToggleBtn'),
    stepBtns: document.querySelectorAll('.step-btn'),
    scenarioBtns: document.querySelectorAll('.btn-scenario'),
    youthStatusText: document.getElementById('youthStatusText'),
    youthStoryText: document.getElementById('youthStoryText'),
    youthBtnLike: document.getElementById('youthBtnLike'),
    youthBtnVoice: document.getElementById('youthBtnVoice'),
    youthBtnEdit: document.getElementById('youthBtnEdit'),
    figmaToggleBtn: document.getElementById('figmaToggleBtn'),
    figmaDrawer: document.getElementById('figmaDrawer'),
    mobileNavToggle: document.getElementById('mobileNavToggle'),
    navLinks: document.getElementById('navLinks'),
    provenanceChain: document.getElementById('provenanceChain')
  };

  // Update UI to Render Selected State
  function renderState(config) {
    if (!elements.screenText) return;

    // Reset LED classes
    elements.screenIndicator.className = 'indicator-led';
    elements.screenIndicator.classList.add(config.ledClass);
    elements.screenIndicator.title = config.ledTitle || "AI 狀態指示燈";

    // Update screen content
    if (config.screenType === 'card') {
      elements.screenText.innerHTML = `
        <div class="screen-story-card">
          <div class="screen-card-header">
            <span style="font-size:0.75rem; color:#FFDE8A; font-weight:700;">記憶修復卡片</span>
            <span class="source-badge" id="sourceBadgeClick" title="點擊聆聽 XAI 語音溯源說明">
              <span>🔍 模擬生成標章</span>
            </span>
          </div>
          <div class="screen-caption" style="font-size:1.15rem; line-height:1.4; color:var(--radio-text-cream);">
            「阿姨，這是根據您說的木頭餐桌，加上 1970 年代大稻埕老街景幫您合成的記憶圖喔！」
          </div>
        </div>
      `;
      const badge = document.getElementById('sourceBadgeClick');
      if (badge) {
        badge.addEventListener('click', (e) => {
          e.stopPropagation();
          audio.playClick();
          showToast("XAI 溯源語音：「阿姨，這是根據您口述的裁縫店與木頭餐桌，結合國家文化記憶庫 1970 年代大稻埕資料合成的喔！」");
          speakScreenText("阿姨，這是根據您說的木頭餐桌，加上 1970 年代大稻埕老街景幫您合成的記憶圖喔！");
        });
      }
    } else {
      elements.screenText.innerText = config.screenText;
    }

    // Update Status Bar
    if (elements.radioStatusText) {
      elements.radioStatusText.innerText = config.badge;
    }
    if (elements.radioStatusDot) {
      elements.radioStatusDot.className = 'status-dot-mini';
      if (config.ledClass === 'state-green') elements.radioStatusDot.classList.add('active-green');
      if (config.ledClass === 'state-yellow') elements.radioStatusDot.classList.add('active-yellow');
      if (config.ledClass === 'state-blue') elements.radioStatusDot.classList.add('active-blue');
    }

    // Update HCI Explanation Box
    if (elements.feedbackExplain) {
      elements.feedbackExplain.innerHTML = `
        <h4><span style="font-size:1.1rem;">💡</span> HCI 規格解析與實證脈絡</h4>
        <p>${config.explanation}</p>
      `;
    }

    // Update Youth Companion Smartphone View
    if (elements.youthStatusText) elements.youthStatusText.innerText = config.phoneStatus;
    if (elements.youthStoryText) elements.youthStoryText.innerText = config.phoneStoryPreview;

    // Show / Hide Provenance Chain in Youth View
    if (elements.provenanceChain) {
      if (state.currentStage >= 3 || state.currentScenario === 'hallucinationError') {
        elements.provenanceChain.style.display = 'block';
      } else {
        elements.provenanceChain.style.display = 'none';
      }
    }
  }

  // Switch User Journey Stage (1 to 4)
  function setStage(stageNum) {
    state.currentStage = stageNum;
    state.currentScenario = null;

    // Update stepper button UI
    elements.stepBtns.forEach((btn) => {
      const step = parseInt(btn.dataset.step, 10);
      btn.classList.toggle('active', step === stageNum);
    });

    // Clear scenario active styles
    elements.scenarioBtns.forEach(btn => btn.classList.remove('active'));

    const config = SCENARIO_DATA[`stage${stageNum}`];
    if (stageNum === 3) {
      // Stage 3 has simulated diffusion generation white noise
      audio.playRadioTuning(1.5);
      showToast("AI 影像復原中… 收音機播放復古調頻聲（撫慰回饋）");
    } else if (stageNum === 4) {
      audio.playChime();
      showToast("🔔 收到孫子家豪的溫暖回饋！收音機發出溫馨風鈴聲");
    } else {
      audio.playClick();
    }

    renderState(config);
    speakScreenText(config.screenText);
  }

  // Trigger Error Recovery Scenarios (Table 5)
  function triggerScenario(scenarioKey) {
    state.currentScenario = scenarioKey;

    elements.scenarioBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.scenario === scenarioKey);
    });
    elements.stepBtns.forEach(btn => btn.classList.remove('active'));

    const config = SCENARIO_DATA[scenarioKey];
    if (scenarioKey === 'asrError') {
      audio.playClick();
      showToast("AI 啟動對話修復：主動承擔責任，溫和確認");
    } else if (scenarioKey === 'hallucinationError') {
      audio.playClick();
      showToast("青年端啟動遠端協助編輯模式 (HITL) 校正專有名詞");
    } else if (scenarioKey === 'emotionError') {
      audio.playClick();
      showToast("偵測到回憶情緒低落：AI 切換為安撫同理，發送親屬警示");
    }

    renderState(config);
    speakScreenText(config.screenText);
  }

  // Say Story Button ("說故事" - Figma amber button)
  function handleStoryButtonClick() {
    audio.playClick();

    if (state.currentStage === 1) {
      // Move from Standby (Figma 1) to Listening (Figma 2)
      setStage(2);
    } else if (state.currentStage === 2) {
      // Move to Co-Creation
      setStage(3);
    } else if (state.currentStage === 3) {
      // Move to Bridging
      setStage(4);
    } else {
      // Loop back to Standby
      setStage(1);
    }
  }

  // Reset Button ("一鍵復原" - Figma yellow button)
  function handleResetButtonClick() {
    audio.playClick();
    showToast("黃色按鈕：一鍵清空上一輪對話，復原至安全待機模式");
    setStage(1);
  }

  // Volume Knob Handling
  function setupKnob() {
    if (!elements.rotaryKnob) return;

    let isDragging = false;
    let startAngle = 0;
    let currentAngle = state.knobAngle;

    function updateKnob(angle) {
      // Clamp angle between -135deg (0% vol) and 135deg (100% vol)
      const clampedAngle = Math.max(-135, Math.min(135, angle));
      currentAngle = clampedAngle;
      state.knobAngle = clampedAngle;

      // Map to 0-100%
      const volPercent = Math.round(((clampedAngle + 135) / 270) * 100);
      state.volume = volPercent;

      elements.rotaryKnob.style.transform = `rotate(${clampedAngle}deg)`;
      if (elements.knobVolReadout) {
        elements.knobVolReadout.innerText = `${volPercent}%`;
      }
    }

    elements.rotaryKnob.addEventListener('click', (e) => {
      e.stopPropagation();
      // Click cycles volume
      let newVol = state.volume + 25;
      if (newVol > 100) newVol = 25;
      const newAngle = (newVol / 100) * 270 - 135;
      updateKnob(newAngle);
      audio.playKnobTick();
      showToast(`收音機音量調整為 ${state.volume}%`);
    });

    // Mouse wheel support
    elements.rotaryKnob.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 10 : -10;
      updateKnob(currentAngle + delta);
      audio.playKnobTick();
    }, { passive: false });
  }

  // Sound Toggle Button
  function setupSoundToggle() {
    if (!elements.soundToggleBtn) return;

    elements.soundToggleBtn.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      elements.soundToggleBtn.classList.toggle('active', state.soundEnabled);
      elements.soundToggleBtn.innerHTML = state.soundEnabled
        ? `<span>🔊</span> <span>音效已開啟</span>`
        : `<span>🔇</span> <span>音效已靜音</span>`;
      showToast(state.soundEnabled ? "音效與語音播報已開啟" : "音效已靜音");
      if (state.soundEnabled) audio.playClick();
    });
  }

  // Interactive Youth Actions
  function setupYouthActions() {
    if (elements.youthBtnLike) {
      elements.youthBtnLike.addEventListener('click', () => {
        audio.playChime();
        showToast("孫子家豪按讚送暖！外婆收音機發出輕快風鈴聲與亮光");
        setStage(4);
      });
    }

    if (elements.youthBtnVoice) {
      elements.youthBtnVoice.addEventListener('click', () => {
        audio.playChime();
        showToast("孫子語音留言：「外婆！這張大稻埕照片好酷喔！原來你年輕時那麼時髦❤️」");
        setStage(4);
      });
    }

    if (elements.youthBtnEdit) {
      elements.youthBtnEdit.addEventListener('click', () => {
        triggerScenario('hallucinationError');
      });
    }
  }

  // Figma Comparison Drawer Toggle
  function setupFigmaDrawer() {
    if (!elements.figmaToggleBtn || !elements.figmaDrawer) return;

    elements.figmaToggleBtn.addEventListener('click', () => {
      const isOpen = elements.figmaDrawer.classList.toggle('open');
      elements.figmaToggleBtn.innerHTML = isOpen
        ? `<span>▲ 收起 Figma 設計對照圖</span>`
        : `<span>▼ 展開 Figma 原始設計規格對照 (驗證像素級還原度)</span>`;
    });
  }

  // Mobile Navigation Menu Toggle
  function setupMobileNav() {
    if (!elements.mobileNavToggle || !elements.navLinks) return;

    elements.mobileNavToggle.addEventListener('click', () => {
      elements.navLinks.classList.toggle('open');
    });

    elements.navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        elements.navLinks.classList.remove('open');
      });
    });
  }

  // ScrollSpy for Active Navigation Highlighting
  function setupScrollSpy() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navItems = document.querySelectorAll('.nav-links .nav-link');

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 120;

      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    });
  }

  // Initialize
  function init() {
    // Buttons
    if (elements.btnStory) elements.btnStory.addEventListener('click', handleStoryButtonClick);
    if (elements.btnReset) elements.btnReset.addEventListener('click', handleResetButtonClick);

    // Steppers
    elements.stepBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const step = parseInt(btn.dataset.step, 10);
        setStage(step);
      });
    });

    // Error Scenario Buttons
    elements.scenarioBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        triggerScenario(btn.dataset.scenario);
      });
    });

    // Screen LED Click Test
    if (elements.screenIndicator) {
      elements.screenIndicator.addEventListener('click', () => {
        audio.playClick();
        showToast(`信心燈規格：綠燈(≥85% 高把握度)、暖黃燈(60-84% 推測合成)、藍燈閃爍(對話修復)`);
      });
    }

    // Setups
    setupKnob();
    setupSoundToggle();
    setupYouthActions();
    setupFigmaDrawer();
    setupMobileNav();
    setupScrollSpy();

    // Set Initial Stage 1 (Standby - Figma image 1)
    renderState(SCENARIO_DATA.stage1);
  }

  // DOM Content Loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
