// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ColorPaletteDictionary } from '../utils/interfaces.js';

export const tokens: ColorPaletteDictionary = {
  colorWhite: '#FFFFFF',
  colorGrey50: '#F6F7F8',
  colorGrey100: '#F2F3F5',
  colorGrey150: '#ECEEF0',
  colorGrey175: '#E8EAED',
  colorGrey200: '#E4E6E9',
  colorGrey250: '#DCDFE3',
  colorGrey400: '#B8BDC3',
  colorGrey500: '#8A8D90',
  colorGrey600: '#5A5E63',
  colorGrey700: '#3D4043',
  colorGrey800: '#2B2E31',
  colorGrey900: '#131416',
  colorBlue100: '#E9EEF6',
  colorBlue600: '#1D4F91',
  colorRed600: '#C4242A',
  colorGreen600: '#2E6B3F',
  colorOchre600: '#8A5A00',
  colorChalk100: '#ECE6E2',
  colorChalk200: '#CFD3D8',
  colorChalk300: '#A6ADB5',
  colorChalk500: '#5B6168',
  colorChalk600: '#3A3E43',
  colorChalk700: '#26292D',
  colorChalk800: '#1E2023',
  colorChalk900: '#17181A',
  colorChalkMark: '#22303A',
  colorCyan400: '#58C4DD',
  colorRed400: '#E5566F',
  // Lighter red for text on dark read-only surfaces, where red 400 falls below 4.5:1.
  colorRed300: '#F07F92',
  colorGreen400: '#8FD4A8',
  colorOchre400: '#E3B55B',
  colorTerminal: '#17181A',
  colorTerminalDark: '#0F1011',
  // Site styles: the shopfront style's cobalt and sunflower.
  colorCobalt600: '#1A35C4',
  colorCobalt700: '#132894',
  colorCobalt300: '#8FA2FF',
  colorSunflower400: '#F5C542',
  colorSunflower100: '#FDF1C6',
  // Section kinds: teal for resources and plum for policy, beside the drafting blue for configuration.
  // None of them is a status hue, so a section is never read as healthy, late or failed.
  colorTeal600: '#176B73',
  colorTeal400: '#6FCFD6',
  colorPlum600: '#7A3E6E',
  colorPlum400: '#D69BC8',
};
