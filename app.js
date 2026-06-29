import { SHEN_SHA_RULES } from './shensha.js';
// Master6八字排盤
// 依賴：同資料夾的 lunar.js，會提供全域 Solar 物件。

// =========================
// 資料結構 / 常數
// =========================
const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const ELEMENTS = ["木", "火", "土", "金", "水"];

const STEM_ELEMENT = {
  甲: "木", 乙: "木", 丙: "火", 丁: "火", 戊: "土", 己: "土", 庚: "金", 辛: "金", 壬: "水", 癸: "水"
};

const STEM_YIN_YANG = {
  甲: "陽", 乙: "陰", 丙: "陽", 丁: "陰", 戊: "陽", 己: "陰", 庚: "陽", 辛: "陰", 壬: "陽", 癸: "陰"
};

const BRANCH_ELEMENT = {
  子: "水", 丑: "土", 寅: "木", 卯: "木", 辰: "土", 巳: "火", 午: "火", 未: "土", 申: "金", 酉: "金", 戌: "土", 亥: "水"
};

const HIDDEN_STEMS = {
  子: ["癸"],
  丑: ["己", "癸", "辛"],
  寅: ["甲", "丙", "戊"],
  卯: ["乙"],
  辰: ["戊", "乙", "癸"],
  巳: ["丙", "庚", "戊"],
  午: ["丁", "己"],
  未: ["己", "丁", "乙"],
  申: ["庚", "壬", "戊"],
  酉: ["辛"],
  戌: ["戊", "辛", "丁"],
  亥: ["壬", "甲"]
};

const MONTH_TERMS = [
  { key: "LI_CHUN", names: ["立春"], displayName: "立春", branch: "寅", monthIndexFromYin: 0 },
  { key: "JING_ZHE", names: ["惊蛰", "驚蟄"], displayName: "驚蟄", branch: "卯", monthIndexFromYin: 1 },
  { key: "QING_MING", names: ["清明"], displayName: "清明", branch: "辰", monthIndexFromYin: 2 },
  { key: "LI_XIA", names: ["立夏"], displayName: "立夏", branch: "巳", monthIndexFromYin: 3 },
  { key: "MANG_ZHONG", names: ["芒种", "芒種"], displayName: "芒種", branch: "午", monthIndexFromYin: 4 },
  { key: "XIAO_SHU", names: ["小暑"], displayName: "小暑", branch: "未", monthIndexFromYin: 5 },
  { key: "LI_QIU", names: ["立秋"], displayName: "立秋", branch: "申", monthIndexFromYin: 6 },
  { key: "BAI_LU", names: ["白露"], displayName: "白露", branch: "酉", monthIndexFromYin: 7 },
  { key: "HAN_LU", names: ["寒露"], displayName: "寒露", branch: "戌", monthIndexFromYin: 8 },
  { key: "LI_DONG", names: ["立冬"], displayName: "立冬", branch: "亥", monthIndexFromYin: 9 },
  { key: "DA_XUE", names: ["大雪"], displayName: "大雪", branch: "子", monthIndexFromYin: 10 },
  { key: "XIAO_HAN", names: ["小寒"], displayName: "小寒", branch: "丑", monthIndexFromYin: 11 }
];

const SOLAR_TERMS_24 = [
  { key: "LI_CHUN", names: ["立春"], displayName: "立春" },
  { key: "YU_SHUI", names: ["雨水"], displayName: "雨水" },
  { key: "JING_ZHE", names: ["惊蛰", "驚蟄"], displayName: "驚蟄" },
  { key: "CHUN_FEN", names: ["春分"], displayName: "春分" },
  { key: "QING_MING", names: ["清明"], displayName: "清明" },
  { key: "GU_YU", names: ["谷雨", "穀雨"], displayName: "穀雨" },
  { key: "LI_XIA", names: ["立夏"], displayName: "立夏" },
  { key: "XIAO_MAN", names: ["小满", "小滿"], displayName: "小滿" },
  { key: "MANG_ZHONG", names: ["芒种", "芒種"], displayName: "芒種" },
  { key: "XIA_ZHI", names: ["夏至"], displayName: "夏至" },
  { key: "XIAO_SHU", names: ["小暑"], displayName: "小暑" },
  { key: "DA_SHU", names: ["大暑"], displayName: "大暑" },
  { key: "LI_QIU", names: ["立秋"], displayName: "立秋" },
  { key: "CHU_SHU", names: ["处暑", "處暑"], displayName: "處暑" },
  { key: "BAI_LU", names: ["白露"], displayName: "白露" },
  { key: "QIU_FEN", names: ["秋分"], displayName: "秋分" },
  { key: "HAN_LU", names: ["寒露"], displayName: "寒露" },
  { key: "SHUANG_JIANG", names: ["霜降"], displayName: "霜降" },
  { key: "LI_DONG", names: ["立冬"], displayName: "立冬" },
  { key: "XIAO_XUE", names: ["小雪"], displayName: "小雪" },
  { key: "DA_XUE", names: ["大雪"], displayName: "大雪" },
  { key: "DONG_ZHI", names: ["冬至"], displayName: "冬至" },
  { key: "XIAO_HAN", names: ["小寒"], displayName: "小寒" },
  { key: "DA_HAN", names: ["大寒"], displayName: "大寒" }
];

// Master6 24節氣五行進退氣固定倍率表。不得自行推算或套用四季固定旺衰。
const ELEMENT_QI_MULTIPLIER_TABLE = {
  立春: { 木: 1.2, 火: 0.6, 土: 0.6, 金: 0.6, 水: 1.5 },
  雨水: { 木: 1.5, 火: 0.7, 土: 0.6, 金: 0.6, 水: 1.3 },
  驚蟄: { 木: 1.8, 火: 0.7, 土: 0.6, 金: 0.6, 水: 1.1 },
  春分: { 木: 2.0, 火: 0.8, 土: 0.7, 金: 0.6, 水: 1.0 },
  清明: { 木: 1.9, 火: 0.9, 土: 0.7, 金: 0.7, 水: 0.9 },
  穀雨: { 木: 1.7, 火: 1.0, 土: 0.8, 金: 0.7, 水: 0.8 },
  立夏: { 木: 1.5, 火: 1.2, 土: 0.9, 金: 0.8, 水: 0.7 },
  小滿: { 木: 1.3, 火: 1.5, 土: 1.0, 金: 0.9, 水: 0.6 },
  芒種: { 木: 1.1, 火: 1.8, 土: 1.2, 金: 1.0, 水: 0.6 },
  夏至: { 木: 1.0, 火: 2.0, 土: 1.5, 金: 1.2, 水: 0.6 },
  小暑: { 木: 0.9, 火: 1.9, 土: 1.8, 金: 1.5, 水: 0.6 },
  大暑: { 木: 0.8, 火: 1.7, 土: 2.0, 金: 1.8, 水: 0.6 },
  立秋: { 木: 0.7, 火: 1.5, 土: 1.9, 金: 2.0, 水: 0.6 },
  處暑: { 木: 0.6, 火: 1.3, 土: 1.7, 金: 1.9, 水: 0.7 },
  白露: { 木: 0.6, 火: 1.1, 土: 1.5, 金: 1.7, 水: 0.7 },
  秋分: { 木: 0.6, 火: 1.0, 土: 1.3, 金: 1.5, 水: 0.8 },
  寒露: { 木: 0.6, 火: 0.9, 土: 1.1, 金: 1.3, 水: 0.9 },
  霜降: { 木: 0.6, 火: 0.8, 土: 1.0, 金: 1.1, 水: 1.0 },
  立冬: { 木: 0.6, 火: 0.7, 土: 0.9, 金: 1.0, 水: 1.2 },
  小雪: { 木: 0.7, 火: 0.6, 土: 0.8, 金: 0.9, 水: 1.5 },
  大雪: { 木: 0.7, 火: 0.6, 土: 0.7, 金: 0.8, 水: 1.8 },
  冬至: { 木: 0.8, 火: 0.6, 土: 0.6, 金: 0.7, 水: 2.0 },
  小寒: { 木: 0.9, 火: 0.6, 土: 0.6, 金: 0.6, 水: 1.9 },
  大寒: { 木: 1.0, 火: 0.6, 土: 0.6, 金: 0.6, 水: 1.7 }
};

const ELEMENT_GENERATES = { 木: "火", 火: "土", 土: "金", 金: "水", 水: "木" };
const ELEMENT_CONTROLS = { 木: "土", 土: "水", 水: "火", 火: "金", 金: "木" };

const YIN_MONTH_START_STEM_INDEX = {
  甲: 2, 己: 2,
  乙: 4, 庚: 4,
  丙: 6, 辛: 6,
  丁: 8, 壬: 8,
  戊: 0, 癸: 0
};

const ZI_HOUR_START_STEM_INDEX = {
  甲: 0, 己: 0,
  乙: 2, 庚: 2,
  丙: 4, 辛: 4,
  丁: 6, 壬: 6,
  戊: 8, 癸: 8
};

const DAY_MS = 24 * 60 * 60 * 1000;

// =========================
// 工具函數
// =========================
function mod(n, m) {
  return ((n % m) + m) % m;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function assertValidTimezone(timezone) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone }).format(new Date());
  } catch (error) {
    throw new Error("無效時區：" + timezone);
  }
}

function parseBirthInput(input) {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.birthDate || "");
  if (!dateMatch) throw new Error("出生日期格式必須是 YYYY-MM-DD");

  const timeMatch = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(input.birthTime || "");
  if (!timeMatch) throw new Error("出生時間格式必須是 HH:mm 或 HH:mm:ss");

  const year = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const day = Number(dateMatch[3]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  const second = Number(timeMatch[3] || 0);

  if (month < 1 || month > 12) throw new Error("月份必須是 01-12");
  if (hour < 0 || hour > 23) throw new Error("小時必須是 00-23");
  if (minute < 0 || minute > 59) throw new Error("分鐘必須是 00-59");
  if (second < 0 || second > 59) throw new Error("秒數必須是 00-59");

  const check = new Date(Date.UTC(year, month - 1, day));
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) {
    throw new Error("出生日期不存在");
  }

  if (input.gender !== "male" && input.gender !== "female") {
    throw new Error("性別必須是 male 或 female");
  }

  const timezone = input.timezone || "Asia/Taipei";
  assertValidTimezone(timezone);

  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    timezone,
    gender: input.gender,
    useTrueSolarTime: Boolean(input.useTrueSolarTime)
  };
}

function getZonedParts(date, timeZone) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });

  const parts = formatter.formatToParts(date).reduce((acc, part) => {
    if (part.type !== "literal") acc[part.type] = part.value;
    return acc;
  }, {});

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second)
  };
}

function zonedTimeToUtc(input) {
  const targetAsUtc = Date.UTC(input.year, input.month - 1, input.day, input.hour, input.minute, input.second);
  let guess = targetAsUtc;

  for (let i = 0; i < 6; i += 1) {
    const parts = getZonedParts(new Date(guess), input.timezone);
    const renderedAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    const diff = renderedAsUtc - targetAsUtc;
    if (diff === 0) break;
    guess -= diff;
  }

  return new Date(guess);
}

function formatUtcInTimeZone(date, timeZone) {
  return new Intl.DateTimeFormat("zh-Hant-TW", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).format(date);
}

function formatAgeText(ageYears) {
  const totalMonths = ageYears * 12;
  const years = Math.floor(totalMonths / 12);
  const monthsFloat = totalMonths - years * 12;
  const months = Math.floor(monthsFloat);
  const days = Math.round((monthsFloat - months) * 30);
  const parts = [];
  if (years > 0) parts.push(years + "歲");
  if (months > 0) parts.push(months + "個月");
  if (days > 0) parts.push(days + "日");
  return parts.length ? parts.join(" ") : "0歲";
}

function getTenGod(dayMaster, targetStem) {
  if (dayMaster === targetStem) return "日主";

  const dayElement = STEM_ELEMENT[dayMaster];
  const targetElement = STEM_ELEMENT[targetStem];
  const samePolarity = STEM_YIN_YANG[dayMaster] === STEM_YIN_YANG[targetStem];

  if (dayElement === targetElement) return samePolarity ? "比肩" : "劫財";
  if (ELEMENT_GENERATES[dayElement] === targetElement) return samePolarity ? "食神" : "傷官";
  if (ELEMENT_CONTROLS[dayElement] === targetElement) return samePolarity ? "偏財" : "正財";
  if (ELEMENT_CONTROLS[targetElement] === dayElement) return samePolarity ? "七殺" : "正官";
  if (ELEMENT_GENERATES[targetElement] === dayElement) return samePolarity ? "偏印" : "正印";
  return "未知";
}

// =========================
// 節氣 / 年月柱
// =========================
function solarToUtcAssumingBeijingTime(solar) {
  return new Date(Date.UTC(
    solar.getYear(),
    solar.getMonth() - 1,
    solar.getDay(),
    solar.getHour() - 8,
    solar.getMinute(),
    solar.getSecond()
  ));
}

function normalizeSolarTermName(name) {
  return String(name)
    .replaceAll("驚", "惊")
    .replaceAll("蟄", "蛰")
    .replaceAll("種", "种")
    .replaceAll("滿", "满")
    .replaceAll("處", "处")
    .replaceAll("穀", "谷");
}

function solarYearFromSolar(solar) {
  return typeof solar.getYear === "function" ? solar.getYear() : Number(String(solar.toYmdHms()).slice(0, 4));
}

function findSolarTermInTable(table, term, year) {
  const expectedNames = new Set(term.names.map(normalizeSolarTermName));

  // lunar-javascript 通常用簡體中文做 key，例如「惊蛰」「芒种」。
  // 舊版/不同打包方式可能會出現繁體 key，所以先用 aliases 直接取。
  for (const name of term.names) {
    if (table[name] && solarYearFromSolar(table[name]) === year) return table[name];
  }

  // 再掃描整張節氣表，處理簡繁差異。避免硬編碼「驚蟄」導致搵唔到「惊蛰」。
  for (const [name, solar] of Object.entries(table)) {
    if (expectedNames.has(normalizeSolarTermName(name)) && solarYearFromSolar(solar) === year) {
      return solar;
    }
  }

  // 最後才試英文 enum key；部分 enum key 會指向上一年/下一年，所以一定要核對年份。
  if (table[term.key] && solarYearFromSolar(table[term.key]) === year) return table[term.key];

  return null;
}

function getMajorSolarTermsForYear(year) {
  if (typeof Solar === "undefined") {
    throw new Error("找不到 lunar.js。請確認 index.html、app.js、style.css、lunar.js 放在同一個資料夾。");
  }

  const lunar = Solar.fromYmd(year, 7, 1).getLunar();
  const table = lunar.getJieQiTable();

  return MONTH_TERMS.map((term) => {
    const solar = findSolarTermInTable(table, term, year);
    if (!solar) {
      const availableTerms = Object.keys(table).join("、");
      throw new Error("找不到 " + year + " 年節氣：" + term.displayName + "。可用節氣 key：" + availableTerms);
    }
    const utcDate = solarToUtcAssumingBeijingTime(solar);
    return {
      name: term.names[0],
      key: term.key,
      displayName: term.displayName,
      branch: term.branch,
      monthIndexFromYin: term.monthIndexFromYin,
      utc: utcDate.toISOString(),
      beijingTime: solar.toYmdHms()
    };
  }).sort((a, b) => Date.parse(a.utc) - Date.parse(b.utc));
}

function getMajorSolarTermsAround(year) {
  const points = [
    ...getMajorSolarTermsForYear(year - 1),
    ...getMajorSolarTermsForYear(year),
    ...getMajorSolarTermsForYear(year + 1)
  ];
  const seen = new Set();
  return points
    .filter((point) => {
      const key = point.name + "-" + point.utc;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => Date.parse(a.utc) - Date.parse(b.utc));
}

function getLiChun(year) {
  const term = getMajorSolarTermsForYear(year).find((point) => point.displayName === "立春");
  if (!term) throw new Error("找不到 " + year + " 年立春");
  return term;
}

function getAllSolarTermsForYear(year) {
  if (typeof Solar === "undefined") {
    throw new Error("找不到 lunar.js。請確認 index.html、app.js、style.css、lunar.js 放在同一個資料夾。");
  }

  const lunar = Solar.fromYmd(year, 7, 1).getLunar();
  const table = lunar.getJieQiTable();

  return SOLAR_TERMS_24.map((term) => {
    const solar = findSolarTermInTable(table, term, year);
    if (!solar) {
      const availableTerms = Object.keys(table).join("、");
      throw new Error("找不到 " + year + " 年 24 節氣：" + term.displayName + "。可用節氣 key：" + availableTerms);
    }
    const utcDate = solarToUtcAssumingBeijingTime(solar);
    return {
      name: term.names[0],
      key: term.key,
      displayName: term.displayName,
      utc: utcDate.toISOString(),
      beijingTime: solar.toYmdHms()
    };
  }).sort((a, b) => Date.parse(a.utc) - Date.parse(b.utc));
}

function getAllSolarTermsAround(year) {
  const points = [
    ...getAllSolarTermsForYear(year - 1),
    ...getAllSolarTermsForYear(year),
    ...getAllSolarTermsForYear(year + 1)
  ];
  const seen = new Set();
  return points
    .filter((point) => {
      const key = point.displayName + "-" + point.utc;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => Date.parse(a.utc) - Date.parse(b.utc));
}

function findCurrent24SolarTerm(birthUtc, localYear) {
  const terms = getAllSolarTermsAround(localYear);
  const current = [...terms].reverse().find((term) => Date.parse(term.utc) <= birthUtc.getTime());
  const next = terms.find((term) => Date.parse(term.utc) > birthUtc.getTime());
  if (!current) throw new Error("找不到出生時間之前的 24 節氣交接點");
  if (!next) throw new Error("找不到出生時間之後的 24 節氣交接點");

  const t0 = Date.parse(current.utc);
  const t1 = Date.parse(next.utc);
  const t = birthUtc.getTime();
  if (!(t1 > t0)) throw new Error("節氣時間順序異常，無法計算節氣進度");

  const progress = Math.min(1, Math.max(0, (t - t0) / (t1 - t0)));
  if (!ELEMENT_QI_MULTIPLIER_TABLE[current.displayName]) throw new Error("找不到固定倍率表節氣：" + current.displayName);
  if (!ELEMENT_QI_MULTIPLIER_TABLE[next.displayName]) throw new Error("找不到固定倍率表下一節氣：" + next.displayName);

  const multipliers = {};
  const transitions = {};
  for (const element of ELEMENTS) {
    const m0 = ELEMENT_QI_MULTIPLIER_TABLE[current.displayName][element];
    const m1 = ELEMENT_QI_MULTIPLIER_TABLE[next.displayName][element];
    if (typeof m0 !== "number" || typeof m1 !== "number") {
      throw new Error("固定倍率表缺少 " + element + " 倍率");
    }
    const actual = m0 + progress * (m1 - m0);
    multipliers[element] = actual;
    transitions[element] = {
      currentMultiplier: m0,
      nextMultiplier: m1,
      actualMultiplier: actual,
      stateText: getQiStateLabel(m0, m1 - m0) + " → " + getQiStateLabel(m1, m1 - m0)
    };
  }

  return {
    current,
    next,
    progress,
    progressPercent: Number((progress * 100).toFixed(1)),
    multipliers,
    transitions,
    source: "Master6 24節氣五行進退氣倍率表 + 節氣內線性插值"
  };
}

function getQiStateLabel(multiplier, direction) {
  const key = Number(multiplier).toFixed(1);
  const rising = direction > 0;
  const falling = direction < 0;
  const labels = {
    "2.0": "帝旺",
    "1.9": "旺極",
    "1.8": "極旺",
    "1.7": "開始退",
    "1.3": "餘旺",
    "1.2": "進氣",
    "1.1": "餘氣",
    "0.8": "弱氣",
    "0.7": "囚弱",
    "0.6": "氣弱極"
  };
  if (key === "1.5") return rising ? "旺升" : (falling ? "退氣" : "旺升／退氣");
  if (key === "1.0") return rising ? "漸升" : "平氣";
  if (key === "0.9") return rising ? "萌芽" : (falling ? "衰氣" : "萌芽／衰氣");
  return labels[key] || "—";
}

function round1(value) {
  return Number(value.toFixed(1));
}

function findCurrentMonthBoundary(birthUtc, localYear) {
  const terms = getMajorSolarTermsAround(localYear);
  const current = [...terms].reverse().find((term) => Date.parse(term.utc) <= birthUtc.getTime());
  if (!current) throw new Error("找不到出生時間之前的節氣交接點");
  return current;
}

function findAdjacentMajorTerm(birthUtc, localYear, direction) {
  const terms = getMajorSolarTermsAround(localYear);
  if (direction === "forward") {
    const next = terms.find((term) => Date.parse(term.utc) > birthUtc.getTime());
    if (!next) throw new Error("找不到下一個節氣交接點");
    return next;
  }
  const previous = [...terms].reverse().find((term) => Date.parse(term.utc) < birthUtc.getTime());
  if (!previous) throw new Error("找不到上一個節氣交接點");
  return previous;
}

function getYearPillarStemBranch(input, birthUtc) {
  const liChun = getLiChun(input.year);
  const baziYear = birthUtc.getTime() >= Date.parse(liChun.utc) ? input.year : input.year - 1;
  const yearIndex = mod(baziYear - 1984, 60); // 1984 = 甲子年
  return {
    stem: HEAVENLY_STEMS[yearIndex % 10],
    branch: EARTHLY_BRANCHES[yearIndex % 12],
    baziYear,
    liChun
  };
}

function getMonthPillarStemBranch(yearStem, boundary) {
  const firstYinStemIndex = YIN_MONTH_START_STEM_INDEX[yearStem];
  const stemIndex = mod(firstYinStemIndex + boundary.monthIndexFromYin, 10);
  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: boundary.branch
  };
}

// =========================
// 日柱 / 時柱
// =========================
function getDayPillarStemBranch(input) {
  const solar = Solar.fromYmdHms(input.year, input.month, input.day, input.hour, input.minute, input.second);
  const eightChar = solar.getLunar().getEightChar();
  return {
    stem: eightChar.getDayGan(),
    branch: eightChar.getDayZhi()
  };
}

function getTimeBranchIndex(hour) {
  if (hour === 23) return 0;
  return Math.floor((hour + 1) / 2);
}

function getTimePillarStemBranch(dayStem, hour) {
  const branchIndex = getTimeBranchIndex(hour);
  const stemIndex = mod(ZI_HOUR_START_STEM_INDEX[dayStem] + branchIndex, 10);
  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex]
  };
}

function buildPillar(name, label, stem, branch, dayMaster) {
  return {
    name,
    label,
    stem,
    branch,
    ganZhi: stem + branch,
    stemElement: STEM_ELEMENT[stem],
    branchElement: BRANCH_ELEMENT[branch],
    stemYinYang: STEM_YIN_YANG[stem],
    stemTenGod: name === "day" ? "日主" : getTenGod(dayMaster, stem),
    hiddenStems: HIDDEN_STEMS[branch].map((hiddenStem) => ({
      stem: hiddenStem,
      element: STEM_ELEMENT[hiddenStem],
      yinYang: STEM_YIN_YANG[hiddenStem],
      tenGod: getTenGod(dayMaster, hiddenStem)
    }))
  };
}

// =========================
// 五行分佈 / 大運
// =========================
function calculateFiveElements(pillars, solarTerm24) {
  const rows = ELEMENTS.map((element) => ({
    element,
    visibleStems: 0,
    branches: 0,
    hiddenStems: 0,
    rawTotal: 0,
    multiplier: 0,
    correctedTotal: 0,
    percentage: 0,
    qiStateText: ""
  }));
  const byElement = Object.fromEntries(rows.map((row) => [row.element, row]));

  for (const pillar of pillars) {
    byElement[STEM_ELEMENT[pillar.stem]].visibleStems += 1;
    byElement[BRANCH_ELEMENT[pillar.branch]].branches += 1;
    for (const hidden of pillar.hiddenStems) {
      byElement[hidden.element].hiddenStems += 1;
    }
  }

  for (const row of rows) {
    row.rawTotal = row.visibleStems + row.branches + row.hiddenStems;
    row.multiplier = solarTerm24.multipliers[row.element];
    row.correctedTotal = row.rawTotal * row.multiplier;
    row.qiStateText = solarTerm24.transitions[row.element].stateText;
  }

  const correctedGrandTotal = rows.reduce((sum, row) => sum + row.correctedTotal, 0);
  if (!(correctedGrandTotal > 0)) throw new Error("五行修正後總分必須大於 0");

  const unroundedPercentages = rows.map((row) => (row.correctedTotal / correctedGrandTotal) * 100);
  const roundedTenths = unroundedPercentages.map((value) => Math.round(value * 10));
  let diffTenths = 1000 - roundedTenths.reduce((sum, value) => sum + value, 0);

  // 保證顯示百分比總和 = 100.0%。如四捨五入有誤差，補到未四捨五入餘數最大的五行。
  while (diffTenths !== 0) {
    let selectedIndex = 0;
    let bestRemainder = -Infinity;
    for (let i = 0; i < rows.length; i += 1) {
      const rawTenths = unroundedPercentages[i] * 10;
      const remainder = rawTenths - Math.floor(rawTenths);
      if (remainder > bestRemainder) {
        bestRemainder = remainder;
        selectedIndex = i;
      }
    }
    roundedTenths[selectedIndex] += diffTenths > 0 ? 1 : -1;
    diffTenths += diffTenths > 0 ? -1 : 1;
  }

  rows.forEach((row, index) => {
    row.multiplier = round1(row.multiplier);
    row.correctedTotal = Number(row.correctedTotal.toFixed(2));
    row.percentage = Number((roundedTenths[index] / 10).toFixed(1));
  });

  const percentageTotal = Number(rows.reduce((sum, row) => sum + row.percentage, 0).toFixed(1));
  if (percentageTotal !== 100.0) throw new Error("五行百分比校驗失敗，總和不是 100.0%");

  return {
    mode: "Master6 24節氣進退氣",
    source: solarTerm24.source,
    currentTerm: solarTerm24.current,
    nextTerm: solarTerm24.next,
    progress: solarTerm24.progress,
    progressPercent: solarTerm24.progressPercent,
    rows,
    percentageTotal,
    validation: {
      uses24SolarTermMultiplier: true,
      usesLinearInterpolation: true,
      noExtraSeasonMultiplier: true,
      percentageTotalIs100: percentageTotal === 100.0
    }
  };
}

function getLuckDirection(gender, yearStem) {
  const isYearStemYang = STEM_YIN_YANG[yearStem] === "陽";
  const forward = (gender === "male" && isYearStemYang) || (gender === "female" && !isYearStemYang);
  return forward ? "forward" : "backward";
}

function calculateLuckCycles(birthUtc, localYear, gender, yearStem, monthPillar) {
  const direction = getLuckDirection(gender, yearStem);
  const referenceTerm = findAdjacentMajorTerm(birthUtc, localYear, direction);
  const diffDays = Math.abs(Date.parse(referenceTerm.utc) - birthUtc.getTime()) / DAY_MS;
  const startAge = Number((diffDays / 3).toFixed(2));
  const baseStemIndex = HEAVENLY_STEMS.indexOf(monthPillar.stem);
  const baseBranchIndex = EARTHLY_BRANCHES.indexOf(monthPillar.branch);
  const step = direction === "forward" ? 1 : -1;

  const cycles = Array.from({ length: 10 }, (_, i) => {
    const offset = step * (i + 1);
    const stem = HEAVENLY_STEMS[mod(baseStemIndex + offset, 10)];
    const branch = EARTHLY_BRANCHES[mod(baseBranchIndex + offset, 12)];
    const cycleStartAge = Number((startAge + i * 10).toFixed(2));
    const cycleEndAge = Number((cycleStartAge + 10).toFixed(2));
    return {
      index: i + 1,
      pillar: stem + branch,
      stem,
      branch,
      startAge: cycleStartAge,
      endAge: cycleEndAge,
      startAgeText: formatAgeText(cycleStartAge)
    };
  });

  return {
    direction,
    directionLabel: direction === "forward" ? "順行" : "逆行",
    rule: "陽男陰女順行，陰男陽女逆行；順行計至下一個節，逆行計至上一個節；三日一歲。",
    startAge,
    startAgeText: formatAgeText(startAge),
    referenceTerm,
    cycles
  };
}

// =========================
// 排盤主流程
// =========================
function calculateBazi(request) {
  const input = parseBirthInput(request);
  const birthUtc = zonedTimeToUtc(input);

  const day = getDayPillarStemBranch(input);
  const year = getYearPillarStemBranch(input, birthUtc);
  const monthBoundary = findCurrentMonthBoundary(birthUtc, input.year);
  const solarTerm24 = findCurrent24SolarTerm(birthUtc, input.year);
  const month = getMonthPillarStemBranch(year.stem, monthBoundary);
  const time = getTimePillarStemBranch(day.stem, input.hour);
  const dayMaster = day.stem;

  const yearPillar = buildPillar("year", "年柱", year.stem, year.branch, dayMaster);
  const monthPillar = buildPillar("month", "月柱", month.stem, month.branch, dayMaster);
  const dayPillar = buildPillar("day", "日柱", day.stem, day.branch, dayMaster);
  const timePillar = buildPillar("time", "時柱", time.stem, time.branch, dayMaster);
  const orderedPillars = [yearPillar, monthPillar, dayPillar, timePillar];

  return {
    input,
    birthUtc: birthUtc.toISOString(),
    birthTimeInSelectedTimezone: formatUtcInTimeZone(birthUtc, input.timezone),
    note: [
      "第一版不加入命理解讀文字。",
      "年柱以立春交接時刻為界，月柱以十二節交接時刻為界。",
      "useTrueSolarTime 已預留，但第一版不作真太陽時校正。",
      "五行分佈採 Master6 24節氣進退氣倍率：先計天干、地支、藏干原始分數，再按實際節氣進度線性插值修正。",
      "神煞採常見子平八字查表，只顯示命中位置與查法，不加入命理解讀。",
      "日柱採用 lunar-javascript 曆法庫計算；本版不套用 23:00 晚子時換日規則。"
    ],
    dayMaster,
    pillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      time: timePillar
    },
    yearInfo: year,
    monthBoundary,
    solarTerm24,
    fiveElements: calculateFiveElements(orderedPillars, solarTerm24),
    shenSha: typeof calculateShenSha === "function" ? calculateShenSha({
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      time: timePillar
    }) : null,
    luck: calculateLuckCycles(birthUtc, input.year, input.gender, year.stem, monthPillar)
  };
}

// =========================
// Render
// =========================
function renderPillarSummary(pillars) {
  return [pillars.year, pillars.month, pillars.day, pillars.time].map((pillar) => `
    <div class="pillar-box">
      <div class="pillar-label">${escapeHtml(pillar.label)}</div>
      <div class="pillar-gz">${escapeHtml(pillar.ganZhi)}</div>
      <div class="small muted">${escapeHtml(pillar.stemTenGod)}</div>
    </div>
  `).join("");
}

function renderPillarTable(pillars) {
  const rows = [pillars.year, pillars.month, pillars.day, pillars.time].map((pillar) => {
    const hidden = pillar.hiddenStems.map((h) => `${h.stem}(${h.tenGod}/${h.element})`).join("、");
    return `
      <tr>
        <td class="nowrap">${escapeHtml(pillar.label)}</td>
        <td class="nowrap"><strong>${escapeHtml(pillar.ganZhi)}</strong></td>
        <td>${escapeHtml(pillar.stem)} / ${escapeHtml(pillar.stemElement)} / ${escapeHtml(pillar.stemYinYang)}</td>
        <td>${escapeHtml(pillar.branch)} / ${escapeHtml(pillar.branchElement)}</td>
        <td>${escapeHtml(pillar.stemTenGod)}</td>
        <td>${escapeHtml(hidden)}</td>
      </tr>
    `;
  }).join("");

  return `
    <div class="section">
      <h3>四柱詳表</h3>
      <div class="scroll">
        <table>
          <thead>
            <tr>
              <th>柱</th>
              <th>干支</th>
              <th>天干 / 五行 / 陰陽</th>
              <th>地支 / 五行</th>
              <th>天干十神</th>
              <th>藏干 十神 / 五行</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderFiveElements(fiveElements) {
  const rows = fiveElements.rows;
  const bars = rows.map((row) => `
    <div class="bar">
      <strong>${escapeHtml(row.element)}</strong>
      <div class="track"><div class="fill" style="width:${row.percentage}%"></div></div>
      <span class="small muted">${row.percentage.toFixed(1)}%</span>
    </div>
  `).join("");

  const tableRows = rows.map((row) => `
    <tr>
      <td>${escapeHtml(row.element)}</td>
      <td>${row.visibleStems}</td>
      <td>${row.branches}</td>
      <td>${row.hiddenStems}</td>
      <td>${row.rawTotal}</td>
      <td>${row.multiplier.toFixed(1)}</td>
      <td>${row.correctedTotal.toFixed(2)}</td>
      <td>${escapeHtml(row.qiStateText)}</td>
      <td>${row.percentage.toFixed(1)}%</td>
    </tr>
  `).join("");

  return `
    <div class="section">
      <h3>五行分佈｜Master6 24節氣進退氣</h3>
      <div class="meta">
        <div class="meta-item"><span class="meta-k">命主所屬節氣</span><span class="meta-v">${escapeHtml(fiveElements.currentTerm.displayName)}</span></div>
        <div class="meta-item"><span class="meta-k">下一節氣</span><span class="meta-v">${escapeHtml(fiveElements.nextTerm.displayName)}</span></div>
        <div class="meta-item"><span class="meta-k">節氣進度</span><span class="meta-v">${fiveElements.progressPercent.toFixed(1)}%</span></div>
        <div class="meta-item"><span class="meta-k">倍率規則</span><span class="meta-v small">固定表 + 線性插值，不額外加入月令或四季倍率</span></div>
      </div>
      <div style="margin-top:12px">${bars}</div>
      <div class="scroll" style="margin-top:12px">
        <table>
          <thead><tr><th>五行</th><th>天干</th><th>地支</th><th>藏干</th><th>原始分數</th><th>實際倍率</th><th>修正分數</th><th>進退氣狀態</th><th>比例</th></tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </div>
      <p class="small muted" style="margin:12px 0 0">${escapeHtml(fiveElements.source)}。百分比已校正至總和 ${fiveElements.percentageTotal.toFixed(1)}%。</p>
    </div>
  `;
}

function renderShenSha(shenSha) {
  if (!shenSha) {
    return `
      <div class="section">
        <h3>神煞</h3>
        <p class="muted small">未載入 shensha.js。</p>
      </div>
    `;
  }

  const pillarOrder = ["year", "month", "day", "time"];
  const pillarLabels = { year: "年柱", month: "月柱", day: "日柱", time: "時柱" };
  const chips = pillarOrder.map((key) => {
    const items = shenSha.byPillar[key] || [];
    const content = items.length
      ? items.map((item) => `<span class="tag">${escapeHtml(item.name)}</span>`).join("")
      : `<span class="muted small">—</span>`;
    return `
      <div class="shen-pillar">
        <div class="pillar-label">${escapeHtml(pillarLabels[key])}</div>
        <div class="tag-row">${content}</div>
      </div>
    `;
  }).join("");

  const rows = shenSha.matched.map((item) => {
    const detailTexts = item.matchedDetails.map((detail) => {
      const targets = detail.targets.join("、") || "—";
      const positions = detail.matchedPositions.map((p) => `${p.fieldLabel}${p.value}`).join("、");
      return `${detail.checkLabel}｜基準：${detail.baseLabel}${detail.baseValue}｜條件：${targets}｜命中：${positions}`;
    }).join("<br>");

    return `
      <tr>
        <td class="nowrap">${escapeHtml(item.category)}</td>
        <td class="nowrap"><strong>${escapeHtml(item.name)}</strong></td>
        <td>${detailTexts}</td>
      </tr>
    `;
  }).join("");

  return `
    <div class="section">
      <h3>神煞</h3>
      <div class="meta">
        <div class="meta-item"><span class="meta-k">收錄規則</span><span class="meta-v">${shenSha.totalRules} 個</span></div>
        <div class="meta-item"><span class="meta-k">命中神煞</span><span class="meta-v">${shenSha.matchedCount} 個</span></div>
      </div>
      <div class="shen-grid" style="margin-top:12px">${chips}</div>
      <p class="small muted" style="margin:12px 0 0">${escapeHtml(shenSha.sourceNote)}</p>
      <div class="scroll" style="margin-top:12px">
        <table>
          <thead><tr><th>分類</th><th>神煞</th><th>查法 / 條件 / 命中</th></tr></thead>
          <tbody>${rows || `<tr><td colspan="3" class="muted">無命中</td></tr>`}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderLuck(luck) {
  const rows = luck.cycles.map((cycle) => `
    <tr>
      <td>${cycle.index}</td>
      <td><strong>${escapeHtml(cycle.pillar)}</strong></td>
      <td>${escapeHtml(cycle.stem)}</td>
      <td>${escapeHtml(cycle.branch)}</td>
      <td>${escapeHtml(cycle.startAgeText)}</td>
      <td>${cycle.startAge} - ${cycle.endAge} 歲</td>
    </tr>
  `).join("");

  return `
    <div class="section">
      <h3>大運</h3>
      <div class="meta">
        <div class="meta-item"><span class="meta-k">順逆</span><span class="meta-v">${escapeHtml(luck.directionLabel)}</span></div>
        <div class="meta-item"><span class="meta-k">起運歲數</span><span class="meta-v">${escapeHtml(luck.startAgeText)}（${luck.startAge} 歲）</span></div>
        <div class="meta-item"><span class="meta-k">計算到的節氣</span><span class="meta-v">${escapeHtml(luck.referenceTerm.displayName)}：${escapeHtml(luck.referenceTerm.beijingTime)} 北京時間</span></div>
        <div class="meta-item"><span class="meta-k">規則</span><span class="meta-v small">${escapeHtml(luck.rule)}</span></div>
      </div>
      <div class="scroll" style="margin-top:12px">
        <table>
          <thead><tr><th>#</th><th>大運</th><th>干</th><th>支</th><th>起運</th><th>歲數範圍</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

function renderResult(result) {
  const notes = result.note.map((n) => `<li>${escapeHtml(n)}</li>`).join("");
  return `
    <div class="section">
      <h3>四柱總覽</h3>
      <div class="summary">${renderPillarSummary(result.pillars)}</div>
      <div class="meta">
        <div class="meta-item"><span class="meta-k">日主</span><span class="meta-v">${escapeHtml(result.dayMaster)}</span></div>
        <div class="meta-item"><span class="meta-k">八字年</span><span class="meta-v">${escapeHtml(result.yearInfo.baziYear)} 年</span></div>
        <div class="meta-item"><span class="meta-k">月令節氣</span><span class="meta-v">${escapeHtml(result.monthBoundary.displayName)}，${escapeHtml(result.monthBoundary.branch)}月</span></div>
        <div class="meta-item"><span class="meta-k">出生 UTC</span><span class="meta-v mono small">${escapeHtml(result.birthUtc)}</span></div>
      </div>
    </div>
    ${renderPillarTable(result.pillars)}
    ${renderFiveElements(result.fiveElements)}
    ${renderShenSha(result.shenSha)}
    ${renderLuck(result.luck)}
    <div class="section">
      <h3>技術備註</h3>
      <ul class="small muted">${notes}</ul>
    </div>
  `;
}

function showError(message) {
  const errorEl = document.getElementById("error");
  errorEl.textContent = message;
  errorEl.style.display = "block";
}

function clearError() {
  const errorEl = document.getElementById("error");
  errorEl.textContent = "";
  errorEl.style.display = "none";
}

function getFormRequest(form) {
  return {
    birthDate: form.birthDate.value,
    birthTime: form.birthTime.value,
    gender: form.gender.value,
    timezone: form.timezone.value,
    useTrueSolarTime: form.useTrueSolarTime.checked
  };
}

function runFormCalculation() {
  clearError();
  const form = document.getElementById("baziForm");
  const request = getFormRequest(form);
  const result = calculateBazi(request);
  document.getElementById("result").innerHTML = renderResult(result);
}

document.getElementById("baziForm").addEventListener("submit", (event) => {
  event.preventDefault();
  try {
    runFormCalculation();
  } catch (error) {
    showError(error && error.message ? error.message : String(error));
  }
});

// 預設載入時先排一次示例盤
try {
  runFormCalculation();
} catch (error) {
  showError(error && error.message ? error.message : String(error));
}
