# Regex Generator — 多语言正则表达式工具平台

这是一个 **纯前端静态网站**（HTML + CSS + JS 实现），
包含以下功能模块：

- 🧠 **Regex Generator（生成器）**：帮助用户快速生成常用正则表达式  
- 🧪 **Regex Tester（测试器）**：实时测试正则表达式匹配效果  
- 📚 **Regex Examples（模板库）**：内置常用正则模板与示例  
- 📖 **Regex Tutorial（教程）**：系统学习正则语法与应用  
- 🌍 **多语言支持**：中文 / 英文 / 西班牙语 / 法语  
- 💰 **商业化预留**：广告位、联盟推广入口、转化区位  

---

## 🧩 项目结构

regex-generator/
 ├── index.html                # 中文首页
 ├── en/index.html             # 英文首页
 ├── es/index.html             # 西班牙语首页
 ├── fr/index.html             # 法语首页
 │
 ├── regex-creator/            # 正则生成器
 │   └── index.html
 ├── regex-tester/             # 正则测试器
 │   └── index.html
 ├── regex-examples/           # 正则模板
 │   └── index.html
 ├── regex-tutorial/           # 教程页面
 │   └── index.html
 │
 ├── css/
 │   └── style.css             # 全局样式文件
 ├── js/
 │   ├── main.js               # 公共交互逻辑
 │   ├── regex-tester.js       # 测试器逻辑
 │   └── regex-creator.js      # 生成器逻辑
 │
 └── assets/                   # 图片、图标、Logo等资源
 └── logo.png

---

## 🚀 开发说明

1. 使用 [Cursor](https://cursor.sh) 打开项目目录  
2. 每个页面（例如 `/regex-tester/index.html`）都是独立运行的  
3. 所有逻辑用原生 JS 实现，不依赖框架  
4. 网站可直接部署到 **GitHub Pages / Cloudflare Pages / Netlify**  
5. 所有页面均为 **静态 HTML**，对 SEO 完全友好  

---

## 🌍 多语言 SEO 说明

每个语言版本是独立 HTML 文件，如：

/index.html           → 中文
 /en/index.html        → 英文
 /es/index.html        → 西班牙语
 /fr/index.html        → 法语

并在 `<head>` 中互相声明 hreflang：
```html
<link rel="alternate" hreflang="zh" href="https://yourdomain.com/" />
<link rel="alternate" hreflang="en" href="https://yourdomain.com/en/" />
<link rel="alternate" hreflang="es" href="https://yourdomain.com/es/" />
<link rel="alternate" hreflang="fr" href="https://yourdomain.com/fr/" />
```

## 💰 商业化预留区域

每个页面都会预留以下区域：

```
<!-- 广告位 -->
<div class="ad-slot"></div>

<!-- 联盟推广区 -->
<div class="affiliate-section"></div>
```

------

## 🧱 模块化开发原则

- 每个功能独立 JS 文件
- 所有样式集中在 `css/style.css`
- 所有页面共享头部与底部（header/footer）
- 每个任务模块单独开发、单独测试

------

## 🧩 开发计划（里程碑）

| 阶段    | 目标             | 内容                          |
| ------- | ---------------- | ----------------------------- |
| ✅ 第1步 | 基础结构搭建     | 创建文件夹与首页              |
| 🔜 第2步 | 页面样式与导航栏 | 完成全局布局                  |
| 🔜 第3步 | 添加功能模块     | 生成器 / 测试器 / 模板 / 教程 |
| 🔜 第4步 | 多语言优化       | 生成 en/es/fr 页面            |
| 🔜 第5步 | SEO + 商业化     | 添加 meta、结构化数据、广告位 |

------

## 🧠 技术栈

- HTML5
- CSS3 + Flexbox + Grid
- 原生 JavaScript (ES6+)
- 结构化数据（JSON-LD）
- 响应式设计（手机 + 桌面）