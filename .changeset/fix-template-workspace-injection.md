---
'create-mimusic-plugin': patch
---

fix(scaffold): switch template deps to `workspace:^` so SDK/BUILDER_VERSION actually injects

- 模板 `templates/basic/package.json` 中硬编码的 `^0.1.0` 改为 `workspace:^`，让 scaffold 运行期的 workspace 重写逻辑真正生效（修复此前 `SDK_VERSION` / `BUILDER_VERSION` 常量从未被注入生成物的 bug）。
- 新增 `scripts/verify-scaffold.mjs` 离线验证脚手架输出，运行 `node packages/create-mimusic-plugin/scripts/verify-scaffold.mjs` 可一键检查生成的 `package.json` / `plugin.json` 是否符合预期。

影响：继 0.4.1 将常量升到 `^0.3.0` / `^0.4.0` 后，本次修复确保该值真正写入用户生成的项目；否则模板里的 `^0.1.0` 会直接透传，常量升级形同虚设。
