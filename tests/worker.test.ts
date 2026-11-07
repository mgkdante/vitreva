import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'bun:test';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const config = JSON.parse(read('wrangler.json'));
const workflow = read('.github/workflows/deploy-worker.yml');

test('GitHub can read the workflow', () => {
  const { jobs } = Bun.YAML.parse(workflow) as { jobs: Record<string, unknown> };
  assert.deepEqual(Object.keys(jobs), ['build', 'deploy', 'alert']);
});

test('the Worker serves the static build and nothing else', () => {
  assert.equal(config.name, 'vitreva');
  assert.equal(config.main, undefined, 'the site needs no Worker code');
  assert.equal(config.assets.directory, './build');
  assert.equal(config.assets.not_found_handling, '404-page');
});

test('the Worker claims no address beyond its test address', () => {
  assert.equal(config.workers_dev, true);
  assert.equal(config.routes, undefined);
  assert.equal(config.route, undefined);
});

test('the noindex header cannot reach the live domain through the source', () => {
  assert.ok(!existsSync(new URL('../static/_headers', import.meta.url)));
  assert.ok(workflow.includes("X-Robots-Tag: noindex\\n' > build/_headers"));
  assert.ok(workflow.indexOf('build/_headers') > workflow.indexOf('bun run build'));
});

test('the test address keeps the form off', () => {
  assert.ok(!workflow.includes('PUBLIC_WEB3FORMS_ACCESS_KEY'));
});

test('the deploy waits for the checks and the token stays out of the build job', () => {
  const [build, afterBuild] = workflow.split(/^  deploy:$/m);
  assert.ok(afterBuild, 'no deploy job');
  assert.ok(afterBuild.includes('needs: build'));
  assert.ok(afterBuild.includes("if: github.ref == 'refs/heads/main'"));
  assert.ok(!/\bsecrets\b/.test(build), 'a secret reaches the job that runs dependency scripts');
  assert.ok(afterBuild.includes('--ignore-scripts'), 'dependency scripts run beside the token');
});
