// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import AppLayout, { AppLayoutProps } from '@ordinate/components/app-layout';
import BreadcrumbGroup from '@ordinate/components/breadcrumb-group';
import TitleBlock from '@ordinate/components/title-block';
import TopNavigation from '@ordinate/components/top-navigation';
import { Mode } from '@ordinate/global-styles';

import { componentDocs } from '../registry/components';
import { guides } from '../registry/guides';
import { DisplayPanel } from './display-panel';
import { navigate, scrollToAnchor, useLocation } from './router';
import { resolveRoute } from './routes';
import { SearchDialog, SearchTrigger, useSearchShortcut } from './search';
import { useIsDark, useSettings } from './settings';
import { SiteNavigation } from './site-navigation';

import styles from './app.module.scss';

declare const __ORDINATE_VERSION__: string;
declare const __ORDINATE_BUILT__: string;

// Every route of the site, for scripts/check-pages.mjs.
declare global {
  interface Window {
    __ORDINATE_DOCS_ROUTES__?: ReadonlyArray<string>;
  }
}
window.__ORDINATE_DOCS_ROUTES__ = [
  '/',
  '/components',
  ...guides.map(guide => guide.path),
  ...componentDocs.map(doc => `/components/${doc.folder}`),
];

const repository = 'https://github.com/christopherjohnson1535/ordinate';

function logo(dark: boolean) {
  const ink = dark ? '#eceae4' : '#131416';
  const paper = dark ? '#131416' : '#ffffff';
  return (
    'data:image/svg+xml,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">` +
        `<rect width="28" height="28" fill="${ink}"/><path d="M14 5v18M5 14h18" stroke="${paper}" stroke-width="2"/></svg>`
    )
  );
}

export default function App() {
  const location = useLocation();
  const route = useMemo(() => resolveRoute(location.path), [location.path]);
  const { settings, update } = useSettings();
  const dark = useIsDark();
  const layout = useRef<AppLayoutProps.Ref>(null);
  const [search, setSearch] = useState({ open: false, query: '', session: 0 });
  const openSearch = useCallback(
    (query = '') => setSearch(current => ({ open: true, query, session: current.session + 1 })),
    []
  );
  const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
  useSearchShortcut(openSearch);

  // A new page starts at the top, or at the section its URL names.
  useEffect(() => {
    document.title = route.key === 'cover' ? 'Ordinate' : `${route.title} · Ordinate`;
    const frame = window.requestAnimationFrame(() => scrollToAnchor(location.anchor));
    return () => window.cancelAnimationFrame(frame);
    // Only a change of page scrolls; following an anchor on the same page scrolls on its own.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.key]);

  const followInApp = (target: string) => {
    navigate(target);
    layout.current?.closeNavigationIfNecessary();
  };

  return (
    <>
      <div id="site-header" className={styles.header}>
        <TopNavigation
          identity={{ href: '#/', title: 'Ordinate', logo: { src: logo(dark), alt: '' } }}
          search={<SearchTrigger onOpen={openSearch} />}
          utilities={[
            {
              type: 'button',
              text: `v${__ORDINATE_VERSION__}`,
              href: '#/start/running-locally',
              disableUtilityCollapse: true,
            },
            {
              type: 'button',
              iconName: 'color-mode',
              text: dark ? 'Light mode' : 'Dark mode',
              ariaLabel: dark ? 'Switch to light mode' : 'Switch to dark mode',
              disableTextCollapse: false,
              onClick: () => update({ mode: dark ? Mode.Light : Mode.Dark }),
            },
            {
              type: 'button',
              text: 'Source',
              href: repository,
              external: true,
              externalIconAriaLabel: 'Opens in a new tab',
            },
          ]}
        />
      </div>
      <AppLayout
        ref={layout}
        headerSelector="#site-header"
        contentType="default"
        maxContentWidth={1480}
        navigationWidth={300}
        toolsHide={true}
        ariaLabels={{
          navigation: 'Sheet index',
          navigationToggle: 'Open the sheet index',
          navigationClose: 'Close the sheet index',
          drawers: 'Panels',
        }}
        activeDrawerId={activeDrawerId}
        onDrawerChange={event => setActiveDrawerId(event.detail.activeDrawerId)}
        drawers={[
          {
            id: 'display',
            trigger: { iconName: 'adjust' },
            ariaLabels: {
              drawerName: 'Display',
              triggerButton: 'Display settings',
              closeButton: 'Close display settings',
            },
            content: <DisplayPanel />,
          },
        ]}
        navigation={<SiteNavigation activePath={location.path} onFollow={followInApp} />}
        breadcrumbs={
          <BreadcrumbGroup
            ariaLabel="Breadcrumbs"
            items={route.breadcrumbs}
            onFollow={event => {
              event.preventDefault();
              followInApp(event.detail.href);
            }}
          />
        }
        content={<React.Fragment key={route.key}>{route.element}</React.Fragment>}
        titleBlock={
          <TitleBlock
            ariaLabel="About this sheet"
            items={[
              { label: 'Project', value: 'Ordinate' },
              { label: 'Sheet', value: `${route.sheet} ${route.title}` },
              { label: 'Revision', value: settings.revision },
              { label: 'Version', value: __ORDINATE_VERSION__ },
              { label: 'Drawn', value: __ORDINATE_BUILT__ },
            ]}
          />
        }
      />
      <SearchDialog
        key={search.session}
        visible={search.open}
        initialQuery={search.query}
        onDismiss={() => setSearch(current => ({ ...current, open: false }))}
        onFollow={followInApp}
      />
    </>
  );
}
