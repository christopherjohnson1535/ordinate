// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { CodeBlock, DocSection, Notes, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';

function Page() {
  return (
    <>
      <Prose>
        <p>
          Every component renders on the server, with <code>renderToString</code> or a streaming renderer, and with no
          DOM. The library&apos;s own tests render each one in Node to check this. What needs attention is the CSS:
          components import their own style sheets, and Node cannot load a CSS file, so the bundler has to handle the
          package on the server as it does in the browser.
        </p>
      </Prose>

      <DocSection id="vite" number={1} title="Vite">
        <Prose>
          <p>
            In server rendering, Vite loads packages in <code>node_modules</code> with Node by default. Tell it to
            bundle the Ordinate packages instead, with <code>ssr.noExternal</code>. Then Vite processes their CSS
            imports and emits the styles for the client.
          </p>
        </Prose>
        <CodeBlock
          label="vite.config.ts"
          code={`
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  ssr: { noExternal: [/^@ordinate\\//] },
});
`}
        />
        <Prose>
          <p>
            The pattern covers <code>@ordinate/components</code> and <code>@ordinate/charts</code>, which both import
            CSS. If you use only the components, <code>noExternal: [&apos;@ordinate/components&apos;]</code> is enough.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="astro" number={2} title="Astro">
        <Prose>
          <p>
            Astro builds with Vite, so it needs the same setting, passed through its <code>vite</code> option:
          </p>
        </Prose>
        <CodeBlock
          language="javascript"
          label="astro.config.mjs"
          code={`
export default {
  vite: { ssr: { noExternal: ['@ordinate/components'] } },
};
`}
        />
        <Prose>
          <p>
            Astro 7 prerenders pages in a Vite environment of its own, which <code>ssr.noExternal</code> does not reach.
            Set it for that environment with a small plugin instead:
          </p>
        </Prose>
        <CodeBlock
          language="javascript"
          label="astro.config.mjs"
          code={`
const bundleOrdinate = {
  name: 'bundle-ordinate',
  configEnvironment(name) {
    if (name === 'ssr' || name === 'prerender') {
      return { resolve: { noExternal: [/^@ordinate\\//] } };
    }
  },
};

export default { vite: { plugins: [bundleOrdinate] } };
`}
        />
        <Prose>
          <p>
            Import <code>@ordinate/global-styles/index.css</code> in the layout, and render the components inside an
            island, such as <code>client:load</code>, wherever they need to be interactive. A component rendered without
            a client directive is static HTML: it looks right, but its buttons do nothing.
          </p>
        </Prose>
      </DocSection>

      <DocSection id="settings" number={3} title="Revision, style and mode on the server">
        <Prose>
          <p>
            <code>applyRevision</code>, <code>applyMode</code>, <code>applyStyle</code> and <code>applyDensity</code>{' '}
            set classes on <code>document.body</code>, so they run in the browser only. On a server-rendered page, set
            the same things in markup so the first paint is already right.
          </p>
        </Prose>
        <CodeBlock
          label="Layout.astro"
          code={`
---
import '@ordinate/global-styles/index.css';
import StyleScope from '@ordinate/components/style-scope';
---
<html lang="en">
  <body>
    <StyleScope styleName="shopfront" revision="2026.1" tagOverride="main">
      <slot />
    </StyleScope>
  </body>
</html>
`}
        />
        <Notes
          items={[
            <>
              <a href="#/components/style-scope">StyleScope</a> renders the same classes as the helpers, as plain
              markup. It has no <code>&apos;use client&apos;</code> directive, so it also works in React Server
              Components.
            </>,
            <>
              Without any setting, components use the default revision, which also applies to <code>:root</code>, and
              light mode. You can call the helpers on the client later to change them.
            </>,
            <>
              For a brand theme, inline the CSS from <code>generateThemeStylesheet</code> in the head. See{' '}
              <a href="#/start/brand-theme">Brand theme</a>.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="client-only" number={4} title="Parts that wait for the browser">
        <Notes
          items={[
            <>
              Measurements happen after hydration. Components that measure their own width, such as AppLayout and
              ColumnLayout, render their wide layout on the server and settle once they can measure in the browser.
            </>,
            <>
              The code editor loads CodeMirror in the browser, after it first renders. On the server it renders its
              loading state.
            </>,
            <>
              Component modules start with <code>&apos;use client&apos;</code>. In a React Server Components framework,
              import them from server components as usual; the framework sends them to the client.
            </>,
          ]}
        />
      </DocSection>
    </>
  );
}

const guide: GuideDoc = {
  slug: 'server-rendering',
  title: 'Server rendering',
  summary: 'Bundle the packages for server rendering with Vite or Astro, and set the revision and style in markup.',
  order: 8,
  keywords: [
    'SSR',
    'server-side rendering',
    'Vite',
    'ssr.noExternal',
    'noExternal',
    'Astro',
    'configEnvironment',
    'prerender',
    'renderToString',
    'StyleScope',
    'use client',
    'React Server Components',
  ],
  Page,
};

export default guide;
