// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ColorsDictionary } from '../utils/interfaces.js';

export const tokens: ColorsDictionary = {
  colorBackgroundLayoutMain: { light: '{colorPaper}', dark: '{colorNight}' },
  colorBackgroundContainer: { light: '{colorPaper}', dark: '{colorNightSheet}' },
  colorBackgroundControl: { light: '{colorPaper}', dark: '{colorNight}' },
  colorBackgroundControlReadOnly: { light: '{colorPlate}', dark: '{colorNightSheet}' },
  colorBackgroundButtonNormal: { light: '{colorPaper}', dark: '{colorNight}' },
  colorBackgroundButtonNormalHover: { light: '{colorPlate}', dark: '{colorNightSheet}' },
  colorBackgroundButtonPrimary: { light: '{colorInk}', dark: '{colorChalk}' },
  colorBackgroundButtonPrimaryHover: { light: '{colorInkRaised}', dark: '{colorPaper}' },
  colorBackgroundOverlay: { light: 'rgba(28, 34, 48, 0.4)', dark: 'rgba(5, 16, 28, 0.7)' },
  colorTextBody: { light: '{colorInk}', dark: '{colorChalk}' },
  colorTextSecondary: { light: '{colorGraphite}', dark: '{colorMist}' },
  colorTextDisabled: { light: '{colorGraphite}', dark: '{colorMist}' },
  colorTextError: { light: '{colorRed}', dark: '{colorCoral}' },
  colorTextButtonPrimary: { light: '{colorPaper}', dark: '{colorNight}' },
  colorBorderControl: { light: '{colorInk}', dark: '{colorChalk}' },
  colorBorderDivider: { light: '{colorRule}', dark: '{colorSteel}' },
  colorBorderDisabled: { light: '{colorGraphite}', dark: '{colorSteel}' },
  colorBorderError: { light: '{colorRed}', dark: '{colorCoral}' },
  colorBorderFocusRing: { light: '{colorBlue}', dark: '{colorCyan}' },
  colorHatch: { light: 'rgba(28, 34, 48, 0.25)', dark: 'rgba(232, 238, 245, 0.3)' },
};
