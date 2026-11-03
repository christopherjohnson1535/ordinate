// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ComponentDoc } from '../../../registry/types';

const doc: ComponentDoc = {
  name: 'CopyToClipboard',
  folder: 'copy-to-clipboard',
  group: 'actions',
  summary: 'Copies a value, such as an ID or a key, to the clipboard and confirms it.',
  description: (
    <>
      <p>
        A copy button with the copy icon, as a full button, an icon button, or a small icon after the value itself.
        When the copy succeeds, a short mono stamp, &ldquo;Copied&rdquo; keyed by a square in the complete color, shows
        in an ink chip next to the button for two seconds. When the browser refuses, the chip shows the fault icon and
        the error text.
      </p>
      <p>
        The component writes <code>textToCopy</code> with the browser&apos;s clipboard API. It needs a secure context
        (HTTPS or localhost) and can fail when the page has no clipboard permission.
      </p>
    </>
  ),
  marks: ['M6', 'M13'],
  examples: [
    {
      id: 'variants',
      title: 'Variants',
      description: (
        <p>
          <code>button</code> shows <code>copyButtonText</code>. <code>icon</code> shows only the icon, named by{' '}
          <code>copyButtonAriaLabel</code>. <code>inline</code> shows the value followed by a small icon button, for
          values in text, tables and key-value lists.
        </p>
      ),
      layout: 'centered',
    },
    {
      id: 'key-value',
      title: 'Values in a list',
      description: (
        <p>
          The inline variant fits a <a href="#/components/key-value-pairs">KeyValuePairs</a> value.{' '}
          <code>textToDisplay</code> shows a shortened access key while the whole key is copied.
        </p>
      ),
    },
    {
      id: 'disabled',
      title: 'Disabled with a reason',
      description: (
        <p>
          With a <code>disabledReason</code>, the disabled button stays focusable and shows the reason in a tooltip on
          hover and focus.
        </p>
      ),
      layout: 'centered',
    },
  ],
  guidelines: {
    use: [
      'For values people paste somewhere else: IDs, endpoints, keys, commands.',
      'With the inline variant beside a value in a table, a key-value list or running text.',
      'With popoverRenderWithPortal inside a container that clips its content, such as a scrolling table, so the confirmation is not cut off.',
    ],
    avoid: [
      'For long text such as a whole file. Offer a download instead.',
      'A copy button for a value the user cannot see, unless the label says what is copied.',
    ],
    writing: [
      'Name what is copied in the button text or aria label: "Copy public key", "Copy node ID".',
      'Say what was copied in copySuccessText when there are several copy buttons near each other: "Endpoint copied".',
      'Keep the error short and plain: the default is "Failed to copy".',
    ],
  },
  accessibility: [
    <>
      The <code>icon</code> and <code>inline</code> variants have no visible button text, so set{' '}
      <code>copyButtonAriaLabel</code>. It falls back to <code>copyButtonText</code>, then to &ldquo;Copy&rdquo;.
    </>,
    'The confirmation is a polite live region. It opens empty and is filled a moment later, so screen readers announce it each time, even when the same message repeats.',
    'The confirmation hides after two seconds, when focus leaves the button, or on Escape. Escape closes only the confirmation, not a modal around it.',
    <>
      A disabled button with a <code>disabledReason</code> stays in the tab order, marked <code>aria-disabled</code>,
      and its tooltip describes it. Without a reason it is natively disabled and cannot be focused.
    </>,
  ],
  related: ['button', 'key-value-pairs', 'button-group', 'tooltip'],
};

export default doc;
