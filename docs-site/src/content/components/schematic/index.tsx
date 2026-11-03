// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Schematic',
  folder: 'schematic',
  group: 'code-and-drawings',
  summary: 'Draws a system as boxes and right-angle wires, and moves the drawing from one state to the next.',
  description: (
    <>
      <p>
        You describe the drawing once: <code>parts</code> are labelled boxes and <code>wires</code> are runs of points
        between them, all in drawing units inside a <code>width</code> by <code>height</code> frame. The drawing scales
        to the width of its container and keeps its proportions. Wires are drawn under the parts and end in an
        arrowhead; <code>junctions</code> put a dot where a wire branches off a shared run, and a <code>flow</code> wire
        sends dots along itself in the accent color.
      </p>
      <p>
        <code>scene</code> says which parts and wires are shown now, and how. Change it and the drawing moves: a part
        that appears draws its outline on and then fills in, one that goes away takes its outline off, and the rest keep
        their place. A part can be accented as new, dimmed, pending or crossed out as removed. The same description
        draws as a <code>schematic</code> on a dot grid, a hand-drawn <code>sketch</code>, or a <code>chalkboard</code>.
      </p>
      <p>
        The <code>sketch</code> and <code>chalkboard</code> faces are not part of the main style sheet. Import{' '}
        <code>@ordinate/global-styles/drawing-fonts.css</code> where you use those variants.
      </p>
    </>
  ),
  examples: [
    {
      id: 'system',
      title: 'A system',
      description: (
        <p>
          With no <code>scene</code>, every part and wire is shown. Keep consecutive points on the same row or column
          for right-angle wiring, and mark where wires split with <code>junctions</code>.
        </p>
      ),
    },
    {
      id: 'walkthrough',
      title: 'Stepping through scenes',
      description: (
        <p>
          A rolling replacement in four steps. Each step is a scene: the new node is accented and pending while it
          starts, then gets its wire, and the old node is crossed out. Update <code>ariaLabel</code> with each step.
        </p>
      ),
    },
    {
      id: 'variants',
      title: 'Variants',
      description: (
        <p>
          The parts, wires and scene are the same in every variant. In <code>schematic</code> and <code>sketch</code> an
          accent is hatched; on a <code>chalkboard</code> it is drawn in the accent color. This example imports the
          drawing fonts.
        </p>
      ),
    },
    {
      id: 'states',
      title: 'Part states',
      description: (
        <p>
          <code>accent</code> marks what is new or in focus, <code>dimmed</code> pushes a part back,{' '}
          <code>pending</code> draws a part that is starting more faintly and <code>removed</code> crosses it out. The
          parts here use <code>size: 'small'</code> lettering.
        </p>
      ),
    },
    {
      id: 'failover',
      title: 'A failover on a chalkboard',
      description: (
        <p>
          A part’s label can change between scenes too. Here the replica is promoted and takes the primary’s name while
          the old primary is crossed out and dimmed.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'To explain how the parts of a system connect, in a guide, a tutorial or an incident review.',
      'To walk through a change step by step, such as a rollout or a failover, with one scene per step.',
      'With the sketch variant for a drawing that should read as an idea rather than a specification.',
    ],
    avoid: [
      'For live state that people act on. A schematic is an illustration; put the state and its actions in a table or a status indicator.',
      'For data with values and axes. Use a chart from @ordinate/charts.',
      <>
        For progress through a course or a program. Use a <a href="#/components/route-map">RouteMap</a>.
      </>,
      'Telling a state by color alone. Change a label or a detail as well, such as "Primary" or "starting".',
    ],
    writing: [
      'Label parts with a noun of a word or two. Put a name, a version or a count in detail.',
      'Write ariaLabel as a sentence that says what the drawing shows now, and keep it in step with the scene.',
      'Put the text of each step on the page and pass its ID to ariaDescribedby.',
    ],
  },
  accessibility: [
    <>
      The drawing is one image (<code>role="img"</code>) named by <code>ariaLabel</code>, which is required. Screen
      readers do not read the parts one by one, so the label has to describe what the drawing shows.
    </>,
    <>
      <code>ariaDescribedby</code> points at a longer description, such as the text of the current step. Update both
      when the scene changes.
    </>,
    'Parts drawing on and off and the dots along flow wires follow the reduced-motion setting: with reduced motion every change is instant and the flow dots are not shown.',
    'The drawing keeps its geometry in right-to-left pages.',
    'Nothing in the drawing is focusable or takes input. Put controls, such as the buttons that step through scenes, next to it.',
  ],
  related: ['route-map', 'code-view', 'steps', 'tutorial-panel'],
};

export default doc;
