// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useId, useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';

import { InternalButton } from '../button/internal';
import { InputProps } from '../input/interfaces';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalLiveRegion } from '../live-region/internal';
import { FilterSettings } from './filter-settings';
import { FilteringInput, FilteringInputStatus } from './filtering-input';
import { usePropertyFilterStrings } from './i18n';
import { PropertyFilterProps } from './interfaces';
import { getSuggestions } from './suggestions';
import { FilterToken, FilterTokenRef } from './token';
import { createToken, parseText } from './utils';

import styles from './styles.css.js';

type Token = PropertyFilterProps.Token;

export const InternalPropertyFilter = React.forwardRef(
  (
    {
      query,
      onChange,
      filteringProperties,
      filteringOptions = [],
      filteringPlaceholder,
      filteringAriaLabel,
      countText,
      disableFreeTextFiltering = false,
      hideOperations = false,
      tokenLimit,
      disabled = false,
      expandToViewport = false,
      asyncProperties = false,
      onLoadItems,
      filteringStatusType = 'finished',
      filteringLoadingText,
      filteringFinishedText,
      filteringErrorText,
      filteringRecoveryText,
      filteringEmpty,
      customControl,
      customFilterActions,
      i18nStrings,
      ...rest
    }: PropertyFilterProps,
    ref: React.Ref<PropertyFilterProps.Ref>
  ) => {
    const strings = usePropertyFilterStrings(i18nStrings, { filteringAriaLabel, filteringPlaceholder });
    const inputRef = useRef<InputProps.Ref>(null);
    useImperativeHandle(ref, () => ({ focus: () => inputRef.current?.focus() }));

    const tokensId = useId();
    const [text, setText] = useState('');
    const [showAllTokens, setShowAllTokens] = useState(false);
    const tokenRefs = useRef<(FilterTokenRef | null)[]>([]);
    const tokensRef = useRef<HTMLDivElement>(null);
    const pendingFocus = useRef<number | null>(null);

    const { tokens, operation } = query;
    const hiddenCount = tokenLimit !== undefined && tokenLimit >= 0 ? Math.max(tokens.length - tokenLimit, 0) : 0;
    const visibleTokens = hiddenCount > 0 && !showAllTokens ? tokens.slice(0, tokenLimit) : tokens;

    // Keeps focus near a removed filter: on the next filter's remove button, or on the input when none is left.
    useEffect(() => {
      const index = pendingFocus.current;
      if (index === null) {
        return;
      }
      pendingFocus.current = null;
      if (visibleTokens.length === 0) {
        inputRef.current?.focus();
      } else {
        tokenRefs.current[Math.min(index, visibleTokens.length - 1)]?.focus();
      }
    });

    const status: FilteringInputStatus = {
      statusType: filteringStatusType,
      loadingText: filteringLoadingText,
      finishedText: filteringFinishedText,
      errorText: filteringErrorText,
      recoveryText: filteringRecoveryText,
      errorIconAriaLabel: strings.errorIconAriaLabel,
      empty: filteringEmpty,
    };

    const loadItems = (detail: PropertyFilterProps.LoadItemsDetail) => fireNonCancelableEvent(onLoadItems, detail);

    const loadItemsForText = (filteringText: string, page: { firstPage: boolean; samePage: boolean }) => {
      const parsed = parseText(filteringText, filteringProperties);
      if (parsed.step === 'property') {
        loadItems({
          filteringProperty: parsed.property,
          filteringOperator: parsed.operator,
          filteringText: parsed.value,
          ...page,
        });
      } else if (asyncProperties) {
        loadItems({ filteringText, ...page });
      }
    };

    const settings: FilterSettings = {
      properties: filteringProperties,
      options: filteringOptions,
      strings,
      status,
      asyncProperties,
      disableFreeTextFiltering,
      disabled,
      expandToViewport,
      onLoadItems: loadItems,
    };

    const parsed = parseText(text, filteringProperties);
    const suggestions = getSuggestions(parsed, filteringProperties, filteringOptions, strings);
    const typedToken = createToken(text, parsed, disableFreeTextFiltering);

    const changeQuery = (nextTokens: ReadonlyArray<Token>, nextOperation = operation) =>
      fireNonCancelableEvent(onChange, { tokens: nextTokens, operation: nextOperation });

    const changeText = (next: string) => {
      setText(next);
      loadItemsForText(next, { firstPage: true, samePage: false });
    };

    const addToken = (token: Token) => {
      changeQuery([...tokens, token]);
      setText('');
    };

    const removeToken = (index: number) => {
      // Only take focus back if it was on the filters, so a pointer user's focus is left where it was.
      if (tokensRef.current?.contains(document.activeElement)) {
        pendingFocus.current = index;
      }
      changeQuery(tokens.filter((_, position) => position !== index));
    };

    const clearFilters = () => {
      changeQuery([]);
      inputRef.current?.focus();
    };

    const showCount = Boolean(countText) && tokens.length > 0;
    const hasTokens = tokens.length > 0;

    // The filters read as one query line: "where status = running and image ^ web", then the input for the
    // next condition and the result count, all in the same field.
    return (
      <div {...rest} className={clsx(styles.root, disabled && styles.disabled)}>
        {customControl && <div className={styles['custom-control']}>{customControl}</div>}
        <div ref={tokensRef} className={styles.query}>
          {hasTokens && (
            <>
              <span className={styles['query-word']}>{strings.queryStartText}</span>
              <ul id={tokensId} className={styles['token-list']}>
                {visibleTokens.map((token, index) => (
                  <FilterToken
                    // Filters are identified by position: editing one must keep its popover trigger in place for focus.
                    key={index}
                    ref={element => {
                      tokenRefs.current[index] = element;
                    }}
                    token={token}
                    settings={settings}
                    operation={index > 0 ? operation : undefined}
                    operationChangeable={!hideOperations}
                    onOperationChange={next => changeQuery(tokens, next)}
                    onChange={next => changeQuery(tokens.map((entry, position) => (position === index ? next : entry)))}
                    onRemove={() => removeToken(index)}
                  />
                ))}
              </ul>
              {hiddenCount > 0 && (
                <InternalButton
                  className={styles['token-toggle']}
                  variant="link"
                  formAction="none"
                  ariaExpanded={showAllTokens}
                  ariaControls={tokensId}
                  onClick={() => setShowAllTokens(current => !current)}
                >
                  {showAllTokens ? strings.tokenLimitShowFewer : strings.tokenLimitShowMore(hiddenCount)}
                </InternalButton>
              )}
            </>
          )}
          <div className={styles.search}>
            <FilteringInput
              ref={inputRef}
              type={hasTokens ? 'text' : 'search'}
              value={text}
              onChange={changeText}
              options={suggestions.options}
              enteredTextLabel={typedToken ? strings.enteredTextLabel(text) : undefined}
              onChoose={option => {
                const action = suggestions.actions.get(option);
                if (action?.type === 'text') {
                  changeText(action.text);
                  return true;
                }
                if (action?.type === 'token') {
                  addToken(action.token);
                }
                return false;
              }}
              onSubmit={() => typedToken && addToken(typedToken)}
              onLoadItems={page => loadItemsForText(text, page)}
              status={status}
              placeholder={hasTokens ? strings.addConditionPlaceholder : strings.filteringPlaceholder}
              ariaLabel={strings.filteringAriaLabel}
              disabled={disabled}
              expandToViewport={expandToViewport}
            />
          </div>
          <InternalLiveRegion tagName="span" hidden={!showCount}>
            <span className={styles.count}>{showCount ? countText : ''}</span>
          </InternalLiveRegion>
        </div>
        {hasTokens && (
          <div className={styles.actions}>
            {customFilterActions ?? (
              <InternalButton
                className={styles['clear-button']}
                formAction="none"
                disabled={disabled}
                onClick={clearFilters}
              >
                {strings.clearFiltersText}
              </InternalButton>
            )}
          </div>
        )}
      </div>
    );
  }
);
