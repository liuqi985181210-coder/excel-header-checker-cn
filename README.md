# Excel 多表合并表头检查器

一个无需上传 Excel 的免费小工具：只粘贴两份表头，在浏览器本地判断多个文件是否可以直接按列名合并、需要补齐哪些列，或是否应先做字段映射。

## 适合什么情况

- 多个门店、部门或月份分别导出 Excel / CSV；
- 不确定不同文件的列顺序、缺失列或字段命名是否兼容；
- 想先检查结构，再决定用 Power Query、脚本或本地定制工具；
- 不希望把完整业务文件上传到第三方网站。

## 隐私边界

- 页面不包含文件上传控件；
- 检查逻辑只在当前浏览器运行；
- 不保存粘贴的表头；
- 请勿粘贴客户姓名、金额、账号、身份证、银行卡或任何真实业务数据。

## 在线使用

- [主站版：打开在线表头检查器](https://excel-local-tools.liuqi985181210.chatgpt.site/excel-header-compatibility-checker)
- [GitHub Pages 开源镜像](https://liuqi985181210-coder.github.io/excel-header-checker-cn/)

## 需要重复运行的固定流程

如果你每周或每月都要合并、拆分或生成对账表，可以先提交脱敏表头、人工步骤、文件数量和期望输出：

[查看 Excel 多表合并与 Windows 本地流程](https://excel-local-tools.liuqi985181210.chatgpt.site/excel-multi-file-merge)

- 99 元：一个明确、可单独验收的基础处理结果；
- 199 元起：可重复运行的固定 Windows 本地流程；
- 复杂规则在确认脱敏样例、范围和验收方式后报价；
- 咨询和交易在平台内完成，不要求站外付款。

## 本地运行

这是纯静态页面。用任意静态服务器打开即可，例如：

```powershell
python -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 测试

```powershell
node --test test.mjs
```

## 许可证

MIT
