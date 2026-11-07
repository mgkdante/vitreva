/**
 * The business facts: written once, in the Entreprise entry of the editor, and read by everything
 * else. Text elsewhere refers to them with placeholders such as {hours}, so changing the hours
 * changes every page, the structured data and llms.txt together.
 */
import type { z } from 'zod';
import type { businessContract } from './contract.ts';

export type BusinessFacts = z.infer<typeof businessContract>;
type WeekDays = BusinessFacts['hours']['days'];

const SCHEMA_DAYS: Record<keyof WeekDays, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
};

const capitalized = (text: string) => text.charAt(0).toLocaleUpperCase('fr-CA') + text.slice(1);

export const factTokens = ({ phone, email, wording, serviceArea }: BusinessFacts): Record<string, string> => ({
  phone,
  email,
  ...wording,
  Days: capitalized(wording.days),
  radiusKm: String(serviceArea.radiusKm)
});

const fillText = (text: string, tokens: Record<string, string>, where: string) =>
  text.replace(/\{(\w+)\}/g, (_match, token: string) => {
    const value = tokens[token];
    if (value === undefined) throw new Error(`"${where}" refers to {${token}}, which is not a business fact`);
    return value;
  });

/** A copy of the content with its placeholders filled. A mistyped one fails the build, so the live site stays as it is. */
export function fillFacts<T>(value: T, tokens: Record<string, string>, where: string): T {
  if (typeof value === 'string') return fillText(value, tokens, where) as T;
  if (Array.isArray(value)) return value.map((item) => fillFacts(item, tokens, where)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, fillFacts(item, tokens, where)])) as T;
  }
  return value;
}

/** A number for links and structured data, from however it is written. Numbers are Canadian. */
export const phoneNumber = (phone: string) => `+1${phone.replace(/\D/g, '')}`;

/** Open days as schema.org names them, in week order. */
export const openDays = (days: WeekDays) =>
  (Object.keys(SCHEMA_DAYS) as (keyof WeekDays)[]).filter((day) => days[day]).map((day) => SCHEMA_DAYS[day]);

/** Regions in the order they first appear, each with its towns in listed order. */
export function townGroups(towns: readonly { name: string; region: string }[]) {
  const regions = [...new Set(towns.map(({ region }) => region))];
  return regions.map((name) => ({ name, towns: towns.filter(({ region }) => region === name).map((town) => town.name) }));
}
