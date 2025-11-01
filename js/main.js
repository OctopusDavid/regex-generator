/**
 * 正则表达式生成器 - 主JavaScript文件
 * 包含全局功能和公共方法
 */

// 全局配置
const CONFIG = {
  version: "2.0.0",
  apiBaseUrl: "https://regexcrafts.top",
  defaultLanguage: "zh",
  supportedLanguages: ["zh", "en", "es", "fr"],
};

// 工具函数
const Utils = {
  /**
   * 防抖函数
   * @param {Function} func 要防抖的函数
   * @param {number} wait 等待时间
   * @returns {Function} 防抖后的函数
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * 节流函数
   * @param {Function} func 要节流的函数
   * @param {number} limit 限制时间
   * @returns {Function} 节流后的函数
   */
  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * 复制文本到剪贴板
   * @param {string} text 要复制的文本
   * @returns {Promise<boolean>} 是否复制成功
   */
  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // 降级方案
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const result = document.execCommand("copy");
        document.body.removeChild(textArea);
        return result;
      }
    } catch (err) {
      console.error("复制失败:", err);
      return false;
    }
  },

  /**
   * 显示通知消息
   * @param {string} message 消息内容
   * @param {string} type 消息类型 (success, error, warning, info)
   * @param {number} duration 显示时长(毫秒)
   */
  showNotification(message, type = "info", duration = 3000) {
    // 创建通知元素
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // 添加样式
    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "12px 20px",
      borderRadius: "6px",
      color: "white",
      fontWeight: "500",
      zIndex: "10000",
      transform: "translateX(100%)",
      transition: "transform 0.3s ease-out",
      maxWidth: "300px",
      wordWrap: "break-word",
    });

    // 根据类型设置背景色
    const colors = {
      success: "#27ae60",
      error: "#e74c3c",
      warning: "#f39c12",
      info: "#3498db",
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    // 添加到页面
    document.body.appendChild(notification);

    // 显示动画
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // 自动隐藏
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);
  },

  /**
   * 格式化文件大小
   * @param {number} bytes 字节数
   * @returns {string} 格式化后的大小
   */
  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  /**
   * 生成唯一ID
   * @returns {string} 唯一ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  /**
   * 验证邮箱格式
   * @param {string} email 邮箱地址
   * @returns {boolean} 是否有效
   */
  isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  },

  /**
   * 验证手机号格式
   * @param {string} phone 手机号
   * @returns {boolean} 是否有效
   */
  isValidPhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  },

  /**
   * 获取URL参数
   * @param {string} name 参数名
   * @returns {string|null} 参数值
   */
  getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  },

  /**
   * 设置URL参数
   * @param {string} name 参数名
   * @param {string} value 参数值
   */
  setUrlParameter(name, value) {
    const url = new URL(window.location);
    url.searchParams.set(name, value);
    window.history.replaceState({}, "", url);
  },

  /**
   * 本地存储操作
   */
  storage: {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (err) {
        console.error("存储失败:", err);
        return false;
      }
    },

    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (err) {
        console.error("读取失败:", err);
        return defaultValue;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (err) {
        console.error("删除失败:", err);
        return false;
      }
    },
  },
};

// 正则表达式工具类
const RegexUtils = {
  /**
   * 转义正则表达式特殊字符
   * @param {string} str 要转义的字符串
   * @returns {string} 转义后的字符串
   */
  escape(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  },

  /**
   * 测试正则表达式
   * @param {string} pattern 正则表达式
   * @param {string} text 测试文本
   * @param {string} flags 标志
   * @returns {Object} 测试结果
   */
  test(pattern, text, flags = "g") {
    try {
      const regex = new RegExp(pattern, flags);
      const matches = [];
      let match;

      while ((match = regex.exec(text)) !== null) {
        matches.push({
          match: match[0],
          index: match.index,
          groups: match.slice(1),
        });
      }

      return {
        success: true,
        matches: matches,
        count: matches.length,
        pattern: pattern,
        flags: flags,
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
        pattern: pattern,
        flags: flags,
      };
    }
  },

  /**
   * 验证正则表达式语法
   * @param {string} pattern 正则表达式
   * @param {string} flags 标志
   * @returns {Object} 验证结果
   */
  validate(pattern, flags = "") {
    try {
      new RegExp(pattern, flags);
      return { valid: true };
    } catch (err) {
      return {
        valid: false,
        error: err.message,
      };
    }
  },
};

// 页面初始化
document.addEventListener("DOMContentLoaded", function () {
  // 初始化导航栏
  initNavigation();

  // 初始化复制功能
  initCopyButtons();

  // 初始化搜索功能
  initSearch();

  // 初始化教程导航
  initTutorialNavigation();

  // 初始化示例筛选
  initExampleFilter();

  console.log("正则表达式生成器 v" + CONFIG.version + " 已加载");
});

/**
 * 初始化导航栏
 */
function initNavigation() {
  const navLinks = document.querySelectorAll(".nav-links a");
  const currentPath = window.location.pathname;

  navLinks.forEach((link) => {
    if (
      link.getAttribute("href") === currentPath ||
      (currentPath.includes(link.getAttribute("href")) &&
        link.getAttribute("href") !== "/")
    ) {
      link.classList.add("active");
    }
  });
}

/**
 * 初始化复制按钮
 */
function initCopyButtons() {
  document.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("copy-btn") ||
      e.target.closest(".copy-btn")
    ) {
      e.preventDefault();
      const button = e.target.classList.contains("copy-btn")
        ? e.target
        : e.target.closest(".copy-btn");
      const codeElement = button.parentElement.querySelector("code");

      if (codeElement) {
        const text = codeElement.textContent;
        Utils.copyToClipboard(text).then((success) => {
          if (success) {
            Utils.showNotification("已复制到剪贴板", "success");
            button.textContent = "已复制";
            setTimeout(() => {
              button.textContent = "复制";
            }, 2000);
          } else {
            Utils.showNotification("复制失败，请手动复制", "error");
          }
        });
      }
    }
  });
}

/**
 * 初始化搜索功能
 */
function initSearch() {
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");

  if (searchInput && searchBtn) {
    const performSearch = () => {
      const query = searchInput.value.trim().toLowerCase();
      const examples = document.querySelectorAll(".example-card");

      examples.forEach((card) => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        const description = card
          .querySelector(".description p")
          .textContent.toLowerCase();
        const regex = card.querySelector("code").textContent.toLowerCase();

        const matches =
          title.includes(query) ||
          description.includes(query) ||
          regex.includes(query);

        card.style.display = matches ? "block" : "none";
      });
    };

    searchBtn.addEventListener("click", performSearch);
    searchInput.addEventListener("input", Utils.debounce(performSearch, 300));
  }
}

/**
 * 初始化教程导航
 */
function initTutorialNavigation() {
  const navLinks = document.querySelectorAll(".tutorial-nav .nav-link");
  const chapters = document.querySelectorAll(".tutorial-chapter");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);

      // 更新导航状态
      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");

      // 显示对应章节
      chapters.forEach((chapter) => {
        chapter.classList.remove("active");
        if (chapter.id === targetId) {
          chapter.classList.add("active");
        }
      });
    });
  });
}

/**
 * 初始化示例筛选
 */
function initExampleFilter() {
  const tabBtns = document.querySelectorAll(".tab-btn");
  const examples = document.querySelectorAll(".example-card");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const category = this.getAttribute("data-category");

      // 更新按钮状态
      tabBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      // 筛选示例
      examples.forEach((example) => {
        const exampleCategory = example.getAttribute("data-category");
        if (category === "all" || exampleCategory === category) {
          example.style.display = "block";
        } else {
          example.style.display = "none";
        }
      });
    });
  });
}

/**
 * 加载示例正则表达式
 * @param {HTMLElement} button 按钮元素
 */
function loadExample(button) {
  const codeElement = button.parentElement.querySelector("code");
  if (codeElement) {
    const regexInput = document.getElementById("regex-input");
    if (regexInput) {
      regexInput.value = codeElement.textContent;
      Utils.showNotification("正则表达式已加载", "success");
    }
  }
}

/**
 * 复制正则表达式到剪贴板
 * @param {HTMLElement} button 按钮元素
 */
function copyRegex(button) {
  const codeElement = button.parentElement.querySelector("code");
  if (!codeElement) return;

  const text = codeElement.textContent;
  Utils.copyToClipboard(text).then((success) => {
    if (success) {
      // 显示复制成功状态
      const originalText = button.textContent;
      button.textContent = "已复制!";
      button.style.backgroundColor = "#28a745";

      setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = "";
      }, 2000);

      Utils.showNotification("已复制到剪贴板", "success");
    } else {
      Utils.showNotification("复制失败，请手动复制", "error");
    }
  });
}

// 导出到全局作用域
window.RegexGenerator = {
  CONFIG,
  Utils,
  RegexUtils,
};

// 导出全局函数
window.copyRegex = copyRegex;
