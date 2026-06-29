// 八字神煞規則表 + 純前端計算器
// 注意：神煞各派查法可能不同。本檔只收錄常見子平八字排盤查表，且只輸出命中位置，不加入命理解讀。
(function (global) {
  "use strict";

  const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

  const PILLAR_ORDER = ["year", "month", "day", "time"];
  const PILLAR_LABEL = {
    year: "年柱",
    month: "月柱",
    day: "日柱",
    time: "時柱"
  };

  const FIELD_LABEL = {
    yearStem: "年干",
    monthStem: "月干",
    dayStem: "日干",
    timeStem: "時干",
    yearBranch: "年支",
    monthBranch: "月支",
    dayBranch: "日支",
    timeBranch: "時支",
    dayPillar: "日柱"
  };

  function normalizeArray(value) {
    if (Array.isArray(value)) return value;
    if (value === undefined || value === null) return [];
    return [value];
  }

  function uniq(values) {
    return Array.from(new Set(values));
  }

  function getFieldValue(pillars, field) {
    switch (field) {
      case "yearStem": return pillars.year.stem;
      case "monthStem": return pillars.month.stem;
      case "dayStem": return pillars.day.stem;
      case "timeStem": return pillars.time.stem;
      case "yearBranch": return pillars.year.branch;
      case "monthBranch": return pillars.month.branch;
      case "dayBranch": return pillars.day.branch;
      case "timeBranch": return pillars.time.branch;
      case "dayPillar": return pillars.day.ganZhi;
      default: return undefined;
    }
  }

  function getPositions(pillars, targetType) {
    const positions = [];
    for (const key of PILLAR_ORDER) {
      const pillar = pillars[key];
      if (targetType === "stem") {
        positions.push({ pillar: key, pillarLabel: PILLAR_LABEL[key], fieldLabel: PILLAR_LABEL[key].replace("柱", "干"), value: pillar.stem, type: "stem" });
      }
      if (targetType === "branch") {
        positions.push({ pillar: key, pillarLabel: PILLAR_LABEL[key], fieldLabel: PILLAR_LABEL[key].replace("柱", "支"), value: pillar.branch, type: "branch" });
      }
    }
    return positions;
  }

  function matchTargets(pillars, targetType, targets) {
    const targetSet = new Set(normalizeArray(targets));
    return getPositions(pillars, targetType).filter((position) => targetSet.has(position.value));
  }

  function findBranchGroup(branch) {
    if (["申", "子", "辰"].includes(branch)) return "申子辰";
    if (["寅", "午", "戌"].includes(branch)) return "寅午戌";
    if (["巳", "酉", "丑"].includes(branch)) return "巳酉丑";
    if (["亥", "卯", "未"].includes(branch)) return "亥卯未";
    return "";
  }

  function getKongWangBranches(dayPillar) {
    const stem = dayPillar.slice(0, 1);
    const branch = dayPillar.slice(1, 2);
    const stemIndex = STEMS.indexOf(stem);
    const branchIndex = BRANCHES.indexOf(branch);
    if (stemIndex < 0 || branchIndex < 0) return [];

    // 六十甲子中，每旬由甲開始。求所在旬首的地支，再查空亡。
    const offsetFromJia = stemIndex;
    const xunStartBranch = BRANCHES[((branchIndex - offsetFromJia) % 12 + 12) % 12];
    const map = {
      子: ["戌", "亥"], // 甲子旬
      戌: ["申", "酉"], // 甲戌旬
      申: ["午", "未"], // 甲申旬
      午: ["辰", "巳"], // 甲午旬
      辰: ["寅", "卯"], // 甲辰旬
      寅: ["子", "丑"]  // 甲寅旬
    };
    return map[xunStartBranch] || [];
  }

  const SHEN_SHA_RULES = [
    {
      id: "tianYiGuiRen",
      name: "天乙貴人",
      category: "貴人類",
      type: "stemToBranches",
      baseField: "dayStem",
      rules: {
        甲: ["丑", "未"], 戊: ["丑", "未"], 庚: ["丑", "未"],
        乙: ["子", "申"], 己: ["子", "申"],
        丙: ["亥", "酉"], 丁: ["亥", "酉"],
        壬: ["卯", "巳"], 癸: ["卯", "巳"],
        辛: ["寅", "午"]
      }
    },
    {
      id: "taiJiGuiRen",
      name: "太極貴人",
      category: "貴人類",
      type: "stemToBranches",
      baseField: "dayStem",
      rules: {
        甲: ["子", "午"], 乙: ["子", "午"],
        丙: ["卯", "酉"], 丁: ["卯", "酉"],
        戊: ["辰", "戌", "丑", "未"], 己: ["辰", "戌", "丑", "未"],
        庚: ["寅", "亥"], 辛: ["寅", "亥"],
        壬: ["巳", "申"], 癸: ["巳", "申"]
      }
    },
    {
      id: "wenChangGuiRen",
      name: "文昌貴人",
      category: "貴人類",
      type: "stemToBranches",
      baseField: "dayStem",
      rules: {
        甲: ["巳"], 乙: ["午"], 丙: ["申"], 丁: ["酉"], 戊: ["申"],
        己: ["酉"], 庚: ["亥"], 辛: ["子"], 壬: ["寅"], 癸: ["卯"]
      }
    },
    {
      id: "guoYinGuiRen",
      name: "國印貴人",
      category: "貴人類",
      type: "stemToBranches",
      baseField: "dayStem",
      rules: {
        甲: ["戌"], 乙: ["亥"], 丙: ["丑"], 丁: ["寅"], 戊: ["丑"],
        己: ["寅"], 庚: ["辰"], 辛: ["巳"], 壬: ["未"], 癸: ["申"]
      }
    },
    {
      id: "tianDeGuiRen",
      name: "天德貴人",
      category: "貴人類",
      type: "branchToMixedTargets",
      baseField: "monthBranch",
      rules: {
        寅: ["丁"], 卯: ["申"], 辰: ["壬"], 巳: ["辛"], 午: ["亥"], 未: ["甲"],
        申: ["癸"], 酉: ["寅"], 戌: ["丙"], 亥: ["乙"], 子: ["巳"], 丑: ["庚"]
      }
    },
    {
      id: "yueDeGuiRen",
      name: "月德貴人",
      category: "貴人類",
      type: "branchGroupToStems",
      baseFields: ["monthBranch"],
      rules: {
        寅午戌: ["丙"],
        亥卯未: ["甲"],
        申子辰: ["壬"],
        巳酉丑: ["庚"]
      }
    },
    {
      id: "luShen",
      name: "祿神",
      category: "力量類",
      type: "stemToBranches",
      baseField: "dayStem",
      rules: {
        甲: ["寅"], 乙: ["卯"], 丙: ["巳"], 丁: ["午"], 戊: ["巳"],
        己: ["午"], 庚: ["申"], 辛: ["酉"], 壬: ["亥"], 癸: ["子"]
      }
    },
    {
      id: "yangRen",
      name: "羊刃",
      category: "力量類",
      type: "stemToBranches",
      baseField: "dayStem",
      rules: {
        甲: ["卯"], 乙: ["寅"], 丙: ["午"], 丁: ["巳"], 戊: ["午"],
        己: ["巳"], 庚: ["酉"], 辛: ["申"], 壬: ["子"], 癸: ["亥"]
      }
    },
    {
      id: "yiMa",
      name: "驛馬",
      category: "動象類",
      type: "branchGroupToBranches",
      baseFields: ["yearBranch", "dayBranch"],
      rules: { 申子辰: ["寅"], 寅午戌: ["申"], 巳酉丑: ["亥"], 亥卯未: ["巳"] }
    },
    {
      id: "taoHua",
      name: "桃花 / 咸池",
      category: "動象類",
      type: "branchGroupToBranches",
      baseFields: ["yearBranch", "dayBranch"],
      rules: { 申子辰: ["酉"], 寅午戌: ["卯"], 巳酉丑: ["午"], 亥卯未: ["子"] }
    },
    {
      id: "huaGai",
      name: "華蓋",
      category: "動象類",
      type: "branchGroupToBranches",
      baseFields: ["yearBranch", "dayBranch"],
      rules: { 申子辰: ["辰"], 寅午戌: ["戌"], 巳酉丑: ["丑"], 亥卯未: ["未"] }
    },
    {
      id: "jiangXing",
      name: "將星",
      category: "力量類",
      type: "branchGroupToBranches",
      baseFields: ["yearBranch", "dayBranch"],
      rules: { 申子辰: ["子"], 寅午戌: ["午"], 巳酉丑: ["酉"], 亥卯未: ["卯"] }
    },
    {
      id: "jieSha",
      name: "劫煞",
      category: "煞曜類",
      type: "branchGroupToBranches",
      baseFields: ["yearBranch", "dayBranch"],
      rules: { 申子辰: ["巳"], 寅午戌: ["亥"], 巳酉丑: ["寅"], 亥卯未: ["申"] }
    },
    {
      id: "zaiSha",
      name: "災煞",
      category: "煞曜類",
      type: "branchGroupToBranches",
      baseFields: ["yearBranch", "dayBranch"],
      rules: { 申子辰: ["午"], 寅午戌: ["子"], 巳酉丑: ["卯"], 亥卯未: ["酉"] }
    },
    {
      id: "wangShen",
      name: "亡神",
      category: "煞曜類",
      type: "branchGroupToBranches",
      baseFields: ["yearBranch", "dayBranch"],
      rules: { 申子辰: ["亥"], 寅午戌: ["巳"], 巳酉丑: ["申"], 亥卯未: ["寅"] }
    },
    {
      id: "guChen",
      name: "孤辰",
      category: "特殊類",
      type: "yearSeasonToBranches",
      baseField: "yearBranch",
      rules: {
        亥子丑: ["寅"],
        寅卯辰: ["巳"],
        巳午未: ["申"],
        申酉戌: ["亥"]
      }
    },
    {
      id: "guaSu",
      name: "寡宿",
      category: "特殊類",
      type: "yearSeasonToBranches",
      baseField: "yearBranch",
      rules: {
        亥子丑: ["戌"],
        寅卯辰: ["丑"],
        巳午未: ["辰"],
        申酉戌: ["未"]
      }
    },
    {
      id: "hongLuan",
      name: "紅鸞",
      category: "特殊類",
      type: "branchToBranches",
      baseField: "yearBranch",
      rules: {
        子: ["卯"], 丑: ["寅"], 寅: ["丑"], 卯: ["子"], 辰: ["亥"], 巳: ["戌"],
        午: ["酉"], 未: ["申"], 申: ["未"], 酉: ["午"], 戌: ["巳"], 亥: ["辰"]
      }
    },
    {
      id: "tianXi",
      name: "天喜",
      category: "特殊類",
      type: "branchToBranches",
      baseField: "yearBranch",
      rules: {
        子: ["酉"], 丑: ["申"], 寅: ["未"], 卯: ["午"], 辰: ["巳"], 巳: ["辰"],
        午: ["卯"], 未: ["寅"], 申: ["丑"], 酉: ["子"], 戌: ["亥"], 亥: ["戌"]
      }
    },
    {
      id: "kongWang",
      name: "空亡",
      category: "特殊類",
      type: "kongWang",
      baseField: "dayPillar"
    },
    {
      id: "kuiGang",
      name: "魁罡",
      category: "特殊類",
      type: "dayPillarInList",
      baseField: "dayPillar",
      rules: ["庚辰", "庚戌", "壬辰", "戊戌"]
    }
  ];

  function findYearSeasonRuleKey(branch, rules) {
    return Object.keys(rules).find((key) => key.includes(branch));
  }

  function buildDetail(rule, baseField, baseValue, targetType, targets, matches, extraCheckLabel) {
    return {
      ruleId: rule.id,
      name: rule.name,
      category: rule.category,
      baseField,
      baseLabel: FIELD_LABEL[baseField] || baseField,
      baseValue,
      targetType,
      targets: normalizeArray(targets),
      checkLabel: extraCheckLabel || ((FIELD_LABEL[baseField] || baseField) + "查" + (targetType === "stem" ? "天干" : targetType === "branch" ? "地支" : "四柱")),
      matchedPositions: matches.map((match) => ({
        pillar: match.pillar,
        pillarLabel: match.pillarLabel,
        fieldLabel: match.fieldLabel,
        value: match.value,
        type: match.type
      }))
    };
  }

  function evaluateRule(rule, pillars) {
    const details = [];

    if (rule.type === "stemToBranches" || rule.type === "branchToBranches") {
      const baseValue = getFieldValue(pillars, rule.baseField);
      const targets = rule.rules[baseValue] || [];
      const matches = matchTargets(pillars, "branch", targets);
      details.push(buildDetail(rule, rule.baseField, baseValue, "branch", targets, matches));
    }

    if (rule.type === "branchToMixedTargets") {
      const baseValue = getFieldValue(pillars, rule.baseField);
      const targets = normalizeArray(rule.rules[baseValue] || []);
      const stemTargets = targets.filter((target) => STEMS.includes(target));
      const branchTargets = targets.filter((target) => BRANCHES.includes(target));
      const matches = [
        ...matchTargets(pillars, "stem", stemTargets),
        ...matchTargets(pillars, "branch", branchTargets)
      ];
      details.push(buildDetail(rule, rule.baseField, baseValue, "mixed", targets, matches, (FIELD_LABEL[rule.baseField] || rule.baseField) + "查天干/地支"));
    }

    if (rule.type === "branchGroupToBranches" || rule.type === "branchGroupToStems") {
      for (const baseField of rule.baseFields) {
        const baseValue = getFieldValue(pillars, baseField);
        const group = findBranchGroup(baseValue);
        const targets = rule.rules[group] || [];
        const targetType = rule.type === "branchGroupToStems" ? "stem" : "branch";
        const matches = matchTargets(pillars, targetType, targets);
        details.push(buildDetail(rule, baseField, baseValue, targetType, targets, matches, (FIELD_LABEL[baseField] || baseField) + "所屬三合局「" + group + "」查" + (targetType === "stem" ? "天干" : "地支")));
      }
    }

    if (rule.type === "yearSeasonToBranches") {
      const baseValue = getFieldValue(pillars, rule.baseField);
      const group = findYearSeasonRuleKey(baseValue, rule.rules);
      const targets = group ? rule.rules[group] : [];
      const matches = matchTargets(pillars, "branch", targets);
      details.push(buildDetail(rule, rule.baseField, baseValue, "branch", targets, matches, (FIELD_LABEL[rule.baseField] || rule.baseField) + "所屬三會局「" + (group || "") + "」查地支"));
    }

    if (rule.type === "kongWang") {
      const dayPillar = getFieldValue(pillars, "dayPillar");
      const targets = getKongWangBranches(dayPillar);
      const matches = matchTargets(pillars, "branch", targets);
      details.push(buildDetail(rule, "dayPillar", dayPillar, "branch", targets, matches, "以日柱所在旬查空亡地支"));
    }

    if (rule.type === "dayPillarInList") {
      const dayPillar = getFieldValue(pillars, "dayPillar");
      const targets = normalizeArray(rule.rules);
      const matched = targets.includes(dayPillar);
      const matches = matched ? [{ pillar: "day", pillarLabel: "日柱", fieldLabel: "日柱", value: dayPillar, type: "pillar" }] : [];
      details.push(buildDetail(rule, "dayPillar", dayPillar, "pillar", targets, matches, "日柱干支直接查表"));
    }

    const matchedDetails = details.filter((detail) => detail.matchedPositions.length > 0);
    const allMatchedPositions = [];
    for (const detail of matchedDetails) {
      for (const position of detail.matchedPositions) {
        allMatchedPositions.push(position.fieldLabel + position.value);
      }
    }

    return {
      id: rule.id,
      name: rule.name,
      category: rule.category,
      matched: matchedDetails.length > 0,
      matchedPositions: uniq(allMatchedPositions),
      details,
      matchedDetails
    };
  }

  function calculateShenSha(pillars) {
    const items = SHEN_SHA_RULES.map((rule) => evaluateRule(rule, pillars));
    const matched = items.filter((item) => item.matched);
    const byPillar = {
      year: [],
      month: [],
      day: [],
      time: []
    };

    for (const item of matched) {
      for (const detail of item.matchedDetails) {
        for (const position of detail.matchedPositions) {
          if (byPillar[position.pillar]) {
            byPillar[position.pillar].push({
              id: item.id,
              name: item.name,
              category: item.category,
              fieldLabel: position.fieldLabel,
              value: position.value
            });
          }
        }
      }
    }

    for (const key of Object.keys(byPillar)) {
      const seen = new Set();
      byPillar[key] = byPillar[key].filter((item) => {
        const uniqueKey = item.id + "-" + item.fieldLabel + "-" + item.value;
        if (seen.has(uniqueKey)) return false;
        seen.add(uniqueKey);
        return true;
      });
    }

    return {
      sourceNote: "常見子平八字神煞查表；各派版本可能不同，可直接修改 shensha.js 的 SHEN_SHA_RULES。",
      totalRules: SHEN_SHA_RULES.length,
      matchedCount: matched.length,
      matched,
      items,
      byPillar
    };
  }

  global.SHEN_SHA_RULES = SHEN_SHA_RULES;
  global.calculateShenSha = calculateShenSha;
})(typeof window !== "undefined" ? window : globalThis);
