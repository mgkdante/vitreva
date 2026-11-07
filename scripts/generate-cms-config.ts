// Writes the Sveltia CMS configuration from the Content Contract. Run after changing the contract.
// `--branch=name --out=path` writes a copy for a test branch, leaving the committed file alone.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { cmsConfig, CMS_CONFIG_PATH } from '../src/lib/content/cms.ts';

const option = (name: string) => process.argv.find((arg) => arg.startsWith(`--${name}=`))?.split('=')[1];
const out = resolve(option('out') ?? CMS_CONFIG_PATH);

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `# Generated from src/lib/content/contract.ts. Run \`bun run cms:config\` instead of editing.\n${Bun.YAML.stringify(cmsConfig({ branch: option('branch') }), null, 2)}\n`);
