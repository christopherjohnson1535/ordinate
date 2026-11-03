// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import Button from '@ordinate/components/button';
import Container from '@ordinate/components/container';
import FormField from '@ordinate/components/form-field';
import Input from '@ordinate/components/input';
import KeyValuePairs from '@ordinate/components/key-value-pairs';
import SpaceBetween from '@ordinate/components/space-between';
import StatusIndicator from '@ordinate/components/status-indicator';
import StyleScope from '@ordinate/components/style-scope';
import Table from '@ordinate/components/table';

import { href } from '../../app/router';
import { CodeBlock, DocSection, Notes, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';
import { cssVariableOf, Figure, readToken, Split, useLiveValue } from './shared/figure';

import styles from './space-and-layout.module.scss';

/** A dimension line whose length is a token, with the token's measured value after it. */
function Dimension({ token, label, scale = 1 }: { token: string; label?: string; scale?: number }) {
  const line = useRef<HTMLSpanElement>(null);
  const value = useLiveValue(() => (line.current ? readToken(line.current, token) : ''), '');
  return (
    <span className={styles.measure}>
      <span
        ref={line}
        className={styles.dimension}
        style={{ '--length': `calc(var(${cssVariableOf(token)}) * ${scale})` } as React.CSSProperties}
        aria-hidden="true"
      >
        <span className={`${styles.hash} ${styles['hash-start']}`} />
        <span className={`${styles.hash} ${styles['hash-end']}`} />
      </span>
      <span className={styles.value}>
        <span className={styles['value-strong']}>{value}</span>
        {label && ` ${label}`}
      </span>
    </span>
  );
}

const spaceScale = [
  ['spaceXxxs', 'Hairline gaps: a key square and its word'],
  ['spaceXxs', 'An icon and its label'],
  ['spaceXs', 'Buttons in a row, tight lists'],
  ['spaceS', 'Fields in a group, cell padding'],
  ['spaceM', 'Between related blocks'],
  ['spaceL', 'Between groups in a section'],
  ['spaceXl', 'Between sections of a form'],
  ['spaceXxl', 'Between sections of a page'],
  ['spaceXxxl', 'Between the major parts of a page'],
] as const;

const scaled = [
  ['spaceScaledXs', 'Padding in rows and lists'],
  ['spaceScaledS', 'Padding in controls'],
  ['spaceScaledM', 'Padding in containers'],
  ['spaceScaledL', 'Padding around content'],
  ['spaceContainer', 'Inset of a container'],
  ['sizeControlHeight', 'Height of a field or button'],
] as const;

/** Reads a density token's comfortable and compact values, as the revision defines them. */
function DensityPair({ token }: { token: string }) {
  const probe = useRef<HTMLDivElement>(null);
  const [comfortable, compact] = useLiveValue(
    () =>
      probe.current
        ? [readToken(probe.current, `${token}Comfortable`), readToken(probe.current, `${token}Compact`)]
        : ['', ''],
    ['', '']
  );
  return (
    <div ref={probe} className={styles.pair}>
      <div className={styles['pair-row']}>
        <span className={styles['pair-label']}>Comfortable</span>
        <span className={styles.measure}>
          <span
            className={styles.dimension}
            style={{ '--length': `var(${cssVariableOf(token)}-comfortable)` } as React.CSSProperties}
            aria-hidden="true"
          >
            <span className={`${styles.hash} ${styles['hash-start']}`} />
            <span className={`${styles.hash} ${styles['hash-end']}`} />
          </span>
          <span className={`${styles.value} ${styles['value-strong']}`}>{comfortable}</span>
        </span>
      </div>
      <div className={styles['pair-row']}>
        <span className={styles['pair-label']}>Compact</span>
        <span className={styles.measure}>
          <span
            className={styles.dimension}
            style={{ '--length': `var(${cssVariableOf(token)}-compact)` } as React.CSSProperties}
            aria-hidden="true"
          >
            <span className={`${styles.hash} ${styles['hash-start']}`} />
            <span className={`${styles.hash} ${styles['hash-end']}`} />
          </span>
          <span className={`${styles.value} ${styles['value-strong']}`}>{compact}</span>
        </span>
      </div>
    </div>
  );
}

const nodes = [
  { name: 'na-web-01', zone: 'us-mountain-1a', state: 'Running' },
  { name: 'na-web-02', zone: 'us-mountain-1b', state: 'Running' },
  { name: 'na-web-03', zone: 'us-mountain-1c', state: 'Draining' },
];

function DensityPanel({ density }: { density: 'comfortable' | 'compact' }) {
  const pane = useRef<HTMLDivElement>(null);
  const readout = useLiveValue(
    () =>
      pane.current
        ? `space-scaled-m ${readToken(pane.current, 'spaceScaledM')} · control ${readToken(pane.current, 'sizeControlHeight')}`
        : '',
    ''
  );
  return (
    <StyleScope density={density}>
      <div ref={pane} className={styles['density-pane']}>
        <p className={styles['density-label']}>{density}</p>
        <Table
          variant="embedded"
          items={nodes}
          trackBy="name"
          columnDefinitions={[
            { id: 'name', header: 'Node', cell: item => item.name, contentType: 'identifier', isRowHeader: true },
            { id: 'zone', header: 'Zone', cell: item => item.zone },
            {
              id: 'state',
              header: 'State',
              cell: item => (
                <StatusIndicator state={item.state === 'Running' ? 'complete' : 'underway'}>
                  {item.state}
                </StatusIndicator>
              ),
            },
          ]}
          ariaLabels={{ tableLabel: `Nodes, ${density}` }}
        />
        <SpaceBetween direction="horizontal" size="xs">
          <Button>Drain</Button>
          <Button variant="primary">Add node</Button>
        </SpaceBetween>
        <p className={styles.readout}>{readout}</p>
      </div>
    </StyleScope>
  );
}

const measures = [
  ['sizeMeasureNarrow', 'A card summary, a caption or a quote.'],
  ['sizeMeasureDefault', 'Running text: descriptions, help and guides like this one.'],
  ['sizeMeasureWide', 'Long-form text with room to breathe, such as a page lead.'],
] as const;

const sampleText =
  'The north annex runs seven services across three zones. Deploys roll out one zone at a time and stop on the first failed check, so a bad image never reaches every node.';

function Page() {
  const [owner, setOwner] = useState('Dana Ruiz');
  return (
    <>
      <Prose>
        <p>
          Space does most of the grouping in Ordinate (P3, P6). Gaps come from one scale, labels hang in one margin
          column, and running text keeps to a readable measure. Every length on this sheet is drawn with its token and
          measured from the page.
        </p>
      </Prose>

      <DocSection id="scale" number={1} title="Spacing scale">
        <Prose>
          <p>
            Static spacing, <code>space-*</code>, stays the same in every density. Use it for gaps that carry meaning,
            such as the space between an icon and its label, and for the gaps between sections. SpaceBetween,
            ColumnLayout and the components take their gaps from this scale.
          </p>
        </Prose>
        <Figure
          code="Scale 4:1"
          caption="Each line is drawn at four times the token's length, as a detail is drawn at a larger scale."
        >
          <ul className={styles.schedule}>
            {spaceScale.map(([token, use]) => (
              <li key={token} className={styles.row}>
                <span className={styles.name}>{cssVariableOf(token).replace('--ord-', '')}</span>
                <Dimension token={token} scale={4} />
                <span className={styles.uses}>{use}</span>
              </li>
            ))}
          </ul>
        </Figure>
      </DocSection>

      <DocSection id="margin" number={2} title="The margin column">
        <Split
          text={
            <>
              <p>
                Labels hang in a margin column against a faint construction line, with the content to the right (M4).
                The column grows to <code>size-margin-column</code>, 192 px, and no wider.
              </p>
              <p>
                Container, KeyValuePairs and FormField all use the same column, so a details page and the form that
                edits it line up label for label. Below 560 px of width, measured with a container query, a form field
                stacks its label above the control.
              </p>
            </>
          }
        >
          <Figure code="M4" caption="A details section and its edit form share one margin.">
            <div className={styles['margin-figure']}>
              <KeyValuePairs
                items={[
                  { label: 'Owner', value: owner },
                  { label: 'Region', value: 'us-mountain-1' },
                ]}
              />
              <FormField label="Owner" description="Paged when an alarm opens.">
                <Input value={owner} onChange={event => setOwner(event.detail.value)} />
              </FormField>
            </div>
          </Figure>
        </Split>
        <Figure layout="padded" caption="Container puts its heading in the same margin, at its full width.">
          <div className={styles.ruler}>
            <Dimension token="sizeMarginColumn" label="size-margin-column" />
          </div>
          <Container kind="resource" reference="R1" heading="north-annex-web" measure="8 nodes" description="Web tier.">
            <KeyValuePairs
              columns={2}
              items={[
                { label: 'Image', value: 'web:v2' },
                { label: 'Owner', value: owner },
              ]}
            />
          </Container>
        </Figure>
      </DocSection>

      <DocSection id="measure" number={3} title="Measure">
        <Prose>
          <p>
            Running text keeps to a measure, counted in characters so it holds at any font size. Descriptions and help
            stay within the default; a summary on a card takes the narrow one.
          </p>
        </Prose>
        <Figure>
          <div className={styles.measures}>
            {measures.map(([token, use]) => (
              <div key={token} className={styles['measure-block']}>
                <span className={styles['measure-ruler']}>
                  <Dimension token={token} label={cssVariableOf(token).replace('--ord-', '')} />
                </span>
                <p
                  className={styles['measure-text']}
                  style={{ '--length': `var(${cssVariableOf(token)})` } as React.CSSProperties}
                >
                  <strong>{use}</strong> {sampleText}
                </p>
              </div>
            ))}
          </div>
        </Figure>
      </DocSection>

      <DocSection id="density" number={4} title="Density">
        <Prose>
          <p>
            Compact density tightens padding and control heights so more rows fit on a screen. It changes only the
            scaled tokens: <code>space-scaled-*</code>, <code>space-container</code> and the control heights. Static
            gaps keep their size, so the drawing keeps its proportions.
          </p>
        </Prose>
        <Figure code="Density" caption="The same table and buttons, comfortable and compact.">
          <div className={styles.density}>
            <DensityPanel density="comfortable" />
            <DensityPanel density="compact" />
          </div>
        </Figure>
        <Figure caption="The scaled tokens, comfortable over compact.">
          <ul className={styles.schedule}>
            {scaled.map(([token, use]) => (
              <li key={token} className={styles.row}>
                <span className={styles.name}>{cssVariableOf(token).replace('--ord-', '')}</span>
                <DensityPair token={token} />
                <span className={styles.uses}>{use}</span>
              </li>
            ))}
          </ul>
        </Figure>
        <CodeBlock
          label="Compact density for the whole page"
          code={`
import { applyDensity, Density } from '@ordinate/global-styles';

applyDensity(Density.Compact);
`}
        />
        <Notes
          items={[
            <>
              Pad inside containers, rows and controls with <code>space-scaled-*</code>, and leave meaningful gaps on{' '}
              <code>space-*</code>.
            </>,
            <>
              To scope a density to part of a page, wrap it in <a href={href('/components/style-scope')}>StyleScope</a>{' '}
              with <code>density=&quot;compact&quot;</code>.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="marks" number={5} title="Sizes of the marks">
        <Prose>
          <p>The marks have sizes of their own, kept as tokens so a revision can change them together.</p>
        </Prose>
        <Figure>
          <ul className={styles.sizes}>
            <li className={styles.size}>
              <span className={styles['size-stage']}>
                <span className={styles['offset-control']} />
              </span>
              <span className={styles['size-name']}>size-offset-control</span>
              <span className={styles['size-use']}>How far a pressable button stands off its offset.</span>
            </li>
            <li className={styles.size}>
              <span className={styles['size-stage']}>
                <span className={styles['offset-plate']} />
              </span>
              <span className={styles['size-name']}>size-offset-plate</span>
              <span className={styles['size-use']}>How far a plate is lifted, and how far it rises.</span>
            </li>
            <li className={styles.size}>
              <span className={styles['size-stage']}>
                <span className={styles.crop}>
                  <span className={`${styles['crop-corner']} ${styles['crop-ss']}`} />
                  <span className={`${styles['crop-corner']} ${styles['crop-se']}`} />
                  <span className={`${styles['crop-corner']} ${styles['crop-es']}`} />
                  <span className={`${styles['crop-corner']} ${styles['crop-ee']}`} />
                </span>
              </span>
              <span className={styles['size-name']}>size-crop-mark</span>
              <span className={styles['size-use']}>The arms of crop marks; they reach to 18 px under the pointer.</span>
            </li>
            <li className={styles.size}>
              <span className={styles['size-stage']}>
                <span className={styles['hash-sample']}>
                  <span className={`${styles.hash} ${styles['hash-start']}`} />
                  <span className={`${styles.hash} ${styles['hash-end']}`} />
                </span>
              </span>
              <span className={styles['size-name']}>size-hash-mark</span>
              <span className={styles['size-use']}>The 45° tick where a line ends or meets another.</span>
            </li>
            <li className={styles.size}>
              <span className={styles['size-stage']}>
                <span className={styles.key} />
              </span>
              <span className={styles['size-name']}>size-key-square</span>
              <span className={styles['size-use']}>The key square of a badge or a stamp.</span>
            </li>
            <li className={styles.size}>
              <span className={styles['size-stage']}>
                <span className={styles['control-sample']} />
              </span>
              <span className={styles['size-name']}>size-control-height</span>
              <span className={styles['size-use']}>A field or a button, with the ink baseline under a field.</span>
            </li>
          </ul>
        </Figure>
      </DocSection>
    </>
  );
}

const doc: GuideDoc = {
  slug: 'space-and-layout',
  title: 'Space and layout',
  summary: 'The spacing scale, the 192 px margin column, reading measures and compact density.',
  order: 6,
  keywords: ['spacing', 'space-scaled', 'margin column', 'density', 'compact', 'measure', 'size-margin-column'],
  Page,
};

export default doc;
