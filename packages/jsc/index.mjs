import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export function getJscBinaryPath() {
  const platform = process.platform === 'win32' ? 'windows' : process.platform;
  const arch = process.arch === 'x64' ? 'amd64' : process.arch;
  const ext = process.platform === 'win32' ? '.exe' : '';
  return join(__dirname, 'bin', `jsc-${platform}-${arch}${ext}`);
}
