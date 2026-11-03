// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'HelpPanel',
  folder: 'help-panel',
  group: 'layout',
  summary: 'Explains the page or a feature on it, in the side panel of the app layout.',
  description: (
    <>
      <p>
        A help panel is drawn as a margin note: a faint construction line down its start edge, a small mono “Help”
        caption above the title, and the help text beside the line. Paragraphs, lists, <code>h3</code> headings, links
        and <code>code</code> inside it are styled as in <code>TextContent</code>, so you can write plain HTML.
      </p>
      <p>
        It goes in the <code>tools</code> slot of an <code>AppLayout</code>, which gives it a panel, a toggle and a
        close button.
      </p>
    </>
  ),
  marks: ['M1', 'M4'],
  examples: [
    {
      id: 'help',
      title: 'Help for a page',
      description: (
        <p>
          A title, a short explanation with an <code>h3</code> and a list, and a footer with further reading below a
          rule.
        </p>
      ),
    },
    {
      id: 'info-link',
      title: 'Opened from an Info link',
      description: (
        <p>
          An Info link next to a heading opens the panel with help about that heading. Change the panel’s content, then
          call the layout’s <code>openTools()</code>, which opens it and moves focus to its close button.
        </p>
      ),
      layout: 'flush',
      height: 'medium',
    },
    {
      id: 'loading',
      title: 'Loading',
      description: (
        <p>
          For help fetched on demand, <code>loading</code> shows a spinner with <code>loadingText</code> in place of the
          content.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For help about the page or a part of it, which the user can keep open while working.',
      'With Info links next to headings and form fields, each opening help about that part.',
    ],
    avoid: [
      <>
        For a short hint about one field. Use the field’s description in a{' '}
        <a href="#/components/form-field">FormField</a>, or a <a href="#/components/popover">Popover</a>.
      </>,
      <>
        For tools such as activity or an assistant. Use a <a href="#/components/drawer">Drawer</a>.
      </>,
      'For anything the user must read before acting. Put it on the page.',
    ],
    writing: [
      'Title the panel with the name of the page or feature it explains.',
      'Start with what the thing is, in one or two sentences, then what the user can do with it.',
      'Put links to longer documentation in the footer, under a "Learn more" heading.',
    ],
  },
  accessibility: [
    <>
      The title is an <code>h2</code>; use <code>h3</code> for headings inside the content. Pass the title as text, not
      as a heading element.
    </>,
    'The "Help" caption and the construction line are not part of the title, so screen readers read the title alone.',
    <>
      While loading, the panel is marked <code>aria-busy</code> and the loading text is a status message that screen
      readers announce.
    </>,
    <>
      In an app layout the panel is an <code>&lt;aside&gt;</code> region named “Help panel”, and opening it moves focus
      to its close button.
    </>,
  ],
  related: ['app-layout', 'drawer', 'text-content', 'link'],
};

export default doc;
