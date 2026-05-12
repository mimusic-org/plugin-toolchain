// @mimusic/plugin-sdk — 全局类型声明
// 该文件由 SDK 包安装后自动生效，为 QuickJS 运行时注入的全局对象提供类型。

// ===== 数据模型 =====

/** 歌曲对象 */
export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  filePath?: string;
  url?: string;
  coverPath?: string;
  type: 'local' | 'remote' | 'radio';
}

/** 歌单对象 */
export interface Playlist {
  id: number;
  name: string;
  type: 'normal' | 'radio';
  coverPath?: string;
  coverUrl?: string;
  songCount: number;
}

/** 插件清单（plugin.json） */
export interface PluginManifest {
  name: string;
  version: string;
  description?: string;
  author?: string;
  homepage?: string;
  license?: string;
  entryPath: string;
  main: string;
  minHostVersion?: string;
  permissions: string[];
  updateUrl?: string;
  download_url?: string;
  entryHash: string;
  zipHash: string;
}

// ===== HTTP 请求/响应 =====

/** 插件收到的 HTTP 请求 */
export interface HTTPRequest {
  method: string;
  path: string;
  headers: Record<string, string>;
  body: Uint8Array | null;
  query: string;
}

/** 插件返回的 HTTP 响应 */
export interface HTTPResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body?: string | Uint8Array;
}

// ===== mimusic 全局 API =====

export interface MimusicLog {
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
}

export interface MimusicStorage {
  get(key: string): unknown | null;
  set(key: string, value: unknown): void;
  delete(key: string): void;
  keys(): string[];
}

export interface MimusicSongs {
  list(options?: { limit?: number; offset?: number }): Song[];
  getById(id: number): Song | null;
  search(query: string): Song[];
}

export interface MimusicPlaylists {
  list(): Playlist[];
  getById(id: number): Playlist | null;
  getSongs(playlistId: number): Song[];
}

export interface MimusicComm {
  /** 发送单向消息到另一个插件 */
  send(to: string, action: string, payload: unknown): void;
  /** RPC 调用另一个插件并等待响应 */
  call(to: string, action: string, payload: unknown, timeoutMs?: number): Promise<unknown>;
  /** 注册消息处理器 */
  onMessage(action: string, handler: (payload: unknown, from: string) => unknown): void;
}

export interface Mimusic {
  log: MimusicLog;
  storage: MimusicStorage;
  songs: MimusicSongs;
  playlists: MimusicPlaylists;
  comm: MimusicComm;
}

// ===== 全局声明 =====

declare global {
  /** MiMusic 插件专属 API 命名空间 */
  const mimusic: Mimusic;

  /** 插件生命周期：初始化 */
  function onInit(): void;
  /** 插件生命周期：销毁 */
  function onDeinit(): void;
  /** 插件 HTTP 路由处理器 */
  function onHTTPRequest(req: HTTPRequest): HTTPResponse;

  // 由 polyfill 注入的标准全局 API（与浏览器/Node 对齐）
  function fetch(input: string, init?: RequestInit): Promise<Response>;
  function setTimeout(fn: () => void, ms: number): number;
  function clearTimeout(id: number): void;
  function setInterval(fn: () => void, ms: number): number;
  function clearInterval(id: number): void;
}

export {};
