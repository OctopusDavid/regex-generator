/**
 * 正则表达式生成器 - 生成器功能模块
 */

class RegexCreator {
  constructor() {
    this.currentType = "email";
    this.configurations = {};
    this.init();
  }

  init() {
    this.bindEvents();
    this.loadDefaultConfig();
    this.updateConfigPanel();
  }

  /**
   * 绑定事件监听器
   */
  bindEvents() {
    // 类型选择按钮
    document.querySelectorAll(".type-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.selectType(e.target.getAttribute("data-type"));
      });
    });

    // 配置选项变化
    document.addEventListener("change", (e) => {
      if (e.target.closest("#config-options")) {
        this.updateRegex();
      }
    });

    // 自定义模式输入实时验证
    document.addEventListener("input", (e) => {
      if (e.target.id === "pattern" && this.currentType === "custom") {
        this.validateCustomPattern(e.target.value);
        this.updateRegex();
      }
    });

    // 复制按钮
    document.getElementById("copy-regex")?.addEventListener("click", () => {
      this.copyRegex();
    });

    // 测试文本变化
    document.getElementById("test-text")?.addEventListener("input", (e) => {
      this.testRegex(e.target.value);
    });
  }

  /**
   * 选择正则表达式类型
   * @param {string} type 类型
   */
  selectType(type) {
    this.currentType = type;

    // 更新按钮状态
    document.querySelectorAll(".type-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(`[data-type="${type}"]`).classList.add("active");

    // 更新配置面板
    this.updateConfigPanel();
    this.updateRegex();
  }

  /**
   * 更新配置面板
   */
  updateConfigPanel() {
    const configOptions = document.getElementById("config-options");
    if (!configOptions) return;

    const config = this.getConfigForType(this.currentType);
    configOptions.innerHTML = this.generateConfigHTML(config);
  }

  /**
   * 获取指定类型的配置
   * @param {string} type 类型
   * @returns {Object} 配置对象
   */
  getConfigForType(type) {
    const configs = {
      email: {
        title: "邮箱地址配置",
        options: [
          {
            name: "allowInternational",
            label: "允许国际域名",
            type: "checkbox",
            value: true,
            description: "支持国际化域名格式",
          },
          {
            name: "allowSubdomains",
            label: "允许子域名",
            type: "checkbox",
            value: true,
            description: "支持多级子域名",
          },
        ],
      },
      phone: {
        title: "手机号码配置",
        options: [
          {
            name: "country",
            label: "国家/地区",
            type: "select",
            value: "CN",
            options: [
              { value: "CN", label: "中国大陆" },
              { value: "US", label: "美国" },
              { value: "UK", label: "英国" },
            ],
          },
          {
            name: "allowSpaces",
            label: "允许空格分隔",
            type: "checkbox",
            value: false,
            description: "如：138 1234 5678",
          },
        ],
      },
      idcard: {
        title: "身份证号配置",
        options: [
          {
            name: "allowX",
            label: "允许X结尾",
            type: "checkbox",
            value: true,
            description: "支持身份证号最后一位为X",
          },
          {
            name: "strictLength",
            label: "严格长度检查",
            type: "checkbox",
            value: true,
            description: "必须为18位",
          },
        ],
      },
      url: {
        title: "URL链接配置",
        options: [
          {
            name: "protocol",
            label: "协议要求",
            type: "select",
            value: "both",
            options: [
              { value: "both", label: "HTTP和HTTPS" },
              { value: "https", label: "仅HTTPS" },
              { value: "http", label: "仅HTTP" },
            ],
          },
          {
            name: "allowSubdomains",
            label: "允许子域名",
            type: "checkbox",
            value: true,
            description: "支持www等子域名",
          },
        ],
      },
      ip: {
        title: "IP地址配置",
        options: [
          {
            name: "version",
            label: "IP版本",
            type: "select",
            value: "v4",
            options: [
              { value: "v4", label: "IPv4" },
              { value: "v6", label: "IPv6" },
              { value: "both", label: "IPv4和IPv6" },
            ],
          },
        ],
      },
      date: {
        title: "日期格式配置",
        options: [
          {
            name: "format",
            label: "日期格式",
            type: "select",
            value: "YYYY-MM-DD",
            options: [
              { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
              { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
              { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
            ],
          },
          {
            name: "separator",
            label: "分隔符",
            type: "select",
            value: "-",
            options: [
              { value: "-", label: "连字符 (-)" },
              { value: "/", label: "斜杠 (/)" },
              { value: ".", label: "点号 (.)" },
            ],
          },
        ],
      },
      number: {
        title: "数字格式配置",
        options: [
          {
            name: "allowDecimals",
            label: "允许小数",
            type: "checkbox",
            value: true,
            description: "支持小数点",
          },
          {
            name: "allowNegative",
            label: "允许负数",
            type: "checkbox",
            value: false,
            description: "支持负号",
          },
          {
            name: "minLength",
            label: "最小长度",
            type: "number",
            value: 1,
            description: "数字最小位数",
          },
          {
            name: "maxLength",
            label: "最大长度",
            type: "number",
            value: 10,
            description: "数字最大位数",
          },
        ],
      },
      custom: {
        title: "自定义配置",
        options: [
          {
            name: "pattern",
            label: "自定义模式",
            type: "textarea",
            value: "",
            description:
              "输入自定义正则表达式模式，支持所有正则表达式语法。例如：^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            placeholder:
              "请输入您的正则表达式模式...\n\n示例：\n• 邮箱: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\n• 手机号: ^1[3-9]\\d{9}$\n• 身份证: ^\\d{17}[\\dXx]$",
          },
        ],
      },
    };

    return configs[type] || { title: "配置", options: [] };
  }

  /**
   * 生成配置HTML
   * @param {Object} config 配置对象
   * @returns {string} HTML字符串
   */
  generateConfigHTML(config) {
    let html = `<h4>${config.title}</h4>`;

    config.options.forEach((option) => {
      html += this.generateOptionHTML(option);
    });

    return html;
  }

  /**
   * 生成单个选项HTML
   * @param {Object} option 选项对象
   * @returns {string} HTML字符串
   */
  generateOptionHTML(option) {
    let html = `<div class="config-option">`;
    html += `<label for="${option.name}">${option.label}</label>`;

    if (option.type === "checkbox") {
      html += `<input type="checkbox" id="${option.name}" name="${
        option.name
      }" ${option.value ? "checked" : ""}>`;
    } else if (option.type === "select") {
      html += `<select id="${option.name}" name="${option.name}">`;
      option.options.forEach((opt) => {
        html += `<option value="${opt.value}" ${
          opt.value === option.value ? "selected" : ""
        }>${opt.label}</option>`;
      });
      html += `</select>`;
    } else if (option.type === "number") {
      html += `<input type="number" id="${option.name}" name="${option.name}" value="${option.value}" min="1" max="100">`;
    } else if (option.type === "textarea") {
      const placeholder = option.placeholder || "输入自定义模式...";
      html += `<textarea id="${option.name}" name="${option.name}" placeholder="${placeholder}">${option.value}</textarea>`;
    }

    if (option.description) {
      html += `<small class="option-description">${option.description}</small>`;
    }

    html += `</div>`;
    return html;
  }

  /**
   * 更新正则表达式
   */
  updateRegex() {
    const regex = this.generateRegex();
    const output = document.getElementById("regex-output");
    if (output) {
      output.value = regex;
    }
  }

  /**
   * 生成正则表达式
   * @returns {string} 生成的正则表达式
   */
  generateRegex() {
    const config = this.getCurrentConfig();

    switch (this.currentType) {
      case "email":
        return this.generateEmailRegex(config);
      case "phone":
        return this.generatePhoneRegex(config);
      case "idcard":
        return this.generateIdCardRegex(config);
      case "url":
        return this.generateUrlRegex(config);
      case "ip":
        return this.generateIpRegex(config);
      case "date":
        return this.generateDateRegex(config);
      case "number":
        return this.generateNumberRegex(config);
      case "custom":
        return this.generateCustomRegex(config);
      default:
        return "";
    }
  }

  /**
   * 获取当前配置
   * @returns {Object} 当前配置
   */
  getCurrentConfig() {
    const config = {};
    const configOptions = document.getElementById("config-options");
    if (!configOptions) return config;

    configOptions
      .querySelectorAll("input, select, textarea")
      .forEach((input) => {
        if (input.type === "checkbox") {
          config[input.name] = input.checked;
        } else {
          config[input.name] = input.value;
        }
      });

    return config;
  }

  /**
   * 生成邮箱正则表达式
   * @param {Object} config 配置
   * @returns {string} 正则表达式
   */
  generateEmailRegex(config) {
    const localPart = "[a-zA-Z0-9._%+-]+";
    const domainPart = config.allowSubdomains
      ? "[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}"
      : "[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}";

    return `^${localPart}@${domainPart}$`;
  }

  /**
   * 生成手机号正则表达式
   * @param {Object} config 配置
   * @returns {string} 正则表达式
   */
  generatePhoneRegex(config) {
    if (config.country === "CN") {
      return config.allowSpaces
        ? "^1[3-9]\\d{2}\\s?\\d{4}\\s?\\d{4}$"
        : "^1[3-9]\\d{9}$";
    } else if (config.country === "US") {
      return config.allowSpaces
        ? "^\\(?\\d{3}\\)?[-\\s]?\\d{3}[-\\s]?\\d{4}$"
        : "^\\(?\\d{3}\\)?\\d{3}\\d{4}$";
    }
    return "^\\d{10,15}$";
  }

  /**
   * 生成身份证号正则表达式
   * @param {Object} config 配置
   * @returns {string} 正则表达式
   */
  generateIdCardRegex(config) {
    const lastChar = config.allowX ? "[\\dXx]" : "\\d";
    return config.strictLength
      ? `^\\d{17}${lastChar}$`
      : `^\\d{17,18}${lastChar}$`;
  }

  /**
   * 生成URL正则表达式
   * @param {Object} config 配置
   * @returns {string} 正则表达式
   */
  generateUrlRegex(config) {
    let protocol = "";
    if (config.protocol === "https") {
      protocol = "https://";
    } else if (config.protocol === "http") {
      protocol = "http://";
    } else {
      protocol = "https?://";
    }

    const domain = config.allowSubdomains
      ? "(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}"
      : "[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}";

    const path = "\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)";

    return `^${protocol}${domain}${path}$`;
  }

  /**
   * 生成IP地址正则表达式
   * @param {Object} config 配置
   * @returns {string} 正则表达式
   */
  generateIpRegex(config) {
    if (config.version === "v4") {
      return "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$";
    } else if (config.version === "v6") {
      return "^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$";
    } else {
      return "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$";
    }
  }

  /**
   * 生成日期正则表达式
   * @param {Object} config 配置
   * @returns {string} 正则表达式
   */
  generateDateRegex(config) {
    const separator = config.separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    if (config.format === "YYYY-MM-DD") {
      return `^\\d{4}${separator}\\d{2}${separator}\\d{2}$`;
    } else if (config.format === "MM/DD/YYYY") {
      return `^\\d{2}${separator}\\d{2}${separator}\\d{4}$`;
    } else if (config.format === "DD/MM/YYYY") {
      return `^\\d{2}${separator}\\d{2}${separator}\\d{4}$`;
    }

    return "^\\d{4}[-/]\\d{2}[-/]\\d{2}$";
  }

  /**
   * 生成数字正则表达式
   * @param {Object} config 配置
   * @returns {string} 正则表达式
   */
  generateNumberRegex(config) {
    let pattern = "^";

    if (config.allowNegative) {
      pattern += "-?";
    }

    pattern += "\\d";

    if (config.allowDecimals) {
      pattern += "(\\.\\d+)?";
    }

    const minLength = parseInt(config.minLength) || 1;
    const maxLength = parseInt(config.maxLength) || 10;

    if (minLength === maxLength) {
      pattern += `{${minLength}}`;
    } else {
      pattern += `{${minLength},${maxLength}}`;
    }

    pattern += "$";
    return pattern;
  }

  /**
   * 生成自定义正则表达式
   * @param {Object} config 配置
   * @returns {string} 正则表达式
   */
  generateCustomRegex(config) {
    return config.pattern || "";
  }

  /**
   * 验证自定义正则表达式
   * @param {string} pattern 正则表达式模式
   */
  validateCustomPattern(pattern) {
    const textarea = document.getElementById("pattern");
    if (!textarea) return;

    // 移除之前的验证样式
    textarea.classList.remove("pattern-valid", "pattern-invalid");

    if (!pattern.trim()) {
      return;
    }

    try {
      new RegExp(pattern);
      textarea.classList.add("pattern-valid");
      this.showPatternValidation("✓ 正则表达式语法正确", "success");
    } catch (error) {
      textarea.classList.add("pattern-invalid");
      this.showPatternValidation(`✗ 正则表达式错误: ${error.message}`, "error");
    }
  }

  /**
   * 显示模式验证结果
   * @param {string} message 消息
   * @param {string} type 类型
   */
  showPatternValidation(message, type) {
    let validationDiv = document.getElementById("pattern-validation");
    if (!validationDiv) {
      validationDiv = document.createElement("div");
      validationDiv.id = "pattern-validation";
      validationDiv.style.cssText = `
        margin-top: 0.5rem;
        padding: 0.75rem;
        border-radius: 6px;
        font-size: 0.9rem;
        font-weight: 500;
        transition: all 0.3s;
      `;

      const textarea = document.getElementById("pattern");
      if (textarea && textarea.parentNode) {
        textarea.parentNode.appendChild(validationDiv);
      }
    }

    validationDiv.textContent = message;
    validationDiv.className = `pattern-validation-${type}`;

    if (type === "success") {
      validationDiv.style.background = "#d5f4e6";
      validationDiv.style.color = "#27ae60";
      validationDiv.style.border = "1px solid #27ae60";
    } else {
      validationDiv.style.background = "#fadbd8";
      validationDiv.style.color = "#e74c3c";
      validationDiv.style.border = "1px solid #e74c3c";
    }
  }

  /**
   * 复制正则表达式
   */
  async copyRegex() {
    const output = document.getElementById("regex-output");
    if (output && output.value) {
      const success = await window.RegexGenerator.Utils.copyToClipboard(
        output.value
      );
      if (success) {
        window.RegexGenerator.Utils.showNotification(
          "正则表达式已复制到剪贴板",
          "success"
        );
      } else {
        window.RegexGenerator.Utils.showNotification(
          "复制失败，请手动复制",
          "error"
        );
      }
    }
  }

  /**
   * 测试正则表达式
   * @param {string} text 测试文本
   */
  testRegex(text) {
    const regex = this.generateRegex();
    const results = window.RegexGenerator.RegexUtils.test(regex, text);

    this.displayTestResults(results);
  }

  /**
   * 显示测试结果
   * @param {Object} results 测试结果
   */
  displayTestResults(results) {
    const resultsContainer = document.getElementById("match-results");
    if (!resultsContainer) return;

    if (results.success) {
      if (results.matches.length > 0) {
        let html = '<div class="match-results">';
        html += `<h4>找到 ${results.matches.length} 个匹配：</h4>`;

        results.matches.forEach((match, index) => {
          html += `<div class="match-item">`;
          html += `<span class="match-index">${index + 1}</span>`;
          html += `<span class="match-text">${match.match}</span>`;
          html += `<span class="match-position">位置: ${match.index}</span>`;
          html += `</div>`;
        });

        html += "</div>";
        resultsContainer.innerHTML = html;
      } else {
        resultsContainer.innerHTML =
          '<div class="no-matches">未找到匹配项</div>';
      }
    } else {
      resultsContainer.innerHTML = `<div class="error">正则表达式错误: ${results.error}</div>`;
    }
  }

  /**
   * 加载默认配置
   */
  loadDefaultConfig() {
    // 可以在这里加载用户保存的配置
    const savedConfig = window.RegexGenerator.Utils.storage.get(
      "regexCreatorConfig",
      {}
    );
    this.configurations = savedConfig;
  }

  /**
   * 保存配置
   */
  saveConfig() {
    const config = this.getCurrentConfig();
    this.configurations[this.currentType] = config;
    window.RegexGenerator.Utils.storage.set(
      "regexCreatorConfig",
      this.configurations
    );
  }
}

// 页面加载完成后初始化
document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector(".creator-container")) {
    new RegexCreator();
  }
});
