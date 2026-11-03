// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import BarChart, { BarChartProps } from '@ordinate/charts/bar-chart';
import Alert from '@ordinate/components/alert';
import Badge from '@ordinate/components/badge';
import ColumnLayout from '@ordinate/components/column-layout';
import Container from '@ordinate/components/container';
import Icon, { IconProps } from '@ordinate/components/icon';
import SpaceBetween from '@ordinate/components/space-between';
import StatusIndicator from '@ordinate/components/status-indicator';

import { href } from '../../app/router';
import { CodeBlock, DocSection, Notes, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';
import { cssVariableOf, Figure, ModePair, Split, toHex, useLiveValue } from './shared/figure';

import styles from './color.module.scss';

interface SwatchSpec {
  token: string;
  name: string;
  reference?: string;
  icon?: IconProps.Name;
  description: string;
}

const kinds: SwatchSpec[] = [
  {
    token: 'colorKindConfiguration',
    name: 'Configuration',
    reference: 'C1',
    description: 'Settings people change: environment, ports, limits.',
  },
  {
    token: 'colorKindResource',
    name: 'Resource',
    reference: 'R1',
    description: 'Things that exist or run: nodes, volumes, services.',
  },
  {
    token: 'colorKindPolicy',
    name: 'Policy',
    reference: 'P1',
    description: 'Rules the system follows: access, retention, quotas.',
  },
  { token: 'colorKindNeutral', name: 'Neutral', reference: 'N1', description: 'Anything else. The default.' },
];

const statuses: SwatchSpec[] = [
  { token: 'colorTextStatusInfo', name: 'Note', icon: 'note', description: 'Information; also underway.' },
  { token: 'colorTextStatusSuccess', name: 'Complete', icon: 'complete', description: 'Done, healthy, running.' },
  { token: 'colorTextStatusWarning', name: 'Caution', icon: 'caution', description: 'Needs attention soon.' },
  { token: 'colorTextError', name: 'Fault', icon: 'fault', description: 'Failed, or blocks the task.' },
  {
    token: 'colorTextStatusInactive',
    name: 'Inactive',
    icon: 'halted',
    description: 'Waiting, halted or queued.',
  },
];

/** One swatch: the color drawn as a kind uses it, with its computed value read from the page. */
function Swatch({ spec, mode }: { spec: SwatchSpec; mode: 'light' | 'dark' }) {
  const chip = useRef<HTMLSpanElement>(null);
  const variable = cssVariableOf(spec.token);
  const value = useLiveValue(() => (chip.current ? toHex(getComputedStyle(chip.current).backgroundColor) : ''), '', [
    mode,
  ]);
  const style = { '--swatch': `var(${variable})` } as React.CSSProperties;
  return (
    <div className={styles.swatch} style={style}>
      <span ref={chip} className={styles.chip} aria-hidden="true" />
      <div className={styles['swatch-body']}>
        <div className={styles['swatch-head']}>
          {spec.reference && <span className={styles['swatch-ref']}>{spec.reference}</span>}
          {spec.icon && (
            <span className={styles['swatch-ref']}>
              <Icon name={spec.icon} />
            </span>
          )}
          <span className={styles['swatch-name']}>{spec.name}</span>
          <span className={styles['swatch-value']}>{value}</span>
        </div>
        {spec.reference && (
          <span className={styles['swatch-line']} aria-hidden="true">
            <span className={`${styles.tick} ${styles['tick-start']}`} />
            <span className={`${styles.tick} ${styles['tick-end']}`} />
          </span>
        )}
        <p className={styles['swatch-for']}>{spec.description}</p>
        <span className={styles['swatch-token']}>{variable}</span>
      </div>
    </div>
  );
}

function SwatchPair({ specs }: { specs: SwatchSpec[] }) {
  return (
    <Figure layout="flush" grid={false}>
      <ModePair
        render={mode => (
          <div className={styles.swatches}>
            {specs.map(spec => (
              <Swatch key={spec.token} spec={spec} mode={mode} />
            ))}
          </div>
        )}
      />
    </Figure>
  );
}

const neutralTokens = [
  ['colorBackgroundLayoutMain', 'Frame'],
  ['colorBackgroundContainer', 'Sheet'],
  ['colorBackgroundItemHover', 'Hover'],
  ['colorBackgroundItemSelected', 'Raised'],
  ['colorBorderDividerSecondary', 'Hairline, faint'],
  ['colorBorderDivider', 'Hairline'],
  ['colorBorderControl', 'Control edge'],
  ['colorTextSecondary', 'Help text'],
  ['colorTextBodySecondary', 'Secondary ink'],
  ['colorTextBody', 'Ink'],
] as const;

function Neutral({ token, name, mode }: { token: string; name: string; mode: 'light' | 'dark' }) {
  const chip = useRef<HTMLSpanElement>(null);
  const value = useLiveValue(() => (chip.current ? toHex(getComputedStyle(chip.current).backgroundColor) : ''), '', [
    mode,
  ]);
  return (
    <li className={styles.neutral} style={{ '--swatch': `var(${cssVariableOf(token)})` } as React.CSSProperties}>
      <span ref={chip} className={styles['neutral-chip']} aria-hidden="true" />
      <span className={styles['swatch-name']}>{name}</span>
      <span className={styles['swatch-value']}>{value}</span>
    </li>
  );
}

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
const teams = ['Drafting', 'Survey', 'Fabrication', 'Inspection', 'Archive', 'Model shop', 'Logistics', 'Studio'];
const chartSeries: BarChartProps.SeriesSpec<string>[] = teams.map((title, series) => ({
  title,
  type: 'bar',
  data: quarters.map((x, position) => ({ x, y: 20 + ((series * 13 + position * 29) % 45) })),
}));

const chartTokens = Array.from({ length: 8 }, (_, index) => `colorChartsCategorical${index + 1}`);
const chartNames = ['Blue', 'Orange', 'Teal', 'Red', 'Violet', 'Olive', 'Plum', 'Green'];

function ChartKey() {
  return (
    <ul className={styles.palette} aria-label="Chart colors in order">
      {chartTokens.map((token, index) => (
        <li
          key={token}
          className={styles['palette-item']}
          style={{ '--swatch': `var(${cssVariableOf(token)})` } as React.CSSProperties}
        >
          <div className={styles['palette-band']} aria-hidden="true">
            <span className={`${styles['palette-light']} ord-light-mode`}>
              <span className={styles['palette-mark']} />
            </span>
            <span className={`${styles['palette-dark']} ord-dark-mode`}>
              <span className={styles['palette-mark']} />
            </span>
          </div>
          <span className={styles['swatch-name']}>
            {index + 1} {chartNames[index]}
          </span>
          <span className={styles['palette-name']}>{cssVariableOf(token)}</span>
        </li>
      ))}
    </ul>
  );
}

function Page() {
  return (
    <>
      <Prose>
        <p>
          Color in Ordinate means something (P5). There are two sets: kind colors say what a section holds, and status
          colors say how something is. Everything else is paper and ink. Color goes on marks and keys, never on whole
          surfaces, and never carries a meaning on its own.
        </p>
        <p>
          Every swatch on this sheet is drawn with the color&apos;s CSS custom property and reads its value back from
          the page, so it shows the revision and theme in effect. Each pair shows light mode beside dark mode.
        </p>
      </Prose>

      <DocSection id="kinds" number={1} title="Kinds">
        <Prose>
          <p>
            A section&apos;s kind colors its construction lines, hash marks, dimension line and reference. The three
            hues stay clear of green, amber and red, so a section is never read as healthy, late or failed. Each keeps
            at least 4.5:1 against the sheet in its mode, because the reference is text.
          </p>
        </Prose>
        <SwatchPair specs={kinds} />
        <Figure code="M1 · M8" caption="The kinds on Containers: the line, the hash marks and the reference.">
          <ColumnLayout columns={3} minColumnWidth={160}>
            <Container kind="configuration" reference="C2" heading="Ports" measure="3 open">
              443, 80 and 8443.
            </Container>
            <Container kind="resource" reference="R4" heading="Volumes" measure="2 attached">
              vol-ra4-01, vol-ra4-02.
            </Container>
            <Container kind="policy" reference="P1" heading="Retention">
              30 days, then archive.
            </Container>
          </ColumnLayout>
        </Figure>
      </DocSection>

      <DocSection id="status" number={2} title="Status colors">
        <Prose>
          <p>
            Status colors mark how something is: the icon of a StatusIndicator, the key square of a Badge, the line and
            icon of an Alert. The words stay in ink. Status and kind colors are not themeable, so their meaning holds in
            every product built with Ordinate.
          </p>
        </Prose>
        <SwatchPair specs={statuses} />
        <Figure code="M6" caption="Only the mark is colored; the words are ink.">
          <SpaceBetween size="l">
            <SpaceBetween direction="horizontal" size="l">
              <StatusIndicator state="underway">Deploying</StatusIndicator>
              <StatusIndicator state="complete">Running</StatusIndicator>
              <StatusIndicator state="caution">Degraded</StatusIndicator>
              <StatusIndicator state="fault">Failed</StatusIndicator>
              <StatusIndicator state="waiting">Waiting</StatusIndicator>
            </SpaceBetween>
            <SpaceBetween direction="horizontal" size="l">
              <Badge tone="note">Beta</Badge>
              <Badge tone="complete">Verified</Badge>
              <Badge tone="critical">Critical</Badge>
              <Badge tone="medium">Medium</Badge>
              <Badge tone="low">Low</Badge>
            </SpaceBetween>
          </SpaceBetween>
        </Figure>
      </DocSection>

      <DocSection id="never-alone" number={3} title="Never color alone">
        <Split
          text={
            <>
              <p>
                Every color is paired with something that says the same thing without it: a reference letter for a kind,
                an icon shape for a status, the fill of a key square for a severity, a pattern or a dash for a chart
                series.
              </p>
              <p>
                The figure is the same drawing with its color taken away. The sections still read as C, R and P, the
                states are still a tick, a triangle and a cross, and the severities are still solid, half and open.
              </p>
            </>
          }
        >
          <Figure code="P5" caption="In grayscale, nothing is lost.">
            <div className={styles.grayscale}>
              <SpaceBetween size="l">
                <ColumnLayout columns={3} minColumnWidth={110}>
                  <Container kind="configuration" reference="C1" heading="Settings" />
                  <Container kind="resource" reference="R1" heading="Nodes" />
                  <Container kind="policy" reference="P1" heading="Access" />
                </ColumnLayout>
                <SpaceBetween direction="horizontal" size="m">
                  <StatusIndicator state="complete">Running</StatusIndicator>
                  <StatusIndicator state="caution">Degraded</StatusIndicator>
                  <StatusIndicator state="fault">Failed</StatusIndicator>
                </SpaceBetween>
                <SpaceBetween direction="horizontal" size="m">
                  <Badge tone="high">High</Badge>
                  <Badge tone="medium">Medium</Badge>
                  <Badge tone="low">Low</Badge>
                </SpaceBetween>
              </SpaceBetween>
            </div>
          </Figure>
        </Split>
        <Notes
          items={[
            <>Pair a kind with a reference whose letter matches it: C1, R2, P3.</>,
            <>Name the state in words next to its icon. A lone colored dot is not a status.</>,
            <>Do not fill a whole surface with a kind or status color. Color the mark, keep the surface paper.</>,
            <>
              Do not reach for a kind color to decorate. Leave a section <code>neutral</code> when it holds nothing in
              particular.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="paper-and-ink" number={4} title="Paper and ink">
        <Prose>
          <p>
            The rest of the interface is drawn in neutrals: a gray frame around white sheets, hairlines in two
            strengths, and ink in two strengths. Dark mode is chalk on dark paper, not an inverted page: the ink becomes
            a warm chalk white, and the sheet a dark slate.
          </p>
        </Prose>
        <Figure layout="flush" grid={false}>
          <ModePair
            render={mode => (
              <ul className={styles.neutrals}>
                {neutralTokens.map(([token, name]) => (
                  <Neutral key={token} token={token} name={name} mode={mode} />
                ))}
              </ul>
            )}
          />
        </Figure>
      </DocSection>

      <DocSection id="charts" number={5} title="Chart palette">
        <Prose>
          <p>
            Charts take their series colors from <code>color-charts-categorical1</code> to <code>8</code>, in order:
            blue, orange, teal, red, violet, olive, plum, green. Neighbors stay apart for red-green color blindness, and
            each color keeps at least 3:1 against the sheet in both modes. Every series also gets a fill pattern, or a
            dash and a marker, so the chart reads in grayscale too. See <a href={href('/packages/charts')}>Charts</a>.
          </p>
        </Prose>
        <ChartKey />
        <Figure code="K" caption="Eight bar series, each with its color and fill pattern.">
          <BarChart
            series={chartSeries}
            height={220}
            hideFilter={true}
            legendTitle="Team"
            xTitle="Quarter"
            ariaLabel="Eight teams by quarter, one for each chart color"
          />
        </Figure>
      </DocSection>

      <DocSection id="in-code" number={6} title="In your own components">
        <Prose>
          <p>
            Use the kind and status tokens for marks in custom components, through the{' '}
            <a href={href('/foundations/tokens')}>design tokens</a>. They follow the mode and revision without any work
            on your part.
          </p>
        </Prose>
        <CodeBlock
          label="usage-key.scss"
          language="css"
          code={`
@use '@ordinate/design-tokens' as ord;

.usage-key {
  inline-size: ord.$size-key-square;
  block-size: ord.$size-key-square;
  background-color: ord.$color-kind-resource;
}
`}
        />
        <Alert type="note" header="What a theme can change">
          A theme can change the brand colors: the primary button, links, the accent, focus and selection. It cannot
          change kind, status or body text colors, because their meaning and contrast have to hold everywhere.
        </Alert>
      </DocSection>
    </>
  );
}

const doc: GuideDoc = {
  slug: 'color',
  title: 'Color',
  summary: 'Kind colors for what a section holds, status colors for how it is, paper and ink for the rest.',
  order: 4,
  keywords: ['kind', 'configuration', 'resource', 'policy', 'status', 'dark mode', 'palette', 'chart colors'],
  Page,
};

export default doc;
