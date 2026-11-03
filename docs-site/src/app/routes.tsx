// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ComponentIndex from '../pages/component-index';
import ComponentPage from '../pages/component-page';
import CoverSheet from '../pages/cover-sheet';
import GuidePage from '../pages/guide-page';
import NotFound from '../pages/not-found';
import { findComponentDoc, groups, sheetOfComponent } from '../registry/components';
import { findGuide, guidesIn, sections, sheetOf } from '../registry/guides';

export interface Crumb {
  text: string;
  href: string;
}

export interface ResolvedRoute {
  /** A stable key for the page, so moving between pages resets their state. */
  key: string;
  /** The sheet number, for the title block. */
  sheet: string;
  title: string;
  breadcrumbs: ReadonlyArray<Crumb>;
  element: React.ReactNode;
}

const home: Crumb = { text: 'Ordinate', href: '#/' };

export function resolveRoute(path: string): ResolvedRoute {
  const segments = path.split('/').filter(Boolean);

  if (segments.length === 0) {
    return { key: 'cover', sheet: '000', title: 'Cover sheet', breadcrumbs: [home], element: <CoverSheet /> };
  }

  if (segments[0] === 'components') {
    const index: Crumb = { text: 'Components', href: '#/components' };
    if (segments.length === 1) {
      return {
        key: 'components',
        sheet: 'C-000',
        title: 'Components',
        breadcrumbs: [home, index],
        element: <ComponentIndex />,
      };
    }
    const doc = findComponentDoc(segments[1]);
    if (doc) {
      const group = groups.find(entry => entry.id === doc.group);
      return {
        key: `components/${doc.folder}`,
        sheet: sheetOfComponent(doc),
        title: doc.name,
        breadcrumbs: [
          home,
          index,
          ...(group ? [{ text: group.title, href: `#/components#${group.id}` }] : []),
          { text: doc.name, href: `#/components/${doc.folder}` },
        ],
        element: <ComponentPage folder={doc.folder} />,
      };
    }
  }

  const guide = findGuide(`/${segments.slice(0, 2).join('/')}`);
  if (guide) {
    const section = sections.find(entry => entry.id === guide.section);
    return {
      key: guide.path,
      sheet: sheetOf(guide),
      title: guide.title,
      breadcrumbs: [
        home,
        ...(section ? [{ text: section.title, href: `#${guidesIn(section.id)[0].path}` }] : []),
        { text: guide.title, href: `#${guide.path}` },
      ],
      element: <GuidePage guide={guide} />,
    };
  }

  return {
    key: 'not-found',
    sheet: '—',
    title: 'No such sheet',
    breadcrumbs: [home],
    element: <NotFound path={path} />,
  };
}
