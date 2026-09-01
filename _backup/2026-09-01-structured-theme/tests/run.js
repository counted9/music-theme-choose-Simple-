const fs = require('fs');
const path = require('path');
const { loadApp, ROOT } = require('./harness');

let passed = 0;
let failed = 0;

function ok(name, cond) {
  if (cond) { passed++; console.log('  PASS  ' + name); }
  else { failed++; console.log('  FAIL  ' + name); }
}

async function section(title, fn) {
  console.log('\n=== ' + title + ' ===');
  try { await fn(); }
  catch (e) { failed++; console.log('  ERROR ' + (e && e.stack ? e.stack : e)); }
}

async function phaseA() {
  await section('Phase A 脚手架校验', async () => {
    const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
    const reCfg = /<script\s+src=["']config\.js["']\s*>/i;
    const reApp = /<script\s+src=["']app\.js["']\s*>/i;
    ok('index.html 中 <script src="config.js"> 在 <script src="app.js"> 之前',
      reCfg.test(html) && reApp.test(html) && reCfg.exec(html).index < reApp.exec(html).index);
    const gi = fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8');
    ok('.gitignore 忽略 config.js', /\bconfig\.js\b/.test(gi));
    ok('config.js 存在', fs.existsSync(path.join(ROOT, 'config.js')));
    ok('app.js 存在', fs.existsSync(path.join(ROOT, 'app.js')));
  });
}

async function phaseB() {
  await section('Phase B CSS 样式补充', async () => {
    const css = fs.readFileSync(path.join(ROOT, 'styles.css'), 'utf8');
    ok('styles.css 含 .final-theme（主题展示框）', /\.final-theme\b/.test(css));
    ok('styles.css 含 .btn-refresh-story（刷新故事按钮）', /\.btn-refresh-story\b/.test(css));
  });
}

async function phaseC() {
  await section('Phase C 第③步改造', async () => {
    const app = loadApp();
    const doc = app.document;

    // 初始仅第①步可见
    ok('初始仅第①步：无 theme-card', doc.querySelectorAll('.theme-card').length === 0);
    ok('初始仅第①步：无 story-card', doc.querySelectorAll('.story-card').length === 0);
    let cards = doc.querySelectorAll('.style-card');
    ok('① 渲染 3 张风格卡', cards.length === 3);

    // 选风格 -> ②
    await app.click(cards[0]);
    ok('点风格后进入 ②：5 个 theme-card', doc.querySelectorAll('.theme-card').length === 5);

    // ② 主题卡为结构化内容：名称 + 场景/意象/听觉/情绪
    const themeCards = [...doc.querySelectorAll('.theme-card')];
    ok('每张主题卡都有 .theme-name', themeCards.every(c => !!c.querySelector('.theme-name')));
    ok('首张主题卡名称正确', themeCards[0].querySelector('.theme-name').textContent === '主题一');
    ok('主题卡展示适用场景（theme-scene）', themeCards[0].querySelector('.theme-scene').textContent.includes('场景一'));
    ok('主题卡展示歌词意象（theme-imagery）', themeCards[1].querySelector('.theme-imagery').textContent.includes('意象三'));
    ok('主题卡展示听觉描述（theme-audio）', themeCards[0].querySelector('.theme-audio').textContent.includes('厚重混响'));
    ok('主题卡展示情绪基调（theme-mood）', themeCards[4].querySelector('.theme-mood').textContent.includes('绚烂而短暂'));
    const hints = [...doc.querySelectorAll('.hint')].map(h => h.textContent);
    ok('② 展示风格核心气质（styleTemperament）', hints.some(h => h.includes('风格气质') && h.includes('镀了金的怀旧')));

    // 刷新主题：保持风格并触发新的 AI 调用
    const beforeThemeRefresh = app.fetchCount;
    const styleHintBefore = [...doc.querySelectorAll('.hint')].find(h => h.textContent.includes('已选风格')).textContent;
    await app.click(doc.getElementById('refresh-theme'));
    ok('刷新主题后仍有 5 张主题卡', doc.querySelectorAll('.theme-card').length === 5);
    ok('刷新主题保持风格不变',
      [...doc.querySelectorAll('.hint')].some(h => h.textContent === styleHintBefore));
    ok('刷新主题触发新的 AI 调用', app.fetchCount > beforeThemeRefresh);

    // 选主题 -> ③
    await app.click(doc.querySelectorAll('.theme-card')[0]);
    ok('点主题后进入 ③：3 个 story-card', doc.querySelectorAll('.story-card').length === 3);

    // generateStories 请求携带结构化主题信息
    const storyUserMsg = app.lastCall.messages[1].content;
    ok('故事请求包含主题名称', storyUserMsg.includes('主题一'));
    ok('故事请求包含主题场景', storyUserMsg.includes('场景一'));
    ok('故事请求包含歌词意象', storyUserMsg.includes('意象一'));
    ok('故事请求包含听觉描述', storyUserMsg.includes('厚重混响'));
    ok('故事请求包含情绪基调', storyUserMsg.includes('怅然若失'));

    // ③ 结构：风格名复制 + 主题纯展示 + 刷新故事 + 无复制完整指令
    ok('③ 有风格名复制按钮', !!doc.querySelector('.final-style .btn-copy'));
    const themeBox = doc.querySelector('.final-theme');
    ok('③ 有主题展示框', !!themeBox);
    ok('主题展示框纯展示（无按钮）', themeBox && themeBox.querySelector('button') === null);
    ok('③ 主题名称展示正确', doc.querySelector('.final-theme-cn').textContent === '主题一');
    ok('③ 展示主题详情行（场景/意象/听觉/情绪）',
      themeBox && themeBox.querySelectorAll('.final-theme-detail').length >= 3);
    ok('③ 有刷新故事按钮', !!doc.getElementById('refresh-story'));
    ok('③ 无"复制完整指令"按钮',
      doc.getElementById('copy-all') === null &&
      ![...doc.querySelectorAll('button')].some(b => b.textContent.includes('复制完整指令')));

    // 复制某段故事：剪贴板内容 = 该故事文本，且弹出 Toast
    const storyBody = doc.querySelector('.story-card .story-body').textContent;
    const beforeFetch = app.fetchCount;
    await app.click(doc.querySelector('.story-card .btn-copy'));
    ok('复制故事写入剪贴板且内容正确', app.clipboardText === storyBody);
    ok('复制后显示 Toast', doc.getElementById('toast').classList.contains('show'));

    // 复制风格名（英文）
    const styleEn = doc.querySelector('.final-style-en').textContent;
    await app.click(doc.querySelector('.final-style .btn-copy'));
    ok('复制风格名 = 英文风格名', app.clipboardText === styleEn);

    // 刷新故事：保持风格+主题，重新生成 3 段，并触发新的 AI 调用
    const styleText = doc.querySelector('.final-style-en').textContent;
    const themeText = doc.querySelector('.final-theme-cn').textContent;
    await app.click(doc.getElementById('refresh-story'));
    ok('刷新故事后仍有 3 段故事', doc.querySelectorAll('.story-card').length === 3);
    ok('刷新故事保持风格不变', doc.querySelector('.final-style-en').textContent === styleText);
    ok('刷新故事保持主题不变', doc.querySelector('.final-theme-cn').textContent === themeText);
    ok('刷新故事触发新的 AI 调用', app.fetchCount > beforeFetch);

    // 重置：点①回到第①步并清空
    doc.querySelector('.step[data-step="1"]').click();
    await app.flush();
    ok('点①重置回到 ①（3 张风格卡）', doc.querySelectorAll('.style-card').length === 3);
  });

  await section('Phase C+ 主题生成提示语（结构化模板）', async () => {
    const src = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
    ok('系统提示语要求先定义风格核心气质', src.includes('核心气质') && src.includes('styleTemperament'));
    ok('系统提示语包含主题五要素结构（name/scene/imagery/audio/mood）',
      ['name', 'scene', 'imagery', 'audio', 'mood'].every(k => src.includes("'- " + k + '：') || src.includes('- ' + k + '：')));
    ok('系统提示语要求避免陈词滥调并具哲学/情感深度', src.includes('避免陈词滥调') && src.includes('哲学或情感深度'));
    ok('主题意象要求 3-5 个关键词', /3-5\s*个核心关键词/.test(src));
    ok('风格关键词取自所选风格而非硬编码示例', !src.includes('Chillwave, 合成器'));
    ok('generateThemes 返回结构化对象并规范化',
      src.includes('temperament, themes: normalized') && src.includes('filter(t => t.name)'));
  });
}

async function phaseD() {
  await section('Phase D 顶栏标题随步骤', async () => {
    const app = loadApp();
    const doc = app.document;
    ok('① 标题含「选风格」', doc.querySelector('.app-title').textContent.includes('选风格'));
    await app.click(doc.querySelectorAll('.style-card')[0]);
    ok('② 标题含「选主题」', doc.querySelector('.app-title').textContent.includes('选主题'));
    await app.click(doc.querySelectorAll('.theme-card')[0]);
    ok('③ 标题含「看故事」', doc.querySelector('.app-title').textContent.includes('看故事'));
  });
}

async function phaseErr() {
  await section('Phase E 异常与错误提示（PRD 第7节）', async () => {
    // 1) AI 接口调用失败：② 不应白屏，应显示错误提示且不出主题卡
    const app1 = loadApp({ fail: true });
    const doc1 = app1.document;
    await app1.click(doc1.querySelectorAll('.style-card')[0]);
    ok('接口失败时 ② 显示错误提示（不白屏）', !!doc1.querySelector('.error'));
    ok('接口失败时 ② 不渲染主题卡', doc1.querySelectorAll('.theme-card').length === 0);

    // 2) 缺少本地配置：进入 ② 应给出明确提示
    const app2 = loadApp({ noConfig: true });
    const doc2 = app2.document;
    await app2.click(doc2.querySelectorAll('.style-card')[0]);
    ok('缺配置时 ② 显示错误提示', !!doc2.querySelector('.error'));
    ok('缺配置时 ② 不渲染主题卡', doc2.querySelectorAll('.theme-card').length === 0);
  });
}

async function main() {
  const which = process.argv[2] || 'all';
  if (which === 'A' || which === 'all') await phaseA();
  if (which === 'B' || which === 'all') await phaseB();
  if (which === 'C' || which === 'all') await phaseC();
  if (which === 'D' || which === 'all') await phaseD();
  if (which === 'E' || which === 'all') await phaseErr();
  console.log('\n--------------------------------');
  console.log('结果: ' + passed + ' 通过, ' + failed + ' 失败');
  process.exit(failed === 0 ? 0 : 1);
}
main();
