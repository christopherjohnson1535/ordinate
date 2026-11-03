// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ActionCard from '@ordinate/components/action-card';
import Button from '@ordinate/components/button';
import SpaceBetween from '@ordinate/components/space-between';

import { href, navigate } from '../app/router';
import { Example } from '../parts/example';
import { Command, DocSection, Prose } from '../parts/prose';
import { componentDocs } from '../registry/components';
import { guidesIn, sections } from '../registry/guides';
import { LoadedExample } from '../registry/types';

import styles from './cover-sheet.module.scss';

declare const __ORDINATE_VERSION__: string;

const specimen: LoadedExample = {
  meta: {
    id: 'specimen',
    title: 'One sheet, every switch',
    description:
      'A live detail drawn with Container, KeyValuePairs, StatusIndicator, Badge, SegmentedControl, ProgressBar and Button. Switch the mode, the revision or the direction above it and every part follows.',
  },
  load: () => import('../content/cover/specimen'),
  loadSource: () => import('../content/cover/specimen.tsx?raw').then(module => module.default),
};

const principles = [
  ['P1', 'Familiar first', 'Controls keep their recognizable shape. The drawing goes around them.'],
  ['P2', 'Paper and ink', 'White sheets. Words, values and anything actionable are in ink.'],
  ['P3', 'Lines before boxes', 'Group with construction lines and space. Only lifted things get a box.'],
  ['P4', 'One mark, one meaning', 'A crop mark always means one of a set; a leader always goes somewhere.'],
  ['P5', 'Color means something', 'Kind colors say what a section holds; status colors say how it is.'],
  ['P6', 'Soft and spacious', 'Hairlines and generous gaps. Weight only for what is chosen or current.'],
];

export default function CoverSheet() {
  const start = guidesIn('start');
  const counts: Record<string, number> = Object.fromEntries(
    sections.map(section => [section.id, guidesIn(section.id).length])
  );

  return (
    <div className={styles.cover}>
      <header className={styles.title}>
        <p className={styles.kicker}>Sheet 000 · Cover sheet · Version {__ORDINATE_VERSION__}</p>
        <h1 className={styles.name}>Ordinate</h1>
        <p className={styles.lede}>
          A React component library drawn like a set of engineering drawings: white sheets, ink rules, construction
          lines and measurements. Import a component and it already looks and behaves like every other one.
        </p>
        <SpaceBetween direction="horizontal" size="s">
          <Button
            variant="primary"
            href={href('/start/installation')}
            onClick={event => {
              event.preventDefault();
              navigate(href('/start/installation'));
            }}
          >
            Get started
          </Button>
          <Button
            href={href('/components')}
            onClick={event => {
              event.preventDefault();
              navigate(href('/components'));
            }}
          >
            Browse {componentDocs.length} components
          </Button>
        </SpaceBetween>
        <div className={styles.install}>
          <Command>npm install @ordinate/components @ordinate/global-styles</Command>
        </div>
      </header>

      <div className={styles.specimen}>
        <Example example={specimen} index={0} headingLevel={3} />
      </div>

      <DocSection id="sheet-index" number={1} title="Sheet index">
        <ul className={styles.index}>
          {start.length > 0 && (
            <li>
              <ActionCard
                href={href(start[0].path)}
                header="Get started"
                description={`Install, pin a revision, and build a first page. ${counts.start} sheets.`}
                kind="configuration"
              />
            </li>
          )}
          <li>
            <ActionCard
              href={href(guidesIn('foundations')[0]?.path ?? '/')}
              header="Foundations"
              description={`Principles, marks, color, type, space and motion. ${counts.foundations} sheets.`}
              kind="policy"
            />
          </li>
          <li>
            <ActionCard
              href={href('/components')}
              header="Components"
              description={`Every component with live examples, guidelines and its API. ${componentDocs.length} sheets.`}
              kind="resource"
            />
          </li>
          {counts.packages > 0 && (
            <li>
              <ActionCard
                href={href(guidesIn('packages')[0].path)}
                header="Packages"
                description={`Charts, collection hooks, design tokens and global styles. ${counts.packages} sheets.`}
                kind="neutral"
              />
            </li>
          )}
          {counts.patterns > 0 && (
            <li>
              <ActionCard
                href={href(guidesIn('patterns')[0].path)}
                header="Patterns"
                description={`Whole pages built from the library: consoles, wizards and websites. ${counts.patterns} sheets.`}
                kind="neutral"
              />
            </li>
          )}
        </ul>
      </DocSection>

      <DocSection
        id="principles"
        number={2}
        title="Principles"
        description="When two of them disagree, the earlier one wins."
      >
        <dl className={styles.principles}>
          {principles.map(([code, name, text]) => (
            <div key={code} className={styles.principle}>
              <dt>
                <span className={styles.code}>{code}</span> {name}
              </dt>
              <dd>{text}</dd>
            </div>
          ))}
        </dl>
      </DocSection>

      <DocSection id="offline" number={3} title="These docs run on your machine">
        <Prose>
          <p>
            Like <code>rustup doc</code>, the documentation ships as a package of its own, at the same version as the
            library. It needs no network: the fonts, examples and API are all inside it.
          </p>
        </Prose>
        <Command>npx @ordinate/docs --open</Command>
        <Prose>
          <p>
            See <a href={href('/start/running-locally')}>Running the docs locally</a> for the options and for building
            them from a checkout.
          </p>
        </Prose>
      </DocSection>
    </div>
  );
}
