# Changesets

本目录由 [changesets](https://github.com/changesets/changesets) 管理版本号与 Changelog。

## 推荐流程：CI 自动发版（Trusted Publishing）

```bash
# 1. 改完代码后生成一条 changeset（交互选包 + bump 级别 + 写一句 changelog）
pnpm changeset

# 2. 提交代码与 changeset，开 PR → 合并到 main
git add . && git commit -m "feat: ..." && git push

# 3. 合并后 CI 自动：
#    - 汇总所有待发 changeset 开一条 "Release PR"（版本号 + CHANGELOG）
#    - 合并 Release PR 后再次跑 CI，通过 OIDC 发布到 npm（无需 NPM_TOKEN）
```

## 本地一键发版（跳过 PR 流程）

```bash
pnpm run release:local
# 等价于：changeset version + git commit + changeset tag + git push --follow-tags
# push 后由 CI 自动 publish 到 npm
```

## 原子命令

| 命令 | 作用 |
|---|---|
| `pnpm changeset` | 创建一条变更描述（写入 `.changeset/*.md`） |
| `pnpm run release:version` | 消费所有 changeset → 升 `package.json` 版本 + 更新 CHANGELOG |
| `pnpm run release:tag` | 按当前版本打 git tag（如 `@mimusic/plugin-sdk@0.2.0`） |
| `pnpm run release` | 构建 + `changeset publish`（CI 专用） |

> ⚠️ **不要用 `pnpm version` / `pnpm tag`**：`pnpm version` 是 pnpm 内置命令（打印运行时版本），会屏蔽 package.json 里的同名 script。必须用 `pnpm run release:version` / `pnpm run release:tag`。

## 注意事项

- `@mimusic/plugin-sdk`、`@mimusic/plugin-builder`、`create-mimusic-plugin` 在 `config.json` 中配置为 `linked`，保证版本同步 bump。
- 模板中 `package.json` 引用的 `@mimusic/plugin-sdk` / `@mimusic/plugin-builder` 版本号请在发版脚本中同步更新（或由 `create-mimusic-plugin` 源码的常量 `SDK_VERSION` / `BUILDER_VERSION` 体现）。
- `examples/*` 为 `private: true`，`changeset publish` 不会将其发布到 npm。

