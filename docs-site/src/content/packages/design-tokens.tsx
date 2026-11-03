// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '@ordinate/components/box';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';
import Table from '@ordinate/components/table';
import TextFilter from '@ordinate/components/text-filter';
import * as designTokens from '@ordinate/design-tokens';

import { Example } from '../../parts/example';
import { CodeBlock, Command, DocSection, Notes, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';
import { LoadedExample } from '../../registry/types';

const example: LoadedExample = {
  meta: {
    id: 'revision-note',
    title: 'A custom element drawn with tokens',
    description: (
      <p>
        A revision schedule that Ordinate does not ship, set with the same margin column, mono captions, kind color and
        hairlines as the components. Switch the mode or the revision above it and it follows.
      </p>
    ),
  },
  load: () => import('./design-tokens/revision-note'),
  loadSource: () => import('./design-tokens/revision-note.tsx?raw').then(module => module.default),
};

type Family = 'color' | 'border' | 'type' | 'space' | 'size' | 'motion' | 'opacity';

const families: ReadonlyArray<{ id: Family; text: string; test: RegExp }> = [
  { id: 'color', text: 'Color', test: /^color/ },
  { id: 'border', text: 'Border', test: /^border/ },
  { id: 'type', text: 'Type', test: /^(font|lineHeight|letterSpacing)/ },
  { id: 'space', text: 'Space', test: /^space/ },
  { id: 'size', text: 'Size', test: /^(size|rotate)/ },
  { id: 'motion', text: 'Motion', test: /^motion/ },
  { id: 'opacity', text: 'Opacity', test: /^opacity/ },
];

interface Token {
  name: string;
  sass: string;
  property: string;
  value: string;
  family: Family;
}

const tokens: ReadonlyArray<Token> = Object.entries(designTokens as Record<string, string>).map(([name, value]) => {
  const property = value.replace(/^var\((.*)\)$/, '$1');
  return {
    name,
    sass: `$${property.replace(/^--ord-/, '')}`,
    property,
    value,
    family: families.find(family => family.test.test(name))?.id ?? 'size',
  };
});

function TokenSchedule() {
  const [family, setFamily] = useState<Family>('color');
  const [filter, setFilter] = useState('');
  const text = filter.trim().toLowerCase();
  const items = tokens.filter(token =>
    text ? [token.name, token.sass, token.property].some(name => name.toLowerCase().includes(text)) : token.family === family
  );

  return (
    <SpaceBetween size="m">
      <SpaceBetween direction="horizontal" size="m" alignItems="end">
        <SegmentedControl
          label="Family"
          selectedId={text ? null : family}
          options={families.map(({ id, text: label }) => ({ id, text: label }))}
          onChange={event => {
            setFilter('');
            setFamily(event.detail.selectedId as Family);
          }}
        />
        <TextFilter
          filteringText={filter}
          filteringPlaceholder={`Find in all ${tokens.length} tokens`}
          filteringAriaLabel="Find a token"
          filteringClearAriaLabel="Clear"
          countText={text ? `${items.length} matches` : undefined}
          onChange={event => setFilter(event.detail.filteringText)}
        />
      </SpaceBetween>
      <Table
        variant="embedded"
        caption="Schedule of tokens"
        trackBy="name"
        items={items}
        stickyHeader={true}
        ariaLabels={{ tableLabel: 'Design tokens' }}
        empty={<Box color="text-body-secondary">No token matches the filter.</Box>}
        columnDefinitions={[
          {
            id: 'swatch',
            header: 'Now',
            width: 64,
            cell: token =>
              token.family === 'color' ? (
                <span
                  aria-hidden="true"
                  style={{
                    display: 'inline-block',
                    inlineSize: '24px',
                    blockSize: '16px',
                    background: token.value,
                    border: `${designTokens.borderWidthDefault} solid ${designTokens.colorBorderDivider}`,
                    verticalAlign: 'middle',
                  }}
                />
              ) : null,
          },
          { id: 'name', header: 'JavaScript', cell: token => token.name, contentType: 'identifier', isRowHeader: true },
          { id: 'sass', header: 'Sass', cell: token => token.sass, contentType: 'identifier' },
          { id: 'property', header: 'Custom property', cell: token => token.property, contentType: 'identifier' },
        ]}
      />
    </SpaceBetween>
  );
}

const sassUsage = `
@use '@ordinate/design-tokens' as ord;

.revision-schedule {
  display: grid;
  grid-template-columns: ord.$size-margin-column 1fr;
  gap: ord.$space-s;
  padding-block: ord.$space-scaled-m;
  border-block-start: ord.$border-width-default solid ord.$color-border-divider;
  color: ord.$color-text-body;
}

.reference {
  font-family: ord.$font-family-mono;
  color: ord.$color-kind-configuration;
}`;

const jsUsage = `
import { colorKindConfiguration, fontFamilyMono, spaceXs } from '@ordinate/design-tokens';

// Each constant is a CSS custom property reference.
colorKindConfiguration; // 'var(--ord-color-kind-configuration)'

<span style={{ color: colorKindConfiguration, fontFamily: fontFamilyMono, marginInlineStart: spaceXs }}>C1</span>;`;

const cssUsage = `
.revision-schedule {
  border-block-start: var(--ord-border-width-default) solid var(--ord-color-border-divider);
}`;

function Page() {
  return (
    <>
      <DocSection id="overview" number={1} title="Overview">
        <Prose>
          <p>
            Every color, length, face and timing in Ordinate comes from a design token.{' '}
            <code>@ordinate/design-tokens</code> gives your own components the same tokens, as Sass variables and as
            JavaScript constants, so a custom element sits on the sheet like the components around it.
          </p>
          <p>
            Each token is a reference to a CSS custom property, such as <code>var(--ord-color-text-body)</code>, never a
            raw value. The value comes from the page at the moment it is drawn, so the token follows the pinned revision,
            light or dark mode, compact density, the website style and any <code>applyTheme</code> theme, as the
            built-in components do.
          </p>
        </Prose>
        <Command>npm install @ordinate/design-tokens</Command>
      </DocSection>

      <DocSection id="example" number={2} title="Example">
        <Example example={example} index={1} />
        <Prose>
          <p>
            The example uses a <code>style</code> prop because it styles its own elements. Never set{' '}
            <code>style</code> or <code>className</code> on an Ordinate component; arrange components with{' '}
            <a href="#/components/space-between">SpaceBetween</a>, <a href="#/components/box">Box</a> and{' '}
            <a href="#/components/grid">Grid</a>.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="sass" number={3} title="In Sass">
        <Prose>
          <p>
            The package&apos;s <code>sass</code> entry is <code>index.scss</code>, which holds one variable per token
            with the same name as the custom property: <code>ord.$color-text-body</code> is{' '}
            <code>var(--ord-color-text-body)</code>. Use it from a module or a global style sheet.
          </p>
        </Prose>
        <CodeBlock label="revision-schedule.module.scss" language="css" code={sassUsage} />
      </DocSection>

      <DocSection id="javascript" number={4} title="In JavaScript">
        <Prose>
          <p>
            Each token is also a camelCase constant, typed as its exact string, for inline styles, CSS-in-JS and
            canvas or SVG drawing that reads a color.
          </p>
        </Prose>
        <CodeBlock label="revision-schedule.tsx" code={jsUsage} />
        <Prose>
          <p>Plain CSS can use the custom properties directly. The names are the same.</p>
        </Prose>
        <CodeBlock label="revision-schedule.css" language="css" code={cssUsage} />
      </DocSection>

      <DocSection id="values" number={5} title="Where the values come from">
        <Notes
          items={[
            <>
              The package holds names only. The values load with the revision styles that come with any{' '}
              <code>@ordinate/components</code> component. On a page that uses tokens but renders no Ordinate component,
              import <code>@ordinate/components/internal/base-component</code> once.
            </>,
            <>
              The oldest supported revision also applies to <code>:root</code>, so tokens have values without{' '}
              <code>applyRevision</code>. A revision applied to an element gives its subtree that revision&apos;s
              values. See <a href="#/packages/global-styles">Global styles</a>.
            </>,
            <>
              Colors are written with <code>light-dark()</code>, so one token holds both modes and the mode class only
              changes <code>color-scheme</code>.
            </>,
            <>
              <code>space-scaled-*</code> tokens and control heights tighten in compact density. Use them for padding
              inside rows and containers. <code>space-*</code> stays the same; use it for gaps that carry meaning, such
              as between an icon and its label.
            </>,
            <>
              Read the computed value, for a chart drawn on a canvas for example, with{' '}
              <code>getComputedStyle(element).getPropertyValue(&apos;--ord-color-text-body&apos;)</code> on an element
              inside the revision you want.
            </>,
          ]}
        />
      </DocSection>

      <DocSection
        id="tokens"
        number={6}
        title="Every token"
        description="The swatch shows each color in the current mode and revision. Type to search all families."
      >
        <TokenSchedule />
      </DocSection>
    </>
  );
}

const doc: GuideDoc = {
  slug: 'design-tokens',
  title: 'Design tokens',
  summary: 'The tokens behind every component, as Sass variables and JavaScript constants for your own components.',
  order: 3,
  keywords: ['@ordinate/design-tokens', 'tokens', 'Sass', 'custom properties', 'CSS variables', 'colors', 'spacing'],
  Page,
};

export default doc;
