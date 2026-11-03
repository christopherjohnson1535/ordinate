// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Link from '@ordinate/components/link';
import SiteFooter from '@ordinate/components/site-footer';
import SpaceBetween from '@ordinate/components/space-between';
import StyleScope from '@ordinate/components/style-scope';

export default function Minimal() {
  return (
    <StyleScope styleName="studio">
      <SiteFooter
        tone="accent"
        legal={
          <SpaceBetween direction="horizontal" size="m">
            <span>© 2026 Harbour & Pine, architects</span>
            <Link href="mailto:studio@example.com">studio@example.com</Link>
            <Link href="https://example.com/instagram" external={true}>
              Instagram
            </Link>
          </SpaceBetween>
        }
      />
    </StyleScope>
  );
}
