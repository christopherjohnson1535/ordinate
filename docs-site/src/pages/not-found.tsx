// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Link from '@ordinate/components/link';

import { href } from '../app/router';
import { PageFrame } from '../parts/page-frame';
import { Prose } from '../parts/prose';

export default function NotFound({ path }: { path: string }) {
  return (
    <PageFrame code="—" title="No such sheet" description={`Nothing in this set is drawn at ${path}.`}>
      <Prose>
        <p>
          The page may have moved or been renamed. Search with <kbd>/</kbd>, or start from the{' '}
          <Link href={href('/')}>cover sheet</Link> or the <Link href={href('/components')}>component index</Link>.
        </p>
      </Prose>
    </PageFrame>
  );
}
