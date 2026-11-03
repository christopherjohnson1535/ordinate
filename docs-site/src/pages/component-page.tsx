// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo } from 'react';

import Box from '@ordinate/components/box';
import Link from '@ordinate/components/link';
import Skeleton from '@ordinate/components/skeleton';

import { href } from '../app/router';
import { ApiReference, useDefinition } from '../parts/api';
import { Example } from '../parts/example';
import { PageFrame } from '../parts/page-frame';
import { CodeBlock, DocSection, Notes, Prose, UseAvoid } from '../parts/prose';
import { RelatedCards } from '../parts/related';
import {
  examplesOf,
  findComponentDoc,
  groups,
  importPathOf,
  loadDefinition,
  sheetOfComponent,
} from '../registry/components';
import { markById } from '../registry/marks';
import { ComponentDoc } from '../registry/types';

import styles from './component-page.module.scss';

function ImportLine({ doc }: { doc: ComponentDoc }) {
  return (
    <code className={styles.import}>
      <span className={styles.keyword}>import</span> {doc.name} <span className={styles.keyword}>from</span>{' '}
      <span className={styles.string}>&apos;{importPathOf(doc)}&apos;</span>;
    </code>
  );
}

function Marks({ doc }: { doc: ComponentDoc }) {
  if (!doc.marks?.length) {
    return null;
  }
  return (
    <ul className={styles.marks} aria-label="Marks it draws">
      {doc.marks.map(id => (
        <li key={id}>
          <Link href={href('/foundations/marks', id.toLowerCase())} variant="secondary">
            <span className={styles['mark-id']}>{id}</span> {markById.get(id)?.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function testingSnippet(doc: ComponentDoc) {
  const variable = doc.name.charAt(0).toLowerCase() + doc.name.slice(1);
  // Importing the chart utilities adds the chart finders to the components' createWrapper().
  const chartImport = doc.package === 'charts' ? `\nimport '@ordinate/charts/test-utils/dom';` : '';
  return `import { render } from '@testing-library/react';
import createWrapper from '@ordinate/components/test-utils/dom';${chartImport}

const { container } = render(<Page />);
const ${variable} = createWrapper(container).find${doc.name}();`;
}

function ApiSection({ doc }: { doc: ComponentDoc }) {
  const definition = useDefinition(() => loadDefinition(doc), doc.folder);
  if (definition === undefined) {
    return <Skeleton variant="text" lines={8} loadingText="Loading the API" />;
  }
  if (definition === null) {
    return (
      <Box color="text-body-secondary">
        The API definitions are missing. Run <code>npm run build</code> at the root of the repository, then rebuild the
        docs.
      </Box>
    );
  }
  return <ApiReference definition={definition} name={doc.name} />;
}

export default function ComponentPage({ folder }: { folder: string }) {
  const doc = findComponentDoc(folder);
  const examples = useMemo(() => (doc ? examplesOf(doc) : []), [doc]);
  if (!doc) {
    return null;
  }
  const group = groups.find(entry => entry.id === doc.group);
  let section = 0;
  const next = () => ++section;

  return (
    <PageFrame
      code={sheetOfComponent(doc)}
      title={doc.name}
      description={doc.summary}
      lead={
        <>
          <ImportLine doc={doc} />
          {group && (
            <Link href={href('/components', group.id)} variant="secondary">
              {group.title}
            </Link>
          )}
          <Marks doc={doc} />
        </>
      }
    >
      {doc.description && <Prose>{doc.description}</Prose>}

      {examples.length > 0 && (
        <DocSection id="examples" number={next()} title="Examples">
          {examples.map((example, index) => (
            <Example key={example.meta.id} example={example} index={index + 1} />
          ))}
        </DocSection>
      )}

      {doc.guidelines && (
        <DocSection id="guidelines" number={next()} title="Guidelines">
          <UseAvoid use={doc.guidelines.use} avoid={doc.guidelines.avoid} />
          {doc.guidelines.writing && doc.guidelines.writing.length > 0 && (
            <div className={styles.writing}>
              <h3 className={styles['writing-title']}>Writing</h3>
              <Notes items={doc.guidelines.writing} />
            </div>
          )}
        </DocSection>
      )}

      {doc.accessibility && doc.accessibility.length > 0 && (
        <DocSection id="accessibility" number={next()} title="Accessibility">
          <Notes items={doc.accessibility} />
        </DocSection>
      )}

      <DocSection
        id="api"
        number={next()}
        title="API"
        description="Read from the component's TypeScript interface when the package is built, so it always matches the code."
      >
        <ApiSection doc={doc} />
      </DocSection>

      {doc.testing !== false && (
        <DocSection
          id="testing"
          number={next()}
          title="Testing"
          description={
            <>
              The test utilities find the component by its role in the page, so tests keep working when its markup
              changes. See <Link href={href('/start/testing')}>Testing</Link> for the methods every wrapper has.
            </>
          }
        >
          <CodeBlock code={testingSnippet(doc)} label={`${doc.folder}.test.tsx`} />
        </DocSection>
      )}

      {doc.related && doc.related.length > 0 && (
        <DocSection id="related" number={next()} title="Related">
          <RelatedCards folders={doc.related} />
        </DocSection>
      )}
    </PageFrame>
  );
}
