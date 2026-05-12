// @mimusic/plugin-builder — 核心 build 逻辑

import * as esbuild from 'esbuild';
import JSZip from 'jszip';
import { readFileSync, writeFileSync, mkdirSync, existsSync, cpSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { readManifest, validateManifest } from './manifest.js';
import { computeEntryHash, computeCanonicalZipHash, sha256Hex } from './hash.js';
import type { PluginManifest } from '@mimusic/plugin-sdk';

export interface BuildOptions {
  cwd: string;
  outDir?: string;
  mode?: 'development' | 'production';
  sourcemap?: boolean;
}

export interface BuildResult {
  zipPath: string;
  manifest: PluginManifest;
  size: number;
  entryHash: string;
  zipHash: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: { field: string; message: string }[];
}

/**
 * 构建插件：TS/JS → QuickJS-compatible JS → .jsplugin.zip
 */
export async function buildPlugin(opts: BuildOptions): Promise<BuildResult> {
  const cwd = resolve(opts.cwd);
  const outDir = opts.outDir ? resolve(cwd, opts.outDir) : join(cwd, 'dist');
  const buildDir = join(outDir, '_build');
  const mode = opts.mode ?? 'production';

  // [1] 读取并校验 plugin.json
  const manifest = readManifest(cwd);
  const errors = validateManifest(manifest);
  if (errors.length > 0) {
    throw new Error(`Invalid plugin.json:\n${errors.map(e => `  - ${e.field}: ${e.message}`).join('\n')}`);
  }

  // [2] esbuild 打包 src/main.ts → build/main.js
  mkdirSync(buildDir, { recursive: true });
  const entryPoint = join(cwd, 'src', 'main.ts');
  const entryPointAlt = join(cwd, 'src', 'main.js');
  const actualEntry = existsSync(entryPoint) ? entryPoint : entryPointAlt;

  if (!existsSync(actualEntry)) {
    throw new Error(`Entry file not found: src/main.ts or src/main.js`);
  }

  await esbuild.build({
    entryPoints: [actualEntry],
    outfile: join(buildDir, 'main.js'),
    bundle: true,
    platform: 'neutral',
    format: 'iife',
    target: 'es2020',
    minify: mode === 'production',
    sourcemap: opts.sourcemap ? 'inline' : false,
    // 禁止使用 Node 内置模块
    plugins: [{
      name: 'no-node-builtins',
      setup(build) {
        build.onResolve({ filter: /^(fs|net|http|https|child_process|os|path|crypto|stream|util|events|buffer|url|querystring|zlib)$/ }, (args) => {
          return { errors: [{ text: `Node builtin "${args.path}" is not available in QuickJS runtime` }] };
        });
      },
    }],
  });

  // [3] 拷贝 static/ 到 build/（如果存在）
  const staticDir = join(cwd, 'static');
  if (existsSync(staticDir)) {
    cpSync(staticDir, join(buildDir, 'static'), { recursive: true });
  }

  // [4] 计算 entryHash
  const mainJsContent = readFileSync(join(buildDir, 'main.js'));
  const entryHash = computeEntryHash(mainJsContent);

  // [5] 计算 zipHash（排除 plugin.json）
  const zipHash = computeCanonicalZipHash(buildDir);

  // [6] 写入最终 plugin.json（含 hash）
  const finalManifest: PluginManifest = { ...manifest, entryHash, zipHash };
  writeFileSync(join(buildDir, 'plugin.json'), JSON.stringify(finalManifest, null, 2));

  // [7] 打包为 .jsplugin.zip
  mkdirSync(outDir, { recursive: true });
  const zip = new JSZip();
  addDirToZip(zip, buildDir, '');
  const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  const zipPath = join(outDir, `${manifest.entryPath}.jsplugin.zip`);
  writeFileSync(zipPath, zipBuffer);

  // [8] 生成远程元数据文件
  const metaPath = join(outDir, `${manifest.entryPath}.json`);
  writeFileSync(metaPath, JSON.stringify({
    version: manifest.version,
    download_url: `https://github.com/mimusic-org/plugins/releases/download/jsplugin-${manifest.entryPath}-${manifest.version}/${manifest.entryPath}.jsplugin.zip`,
  }, null, 2));

  // [9] 输出报告
  const mainJsGzip = Buffer.byteLength(mainJsContent);
  console.log(`\n✅ Build successful!`);
  console.log(`  📦 ${zipPath} (${(zipBuffer.length / 1024).toFixed(1)} KB)`);
  console.log(`  📄 main.js: ${(mainJsGzip / 1024).toFixed(1)} KB`);
  console.log(`  🔑 entryHash: ${entryHash}`);
  console.log(`  🔑 zipHash:   ${zipHash}\n`);

  return { zipPath, manifest: finalManifest, size: zipBuffer.length, entryHash, zipHash };
}

/**
 * 校验已构建的插件
 */
export async function validatePlugin(cwd: string): Promise<ValidationResult> {
  const resolvedCwd = resolve(cwd);
  const errors: { field: string; message: string }[] = [];

  // 读取 manifest
  let manifest: PluginManifest;
  try {
    manifest = readManifest(resolvedCwd);
  } catch {
    return { valid: false, errors: [{ field: 'plugin.json', message: 'cannot read plugin.json' }] };
  }

  // 字段校验
  const fieldErrors = validateManifest(manifest);
  errors.push(...fieldErrors);

  // hash 校验
  if (!manifest.entryHash || !manifest.zipHash) {
    errors.push({ field: 'hash', message: 'entryHash and zipHash are required. Run `mimusic-plugin build` first.' });
  }

  return { valid: errors.length === 0, errors };
}

// --- 工具 ---

import { readdirSync, statSync } from 'node:fs';

function addDirToZip(zip: JSZip, dirPath: string, prefix: string) {
  const items = readdirSync(dirPath);
  for (const item of items) {
    const fullPath = join(dirPath, item);
    const zipPath = prefix ? `${prefix}/${item}` : item;
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      addDirToZip(zip, fullPath, zipPath);
    } else {
      zip.file(zipPath, readFileSync(fullPath));
    }
  }
}
