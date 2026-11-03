// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import Badge from '@ordinate/components/badge';
import Box from '@ordinate/components/box';
import Container from '@ordinate/components/container';
import KeyValuePairs from '@ordinate/components/key-value-pairs';
import StatusIndicator from '@ordinate/components/status-indicator';
import StyleScope, { StyleScopeProps } from '@ordinate/components/style-scope';
import Table from '@ordinate/components/table';

import { href } from '../../app/router';
import { DocSection, Notes, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';
import { cssVariableOf, Figure, Split, useLiveValue } from './shared/figure';

import styles from './typography.module.scss';

interface Step {
  size: string;
  weight?: string;
  family?: 'base' | 'mono';
  use: string;
  sample: string;
}

// Largest first. Every sample is set with the tokens themselves, so the sizes are the live ones.
const scale: Step[] = [
  { size: 'fontSizeDisplayXl', weight: 'fontWeightLight', use: 'Cover numbers', sample: '99.98% available' },
  { size: 'fontSizeDisplayL', weight: 'fontWeightLight', use: 'Page titles, value-large', sample: 'North annex' },
  { size: 'fontSizeHeadingXl', weight: 'fontWeightHeading', use: 'Heading XL', sample: 'Services in us-mountain-1' },
  { size: 'fontSizeHeadingL', weight: 'fontWeightHeading', use: 'Sections of a page', sample: 'Deployments' },
  { size: 'fontSizeHeadingM', weight: 'fontWeightHeading', use: 'Container headings', sample: 'vault-store' },
  { size: 'fontSizeHeadingS', weight: 'fontWeightHeading', use: 'Small headings, modals', sample: 'Rename project' },
  { size: 'fontSizeBody', use: 'Body, labels, controls', sample: 'Restart after the 02:00 backup finishes.' },
  { size: 'fontSizeDescription', use: 'Descriptions, help text', sample: 'Lowercase letters, numbers and hyphens.' },
  { size: 'fontSizeSmall', use: 'Small text, badges', sample: 'Updated 4 minutes ago' },
  { size: 'fontSizeCode', family: 'mono', use: 'Code and data', sample: 'web:v2 → web:v3, 8 replicas' },
  { size: 'fontSizeCaption', family: 'mono', use: 'Captions, references', sample: 'SHEET C-014 · REV 2026.2' },
];

function ScaleRow({ step }: { step: Step }) {
  const sample = useRef<HTMLParagraphElement>(null);
  const measured = useLiveValue(() => {
    if (!sample.current) {
      return '';
    }
    const style = getComputedStyle(sample.current);
    return `${parseFloat(style.fontSize)} px, weight ${style.fontWeight}`;
  }, '');
  const isCaption = step.size === 'fontSizeCaption';
  const css: React.CSSProperties = {
    fontSize: `var(${cssVariableOf(step.size)})`,
    fontWeight: step.weight ? `var(${cssVariableOf(step.weight)})` : undefined,
    fontFamily: step.family === 'mono' ? 'var(--ord-font-family-mono)' : undefined,
    letterSpacing: isCaption ? 'var(--ord-letter-spacing-caption)' : undefined,
    lineHeight: step.weight === 'fontWeightLight' ? 'var(--ord-line-height-heading)' : undefined,
  };
  return (
    <li className={styles.row}>
      <p ref={sample} className={styles.sample} style={css}>
        {step.sample}
      </p>
      <div className={styles.spec}>
        <span className={styles['spec-token']}>{cssVariableOf(step.size)}</span>
        <span>{measured}</span>
        <span className={styles['spec-use']}>{step.use}</span>
      </div>
    </li>
  );
}

const websiteStyles: { id: StyleScopeProps.StyleName; title: string; headline: string; lead: string }[] = [
  {
    id: 'editorial',
    title: 'Editorial',
    headline: 'The annex at dawn',
    lead: 'Serif headlines and reading text, for journals and newsletters.',
  },
  {
    id: 'studio',
    title: 'Studio',
    headline: 'Harbour & Pine',
    lead: 'Light, very large headlines, for portfolios and practices.',
  },
  {
    id: 'shopfront',
    title: 'Shopfront',
    headline: 'Fixit Bikes',
    lead: 'Condensed, heavy headlines, for shops and local services.',
  },
];

function StyleCard({ style }: { style: (typeof websiteStyles)[number] }) {
  const headline = useRef<HTMLHeadingElement>(null);
  const spec = useLiveValue(() => {
    if (!headline.current) {
      return '';
    }
    const computed = getComputedStyle(headline.current);
    const family = computed.fontFamily.split(',')[0].replace(/['"]/g, '');
    return `${family}, ${parseFloat(computed.fontSize)} px, weight ${computed.fontWeight}`;
  }, '');
  return (
    <StyleScope styleName={style.id}>
      <div className={styles['style-card']}>
        <p className={styles['style-label']}>{style.title}</p>
        <h3 ref={headline} className={styles.headline}>
          {style.headline}
        </h3>
        <p className={styles.lead}>{style.lead}</p>
        <p className={styles.reading}>
          The reading face and size change with the style, so an article reads like the publication it belongs to.
        </p>
        <p className={styles['style-spec']}>{spec}</p>
      </div>
    </StyleScope>
  );
}

const services = [
  { name: 'north-annex-web', image: 'web:v2', nodes: 8, p95: '41 ms' },
  { name: 'atrium-api', image: 'api:v7', nodes: 6, p95: '118 ms' },
  { name: 'vault-store', image: 'store:v12', nodes: 2, p95: '1,204 ms' },
];

function Page() {
  return (
    <>
      <Prose>
        <p>
          Ordinate sets words in IBM Plex Sans and data in IBM Plex Mono. Sans is for anything read as language:
          headings, labels, values, help. Mono is for anything read as a code or a measure: references, identifiers,
          figures, and the small capitals that caption a drawing.
        </p>
      </Prose>

      <DocSection id="faces" number={1} title="Two faces">
        <div className={styles.faces}>
          <div className={styles.face}>
            <p className={styles['face-label']}>font-family-base · words</p>
            <p className={`${styles['face-sample']} ${styles.sans}`}>IBM Plex Sans</p>
            <p className={`${styles['face-alphabet']} ${styles.sans}`}>
              ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
            </p>
            <ul className={`${styles['face-weights']} ${styles.sans}`}>
              <li style={{ fontWeight: 'var(--ord-font-weight-light)' }}>Light 300</li>
              <li style={{ fontWeight: 'var(--ord-font-weight-body)' }}>Regular 400</li>
              <li style={{ fontWeight: 'var(--ord-font-weight-label)' }}>Medium 500</li>
              <li style={{ fontWeight: 'var(--ord-font-weight-heading)' }}>Semibold 600</li>
            </ul>
            <p className={styles['face-note']}>
              Light for page titles and large figures, regular for body, medium for labels, semibold for headings and
              for what is chosen.
            </p>
          </div>
          <div className={styles.face}>
            <p className={styles['face-label']}>font-family-mono · codes and measures</p>
            <p className={`${styles['face-sample']} ${styles.mono}`}>Plex Mono</p>
            <p className={`${styles['face-alphabet']} ${styles.mono}`}>
              ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
            </p>
            <ul className={`${styles['face-weights']} ${styles.mono}`}>
              <li style={{ fontWeight: 'var(--ord-font-weight-body)' }}>Regular 400</li>
              <li style={{ fontWeight: 'var(--ord-font-weight-label)' }}>Medium 500</li>
            </ul>
            <p className={styles['face-note']}>
              Every figure takes the same width, so columns of numbers line up and a changing count does not jitter.
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection
        id="scale"
        number={2}
        title="Type scale"
        description="Each line is set with its token, and the measured size is read from the page."
      >
        <ul className={styles.scale}>
          {scale.map(step => (
            <ScaleRow key={step.size} step={step} />
          ))}
        </ul>
        <Notes
          items={[
            <>
              Body text is 14 px at a line height of 1.5; headings use 1.3. Running text stays within{' '}
              <code>size-measure-default</code>, 64 characters.
            </>,
            <>
              Reach for the scale through components first: <a href={href('/components/header')}>Header</a> for headings
              and <a href={href('/components/box')}>Box</a> for the rest. Use the tokens directly only in custom
              components.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="mono-at-work" number={3} title="Mono at work">
        <Split
          text={
            <>
              <p>
                In a schedule, identifiers and figures are set in mono so they read as data and line up. Set a
                column&apos;s <code>contentType</code> to <code>identifier</code> or <code>number</code>; numbers also
                align to the end of the column.
              </p>
              <p>References such as R2, and the measure on a dimension line, are mono too.</p>
            </>
          }
        >
          <Figure code="R2" caption="Names and figures in mono, states and headings in sans.">
            <Table
              variant="embedded"
              items={services}
              trackBy="name"
              columnDefinitions={[
                {
                  id: 'name',
                  header: 'Service',
                  cell: item => item.name,
                  contentType: 'identifier',
                  isRowHeader: true,
                },
                { id: 'image', header: 'Image', cell: item => item.image, contentType: 'identifier' },
                { id: 'nodes', header: 'Nodes', cell: item => item.nodes, contentType: 'number' },
                { id: 'p95', header: 'p95 latency', cell: item => item.p95, contentType: 'number' },
              ]}
              ariaLabels={{ tableLabel: 'Services' }}
            />
          </Figure>
        </Split>
      </DocSection>

      <DocSection id="captions" number={4} title="Captions">
        <Prose>
          <p>
            Captions are mono capitals at <code>font-size-caption</code>, 11 px, tracked out by{' '}
            <code>letter-spacing-caption</code>. They label rather than say: the column heads of a schedule, the cells
            of a title block, sheet numbers, the kind of an alert, a badge. Keep them to a word or two, and never set a
            sentence in them.
          </p>
        </Prose>
        <Figure caption="A title block, a Badge, a StatusIndicator and a Container, each with its caption.">
          <div className={styles.stack}>
            <div className={styles.captions}>
              <div className={styles.cell}>
                <span className={styles['cell-label']}>Project</span>
                <span className={styles['cell-value']}>North annex</span>
              </div>
              <div className={styles.cell}>
                <span className={styles['cell-label']}>Sheet</span>
                <span className={styles['cell-mono']}>C-014</span>
              </div>
              <div className={styles.cell}>
                <span className={styles['cell-label']}>Drawn by</span>
                <span className={styles['cell-value']}>Dana Ruiz</span>
              </div>
              <div className={styles.cell}>
                <span className={styles['cell-label']}>Revision</span>
                <span className={styles['cell-mono']}>2026.2</span>
              </div>
            </div>
            <Container kind="resource" reference="R3" heading="vault-store" measure="2 nodes">
              <KeyValuePairs
                columns={2}
                items={[
                  { label: 'State', value: <StatusIndicator state="fault">Failed</StatusIndicator> },
                  { label: 'Tier', value: <Badge tone="note">Standard</Badge> },
                ]}
              />
            </Container>
          </div>
        </Figure>
      </DocSection>

      <DocSection id="website-styles" number={5} title="Website styles">
        <Prose>
          <p>
            The console keeps one voice. Websites can take another with a style, which changes the headline and reading
            faces through tokens such as <code>font-family-headline</code>, <code>font-size-headline-*</code> and{' '}
            <code>font-family-reading</code>. Each card below is a <code>StyleScope</code> with that style; the faces
            and sizes come from the tokens it sets.
          </p>
        </Prose>
        <div className={styles.styles}>
          {websiteStyles.map(style => (
            <StyleCard key={style.id} style={style} />
          ))}
        </div>
        <Box color="text-body-secondary" fontSize="body-s">
          The serif is IBM Plex Serif and the condensed face IBM Plex Sans Condensed. Both load with{' '}
          <code>@ordinate/global-styles</code>.
        </Box>
      </DocSection>
    </>
  );
}

const doc: GuideDoc = {
  slug: 'typography',
  title: 'Typography',
  summary: 'IBM Plex Sans for words and IBM Plex Mono for codes and measures, the type scale, and captions.',
  order: 5,
  keywords: ['font', 'IBM Plex', 'type scale', 'mono', 'caption', 'headline', 'serif', 'font-size'],
  Page,
};

export default doc;
