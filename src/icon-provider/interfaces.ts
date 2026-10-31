// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { IconProps } from '../icon/interfaces';

export interface IconProviderProps {
  /**
   * Icons to replace inside this provider, by name. `null` for an icon hides it.
   * Passing `null` for the whole object restores the built-in icons.
   */
  icons: IconProviderProps.Icons | null;
  /**
   * The part of the application that uses these icons.
   */
  children?: React.ReactNode;
}

export namespace IconProviderProps {
  export type Icons = Partial<Record<IconProps.Name, React.ReactNode | null>>;
}
