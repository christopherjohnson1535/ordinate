// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Table from '@ordinate/components/table';

import { Example } from '../../parts/example';
import { CodeBlock, DocSection, Notes, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';
import { LoadedExample } from '../../registry/types';

const styleSwitch: LoadedExample = {
  meta: {
    id: 'style-switch',
    title: 'One section in four styles',
    description:
      'An opening and a call to action for a bicycle repair shop inside a StyleScope. Pick a style and the same components take its voice.',
  },
  load: () => import('./styles/style-switch'),
  loadSource: () => import('./styles/style-switch.tsx?raw').then(module => module.default),
};

const styles = [
  {
    id: 'console',
    constant: 'Style.Console',
    use: 'Applications. The default.',
    changes: 'Nothing: the revision as published.',
  },
  {
    id: 'editorial',
    constant: 'Style.Editorial',
    use: 'Journals, blogs and newsletters.',
    changes: 'Serif headlines and reading text, a very large type scale, printed-page rules.',
  },
  {
    id: 'studio',
    constant: 'Style.Studio',
    use: 'Portfolios, studios and practices.',
    changes: 'Light, oversized headlines; image-led layouts with catalogue captions.',
  },
  {
    id: 'shopfront',
    constant: 'Style.Shopfront',
    use: 'Shops, cafés and local services.',
    changes: 'Condensed headlines, cobalt and sunflower, rounded buttons, cards and bands.',
  },
];

function Page() {
  return (
    <>
      <Prose>
        <p>
          The same components build a console and a website. A style sets the voice of a page: the console style keeps
          the look of a set of drawings, and three website styles turn the same components into a journal, a studio
          portfolio or a local shop. The website components, such as Opening, Section, CallToAction, SiteHeader and
          SiteFooter, are built for them, and every other component follows along.
        </p>
      </Prose>

      <DocSection id="styles" number={1} title="The styles">
        <Table
          variant="embedded"
          wrapLines={true}
          trackBy="id"
          items={styles}
          ariaLabels={{ tableLabel: 'Styles' }}
          columnDefinitions={[
            {
              id: 'id',
              header: 'Style',
              cell: item => item.id,
              isRowHeader: true,
              contentType: 'identifier',
              width: 120,
            },
            { id: 'constant', header: 'Constant', cell: item => <code>{item.constant}</code>, width: 180 },
            { id: 'use', header: 'For', cell: item => item.use, width: 220 },
            { id: 'changes', header: 'What changes', cell: item => item.changes },
          ]}
        />
      </DocSection>

      <DocSection id="apply-style" number={2} title="Set the style of a page">
        <Prose>
          <p>
            Call <code>applyStyle</code> from <code>@ordinate/global-styles</code> in the entry file of the site, next
            to the revision.
          </p>
        </Prose>
        <CodeBlock
          label="main.tsx"
          code={`
import { applyRevision, applyStyle, Revision, Style } from '@ordinate/global-styles';
import '@ordinate/global-styles/index.css';

applyRevision(Revision.V2026_1);
applyStyle(Style.Shopfront);
`}
        />
        <Notes
          items={[
            <>
              <code>applyStyle(Style.Console)</code> and <code>applyStyle(null)</code> both return to the console style.
            </>,
            <>
              Like the other helpers, it takes an element as its second argument and defaults to{' '}
              <code>document.body</code>.
            </>,
            <>A name the installed version does not know is ignored, with a warning in the console.</>,
          ]}
        />
      </DocSection>

      <DocSection id="style-scope" number={3} title="Set the style in markup">
        <Prose>
          <p>
            <a href="#/components/style-scope">StyleScope</a> gives everything inside it a style, and optionally a mode,
            density and revision, as a component. It renders the same classes as the helpers, so the two agree. Because
            it is plain markup it renders on the server too, which makes it the way to set a style from an Astro layout
            or a server component, where <code>applyStyle</code> cannot run.
          </p>
        </Prose>
        <CodeBlock
          label="layout.tsx"
          code={`
import StyleScope from '@ordinate/components/style-scope';

export function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <StyleScope styleName="shopfront" tagOverride="main">
      {children}
    </StyleScope>
  );
}
`}
        />
        <Prose>
          <p>
            <code>tagOverride</code> renders the scope as <code>main</code>, <code>section</code>, <code>article</code>{' '}
            or <code>aside</code>, so it can be a landmark of the page. Settings you leave out are inherited from around
            it.
          </p>
        </Prose>
        <Example example={styleSwitch} index={1} />
      </DocSection>

      <DocSection id="mixing" number={4} title="Mixing styles">
        <Prose>
          <p>
            Styles can be mixed. An application can keep the console style for its signed-in screens and use shopfront
            on its public pages, or set one section of a page apart.
          </p>
        </Prose>
        <Notes
          items={[
            <>
              A style is data, like a revision: a short list of token overrides. It changes only the tokens it lists and
              sits on top of the pinned revision, so it follows each revision and both color modes.
            </>,
            <>
              Styles mostly set the website tokens, such as headline faces and sizes, band and marker colors and section
              radii, which the console style keeps quiet. A few brand tokens change too, such as the primary
              button&apos;s color in shopfront.
            </>,
            <>
              A <a href="#/start/brand-theme">brand theme</a> wins over a style for the tokens the theme sets.
            </>,
          ]}
        />
      </DocSection>
    </>
  );
}

const guide: GuideDoc = {
  slug: 'styles',
  title: 'Styles for websites',
  summary: 'Give the same components the voice of a journal, a studio or a shop with applyStyle or StyleScope.',
  order: 5,
  keywords: [
    'applyStyle',
    'Style',
    'StyleScope',
    'styleName',
    'console',
    'editorial',
    'studio',
    'shopfront',
    'website',
  ],
  Page,
};

export default guide;
