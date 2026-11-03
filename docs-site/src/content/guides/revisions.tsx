// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Table from '@ordinate/components/table';

import { Example } from '../../parts/example';
import { CodeBlock, DocSection, Notes, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';
import { LoadedExample } from '../../registry/types';

const sideBySide: LoadedExample = {
  meta: {
    id: 'side-by-side',
    title: 'Two revisions on one page',
    description:
      'The same form under 2026.1 and 2026.2, each pinned with applyRevision on its own element. Because the two elements pin themselves, the Revision switch above the example does not change them; Mode and Right to left still do.',
  },
  load: () => import('./revisions/side-by-side'),
  loadSource: () => import('./revisions/side-by-side.tsx?raw').then(module => module.default),
};

const revisions = [
  {
    id: '2026.1',
    constant: 'Revision.V2026_1',
    changes: 'The first revision: square corners on every control, container and plate. The default.',
  },
  {
    id: '2026.2',
    constant: 'Revision.V2026_2',
    changes:
      'Soft corners: 6 px on buttons and fields, 10 px on containers, 4 px on badges, 3 px on checkboxes and inline code.',
  },
];

function Page() {
  return (
    <>
      <Prose>
        <p>
          The look of Ordinate is versioned apart from its code. A revision is a complete set of design token values:
          colors, type, spacing, corner radii, motion. Your application pins one, and every component follows it. A new
          version of the package can add a revision, but it never changes how your application looks until you move to
          that revision yourself.
        </p>
      </Prose>

      <DocSection id="published" number={1} title="Published revisions">
        <Table
          variant="embedded"
          wrapLines={true}
          trackBy="id"
          items={revisions}
          ariaLabels={{ tableLabel: 'Published revisions' }}
          columnDefinitions={[
            {
              id: 'id',
              header: 'Revision',
              cell: item => item.id,
              isRowHeader: true,
              contentType: 'identifier',
              width: 120,
            },
            { id: 'constant', header: 'Constant', cell: item => <code>{item.constant}</code>, width: 200 },
            { id: 'changes', header: 'What it sets', cell: item => item.changes },
          ]}
        />
        <Prose>
          <p>
            Revisions are named by the calendar: the year, then a number that counts up through the year. The{' '}
            <code>Revision</code> enum in <code>@ordinate/global-styles</code> lists every revision the installed
            version supports.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="pin" number={2} title="Pin a revision">
        <Prose>
          <p>
            Call <code>applyRevision</code> once, before the first render, in the entry file of the application. With no
            element it pins the whole page, <code>document.body</code>.
          </p>
        </Prose>
        <CodeBlock
          label="main.tsx"
          code={`
import { applyRevision, Revision } from '@ordinate/global-styles';
import '@ordinate/global-styles/index.css';

applyRevision(Revision.V2026_1);
`}
        />
        <Notes
          items={[
            <>
              Without a call, components use the default, which is the oldest revision the installed version supports.
              Pin one anyway, so the look is written down in your code rather than left to the package.
            </>,
            <>
              <code>applyRevision(null)</code> removes the pin and returns to the default.
            </>,
            <>
              A name the installed version does not know, such as a revision from a newer package, is ignored with a
              warning in the console, and the element keeps the revision it had.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="one-section" number={3} title="Try a new revision on one section">
        <Prose>
          <p>
            <code>applyRevision</code> takes an element as its second argument. Everything inside that element follows
            the revision you give it, and the rest of the page keeps its own. Use it to try a new revision on one page
            or one panel, show it to a few people, and move the whole application when you are ready.
          </p>
        </Prose>
        <CodeBlock
          label="billing-page.tsx"
          code={`
import React, { useEffect, useRef } from 'react';

import { applyRevision, Revision } from '@ordinate/global-styles';

export function BillingPage({ children }: { children: React.ReactNode }) {
  const region = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (region.current) {
      applyRevision(Revision.V2026_2, region.current);
    }
  }, []);

  return <div ref={region}>{children}</div>;
}
`}
        />
        <Prose>
          <p>
            Each revision is a full block of tokens scoped to a class on the element, so revisions nest: a section
            pinned to 2026.2 inside a page pinned to 2026.1 is drawn wholly in 2026.2, and a section inside that can go
            back to 2026.1. In markup, or on a page rendered on the server,{' '}
            <a href="#/components/style-scope">StyleScope</a> does the same with its <code>revision</code> prop.
          </p>
        </Prose>
        <CodeBlock
          label="billing-page.tsx"
          code={`
import StyleScope from '@ordinate/components/style-scope';

<StyleScope revision="2026.2">{children}</StyleScope>;
`}
        />
        <Example example={sideBySide} index={1} />
      </DocSection>

      <DocSection id="rules" number={4} title="The rules">
        <Notes
          items={[
            <>
              A published revision never changes. A mistake in one is fixed by publishing the next revision, so an
              application pinned to 2026.1 looks the same on every version of the package that supports 2026.1.
            </>,
            <>
              A revision is data only. It can change any token value, such as every corner radius, but never markup,
              props or behavior. Those change only in a new major version of the package.
            </>,
            <>
              Every revision fills every token, so any revision can be applied to any element. The library&apos;s token
              contract test checks this for each revision.
            </>,
            <>
              The default is the oldest supported revision. It also applies to <code>:root</code>, so components outside
              any pinned element are drawn in it.
            </>,
            <>
              A <a href="#/start/brand-theme">brand theme</a> sits on top of the revision. It wins for the tokens it
              sets, such as a button radius, and every other token keeps the revision&apos;s value. A{' '}
              <a href="#/start/styles">style</a> sits on top in the same way.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="moving" number={5} title="Moving to a new revision">
        <Prose>
          <ol>
            <li>Update the package. Nothing changes on screen, because the pin holds.</li>
            <li>
              Pin one page or section to the new revision with <code>applyRevision(revision, element)</code> and look it
              over in light and dark mode, in compact density and right to left.
            </li>
            <li>
              Change the call in the entry file, and remove the section pins. If you set a brand theme, check the tokens
              it sets still suit the new revision.
            </li>
          </ol>
        </Prose>
      </DocSection>
    </>
  );
}

const guide: GuideDoc = {
  slug: 'revisions',
  title: 'Revisions',
  summary: 'Pin the look of the library to a revision, and try a newer one on a single section first.',
  order: 3,
  keywords: ['applyRevision', 'Revision', 'V2026_1', 'V2026_2', '2026.1', '2026.2', 'pin', 'upgrade', 'StyleScope'],
  Page,
};

export default guide;
