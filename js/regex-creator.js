/**
 * 正则表达式生成器 - 生成器功能模块
 */

// 检测当前页面语言
const getCurrentLanguage = () => {
  return document.documentElement.lang || "zh-CN";
};

// 多语言配置
const translations = {
  "zh-CN": {
    emailConfig: {
      title: "邮箱地址配置",
      allowInternational: "允许国际域名",
      allowInternationalDesc: "支持国际化域名格式",
      allowSubdomains: "允许子域名",
      allowSubdomainsDesc: "支持多级子域名",
    },
    phoneConfig: {
      title: "手机号码配置",
      country: "国家/地区",
      china: "中国大陆",
      usa: "美国",
      uk: "英国",
      allowSpaces: "允许空格分隔",
      allowSpacesDesc: "如：138 1234 5678",
    },
    idcardConfig: {
      title: "身份证号配置",
      allowX: "允许X结尾",
      allowXDesc: "支持身份证号最后一位为X",
      strictLength: "严格长度检查",
      strictLengthDesc: "必须为18位",
    },
    urlConfig: {
      title: "URL链接配置",
      protocol: "协议要求",
      bothProtocol: "HTTP和HTTPS",
      httpsOnly: "仅HTTPS",
      httpOnly: "仅HTTP",
      allowSubdomains: "允许子域名",
      allowSubdomainsDesc: "支持www等子域名",
    },
    ipConfig: {
      title: "IP地址配置",
      version: "IP版本",
      ipv4: "IPv4",
      ipv6: "IPv6",
      bothIp: "IPv4和IPv6",
    },
    dateConfig: {
      title: "日期格式配置",
      format: "日期格式",
      yyyyMmDd: "YYYY-MM-DD",
      mmDdYyyy: "MM/DD/YYYY",
      ddMmYyyy: "DD/MM/YYYY",
      separator: "分隔符",
      hyphen: "连字符 (-)",
      slash: "斜杠 (/)",
      dot: "点号 (.)",
    },
    numberConfig: {
      title: "数字格式配置",
      allowDecimals: "允许小数",
      allowDecimalsDesc: "支持小数点",
      allowNegative: "允许负数",
      allowNegativeDesc: "支持负号",
      minLength: "最小长度",
      minLengthDesc: "数字最小位数",
      maxLength: "最大长度",
      maxLengthDesc: "数字最大位数",
    },
    customConfig: {
      title: "自定义配置",
      pattern: "自定义模式",
      patternDesc:
        "输入自定义正则表达式模式，支持所有正则表达式语法。例如：^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      patternPlaceholder:
        "请输入您的正则表达式模式...\n\n示例：\n• 邮箱: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\n• 手机号: ^1[3-9]\\d{9}$\n• 身份证: ^\\d{17}[\\dXx]$",
    },
    common: {
      config: "配置",
      inputCustomPattern: "输入自定义模式...",
      regexSyntaxCorrect: "✓ 正则表达式语法正确",
      regexSyntaxError: "✗ 正则表达式错误:",
      regexCopied: "正则表达式已复制到剪贴板",
      copyFailed: "复制失败，请手动复制",
      foundMatches: "找到 {count} 个匹配：",
      noMatches: "未找到匹配项",
      regexError: "正则表达式错误:",
      position: "位置:",
    },
  },
  en: {
    emailConfig: {
      title: "Email Address Configuration",
      allowInternational: "Allow International Domains",
      allowInternationalDesc: "Support international domain formats",
      allowSubdomains: "Allow Subdomains",
      allowSubdomainsDesc: "Support multi-level subdomains",
    },
    phoneConfig: {
      title: "Phone Number Configuration",
      country: "Country/Region",
      china: "China Mainland",
      usa: "United States",
      uk: "United Kingdom",
      allowSpaces: "Allow Space Separation",
      allowSpacesDesc: "e.g.: 138 1234 5678",
    },
    idcardConfig: {
      title: "ID Card Configuration",
      allowX: "Allow X Ending",
      allowXDesc: "Support X as the last digit of ID card",
      strictLength: "Strict Length Check",
      strictLengthDesc: "Must be 18 digits",
    },
    urlConfig: {
      title: "URL Link Configuration",
      protocol: "Protocol Requirement",
      bothProtocol: "HTTP and HTTPS",
      httpsOnly: "HTTPS Only",
      httpOnly: "HTTP Only",
      allowSubdomains: "Allow Subdomains",
      allowSubdomainsDesc: "Support www and other subdomains",
    },
    ipConfig: {
      title: "IP Address Configuration",
      version: "IP Version",
      ipv4: "IPv4",
      ipv6: "IPv6",
      bothIp: "IPv4 and IPv6",
    },
    dateConfig: {
      title: "Date Format Configuration",
      format: "Date Format",
      yyyyMmDd: "YYYY-MM-DD",
      mmDdYyyy: "MM/DD/YYYY",
      ddMmYyyy: "DD/MM/YYYY",
      separator: "Separator",
      hyphen: "Hyphen (-)",
      slash: "Slash (/)",
      dot: "Dot (.)",
    },
    numberConfig: {
      title: "Number Format Configuration",
      allowDecimals: "Allow Decimals",
      allowDecimalsDesc: "Support decimal points",
      allowNegative: "Allow Negative Numbers",
      allowNegativeDesc: "Support negative sign",
      minLength: "Minimum Length",
      minLengthDesc: "Minimum number of digits",
      maxLength: "Maximum Length",
      maxLengthDesc: "Maximum number of digits",
    },
    customConfig: {
      title: "Custom Configuration",
      pattern: "Custom Pattern",
      patternDesc:
        "Enter custom regular expression pattern, supports all regex syntax. Example: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      patternPlaceholder:
        "Please enter your regular expression pattern...\n\nExamples:\n• Email: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\n• Phone: ^1[3-9]\\d{9}$\n• ID Card: ^\\d{17}[\\dXx]$",
    },
    common: {
      config: "Configuration",
      inputCustomPattern: "Enter custom pattern...",
      regexSyntaxCorrect: "✓ Regular expression syntax is correct",
      regexSyntaxError: "✗ Regular expression error:",
      regexCopied: "Regular expression copied to clipboard",
      copyFailed: "Copy failed, please copy manually",
      foundMatches: "Found {count} match(es):",
      noMatches: "No matches found",
      regexError: "Regular expression error:",
      position: "Position:",
    },
  },
  de: {
    emailConfig: {
      title: "E-Mail-Adresse Konfiguration",
      allowInternational: "Internationale Domains erlauben",
      allowInternationalDesc: "Unterstützung für internationale Domain-Formate",
      allowSubdomains: "Subdomains erlauben",
      allowSubdomainsDesc: "Unterstützung für mehrstufige Subdomains",
    },
    phoneConfig: {
      title: "Telefonnummer Konfiguration",
      country: "Land/Region",
      china: "China Festland",
      usa: "Vereinigte Staaten",
      uk: "Vereinigtes Königreich",
      allowSpaces: "Leerzeichen-Trennung erlauben",
      allowSpacesDesc: "z.B.: 138 1234 5678",
    },
    idcardConfig: {
      title: "Personalausweis Konfiguration",
      allowX: "X-Ende erlauben",
      allowXDesc: "Unterstützung für X als letzte Ziffer des Personalausweises",
      strictLength: "Strenge Längenprüfung",
      strictLengthDesc: "Muss 18 Ziffern haben",
    },
    urlConfig: {
      title: "URL-Link Konfiguration",
      protocol: "Protokoll-Anforderung",
      bothProtocol: "HTTP und HTTPS",
      httpsOnly: "Nur HTTPS",
      httpOnly: "Nur HTTP",
      allowSubdomains: "Subdomains erlauben",
      allowSubdomainsDesc: "Unterstützung für www und andere Subdomains",
    },
    ipConfig: {
      title: "IP-Adresse Konfiguration",
      version: "IP-Version",
      ipv4: "IPv4",
      ipv6: "IPv6",
      bothIp: "IPv4 und IPv6",
    },
    dateConfig: {
      title: "Datumsformat Konfiguration",
      format: "Datumsformat",
      yyyyMmDd: "YYYY-MM-DD",
      mmDdYyyy: "MM/DD/YYYY",
      ddMmYyyy: "DD/MM/YYYY",
      separator: "Trennzeichen",
      hyphen: "Bindestrich (-)",
      slash: "Schrägstrich (/)",
      dot: "Punkt (.)",
    },
    numberConfig: {
      title: "Zahlenformat Konfiguration",
      allowDecimals: "Dezimalzahlen erlauben",
      allowDecimalsDesc: "Unterstützung für Dezimalpunkte",
      allowNegative: "Negative Zahlen erlauben",
      allowNegativeDesc: "Unterstützung für Minuszeichen",
      minLength: "Mindestlänge",
      minLengthDesc: "Mindestanzahl der Ziffern",
      maxLength: "Maximale Länge",
      maxLengthDesc: "Maximale Anzahl der Ziffern",
    },
    customConfig: {
      title: "Benutzerdefinierte Konfiguration",
      pattern: "Benutzerdefiniertes Muster",
      patternDesc:
        "Geben Sie ein benutzerdefiniertes reguläres Ausdrucksmuster ein, unterstützt alle Regex-Syntax. Beispiel: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      patternPlaceholder:
        "Bitte geben Sie Ihr reguläres Ausdrucksmuster ein...\n\nBeispiele:\n• E-Mail: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\n• Telefon: ^1[3-9]\\d{9}$\n• Personalausweis: ^\\d{17}[\\dXx]$",
    },
    common: {
      config: "Konfiguration",
      inputCustomPattern: "Benutzerdefiniertes Muster eingeben...",
      regexSyntaxCorrect: "✓ Regulärer Ausdruck Syntax ist korrekt",
      regexSyntaxError: "✗ Regulärer Ausdruck Fehler:",
      regexCopied: "Regulärer Ausdruck in die Zwischenablage kopiert",
      copyFailed: "Kopieren fehlgeschlagen, bitte manuell kopieren",
      foundMatches: "{count} Übereinstimmung(en) gefunden:",
      noMatches: "Keine Übereinstimmungen gefunden",
      regexError: "Regulärer Ausdruck Fehler:",
      position: "Position:",
    },
  },
  es: {
    emailConfig: {
      title: "Configuración de Dirección de Email",
      allowInternational: "Permitir Dominios Internacionales",
      allowInternationalDesc:
        "Soporte para formatos de dominio internacionales",
      allowSubdomains: "Permitir Subdominios",
      allowSubdomainsDesc: "Soporte para subdominios multinivel",
    },
    phoneConfig: {
      title: "Configuración de Número de Teléfono",
      country: "País/Región",
      china: "China Continental",
      usa: "Estados Unidos",
      uk: "Reino Unido",
      allowSpaces: "Permitir Separación por Espacios",
      allowSpacesDesc: "ej.: 138 1234 5678",
    },
    idcardConfig: {
      title: "Configuración de Cédula de Identidad",
      allowX: "Permitir Terminación en X",
      allowXDesc: "Soporte para X como último dígito de la cédula",
      strictLength: "Verificación Estricta de Longitud",
      strictLengthDesc: "Debe tener 18 dígitos",
    },
    urlConfig: {
      title: "Configuración de Enlace URL",
      protocol: "Requisito de Protocolo",
      bothProtocol: "HTTP y HTTPS",
      httpsOnly: "Solo HTTPS",
      httpOnly: "Solo HTTP",
      allowSubdomains: "Permitir Subdominios",
      allowSubdomainsDesc: "Soporte para www y otros subdominios",
    },
    ipConfig: {
      title: "Configuración de Dirección IP",
      version: "Versión IP",
      ipv4: "IPv4",
      ipv6: "IPv6",
      bothIp: "IPv4 e IPv6",
    },
    dateConfig: {
      title: "Configuración de Formato de Fecha",
      format: "Formato de Fecha",
      yyyyMmDd: "YYYY-MM-DD",
      mmDdYyyy: "MM/DD/YYYY",
      ddMmYyyy: "DD/MM/YYYY",
      separator: "Separador",
      hyphen: "Guión (-)",
      slash: "Barra (/)",
      dot: "Punto (.)",
    },
    numberConfig: {
      title: "Configuración de Formato de Número",
      allowDecimals: "Permitir Decimales",
      allowDecimalsDesc: "Soporte para puntos decimales",
      allowNegative: "Permitir Números Negativos",
      allowNegativeDesc: "Soporte para signo negativo",
      minLength: "Longitud Mínima",
      minLengthDesc: "Número mínimo de dígitos",
      maxLength: "Longitud Máxima",
      maxLengthDesc: "Número máximo de dígitos",
    },
    customConfig: {
      title: "Configuración Personalizada",
      pattern: "Patrón Personalizado",
      patternDesc:
        "Ingrese un patrón de expresión regular personalizado, soporta toda la sintaxis regex. Ejemplo: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      patternPlaceholder:
        "Por favor ingrese su patrón de expresión regular...\n\nEjemplos:\n• Email: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\n• Teléfono: ^1[3-9]\\d{9}$\n• Cédula: ^\\d{17}[\\dXx]$",
    },
    common: {
      config: "Configuración",
      inputCustomPattern: "Ingresar patrón personalizado...",
      regexSyntaxCorrect: "✓ La sintaxis de expresión regular es correcta",
      regexSyntaxError: "✗ Error de expresión regular:",
      regexCopied: "Expresión regular copiada al portapapeles",
      copyFailed: "Error al copiar, por favor copie manualmente",
      foundMatches: "Se encontraron {count} coincidencia(s):",
      noMatches: "No se encontraron coincidencias",
      regexError: "Error de expresión regular:",
      position: "Posición:",
    },
  },
  fr: {
    emailConfig: {
      title: "Configuration d'Adresse Email",
      allowInternational: "Autoriser les Domaines Internationaux",
      allowInternationalDesc: "Support des formats de domaine internationaux",
      allowSubdomains: "Autoriser les Sous-domaines",
      allowSubdomainsDesc: "Support des sous-domaines multi-niveaux",
    },
    phoneConfig: {
      title: "Configuration de Numéro de Téléphone",
      country: "Pays/Région",
      china: "Chine Continentale",
      usa: "États-Unis",
      uk: "Royaume-Uni",
      allowSpaces: "Autoriser la Séparation par Espaces",
      allowSpacesDesc: "ex.: 138 1234 5678",
    },
    idcardConfig: {
      title: "Configuration de Carte d'Identité",
      allowX: "Autoriser la Fin en X",
      allowXDesc: "Support de X comme dernier chiffre de la carte d'identité",
      strictLength: "Vérification Stricte de Longueur",
      strictLengthDesc: "Doit avoir 18 chiffres",
    },
    urlConfig: {
      title: "Configuration de Lien URL",
      protocol: "Exigence de Protocole",
      bothProtocol: "HTTP et HTTPS",
      httpsOnly: "HTTPS Seulement",
      httpOnly: "HTTP Seulement",
      allowSubdomains: "Autoriser les Sous-domaines",
      allowSubdomainsDesc: "Support de www et autres sous-domaines",
    },
    ipConfig: {
      title: "Configuration d'Adresse IP",
      version: "Version IP",
      ipv4: "IPv4",
      ipv6: "IPv6",
      bothIp: "IPv4 et IPv6",
    },
    dateConfig: {
      title: "Configuration de Format de Date",
      format: "Format de Date",
      yyyyMmDd: "YYYY-MM-DD",
      mmDdYyyy: "MM/DD/YYYY",
      ddMmYyyy: "DD/MM/YYYY",
      separator: "Séparateur",
      hyphen: "Trait d'union (-)",
      slash: "Barre oblique (/)",
      dot: "Point (.)",
    },
    numberConfig: {
      title: "Configuration de Format de Nombre",
      allowDecimals: "Autoriser les Décimales",
      allowDecimalsDesc: "Support des points décimaux",
      allowNegative: "Autoriser les Nombres Négatifs",
      allowNegativeDesc: "Support du signe négatif",
      minLength: "Longueur Minimale",
      minLengthDesc: "Nombre minimum de chiffres",
      maxLength: "Longueur Maximale",
      maxLengthDesc: "Nombre maximum de chiffres",
    },
    customConfig: {
      title: "Configuration Personnalisée",
      pattern: "Modèle Personnalisé",
      patternDesc:
        "Entrez un modèle d'expression régulière personnalisé, prend en charge toute la syntaxe regex. Exemple: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      patternPlaceholder:
        "Veuillez entrer votre modèle d'expression régulière...\n\nExemples:\n• Email: ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\n• Téléphone: ^1[3-9]\\d{9}$\n• Carte d'identité: ^\\d{17}[\\dXx]$",
    },
    common: {
      config: "Configuration",
      inputCustomPattern: "Entrer un modèle personnalisé...",
      regexSyntaxCorrect: "✓ La syntaxe d'expression régulière est correcte",
      regexSyntaxError: "✗ Erreur d'expression régulière:",
      regexCopied: "Expression régulière copiée dans le presse-papiers",
      copyFailed: "Échec de la copie, veuillez copier manuellement",
      foundMatches: "{count} correspondance(s) trouvée(s):",
      noMatches: "Aucune correspondance trouvée",
      regexError: "Erreur d'expression régulière:",
      position: "Position:",
    },
  },
};

// 获取本地化文本的函数
const getLocalizedText = (category, key, params = {}) => {
  const lang = getCurrentLanguage();
  let text =
    translations[lang]?.[category]?.[key] ||
    translations["zh-CN"][category]?.[key] ||
    key;

  // 替换参数占位符
  Object.keys(params).forEach((param) => {
    text = text.replace(`{${param}}`, params[param]);
  });

  return text;
};

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
        title: getLocalizedText("emailConfig", "title"),
        options: [
          {
            name: "allowInternational",
            label: getLocalizedText("emailConfig", "allowInternational"),
            type: "checkbox",
            value: true,
            description: getLocalizedText(
              "emailConfig",
              "allowInternationalDesc"
            ),
          },
          {
            name: "allowSubdomains",
            label: getLocalizedText("emailConfig", "allowSubdomains"),
            type: "checkbox",
            value: true,
            description: getLocalizedText("emailConfig", "allowSubdomainsDesc"),
          },
        ],
      },
      phone: {
        title: getLocalizedText("phoneConfig", "title"),
        options: [
          {
            name: "country",
            label: getLocalizedText("phoneConfig", "country"),
            type: "select",
            value: "CN",
            options: [
              { value: "CN", label: getLocalizedText("phoneConfig", "china") },
              { value: "US", label: getLocalizedText("phoneConfig", "usa") },
              { value: "UK", label: getLocalizedText("phoneConfig", "uk") },
            ],
          },
          {
            name: "allowSpaces",
            label: getLocalizedText("phoneConfig", "allowSpaces"),
            type: "checkbox",
            value: false,
            description: getLocalizedText("phoneConfig", "allowSpacesDesc"),
          },
        ],
      },
      idcard: {
        title: getLocalizedText("idcardConfig", "title"),
        options: [
          {
            name: "allowX",
            label: getLocalizedText("idcardConfig", "allowX"),
            type: "checkbox",
            value: true,
            description: getLocalizedText("idcardConfig", "allowXDesc"),
          },
          {
            name: "strictLength",
            label: getLocalizedText("idcardConfig", "strictLength"),
            type: "checkbox",
            value: true,
            description: getLocalizedText("idcardConfig", "strictLengthDesc"),
          },
        ],
      },
      url: {
        title: getLocalizedText("urlConfig", "title"),
        options: [
          {
            name: "protocol",
            label: getLocalizedText("urlConfig", "protocol"),
            type: "select",
            value: "both",
            options: [
              {
                value: "both",
                label: getLocalizedText("urlConfig", "bothProtocol"),
              },
              {
                value: "https",
                label: getLocalizedText("urlConfig", "httpsOnly"),
              },
              {
                value: "http",
                label: getLocalizedText("urlConfig", "httpOnly"),
              },
            ],
          },
          {
            name: "allowSubdomains",
            label: getLocalizedText("urlConfig", "allowSubdomains"),
            type: "checkbox",
            value: true,
            description: getLocalizedText("urlConfig", "allowSubdomainsDesc"),
          },
        ],
      },
      ip: {
        title: getLocalizedText("ipConfig", "title"),
        options: [
          {
            name: "version",
            label: getLocalizedText("ipConfig", "version"),
            type: "select",
            value: "v4",
            options: [
              { value: "v4", label: getLocalizedText("ipConfig", "ipv4") },
              { value: "v6", label: getLocalizedText("ipConfig", "ipv6") },
              { value: "both", label: getLocalizedText("ipConfig", "bothIp") },
            ],
          },
        ],
      },
      date: {
        title: getLocalizedText("dateConfig", "title"),
        options: [
          {
            name: "format",
            label: getLocalizedText("dateConfig", "format"),
            type: "select",
            value: "YYYY-MM-DD",
            options: [
              {
                value: "YYYY-MM-DD",
                label: getLocalizedText("dateConfig", "yyyyMmDd"),
              },
              {
                value: "MM/DD/YYYY",
                label: getLocalizedText("dateConfig", "mmDdYyyy"),
              },
              {
                value: "DD/MM/YYYY",
                label: getLocalizedText("dateConfig", "ddMmYyyy"),
              },
            ],
          },
          {
            name: "separator",
            label: getLocalizedText("dateConfig", "separator"),
            type: "select",
            value: "-",
            options: [
              { value: "-", label: getLocalizedText("dateConfig", "hyphen") },
              { value: "/", label: getLocalizedText("dateConfig", "slash") },
              { value: ".", label: getLocalizedText("dateConfig", "dot") },
            ],
          },
        ],
      },
      number: {
        title: getLocalizedText("numberConfig", "title"),
        options: [
          {
            name: "allowDecimals",
            label: getLocalizedText("numberConfig", "allowDecimals"),
            type: "checkbox",
            value: true,
            description: getLocalizedText("numberConfig", "allowDecimalsDesc"),
          },
          {
            name: "allowNegative",
            label: getLocalizedText("numberConfig", "allowNegative"),
            type: "checkbox",
            value: false,
            description: getLocalizedText("numberConfig", "allowNegativeDesc"),
          },
          {
            name: "minLength",
            label: getLocalizedText("numberConfig", "minLength"),
            type: "number",
            value: 1,
            description: getLocalizedText("numberConfig", "minLengthDesc"),
          },
          {
            name: "maxLength",
            label: getLocalizedText("numberConfig", "maxLength"),
            type: "number",
            value: 10,
            description: getLocalizedText("numberConfig", "maxLengthDesc"),
          },
        ],
      },
      custom: {
        title: getLocalizedText("customConfig", "title"),
        options: [
          {
            name: "pattern",
            label: getLocalizedText("customConfig", "pattern"),
            type: "textarea",
            value: "",
            description: getLocalizedText("customConfig", "patternDesc"),
            placeholder: getLocalizedText("customConfig", "patternPlaceholder"),
          },
        ],
      },
    };

    return (
      configs[type] || {
        title: getLocalizedText("common", "config"),
        options: [],
      }
    );
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
      const placeholder =
        option.placeholder || getLocalizedText("common", "inputCustomPattern");
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
      this.showPatternValidation(
        getLocalizedText("common", "regexSyntaxCorrect"),
        "success"
      );
    } catch (error) {
      textarea.classList.add("pattern-invalid");
      this.showPatternValidation(
        `${getLocalizedText("common", "regexSyntaxError")} ${error.message}`,
        "error"
      );
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
          getLocalizedText("common", "regexCopied"),
          "success"
        );
      } else {
        window.RegexGenerator.Utils.showNotification(
          getLocalizedText("common", "copyFailed"),
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
        html += `<h4>${getLocalizedText("common", "foundMatches", {
          count: results.matches.length,
        })}</h4>`;

        results.matches.forEach((match, index) => {
          html += `<div class="match-item">`;
          html += `<span class="match-index">${index + 1}</span>`;
          html += `<span class="match-text">${match.match}</span>`;
          html += `<span class="match-position">${getLocalizedText(
            "common",
            "position"
          )} ${match.index}</span>`;
          html += `</div>`;
        });

        html += "</div>";
        resultsContainer.innerHTML = html;
      } else {
        resultsContainer.innerHTML = `<div class="no-matches">${getLocalizedText(
          "common",
          "noMatches"
        )}</div>`;
      }
    } else {
      resultsContainer.innerHTML = `<div class="error">${getLocalizedText(
        "common",
        "regexError"
      )} ${results.error}</div>`;
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
