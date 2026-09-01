# 音乐灵感三步筛选器

一个纯前端的 AI 音乐创作灵感工具。三步走完，得到可以直接喂给 AI 音乐生成工具的成品素材：

```
I · 选风格  →  II · 选主题  →  III · 看故事
```

- **选风格**：从内置 32 个双语音乐风格里随机抽 3 个（可刷新换一批）
- **选主题**：AI 针对所选风格生成 5 个创作主题（可刷新，风格不变）
- **看故事**：AI 生成 3 段约 200 字的故事场景，可一键复制风格名（英文）与任意故事

无需后端、无需数据库，全部数据只存在内存里，**刷新即清空，不做任何持久化**。

---

## 快速开始

### 1. 下载项目

```bash
git clone <你的仓库地址>
cd never-app
```

或直接下载 ZIP 解压。

### 2. 配置 API 密钥（必做）

项目**不包含** `config.js`（含密钥，已被 `.gitignore` 排除），需要你自己创建：

```bash
cp config.example.js config.js
```

然后编辑 `config.js`，填入你的接口参数：

```js
window.AI_CONFIG = {
  endpoint: "https://api.openai.com/v1/chat/completions",
  apiKey: "sk-你的真实密钥",
  model: "gpt-4o-mini"
};
```

三个字段说明：

| 字段 | 说明 |
|---|---|
| `endpoint` | 聊天补全接口地址，必须是 OpenAI 兼容格式（`/v1/chat/completions`） |
| `apiKey` | 你的 API 密钥 |
| `model` | 模型名称，字符串，按服务商文档填写 |

### 3. 用本地服务器打开（不要双击 HTML）

浏览器在 `file://` 协议下会拦截网络请求，直接双击 `index.html` 会导致 AI 调用失败。请用任意一种方式起个静态服务器：

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve -l 8000
```

然后访问 `http://localhost:8000`。

---

## 常用服务商配置示例

任何 **OpenAI 兼容接口**都能用，改 `endpoint` / `apiKey` / `model` 三项即可：

<details>
<summary>OpenAI</summary>

```js
window.AI_CONFIG = {
  endpoint: "https://api.openai.com/v1/chat/completions",
  apiKey: "sk-xxxxxx",
  model: "gpt-4o-mini"
};
```
</details>

<details>
<summary>硅基流动 SiliconFlow（国内直连，有免费额度）</summary>

```js
window.AI_CONFIG = {
  endpoint: "https://api.siliconflow.cn/v1/chat/completions",
  apiKey: "sk-xxxxxx",
  model: "Qwen/Qwen2.5-7B-Instruct"
};
```
</details>

<details>
<summary>DeepSeek</summary>

```js
window.AI_CONFIG = {
  endpoint: "https://api.deepseek.com/v1/chat/completions",
  apiKey: "sk-xxxxxx",
  model: "deepseek-chat"
};
```
</details>

<details>
<summary>通义千问（DashScope 兼容模式）</summary>

```js
window.AI_CONFIG = {
  endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
  apiKey: "sk-xxxxxx",
  model: "qwen-plus"
};
```
</details>

<details>
<summary>本地 Ollama（完全离线，apiKey 随便填）</summary>

```js
window.AI_CONFIG = {
  endpoint: "http://localhost:11434/v1/chat/completions",
  apiKey: "ollama",
  model: "qwen2.5:7b"
};
```
</details>

---

## 常见问题

**页面显示"请先在 config.js 中填写…"**
说明 `config.js` 不存在，或 `apiKey` 仍是占位符 `YOUR_API_KEY_HERE`。回到第 2 步检查。

**提示"AI 接口返回错误 401"**
密钥无效或已过期，检查 `apiKey` 是否复制完整、有没有多余空格。

**提示"AI 接口返回错误 404"**
`endpoint` 或 `model` 填错，对照服务商文档确认。

**接口一直转圈 / 请求失败**
确认是用 `http://localhost` 打开的，而不是直接双击文件。

**生成的主题/故事不理想**
直接点页面上的「刷新主题」「刷新故事」重新生成，风格与主题保持不变。

---

## 安全提示

- `config.js` **已加入 `.gitignore`，永远不会被提交**。请勿删除这条规则，也不要把密钥写进任何会被上传的文件。
- 提交前建议自查一次：`git status --short` 里不应出现 `config.js`。
- 如果密钥曾误提交到公开仓库，请立即去服务商后台吊销并重新生成。

---

## 开发

运行测试（jsdom 集成测试，覆盖完整三步交互流与错误提示）：

```bash
npm install jsdom
node tests/run.js all
```

技术栈：原生 HTML / CSS / JavaScript，零构建、零依赖。
