// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'ErrorBoundary',
  folder: 'error-boundary',
  group: 'status',
  summary: 'Keeps the rest of the page working when one part of it fails to render.',
  description: (
    <>
      <p>
        Wrap a part of the page that could throw while rendering, such as a chart fed by an outside service. While the
        content renders, the boundary adds nothing to the page. When it throws, the boundary shows a fault{' '}
        <a href="#/components/alert">Alert</a> in its place with a button that reloads the page, and the rest of the page
        keeps working.
      </p>
      <p>
        The boundary keeps showing the fallback until it is mounted again. To let the user try again without reloading,
        give it a <code>key</code> and change the key.
      </p>
    </>
  ),
  marks: ['M1', 'M4'],
  examples: [
    {
      id: 'recover',
      title: 'Failing and recovering',
      description: (
        <p>
          Break the report to see the built-in fallback, then recover. <code>onError</code> receives the error and the{' '}
          <code>errorBoundaryId</code>, so you can report which part failed. <code>feedbackHref</code> adds a feedback
          link to the message.
        </p>
      ),
    },
    {
      id: 'custom-fallback',
      title: 'Your own fallback',
      description: (
        <p>
          <code>renderFallback</code> replaces the built-in message, here with one that can try again in place.
        </p>
      ),
    },
  ],
  guidelines: {
    use: [
      'Around each independent part of a page, such as a widget on a dashboard or a panel of details, so one failure does not blank the page.',
      'Around content that renders data you do not control.',
    ],
    avoid: [
      <>
        For errors from requests, form submits and other events. A boundary only catches errors thrown while
        rendering; show those in an <a href="#/components/alert">Alert</a> or a{' '}
        <a href="#/components/flashbar">Flashbar</a>.
      </>,
      'Around every small component. A page full of fallbacks is harder to use than one fallback for a whole section.',
    ],
    writing: [
      'The built-in text says that this part of the page could not be shown and that refreshing may help. Replace it with i18nStrings only to translate it or to name the part.',
      'In your own fallback, say what failed in plain words and what the user can do. Do not show a stack trace.',
    ],
  },
  accessibility: [
    <>
      The fallback is wrapped in <code>role=&quot;alert&quot;</code>, so screen readers announce it when it replaces the
      content.
    </>,
    'Focus is not moved. If the user was working inside the part that failed, their focus is lost with it; move it to the fallback or nearby if that matters for your page.',
    'The refresh action is a native button and the feedback link a native link.',
  ],
  related: ['alert', 'flashbar', 'live-region'],
};

export default doc;
