// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box, { BoxProps } from '~components/box';
import SpaceBetween from '~components/space-between';

import styles from './styles.module.scss';

const variants: BoxProps.Variant[] = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'p',
  'div',
  'span',
  'strong',
  'small',
  'code',
  'pre',
  'samp',
  'key-label',
  'value-large',
  'inline-code',
];

const fontSizes: BoxProps.FontSize[] = [
  'body-s',
  'body-m',
  'heading-xs',
  'heading-s',
  'heading-m',
  'heading-l',
  'heading-xl',
  'display-l',
  'display-xl',
];

const fontWeights: BoxProps.FontWeight[] = ['light', 'normal', 'bold', 'heavy'];

const colors: BoxProps.Color[] = [
  'text-label',
  'text-body-secondary',
  'text-status-error',
  'text-status-success',
  'text-status-info',
  'text-status-warning',
  'text-status-inactive',
];

const spacingSizes: BoxProps.SpacingSize[] = ['n', 'xxxs', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'xxl', 'xxxl'];

export default function BoxPermutations() {
  return (
    <SpaceBetween size="xl">
      <Box variant="h1">Box</Box>

      <section>
        <Box variant="h2">Variants</Box>
        <table className={styles.grid}>
          <tbody>
            {variants.map(variant => (
              <tr key={variant}>
                <th scope="row">{variant}</th>
                <td>
                  <Box variant={variant}>North annex, 12 nodes</Box>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <Box variant="h2">Font size</Box>
        {fontSizes.map(fontSize => (
          <Box key={fontSize} fontSize={fontSize}>
            {fontSize}
          </Box>
        ))}
      </section>

      <section>
        <Box variant="h2">Font weight</Box>
        {fontWeights.map(fontWeight => (
          <Box key={fontWeight} fontWeight={fontWeight}>
            {fontWeight}
          </Box>
        ))}
      </section>

      <section>
        <Box variant="h2">Color</Box>
        {colors.map(color => (
          <Box key={color} color={color}>
            {color}
          </Box>
        ))}
      </section>

      <section>
        <Box variant="h2">Padding and margin</Box>
        <SpaceBetween size="xs">
          {spacingSizes.map(size => (
            <div key={size} className={styles.frame}>
              <Box padding={size} margin={{ left: size }} display="inline-block">
                <span className={styles.fill}>{size}</span>
              </Box>
            </div>
          ))}
          <div className={styles.frame}>
            <Box padding={{ vertical: 'xs', horizontal: 'xl', left: 'n' }}>
              <span className={styles.fill}>vertical xs, horizontal xl, left n</span>
            </Box>
          </div>
        </SpaceBetween>
      </section>

      <section>
        <Box variant="h2">Text align, display and float</Box>
        <Box textAlign="left">left</Box>
        <Box textAlign="center">center</Box>
        <Box textAlign="right">right</Box>
        <Box display="inline">inline </Box>
        <Box display="inline-block">inline-block </Box>
        <Box display="none">hidden</Box>
        <div className={styles.frame}>
          <Box float="right" padding="xs">
            float right
          </Box>
          <Box padding="xs">Text that flows beside the floated box.</Box>
        </div>
      </section>
    </SpaceBetween>
  );
}
