// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Example } from '../../parts/example';
import { CodeBlock, DocSection, Notes, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';
import { LoadedExample } from '../../registry/types';

const density: LoadedExample = {
  meta: {
    id: 'density',
    title: 'Comfortable and compact',
    description:
      'The same table twice, each half given its density with applyDensity on its own element. Compact tightens the rows; the gaps between columns stay the same.',
  },
  load: () => import('./modes-and-density/density'),
  loadSource: () => import('./modes-and-density/density.tsx?raw').then(module => module.default),
};

function Page() {
  return (
    <>
      <Prose>
        <p>
          Three settings change how every component is drawn without changing what it is: the color mode, the density
          and motion. Each is a function in <code>@ordinate/global-styles</code> that sets a class on the page, or on
          one element and everything inside it.
        </p>
      </Prose>

      <DocSection id="mode" number={1} title="Light, dark or system">
        <Prose>
          <p>
            <code>applyMode</code> takes <code>Mode.Light</code>, <code>Mode.Dark</code> or <code>Mode.System</code>.
            System follows the operating system&apos;s setting and changes with it, with no reload and no code of your
            own.
          </p>
        </Prose>
        <CodeBlock
          label="main.tsx"
          code={`
import { applyMode, Mode } from '@ordinate/global-styles';

applyMode(Mode.System);
`}
        />
        <Prose>
          <p>
            Mode is not a theme. Every color token holds a light and a dark value, written with the CSS{' '}
            <code>light-dark()</code> function, and the mode only sets <code>color-scheme</code>. Switching costs one
            class change, and your own CSS can use the same tokens from <code>@ordinate/design-tokens</code> to follow
            along.
          </p>
        </Prose>
        <Notes
          items={[
            <>
              Light is the default. <code>applyMode(null)</code> removes the mode class and returns to it.
            </>,
            <>
              To offer a choice in your application, keep it in your own state or storage and call{' '}
              <code>applyMode</code> when it changes. The function does not remember anything between page loads.
            </>,
            <>
              <code>applyMode(Mode.Dark, element)</code> draws the components inside <code>element</code> in dark mode.
              Pin a revision on the same element with <code>applyRevision</code>, because each color is worked out where
              the revision&apos;s tokens are declared: in Chrome, a mode set on an element with no revision of its own
              keeps the page&apos;s colors. It does not paint the element&apos;s own background; components that have a
              surface, such as Container, paint theirs. To paint a whole region for its mode, use{' '}
              <a href="#/components/style-scope">StyleScope</a> with both <code>mode=&quot;dark&quot;</code> and a{' '}
              <code>revision</code>.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="density" number={2} title="Density">
        <Prose>
          <p>
            <code>applyDensity</code> takes <code>Density.Comfortable</code>, the default, or{' '}
            <code>Density.Compact</code>. Compact tightens padding inside containers, rows and controls, and lowers
            control heights, so more fits on screen. Use it for dense tools that people work in all day, or let people
            choose.
          </p>
        </Prose>
        <CodeBlock
          label="main.tsx"
          code={`
import { applyDensity, Density } from '@ordinate/global-styles';

applyDensity(Density.Compact);
`}
        />
        <Prose>
          <p>
            Density changes only the scaled spacings and control heights. Gaps that carry meaning, such as the space
            between an icon and its label, stay the same. <code>applyDensity(null)</code> returns to comfortable. A
            table can also be compact on its own, whatever the page density, with{' '}
            <code>contentDensity=&quot;compact&quot;</code>.
          </p>
        </Prose>
        <Example example={density} index={1} />
      </DocSection>

      <DocSection id="motion" number={3} title="Motion">
        <Prose>
          <p>
            Ordinate moves little: a button presses onto its offset, crop marks slide to the chosen tab or page, plates
            fade and rise 4 px as they open. There is no bounce, and durations and easing come from the revision.
          </p>
          <p>
            Every transition and animation runs only when the user has not asked for reduced motion. When the operating
            system&apos;s reduced-motion setting is on, every change happens at once. You do not need to do anything for
            this.
          </p>
          <p>
            <code>disableMotion(true)</code> turns component motion off on top of that, for everyone: for a setting in
            your application, for screenshots and visual tests, or for a kiosk. <code>disableMotion(false)</code> turns
            it back on, leaving the user&apos;s own setting in charge.
          </p>
        </Prose>
        <CodeBlock
          label="main.tsx"
          code={`
import { disableMotion } from '@ordinate/global-styles';

disableMotion(userPrefersStillness);
`}
        />
      </DocSection>

      <DocSection id="scope" number={4} title="The page or one element">
        <Prose>
          <p>
            Each function takes an element as its last argument and defaults to <code>document.body</code>. The setting
            applies to everything inside the element, so a dark preview panel or a compact side panel can sit on a
            light, comfortable page. Settings nest: a compact region inside a dark page is dark and compact.
          </p>
        </Prose>
        <CodeBlock
          label="inspector.tsx"
          code={`
const panel = useRef<HTMLElement>(null);

useEffect(() => {
  if (panel.current) {
    applyDensity(Density.Compact, panel.current);
    disableMotion(true, panel.current);
  }
}, []);
`}
        />
        <Prose>
          <p>
            Overlays that render into a portal, such as a popover with <code>renderWithPortal</code>, attach to the page
            body. They follow the page&apos;s settings, not those of the element they were opened from.
          </p>
        </Prose>
      </DocSection>
    </>
  );
}

const guide: GuideDoc = {
  slug: 'modes-and-density',
  title: 'Modes and density',
  summary: 'Set light, dark or system mode, compact density and motion for the page or one region.',
  order: 4,
  keywords: [
    'applyMode',
    'Mode',
    'dark mode',
    'light mode',
    'system',
    'applyDensity',
    'Density',
    'compact',
    'comfortable',
    'disableMotion',
    'reduced motion',
    'prefers-reduced-motion',
    'light-dark',
  ],
  Page,
};

export default guide;
