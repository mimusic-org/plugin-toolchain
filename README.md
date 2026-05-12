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
pnpm -r build
```

## 发布

使用 [Changesets](https://github.com/changesets/changesets) 管理版本：

```bash
pnpm changeset                 # 记录变更
pnpm changeset version         # bump 版本 + 生成 CHANGELOG
git commit -am "chore: release"
git push                       # GitHub Actions 自动发布到 npm
```

## License

Apache-2.0
