import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'bun:test';
import { pagesContract, siteTextContract } from '../src/lib/content/contract.ts';
import { cmsConfig, CMS_CONFIG_PATH } from '../src/lib/content/cms.ts';

const locales = ['fr', 'en', 'es'] as const;
const read = (name: string) => readFileSync(new URL(`../src/lib/content/${name}`, import.meta.url), 'utf8');
const json = (name: string) => JSON.parse(read(name));
const clone = <T>(value: T): T => structuredClone(value);

type Field = {
  name: string;
  label?: string;
  widget: string;
  i18n?: boolean;
  required?: boolean;
  fields?: Field[];
  field?: Field;
  min?: number;
  max?: number;
  allow_add?: boolean;
  allow_remove?: boolean;
  allow_reorder?: boolean;
};

const config = cmsConfig() as { singletons: { name: string; file: string; i18n: boolean; fields: Field[] }[] };
const singleton = (name: string) => config.singletons.find((item) => item.name === name)!;
const find = (fields: Field[], path: string): Field => {
  const [head, ...rest] = path.split('.');
  const field = fields.find((item) => item.name === head);
  assert.ok(field, `no field ${head}`);
  return rest.length ? find(field.fields!, rest.join('.')) : field;
};
const walk = (fields: Field[], visit: (field: Field) => void) => {
  for (const field of fields) {
    visit(field);
    if (field.fields) walk(field.fields, visit);
    if (field.field) walk([field.field], visit);
  }
};

for (const locale of locales) {
  test(`${locale} text satisfies the contract`, () => {
    siteTextContract.parse(json(`${locale}.json`));
  });
  test(`${locale} pages satisfy the contract`, () => {
    pagesContract.parse(json(`pages.${locale}.json`));
  });
  test(`${locale} files keep the contract's order, so an editor save stays small`, () => {
    const format = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;
    assert.equal(read(`${locale}.json`).replace(/\r\n/g, '\n'), format(siteTextContract.parse(json(`${locale}.json`))));
    assert.equal(read(`pages.${locale}.json`).replace(/\r\n/g, '\n'), format(pagesContract.parse(json(`pages.${locale}.json`))));
  });
}

test('a blank required text is refused', () => {
  const content = clone(json('fr.json'));
  content.hero.subtitle = '   ';
  assert.equal(siteTextContract.safeParse(content).success, false);
});

test('a missing or misspelled field is refused', () => {
  const missing = clone(json('fr.json'));
  delete missing.hero.subtitle;
  assert.equal(siteTextContract.safeParse(missing).success, false);

  const misspelled = clone(json('fr.json'));
  misspelled.hero.subtitel = 'x';
  assert.equal(siteTextContract.safeParse(misspelled).success, false);
});

test('values the code depends on are not content', () => {
  const content = json('fr.json');
  assert.ok(content.panel.items.every((item: object) => !('level' in item)));
  assert.ok(content.situations.cards.every((card: object) => !('target' in card)));
  assert.ok(content.process.steps.every((step: object) => !('id' in step)));
});

test('lists the layout depends on keep their size', () => {
  for (const path of ['panel.items', 'situations.cards', 'process.steps']) {
    const content = clone(json('fr.json'));
    const [group, list] = path.split('.');
    content[group][list].pop();
    assert.equal(siteTextContract.safeParse(content).success, false, path);
  }
});

test('free lists can differ between languages', () => {
  const content = clone(json('en.json'));
  content.faq.items.pop();
  assert.notEqual(content.faq.items.length, json('fr.json').faq.items.length);
  assert.equal(siteTextContract.safeParse(content).success, true);
});

test('owners can change their own promises', () => {
  const content = clone(json('fr.json'));
  content.panel.items[2].value = '45 min';
  content.information.items[0].title = 'Installateurs certifiés';
  assert.equal(siteTextContract.safeParse(content).success, true);

  const pages = clone(json('pages.fr.json'));
  pages.about.meta.title = 'À propos';
  pages.about.sections[0].list = [];
  assert.equal(pagesContract.safeParse(pages).success, true);
});

test('legal pages may have no introduction', () => {
  const pages = json('pages.fr.json');
  assert.equal(pages.privacy.intro, '');
  assert.equal(pagesContract.safeParse(pages).success, true);
});

test('the CMS edits both content files, per language', () => {
  assert.equal(singleton('site-text').file, 'src/lib/content/{{locale}}.json');
  assert.equal(singleton('pages').file, 'src/lib/content/pages.{{locale}}.json');
  assert.equal(singleton('site-text').i18n, true);
});

test('every CMS field has a label and is translatable', () => {
  for (const { fields } of config.singletons) {
    walk(fields, (field) => {
      assert.ok(field.label?.trim(), `${field.name} has no label`);
      assert.equal(field.i18n, true, `${field.name} is not translatable`);
    });
  }
});

test('the CMS shows the main copy first', () => {
  const names = singleton('site-text').fields.map((field) => field.name);
  assert.equal(names[0], 'hero');
  assert.ok(names.indexOf('faq') < names.indexOf('navigation'));
  assert.ok(names.indexOf('quote') < names.indexOf('error'));
});

test('the CMS locks lists the layout depends on, and leaves free lists open', () => {
  const fixed = find(singleton('site-text').fields, 'panel.items');
  assert.deepEqual(
    [fixed.min, fixed.max, fixed.allow_add, fixed.allow_remove, fixed.allow_reorder],
    [4, 4, false, false, false]
  );

  const free = find(singleton('site-text').fields, 'faq.items');
  assert.equal(free.allow_add, undefined);
  assert.equal(free.allow_remove, undefined);
});

test('the CMS has no field for values the code depends on', () => {
  const items = find(singleton('site-text').fields, 'panel.items').fields!.map((field) => field.name);
  assert.deepEqual(items, ['value', 'title', 'body']);
});

test('lists of plain text use a single field, and may be empty where the contract allows', () => {
  const page = find(singleton('pages').fields, 'replacement.sections');
  const list = page.fields!.find((field) => field.name === 'list')!;
  assert.equal(list.field?.widget, 'string');
  assert.equal(list.required, false);
});

test('the committed CMS config matches the contract', () => {
  const committed = Bun.YAML.parse(readFileSync(new URL(`../${CMS_CONFIG_PATH}`, import.meta.url), 'utf8'));
  assert.deepEqual(committed, cmsConfig());
});
