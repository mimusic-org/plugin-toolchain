/// <reference types="@mimusic/plugin-sdk" />
import { jsonResponse, createRouter } from '@mimusic/plugin-sdk';

const router = createRouter();

router.get('/hello', (req) => {
  return jsonResponse({ message: 'Hello from {{name}}!', query: req.query });
});

router.get('/songs', () => {
  const songs = mimusic.songs.list({ limit: 10 });
  return jsonResponse({ count: songs.length, songs });
});

function onInit(): void {
  mimusic.log.info('{{name}} initialized');
}

function onDeinit(): void {
  mimusic.log.info('{{name}} deinitialized');
}

function onHTTPRequest(req: HTTPRequest): HTTPResponse {
  return router.handle(req);
}

// 暴露为全局（QuickJS 需要显式声明）
// @ts-expect-error — QuickJS global injection
globalThis.onInit = onInit;
// @ts-expect-error
globalThis.onDeinit = onDeinit;
// @ts-expect-error
globalThis.onHTTPRequest = onHTTPRequest;
