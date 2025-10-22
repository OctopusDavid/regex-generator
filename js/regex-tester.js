/**
 * 正则表达式测试器 - 测试器功能模块
 */

class RegexTester {
  constructor() {
    this.isTesting = false;
    this.lastTestTime = 0;
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadSavedData();
  }

  /**
   * 绑定事件监听器
   */
  bindEvents() {
    // 测试按钮
    document.getElementById("test-regex")?.addEventListener("click", () => {
      this.runTest();
    });

    // 正则表达式输入变化
    document.getElementById("regex-input")?.addEventListener(
      "input",
      window.RegexGenerator.Utils.debounce(() => {
        this.validateRegex();
      }, 500)
    );

    // 测试文本变化
    document.getElementById("test-input")?.addEventListener(
      "input",
      window.RegexGenerator.Utils.debounce(() => {
        this.runTest();
      }, 300)
    );

    // 匹配选项变化
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        this.runTest();
      });
    });

    // 示例按钮
    document.querySelectorAll(".example-card .btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.loadExample(e.target);
      });
    });
  }

  /**
   * 运行测试
   */
  runTest() {
    if (this.isTesting) return;

    this.isTesting = true;
    const startTime = performance.now();

    const regexInput = document.getElementById("regex-input");
    const testInput = document.getElementById("test-input");

    if (!regexInput || !testInput) {
      this.isTesting = false;
      return;
    }

    const pattern = regexInput.value.trim();
    const text = testInput.value;

    if (!pattern) {
      this.displayResults({ success: false, error: "请输入正则表达式" });
      this.isTesting = false;
      return;
    }

    // 获取匹配选项
    const flags = this.getMatchFlags();

    // 执行测试
    const results = window.RegexGenerator.RegexUtils.test(pattern, text, flags);
    results.executionTime = Math.round(performance.now() - startTime);

    this.displayResults(results);
    this.saveData();

    this.isTesting = false;
  }

  /**
   * 获取匹配标志
   * @returns {string} 标志字符串
   */
  getMatchFlags() {
    const flags = [];

    if (document.getElementById("global-match")?.checked) {
      flags.push("g");
    }
    if (document.getElementById("case-insensitive")?.checked) {
      flags.push("i");
    }
    if (document.getElementById("multiline")?.checked) {
      flags.push("m");
    }

    return flags.join("");
  }

  /**
   * 验证正则表达式
   */
  validateRegex() {
    const regexInput = document.getElementById("regex-input");
    if (!regexInput) return;

    const pattern = regexInput.value.trim();
    if (!pattern) return;

    const validation = window.RegexGenerator.RegexUtils.validate(pattern);

    // 更新输入框样式
    if (validation.valid) {
      regexInput.style.borderColor = "#27ae60";
      regexInput.style.backgroundColor = "#d5f4e6";
    } else {
      regexInput.style.borderColor = "#e74c3c";
      regexInput.style.backgroundColor = "#fadbd8";
    }
  }

  /**
   * 显示测试结果
   * @param {Object} results 测试结果
   */
  displayResults(results) {
    this.updateMatchInfo(results);
    this.updateMatchResults(results);
  }

  /**
   * 更新匹配信息
   * @param {Object} results 测试结果
   */
  updateMatchInfo(results) {
    const matchCount = document.getElementById("match-count");
    const executionTime = document.getElementById("execution-time");

    if (matchCount) {
      matchCount.textContent = results.success ? results.count : 0;
    }

    if (executionTime) {
      executionTime.textContent = results.executionTime
        ? `${results.executionTime}ms`
        : "0ms";
    }
  }

  /**
   * 更新匹配结果
   * @param {Object} results 测试结果
   */
  updateMatchResults(results) {
    const resultsContainer = document.getElementById("match-results");
    if (!resultsContainer) return;

    if (!results.success) {
      resultsContainer.innerHTML = `
                <div class="error-message">
                    <h4>正则表达式错误</h4>
                    <p>${results.error}</p>
                </div>
            `;
      return;
    }

    if (results.matches.length === 0) {
      resultsContainer.innerHTML = `
                <div class="no-results">
                    <h4>未找到匹配项</h4>
                    <p>当前正则表达式没有匹配到任何内容</p>
                </div>
            `;
      return;
    }

    let html = '<div class="match-results">';
    html += `<h4>找到 ${results.matches.length} 个匹配项</h4>`;

    results.matches.forEach((match, index) => {
      html += this.generateMatchHTML(match, index);
    });

    html += "</div>";
    resultsContainer.innerHTML = html;
  }

  /**
   * 生成匹配项HTML
   * @param {Object} match 匹配项
   * @param {number} index 索引
   * @returns {string} HTML字符串
   */
  generateMatchHTML(match, index) {
    const escapedMatch = this.escapeHtml(match.match);
    const context = this.getMatchContext(match);

    return `
            <div class="match-item">
                <div class="match-header">
                    <span class="match-number">#${index + 1}</span>
                    <span class="match-position">位置: ${match.index}</span>
                    <span class="match-length">长度: ${
                      match.match.length
                    }</span>
                </div>
                <div class="match-content">
                    <div class="match-text">${escapedMatch}</div>
                    ${
                      context
                        ? `<div class="match-context">${context}</div>`
                        : ""
                    }
                </div>
            </div>
        `;
  }

  /**
   * 获取匹配上下文
   * @param {Object} match 匹配项
   * @returns {string} 上下文HTML
   */
  getMatchContext(match) {
    const testInput = document.getElementById("test-input");
    if (!testInput) return "";

    const text = testInput.value;
    const start = Math.max(0, match.index - 20);
    const end = Math.min(text.length, match.index + match.match.length + 20);

    const before = text.substring(start, match.index);
    const after = text.substring(match.index + match.match.length, end);

    return `
            <span class="context-before">${this.escapeHtml(before)}</span>
            <span class="context-match">${this.escapeHtml(match.match)}</span>
            <span class="context-after">${this.escapeHtml(after)}</span>
        `;
  }

  /**
   * HTML转义
   * @param {string} text 文本
   * @returns {string} 转义后的文本
   */
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * 加载示例
   * @param {HTMLElement} button 按钮元素
   */
  loadExample(button) {
    const codeElement = button.parentElement.querySelector("code");
    if (codeElement) {
      const regexInput = document.getElementById("regex-input");
      if (regexInput) {
        regexInput.value = codeElement.textContent;
        this.validateRegex();
        this.runTest();
        window.RegexGenerator.Utils.showNotification("示例已加载", "success");
      }
    }
  }

  /**
   * 保存数据
   */
  saveData() {
    const data = {
      regex: document.getElementById("regex-input")?.value || "",
      text: document.getElementById("test-input")?.value || "",
      flags: {
        global: document.getElementById("global-match")?.checked || false,
        caseInsensitive:
          document.getElementById("case-insensitive")?.checked || false,
        multiline: document.getElementById("multiline")?.checked || false,
      },
      timestamp: Date.now(),
    };

    window.RegexGenerator.Utils.storage.set("regexTesterData", data);
  }

  /**
   * 加载保存的数据
   */
  loadSavedData() {
    const data = window.RegexGenerator.Utils.storage.get("regexTesterData");
    if (!data) return;

    // 检查数据是否过期（24小时）
    if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
      window.RegexGenerator.Utils.storage.remove("regexTesterData");
      return;
    }

    if (data.regex) {
      const regexInput = document.getElementById("regex-input");
      if (regexInput) regexInput.value = data.regex;
    }

    if (data.text) {
      const testInput = document.getElementById("test-input");
      if (testInput) testInput.value = data.text;
    }

    if (data.flags) {
      const globalCheckbox = document.getElementById("global-match");
      const caseInsensitiveCheckbox =
        document.getElementById("case-insensitive");
      const multilineCheckbox = document.getElementById("multiline");

      if (globalCheckbox) globalCheckbox.checked = data.flags.global;
      if (caseInsensitiveCheckbox)
        caseInsensitiveCheckbox.checked = data.flags.caseInsensitive;
      if (multilineCheckbox) multilineCheckbox.checked = data.flags.multiline;
    }
  }

  /**
   * 清空所有数据
   */
  clearAll() {
    document.getElementById("regex-input").value = "";
    document.getElementById("test-input").value = "";
    document.getElementById("match-results").innerHTML =
      '<div class="no-results">暂无匹配结果</div>';

    // 重置匹配选项
    document.getElementById("global-match").checked = true;
    document.getElementById("case-insensitive").checked = false;
    document.getElementById("multiline").checked = false;

    // 清除保存的数据
    window.RegexGenerator.Utils.storage.remove("regexTesterData");

    window.RegexGenerator.Utils.showNotification("已清空所有数据", "info");
  }

  /**
   * 导出测试结果
   */
  exportResults() {
    const regexInput = document.getElementById("regex-input");
    const testInput = document.getElementById("test-input");
    const resultsContainer = document.getElementById("match-results");

    if (!regexInput || !testInput || !resultsContainer) return;

    const data = {
      regex: regexInput.value,
      text: testInput.value,
      flags: this.getMatchFlags(),
      results: resultsContainer.innerHTML,
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `regex-test-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    window.RegexGenerator.Utils.showNotification("测试结果已导出", "success");
  }

  /**
   * 导入测试数据
   * @param {File} file 文件对象
   */
  async importData(file) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (data.regex) {
        document.getElementById("regex-input").value = data.regex;
      }
      if (data.text) {
        document.getElementById("test-input").value = data.text;
      }
      if (data.flags) {
        const flags = data.flags;
        document.getElementById("global-match").checked = flags.includes("g");
        document.getElementById("case-insensitive").checked =
          flags.includes("i");
        document.getElementById("multiline").checked = flags.includes("m");
      }

      this.runTest();
      window.RegexGenerator.Utils.showNotification("数据导入成功", "success");
    } catch (err) {
      window.RegexGenerator.Utils.showNotification(
        "导入失败: " + err.message,
        "error"
      );
    }
  }
}

// 页面加载完成后初始化
document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector(".tester-container")) {
    new RegexTester();
  }
});

