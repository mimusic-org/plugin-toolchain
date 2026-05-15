/**
 * Returns the absolute path to the jsc binary for the current platform.
 * Resolves from the platform-specific sub-package (e.g. @mimusic/jsc-linux-x64),
 * or falls back to a local bin/ directory for development.
 */
export function getJscBinaryPath(): string;
