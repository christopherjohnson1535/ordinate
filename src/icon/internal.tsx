// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import clsx from 'clsx';

import { IconProviderContext } from '../icon-provider/context';
import { warnOnce } from '../internal/logging';
import icons from './generated/icons';
import { IconProps } from './interfaces';

import styles from './styles.css.js';

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
  const override = name ? overrides[name] : undefined;

  if (override === null) {
    return null;
  }

  const props = {
    ...rest,
    className: clsx(styles.icon, styles[`size-${size}`], styles[`variant-${variant}`], className),
    ...(ariaLabel ? { role: 'img', 'aria-label': ariaLabel } : { 'aria-hidden': true }),
  };

  const custom = svg ?? override;
  if (custom) {
    return <span {...props}>{custom}</span>;
  }

  const markup = name ? icons[name] : undefined;
  if (!markup) {
    warnOnce('Icon', name ? `There is no icon named "${name}".` : 'Set either `name` or `svg`.');
    return null;
  }

  // The markup comes from the SVG files in src/icon/icons, checked at build time.
  return <span {...props} dangerouslySetInnerHTML={{ __html: markup }} />;
}
