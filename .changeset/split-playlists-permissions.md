---
"@mimusic/plugin-builder": minor
"create-mimusic-plugin": minor
---

**BREAKING**：权限系统重构为对称的读写细粒度模型。

之前 `playlists.*` 是唯一可声明的歌单权限（all-or-nothing，破坏最小权限原则），
而 `songs` 已经按 `.read` / `.write` 细分。本次对齐到同一设计。

- 新增合法权限：`playlists.read` / `playlists.write`
- 新增通配符糖：`songs.*` / `playlists.*`（一把梭写法，配合前缀匹配）
- 脚手架交互选项不再提供笼统的 `playlists.*`，改为 `playlists.read` + `playlists.write`
- 文档与后端 `AllPermissions` 完全对齐

完整权限集合：

```
storage
songs.read  songs.write  songs.*
playlists.read  playlists.write  playlists.*
inter-plugin  command
```

后端 action 映射保证 runtime 严格按读/写细粒度校验：只声明 `playlists.read` 的
插件调用 `mimusic.playlists.addSongs` 等写接口会被拒绝。

> 声明 `playlists.*` 的旧插件依然工作（通配符语义不变），但建议迁移到细粒度。
