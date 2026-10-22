/**
 * MemoryEcho（記憶迴響）
 * 1. 長者端：復古木質收音機（照 Figma 圖）。按「說故事」→ 螢幕換成「正在聆聽…」；按「一鍵復原」→ 回到第一個畫面；音量旋鈕可以轉。
 * 2. 青年端：手機 App 畫面，顯示長者傳來的故事卡，下方只留「點讚」和「語音回覆」兩個按鈕。
 * 3. 文字只能用 PDF 裡寫的。
 */

(function () {
  'use strict';

  // DOM 元素
  const elements = {
    screenText: document.getElementById('radioScreenText'),
    screenIndicator: document.getElementById('screenIndicatorLed'),
    btnStory: document.getElementById('btnStory'),
    btnReset: document.getElementById('btnReset'),
    rotaryKnob: document.getElementById('rotaryKnob'),
    youthBtnLike: document.getElementById('youthBtnLike'),
    youthBtnVoice: document.getElementById('youthBtnVoice')
  };

  // 畫面 1（第一個畫面 - 待機問候）
  const SCREEN_STATE_STANDBY = {
    text: "阿姨，要不要\n聊聊年輕的事？",
    ledClass: "state-standby"
  };

  // 畫面 2（聆聽中畫面）
  const SCREEN_STATE_LISTENING = {
    text: "正在聆聽…\n「1970 年代，大稻埕…」",
    ledClass: "state-green"
  };

  // 設定收音機螢幕狀態
  function setRadioState(state) {
    if (!elements.screenText || !elements.screenIndicator) return;
    elements.screenText.innerText = state.text;
    elements.screenIndicator.className = 'indicator-led ' + state.ledClass;
  }

  // 按「說故事」→ 螢幕換成「正在聆聽…」
  if (elements.btnStory) {
    elements.btnStory.addEventListener('click', function () {
      setRadioState(SCREEN_STATE_LISTENING);
    });
  }

  // 按「一鍵復原」→ 回到第一個畫面
  if (elements.btnReset) {
    elements.btnReset.addEventListener('click', function () {
      setRadioState(SCREEN_STATE_STANDBY);
    });
  }

  // 音量旋鈕可以轉
  if (elements.rotaryKnob) {
    let currentAngle = 45;

    function applyRotation(angle) {
      // 限制角度在 -135deg 至 135deg 之間
      const clamped = Math.max(-135, Math.min(135, angle));
      currentAngle = clamped;
      elements.rotaryKnob.style.transform = 'rotate(' + clamped + 'deg)';
    }

    // 點擊旋鈕旋轉切換
    elements.rotaryKnob.addEventListener('click', function () {
      let nextAngle = currentAngle + 45;
      if (nextAngle > 135) nextAngle = -135;
      applyRotation(nextAngle);
    });

    // 滑鼠滾輪旋轉
    elements.rotaryKnob.addEventListener('wheel', function (e) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 15 : -15;
      applyRotation(currentAngle + delta);
    }, { passive: false });

    // 滑鼠拖曳旋轉
    let isDragging = false;
    let startY = 0;
    let startAngle = 0;

    elements.rotaryKnob.addEventListener('mousedown', function (e) {
      isDragging = true;
      startY = e.clientY;
      startAngle = currentAngle;
      document.body.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      const deltaY = startY - e.clientY;
      applyRotation(startAngle + deltaY * 1.5);
    });

    window.addEventListener('mouseup', function () {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = 'default';
      }
    });

    // 初始旋鈕角度
    applyRotation(currentAngle);
  }

  // 青年端：點讚按鈕
  if (elements.youthBtnLike) {
    elements.youthBtnLike.addEventListener('click', function () {
      this.classList.toggle('liked');
    });
  }

  // 青年端：語音回覆按鈕
  if (elements.youthBtnVoice) {
    elements.youthBtnVoice.addEventListener('click', function () {
      this.classList.toggle('sent');
    });
  }

  // 初始設置為畫面 1
  setRadioState(SCREEN_STATE_STANDBY);
})();
