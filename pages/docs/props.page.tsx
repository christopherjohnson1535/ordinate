// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Badge from '~components/badge';
import Box from '~components/box';
import ContentLayout from '~components/content-layout';
import Header from '~components/header';
import PanelLayout from '~components/panel-layout';
import SideNavigation from '~components/side-navigation';
import SpaceBetween from '~components/space-between';

import styles from './styles.module.scss';

interface Entry {
  name: string;
  description: string;
}

interface Definition {
  name: string;
  folder: string;
  properties: Array<Entry & { type: string; optional: boolean; defaultValue?: string; values?: string[] }>;
  regions: Array<Entry & { isDefault: boolean }>;
  events: Array<Entry & { detailType: string; cancelable: boolean }>;
  functions: Array<Entry & { parameters: Array<{ name: string; type: string }>; returnType: string }>;
}

// Written by `npm run build`; see docs/API_DOCS.md.
const modules = import.meta.glob<Definition>('../../lib/components-definitions/*.json', {
  eager: true,
  import: 'default',
});

const definitions = Object.values(modules).sort((a, b) => a.name.localeCompare(b.name));

// Doc comments wrap at the source's line length; keep only the breaks before list items and paragraphs.
const unwrap = (text: string) => text.replace(/(?<!\n)\n(?!\n|\s*[-*] )/g, ' ');

/**
 * Renders a doc comment, setting `code` spans in the mono face.
 */
function Description({ text }: { text: string }) {
  return (
    <span className={styles.description}>
      {unwrap(text)
        .split('`')
        .map((part, index) => (index % 2 === 1 ? <code key={index}>{part}</code> : part))}
    </span>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  if (count === 0) {
    return null;
  }
  return (
    <section className={styles.section}>
      <Header variant="h3" counter={`(${count})`}>
        {title}
      </Header>
      <table className={styles.table}>{children}</table>
    </section>
  );
}

function Properties({ definition }: { definition: Definition }) {
  return (
    <Section title="Properties" count={definition.properties.length}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Default</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {definition.properties.map(property => (
          <tr key={property.name}>
            <td>
              <code className={styles.name}>{property.name}</code>
              {!property.optional && (
                <span className={styles.required}>
                  <Badge color="grey">required</Badge>
                </span>
              )}
            </td>
            <td>
              <code>{property.type}</code>
              {property.values && (
                <div className={styles.values}>{property.values.map(value => `'${value}'`).join(' | ')}</div>
              )}
            </td>
            <td>
              {property.defaultValue ? <code>{property.defaultValue}</code> : <span className={styles.none}>-</span>}
            </td>
            <td>
              <Description text={property.description} />
            </td>
          </tr>
        ))}
      </tbody>
    </Section>
  );
}

function Regions({ definition }: { definition: Definition }) {
  return (
    <Section title="Regions" count={definition.regions.length}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {definition.regions.map(region => (
          <tr key={region.name}>
            <td>
              <code className={styles.name}>{region.name}</code>
              {region.isDefault && (
                <span className={styles.required}>
                  <Badge color="blue">default</Badge>
                </span>
              )}
            </td>
            <td>
              <Description text={region.description} />
            </td>
          </tr>
        ))}
      </tbody>
    </Section>
  );
}

function Events({ definition }: { definition: Definition }) {
  return (
    <Section title="Events" count={definition.events.length}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Detail</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {definition.events.map(event => (
          <tr key={event.name}>
            <td>
              <code className={styles.name}>{event.name}</code>
              {event.cancelable && (
                <span className={styles.required}>
                  <Badge color="grey">cancelable</Badge>
                </span>
              )}
            </td>
            <td>
              <code>{event.detailType}</code>
            </td>
            <td>
              <Description text={event.description} />
            </td>
          </tr>
        ))}
      </tbody>
    </Section>
  );
}

function Functions({ definition }: { definition: Definition }) {
  return (
    <Section title="Ref functions" count={definition.functions.length}>
      <thead>
        <tr>
          <th>Signature</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {definition.functions.map(fn => (
          <tr key={fn.name}>
            <td>
              <code className={styles.name}>
                {fn.name}({fn.parameters.map(parameter => `${parameter.name}: ${parameter.type}`).join(', ')}):{' '}
                {fn.returnType}
              </code>
            </td>
            <td>
              <Description text={fn.description} />
            </td>
          </tr>
        ))}
      </tbody>
    </Section>
  );
}

function ComponentApi({ definition }: { definition: Definition }) {
  return (
    <div className={styles.main}>
      <SpaceBetween size="l">
        <Header variant="h2" description={<code>@ordinate-ui/components/{definition.folder}</code>}>
          {definition.name}
        </Header>
        <Properties definition={definition} />
        <Regions definition={definition} />
        <Events definition={definition} />
        <Functions definition={definition} />
      </SpaceBetween>
    </div>
  );
}

export default function PropsPage() {
  const [selected, setSelected] = useState(definitions[0]?.folder);
  const definition = definitions.find(item => item.folder === selected);

  return (
    <div className={styles.page}>
      <ContentLayout
        header={
          <Header variant="h1" counter={`(${definitions.length})`} description="Generated from each interfaces.ts.">
            Component API
          </Header>
        }
      >
        {definition ? (
          <div className={styles.frame}>
            <PanelLayout
              resizable={true}
              defaultPanelSize={240}
              minPanelSize={180}
              maxPanelSize={400}
              panelFocusable={{ ariaLabel: 'Components' }}
              mainFocusable={{ ariaLabel: `${definition.name} API` }}
              panelContent={
                <SideNavigation
                  ariaLabel="Components"
                  activeHref={`#${definition.folder}`}
                  onFollow={event => {
                    event.preventDefault();
                    setSelected(event.detail.href.slice(1));
                  }}
                  items={definitions.map(item => ({ type: 'link', text: item.name, href: `#${item.folder}` }))}
                />
              }
              mainContent={<ComponentApi definition={definition} />}
            />
          </div>
        ) : (
          <Box variant="p">No definitions yet. Run `npm run build` to generate them.</Box>
        )}
      </ContentLayout>
    </div>
  );
}
