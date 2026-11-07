/**
 * The Content Contract: the one description of what the site owner can edit. It gives the code its
 * types, the build its checks and the CMS its fields, in the order they appear in each of those.
 * Only structure is checked here. What the owner chooses to say is theirs.
 */
import { group, line, list, optionalParagraph, paragraph } from '@yesid/content-contract';
import { z } from 'zod';
import type { PageKey } from './slugs.ts';

const titleAndBody = (titleLabel: string, bodyLabel: string) =>
  z.strictObject({ title: line(titleLabel), body: paragraph(bodyLabel) });

const sections = {
  hero: group(
    'Haut de page',
    {
      lines: list('Grand titre, une ligne par entrée', line('Ligne'), { count: 2 }),
      subtitle: line('Sous-titre'),
      status: group('Message du tableau de bord', {
        before: line('Avant le défilement'),
        after: line('Après le défilement')
      }),
      mirrorNote: line('Texte du rétroviseur'),
      radio: group('Écran de la radio', { label: line('Titre'), text: line('Message') }),
      cue: line('Invitation à défiler')
    },
    false
  ),
  panel: group('Indicateurs', {
    label: line('Nom de la section', 'Lu par les lecteurs d’écran, pas affiché.'),
    items: list(
      'Quatre indicateurs',
      z.strictObject({ value: line('Valeur'), title: line('Titre'), body: paragraph('Description') }),
      { count: 4 }
    )
  }),
  information: group('Le service', {
    eyebrow: line('Surtitre'),
    title: line('Titre'),
    caption: line('Légende de la photo'),
    items: list('Points clés', titleAndBody('Titre', 'Description'))
  }),
  situations: group('Situations', {
    eyebrow: line('Surtitre'),
    title: line('Titre'),
    cards: list(
      'Quatre cartes',
      z.strictObject({ title: line('Titre'), body: paragraph('Description'), cta: line('Lien') }),
      { count: 4 }
    )
  }),
  process: group('Comment ça marche', {
    eyebrow: line('Surtitre'),
    title: line('Titre'),
    textCta: line('Bouton texto'),
    quoteCta: line('Bouton de soumission'),
    steps: list('Quatre étapes', titleAndBody('Titre', 'Description'), { count: 4 })
  }),
  area: group('Zone desservie', {
    title: line('Titre'),
    body: paragraph('Texte'),
    note: line('Note de la carte'),
    boundaryHint: line('Mention pour les secteurs en limite'),
    link: line('Lien vers la page complète')
  }),
  faq: group('Questions fréquentes', {
    eyebrow: line('Surtitre'),
    title: line('Titre'),
    intro: paragraph('Introduction'),
    cta: line('Bouton'),
    items: list('Questions et réponses', z.strictObject({ question: line('Question'), answer: paragraph('Réponse') }))
  }),
  quote: group('Formulaire de soumission', {
    eyebrow: line('Surtitre'),
    title: line('Titre'),
    intro: paragraph('Introduction'),
    call: line('Bouton d’appel'),
    ways: group('Autres façons de nous joindre', {
      text: line('Bouton texto'),
      textNote: line('Précision sous le bouton texto'),
      email: line('Bouton courriel')
    }),
    fields: group('Champs du formulaire', {
      name: line('Nom'),
      contact: line('Téléphone ou courriel'),
      vehicle: line('Véhicule'),
      vin: line('NIV'),
      location: line('Lieu'),
      message: line('Message')
    }),
    vinHelp: paragraph('Aide pour trouver le NIV'),
    consent: paragraph('Consentement'),
    privacyNote: paragraph('Note de confidentialité'),
    privacyLabel: line('Lien vers la confidentialité'),
    submit: line('Bouton d’envoi'),
    submitting: line('Pendant l’envoi'),
    note: paragraph('Note sous le bouton'),
    success: paragraph('Message de réussite'),
    error: paragraph('Message d’erreur'),
    unconfigured: paragraph('Message si le formulaire est indisponible'),
    subject: line('Objet du courriel reçu')
  }),
  banner: group('Bandeau du haut', {
    quote: line('Soumission'),
    mobile: line('Service mobile'),
    reply: line('Délai de réponse'),
    hours: line('Heures')
  }),
  meta: group('Référencement de l’accueil', {
    title: line('Titre dans Google'),
    description: paragraph('Description dans Google')
  }),
  navigation: group('Menu', {
    process: line('Comment ça marche'),
    faq: line('Questions'),
    contact: line('Soumission'),
    freeQuote: line('Bouton de soumission', 'Affiché dans le menu, le pied de page et les pages.'),
    call: line('Appeler'),
    text: line('Texto'),
    menu: line('Menu'),
    home: line('Lien vers l’accueil', 'Lu par les lecteurs d’écran.'),
    language: line('Changer de langue', 'Lu par les lecteurs d’écran.'),
    skip: line('Aller au contenu', 'Lu par les lecteurs d’écran.')
  }),
  footer: group('Pied de page', {
    description: paragraph('Description'),
    serviceTitle: line('Titre Service'),
    companyTitle: line('Titre Entreprise'),
    contactTitle: line('Titre Contact'),
    hoursTitle: line('Titre Heures'),
    days: line('Jours'),
    hours: line('Heures'),
    creditPrefix: line('Texte du crédit')
  }),
  images: group('Descriptions des images', {
    van: line('Véhicule'),
    installation: line('Installation'),
    aftercare: line('Après la pose')
  }),
  pagesUi: group('Titres communs des pages', {
    related: line('À voir aussi'),
    communities: line('Secteurs et municipalités')
  }),
  error: group('Page d’erreur', {
    statusLabel: line('Mot « Erreur »'),
    illustrationAlt: line('Description de l’illustration'),
    home: line('Retour à l’accueil'),
    email: line('Écrire'),
    footer: line('Pied de page'),
    notFound: group('Page introuvable', { eyebrow: line('Surtitre'), title: line('Titre'), body: paragraph('Texte') }),
    unavailable: group('Page indisponible', { eyebrow: line('Surtitre'), title: line('Titre'), body: paragraph('Texte') })
  })
};

const { hero, panel, process, information, situations, area, faq, images, meta, navigation, banner, pagesUi } = sections;

/** The home page, in the order its sections appear when scrolling. */
export const homeContract = z.strictObject({ hero, panel, process, information, situations, area, faq, images, meta });
/** What every page shares at its top, along with the titles and buttons repeated across pages. */
export const menuContract = z.strictObject({ navigation, banner, pagesUi });
export const quoteContract = sections.quote;
export const footerContract = sections.footer;
export const errorContract = sections.error;

const fixedPage = (label: string) =>
  group(label, {
    label: line('Nom de la page', 'Affiché dans les menus.'),
    summary: paragraph('Résumé', 'Affiché dans les liens vers cette page.'),
    meta: group('Référencement', { title: line('Titre dans Google'), description: paragraph('Description dans Google') }),
    eyebrow: line('Surtitre'),
    title: line('Titre'),
    intro: optionalParagraph('Introduction'),
    sections: list(
      'Sections',
      z.strictObject({
        title: line('Titre'),
        body: list('Paragraphes', paragraph('Paragraphe')),
        list: list('Liste à puces', line('Élément'), { optional: true })
      })
    )
  });

export const pageContract = fixedPage('Page');

export type SiteText = z.infer<typeof homeContract> &
  z.infer<typeof menuContract> & {
    quote: z.infer<typeof quoteContract>;
    footer: z.infer<typeof footerContract>;
    error: z.infer<typeof errorContract>;
  };
export type Pages = Record<PageKey, z.infer<typeof pageContract>>;
