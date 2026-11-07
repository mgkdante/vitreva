import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'bun:test';
import { canonicalJson, type CmsField } from '@yesid/content-contract';
import { cmsConfig, CMS_CONFIG_PATH, contentGroups } from '../src/lib/content/cms.ts';
import { homeContract, pageContract } from '../src/lib/content/contract.ts';
import { locales } from '../src/lib/content/locales.ts';

const read = (name: string) => readFileSync(new URL(`../src/lib/content/${name}`, import.meta.url), 'utf8');
const json = (name: string) => JSON.parse(read(name));
const clone = <T>(value: T): T => structuredClone(value);

const contentFiles = contentGroups.flatMap((group) => group.files);
const pathOf = (name: string, locale: string) => `${name}.${locale}.json`;

type Group = { name: string; label: string; files: { name: string; file: string; i18n: boolean; fields: CmsField[] }[] };
const groups = cmsConfig().collections as Group[];
const fieldsOf = (name: string) => groups.flatMap((group) => group.files).find((file) => file.name === name)!.fields;

const find = (fields: CmsField[], path: string): CmsField => {
  const [head, ...rest] = path.split('.');
  const field = fields.find((item) => item.name === head);
  assert.ok(field, `no field ${head}`);
  return rest.length ? find(field.fields as CmsField[], rest.join('.')) : field;
};
const walk = (fields: CmsField[], visit: (field: CmsField) => void) => {
  for (const field of fields) {
    visit(field);
    if (field.fields) walk(field.fields as CmsField[], visit);
    if (field.field) walk([field.field as CmsField], visit);
  }
};

for (const locale of locales) {
  for (const { name, contract } of contentFiles) {
    test(`${pathOf(name, locale)} satisfies the contract, in the order an editor save keeps`, () => {
      const text = read(pathOf(name, locale));
      contract.parse(JSON.parse(text));
      assert.equal(text.replace(/\r\n/g, '\n'), canonicalJson(contract, text));
    });
  }
}

test('every content file on disk can be edited, and every editable file exists', () => {
  const expected = locales.flatMap((locale) => contentFiles.map(({ name }) => pathOf(name, locale))).sort();
  const onDisk = readdirSync(new URL('../src/lib/content/', import.meta.url)).filter((name) => name.endsWith('.json')).sort();
  assert.deepEqual(onDisk, expected);
});

test('a blank required text is refused', () => {
  const content = clone(json('home.fr.json'));
  content.hero.subtitle = '   ';
  assert.equal(homeContract.safeParse(content).success, false);
});

test('a missing or misspelled field is refused', () => {
  const missing = clone(json('home.fr.json'));
  delete missing.hero.subtitle;
  assert.equal(homeContract.safeParse(missing).success, false);

  const misspelled = clone(json('home.fr.json'));
  misspelled.hero.subtitel = 'x';
  assert.equal(homeContract.safeParse(misspelled).success, false);
});

test('values the code depends on are not content', () => {
  const content = json('home.fr.json');
  assert.ok(content.panel.items.every((item: object) => !('level' in item)));
  assert.ok(content.situations.cards.every((card: object) => !('target' in card)));
  assert.ok(content.process.steps.every((step: object) => !('id' in step)));
});

test('lists the layout depends on keep their size', () => {
  for (const path of ['panel.items', 'situations.cards', 'process.steps']) {
    const content = clone(json('home.fr.json'));
    const [group, list] = path.split('.');
    content[group][list].pop();
    assert.equal(homeContract.safeParse(content).success, false, path);
  }
});

test('free lists can differ between languages', () => {
  const content = clone(json('home.en.json'));
  content.faq.items.pop();
  assert.notEqual(content.faq.items.length, json('home.fr.json').faq.items.length);
  assert.equal(homeContract.safeParse(content).success, true);
});

test('owners can change their own promises', () => {
  const content = clone(json('home.fr.json'));
  content.panel.items[2].value = '45 min';
  content.information.items[0].title = 'Installateurs certifiés';
  assert.equal(homeContract.safeParse(content).success, true);

  const page = clone(json('about.fr.json'));
  page.meta.title = 'À propos';
  page.sections[0].list = [];
  assert.equal(pageContract.safeParse(page).success, true);
});

test('legal pages may have no introduction', () => {
  const page = json('privacy.fr.json');
  assert.equal(page.intro, '');
  assert.equal(pageContract.safeParse(page).success, true);
});

test('the editor is laid out like the site', () => {
  assert.deepEqual(groups.map((group) => group.label), ['Pages', 'Partout sur le site', 'Textes légaux']);
  assert.equal(groups[0].files[0].name, 'home');
});

test('the home page form follows the order the page is read in', () => {
  const home = readFileSync(new URL('../src/routes/[[lang=lang]]/+page.svelte', import.meta.url), 'utf8');
  const onPage = [...home.matchAll(/content=\{content\.(\w+)\}/g)].map((match) => match[1]);
  const inForm = fieldsOf('home').map((field) => field.name).filter((name) => onPage.includes(name));
  assert.deepEqual(inForm, onPage.filter((name) => inForm.includes(name)));
  assert.equal(fieldsOf('home')[0].name, 'hero');
});

test('text repeated across pages is edited with the shared items', () => {
  const home = fieldsOf('home');
  assert.ok(!(find(home, 'hero').fields as CmsField[]).some((field) => field.name === 'freeQuote'));
  assert.equal(find(fieldsOf('menu'), 'navigation.freeQuote').widget, 'string');
});

test('every CMS field has a label and is translatable', () => {
  for (const group of groups) {
    for (const { fields, i18n } of group.files) {
      assert.equal(i18n, true);
      walk(fields, (field) => {
        assert.ok(field.label?.trim(), `${field.name} has no label`);
        assert.equal(field.i18n, true, `${field.name} is not translatable`);
      });
    }
  }
});

test('the CMS locks lists the layout depends on, and leaves free lists open', () => {
  const fixed = find(fieldsOf('home'), 'panel.items');
  assert.deepEqual(
    [fixed.min, fixed.max, fixed.allow_add, fixed.allow_remove, fixed.allow_reorder],
    [4, 4, false, false, false]
  );

  const free = find(fieldsOf('home'), 'faq.items');
  assert.equal(free.allow_add, undefined);
  assert.equal(free.allow_remove, undefined);
});

test('the CMS has no field for values the code depends on', () => {
  const items = (find(fieldsOf('home'), 'panel.items').fields as CmsField[]).map((field) => field.name);
  assert.deepEqual(items, ['value', 'title', 'body']);
});

test('lists of plain text use a single field, and may be empty where the contract allows', () => {
  const list = (find(fieldsOf('replacement'), 'sections').fields as CmsField[]).find((field) => field.name === 'list')!;
  assert.equal((list.field as CmsField).widget, 'string');
  assert.equal(list.required, false);
});

test('the committed CMS config matches the contract', () => {
  const committed = Bun.YAML.parse(readFileSync(new URL(`../${CMS_CONFIG_PATH}`, import.meta.url), 'utf8'));
  assert.deepEqual(committed, cmsConfig());
});
