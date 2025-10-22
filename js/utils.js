/**
 * 正则表达式生成器 - 工具函数模块
 * 包含各种实用工具函数
 */

// 正则表达式常用模式库
const RegexPatterns = {
  // 联系方式
  email: {
    basic: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    strict:
      "^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\\.[a-zA-Z]{2,}$",
    international: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
  },

  phone: {
    china: "^1[3-9]\\d{9}$",
    chinaWithSpaces: "^1[3-9]\\d{2}\\s?\\d{4}\\s?\\d{4}$",
    us: "^\\(?\\d{3}\\)?[-\\s]?\\d{3}[-\\s]?\\d{4}$",
    international: "^\\+?[1-9]\\d{1,14}$",
  },

  // 身份信息
  idCard: {
    china: "^\\d{17}[\\dXx]$",
    chinaStrict:
      "^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[\\dXx]$",
  },

  // 网络相关
  url: {
    basic:
      "^https?://[\\w\\-]+(\\.[\\w\\-]+)+([\\w\\-\\.,@?^=%&:/~\\+#]*[\\w\\-\\@?^=%&/~\\+#])?$",
    strict:
      "^https?://(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$",
  },

  ip: {
    v4: "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
    v6: "^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$",
    both: "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$",
  },

  // 日期时间
  date: {
    yyyyMMdd: "^\\d{4}-\\d{2}-\\d{2}$",
    mmddyyyy: "^\\d{2}/\\d{2}/\\d{4}$",
    ddmmyyyy: "^\\d{2}/\\d{2}/\\d{4}$",
    flexible: "^\\d{4}[-/]\\d{2}[-/]\\d{2}$",
  },

  time: {
    hhmmss: "^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$",
    hhmm: "^([01]?[0-9]|2[0-3]):[0-5][0-9]$",
  },

  // 数字格式
  number: {
    integer: "^-?\\d+$",
    positive: "^\\d+$",
    decimal: "^-?\\d+(\\.\\d+)?$",
    currency: "^\\$?\\d+(\\.\\d{2})?$",
  },

  // 文本处理
  text: {
    chinese: "[\\u4e00-\\u9fa5]",
    alphanumeric: "^[a-zA-Z0-9]+$",
    alphanumericWithSpaces: "^[a-zA-Z0-9\\s]+$",
    noSpecialChars: "^[a-zA-Z0-9\\u4e00-\\u9fa5]+$",
  },

  // 密码强度
  password: {
    weak: "^.{6,}$",
    medium: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$",
    strong: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$",
  },
};

// 工具函数类 - 使用不同的变量名避免冲突
const RegexUtilsClass = class RegexUtils {
  /**
   * 获取所有可用的正则表达式模式
   * @returns {Object} 模式对象
   */
  static getPatterns() {
    return RegexPatterns;
  }

  /**
   * 根据分类获取模式
   * @param {string} category 分类名称
   * @returns {Object} 该分类的模式
   */
  static getPatternsByCategory(category) {
    const categoryMap = {
      contact: ["email", "phone"],
      identity: ["idCard"],
      network: ["url", "ip"],
      format: ["date", "time", "number"],
      text: ["text", "password"],
    };

    const patterns = {};
    const categories = categoryMap[category] || [];

    categories.forEach((cat) => {
      if (RegexPatterns[cat]) {
        patterns[cat] = RegexPatterns[cat];
      }
    });

    return patterns;
  }

  /**
   * 搜索模式
   * @param {string} query 搜索查询
   * @returns {Array} 匹配的模式数组
   */
  static searchPatterns(query) {
    const results = [];
    const searchQuery = query.toLowerCase();

    Object.keys(RegexPatterns).forEach((category) => {
      Object.keys(RegexPatterns[category]).forEach((type) => {
        const pattern = RegexPatterns[category][type];
        const description = this.getPatternDescription(category, type);

        if (
          pattern.toLowerCase().includes(searchQuery) ||
          description.toLowerCase().includes(searchQuery)
        ) {
          results.push({
            category,
            type,
            pattern,
            description,
          });
        }
      });
    });

    return results;
  }

  /**
   * 获取模式描述
   * @param {string} category 分类
   * @param {string} type 类型
   * @returns {string} 描述
   */
  static getPatternDescription(category, type) {
    const descriptions = {
      email: {
        basic: "基本邮箱格式",
        strict: "严格邮箱格式",
        international: "国际邮箱格式",
      },
      phone: {
        china: "中国大陆手机号",
        chinaWithSpaces: "带空格的手机号",
        us: "美国电话号码",
        international: "国际电话号码",
      },
      idCard: {
        china: "中国身份证号",
        chinaStrict: "严格身份证号验证",
      },
      url: {
        basic: "基本URL格式",
        strict: "严格URL格式",
      },
      ip: {
        v4: "IPv4地址",
        v6: "IPv6地址",
        both: "IPv4和IPv6地址",
      },
      date: {
        yyyyMMdd: "YYYY-MM-DD格式",
        mmddyyyy: "MM/DD/YYYY格式",
        ddmmyyyy: "DD/MM/YYYY格式",
        flexible: "灵活日期格式",
      },
      time: {
        hhmmss: "HH:MM:SS格式",
        hhmm: "HH:MM格式",
      },
      number: {
        integer: "整数",
        positive: "正整数",
        decimal: "小数",
        currency: "货币格式",
      },
      text: {
        chinese: "中文字符",
        alphanumeric: "字母数字",
        alphanumericWithSpaces: "字母数字和空格",
        noSpecialChars: "无特殊字符",
      },
      password: {
        weak: "弱密码",
        medium: "中等强度密码",
        strong: "强密码",
      },
    };

    return descriptions[category]?.[type] || `${category} - ${type}`;
  }

  /**
   * 验证正则表达式语法
   * @param {string} pattern 正则表达式
   * @param {string} flags 标志
   * @returns {Object} 验证结果
   */
  static validatePattern(pattern, flags = "") {
    try {
      new RegExp(pattern, flags);
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error.message,
      };
    }
  }

  /**
   * 测试正则表达式
   * @param {string} pattern 正则表达式
   * @param {string} text 测试文本
   * @param {string} flags 标志
   * @returns {Object} 测试结果
   */
  static testPattern(pattern, text, flags = "g") {
    const validation = this.validatePattern(pattern, flags);
    if (!validation.valid) {
      return validation;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const matches = [];
      let match;

      // 重置lastIndex以确保全局搜索从头开始
      regex.lastIndex = 0;

      while ((match = regex.exec(text)) !== null) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
          input: match.input,
        });

        // 防止无限循环
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }

      return {
        valid: true,
        matches,
        count: matches.length,
        pattern,
        flags,
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message,
      };
    }
  }

  /**
   * 转义正则表达式特殊字符
   * @param {string} str 要转义的字符串
   * @returns {string} 转义后的字符串
   */
  static escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * 生成字符类
   * @param {Array} chars 字符数组
   * @param {boolean} negate 是否取反
   * @returns {string} 字符类正则表达式
   */
  static createCharacterClass(chars, negate = false) {
    const escaped = chars.map((char) => this.escapeRegex(char)).join("");
    return `[${negate ? "^" : ""}${escaped}]`;
  }

  /**
   * 生成量词
   * @param {number} min 最小次数
   * @param {number} max 最大次数
   * @returns {string} 量词字符串
   */
  static createQuantifier(min, max) {
    if (min === 0 && max === 1) return "?";
    if (min === 0 && max === Infinity) return "*";
    if (min === 1 && max === Infinity) return "+";
    if (min === max) return `{${min}}`;
    if (max === Infinity) return `{${min},}`;
    return `{${min},${max}}`;
  }

  /**
   * 分析正则表达式
   * @param {string} pattern 正则表达式
   * @returns {Object} 分析结果
   */
  static analyzePattern(pattern) {
    const analysis = {
      length: pattern.length,
      hasAnchors: /^[\^$]/.test(pattern) || /[\^$]$/.test(pattern),
      hasQuantifiers: /[*+?{}]/.test(pattern),
      hasCharacterClasses: /\[.*?\]/.test(pattern),
      hasGroups: /\(.*?\)/.test(pattern),
      hasAlternation: /\|/.test(pattern),
      hasEscapedChars: /\\[.*+?^${}()|[\]\\]/.test(pattern),
      complexity: "simple",
    };

    // 计算复杂度
    let complexity = 0;
    if (analysis.hasAnchors) complexity++;
    if (analysis.hasQuantifiers) complexity++;
    if (analysis.hasCharacterClasses) complexity++;
    if (analysis.hasGroups) complexity++;
    if (analysis.hasAlternation) complexity++;

    if (complexity <= 2) analysis.complexity = "simple";
    else if (complexity <= 4) analysis.complexity = "medium";
    else analysis.complexity = "complex";

    return analysis;
  }

  /**
   * 生成测试用例
   * @param {string} pattern 正则表达式
   * @returns {Array} 测试用例数组
   */
  static generateTestCases(pattern) {
    const testCases = [];

    // 基于模式类型生成测试用例
    if (pattern.includes("@")) {
      testCases.push(
        "test@example.com",
        "user.name@domain.co.uk",
        "invalid@",
        "@domain.com"
      );
    }

    if (pattern.includes("\\d")) {
      testCases.push("123", "12345", "abc123", "123abc");
    }

    if (pattern.includes("[a-zA-Z]")) {
      testCases.push("hello", "Hello", "HELLO", "123");
    }

    return testCases;
  }

  /**
   * 格式化正则表达式
   * @param {string} pattern 正则表达式
   * @param {Object} options 格式化选项
   * @returns {string} 格式化后的正则表达式
   */
  static formatPattern(pattern, options = {}) {
    const { indent = 0, maxLineLength = 80, breakOnOperators = true } = options;

    if (pattern.length <= maxLineLength) {
      return pattern;
    }

    // 简单的格式化逻辑
    let formatted = pattern;
    const indentStr = " ".repeat(indent);

    if (breakOnOperators) {
      formatted = formatted.replace(/\|/g, "\n" + indentStr + "|");
    }

    return formatted;
  }
};

// 复制功能增强
class CopyManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("copy-btn") ||
        e.target.closest(".copy-btn")
      ) {
        e.preventDefault();
        this.handleCopy(e.target);
      }
    });
  }

  async handleCopy(button) {
    const codeElement = button.parentElement.querySelector("code");
    if (!codeElement) return;

    const text = codeElement.textContent;
    const success = await window.RegexGenerator.Utils.copyToClipboard(text);

    if (success) {
      this.showCopySuccess(button);
      window.RegexGenerator.Utils.showNotification("已复制到剪贴板", "success");
    } else {
      window.RegexGenerator.Utils.showNotification(
        "复制失败，请手动复制",
        "error"
      );
    }
  }

  showCopySuccess(button) {
    const originalText = button.textContent;
    button.textContent = "已复制";
    button.style.backgroundColor = "#27ae60";

    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = "";
    }, 2000);
  }
}

// 搜索功能增强
class SearchManager {
  constructor() {
    this.searchIndex = [];
    this.init();
  }

  init() {
    this.buildSearchIndex();
    this.bindEvents();
  }

  buildSearchIndex() {
    const examples = document.querySelectorAll(".example-card");
    this.searchIndex = Array.from(examples).map((card) => ({
      element: card,
      title: card.querySelector("h3")?.textContent || "",
      description: card.querySelector(".description p")?.textContent || "",
      regex: card.querySelector("code")?.textContent || "",
      category: card.getAttribute("data-category") || "",
    }));
  }

  bindEvents() {
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener(
        "input",
        window.RegexGenerator.Utils.debounce(() => {
          this.performSearch();
        }, 300)
      );
    }
  }

  performSearch() {
    const searchInput = document.getElementById("search-input");
    if (!searchInput) return;

    const query = searchInput.value.trim().toLowerCase();

    this.searchIndex.forEach((item) => {
      const matches =
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.regex.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query);

      item.element.style.display = matches ? "block" : "none";
    });
  }
}

// 页面加载完成后初始化
document.addEventListener("DOMContentLoaded", function () {
  // 初始化复制管理器
  new CopyManager();

  // 初始化搜索管理器
  new SearchManager();

  // 将工具类添加到全局作用域（如果不存在的话）
  if (!window.RegexUtils) {
    window.RegexUtils = RegexUtilsClass;
  }
  window.RegexPatterns = RegexPatterns;
});
