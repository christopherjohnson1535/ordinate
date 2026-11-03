// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

/** The parts of the site outside the component pages. */
export type GuideSection = 'start' | 'foundations' | 'packages' | 'patterns';

export interface GuideDoc {
  /** The last part of the URL, such as `revisions`. Matches the file name. */
  slug: string;
  title: string;
  /** One sentence for the index and search results. */
  summary: string;
  /** Position within its section; lower comes first. */
  order: number;
  /** Extra words search should match, such as API names the page explains. */
  keywords?: ReadonlyArray<string>;
  Page: React.ComponentType;
}

export interface GuideEntry extends GuideDoc {
  section: GuideSection;
  path: string;
}

export const sections: ReadonlyArray<{ id: GuideSection; title: string; code: string }> = [
  { id: 'start', title: 'Get started', code: 'G' },
  { id: 'foundations', title: 'Foundations', code: 'F' },
  { id: 'packages', title: 'Packages', code: 'K' },
  { id: 'patterns', title: 'Patterns', code: 'P' },
];

const modules = {
  start: import.meta.glob<{ default: GuideDoc }>('../content/guides/*.tsx', { eager: true }),
  foundations: import.meta.glob<{ default: GuideDoc }>('../content/foundations/*.tsx', { eager: true }),
  packages: import.meta.glob<{ default: GuideDoc }>('../content/packages/*.tsx', { eager: true }),
  patterns: import.meta.glob<{ default: GuideDoc }>('../content/patterns/*.tsx', { eager: true }),
};

export const guides: ReadonlyArray<GuideEntry> = sections.flatMap(({ id }) =>
  Object.values(modules[id])
    .map(module => ({ ...module.default, section: id, path: `/${id}/${module.default.slug}` }))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
);

export function guidesIn(section: GuideSection): ReadonlyArray<GuideEntry> {
  return guides.filter(guide => guide.section === section);
}

export function findGuide(path: string): GuideEntry | undefined {
  return guides.find(guide => guide.path === path);
}

/** A sheet number for a guide, such as `G-02`, from its section and its place in it. */
export function sheetOf(guide: GuideEntry): string {
  const code = sections.find(section => section.id === guide.section)?.code ?? 'X';
  return `${code}-${String(guidesIn(guide.section).indexOf(guide) + 1).padStart(2, '0')}`;
}
