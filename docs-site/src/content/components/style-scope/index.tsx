// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'StyleScope',
  folder: 'style-scope',
  group: 'layout',
  summary: 'Gives everything inside it a style, mode, density or revision, set in markup.',
  description: (
    <>
      <p>
        A style scope is an element that sets the same classes as <code>applyStyle</code>, <code>applyMode</code>,{' '}
        <code>applyDensity</code> and <code>applyRevision</code> from <code>@ordinate/global-styles</code>. Everything
        inside it takes those settings; anything left unset is inherited from around it. Because it is markup, it also
        renders on the server, so a server-rendered page can set a website style without running script.
      </p>
      <p>
        A scope with a <code>mode</code> also paints its own background and text color, so dark text does not end up on
        a light page. Read <a href="#/start/styles">Styles, modes and revisions</a> in Get started for how the settings
        work across a whole page.
      </p>
    </>
  ),
  examples: [
    {
      id: 'styles',
      title: 'Styles',
      description: (
        <p>
          <code>styleName</code> sets the voice: <code>console</code> for applications, <code>editorial</code>,{' '}
          <code>studio</code> or <code>shopfront</code> for websites. The same components take each style’s type and
          shapes.
        </p>
      ),
    },
    {
      id: 'mode-and-density',
      title: 'Mode and density',
      description: (
        <p>
          <code>mode</code> sets light or dark for a part of the page and paints its background. Give the scope a{' '}
          <code>revision</code> too: the colors of a mode are worked out where a revision&apos;s tokens are declared,
          and in Chrome a scope with a mode but no revision of its own keeps the page&apos;s colors.{' '}
          <code>density="compact"</code> tightens padding and control heights inside the scope.
        </p>
      ),
    },
    {
      id: 'revision',
      title: 'Revision',
      description: (
        <p>
          <code>revision</code> pins everything inside to one design revision, such as the square corners of 2026.1 or
          the soft corners of 2026.2.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'On a server-rendered page, to set its style or mode in the markup.',
      'For a part of a page that must look different from the rest, such as a dark preview or a website section inside a console.',
      'For a landmark that also sets a style, with tagOverride set to main, section, article or aside.',
    ],
    avoid: [
      <>
        For the whole page in a browser application. Call <code>applyStyle</code>, <code>applyMode</code> and the other
        functions of <code>@ordinate/global-styles</code> once on the body.
      </>,
      'Scopes nested deeply inside each other. Each one overrides the settings around it, which gets hard to follow.',
    ],
  },
  accessibility: [
    <>
      The scope renders a <code>div</code> with no role unless you set <code>tagOverride</code>. Give a{' '}
      <code>section</code> or <code>article</code> an <code>ariaLabel</code> so it is a named region.
    </>,
    'Every style, mode and revision is designed to keep text contrast. If you combine a scoped mode with your own colors, check the contrast yourself.',
  ],
  related: ['app-layout', 'box'],
};

export default doc;
