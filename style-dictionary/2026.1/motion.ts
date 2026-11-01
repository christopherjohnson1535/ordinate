// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { MotionDictionary } from '../utils/interfaces.js';

export const tokens: MotionDictionary = {
  motionDurationResponsive: '120ms',
  motionDurationExpressive: '180ms',
  motionDurationRotation: '800ms',
  motionEasingStandard: 'cubic-bezier(0.2, 0, 0, 1)',
  motionEasingLinear: 'linear',
  // Drawings that draw themselves: a stroke drawing on, a stroke taking itself away, and one trip of a
  // dot moving along a wire.
  motionDurationDraw: '900ms',
  motionDurationErase: '400ms',
  motionDurationFlow: '1800ms',
};
