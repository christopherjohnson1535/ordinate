// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Spinner from '../../../lib/components/spinner';

test('renders on the server', () => {
  expect(renderToString(<Spinner size="big" />)).toContain('<svg');
});
