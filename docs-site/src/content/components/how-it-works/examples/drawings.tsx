// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import HowItWorks from '@ordinate/components/how-it-works';
import StyleScope from '@ordinate/components/style-scope';

// A small line drawing for each step. They only decorate, so they are hidden from screen readers.
function Drawing({ path }: { path: string }) {
  return (
    <svg width="96" height="64" viewBox="0 0 96 64" aria-hidden="true">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export default function Drawings() {
  return (
    <StyleScope styleName="editorial">
      <HowItWorks
        ariaLabel="How to send us a piece"
        steps={[
          {
            title: 'Send a pitch',
            description: 'A paragraph on the garden or the person, and why now.',
            media: <Drawing path="M16 16h64v40H16zM16 16l32 22 32-22" />,
          },
          {
            title: 'We reply in two weeks',
            description: 'Yes, not yet, or a question. We answer every pitch.',
            media: <Drawing path="M48 8a24 24 0 1 0 0.1 0M48 18v14l10 8" />,
          },
          {
            title: 'Write and edit',
            description: 'Around 2,000 words. One round of edits with the editor.',
            media: <Drawing path="M20 52l8-2 38-38-6-6-38 38zM56 12l6 6M16 58h64" />,
          },
        ]}
      />
    </StyleScope>
  );
}
