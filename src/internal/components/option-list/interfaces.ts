// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { IconProps } from '../../../icon/interfaces';

/**
 * One option of a select, multiselect or autosuggest. The public props of those
 * components extend these types, so their option shapes stay the same.
 */
export interface OptionDefinition {
  value?: string;
  label?: string;
  description?: string;
  labelTag?: string;
  tags?: ReadonlyArray<string>;
  filteringTags?: ReadonlyArray<string>;
  disabled?: boolean;
  iconName?: IconProps.Name;
  iconAriaLabel?: string;
  lang?: string;
}

export interface OptionGroupDefinition extends OptionDefinition {
  options: ReadonlyArray<OptionDefinition>;
}

export type OptionsDefinition = ReadonlyArray<OptionDefinition | OptionGroupDefinition>;

export type FilteringType = 'none' | 'auto' | 'manual';

export type StatusType = 'pending' | 'loading' | 'finished' | 'error';

export interface LoadItemsDetail {
  filteringText: string;
  firstPage: boolean;
  samePage: boolean;
}
