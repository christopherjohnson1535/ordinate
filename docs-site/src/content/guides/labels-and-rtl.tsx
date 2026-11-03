// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Example } from '../../parts/example';
import { CodeBlock, DocSection, Notes, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';
import { LoadedExample } from '../../registry/types';

const translated: LoadedExample = {
  meta: {
    id: 'translated-labels',
    title: 'Messages for another locale',
    description:
      'An I18nProvider with German messages for Alert and Pagination. Switch the locale: the caption in the alert’s margin and the page label follow, and the labels for screen readers change with them.',
  },
  load: () => import('./labels-and-rtl/translated-labels'),
  loadSource: () => import('./labels-and-rtl/translated-labels.tsx?raw').then(module => module.default),
};

function Page() {
  return (
    <>
      <Prose>
        <p>
          Most text on a page comes from your application: headings, labels, values. A few words come from the
          components themselves, such as the accessible name of a close button, the caption in an alert&apos;s margin or
          &quot;Page 3 of 12&quot; in a pagination. Ordinate ships these in English, and you can replace any of them.
        </p>
      </Prose>

      <DocSection id="built-in" number={1} title="Built-in labels">
        <Prose>
          <p>
            Every built-in label is a message with a name, kept per component. Modal&apos;s close button is{' '}
            <code>modal.closeAriaLabel</code>, &quot;Close&quot;; Pagination&apos;s arrows are{' '}
            <code>pagination.previousPageLabel</code> and <code>pagination.nextPageLabel</code>. Messages with numbers
            use ICU syntax, such as <code>{'Page {pageNumber} of {pagesCount}'}</code>, or a plural like{' '}
            <code>{'{count, plural, one {# option selected} other {# options selected}}'}</code>.
          </p>
          <p>
            A component looks a label up in this order: the prop, if you passed one; then the messages of the{' '}
            <code>I18nProvider</code> around it, for its locale; then English.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="props" number={2} title="Replace a label with a prop">
        <Prose>
          <p>
            Each label has a prop of the same name, or a key in the component&apos;s <code>i18nStrings</code> or{' '}
            <code>ariaLabels</code>. Use a prop when one instance needs different words, for example a close button that
            names what it closes.
          </p>
        </Prose>
        <CodeBlock
          label="rename-modal.tsx"
          code={`
<Modal visible={visible} onDismiss={close} header="Rename project" closeAriaLabel="Close rename project">
  …
</Modal>

<Pagination
  currentPageIndex={page}
  pagesCount={12}
  ariaLabels={{ pageLabel: pageNumber => \`Sheet \${pageNumber}\` }}
/>
`}
        />
      </DocSection>

      <DocSection id="provider" number={3} title="Replace labels with I18nProvider">
        <Prose>
          <p>
            To change labels for the whole application, wrap it in <code>I18nProvider</code> from{' '}
            <code>@ordinate/components/i18n</code> and give it your messages. They are keyed by package, then locale,
            then component folder, then message name.
          </p>
        </Prose>
        <CodeBlock
          label="app.tsx"
          code={`
import I18nProvider from '@ordinate/components/i18n';

const messages = {
  '@ordinate/components': {
    en: { modal: { closeAriaLabel: 'Close dialog' } },
    de: { modal: { closeAriaLabel: 'Dialog schließen' } },
  },
};

<I18nProvider messages={[messages]}>
  <App />
</I18nProvider>;
`}
        />
        <Notes
          items={[
            <>
              <code>locale</code> picks the language, such as <code>de</code> or <code>pt-BR</code>. Without it, the
              provider uses the <code>lang</code> attribute of the page, then English.
            </>,
            <>
              The closest locale wins: an exact match, then the same language, so <code>pt-BR</code> falls back to{' '}
              <code>pt</code>. A message missing from your set falls back to English.
            </>,
            <>
              <code>messages</code> takes several sets. When two define the same message, the later set wins, so you can
              lay your own corrections over a shared translation.
            </>,
            <>
              The charts do not read the provider. Pass their text in each chart&apos;s <code>i18nStrings</code>.
            </>,
          ]}
        />
        <Example example={translated} index={1} />
      </DocSection>

      <DocSection id="rtl" number={4} title="Right-to-left languages">
        <Prose>
          <p>
            For Arabic, Hebrew, Persian and other right-to-left languages, set <code>dir=&quot;rtl&quot;</code> on the
            page, usually on the <code>html</code> element with the <code>lang</code>.
          </p>
        </Prose>
        <CodeBlock language="html" label="index.html" code={`<html lang="ar" dir="rtl">`} />
        <Notes
          items={[
            <>
              Layouts follow. Components are laid out with logical properties only, so margins, columns, the navigation
              and the help panel all swap sides. Offsets still fall down and to the right, like a shadow.
            </>,
            <>
              Icons that point along the reading direction, such as <code>angle-left</code>, <code>arrow-right</code>{' '}
              and <code>external</code>, mirror themselves. Do not swap icon names by direction.
            </>,
            <>
              Keyboard navigation follows. In rows such as Tabs, SegmentedControl, ButtonGroup and TreeView, and in the
              charts, the Right arrow key moves toward the end of the line, which is to the left.
            </>,
            <>
              <code>dir</code> can also be set on one element, and the components inside it follow. Each example on this
              site has a Right to left switch that does exactly that.
            </>,
          ]}
        />
      </DocSection>
    </>
  );
}

const guide: GuideDoc = {
  slug: 'labels-and-rtl',
  title: 'Labels and right-to-left',
  summary: 'Replace the built-in English labels with props or I18nProvider, and lay pages out right to left.',
  order: 7,
  keywords: [
    'I18nProvider',
    'i18n',
    'translation',
    'locale',
    'messages',
    'i18nStrings',
    'ariaLabels',
    'closeAriaLabel',
    'ICU',
    'rtl',
    'dir',
    'right-to-left',
    'Arabic',
    'Hebrew',
  ],
  Page,
};

export default guide;
