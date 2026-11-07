import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'bun:test';
import { cmsConfig, contentGroups } from '../src/lib/content/cms.ts';
import { businessContract } from '../src/lib/content/contract.ts';
import { factTokens, fillFacts, openDays, phoneNumber, townGroups, type BusinessFacts } from '../src/lib/content/facts.ts';
import { locales } from '../src/lib/content/locales.ts';

const contentDir = new URL('../src/lib/content/', import.meta.url);
const read = (name: string) => readFileSync(new URL(name, contentDir), 'utf8');
const business = (locale: string): BusinessFacts => JSON.parse(read(`business.${locale}.json`));
const clone = <T>(value: T): T => structuredClone(value);
type Field = { name: string; i18n: unknown; fields?: Field[]; field?: Field };

test('the facts of every language fit the contract', () => {
  for (const locale of locales) businessContract.parse(business(locale));
});

test('phone, email, hours and towns are the same in every language', () => {
  const { wording: _wording, ...shared } = business('fr');
  for (const locale of locales) {
    const { wording: _other, ...facts } = business(locale);
    assert.deepEqual(facts, shared);
  }
});

test('a phone number needs ten digits, however it is written', () => {
  for (const phone of ['819 209-8023', '(819) 209-8023', '819.209.8023']) {
    assert.ok(businessContract.safeParse({ ...business('fr'), phone }).success, phone);
    assert.equal(phoneNumber(phone), '+18192098023');
  }
  assert.ok(!businessContract.safeParse({ ...business('fr'), phone: '209-8023' }).success);
});

test('opening times must be real times', () => {
  const facts = clone(business('fr'));
  facts.hours.opens = '9h';
  assert.ok(!businessContract.safeParse(facts).success);
});

test('placeholders fill every text, in nested content, without changing the original', () => {
  const content = { a: 'Écrivez à {email}.', b: [{ c: '{days}, de {hours}' }], n: 3 };
  const before = clone(content);
  const filled = fillFacts(content, { email: 'a@b.c', days: 'du lundi', hours: '9 h' }, 'test');
  assert.deepEqual(filled, { a: 'Écrivez à a@b.c.', b: [{ c: 'du lundi, de 9 h' }], n: 3 });
  assert.deepEqual(content, before);
});

test('a mistyped placeholder stops the build instead of reaching the site', () => {
  assert.throws(() => fillFacts({ a: 'De {heures}' }, { hours: '9 h' }, 'footer.fr'), /footer\.fr.*\{heures\}/);
});

test('every placeholder used in the content exists', () => {
  const tokens = new Set(Object.keys(factTokens(business('fr'))));
  for (const name of readdirSync(contentDir).filter((file) => file.endsWith('.json'))) {
    for (const [, token] of read(name).matchAll(/\{(\w+)\}/g)) assert.ok(tokens.has(token), `${name} uses {${token}}`);
  }
});

test('at least one day must be open', () => {
  const facts = clone(business('fr'));
  facts.hours.days = { monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false, sunday: false };
  assert.ok(!businessContract.safeParse(facts).success);
});

const towns = (...list: [string, 'municipality' | 'sector' | 'village'][]) => list.map(([name, kind]) => ({ name, kind, region: 'R' }));
const withTowns = (locale: string, list: ReturnType<typeof towns>, boundary = ['Limite']) => {
  const facts = clone(business(locale));
  return { ...facts, serviceArea: { ...facts.serviceArea, towns: list, boundary } };
};

test('town sentences follow the list, with sectors after their municipality and villages apart', () => {
  const list = towns(['Gatineau', 'municipality'], ['Hull', 'sector'], ['Aylmer', 'sector'], ['Cantley', 'municipality'], ['Low', 'municipality'], ['Quyon', 'village'], ['Duclos', 'village']);
  const fr = factTokens(withTowns('fr', list));
  assert.equal(fr.municipalities, 'Gatineau (Hull et Aylmer), Cantley et Low');
  assert.equal(fr.villages, 'Quyon et Duclos');
  assert.equal(fr.boundary, 'Limite');
  assert.equal(factTokens(withTowns('en', list)).municipalities, 'Gatineau (Hull and Aylmer), Cantley and Low');
  assert.equal(factTokens(withTowns('es', list)).villages, 'Quyon y Duclos');
});

test('a list of one has no connecting word, and an empty one is empty', () => {
  const fr = factTokens(withTowns('fr', towns(['Gatineau', 'municipality']), []));
  assert.equal(fr.municipalities, 'Gatineau');
  assert.equal(fr.villages, '');
  assert.equal(fr.boundary, '');
});

test('the word for "and" is not offered as a placeholder', () => {
  assert.ok(!('and' in factTokens(business('fr'))));
});

test('town lists are only written in the business facts, apart from the area page description', () => {
  for (const name of readdirSync(contentDir).filter((file) => file.endsWith('.json') && !file.startsWith('business.'))) {
    const content = JSON.parse(read(name));
    if (name.startsWith('area.')) delete content.meta;
    assert.ok(!/Masson-Angers|Val-des-Bois|Luskville|Quyon|Cantley/.test(JSON.stringify(content)), `${name} repeats a town`);
  }
});

test('{Days} starts a sentence with the same words as {days}', () => {
  assert.equal(factTokens(business('fr')).Days, 'Du lundi au samedi');
  assert.equal(factTokens(business('es')).Days, 'De lunes a sábado');
  assert.equal(factTokens(business('en')).radiusKm, '50');
});

test('phone, email, days, hours and radius are written only in the business facts', () => {
  const written = /819[ .-]?209|contact@vitreva|\b9 h\b|\b21 h\b|9 am|9 pm|9 a\. ?m|9 p\. ?m|\b9 (to|a) 9\b|lundi|samedi|monday|saturday|lunes|s[áa]bado|\b50 ?km/i;
  for (const name of readdirSync(contentDir).filter((file) => file.endsWith('.json') && !file.startsWith('business.'))) {
    assert.ok(!written.test(read(name)), `${name} repeats a business fact`);
  }
});

test('open days keep their week order and skip closed days', () => {
  assert.deepEqual(openDays({ monday: true, tuesday: false, wednesday: false, thursday: false, friday: true, saturday: false, sunday: false }), ['Monday', 'Friday']);
});

test('towns group by region, in the order they are listed', () => {
  const list = [{ name: 'A', region: 'R1' }, { name: 'B', region: 'R2' }, { name: 'C', region: 'R1' }];
  assert.deepEqual(townGroups(list), [{ name: 'R1', towns: ['A', 'C'] }, { name: 'R2', towns: ['B'] }]);
});

test('in the editor, facts are edited once and only their wording is translated', () => {
  const entry = contentGroups.flatMap((group) => cmsConfig().collections.find((item) => item.name === group.name)?.files ?? []).find((file) => file.name === 'business');
  assert.ok(entry, 'no Entreprise entry in the editor');
  const check = (fields: Field[], path: string[]) => {
    for (const field of fields) {
      const here = [...path, field.name];
      assert.equal(field.i18n, here[0] === 'wording' ? true : 'duplicate', here.join('.'));
      check([...(field.fields ?? []), ...(field.field ? [field.field] : [])], here);
    }
  };
  check(entry.fields as Field[], []);
});

test('the editor refuses a mistyped phone, email or time before saving', () => {
  const entry = contentGroups.flatMap((group) => cmsConfig().collections.find((item) => item.name === group.name)?.files ?? []).find((file) => file.name === 'business');
  const fields = entry?.fields as (Field & { pattern?: [string, string] })[];
  for (const [name, good, bad] of [['phone', '819 209-8023', '209-8023'], ['email', 'a@b.ca', 'a@b']]) {
    const pattern = fields.find((field) => field.name === name)?.pattern?.[0];
    assert.ok(pattern, `${name} has no check in the editor`);
    assert.ok(new RegExp(pattern).test(good));
    assert.ok(!new RegExp(pattern).test(bad));
  }
});
