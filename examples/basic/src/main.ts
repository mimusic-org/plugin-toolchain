/// <reference types="@mimusic/plugin-sdk" />
import { jsonResponse, createRouter } from '@mimusic/plugin-sdk';

const router = createRouter();

router.get('/hello', (req) => {
  return jsonResponse({
    message: 'Hello from example-basic!',
    query: req.query,
  });
});

router.get('/songs', (req) => {
  const limitStr = req.query['limit'] ?? '10';
  const limit = Math.max(1, Math.min(100, Number.parseInt(limitStr, 10) || 10));
  const songs = mimusic.songs.list({ limit });
  return jsonResponse({ count: songs.length, songs });
});

router.get('/songs/:id', (req) => {
  const id = Number.parseInt(req.params['id'] ?? '', 10);
  if (!Number.isFinite(id) || id <= 0) {
    return jsonResponse({ error: 'invalid id' }, 400);
  }
  const song = mimusic.songs.get(id);
  if (!song) return jsonResponse({ error: 'not found' }, 404);
  return jsonResponse(song);
});

router.get('/', () => {
  return {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: '<h1>example-basic</h1><p>Try <a href="hello">/hello</a> or <a href="songs">/songs</a>.</p>',
  };
});

function onInit(): void {
  mimusic.log.info('example-basic initialized');
}

function onDeinit(): void {
  mimusic.log.info('example-basic deinitialized');
}

function onHTTPRequest(req: HTTPRequest): HTTPResponse {
  return router.handle(req);
}

// @ts-expect-error — QuickJS global injection
globalThis.onInit = onInit;
// @ts-expect-error
globalThis.onDeinit = onDeinit;
// @ts-expect-error
globalThis.onHTTPRequest = onHTTPRequest;
