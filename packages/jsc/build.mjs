import { execSync } from 'child_process';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, 'bin');

const platforms = [
  { os: 'linux', arch: 'amd64' },
  { os: 'linux', arch: 'arm64' },
  { os: 'darwin', arch: 'amd64' },
  { os: 'darwin', arch: 'arm64' },
  { os: 'windows', arch: 'amd64' },
  { os: 'windows', arch: 'arm64' },
];

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

for (const { os, arch } of platforms) {
  const ext = os === 'windows' ? '.exe' : '';
  const output = join(outputDir, `jsc-${os}-${arch}${ext}`);
  console.log(`Building ${output}...`);
  try {
    execSync(`go build -ldflags="-s -w" -o "${output}" .`, {
      cwd: __dirname,
      env: { ...process.env, GOOS: os, GOARCH: arch, CGO_ENABLED: '0' },
      stdio: 'inherit',
    });
    console.log(`✅ jsc-${os}-${arch}${ext}`);
  } catch (err) {
    console.error(`❌ Failed to build jsc-${os}-${arch}: ${err.message}`);
    process.exit(1);
  }
}

console.log('\nAll platforms built successfully!');
