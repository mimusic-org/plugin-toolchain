# MiMusic Plugin Toolchain

用于开发 [MiMusic](https://github.com/mimusic-org/mimusic) JS 插件的工具链 monorepo。

## 包

| 包 | 说明 |
|---|------|
| [`@mimusic/plugin-sdk`](./packages/plugin-sdk) | 全局类型声明 + 运行时 helper（路由、jsonResponse 等） |
| [`@mimusic/plugin-builder`](./packages/plugin-builder) | CLI：`build` / `validate` / `dev` / `publish`（esbuild + zip 打包 + hash 生成） |
| [`create-mimusic-plugin`](./packages/create-mimusic-plugin) | `pnpm create mimusic-plugin` 脚手架，从模板生成新插件项目 |

## 快速开始（发布后）

```bash
# 脚手架创建插件
pnpm create mimusic-plugin my-plugin
cd my-plugin
pnpm install
pnpm run build
# 产物：dist/<entryPath>.jsplugin.zip —— 到 MiMusic 后台上传即可
```

## 本地开发

```bash
pnpm install
pnpm --filter "./packages/*" build    # 构建三个发布包
pnpm --filter "./examples/*" build    # （可选）验证模板示例
```

> ⚠️ 首次 `pnpm install` 时 pnpm 会 WARN无法为 `examples/basic` 创建 `mimusic-plugin` bin 链接（因为 `plugin-builder/dist/cli.js` 尚未构建），属正常现象。build 完成后如需构建 examples，先运行 `pnpm install --force` 刷新 bin 链接。

## 发版

基于 [Changesets](https://github.com/changesets/changesets) + npm [Trusted Publishing](https://docs.npmjs.com/trusted-publishers)（OIDC，无需 NPM_TOKEN）。

### 推荐：CI 自动发版

```bash
# 1. 写代码 + 记录变更
pnpm changeset                         # 交互选包 + bump 级别 + 写 changelog
git add . && git commit -m "feat: ..."
git push                               # 开 PR → 合并到 main

# 2. CI 自动开一条 Release PR，合并后再次跑 release.yml，通过 OIDC 发 npm
```

### 本地一键发版（跳过 PR）

```bash
pnpm changeset                         # 记录变更
pnpm run release:local                 # version + commit + tag + push --follow-tags
# 后续由 CI 自动 publish
```

### 脚本一览

| 脚本 | 作用 |
|---|---|
| `pnpm changeset` | 创建变更描述 |
| `pnpm run release:version` | 消费 changeset → 升版本 + 更新 CHANGELOG |
| `pnpm run release:tag` | 打 git tag（`@scope/pkg@x.y.z`） |
| `pnpm run release:local` | 本地一键：version + commit + tag + push |
| `pnpm run release` | 构建 + `changeset publish`（CI 专用） |

> ⚠️ 不要用 `pnpm version`/`pnpm tag`——`pnpm version` 是 pnpm 内置命令，会屏蔽同名 script。必须显式 `pnpm run release:version`。

## License

Apache-2.0
