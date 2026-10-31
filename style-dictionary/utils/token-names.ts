// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export const colorPaletteTokenNames = [
  'colorInk',
  'colorInkRaised',
  'colorGraphite',
  'colorRule',
  'colorPaper',
  'colorPlate',
  'colorBlue',
  'colorRed',
  'colorNight',
  'colorNightSheet',
  'colorChalk',
  'colorMist',
  'colorSteel',
  'colorCyan',
  'colorCoral',
] as const;

export const colorsTokenNames = [
  'colorBackgroundLayoutMain',
  'colorBackgroundContainer',
  'colorBackgroundControl',
  'colorBackgroundControlReadOnly',
  'colorBackgroundButtonNormal',
  'colorBackgroundButtonNormalHover',
  'colorBackgroundButtonPrimary',
  'colorBackgroundButtonPrimaryHover',
  'colorBackgroundOverlay',
  'colorTextBody',
  'colorTextSecondary',
  'colorTextDisabled',
  'colorTextError',
  'colorTextButtonPrimary',
  'colorBorderControl',
  'colorBorderDivider',
  'colorBorderDisabled',
  'colorBorderError',
  'colorBorderFocusRing',
  'colorHatch',
] as const;

export const bordersTokenNames = [
  'borderWidthDefault',
  'borderWidthControl',
  'borderWidthSection',
  'borderWidthFocusRing',
  'borderFocusRingOffset',
  'borderRadiusButton',
  'borderRadiusInput',
  'borderRadiusContainer',
  'borderRadiusModal',
] as const;

export const typographyTokenNames = [
  'fontFamilyBase',
  'fontFamilyDisplay',
  'fontSizeBody',
  'fontSizeLabel',
  'fontSizeDescription',
  'fontSizeHeadingM',
  'fontWeightBody',
  'fontWeightLabel',
  'fontStretchLabel',
  'lineHeightBody',
  'lineHeightHeading',
] as const;

export const spacingTokenNames = [
  'spaceXxs',
  'spaceXs',
  'spaceS',
  'spaceM',
  'spaceL',
  'spaceXl',
  'spaceButtonHorizontal',
  'spaceInputHorizontal',
] as const;

export const sizesTokenNames = [
  'sizeControlHeight',
  'sizeIcon',
  'sizeModalSmall',
  'sizeModalMedium',
  'sizeModalLarge',
] as const;

export const motionTokenNames = [
  'motionDurationResponsive',
  'motionDurationExpressive',
  'motionEasingStandard',
] as const;

export type ColorPaletteTokenName = (typeof colorPaletteTokenNames)[number];
export type ColorsTokenName = (typeof colorsTokenNames)[number];
export type BordersTokenName = (typeof bordersTokenNames)[number];
export type TypographyTokenName = (typeof typographyTokenNames)[number];
export type SpacingTokenName = (typeof spacingTokenNames)[number];
export type SizesTokenName = (typeof sizesTokenNames)[number];
export type MotionTokenName = (typeof motionTokenNames)[number];

export const allTokenNames = [
  ...colorPaletteTokenNames,
  ...colorsTokenNames,
  ...bordersTokenNames,
  ...typographyTokenNames,
  ...spacingTokenNames,
  ...sizesTokenNames,
  ...motionTokenNames,
] as const;

export type TokenName = (typeof allTokenNames)[number];
