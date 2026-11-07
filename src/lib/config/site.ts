import { BASE_PATH, PUBLIC_WEB3FORMS_ACCESS_KEY, PUBLIC_SITE_URL } from '$app/env/public';
import { openDays, phoneNumber, townGroups } from '#lib/content/facts.ts';
import { readBusiness } from '#lib/content/files.ts';

// Phone, email, hours and towns are the same in every language, and the owner edits them in the CMS.
const business = readBusiness('fr');
const phone = phoneNumber(business.phone);

export const site = {
  brand: 'Vitreva',
  phoneDisplay: business.phone,
  phoneE164: phone,
  hours: { days: openDays(business.hours.days), opens: business.hours.opens, closes: business.hours.closes },
  phoneHref: `tel:${phone}`,
  smsHref: `sms:${phone}`,
  email: business.email,
  emailHref: `mailto:${business.email}`,
  creditUrl: 'https://yesid.dev',
  web3formsAccessKey: PUBLIC_WEB3FORMS_ACCESS_KEY,
  origin: PUBLIC_SITE_URL,
  basePath: BASE_PATH,
  homeUrl: `${PUBLIC_SITE_URL}${BASE_PATH}/`,
  serviceArea: {
    province: business.serviceArea.province,
    locations: business.serviceArea.towns.map((town) => town.name),
    groups: townGroups(business.serviceArea.towns),
    boundaryLocations: business.serviceArea.boundary,
    approximateRadiusKm: business.serviceArea.radiusKm
  }
};

export const absoluteUrl = (path: string) => `${site.origin}${site.basePath}/${path.replace(/^\//, '')}`;
