// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { FilteringInputStatus } from './filtering-input';
import { PropertyFilterStrings } from './i18n';
import { PropertyFilterProps } from './interfaces';

/**
 * What the filters and their editor need from the property filter's props, gathered in one place.
 */
export interface FilterSettings {
  properties: ReadonlyArray<PropertyFilterProps.FilteringProperty>;
  options: ReadonlyArray<PropertyFilterProps.FilteringOption>;
  strings: PropertyFilterStrings;
  status: FilteringInputStatus;
  asyncProperties: boolean;
  disableFreeTextFiltering: boolean;
  disabled: boolean;
  expandToViewport: boolean;
  onLoadItems(detail: PropertyFilterProps.LoadItemsDetail): void;
}
