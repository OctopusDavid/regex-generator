/**
 * 正则表达式构建器 - JavaScript 功能模块
 * 提供可视化正则表达式构建功能
 */

class RegexBuilder {
  constructor() {
    this.pattern = "";
    this.flags = "g";
    this.components = [];
    this.draggedElement = null;
    this.dragOverElement = null;
    this.history = [];
    this.historyIndex = -1;
    this.init();
  }

  init() {
    this.bindEvents();
    this.initializeBuilder();
    this.setupDragAndDrop();
  }

  bindEvents() {
    // 构建器组件按钮
    const componentButtons = document.querySelectorAll(".component-btn");
    componentButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const component = e.target.getAttribute("data-component");
        this.addComponent(component);
      });
    });

    // 预设模式按钮
    const presetButtons = document.querySelectorAll(".preset-btn");
    presetButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const preset = e.target.getAttribute("data-preset");
        this.loadPreset(preset);
      });
    });

    // 清空画布按钮
    const clearCanvasBtn = document.getElementById("clear-canvas");
    if (clearCanvasBtn) {
      clearCanvasBtn.addEventListener("click", () => this.clearBuilder());
    }

    // 撤销按钮
    const undoBtn = document.getElementById("undo-action");
    if (undoBtn) {
      undoBtn.addEventListener("click", () => this.undo());
    }

    // 重做按钮
    const redoBtn = document.getElementById("redo-action");
    if (redoBtn) {
      redoBtn.addEventListener("click", () => this.redo());
    }

    // 复制按钮
    const copyBtn = document.getElementById("copy-regex");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => this.copyPattern());
    }

    // 测试文本变化
    const testText = document.getElementById("test-text");
    if (testText) {
      testText.addEventListener("input", () => this.testPattern());
    }
  }

  initializeBuilder() {
    this.updatePatternDisplay();
    this.updateFlags();
    this.updateHistory();
  }

  setupDragAndDrop() {
    // 设置组件按钮为可拖拽
    const componentButtons = document.querySelectorAll(".component-btn");
    componentButtons.forEach((btn) => {
      btn.draggable = true;
      btn.addEventListener("dragstart", (e) => {
        this.draggedElement = e.target;
        e.dataTransfer.effectAllowed = "copy";
        e.dataTransfer.setData(
          "text/plain",
          e.target.getAttribute("data-component")
        );
        e.target.classList.add("dragging");
      });

      btn.addEventListener("dragend", (e) => {
        e.target.classList.remove("dragging");
        this.draggedElement = null;
      });
    });

    // 设置画布为拖放目标
    const canvas = document.getElementById("regex-canvas");
    if (canvas) {
      canvas.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        canvas.classList.add("drag-over");
      });

      canvas.addEventListener("dragleave", (e) => {
        if (!canvas.contains(e.relatedTarget)) {
          canvas.classList.remove("drag-over");
        }
      });

      canvas.addEventListener("drop", (e) => {
        e.preventDefault();
        canvas.classList.remove("drag-over");

        const componentType = e.dataTransfer.getData("text/plain");
        if (componentType) {
          this.addComponent(componentType);
        }
      });
    }

    // 设置已添加的组件为可拖拽排序
    this.setupComponentDragAndDrop();
  }

  setupComponentDragAndDrop() {
    const canvas = document.getElementById("regex-canvas");
    if (!canvas) return;

    // 为已添加的组件添加拖拽功能
    const components = canvas.querySelectorAll(".regex-component");
    components.forEach((component, index) => {
      component.draggable = true;
      component.setAttribute("data-index", index);

      component.addEventListener("dragstart", (e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData(
          "text/plain",
          component.getAttribute("data-index")
        );
        component.classList.add("dragging");
      });

      component.addEventListener("dragend", (e) => {
        component.classList.remove("dragging");
      });

      component.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        component.classList.add("drag-over");
      });

      component.addEventListener("dragleave", (e) => {
        component.classList.remove("drag-over");
      });

      component.addEventListener("drop", (e) => {
        e.preventDefault();
        component.classList.remove("drag-over");

        const draggedIndex = parseInt(e.dataTransfer.getData("text/plain"));
        const targetIndex = parseInt(component.getAttribute("data-index"));

        if (draggedIndex !== targetIndex) {
          this.moveComponent(draggedIndex, targetIndex);
        }
      });
    });
  }

  addComponent(type) {
    const component = this.createComponent(type);
    this.components.push(component);
    this.saveToHistory();
    this.updatePatternDisplay();
    this.updateBuilderDisplay();
    this.setupComponentDragAndDrop();
  }

  moveComponent(fromIndex, toIndex) {
    if (fromIndex === toIndex) return;

    const component = this.components.splice(fromIndex, 1)[0];
    this.components.splice(toIndex, 0, component);

    this.saveToHistory();
    this.updatePatternDisplay();
    this.updateBuilderDisplay();
    this.setupComponentDragAndDrop();
  }

  removeComponent(id) {
    const index = this.components.findIndex((comp) => comp.id === id);
    if (index !== -1) {
      this.components.splice(index, 1);
      this.saveToHistory();
    this.updatePatternDisplay();
    this.updateBuilderDisplay();
      this.setupComponentDragAndDrop();
    }
  }

  createComponent(type) {
    const components = {
      word: { pattern: "\\w+", description: "Word" },
      digit: { pattern: "\\d", description: "Digit (0-9)" },
      space: { pattern: "\\s", description: "Whitespace" },
      any: { pattern: ".", description: "Any character" },
      "zero-or-more": { pattern: "*", description: "Zero or more" },
      "one-or-more": { pattern: "+", description: "One or more" },
      "zero-or-one": { pattern: "?", description: "Zero or one" },
      exact: { pattern: "{1}", description: "Exact count" },
      group: { pattern: "()", description: "Group" },
      "non-capture": { pattern: "(?:)", description: "Non-capture group" },
      lookahead: { pattern: "(?=)", description: "Positive lookahead" },
      "start-anchor": { pattern: "^", description: "Start of string" },
      "end-anchor": { pattern: "$", description: "End of string" },
      "word-boundary": { pattern: "\\b", description: "Word boundary" },
      "character-class": { pattern: "[]", description: "Character class" },
      alternation: { pattern: "|", description: "Alternation (OR)" },
    };

    return {
      type: type,
      pattern: components[type]?.pattern || "",
      description: components[type]?.description || "",
      id: Date.now() + Math.random(),
    };
  }

  updatePatternDisplay() {
      this.pattern = this.components.map((comp) => comp.pattern).join("");

    // 更新输出区域的文本
    const regexOutput = document.getElementById("regex-output");
    if (regexOutput) {
      regexOutput.value = this.pattern || "";
    }

    // 更新测试结果
    this.testPattern();
  }

  updateBuilderDisplay() {
    const canvas = document.getElementById("regex-canvas");
    if (!canvas) return;

    if (this.components.length === 0) {
      canvas.innerHTML =
        '<div class="canvas-placeholder">Drag components here to build your regex pattern</div>';
      return;
    }

    let html = "";
    this.components.forEach((component, index) => {
      html += `
        <div class="regex-component" data-id="${
          component.id
        }" data-index="${index}">
          <span class="component-pattern">${this.escapeHtml(
            component.pattern
          )}</span>
          <span class="component-description">${component.description}</span>
          <button class="remove-component" onclick="regexBuilder.removeComponent('${
            component.id
          }')">×</button>
        </div>
      `;
    });

    canvas.innerHTML = html;
  }

  // 历史记录功能
  saveToHistory() {
    const state = {
      components: [...this.components],
      pattern: this.pattern,
    };

    // 移除当前位置之后的历史记录
    this.history = this.history.slice(0, this.historyIndex + 1);
    this.history.push(state);
    this.historyIndex++;

    // 限制历史记录数量
    if (this.history.length > 50) {
      this.history.shift();
      this.historyIndex--;
    }

    this.updateHistory();
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      const state = this.history[this.historyIndex];
      this.components = [...state.components];
      this.pattern = state.pattern;
      this.updatePatternDisplay();
      this.updateBuilderDisplay();
      this.setupComponentDragAndDrop();
      this.updateHistory();
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      const state = this.history[this.historyIndex];
      this.components = [...state.components];
      this.pattern = state.pattern;
      this.updatePatternDisplay();
      this.updateBuilderDisplay();
      this.setupComponentDragAndDrop();
      this.updateHistory();
    }
  }

  updateHistory() {
    const undoBtn = document.getElementById("undo-action");
    const redoBtn = document.getElementById("redo-action");

    if (undoBtn) {
      undoBtn.disabled = this.historyIndex <= 0;
    }
    if (redoBtn) {
      redoBtn.disabled = this.historyIndex >= this.history.length - 1;
    }
  }

  // 预设模式功能
  loadPreset(preset) {
    const presets = {
      email: [
        { type: "start-anchor", pattern: "^", description: "Start of string" },
        {
          type: "word",
          pattern: "[a-zA-Z0-9._%+-]+",
          description: "Email local part",
        },
        { type: "literal", pattern: "@", description: "At symbol" },
        { type: "word", pattern: "[a-zA-Z0-9.-]+", description: "Domain name" },
        { type: "literal", pattern: "\\.", description: "Dot" },
        {
          type: "word",
          pattern: "[a-zA-Z]{2,}",
          description: "Top level domain",
        },
        { type: "end-anchor", pattern: "$", description: "End of string" },
      ],
      phone: [
        { type: "start-anchor", pattern: "^", description: "Start of string" },
        { type: "literal", pattern: "1", description: "Country code" },
        { type: "digit", pattern: "[3-9]", description: "First digit" },
        { type: "digit", pattern: "\\d{9}", description: "Remaining digits" },
        { type: "end-anchor", pattern: "$", description: "End of string" },
      ],
      url: [
        { type: "start-anchor", pattern: "^", description: "Start of string" },
        { type: "literal", pattern: "https?://", description: "Protocol" },
        { type: "word", pattern: "[a-zA-Z0-9.-]+", description: "Domain" },
        { type: "literal", pattern: "\\.[a-zA-Z]{2,}", description: "TLD" },
        { type: "any", pattern: ".*", description: "Path" },
        { type: "end-anchor", pattern: "$", description: "End of string" },
      ],
      date: [
        { type: "start-anchor", pattern: "^", description: "Start of string" },
        { type: "digit", pattern: "\\d{4}", description: "Year" },
        { type: "literal", pattern: "-", description: "Separator" },
        { type: "digit", pattern: "\\d{2}", description: "Month" },
        { type: "literal", pattern: "-", description: "Separator" },
        { type: "digit", pattern: "\\d{2}", description: "Day" },
        { type: "end-anchor", pattern: "$", description: "End of string" },
      ],
    };

    const presetComponents = presets[preset];
    if (presetComponents) {
      this.components = presetComponents.map((comp) => ({
        ...comp,
        id: Date.now() + Math.random(),
      }));
      this.saveToHistory();
    this.updatePatternDisplay();
    this.updateBuilderDisplay();
      this.setupComponentDragAndDrop();
    }
  }

  updateFlags() {
    const flagCheckboxes = document.querySelectorAll(".flag-checkbox");
    this.flags = "";

    flagCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        this.flags += checkbox.value;
      }
    });

    this.updatePreview();
  }

  updatePreview() {
    const previewElement = document.getElementById("pattern-preview");
    if (!previewElement) return;

    if (!this.pattern) {
      previewElement.innerHTML =
        '<div class="no-pattern">No pattern to preview</div>';
      return;
    }

    try {
      const regex = new RegExp(this.pattern, this.flags);
      previewElement.innerHTML = `
        <div class="preview-success">
          <strong>Pattern:</strong> <code>${this.escapeHtml(
            this.pattern
          )}</code><br>
          <strong>Flags:</strong> <code>${this.flags || "none"}</code><br>
          <strong>Status:</strong> <span class="valid">✓ Valid</span>
        </div>
      `;
    } catch (error) {
      previewElement.innerHTML = `
        <div class="preview-error">
          <strong>Pattern:</strong> <code>${this.escapeHtml(
            this.pattern
          )}</code><br>
          <strong>Error:</strong> <span class="error">${this.escapeHtml(
            error.message
          )}</span>
        </div>
      `;
    }
  }

  testPattern() {
    const testInput = document.getElementById("test-text");
    const testResults = document.getElementById("match-results");

    if (!testInput || !testResults) return;

    const testString = testInput.value;

    if (!this.pattern) {
      testResults.innerHTML =
        '<div class="no-pattern">No pattern to test</div>';
      return;
    }

    if (!testString) {
      testResults.innerHTML = '<div class="no-test">Enter test string</div>';
      return;
    }

    try {
      const regex = new RegExp(this.pattern, this.flags);
      const matches = [];
      let match;
      let matchCount = 0;

      regex.lastIndex = 0;
      while ((match = regex.exec(testString)) !== null) {
        matches.push({
          text: match[0],
          index: match.index,
          groups: match.slice(1),
        });
        matchCount++;

        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        if (matchCount > 50) break;
      }

      this.displayTestResults(matches, testString);
    } catch (error) {
      testResults.innerHTML = `<div class="test-error">Error: ${this.escapeHtml(
        error.message
      )}</div>`;
    }
  }

  displayTestResults(matches, testString) {
    const testResults = document.getElementById("match-results");

    if (matches.length === 0) {
      testResults.innerHTML = '<div class="no-matches">No matches found</div>';
      return;
    }

    let html = `<div class="match-summary">Found ${matches.length} match(es)</div>`;

    matches.forEach((match, index) => {
      html += `
        <div class="match-item">
          <span class="match-index">${index + 1}:</span>
          <span class="match-text">"${this.escapeHtml(match.text)}"</span>
          <span class="match-position">at position ${match.index}</span>
        </div>
      `;
    });

    testResults.innerHTML = html;
  }

  copyPattern() {
    if (!this.pattern) {
      this.showNotification("No pattern to copy", "warning");
      return;
    }

    const text = this.pattern;
    this.copyToClipboard(text).then((success) => {
      if (success) {
        this.showNotification("Pattern copied to clipboard", "success");
      } else {
        this.showNotification("Failed to copy pattern", "error");
      }
    });
  }

  clearBuilder() {
    this.components = [];
    this.pattern = "";
    this.updatePatternDisplay();
    this.updateBuilderDisplay();

    const testInput = document.getElementById("test-input");
    const testResults = document.getElementById("test-results");
    if (testInput) testInput.value = "";
    if (testResults)
      testResults.innerHTML = '<div class="no-test">Enter test string</div>';
  }

  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
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
      console.error("Copy failed:", err);
      return false;
    }
  }

  showNotification(message, type = "info") {
    if (window.RegexGenerator?.Utils?.showNotification) {
      window.RegexGenerator.Utils.showNotification(message, type);
    } else {
      // 简单的通知实现
      const notification = document.createElement("div");
      notification.className = `notification notification-${type}`;
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 6px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        word-wrap: break-word;
      `;

      const colors = {
        success: "#27ae60",
        error: "#e74c3c",
        warning: "#f39c12",
        info: "#3498db",
      };
      notification.style.backgroundColor = colors[type] || colors.info;

      document.body.appendChild(notification);

      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
    }
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// 全局实例
let regexBuilder;

// 页面加载完成后初始化
document.addEventListener("DOMContentLoaded", function () {
  regexBuilder = new RegexBuilder();
});
