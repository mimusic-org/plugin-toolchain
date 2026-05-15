import { execSync } from 'child_process';
import { mkdirSync, copyFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, 'bin');

const platforms = [
  { os: 'linux', arch: 'amd64', npmOs: 'linux', npmCpu: 'x64' },
  { os: 'linux', arch: 'arm64', npmOs: 'linux', npmCpu: 'arm64' },
  { os: 'darwin', arch: 'amd64', npmOs: 'darwin', npmCpu: 'x64' },
  { os: 'darwin', arch: 'arm64', npmOs: 'darwin', npmCpu: 'arm64' },
  { os: 'windows', arch: 'amd64', npmOs: 'win32', npmCpu: 'x64' },
  { os: 'windows', arch: 'arm64', npmOs: 'win32', npmCpu: 'arm64' },
];

// 平台子包目录映射
const PLATFORM_DIRS = {
  'linux-amd64': '../jsc-linux-x64/bin',
  'linux-arm64': '../jsc-linux-arm64/bin',
  'darwin-amd64': '../jsc-darwin-x64/bin',
  'darwin-arm64': '../jsc-darwin-arm64/bin',
  'windows-amd64': '../jsc-win32-x64/bin',
  'windows-arm64': '../jsc-win32-arm64/bin',
};

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

for (const { os, arch, npmOs, npmCpu } of platforms) {
  const ext = os === 'windows' ? '.exe' : '';
  const output = join(outputDir, `jsc-${os}-${arch}${ext}`);
  console.log(`Building jsc-${os}-${arch}${ext}...`);
  try {
    execSync(`go build -ldflags="-s -w" -o "${output}" .`, {
      cwd: __dirname,
      env: { ...process.env, GOOS: os, GOARCH: arch, CGO_ENABLED: '0' },
      stdio: 'inherit',
    });
    console.log(`✅ jsc-${os}-${arch}${ext}`);

    // 复制到对应子包目录
    const subPkgKey = `${os}-${arch}`;
    const subPkgBinDir = join(__dirname, PLATFORM_DIRS[subPkgKey]);
    if (!existsSync(subPkgBinDir)) {
      mkdirSync(subPkgBinDir, { recursive: true });
    }
    const binaryName = os === 'windows' ? 'jsc.exe' : 'jsc';
    const dest = join(subPkgBinDir, binaryName);
    copyFileSync(output, dest);
    console.log(`   → copied to ${PLATFORM_DIRS[subPkgKey]}/${binaryName}`);
  } catch (err) {
    console.error(`❌ Failed to build jsc-${os}-${arch}: ${err.message}`);
    process.exit(1);
  }
}

console.log('\nAll platforms built successfully!');
