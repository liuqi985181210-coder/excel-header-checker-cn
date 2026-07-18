import { analyzeHeaderGroups } from "./checker.js";

const form = document.querySelector("#checker-form");
const result = document.querySelector("#result");
const exampleButton = document.querySelector("#load-example");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderSource(source) {
  const missing = source.missing.length
    ? `<div class="missing"><strong>缺少字段</strong><p>${escapeHtml(source.missing.join("、"))}</p></div>`
    : `<div class="complete"><strong>字段完整</strong><p>没有发现需要补齐的字段。</p></div>`;
  const duplicates = source.duplicates.length
    ? `；重复字段：${escapeHtml(source.duplicates.join("、"))}`
    : "";

  return `
    <article>
      <h3>${escapeHtml(source.name)}</h3>
      <p>识别 ${source.fieldCount} 个字段${duplicates}</p>
      ${missing}
    </article>
  `;
}

function renderAnalysis(analysis) {
  if (!analysis.ok) {
    result.innerHTML = `<p class="empty">${escapeHtml(analysis.message)}</p>`;
    return;
  }

  const label =
    analysis.status === "direct"
      ? "可直接合并"
      : analysis.status === "fill"
        ? "需要补列"
        : "需要映射";

  result.innerHTML = `
    <section class="verdict ${analysis.status}">
      <span>${label}</span>
      <h2>${escapeHtml(analysis.headline)}</h2>
      <p>${escapeHtml(analysis.detail)}</p>
    </section>
    <section class="numbers">
      <div><strong>${analysis.sourceCount}</strong><span>文件</span></div>
      <div><strong>${analysis.union.length}</strong><span>完整字段</span></div>
      <div><strong>${analysis.common.length}</strong><span>共有字段</span></div>
    </section>
    <section class="file-results">
      ${analysis.sources.map(renderSource).join("")}
    </section>
    <p class="limit">这里只检查表头结构，不读取行数据，也不判断金额、日期或业务规则。</p>
  `;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  renderAnalysis(
    analyzeHeaderGroups([
      { name: data.get("name-1"), headers: data.get("headers-1") },
      { name: data.get("name-2"), headers: data.get("headers-2") },
    ]),
  );
});

exampleButton.addEventListener("click", () => {
  form.elements["name-1"].value = "门店销售_一店.xlsx";
  form.elements["headers-1"].value =
    "日期, 门店, 订单号, 客户名称, 商品, 数量, 单价, 金额";
  form.elements["name-2"].value = "门店销售_二店.csv";
  form.elements["headers-2"].value =
    "订单号, 日期, 门店, 客户名称, 商品, 数量, 单价, 金额, 业务员";
  result.innerHTML = "";
});
