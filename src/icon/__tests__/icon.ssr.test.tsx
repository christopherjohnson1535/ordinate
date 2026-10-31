// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';

import Icon from '../../../lib/components/icon';

test('renders on the server', () => {
  expect(renderToString(<Icon name="check" />)).toContain('<svg');
});
