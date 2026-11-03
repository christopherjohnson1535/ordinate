// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Hotspot',
  folder: 'hotspot',
  group: 'guided-flows',
  summary: 'Marks the place on a page that a tutorial step points at.',
  description: (
    <>
      <p>
        A hotspot is a circled tag, as a drawing numbers the places a note refers to. While a tutorial runs, every
        hotspot that a step of the current task points at shows its step&rsquo;s number within the task. The current
        step&rsquo;s tag is drawn heavier and in ink, and the step&rsquo;s annotation opens from it. Outside a tutorial,
        and for steps of other tasks, a hotspot shows only its children.
      </p>
      <p>
        Hotspots work inside an <a href="#/components/annotation-context">AnnotationContext</a>, which holds the
        tutorial. A step finds its hotspot by <code>hotspotId</code>, so keep the IDs unique on the page.
      </p>
    </>
  ),
  marks: ['M9', 'M7'],
  examples: [
    {
      id: 'tasks',
      title: 'Hotspots on a form',
      description: (
        <p>
          Turn the tutorial on: the first task&rsquo;s two hotspots show their numbers and the first step opens. The
          third hotspot belongs to the next task and shows nothing until the tutorial gets there.
        </p>
      ),
    },
    {
      id: 'placement',
      title: 'Side and direction',
      description: (
        <p>
          <code>side</code> puts the tag after the element or before it. <code>direction</code> is the side of the tag
          the annotation opens on; it flips when there is no room. A hotspot without children stands on its own next to
          the element it is about. Run the tutorial and step through to see each placement.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'Around, or next to, each control a tutorial step points at.',
      'With a direction that keeps the annotation clear of the fields the user needs to see.',
    ],
    avoid: [
      <>
        Outside an <a href="#/components/annotation-context">AnnotationContext</a>, where it never shows.
      </>,
      <>
        For a note that is always shown. Use a <a href="#/components/popover">Popover</a> or the description of a{' '}
        <a href="#/components/form-field">FormField</a>.
      </>,
    ],
  },
  accessibility: [
    <>
      The tag is a button that opens and closes its annotation. It says whether the annotation is open and which step it
      is: &ldquo;Open annotation for step 1 of 2&rdquo; by default, changed with the context&rsquo;s{' '}
      <code>i18nStrings.labelHotspot</code>.
    </>,
    'Choosing the tag of another step in the task moves the tutorial to that step.',
    'When the annotation closes, focus returns to the tag.',
    <>
      <code>side</code> and <code>direction</code> follow the reading direction, so <code>right</code> is on the left in
      right-to-left layout.
    </>,
  ],
  related: ['annotation-context', 'tutorial-panel', 'popover'],
};

export default doc;
