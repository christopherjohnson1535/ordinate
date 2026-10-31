// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext } from 'react';

import { IconProviderProps } from './interfaces';

export const IconProviderContext = createContext<IconProviderProps.Icons>({});
