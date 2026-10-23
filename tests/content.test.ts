import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const readContent = (locale: string) => JSON.parse(readFileSync(new URL(`../src/lib/content/${locale}.json`, import.meta.url), 'utf8'));

function validateContent(actual: unknown, expected: unknown, path: string) {
  assert.equal(typeof actual, typeof expected, path);
  if (typeof expected === 'string') {
    assert.ok((actual as string).trim().length > 0, `${path} is empty`);
  } else if (Array.isArray(expected)) {
    assert.ok(Array.isArray(actual), path);
    assert.equal(actual.length, expected.length, path);
    expected.forEach((value, index) => validateContent(actual[index], value, `${path}[${index}]`));
  } else if (expected && typeof expected === 'object') {
    assert.ok(actual && typeof actual === 'object', path);
    assert.deepEqual(Object.keys(actual).sort(), Object.keys(expected).sort(), path);
    for (const [key, value] of Object.entries(expected)) {
      validateContent((actual as Record<string, unknown>)[key], value, `${path}.${key}`);
    }
  }
}

for (const locale of ['fr', 'en', 'es']) {
  test(`${locale} includes complete page, form and error content`, () => {
    const source = readContent('fr');
    const translated = readContent(locale);
    validateContent(translated, source, locale);
    translated.process.steps.forEach((step: { id: string; image: string }, index: number) => {
      assert.equal(step.id, source.process.steps[index].id);
      assert.equal(step.image, source.process.steps[index].image);
    });
  });
}
