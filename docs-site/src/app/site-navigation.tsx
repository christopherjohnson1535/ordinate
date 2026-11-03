// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';

import SideNavigation, { SideNavigationProps } from '@ordinate/components/side-navigation';

import { componentsInGroup, findComponentDoc, groups } from '../registry/components';
import { guidesIn, sections } from '../registry/guides';
import { href } from './router';

function buildItems(activePath: string): SideNavigationProps.Item[] {
  const activeFolder = activePath.startsWith('/components/') ? activePath.split('/')[2] : null;
  const activeGroup = activeFolder ? findComponentDoc(activeFolder)?.group : null;
  const [start, foundations, packages, patterns] = sections.map(section =>
    guidesIn(section.id).map<SideNavigationProps.Link>(guide => ({
      type: 'link',
      text: guide.title,
      href: href(guide.path),
    }))
  );

  const section = (text: string, items: SideNavigationProps.Item[], defaultExpanded: boolean) =>
    items.length ? [{ type: 'section' as const, text, items, defaultExpanded }] : [];

  return [
    ...section(sections[0].title, start, true),
    ...section(sections[1].title, foundations, activePath.startsWith('/foundations')),
    { type: 'divider' },
    { type: 'link', text: 'All components', href: href('/components') },
    ...groups.flatMap(group =>
      section(
        group.title,
        componentsInGroup(group.id).map<SideNavigationProps.Link>(doc => ({
          type: 'link',
          text: doc.name,
          href: href(`/components/${doc.folder}`),
        })),
        group.id === activeGroup
      )
    ),
    { type: 'divider' },
    ...section(sections[2].title, packages, activePath.startsWith('/packages')),
    ...section(sections[3].title, patterns, activePath.startsWith('/patterns')),
  ];
}

/** The sheet index: every page of the site, grouped as the README groups the library. */
export function SiteNavigation({ activePath, onFollow }: { activePath: string; onFollow: (target: string) => void }) {
  // Sections open for the page the reader starts on; after that the reader opens and closes them.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const items = useMemo(() => buildItems(activePath), []);
  return (
    <SideNavigation
      ariaLabel="Sheet index"
      header={{ text: 'Ordinate reference', href: href('/') }}
      activeHref={href(activePath)}
      items={items}
      onFollow={event => {
        if (!event.detail.external) {
          event.preventDefault();
          onFollow(event.detail.href);
        }
      }}
    />
  );
}
