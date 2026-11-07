/** Turns the Content Contract into the configuration Sveltia CMS reads. Used at build time only. */
import { z } from 'zod';
import { pagesContract, siteTextContract, type FieldMeta } from './contract.ts';
import { locales } from './index.ts';

export const CMS_CONFIG_PATH = 'cms/config.yml';

const LOGIN_ORIGIN = 'https://login.yesid.dev';
const REPOSITORY = 'mgkdante/vitreva';

interface CmsField {
  name: string;
  label: string;
  widget: string;
  i18n: true;
  [option: string]: unknown;
}

const metaOf = (schema: z.ZodType, name: string): FieldMeta => {
  const meta = schema.meta() as unknown as FieldMeta | undefined;
  if (!meta?.label) throw new Error(`The contract field "${name}" has no label`);
  return meta;
};

const fieldsOf = (shape: z.ZodRawShape): CmsField[] =>
  Object.entries(shape).map(([name, schema]) => toField(name, schema as z.ZodType));

function listField(name: string, schema: z.ZodArray<z.ZodType>, meta: FieldMeta): CmsField {
  const { element } = schema;
  const items = element instanceof z.ZodObject ? { fields: fieldsOf(element.shape) } : { field: toField('value', element) };
  const locked =
    meta.count === undefined ? {} : { min: meta.count, max: meta.count, allow_add: false, allow_remove: false, allow_reorder: false };
  return {
    name,
    label: meta.label,
    widget: 'list',
    i18n: true,
    collapsed: true,
    ...(meta.optional ? { required: false } : {}),
    ...locked,
    ...items
  };
}

function toField(name: string, schema: z.ZodType): CmsField {
  const meta = metaOf(schema, name);
  const common = { name, label: meta.label, i18n: true as const, ...(meta.hint ? { hint: meta.hint } : {}) };

  if (schema instanceof z.ZodArray) return { ...listField(name, schema as z.ZodArray<z.ZodType>, meta), ...common };
  if (schema instanceof z.ZodObject) {
    return { ...common, widget: 'object', collapsed: meta.collapsed ?? true, fields: fieldsOf(schema.shape) };
  }
  return { ...common, widget: meta.widget, ...(meta.optional ? { required: false } : {}) };
}

/** The site's whole editor setup. Saves only reach a branch the login Worker also allows. */
export const cmsConfig = ({ branch = 'main' }: { branch?: string } = {}) => ({
  backend: {
    name: 'github',
    repo: REPOSITORY,
    branch,
    base_url: LOGIN_ORIGIN,
    auth_endpoint: 'auth/popup',
    api_root: LOGIN_ORIGIN,
    graphql_api_root: LOGIN_ORIGIN
  },
  media_folder: 'static/images/uploads',
  public_folder: '/images/uploads',
  i18n: { structure: 'multiple_files', locales: [...locales], default_locale: 'fr' },
  singletons: [
    { name: 'site-text', label: 'Texte du site', file: 'src/lib/content/{{locale}}.json', format: 'json', i18n: true, fields: fieldsOf(siteTextContract.shape) },
    { name: 'pages', label: 'Pages', file: 'src/lib/content/pages.{{locale}}.json', format: 'json', i18n: true, fields: fieldsOf(pagesContract.shape) }
  ]
});
