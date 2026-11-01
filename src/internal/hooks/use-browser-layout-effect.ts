// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useLayoutEffect } from 'react';

/**
 * `useLayoutEffect` in the browser and `useEffect` on the server, where layout effects do nothing
 * and React 18 warns about them.
 */
export const useBrowserLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
