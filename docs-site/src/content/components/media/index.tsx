// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'Media',
  folder: 'media',
  group: 'website-content',
  summary: 'Shows a picture, video or drawing in a frame of a fixed shape, so rows of pictures stay even.',
  description: (
    <>
      <p>
        Media is a frame with a set aspect ratio. The image is cropped or fitted into it, so pictures of different
        sizes line up in a row or a grid. Instead of an image you can put your own content in the frame, such as a{' '}
        <code>video</code>, an <code>iframe</code> with a map or an SVG drawing; it is sized to fill the frame.
      </p>
      <p>
        An empty frame is drawn the way a drawing marks where a picture will be pasted in: hatched, with a dashed
        edge and an optional note. The frame's corners follow the page style, so they are square in the console and
        editorial styles and rounded in <code>shopfront</code>.
      </p>
    </>
  ),
  marks: ['M12'],
  examples: [
    {
      id: 'row',
      title: 'A row of photographs',
      description: (
        <p>
          The same <code>aspectRatio</code> on every picture keeps the row even, whatever shape the files are. Give each
          image an <code>alt</code> that says what it shows.
        </p>
      ),
    },
    {
      id: 'shape-and-fit',
      title: 'Shape and fit',
      description: (
        <p>
          <code>cover</code> fills the frame and crops what does not fit, which suits photos. <code>contain</code> shows
          the whole image on a quiet fill, which suits logos and product shots. <code>auto</code> keeps the image's own
          shape.
        </p>
      ),
    },
    {
      id: 'drawing',
      title: 'Your own content',
      description: (
        <p>
          Put an SVG, a <code>video</code> or an <code>iframe</code> in the frame as children. They fill the frame, so
          give each one its own accessible name. These drawings stroke with <code>currentColor</code> and follow the
          mode.
        </p>
      ),
    },
    {
      id: 'placeholder',
      title: 'Placeholders in a draft',
      description: (
        <p>
          With no <code>src</code> and no children, the frame is hatched. <code>placeholderText</code> says which
          picture goes there, so a draft page can be reviewed before the photographs arrive.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'For photographs, product shots, drawings, maps and videos on a website page.',
      <>
        As the picture inside a <a href="#/components/figure">Figure</a>, <a href="#/components/plate">Plate</a>,{' '}
        <a href="#/components/story-card">StoryCard</a> or <a href="#/components/testimonial">Testimonial</a>.
      </>,
      'With one aspect ratio for every picture in a row or a grid.',
    ],
    avoid: [
      <>
        For a picture that needs a caption or a credit. Wrap it in a <a href="#/components/figure">Figure</a>.
      </>,
      <>
        For icons. Use an <a href="#/components/icon">Icon</a>.
      </>,
      'Shipping a page with placeholders. They are for drafts.',
    ],
    writing: [
      'Write alt text that says what the picture shows and why it is there: "Two sourdough loaves cooling on the counter", not "Image" or "bread.jpg".',
      'Use an empty alt only when the picture is decoration and the text next to it already says everything.',
      'Keep placeholder text to a few words that name the picture to come.',
    ],
  },
  accessibility: [
    <>
      An image is a plain <code>img</code> with your <code>alt</code>. Setting <code>src</code> without{' '}
      <code>alt</code> logs a warning in development and renders an empty alt.
    </>,
    'Content you pass as children is not labeled by Media. Give an SVG role="img" and an aria-label, a video a label or captions, and an iframe a title.',
    'The placeholder text is hidden from screen readers, so an empty frame is not announced.',
  ],
  related: ['figure', 'plate', 'story-card', 'testimonial'],
};

export default doc;
