// @mimusic/plugin-builder — CLI 入口
import { buildPlugin, validatePlugin } from './build.js';

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case 'build': {
      const mode = args.includes('--mode') ? args[args.indexOf('--mode') + 1] as 'development' | 'production' : 'production';
      const sourcemap = args.includes('--sourcemap');
      await buildPlugin({ cwd: process.cwd(), mode, sourcemap });
      break;
    }
    case 'validate': {
      const result = await validatePlugin(process.cwd());
      if (!result.valid) {
        console.error('❌ Validation failed:');
        for (const err of result.errors) {
          console.error(`  - ${err.field}: ${err.message}`);
        }
        process.exit(1);
      } else {
        console.log('✅ Plugin is valid.');
      }
      break;
    }
    case 'dev': {
      console.log('⚠️  dev command not yet implemented (coming in v0.2)');
      break;
    }
    case 'publish': {
      console.log('⚠️  publish command not yet implemented (coming in v0.2)');
      break;
    }
    default:
      console.log(`Usage: mimusic-plugin <command>

Commands:
  build       Build the plugin into a .jsplugin.zip
  validate    Validate plugin.json and hashes
  dev         Watch & auto-upload to local MiMusic (WIP)
  publish     Tag & trigger GitHub release (WIP)

Options:
  --mode <mode>      Build mode: production (default) or development
  --sourcemap        Include inline source maps
`);
      if (command) {
        console.error(`Unknown command: ${command}`);
        process.exit(1);
      }
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
