# Changesets

本目录由 [changesets](https://github.com/changesets/changesets) 管理版本号与 Changelog。

## 使用方式

```bash
# 1. 为变更生成一条 changeset（会交互询问影响的包 + bump 级别 + 说明）
pnpm changeset

# 2. 本地应用（bump 版本号 + 生成 CHANGELOG）
pnpm changeset version

# 3. 发布到 npm
pnpm changeset publish
```

## 注意事项

- `@mimusic/plugin-sdk`、`@mimusic/plugin-builder`、`create-mimusic-plugin` 目前配置为 `linked`，保证版本同步 bump。
- 模板中 `package.json` 引用的 `@mimusic/plugin-sdk` / `@mimusic/plugin-builder` 版本号请在发版脚本中同步更新（或由 `create-mimusic-plugin` 源码的常量 `SDK_VERSION` / `BUILDER_VERSION` 体现）。
