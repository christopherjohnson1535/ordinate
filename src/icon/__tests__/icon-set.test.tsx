// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import Icon, { IconProps } from '../../../lib/components/icon';
import icons from '../../../lib/components/icon/generated/icons';

const names = Object.keys(icons) as IconProps.Name[];

describe('built-in icons', () => {
  test('the set is not empty', () => {
    expect(names.length).toBeGreaterThan(0);
  });

  test.each(names)('%s renders an svg with a 16 by 16 view box and visible parts', name => {
    const { container } = render(<Icon name={name} />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute('viewBox', '0 0 16 16');
    expect(svg!.querySelector('path, circle, rect, line, polyline, polygon, ellipse')).not.toBeNull();
  });
});
