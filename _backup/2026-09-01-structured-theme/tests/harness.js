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
      : JSON.stringify({
          styleTemperament: '镀了金的怀旧与致幻的孤独感',
          themes: [
            { name: '主题一', scene: '场景一：黄昏的空泳池', imagery: ['意象一', '意象二'], audio: '厚重混响与磁带质感', mood: '怅然若失' },
            { name: '主题二', scene: '场景二：深夜的高速公路', imagery: ['意象三', '意象四', '意象五'], audio: '干燥人声与低保真底噪', mood: '克制疏离' },
            { name: '主题三', scene: '场景三：凌晨的便利店', imagery: ['意象六'], audio: '空灵合唱垫底', mood: '温柔孤独' },
            { name: '主题四', scene: '场景四：旧磁带仓库', imagery: ['意象七', '意象八'], audio: '模拟合成器暖音色', mood: '怀旧' },
            { name: '主题五', scene: '场景五：天台上的烟花', imagery: ['意象九', '意象十'], audio: '延迟效果拉满的人声', mood: '绚烂而短暂' }
          ]
        });
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
