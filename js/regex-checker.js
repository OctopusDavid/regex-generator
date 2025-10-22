/**
 * 正则表达式检查器 - JavaScript 功能模块
 */

class RegexChecker {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.setupRealTimeValidation();
  }

  bindEvents() {
    // 验证按钮
    const validateBtn = document.getElementById("validate-regex");
    if (validateBtn) {
      validateBtn.addEventListener("click", () => this.validateRegex());
    }

    // 清空按钮
    const clearBtn = document.getElementById("clear-input");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.clearInput());
    }

    // 测试字符串输入
    const testStringInput = document.getElementById("test-string");
    if (testStringInput) {
      testStringInput.addEventListener("input", () => this.testRegex());
    }
  }

  setupRealTimeValidation() {
    const regexInput = document.getElementById("regex-input");
    if (regexInput) {
      regexInput.addEventListener("input", () => {
        setTimeout(() => this.validateRegex(), 300);
      });
    }
  }

  validateRegex() {
    const regexInput = document.getElementById("regex-input");
    if (!regexInput) return;

    const pattern = regexInput.value.trim();

    if (!pattern) {
      this.updateStatus("ready", "Ready to validate");
      this.clearResults();
      return;
    }

    // 语法验证
    const syntaxResult = this.checkSyntax(pattern);
    this.updateSyntaxResult(syntaxResult);

    // 性能分析
    const performanceResult = this.analyzePerformance(pattern);
    this.updatePerformanceResult(performanceResult);

    // 错误检测
    const errorResult = this.detectErrors(pattern);
    this.updateErrorResult(errorResult);

    // 优化建议
    const optimizationResult = this.getOptimizationTips(pattern);
    this.updateOptimizationResult(optimizationResult);

    // 更新状态
    if (syntaxResult.valid) {
      this.updateStatus("success", "Valid regex pattern");
    } else {
      this.updateStatus("error", "Invalid regex pattern");
    }

    // 如果有测试字符串，也进行测试
    this.testRegex();
  }

  checkSyntax(pattern) {
    try {
      new RegExp(pattern);
      return {
        valid: true,
        message: "Syntax is valid",
      };
    } catch (error) {
      return {
        valid: false,
        message: error.message,
        error: error,
      };
    }
  }

  analyzePerformance(pattern) {
    const analysis = {
      complexity: "simple",
      potentialIssues: [],
      recommendations: [],
    };

    // 分析复杂度
    let complexity = 0;
    if (pattern.includes("*") || pattern.includes("+") || pattern.includes("{"))
      complexity++;
    if (pattern.includes("(") && pattern.includes(")")) complexity++;
    if (pattern.includes("|")) complexity++;
    if (pattern.includes("[") && pattern.includes("]")) complexity++;

    if (complexity <= 1) analysis.complexity = "simple";
    else if (complexity <= 3) analysis.complexity = "medium";
    else analysis.complexity = "complex";

    // 检测潜在问题
    if (pattern.includes(".*")) {
      analysis.potentialIssues.push("Using .* can be inefficient");
      analysis.recommendations.push("Consider using more specific patterns");
    }

    if (pattern.includes("(.*)")) {
      analysis.potentialIssues.push("Greedy quantifier may cause backtracking");
      analysis.recommendations.push(
        "Consider using non-greedy quantifiers (.*?)"
      );
    }

    if (pattern.length > 100) {
      analysis.potentialIssues.push("Very long pattern may impact performance");
      analysis.recommendations.push("Consider breaking into smaller patterns");
    }

    return analysis;
  }

  detectErrors(pattern) {
    const errors = [];
    const warnings = [];

    // 检查常见错误
    if (pattern.includes("[^]")) {
      errors.push("Empty character class negation [^] is invalid");
    }

    if (pattern.includes("[") && !pattern.includes("]")) {
      errors.push("Unclosed character class");
    }

    if (pattern.includes("(") && !pattern.includes(")")) {
      errors.push("Unclosed group");
    }

    if (pattern.includes("{") && !pattern.includes("}")) {
      errors.push("Unclosed quantifier");
    }

    // 检查警告
    if (pattern.includes("\\d\\d\\d\\d")) {
      warnings.push("Consider using \\d{4} instead of \\d\\d\\d\\d");
    }

    return {
      errors,
      warnings,
      hasErrors: errors.length > 0,
      hasWarnings: warnings.length > 0,
    };
  }

  getOptimizationTips(pattern) {
    const tips = [];

    // 性能优化建议
    if (pattern.startsWith(".*")) {
      tips.push("Consider using ^ anchor if matching from start");
    }

    if (pattern.endsWith(".*")) {
      tips.push("Consider using $ anchor if matching to end");
    }

    if (pattern.includes("(a|b|c)")) {
      tips.push("Consider using character class [abc] for single characters");
    }

    if (pattern.includes("\\d+\\d+")) {
      tips.push("Consider combining quantifiers: \\d{2,}");
    }

    // 可读性建议
    if (pattern.length > 50) {
      tips.push("Consider adding comments or breaking into smaller parts");
    }

    if (!pattern.includes("^") && !pattern.includes("$")) {
      tips.push("Consider adding anchors (^$) for exact matching");
    }

    return {
      tips,
      hasTips: tips.length > 0,
    };
  }

  testRegex() {
    const regexInput = document.getElementById("regex-input");
    const testStringInput = document.getElementById("test-string");
    const matchResults = document.getElementById("match-results");

    if (!regexInput || !testStringInput || !matchResults) return;

    const pattern = regexInput.value.trim();
    const testString = testStringInput.value;

    if (!pattern || !testString) {
      matchResults.innerHTML =
        '<div class="no-results">No test string entered</div>';
      return;
    }

    // 验证正则表达式
    const syntaxResult = this.checkSyntax(pattern);
    if (!syntaxResult.valid) {
      matchResults.innerHTML = `<div class="error">Invalid regex: ${syntaxResult.message}</div>`;
      return;
    }

    try {
      const regex = new RegExp(pattern, "g");
      const matches = [];
      let match;
      let matchCount = 0;

      // 重置 lastIndex
      regex.lastIndex = 0;

      while ((match = regex.exec(testString)) !== null) {
        matches.push({
          text: match[0],
          index: match.index,
          groups: match.slice(1),
        });
        matchCount++;

        // 防止无限循环
        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        // 限制匹配数量
        if (matchCount > 100) {
          matches.push({
            text: "... (more matches hidden)",
            index: -1,
            groups: [],
          });
          break;
        }
      }

      this.displayMatchResults(matches, testString);
    } catch (error) {
      matchResults.innerHTML = `<div class="error">Test error: ${error.message}</div>`;
    }
  }

  displayMatchResults(matches, testString) {
    const matchResults = document.getElementById("match-results");

    if (matches.length === 0) {
      matchResults.innerHTML = '<div class="no-results">No matches found</div>';
      return;
    }

    let html = `<div class="match-summary">Found ${matches.length} match(es)</div>`;

    matches.forEach((match, index) => {
      if (match.index === -1) {
        html += `<div class="match-item info">${match.text}</div>`;
      } else {
        html += `
          <div class="match-item">
            <span class="match-index">${index + 1}:</span>
            <span class="match-text">"${this.escapeHtml(match.text)}"</span>
            <span class="match-position">at position ${match.index}</span>
          </div>
        `;
      }
    });

    matchResults.innerHTML = html;
  }

  updateStatus(type, message) {
    const statusPanel = document.getElementById("validation-status");
    if (!statusPanel) return;

    const statusIcon = statusPanel.querySelector(".status-icon");
    const statusText = statusPanel.querySelector(".status-text");

    if (statusIcon && statusText) {
      statusIcon.textContent =
        type === "success" ? "✓" : type === "error" ? "✗" : "○";
      statusText.textContent = message;

      // 更新样式
      statusPanel.className = `status-panel ${type}`;
    }
  }

  updateSyntaxResult(result) {
    const element = document.getElementById("syntax-result");
    if (!element) return;

    if (result.valid) {
      element.innerHTML =
        '<span class="result-text success">✓ Valid syntax</span>';
    } else {
      element.innerHTML = `<span class="result-text error">✗ ${this.escapeHtml(
        result.message
      )}</span>`;
    }
  }

  updatePerformanceResult(result) {
    const element = document.getElementById("performance-result");
    if (!element) return;

    let html = `<span class="result-text">Complexity: <strong>${result.complexity}</strong></span>`;

    if (result.potentialIssues.length > 0) {
      html += '<ul class="issue-list">';
      result.potentialIssues.forEach((issue) => {
        html += `<li class="issue-item">${this.escapeHtml(issue)}</li>`;
      });
      html += "</ul>";
    }

    element.innerHTML = html;
  }

  updateErrorResult(result) {
    const element = document.getElementById("error-result");
    if (!element) return;

    if (result.hasErrors) {
      let html =
        '<span class="result-text error">Errors found:</span><ul class="error-list">';
      result.errors.forEach((error) => {
        html += `<li class="error-item">${this.escapeHtml(error)}</li>`;
      });
      html += "</ul>";
      element.innerHTML = html;
    } else if (result.hasWarnings) {
      let html =
        '<span class="result-text warning">Warnings:</span><ul class="warning-list">';
      result.warnings.forEach((warning) => {
        html += `<li class="warning-item">${this.escapeHtml(warning)}</li>`;
      });
      html += "</ul>";
      element.innerHTML = html;
    } else {
      element.innerHTML =
        '<span class="result-text success">✓ No errors detected</span>';
    }
  }

  updateOptimizationResult(result) {
    const element = document.getElementById("optimization-result");
    if (!element) return;

    if (result.hasTips) {
      let html =
        '<span class="result-text">Suggestions:</span><ul class="tip-list">';
      result.tips.forEach((tip) => {
        html += `<li class="tip-item">${this.escapeHtml(tip)}</li>`;
      });
      html += "</ul>";
      element.innerHTML = html;
    } else {
      element.innerHTML =
        '<span class="result-text">No suggestions available</span>';
    }
  }

  clearResults() {
    const elements = [
      "syntax-result",
      "performance-result",
      "error-result",
      "optimization-result",
    ];

    elements.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.innerHTML =
          '<span class="result-text">No analysis available</span>';
      }
    });

    const matchResults = document.getElementById("match-results");
    if (matchResults) {
      matchResults.innerHTML =
        '<div class="no-results">No test string entered</div>';
    }
  }

  clearInput() {
    const regexInput = document.getElementById("regex-input");
    const testStringInput = document.getElementById("test-string");

    if (regexInput) regexInput.value = "";
    if (testStringInput) testStringInput.value = "";

    this.updateStatus("ready", "Ready to validate");
    this.clearResults();
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// 页面加载完成后初始化
document.addEventListener("DOMContentLoaded", function () {
  new RegexChecker();
});
