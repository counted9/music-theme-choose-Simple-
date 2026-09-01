const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.resolve(__dirname, '..');

// 加载真实 index.html + config.js + app.js 到 jsdom，
// 用桩函数替代 fetch（AI 调用）与 clipboard（复制），
// 从而在不启动真实浏览器的情况下跑通完整交互流程。
function loadApp(opts = {}) {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost/', pretendToBeVisual: true });
  const { window } = dom;

  // —— 桩：剪贴板，捕获复制内容 ——
  let clipboardText = null;
  const clip = { writeText: async (t) => { clipboardText = t; } };
  try { Object.defineProperty(window.navigator, 'clipboard', { configurable: true, writable: true, value: clip }); }
  catch (e) { try { window.navigator.clipboard = clip; } catch (e2) {} }

  // —— 桩：fetch（OpenAI 兼容接口）——
  let fetchCount = 0;
  const calls = [];
  window.fetch = async (url, o) => {
    fetchCount++;
    if (opts.fail) throw new Error('network error');
    const body = JSON.parse(o.body);
    calls.push(body);
    const sys = body.messages[0].content;
    const isStories = sys.includes('stories');
    const content = isStories
      ? JSON.stringify({ stories: ['故事一：夜晚的街道', '故事二：远行的列车', '故事三：归途的灯火'] })
      : JSON.stringify({ themes: ['主题一', '主题二', '主题三', '主题四', '主题五'] });
    return { ok: true, status: 200, json: async () => ({ choices: [{ message: { content } }] }), text: async () => content };
  };

  if (!opts.noConfig) window.eval(fs.readFileSync(path.join(ROOT, 'config.js'), 'utf8'));
  window.eval(fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8'));

  const flush = () => new Promise(r => setTimeout(r, 30));
  const click = (el) => { el.click(); return flush(); };

  return {
    window,
    document: window.document,
    get clipboardText() { return clipboardText; },
    get fetchCount() { return fetchCount; },
    get lastCall() { return calls[calls.length - 1]; },
    flush,
    click
  };
}

module.exports = { loadApp, ROOT };
