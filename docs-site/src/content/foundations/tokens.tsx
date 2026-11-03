// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useCollection } from '@ordinate/collection-hooks';
import Box from '@ordinate/components/box';
import CopyToClipboard from '@ordinate/components/copy-to-clipboard';
import Header from '@ordinate/components/header';
import Pagination from '@ordinate/components/pagination';
import Select, { SelectProps } from '@ordinate/components/select';
import Table, { TableProps } from '@ordinate/components/table';
import TextFilter from '@ordinate/components/text-filter';
import Toggle from '@ordinate/components/toggle';
import * as designTokens from '@ordinate/design-tokens';
import { applyRevision, Revision } from '@ordinate/global-styles';

import { href } from '../../app/router';
import { useIsDark, useSettings } from '../../app/settings';
import { CodeBlock, DocSection, Notes, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';
import { cssVariableOf, sassNameOf, toHex } from './shared/figure';

import styles from './tokens.module.scss';

type Category = 'Palette' | 'Color' | 'Border' | 'Radius' | 'Typography' | 'Space' | 'Size' | 'Motion' | 'Opacity';

const paletteNames =
  /^color(White|Grey\d+|Blue\d+|Red\d+|Green\d+|Ochre\d+|Chalk\d+|ChalkMark|Cyan\d+|Terminal|TerminalDark|Cobalt\d+|Sunflower\d+|Teal\d+|Plum\d+)$/;

function categoryOf(name: string): Category {
  if (paletteNames.test(name)) return 'Palette';
  if (name.startsWith('color')) return 'Color';
  if (name.startsWith('borderRadius')) return 'Radius';
  if (name.startsWith('border')) return 'Border';
  if (/^(font|lineHeight|letterSpacing)/.test(name)) return 'Typography';
  if (name.startsWith('space')) return 'Space';
  if (name.startsWith('motion')) return 'Motion';
  if (name.startsWith('opacity')) return 'Opacity';
  return 'Size';
}

const categories: Category[] = [
  'Color',
  'Palette',
  'Typography',
  'Space',
  'Size',
  'Border',
  'Radius',
  'Motion',
  'Opacity',
];

// Every export of @ordinate/design-tokens is a token. The schedule groups them by kind.
const tokenNames = Object.keys(designTokens).filter(
  name => typeof (designTokens as Record<string, unknown>)[name] === 'string'
);

interface TokenRow {
  name: string;
  sass: string;
  css: string;
  category: Category;
  value: string;
  other: string;
}

const revisions = Object.values(Revision);

/** Resolves a token's value on a probe. Colors are painted and read back, so `light-dark()` resolves. */
function resolve(probe: HTMLElement, painter: HTMLElement, row: { name: string; css: string; category: Category }) {
  if (row.category === 'Color' || row.category === 'Palette') {
    painter.style.backgroundColor = `var(${row.css})`;
    return toHex(getComputedStyle(painter).backgroundColor);
  }
  return getComputedStyle(probe).getPropertyValue(row.css).trim();
}

function useTokenValues(revision: Revision) {
  const { settings } = useSettings();
  const dark = useIsDark();
  const probes = useRef<Record<string, HTMLDivElement | null>>({});
  const [values, setValues] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const next: Record<string, Record<string, string>> = {};
      for (const id of revisions) {
        const probe = probes.current[id];
        const painter = probe?.firstElementChild as HTMLElement | null;
        if (!probe || !painter) continue;
        applyRevision(id, probe);
        next[id] = {};
        for (const name of tokenNames) {
          const css = cssVariableOf(name);
          next[id][name] = resolve(probe, painter, { name, css, category: categoryOf(name) });
        }
      }
      setValues(next);
    });
    return () => cancelAnimationFrame(frame);
  }, [settings, dark, revision]);

  const probeElements = (
    <div className={styles.probes} aria-hidden="true">
      {revisions.map(id => (
        <div key={id} ref={element => void (probes.current[id] = element)}>
          <span />
        </div>
      ))}
    </div>
  );
  return { values, probeElements };
}

function Sample({ row }: { row: TokenRow }) {
  if (row.category === 'Color' || row.category === 'Palette') {
    return <span className={styles.chip} style={{ backgroundColor: `var(${row.css})` }} aria-hidden="true" />;
  }
  if (row.category === 'Radius') {
    return <span className={styles.corner} style={{ borderStartStartRadius: `var(${row.css})` }} aria-hidden="true" />;
  }
  if ((row.category === 'Space' || row.category === 'Size') && /^\d+(\.\d+)?px$/.test(row.value)) {
    return <span className={styles.bar} style={{ inlineSize: `var(${row.css})` }} aria-hidden="true" />;
  }
  return null;
}

const columns: TableProps.ColumnDefinition<TokenRow>[] = [
  {
    id: 'name',
    header: 'Token',
    isRowHeader: true,
    sortingField: 'name',
    width: 320,
    cell: row => (
      <span className={styles.name}>
        <span className={styles.js}>{row.name}</span>
        <span className={styles.sass}>
          {row.sass} · var({row.css})
        </span>
      </span>
    ),
  },
  { id: 'category', header: 'Kind', sortingField: 'category', width: 120, cell: row => row.category },
  {
    id: 'value',
    header: 'Value here',
    sortingField: 'value',
    cell: row => (
      <span className={`${styles.value} ${row.value !== row.other ? styles.differs : ''}`}>
        <Sample row={row} />
        {row.value || '—'}
      </span>
    ),
  },
  {
    id: 'other',
    header: 'Other revision',
    cell: row => (
      <Box color={row.value === row.other ? 'text-body-secondary' : 'inherit'} fontSize="body-s">
        {row.value === row.other ? 'Same' : row.other}
      </Box>
    ),
  },
  {
    id: 'copy',
    header: 'Copy',
    width: 72,
    cell: row => (
      <span className={styles.copy}>
        <CopyToClipboard
          variant="icon"
          textToCopy={row.name}
          copyButtonAriaLabel={`Copy ${row.name}`}
          copySuccessText={`Copied ${row.name}`}
          copyErrorText="The browser did not allow copying"
        />
      </span>
    ),
  },
];

const allOption: SelectProps.Option = { value: 'all', label: 'Every kind' };
const categoryOptions: SelectProps.Option[] = [
  allOption,
  ...categories.map(category => ({ value: category, label: category })),
];

function Schedule() {
  const { settings } = useSettings();
  const dark = useIsDark();
  const { values, probeElements } = useTokenValues(settings.revision);
  const [category, setCategory] = useState<SelectProps.Option>(allOption);
  const [onlyDifferent, setOnlyDifferent] = useState(false);

  const current = settings.revision;
  const other = revisions.find(id => id !== current) ?? current;

  const rows = useMemo<TokenRow[]>(
    () =>
      tokenNames
        .map(name => ({
          name,
          sass: sassNameOf(name),
          css: cssVariableOf(name),
          category: categoryOf(name),
          value: values[current]?.[name] ?? '',
          other: values[other]?.[name] ?? '',
        }))
        .filter(row => category.value === 'all' || row.category === category.value)
        .filter(row => !onlyDifferent || row.value !== row.other)
        .sort((a, b) => categories.indexOf(a.category) - categories.indexOf(b.category)),
    [values, current, other, category, onlyDifferent]
  );

  const { items, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(rows, {
    filtering: {
      fields: ['name', 'sass', 'css', 'value', 'category'],
      noMatch: (
        <Box textAlign="center" color="inherit">
          <Box variant="strong">No tokens match</Box>
          <Box padding={{ top: 'xs', bottom: 's' }} color="text-body-secondary">
            Try part of a name, such as kind or radius, or clear the filter.
          </Box>
        </Box>
      ),
    },
    sorting: {},
    pagination: { pageSize: 40 },
  });

  return (
    <>
      {probeElements}
      <Table
        {...collectionProps}
        items={items}
        columnDefinitions={columns}
        trackBy="name"
        variant="embedded"
        wrapLines={true}
        loading={Object.keys(values).length === 0}
        loadingText="Reading the tokens"
        ariaLabels={{ tableLabel: 'Design tokens' }}
        header={
          <Header
            variant="h3"
            counter={`(${rows.length})`}
            description={`Read from this page in ${dark ? 'dark' : 'light'} mode, ${settings.density} density, revision ${current}. Change them in the display settings and the values follow.`}
          >
            Schedule of tokens
          </Header>
        }
        filter={
          <div className={styles.filters}>
            <TextFilter
              {...filterProps}
              filteringPlaceholder="Find a token by name or value"
              filteringAriaLabel="Find a token"
              countText={filterProps.filteringText ? `${filteredItemsCount} matches` : undefined}
            />
            <Select
              selectedOption={category}
              onChange={event => setCategory(event.detail.selectedOption)}
              options={categoryOptions}
              ariaLabel="Kind of token"
            />
            <Toggle checked={onlyDifferent} onChange={event => setOnlyDifferent(event.detail.checked)}>
              Only where {current} and {other} differ
            </Toggle>
          </div>
        }
        pagination={<Pagination {...paginationProps} ariaLabels={{ pageLabel: page => `Tokens, page ${page}` }} />}
      />
    </>
  );
}

function Page() {
  return (
    <>
      <Prose>
        <p>
          Every visual value in Ordinate is a design token: {tokenNames.length} of them, from colors to the length of a
          crop mark. Each compiles to a CSS custom property, and its value comes from the revision, mode, density, style
          and theme in effect where it is read. The schedule reads each value from this page as you see it.
        </p>
      </Prose>

      <DocSection id="schedule" number={1} title="Every token">
        <Schedule />
      </DocSection>

      <DocSection id="names" number={2} title="Three names for each token">
        <Prose>
          <p>
            A token has a JavaScript name, a Sass name and a CSS custom property. All three point at the same value, so
            pick the one that suits the file you are writing.
          </p>
        </Prose>
        <CodeBlock
          label="summary.module.scss"
          language="css"
          code={`
@use '@ordinate/design-tokens' as ord;

.summary {
  padding-block: ord.$space-scaled-m;
  border-block-end: ord.$border-width-default solid ord.$color-border-divider;
  color: ord.$color-text-body;
}
`}
        />
        <CodeBlock
          label="summary.tsx"
          code={`
import { colorTextBodySecondary, spaceXs } from '@ordinate/design-tokens';

<span style={{ color: colorTextBodySecondary, marginInlineStart: spaceXs }}>Updated hourly</span>;
`}
        />
        <Notes
          items={[
            <>
              The package holds references only, such as <code>var(--ord-space-xs)</code>. The values load with any
              Ordinate component, so render at least one on pages that use the tokens.
            </>,
            <>
              Prefer the semantic tokens, such as <code>color-text-body</code> or <code>color-kind-resource</code>, over
              the palette. The palette is what the revisions are built from, and its names do not say what a color is
              for.
            </>,
            <>
              Use logical properties with the tokens, such as <code>padding-inline-start</code>, so a right-to-left page
              mirrors.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="revisions" number={3} title="Revisions">
        <Prose>
          <p>
            A revision is a complete, frozen set of token values. 2026.1 draws square corners; 2026.2 changes only the
            corner radii, to soft ones. Turn on &quot;Only where they differ&quot; in the schedule to see exactly what
            changes, and see <a href={href('/start/revisions')}>Revisions</a> for pinning one.
          </p>
        </Prose>
      </DocSection>
    </>
  );
}

const doc: GuideDoc = {
  slug: 'tokens',
  title: 'Tokens',
  summary: 'A schedule of every design token, with its Sass and JavaScript names and its value on this page.',
  order: 9,
  keywords: ['design tokens', '@ordinate/design-tokens', 'css variables', 'custom properties', 'sass', 'revision'],
  Page,
};

export default doc;
