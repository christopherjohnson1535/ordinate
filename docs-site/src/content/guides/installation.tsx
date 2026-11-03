// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Table from '@ordinate/components/table';

import { CodeBlock, Command, DocSection, Notes, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';

const packages = [
  {
    name: '@ordinate/components',
    contents: 'The React components, one entry point per component.',
    needed: 'Always',
  },
  {
    name: '@ordinate/global-styles',
    contents: 'Fonts, base page styles, and the revision, mode, style and density helpers.',
    needed: 'Always',
  },
  {
    name: '@ordinate/collection-hooks',
    contents: 'Filtering, sorting, pagination and selection state for tables, cards and lists.',
    needed: 'For collections',
  },
  {
    name: '@ordinate/charts',
    contents: 'Line, area, bar, mixed line and bar, and pie charts.',
    needed: 'For charts',
  },
  {
    name: '@ordinate/design-tokens',
    contents: 'The design tokens as Sass variables and JavaScript constants, for your own components.',
    needed: 'For custom components',
  },
];

function Page() {
  return (
    <>
      <Prose>
        <p>
          Ordinate is a set of npm packages. You need two of them to put a component on a page: the components
          themselves and the global styles, which bring the fonts and set the revision your application is drawn in.
        </p>
      </Prose>

      <DocSection id="packages" number={1} title="Packages">
        <Table
          variant="embedded"
          wrapLines={true}
          trackBy="name"
          items={packages}
          ariaLabels={{ tableLabel: 'Ordinate packages' }}
          columnDefinitions={[
            {
              id: 'name',
              header: 'Package',
              cell: item => <code>{item.name}</code>,
              isRowHeader: true,
              width: 260,
            },
            { id: 'contents', header: 'Contents', cell: item => item.contents },
            { id: 'needed', header: 'Install it', cell: item => item.needed, width: 180 },
          ]}
        />
        <Prose>
          <p>Install the two packages every application needs:</p>
        </Prose>
        <Command>npm install @ordinate/components @ordinate/global-styles</Command>
        <Prose>
          <p>Add the others when you reach for what they hold:</p>
        </Prose>
        <Command>npm install @ordinate/collection-hooks @ordinate/charts</Command>
      </DocSection>

      <DocSection id="peer-dependencies" number={2} title="Peer dependencies">
        <Prose>
          <p>
            The components and the collection hooks expect your application to provide React. Install <code>react</code>{' '}
            and <code>react-dom</code> 18 or later if the project does not have them yet. The charts also list{' '}
            <code>@ordinate/components</code> as a peer dependency, so the charts and the components on a page share one
            copy of the library and one set of tokens.
          </p>
        </Prose>
        <Command>npm install react react-dom</Command>
        <Prose>
          <p>
            The code editor runs on CodeMirror 6 and the schematic sketch variant on Rough.js. Both come with{' '}
            <code>@ordinate/components</code>, so there is nothing more to install for them.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="global-styles" number={3} title="Import the global styles">
        <Prose>
          <p>
            Import <code>@ordinate/global-styles/index.css</code> once, in the entry file of the application. It loads
            IBM Plex Sans, Mono, Serif and Sans Condensed, and sets the page&apos;s margin, font, text color and
            background from the design tokens. In the same file, pin the revision and choose the color mode.
          </p>
        </Prose>
        <CodeBlock
          label="main.tsx"
          code={`
import React from 'react';
import { createRoot } from 'react-dom/client';

import { applyMode, applyRevision, Mode, Revision } from '@ordinate/global-styles';
import '@ordinate/global-styles/index.css';

import App from './app';

applyRevision(Revision.V2026_1);
applyMode(Mode.System);

createRoot(document.getElementById('root')!).render(<App />);
`}
        />
        <Prose>
          <p>
            <code>applyRevision</code> fixes the look of every component, so a later version of the package cannot
            change it until you choose to. <a href="#/start/revisions">Revisions</a> explains why to pin one, and{' '}
            <a href="#/start/modes-and-density">Modes and density</a> covers <code>applyMode</code>.
          </p>
          <p>
            The <code>sketch</code> and <code>chalkboard</code> variants of Schematic use two more faces, which are kept
            out of <code>index.css</code> so other pages do not download them. Import{' '}
            <code>@ordinate/global-styles/drawing-fonts.css</code> where you use those variants.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="first-component" number={4} title="A first component">
        <Prose>
          <p>
            Import each component from its own path, <code>@ordinate/components/&lt;folder&gt;</code>, where the folder
            is the component&apos;s name in kebab case: <code>button</code>, <code>key-value-pairs</code>,{' '}
            <code>side-navigation</code>. The component is the default export, and its props type is a named export.
          </p>
        </Prose>
        <CodeBlock
          label="save-bar.tsx"
          code={`
import React, { useState } from 'react';

import Button, { ButtonProps } from '@ordinate/components/button';

export function SaveBar({ variant = 'primary' }: { variant?: ButtonProps.Variant }) {
  const [saving, setSaving] = useState(false);
  return (
    <Button variant={variant} loading={saving} onClick={() => setSaving(true)}>
      Save changes
    </Button>
  );
}
`}
        />
        <Prose>
          <p>
            The button already looks like every other Ordinate button. There is nothing to configure and nothing to
            override: components accept no <code>className</code> or <code>style</code>, only an <code>id</code> and{' '}
            <code>data-*</code> attributes. Lay components out with SpaceBetween, ColumnLayout, Grid and Box.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="css" number={5} title="How the CSS arrives">
        <Prose>
          <p>
            Each component imports its own style sheet. When your code imports <code>@ordinate/components/button</code>,
            the button&apos;s module imports its CSS, and your bundler adds it to the page next to the JavaScript. Pages
            that never import a component never download its styles.
          </p>
        </Prose>
        <Notes
          items={[
            <>
              Class names are scoped when the library is built, such as <code>ord_button_button_4GCzF</code>, so they
              cannot collide with your own CSS. Do not select them in your style sheets or tests: they change between
              versions. Tests find components through the <a href="#/start/testing">test utilities</a> instead.
            </>,
            <>
              The design tokens of every revision, style and density load once, with the first component, through a
              shared module. Pages that only use <code>@ordinate/design-tokens</code> in their own components must
              render at least one Ordinate component, or import{' '}
              <code>@ordinate/components/internal/base-component</code>.
            </>,
            <>
              The package&apos;s <code>sideEffects</code> field lists its CSS files, so bundlers that remove unused code
              keep the style sheets of the components you use.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="bundlers" number={6} title="Bundlers">
        <Prose>
          <p>
            The packages ship ES modules that import CSS, and the global styles import font files. Any bundler that
            handles CSS imported from JavaScript, and the <code>.woff</code> and <code>.woff2</code> files that CSS
            refers to, can build an Ordinate application. Vite does both with no configuration. With webpack, add a CSS
            loader and an asset rule for fonts.
          </p>
          <p>
            Some parts load later on purpose. The code editor imports CodeMirror with a dynamic <code>import()</code>{' '}
            the first time it renders, and each language when an editor first uses it, so bundlers split them into
            chunks of their own. CodeView loads each grammar the same way.
          </p>
          <p>
            Component modules start with <code>&apos;use client&apos;</code>, so frameworks with React Server Components
            treat them as client components. StyleScope does not, so it can set a style or revision from a server
            component. For server rendering with Vite or Astro, see{' '}
            <a href="#/start/server-rendering">Server rendering</a>.
          </p>
        </Prose>
      </DocSection>
    </>
  );
}

const guide: GuideDoc = {
  slug: 'installation',
  title: 'Installation',
  summary: 'Install the packages, import the global styles once, and render a first component.',
  order: 1,
  keywords: [
    'install',
    'npm',
    'peer dependencies',
    '@ordinate/components',
    '@ordinate/global-styles',
    'index.css',
    'drawing-fonts.css',
    'bundler',
    'webpack',
    'vite',
    'use client',
  ],
  Page,
};

export default guide;
