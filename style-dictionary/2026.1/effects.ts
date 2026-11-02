// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { EffectsDictionary } from '../utils/interfaces.js';

export const tokens: EffectsDictionary = {
  // Chart marks pushed back while another series or segment is highlighted.
  opacityDimmed: '0.25',
  // Legend entries and detail rows pushed back the same way. Text needs more strength to stay legible.
  opacityDimmedText: '0.55',
  // Dot leaders, drawn in the text color at reduced strength so they stay quiet on any background.
  opacityLeader: '0.55',
  // A linked image fades a little under the pointer.
  opacityMediaHover: '0.88',
  // Construction lines around a container, drawn in its kind color but held back so the content leads.
  opacityConstruction: '0.45',
};
