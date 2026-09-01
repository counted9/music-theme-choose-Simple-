(function () {
  'use strict';

  /* =========================================================
   * 内置风格词库（硬编码，仅前端，不依赖网络）
   * =======================================================*/
  const STYLES = [
    { en: "Uplifting atmospheric worship ballad with ethereal vocals and sweeping orchestral arrangements", cn: "振奋人心的氛围崇拜抒情曲，配有空灵的歌声和宏伟的管弦乐编排" },
    { en: "Live music, heavy metal with solo guitar, symphonic elements, and aggressive power vocals", cn: "现场音乐，重金属与独奏吉他，交响元素和激烈的主唱" },
    { en: "Bedroom-produced grungegaze, catchy, psychedelic, with acoustic tape recording and lo-fi aesthetic", cn: "卧室制作的grungegaze，朗朗上口，迷幻，带有录音带录音和低保真美学" },
    { en: "Rapid-fire rap, 140 bpm, deep bass beats, aggressive delivery in a minor key, creating high tension", cn: "快速的说唱，140 BPM，深沉的低音节拍，激烈的演绎，使用小调，营造出高度紧张感" },
    { en: "Chillwave electronic, ambient textures, slow-tempo, reverb-heavy vocals, and a dreamy synth backdrop", cn: "放松电子音乐，氛围纹理，慢节奏，重混响人声，梦幻合成器背景" },
    { en: "Futuristic cyberpunk EDM, high-energy beats, distorted synth lines, and neon-lit, dystopian themes", cn: "未来主义赛博朋克电子舞曲，高能节拍，扭曲的合成器旋律，以及霓虹灯照亮的反乌托邦主题" },
    { en: "Acoustic folk, storytelling lyrics, warm vocal harmonies, fingerstyle guitar, and soft percussion", cn: "民谣音乐，叙事歌词，温暖的和声，指弹吉他和柔和的打击乐" },
    { en: "Vintage jazz lounge, classic standards, smooth trumpet solos, upright bass, and sultry female vocals", cn: "复古爵士酒廊，经典标准曲目，流畅的小号独奏，立式低音，性感的女声演唱" },
    { en: "Baroque pop, intricate melodies, orchestral arrangements, harpsichord flourishes, and poetic lyrics", cn: "巴洛克流行音乐，复杂的旋律，管弦乐编排，羽管键琴的华彩，以及富有诗意的歌词" },
    { en: "Glam rock revival, flamboyant performance, glittery costumes, catchy hooks, and guitar solos", cn: "华丽摇滚复兴，炫目的表演，闪亮的服装，朗朗上口的旋律和吉他独奏" },
    { en: "Sultry RnB, smooth beats, seductive vocals, late-night vibes, and lush production", cn: "性感的节奏基调，流畅的节拍，诱人的嗓音，深夜氛围，丰富的制作" },
    { en: "Dark ambient, atmospheric soundscapes, slow-moving textures, and an unsettling, eerie mood", cn: "黑暗氛围，氛围背景，缓慢的质感，以及一种不安、阴森的情绪" },
    { en: "Tropical house, upbeat, sun-kissed melodies, steel drums, breezy vocals, and a laid-back rhythm", cn: "热带生活，欢快的阳光旋律，铜鼓，轻松的歌声，悠闲的节奏" },
    { en: "Psychedelic funk, groovy bass lines, wah-wah guitars, trippy effects, and energetic brass sections", cn: "迷幻放克，动感的低音线，哇哇吉他，迷幻效果和充满活力的铜管乐段" },
    { en: "Epic cinematic scores, sweeping orchestral movements, heroic themes, and stirring emotional peaks", cn: "史诗般的电影配乐，宏伟的管弦乐章，英雄主题，以及激动人心的情感高潮" },
    { en: "Minimal techno, repetitive beats, subtle progression, hypnotic rhythms, and a deep, underground feel", cn: "极简科技音乐，重复的节拍，微妙的进展，催眠的节奏，以及深沉的地下氛围" },
    { en: "Indie surf rock, jangly guitars, beachy vibes, carefree vocals, and upbeat, sunny melodies", cn: "独立冲浪摇滚，清脆吉他，海滩氛围，无忧无虑的歌声，以及欢快阳光的旋律" },
    { en: "Soulful gospel choir, powerful lead vocals, uplifting messages, organ accompaniment, and handclaps", cn: "充满灵魂的福音合唱团，强有力的主唱，振奋人心的信息，风琴伴奏和拍手声" },
    { en: "Aggressive trap metal, distorted 808s, screamed vocals, chaotic energy, and mosh-pit inducing breakdowns", cn: "激烈的陷阱金属，扭曲的808音，尖叫的噪音，混乱的能量，以及引发人群冲撞的节奏变化" },
    { en: "Contemporary classical piano, emotive compositions, dynamic range, and nuanced performance", cn: "当代古典钢琴，富有情感的作品，动态范围，细腻的演奏" },
    { en: "Gypsy jazz, acoustic guitars, fast-paced swing rhythms, violin solos, and a lively, festive atmosphere", cn: "吉普赛爵士，木吉他，快节奏的摇摆节奏，小提琴独奏，热闹的节日气氛" },
    { en: "Dream pop, ethereal vocals, shimmering guitars, lush synth, and a sense of nostalgic longing", cn: "梦幻流行，空灵的嗓音，闪烁的吉他，丰盈的合成器，以及一种怀旧的渴望" },
    { en: "Balkan electro swing, energetic brass ensembles, electronic beats, folk melodies, and infectious dance rhythms", cn: "巴尔干电波摇摆，充满活力的铜管乐队，电子节拍，民间旋律，以及令人感染的舞蹈节奏" },
    { en: "Hardcore punk, fast tempos, political lyrics, raw vocals, and a DIY ethos", cn: "硬核朋克，快速节奏，政治歌词，粗犷的嗓音，以及自制精神" },
    { en: "Space ambient, cosmic soundscapes, slow-evolving textures, and a sense of infinite exploration", cn: "太空氛围，宇宙背景，缓慢演变的纹理，以及无限探索的感觉" },
    { en: "punk rock, ska punk, rock, rap, indie pop", cn: "朋克摇滚，斯卡布兰奇，摇滚，说唱，独立流行" },
    { en: "gregorian chorale, choir, carried singing, epic, majestic, ecclesiastical", cn: "格里高利合唱团，合唱，悠扬的歌声，史诗般的，宏伟的，教会的" },
    { en: "math rock, J-pop, mutation funk, bounce drop, dubstep, edm, 160bpm,", cn: "数学摇滚，J-pop，变异放克，弹跳掉落，dubstep，电子舞曲，160bpm，" },
    { en: "anime opening, heavy metal, male vocal", cn: "动漫开场，重金属，男声唱法" },
    { en: "80's, post-punk, punk, Retrowave, slow", cn: "80 年代，后朋克，朋克，复古波，慢节奏" },
    { en: "Pentatonic Scale, Modern Classic, Game Music, Guzheng & Piano & Chinese Drum & Cello, Slow, Sad, Mellow", cn: "五声音阶，现代经典，游戏音乐，古筝与钢琴与中国鼓与大提琴，慢，悲伤，柔和" },
    { en: "80s pop, creepy, synth", cn: "80 年代流行音乐，阴森，合成器" }
  ];

  /* =========================================================
   * 状态（仅内存，刷新即丢，不持久化）
   * =======================================================*/
  const state = {
    step: 1,
    styleOptions: [],
    selectedStyle: null,
    themeOptions: [],
    selectedTheme: null,
    stories: []
  };

  const $content = document.getElementById('step-content');
  const $stepper = document.getElementById('stepper');
  const $toast = document.getElementById('toast');
  const $back = document.getElementById('back-btn');

  /* ---------------------- 工具 ---------------------- */
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function drawThreeStyles() {
    state.styleOptions = shuffle(STYLES).slice(0, 3);
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
  function extractJSON(text) {
    if (!text) return null;
    try { return JSON.parse(text); } catch (e) {}
    const m = text.match(/\{[\s\S]*\}/);
    if (m) { try { return JSON.parse(m[0]); } catch (e) {} }
    return null;
  }

  /* ---------------------- AI 调用 ---------------------- */
  async function callAI(system, user) {
    const cfg = window.AI_CONFIG;
    if (!cfg || !cfg.endpoint || !cfg.apiKey || cfg.apiKey === 'YOUR_API_KEY_HERE') {
      throw new Error('请先在 config.js 中填写你的 AI endpoint / apiKey / model，然后刷新页面。');
    }
    const res = await fetch(cfg.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cfg.apiKey
      },
      body: JSON.stringify({
        model: cfg.model || 'gpt-4o-mini',
        temperature: 0.9,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ]
      })
    });
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error('AI 接口返回错误 ' + res.status + '：' + t.slice(0, 200));
    }
    const data = await res.json();
    return (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
  }

  async function generateThemes() {
    const s = state.selectedStyle;
    const system = '你是一位音乐创作灵感助手。用户会给出一个音乐风格描述，你需要为该风格构思5个不同、有创意的歌曲主题/题材，每个主题用一句简短中文短语（不超过15字）表达。只返回 JSON，不要有其他任何文字，格式：{"themes":["主题1","主题2","主题3","主题4","主题5"]}。';
    const user = '音乐风格（英文）：' + s.en + '\n音乐风格（中文）：' + s.cn + '\n请为这个风格生成5个不同的歌曲主题。';
    const raw = await callAI(system, user);
    const obj = extractJSON(raw);
    let themes = obj && Array.isArray(obj.themes) ? obj.themes : null;
    if (!themes || themes.length === 0) {
      themes = raw.split(/\n+/).map(x => x.replace(/^\d+[.、)\-]\s*/, '').trim()).filter(Boolean).slice(0, 5);
    }
    return themes.slice(0, 5);
  }

  async function generateStories() {
    const s = state.selectedStyle;
    const t = state.selectedTheme;
    const system = '你是一位音乐创作灵感助手。根据用户给出的音乐风格和选定主题，创作3段不同的、可用于歌曲叙事的简短故事/场景描写，每段约200字，风格需贴合给定音乐风格。只返回 JSON，不要有其他任何文字，格式：{"stories":["故事1","故事2","故事3"]}。';
    const user = '音乐风格（英文）：' + s.en + '\n音乐风格（中文）：' + s.cn + '\n选定主题：' + t + '\n请创作3段不同的故事，每段约200字。';
    const raw = await callAI(system, user);
    const obj = extractJSON(raw);
    let stories = obj && Array.isArray(obj.stories) ? obj.stories : null;
    if (!stories || stories.length === 0) {
      stories = raw.split(/\n{2,}/).map(x => x.trim()).filter(Boolean).slice(0, 3);
    }
    return stories.slice(0, 3);
  }

  /* ---------------------- 渲染 ---------------------- */
  function renderStepper() {
    Array.from($stepper.querySelectorAll('.step')).forEach(el => {
      const n = Number(el.dataset.step);
      el.classList.toggle('active', n === state.step);
      el.classList.toggle('done', n < state.step);
    });
    const titles = { 1: '① 选风格', 2: '② 选主题', 3: '③ 看故事' };
    const $title = document.querySelector('.app-title');
    if ($title) $title.textContent = '音乐灵感三步筛选器 · ' + (titles[state.step] || '');
  }
  function showLoading(msg) {
    $content.innerHTML = '<div class="loading">' + (msg || '生成中…') + '</div>';
  }
  function showError(msg) {
    $content.innerHTML = '<div class="error">⚠️ ' + escapeHtml(msg) + '</div>';
  }

  function renderStep1() {
    const cards = state.styleOptions.map((s, i) => (
      '<button class="card style-card" data-i="' + i + '">' +
        '<div class="card-en">' + escapeHtml(s.en) + '</div>' +
        '<div class="card-cn">' + escapeHtml(s.cn) + '</div>' +
      '</button>'
    )).join('');
    $content.innerHTML =
      '<section class="panel">' +
        '<h2 class="panel-title">① 选择一种音乐风格</h2>' +
        '<p class="hint">从下方随机抽出的 3 个风格中选一个，或刷新换一批。</p>' +
        '<div class="grid">' + cards + '</div>' +
        '<div class="actions"><button id="refresh-style" class="btn btn-ghost">🔄 刷新风格</button></div>' +
      '</section>';

    $content.querySelectorAll('.style-card').forEach(btn => {
      btn.addEventListener('click', () => {
        state.selectedStyle = state.styleOptions[Number(btn.dataset.i)];
        state.themeOptions = [];
        state.selectedTheme = null;
        state.stories = [];
        state.step = 2;
        renderStepper();
        renderStep2();
      });
    });
    document.getElementById('refresh-style').addEventListener('click', () => {
      drawThreeStyles();
      renderStep1();
    });
  }

  function renderStep2() {
    renderStepper();
    showLoading('正在为「' + state.selectedStyle.cn + '」生成 5 个主题…');
    generateThemes().then(themes => {
      if (state.step !== 2) return; // 期间已被重置
      state.themeOptions = themes;
      const cards = themes.map((t, i) => (
        '<button class="card theme-card" data-i="' + i + '">' +
          '<div class="card-cn">' + escapeHtml(t) + '</div>' +
        '</button>'
      )).join('');
      $content.innerHTML =
        '<section class="panel">' +
          '<h2 class="panel-title">② 选择一个创作主题</h2>' +
          '<p class="hint">已选风格：<b>' + escapeHtml(state.selectedStyle.cn) + '</b></p>' +
          '<div class="grid">' + cards + '</div>' +
          '<div class="actions"><button id="refresh-theme" class="btn btn-ghost">🔄 刷新主题</button></div>' +
        '</section>';
      $content.querySelectorAll('.theme-card').forEach(btn => {
        btn.addEventListener('click', () => {
          state.selectedTheme = state.themeOptions[Number(btn.dataset.i)];
          state.stories = [];
          state.step = 3;
          renderStepper();
          renderStep3();
        });
      });
      document.getElementById('refresh-theme').addEventListener('click', () => {
        showLoading('正在重新生成 5 个主题（保持当前风格）…');
        generateThemes().then(nt => {
          if (state.step !== 2) return;
          state.themeOptions = nt;
          renderStep2();
        }).catch(err => showError(err.message));
      });
    }).catch(err => showError(err.message));
  }

  function renderStep3() {
    renderStepper();
    showLoading('正在根据「' + state.selectedStyle.cn + ' / ' + state.selectedTheme + '」创作 3 个故事…');
    generateStories().then(stories => {
      if (state.step !== 3) return;
      state.stories = stories;
      renderStep3Content();
    }).catch(err => showError(err.message));
  }

  function renderStep3Content() {
    const styleCopy = state.selectedStyle.en; // 喂给 AI 音乐工具用英文风格标签
    const storyCards = state.stories.map((st, i) => (
      '<div class="story-card">' +
        '<div class="story-head">故事 ' + (i + 1) + '</div>' +
        '<div class="story-body">' + escapeHtml(st) + '</div>' +
        '<button class="btn btn-copy" data-copy="' + encodeURIComponent(st) + '">📋 复制</button>' +
      '</div>'
    )).join('');
    $content.innerHTML =
      '<section class="panel final-panel">' +
        '<h2 class="panel-title">③ 看故事</h2>' +
        '<div class="final-style">' +
          '<div class="final-style-label">风格名（喂给 AI 音乐工具用英文）</div>' +
          '<div class="final-style-en">' + escapeHtml(state.selectedStyle.en) + '</div>' +
          '<div class="final-style-cn">' + escapeHtml(state.selectedStyle.cn) + '</div>' +
          '<button class="btn btn-copy" data-copy="' + encodeURIComponent(styleCopy) + '">📋 复制风格名（英文）</button>' +
        '</div>' +
        '<div class="final-theme">' +
          '<div class="final-theme-label">已选主题（第②步）</div>' +
          '<div class="final-theme-cn">' + escapeHtml(state.selectedTheme) + '</div>' +
        '</div>' +
        '<div class="actions"><button id="refresh-story" class="btn btn-refresh-story">🔄 刷新故事（保持风格+主题）</button></div>' +
        '<h3 class="block-title">3 个故事灵感</h3>' +
        '<div class="stories">' + storyCards + '</div>' +
      '</section>';

    $content.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', () => copyText(decodeURIComponent(btn.dataset.copy)));
    });
    document.getElementById('refresh-story').addEventListener('click', () => {
      showLoading('正在重新创作 3 个故事（保持风格+主题）…');
      generateStories().then(ns => {
        if (state.step !== 3) return;
        state.stories = ns;
        renderStep3Content();
      }).catch(err => showError(err.message));
    });
  }

  /* ---------------------- 复制 & Toast ---------------------- */
  function copyText(text) {
    const done = () => showToast('复制成功！');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  }
  function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) {}
    document.body.removeChild(ta);
  }
  let toastTimer = null;
  function showToast(msg) {
    $toast.textContent = msg;
    $toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $toast.classList.remove('show'), 1200);
  }

  /* ---------------------- 重置 ---------------------- */
  function resetAll() {
    state.step = 1;
    state.selectedStyle = null;
    state.themeOptions = [];
    state.selectedTheme = null;
    state.stories = [];
    drawThreeStyles();
    renderStepper();
    renderStep1();
  }

  // 步骤指示器：只有 ① 可点击重置
  $stepper.addEventListener('click', (e) => {
    const el = e.target.closest('.step');
    if (el && Number(el.dataset.step) === 1) resetAll();
  });
  $back.addEventListener('click', resetAll);

  /* ---------------------- 启动 ---------------------- */
  drawThreeStyles();
  renderStepper();
  renderStep1();
})();
