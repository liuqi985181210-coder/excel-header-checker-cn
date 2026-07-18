import assert from "node:assert/strict";
import test from "node:test";
import {
  analyzeHeaderGroups,
  normalizeHeader,
  splitHeaders,
} from "./checker.js";

test("splits common pasted header formats", () => {
  assert.deepEqual(splitHeaders("日期\t门店,订单号\n金额"), [
    "日期",
    "门店",
    "订单号",
    "金额",
  ]);
});

test("normalizes cosmetic header differences", () => {
  assert.equal(normalizeHeader("客户 名称"), normalizeHeader("客户_名称"));
  assert.equal(normalizeHeader("Order-ID"), normalizeHeader("order id"));
});

test("marks equal header sets as directly mergeable regardless of order", () => {
  const result = analyzeHeaderGroups([
    { name: "A", headers: "日期,门店,金额" },
    { name: "B", headers: "金额,日期,门店" },
  ]);

  assert.equal(result.ok, true);
  assert.equal(result.status, "direct");
  assert.equal(result.union.length, 3);
  assert.equal(result.common.length, 3);
});

test("marks one extra field as a missing-column merge", () => {
  const result = analyzeHeaderGroups([
    { name: "A", headers: "日期,门店,订单号,客户,金额" },
    { name: "B", headers: "日期,门店,订单号,客户,金额,业务员" },
  ]);

  assert.equal(result.ok, true);
  assert.equal(result.status, "fill");
  assert.deepEqual(result.sources[0].missing, ["业务员"]);
});

test("marks weak overlap as requiring mapping", () => {
  const result = analyzeHeaderGroups([
    { name: "A", headers: "日期,客户,金额" },
    { name: "B", headers: "时间,门店,数量" },
  ]);

  assert.equal(result.ok, true);
  assert.equal(result.status, "map");
});

test("requires at least two non-empty groups", () => {
  const result = analyzeHeaderGroups([
    { name: "A", headers: "日期,金额" },
    { name: "B", headers: "" },
  ]);

  assert.equal(result.ok, false);
});
