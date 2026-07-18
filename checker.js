export function splitHeaders(value) {
  return String(value ?? "")
    .split(/[\t,，|｜;\n\r]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeHeader(value) {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase("zh-CN")
    .replace(/[\s_\-—–·.。/\\()[\]（）【】]+/g, "");
}

export function analyzeHeaderGroups(groups) {
  const sources = groups
    .map((group, index) => {
      const headers = splitHeaders(group.headers);
      const normalized = new Map();
      const duplicates = [];

      for (const header of headers) {
        const key = normalizeHeader(header);
        if (!key) continue;
        if (normalized.has(key)) {
          duplicates.push(header);
        } else {
          normalized.set(key, header);
        }
      }

      return {
        name: String(group.name || `文件 ${index + 1}`).trim(),
        headers,
        normalized,
        duplicates,
      };
    })
    .filter((source) => source.normalized.size > 0);

  if (sources.length < 2) {
    return {
      ok: false,
      message: "请至少填写两个文件的表头。",
    };
  }

  const unionKeys = new Set();
  for (const source of sources) {
    for (const key of source.normalized.keys()) unionKeys.add(key);
  }

  const commonKeys = [...unionKeys].filter((key) =>
    sources.every((source) => source.normalized.has(key)),
  );
  const displayName = (key) =>
    sources.find((source) => source.normalized.has(key))?.normalized.get(key) ??
    key;

  const sourceResults = sources.map((source) => ({
    name: source.name,
    fieldCount: source.normalized.size,
    duplicates: source.duplicates,
    missing: [...unionKeys]
      .filter((key) => !source.normalized.has(key))
      .map(displayName),
  }));

  const allSame = sourceResults.every(
    (source) =>
      source.fieldCount === unionKeys.size && source.missing.length === 0,
  );
  const overlap = unionKeys.size === 0 ? 0 : commonKeys.length / unionKeys.size;

  let status;
  let headline;
  let detail;

  if (allSame) {
    status = "direct";
    headline = "表头一致，可以直接按列名合并";
    detail =
      "列顺序不同也没关系；合并时仍应保留来源文件列，并核对输入与输出总行数。";
  } else if (overlap >= 0.6) {
    status = "fill";
    headline = "基本可以合并，但需要补齐缺失列";
    detail =
      "建议生成完整字段集合，某个文件没有的字段留空，不要按列位置直接拼接。";
  } else {
    status = "map";
    headline = "字段差异较大，先做字段映射再合并";
    detail =
      "先确认哪些列是同一含义；无法确认的字段应保留原名并单独复核。";
  }

  return {
    ok: true,
    status,
    headline,
    detail,
    sourceCount: sources.length,
    union: [...unionKeys].map(displayName),
    common: commonKeys.map(displayName),
    sources: sourceResults,
  };
}
