---
"@mimusic/plugin-builder": patch
"create-mimusic-plugin": patch
---

修复：插件 `permissions` 白名单对齐 MiMusic 后端运行时。

- `plugin-builder` 的 validator 去掉 `playlists.read` / `playlists.write`，改为 `playlists.*`（后端只以通配符形式暴露歌单权限）。
- `create-mimusic-plugin` 脚手架权限选项：删除后端未实现的 `network` / `config.read` / `config.write`；补齐缺失的 `storage` / `inter-plugin` / `command`；将 `playlists.read/write` 合并为 `playlists.*`。

最终统一后的合法权限集合（与 `internal/jsplugin/permissions.go` 的 `AllPermissions` 严格一致）：

```
storage  songs.read  songs.write  playlists.*  inter-plugin  command
```

这修复了脚手架生成的 `plugin.json` 无法通过 build 校验，以及就算构建成功上传后端也会 `ValidatePermissions` 失败的问题。
