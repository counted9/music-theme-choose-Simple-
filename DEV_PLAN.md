# 开发计划（DEV_PLAN）· 音乐灵感三步筛选器 v1

> 依据：`PRD.md`（设计已确认）
> 目标：把已落盘的原型校正到第③步的三处设计变更，达到 PRD 验收标准。
> 性质：纯静态网页（HTML + CSS + 原生 JS），无需构建工具。

---

## 0. 现状盘点（已落盘文件 vs PRD）

| 文件 | 现状 | 本次处理 |
|------|------|----------|
| `index.html` | 结构完整（顶栏 / stepper / content / toast / 引入 config.js、app.js） | 保留；可选增强：顶栏标题随步骤变化 |
| `styles.css` | 深色卡片主题，含 `.final-style` / `.story-card` / `.btn-copy` 等 | 保留；**新增** 主题展示框样式 + 刷新故事按钮样式 |
| `app.js` | 已实现：32 风格库、随机抽3、AI 生成5主题、AI 生成3故事、复制+Toast、重置 | **改 `renderStep3`**：移除"复制完整指令"、新增主题展示框、新增"刷新故事" |
| `config.js` | 本地真实配置（siliconflow + Qwen2.5-7B-Instruct），已 `.gitignore` | 保留不动 |
| `config.example.js` | 配置模板 | 保留 |
| `.gitignore` | 已忽略 `config.js` | 保留 |
| `PRD.md` | 需求依据 | 保留 |

**结论**：无需新建项目，只需对 `app.js` 第③步做精准改造 + `styles.css` 补样式。

---

## 1. 环境准备（执行前必做）

1. 确认本机有 Python（用于起本地静态服务器，避免 `file://` 下 fetch / clipboard 受限）：
   ```
   python --version
   ```
2. 确认 `config.js` 已填有效 `endpoint` / `apiKey` / `model`（当前已为 siliconflow 可用配置）。
3. 启动本地服务器（在 workspace 目录）：
   ```
   cd "C:\Users\ming\Desktop\never app"
   python -m http.server 8000
   ```
   浏览器打开：`http://localhost:8000/`
4. 推荐 Chrome / Edge（Clipboard API 支持最好）。

---

## 2. 任务清单（按执行顺序）

### Phase A — 脚手架校验（无需改代码，仅确认）
- [ ] `index.html` 中 `config.js` 在 `app.js` 之前引入（当前第 28–29 行，✓ 正确）。
- [ ] `.gitignore` 含 `config.js`（✓ 正确）。
- [ ] `config.js` 中的 key 不会进仓库（✓ 已忽略）。

### Phase B — `styles.css`：补两种样式（新增，不影响现有）
在 `.final-style` 样式块之后追加：
```css
/* 主题展示框（纯展示，无复制按钮） */
.final-theme {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 18px;
}
.final-theme-label { color: var(--muted); font-size: 13px; }
.final-theme-cn { font-size: 15px; font-weight: 600; margin-top: 6px; line-height: 1.5; }

/* 刷新故事按钮（复用 ghost 风格即可，亦可单独定义） */
.btn-refresh-story { background: transparent; color: var(--accent); border-color: var(--accent); }
.btn-refresh-story:hover { background: rgba(108,140,255,0.12); }
```

### Phase C — `app.js`：改造 `renderStep3`（核心改动）
当前 `renderStep3`（第 225–264 行）存在三处需对齐 PRD 的点：
1. **移除** "复制完整指令" 组合按钮（`id="copy-all"` 及其事件，第 250、256–262 行）。
2. **新增** "主题展示框"（纯展示，显示 `state.selectedTheme`，无复制按钮），放在风格名框之后、故事区之前。
3. **新增** "刷新故事" 按钮（保持风格+主题），点击后重新调用 `generateStories()` 并更新展示。

**替换为以下实现**（保留 `generateStories` 等既有函数不变）：
```js
function renderStep3() {
  renderStepper();
  showLoading('正在根据「' + state.selectedStyle.cn + ' / ' + state.selectedTheme + '」创作 3 个故事…');
  generateStories().then(stories => {
    if (state.step !== 3) return; // 期间已被重置
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

      // —— 风格名框（带复制）——
      '<div class="final-style">' +
        '<div class="final-style-label">风格名（喂给 AI 音乐工具用英文）</div>' +
        '<div class="final-style-en">' + escapeHtml(state.selectedStyle.en) + '</div>' +
        '<div class="final-style-cn">' + escapeHtml(state.selectedStyle.cn) + '</div>' +
        '<button class="btn btn-copy" data-copy="' + encodeURIComponent(styleCopy) + '">📋 复制风格名（英文）</button>' +
      '</div>' +

      // —— 主题展示框（纯展示，无复制）——
      '<div class="final-theme">' +
        '<div class="final-theme-label">已选主题（第②步）</div>' +
        '<div class="final-theme-cn">' + escapeHtml(state.selectedTheme) + '</div>' +
      '</div>' +

      // —— 刷新故事（保持风格+主题）——
      '<div class="actions"><button id="refresh-story" class="btn btn-refresh-story">🔄 刷新故事（保持风格+主题）</button></div>' +

      '<h3 class="block-title">3 个故事灵感</h3>' +
      '<div class="stories">' + storyCards + '</div>' +
    '</section>';

  // 绑定各故事 / 风格名 的独立复制
  $content.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => copyText(decodeURIComponent(btn.dataset.copy)));
  });
  // 绑定刷新故事
  document.getElementById('refresh-story').addEventListener('click', () => {
    showLoading('正在重新创作 3 个故事（保持风格+主题）…');
    generateStories().then(ns => {
      if (state.step !== 3) return;
      state.stories = ns;
      renderStep3Content();
    }).catch(err => showError(err.message));
  });
}
```

> 注意：`generateStories()` 内部只读取 `state.selectedStyle` 与 `state.selectedTheme`，不改变它们，因此"刷新故事"天然满足"保持风格+主题"。`renderStepper()` 已在 `renderStep3` 开头调用，刷新内容时步骤指示器状态不丢。

### Phase D — `index.html`（可选增强，非必须）
PRD 线框顶栏标题为"③ 看故事"。当前顶栏是固定应用名。若要对齐线框，可在 `renderStepper()` 末尾加一行按 `state.step` 更新标题：
```js
const titles = { 1: '① 选风格', 2: '② 选主题', 3: '③ 看故事' };
const $title = document.querySelector('.app-title');
if ($title) $title.textContent = '音乐灵感三步筛选器 · ' + (titles[state.step] || '');
```
不实现也不影响验收。

### Phase E — 联调与验收
- 启动本地服务器（见第 1 节）。
- 浏览器打开 `http://localhost:8000/`，按 **PRD 第 7 节验收清单**逐项核对。
- 重点核对第③步三处变更：
  - [ ] 无"复制完整指令"组合按钮；
  - [ ] 有"已选主题"纯展示框（显示第②步主题，无复制）；
  - [ ] 有"刷新故事"按钮，点击后重生成 3 段且风格+主题不变。

---

## 3. 验收对照（映射 PRD 第 7 节）

| 验收项 | 对应改动 | 验证方式 |
|--------|----------|----------|
| 移除"复制完整指令" | Phase C.1 | 第③步页面找不到该按钮 |
| 新增选中主题展示 | Phase B + C.2 | 第③步显示第②步主题，无复制按钮 |
| 新增刷新故事 | Phase B + C.3 | 点击后 3 段更新，风格+主题不变 |
| 风格名/各故事独立复制 + "复制成功！" | 既有（保留） | 点击各复制按钮弹 Toast |
| 三步线性、重置、刷新风格/主题 | 既有（保留） | 按 PRD 逐项点测 |
| 配置本地、不入库 | 既有（保留） | 源码无真实 key；`.gitignore` 生效 |

---

## 4. 风险与注意

1. **`file://` 限制**：直接双击打开 `index.html` 时，`fetch` 调 AI 与 `navigator.clipboard` 可能失败。务必用 `python -m http.server` 起本地 http 服务访问。
2. **AI 返回非 JSON**：`extractJSON()` 已有正则兜底与文本切片兜底，接口偶发格式异常不至于白屏。
3. **密钥安全**：`config.js` 含真实 key，确保 `.gitignore` 已忽略，切勿提交 / 分享。仓库只保留 `config.example.js`。
4. **32 风格库核对**：`app.js` 的 `STYLES` 为早期录入（共 32 条）。数量与用户提供的 32 条一致，建议最终人工通读一遍中英文，确认无错位/重复（例如第 33 行 "punk rock, ska punk…" 这类聚合条目是否符合预期）。
5. **依赖既有函数**：本计划假定 `shuffle / drawThreeStyles / callAI / generateThemes / generateStories / copyText / showToast / resetAll / renderStepper / showLoading / showError / escapeHtml` 均保持现有实现不变。

---

## 5. 执行顺序与命令速查

```bash
# 1) 起本地服务器（在 workspace）
cd "C:\Users\ming\Desktop\never app"
python -m http.server 8000

# 2) 浏览器访问
#    http://localhost:8000/

# 3) 改动文件顺序
#    a. styles.css  → 追加 .final-theme / .btn-refresh-story
#    b. app.js      → 用 Phase C 的代码替换 renderStep3（并新增 renderStep3Content）
#    c. index.html  → 可选：标题随步骤变化
#    d. 刷新浏览器验证
```

完成上述 a–c 后即满足 PRD 第 1–7 节全部内容，可交付自用。
