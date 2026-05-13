---
'create-mimusic-plugin': patch
---

fix(scaffold): bump generated project default deps to `@mimusic/plugin-sdk ^0.3.0` / `@mimusic/plugin-builder ^0.4.0`

脚手架生成的新项目默认依赖从 `^0.1.0` 升级到当前 npm 最新稳定版，避免新生成的插件因使用过时的 plugin-builder 而在 `playlists.read` / `playlists.write` 等权限声明上被拒。
