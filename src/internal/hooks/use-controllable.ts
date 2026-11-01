// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';

/**
 * State that the consumer may control. While `controlledValue` is defined it is the
 * value and the setter only updates the fallback; otherwise the component keeps its
 * own state, starting at `defaultValue`. The consumer's change handler is fired
 * separately, in both cases.
 */
export function useControllable<T>(controlledValue: T | undefined, defaultValue: T): [T, (value: T) => void] {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  return [controlledValue === undefined ? uncontrolledValue : controlledValue, setUncontrolledValue];
}
