// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import clsx from 'clsx';

import { IconProviderContext } from '../icon-provider/context';
import { warnOnce } from '../internal/logging';
import { isDeprecatedIconName, legacyIconName, resolveIconName } from './deprecated-names';
import icons from './generated/icons';
import { IconProps } from './interfaces';

import styles from './styles.css.js';

// Icons that point along the reading direction, mirrored in right-to-left layout.
const directionalIcons = new Set<string>([
  'arrow-left',
  'arrow-right',
  'caret-left-solid',
  'caret-right-solid',
  'chevron-left',
  'chevron-left-double',
  'chevron-right',
  'chevron-right-double',
  'node-expand',
  'open-outside',
  'redo',
  'send',
  'undo',
]);

export interface InternalIconProps extends IconProps {
  /**
   * Lets other components position the icon. Not part of the public API.
   */
  className?: string;
}

export function InternalIcon({
  name,
  svg,
  size = 'normal',
  variant = 'normal',
  ariaLabel,
  className,
  ...rest
}: InternalIconProps) {
  const overrides = useContext(IconProviderContext);
  if (name && isDeprecatedIconName(name)) {
    warnOnce(
      'Icon',
      `The icon "${name}" is now called "${resolveIconName(name)}". The old name stops working in the next major version.`
    );
  }
  const current = name ? resolveIconName(name) : undefined;
  const legacy = current ? legacyIconName(current) : undefined;
  // An IconProvider written with the old names still applies to the renamed icons.
  const override = current
    ? current in overrides
      ? overrides[current]
      : legacy
        ? overrides[legacy]
        : undefined
    : undefined;

  if (override === null) {
    return null;
  }

  const props = {
    ...rest,
    className: clsx(
      styles.icon,
      styles[`size-${size}`],
      styles[`variant-${variant}`],
      !svg && !override && current && directionalIcons.has(current) && styles['flip-in-rtl'],
      className
    ),
    ...(ariaLabel ? { role: 'img', 'aria-label': ariaLabel } : { 'aria-hidden': true }),
  };

  const custom = svg ?? override;
  if (custom) {
    return <span {...props}>{custom}</span>;
  }

  const markup = current ? icons[current] : undefined;
  if (!markup) {
    warnOnce('Icon', name ? `There is no icon named "${name}".` : 'Set either `name` or `svg`.');
    return null;
  }

  // The markup comes from the SVG files in src/icon/icons, checked at build time.
  return <span {...props} dangerouslySetInnerHTML={{ __html: markup }} />;
}
