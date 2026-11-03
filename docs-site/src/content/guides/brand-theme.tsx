// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Table from '@ordinate/components/table';

import { Example } from '../../parts/example';
import { CodeBlock, DocSection, Notes, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';
import { LoadedExample } from '../../registry/types';

const scopedTheme: LoadedExample = {
  meta: {
    id: 'scoped-theme',
    title: 'A theme on one region',
    description:
      'The Harbour theme sets the primary button, links and checked controls in its blue, with round buttons and softer fields, on one element only. Turn it off and reset returns every token to the revision.',
  },
  load: () => import('./brand-theme/scoped-theme'),
  loadSource: () => import('./brand-theme/scoped-theme.tsx?raw').then(module => module.default),
};

const groups = [
  {
    group: 'Brand colors',
    tokens:
      'colorBackgroundButtonPrimary, colorBackgroundButtonPrimaryHover, colorTextButtonPrimary, colorTextLink, colorTextLinkHover, colorTextAccent, colorBorderAccent, colorBorderFocusRing, colorBackgroundControlChecked, colorForegroundControlChecked, colorBackgroundItemSelected, colorBackgroundHighlight, colorBackgroundLayoutMain, colorBackgroundContainer',
  },
  { group: 'Font families', tokens: 'fontFamilyBase, fontFamilyDisplay, fontFamilyMono' },
  {
    group: 'Corner radii',
    tokens:
      'borderRadiusButton, borderRadiusInput, borderRadiusContainer, borderRadiusModal, borderRadiusCheckbox, borderRadiusBadge, borderRadiusAlert, borderRadiusDropdown, borderRadiusToggle, borderRadiusRadio, borderRadiusInlineCode, borderRadiusSection, borderRadiusAction',
  },
];

function Page() {
  return (
    <>
      <Prose>
        <p>
          A brand theme lets one product use its own colors, fonts and corner radii without forking the library. It
          changes a fixed set of tokens, for the whole page or one region, and every component that reads those tokens
          follows. There is still no way to restyle one button: all buttons in the themed area look the same.
        </p>
      </Prose>

      <DocSection id="apply-theme" number={1} title="Apply a theme">
        <Prose>
          <p>
            <code>applyTheme</code> comes from <code>@ordinate/components/theming</code>. Give it a theme: an object of
            token names and values. A value is any CSS value, or a pair with a <code>light</code> and a{' '}
            <code>dark</code> value, which becomes <code>light-dark()</code> and so follows the color mode.
          </p>
        </Prose>
        <CodeBlock
          label="main.tsx"
          code={`
import { applyTheme } from '@ordinate/components/theming';

const { reset } = applyTheme({
  theme: {
    tokens: {
      colorBackgroundButtonPrimary: { light: '#0b5cad', dark: '#7cc4ff' },
      colorTextLink: { light: '#0b5cad', dark: '#7cc4ff' },
      fontFamilyBase: "'Inter', system-ui, sans-serif",
      borderRadiusButton: '999px',
    },
  },
});
`}
        />
        <Prose>
          <p>
            <code>applyTheme</code> injects one <code>&lt;style&gt;</code> element into the head of the document. It
            takes two more options:
          </p>
        </Prose>
        <Notes
          items={[
            <>
              <code>target</code>: an element whose subtree takes the theme. Without it the theme applies to the whole
              document.
            </>,
            <>
              <code>nonce</code>: set on the injected <code>&lt;style&gt;</code> element, for pages with a content
              security policy.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="tokens" number={2} title="What can be themed">
        <Prose>
          <p>
            Only these tokens can be themed. Their TypeScript type is <code>ThemeableTokenName</code>.
          </p>
        </Prose>
        <Table
          variant="embedded"
          wrapLines={true}
          trackBy="group"
          items={groups}
          ariaLabels={{ tableLabel: 'Themeable tokens' }}
          columnDefinitions={[
            { id: 'group', header: 'Group', cell: item => item.group, isRowHeader: true, width: 160 },
            { id: 'tokens', header: 'Tokens', cell: item => item.tokens, contentType: 'identifier' },
          ]}
        />
        <Notes
          items={[
            <>
              Status colors (fault, caution, complete, note) and kind colors (configuration, resource, policy) cannot be
              themed. Their meaning has to stay the same in every product.
            </>,
            <>
              Body text colors cannot be themed either, because they carry the contrast guarantees. Check the contrast
              of the colors you do set, such as the text on your primary button, in both modes.
            </>,
            <>Spacing, sizes and motion belong to the revision and the density, not to a theme.</>,
            <>
              Unknown or non-themeable token names are ignored with a warning in the console. Values containing{' '}
              <code>;</code>, <code>{'{'}</code>, <code>{'}'}</code> or <code>&lt;</code> are rejected the same way, so
              a value cannot break out of its declaration.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="reset" number={3} title="Reset">
        <Prose>
          <p>
            <code>applyTheme</code> returns <code>reset</code>. It removes the injected style sheet, and the
            target&apos;s marker attribute, so every token returns to the pinned revision&apos;s value. In React, return
            it from an effect so the theme goes away when the component unmounts or the theme changes.
          </p>
        </Prose>
        <CodeBlock
          label="brand.tsx"
          code={`
useEffect(() => {
  if (region.current) {
    return applyTheme({ theme: harbour, target: region.current }).reset;
  }
}, [harbour]);
`}
        />
        <Example example={scopedTheme} index={1} />
      </DocSection>

      <DocSection id="layers" number={4} title="How a theme combines with the rest">
        <Prose>
          <p>
            A theme sits on top of the pinned <a href="#/start/revisions">revision</a> and any{' '}
            <a href="#/start/styles">style</a>. It wins for the tokens it sets, including inside revision subtrees
            nested in the themed element; every other token keeps the value of the revision and style.
          </p>
          <p>
            For example, if a theme sets <code>borderRadiusButton</code> and the page moves from 2026.1 to 2026.2,
            buttons keep the theme&apos;s radius while containers pick up the new revision&apos;s radius. When you move
            to a new revision, look at the tokens your theme sets again.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="server" number={5} title="Server-rendered pages">
        <Prose>
          <p>
            <code>generateThemeStylesheet</code> returns the CSS <code>applyTheme</code> would inject, as a string.
            Inline it in the <code>&lt;head&gt;</code> of a server-rendered page so the first paint already has the
            brand, with no flash of the default look. Its <code>selector</code> defaults to <code>:root</code>.
          </p>
        </Prose>
        <CodeBlock
          label="Layout.astro"
          code={`
---
import { generateThemeStylesheet } from '@ordinate/components/theming';
import { harbour } from '../theme';

const themeCss = generateThemeStylesheet({ theme: harbour });
---
<head>
  <style set:html={themeCss}></style>
</head>
`}
        />
      </DocSection>
    </>
  );
}

const guide: GuideDoc = {
  slug: 'brand-theme',
  title: 'Brand theme',
  summary: 'Set your own brand colors, fonts and corner radii with applyTheme, and reset them.',
  order: 6,
  keywords: [
    'applyTheme',
    'theme',
    'reset',
    'generateThemeStylesheet',
    'ThemeableTokenName',
    'Theme',
    'brand',
    'colorBackgroundButtonPrimary',
    'fontFamilyBase',
    'borderRadiusButton',
    'nonce',
  ],
  Page,
};

export default guide;
