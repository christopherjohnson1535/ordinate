// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Table from '@ordinate/components/table';

import { Example } from '../../parts/example';
import { CodeBlock, Command, DocSection, Notes, Prose, SubHeading } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';
import { LoadedExample } from '../../registry/types';

const example: LoadedExample = {
  meta: {
    id: 'scoped-display',
    title: 'One panel in its own mode, revision and density',
    description: (
      <p>
        Every helper takes a target element. Here they act on one panel, so it can be dark, compact or on 2026.2 while
        the rest of the page stays as it is.
      </p>
    ),
  },
  load: () => import('./global-styles/scoped-display'),
  loadSource: () => import('./global-styles/scoped-display.tsx?raw').then(module => module.default),
};

interface Row {
  name: string;
  type: string;
  description: React.ReactNode;
}

function Schedule({ caption, rows }: { caption: string; rows: ReadonlyArray<Row> }) {
  return (
    <Table
      variant="embedded"
      wrapLines={true}
      caption={caption}
      trackBy="name"
      items={rows}
      ariaLabels={{ tableLabel: caption }}
      columnDefinitions={[
        { id: 'name', header: 'Name', cell: row => <code>{row.name}</code>, width: '32%', isRowHeader: true },
        { id: 'type', header: 'Value or class', cell: row => <code>{row.type}</code>, width: '28%' },
        { id: 'description', header: 'Description', cell: row => row.description },
      ]}
    />
  );
}

const functionRows: ReadonlyArray<Row> = [
  {
    name: 'applyMode(mode, target?)',
    type: 'ord-light-mode, ord-dark-mode, ord-system-mode',
    description: (
      <>
        Sets light, dark or system mode on <code>target</code> by setting its <code>color-scheme</code>. System follows
        the operating system. <code>null</code> removes the class, which returns to light.
      </>
    ),
  },
  {
    name: 'applyRevision(revision, target?)',
    type: 'ord-revision-2026-1, ord-revision-2026-2',
    description: (
      <>
        Pins every component inside <code>target</code> to one design revision, replacing any revision class already
        on it. <code>null</code> returns to the default, the oldest supported revision.
      </>
    ),
  },
  {
    name: 'applyStyle(style, target?)',
    type: 'ord-style-editorial, ord-style-studio, ord-style-shopfront',
    description: (
      <>
        Sets the voice of every component inside <code>target</code>. A style sits on top of the pinned revision and
        changes only the tokens it lists. <code>console</code> or <code>null</code> removes the class, which returns to
        the default.
      </>
    ),
  },
  {
    name: 'applyDensity(density, target?)',
    type: 'ord-compact-mode',
    description: (
      <>
        Compact tightens padding and control heights inside <code>target</code>. <code>null</code> or{' '}
        <code>comfortable</code> returns to the default.
      </>
    ),
  },
  {
    name: 'disableMotion(disabled, target?)',
    type: 'ord-motion-disabled',
    description:
      'Turns off component animation inside target, on top of the reduced-motion setting of the operating system, which components always follow.',
  },
];

const enumRows: ReadonlyArray<Row> = [
  { name: 'Mode.Light', type: "'light'", description: 'Light mode. The default.' },
  { name: 'Mode.Dark', type: "'dark'", description: 'Dark mode.' },
  { name: 'Mode.System', type: "'system'", description: 'Follows the operating system.' },
  {
    name: 'Revision.V2026_1',
    type: "'2026.1'",
    description: 'Square corners. The oldest supported revision, so the default.',
  },
  {
    name: 'Revision.V2026_2',
    type: "'2026.2'",
    description: 'Soft corners on buttons, fields, containers and badges. Every other value matches 2026.1.',
  },
  { name: 'Style.Console', type: "'console'", description: 'Applications, drawn like a set of drawings. The default.' },
  {
    name: 'Style.Editorial',
    type: "'editorial'",
    description: 'Journals, blogs and newsletters: serif headlines and a very large type scale.',
  },
  {
    name: 'Style.Studio',
    type: "'studio'",
    description: 'Portfolios and practices: light, oversized headlines and catalogue captions.',
  },
  {
    name: 'Style.Shopfront',
    type: "'shopfront'",
    description: 'Shops, cafés and local services: condensed headlines, cobalt and sunflower, rounded buttons.',
  },
  { name: 'Density.Comfortable', type: "'comfortable'", description: 'The default spacing.' },
  { name: 'Density.Compact', type: "'compact'", description: 'Tighter padding and shorter controls.' },
];

const fontRows: ReadonlyArray<Row> = [
  {
    name: 'IBM Plex Sans',
    type: '300, 400, 400 italic, 500, 600, 700',
    description: 'Words: labels, body text, headings.',
  },
  { name: 'IBM Plex Mono', type: '400, 500', description: 'Captions, references, measures, code and data.' },
  {
    name: 'IBM Plex Serif',
    type: '400, 400 italic, 600',
    description: 'Headlines and reading text in the editorial style.',
  },
  { name: 'IBM Plex Sans Condensed', type: '400, 500, 600, 700', description: 'Headlines in the shopfront style.' },
];

const setup = `
import '@ordinate/global-styles/index.css';
import { applyMode, applyRevision, Mode, Revision } from '@ordinate/global-styles';

// Pin the revision you designed against, so an upgrade of the package cannot change how the app looks.
applyRevision(Revision.V2026_1);
applyMode(Mode.System);`;

const indexCss = `
body {
  margin-block: 0;
  margin-inline: 0;
  font-family: var(--ord-font-family-base, system-ui, sans-serif);
  font-size: var(--ord-font-size-body, 14px);
  line-height: var(--ord-line-height-body, 1.5);
  color: var(--ord-color-text-body);
  background-color: var(--ord-color-background-layout-main);
}`;

const drawingFonts = `
import '@ordinate/global-styles/drawing-fonts.css';
import Schematic from '@ordinate/components/schematic';

<Schematic variant="sketch" width={640} height={320} parts={parts} wires={wires} ariaLabel="Wiring of the annex" />;`;

const scoped = `
const preview = document.querySelector('#preview')!;

applyRevision(Revision.V2026_2, preview);
applyMode(Mode.Dark, preview);
applyStyle(Style.Shopfront, preview);`;

function Page() {
  return (
    <>
      <DocSection id="overview" number={1} title="Overview">
        <Prose>
          <p>
            <code>@ordinate/global-styles</code> holds what belongs to the page rather than to one component: the
            fonts, the body styles, and the functions that set mode, revision, style, density and motion. Import the
            style sheet once at the entry of your application, then set the display before the first render.
          </p>
        </Prose>
        <Command>npm install @ordinate/global-styles</Command>
        <CodeBlock label="main.tsx" code={setup} />
      </DocSection>

      <DocSection id="index-css" number={2} title="index.css">
        <Prose>
          <p>
            <code>@ordinate/global-styles/index.css</code> loads the IBM Plex faces from Fontsource and sets the{' '}
            <code>body</code> in the base face, size and colors, with no margin. The faces are bundled with your
            application, so nothing is fetched from a font service at run time.
          </p>
        </Prose>
        <Schedule caption="Schedule of faces" rows={fontRows} />
        <CodeBlock label="index.css (the body rule)" language="css" code={indexCss} />
        <Prose>
          <p>
            The body reads tokens, so it changes with the mode and revision set on <code>body</code>. Without{' '}
            <code>index.css</code> the components still work, but they fall back to the system faces in the token font
            stacks.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="drawing-fonts" number={3} title="drawing-fonts.css">
        <Prose>
          <p>
            <code>@ordinate/global-styles/drawing-fonts.css</code> adds two faces used only by drawings: Virgil, the hand
            lettering of the <code>sketch</code> variant of <a href="#/components/schematic">Schematic</a>, and CMU
            Serif, regular and bold, for the <code>chalkboard</code> variant. Import it only on pages that use those
            variants. Without it they fall back to the next faces in <code>font-family-hand</code> and{' '}
            <code>font-family-chalkboard</code>.
          </p>
        </Prose>
        <CodeBlock label="wiring-diagram.tsx" code={drawingFonts} />
        <Prose>
          <p>Both faces are under the SIL Open Font License 1.1, listed in the package&apos;s fonts/README.md.</p>
        </Prose>
      </DocSection>

      <DocSection id="functions" number={4} title="Functions">
        <Prose>
          <p>
            Each function toggles a class on <code>target</code>, which defaults to <code>document.body</code>. The class
            changes the tokens for everything inside the target, so the setting applies to a whole page or to one
            subtree. A value the enum does not hold is ignored with a console warning.
          </p>
        </Prose>
        <Schedule caption="Schedule of functions" rows={functionRows} />
        <SubHeading id="scoped">Scoped to a subtree</SubHeading>
        <Prose>
          <p>
            Pass an element to set the display of one part of a page: a preview, a printed panel, a public page inside
            an application. Revisions and density nest, so a subtree pinned to 2026.2 inside a compact page keeps its
            own compact values.
          </p>
        </Prose>
        <CodeBlock label="preview.ts" code={scoped} />
        <Example example={example} index={1} />
      </DocSection>

      <DocSection id="enums" number={5} title="Enums">
        <Schedule caption="Schedule of enums" rows={enumRows} />
        <Notes
          items={[
            <>
              A published revision never changes. A new one gets the next calendar version and a new{' '}
              <code>Revision</code> member, and the default stays on the oldest until it is retired.
            </>,
            <>
              For brand colors, fonts and corner radii, use <code>applyTheme</code> from{' '}
              <code>@ordinate/components/theming</code>. A theme sits on top of the revision and the style.
            </>,
            <>
              The tokens these classes change are listed on <a href="#/packages/design-tokens">Design tokens</a>.
            </>,
          ]}
        />
      </DocSection>
    </>
  );
}

const doc: GuideDoc = {
  slug: 'global-styles',
  title: 'Global styles',
  summary: 'Fonts, page styles, and the functions that set mode, revision, style, density and motion.',
  order: 4,
  keywords: [
    '@ordinate/global-styles',
    'applyMode',
    'applyRevision',
    'applyStyle',
    'applyDensity',
    'disableMotion',
    'Mode',
    'Revision',
    'Style',
    'Density',
    'index.css',
    'drawing-fonts.css',
    'fonts',
    'dark mode',
  ],
  Page,
};

export default doc;
