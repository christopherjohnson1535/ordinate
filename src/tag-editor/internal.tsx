// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { InternalAttributeEditor } from '../attribute-editor/internal';
import { InternalIcon } from '../icon/internal';
import { LoadingStatus } from '../internal/components/loading-status';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { TagEditorProps } from './interfaces';
import { SuggestedInput } from './suggested-input';
import {
  countActiveTags,
  defaultAllowedCharacterPattern,
  isValid,
  KeyError,
  maxKeyLength,
  maxValueLength,
  validateTags,
  ValueError,
} from './validation';

import styles from './styles.css.js';

type Tag = TagEditorProps.Tag;

// Row positions after removing the row at `removed`, so a blurred field stays marked on its own row.
function shiftAfterRemoval(indexes: ReadonlySet<number>, removed: number): Set<number> {
  return new Set(
    Array.from(indexes)
      .filter(index => index !== removed)
      .map(index => (index > removed ? index - 1 : index))
  );
}

export function InternalTagEditor({
  tags = [],
  onChange,
  keysRequest,
  valuesRequest,
  allowedCharacterPattern = defaultAllowedCharacterPattern,
  tagLimit = 50,
  loading = false,
  i18nStrings: strings,
  ...rest
}: TagEditorProps) {
  const i18n = useInternalI18n('tag-editor');
  // An empty key is only an error once the user has left the field or typed a value.
  const [blurredKeys, setBlurredKeys] = useState<ReadonlySet<number>>(new Set());

  if (loading) {
    return (
      <div {...rest} className={styles.root}>
        <LoadingStatus text={i18n('loading', strings?.loading)} />
      </div>
    );
  }

  const errors = validateTags(tags, allowedCharacterPattern);
  const activeCount = countActiveTags(tags);

  const change = (next: Tag[]) =>
    fireNonCancelableEvent(onChange, { tags: next, valid: isValid(next, allowedCharacterPattern, tagLimit) });

  const updateTag = (index: number, update: Partial<Tag>) =>
    change(tags.map((tag, i) => (i === index ? { ...tag, ...update } : tag)));

  const removeTag = (index: number) => {
    const tag = tags[index];
    if (tag.existing) {
      updateTag(index, { markedForRemoval: !tag.markedForRemoval });
      return;
    }
    setBlurredKeys(shiftAfterRemoval(blurredKeys, index));
    change(tags.filter((_, i) => i !== index));
  };

  const keyErrorText: Record<KeyError, string | undefined> = {
    empty: i18n('emptyKeyError', strings?.emptyKeyError),
    duplicate: i18n('duplicateKeyError', strings?.duplicateKeyError),
    invalid: i18n('invalidKeyError', strings?.invalidKeyError),
    tooLong: i18n('maxKeyCharLengthError', strings?.maxKeyCharLengthError, { maxLength: maxKeyLength }),
  };
  const valueErrorText: Record<ValueError, string | undefined> = {
    invalid: i18n('invalidValueError', strings?.invalidValueError),
    tooLong: i18n('maxValueCharLengthError', strings?.maxValueCharLengthError, { maxLength: maxValueLength }),
  };

  const showKeyError = (tag: Tag, index: number) => {
    const error = errors[index].key;
    if (error === 'empty' && tag.value === '' && !blurredKeys.has(index)) {
      return undefined;
    }
    return error && keyErrorText[error];
  };

  const enteredKeyLabel = (key: string) =>
    strings?.enteredKeyLabel?.(key) ?? i18n('enteredKeyLabel', undefined, { key }) ?? key;
  const enteredValueLabel = (value: string) =>
    strings?.enteredValueLabel?.(value) ?? i18n('enteredValueLabel', undefined, { value }) ?? value;

  const buttonAriaLabel = (tag: Tag) => {
    // Without a key, the visible button text is the better name.
    if (tag.key === '') {
      return undefined;
    }
    return tag.markedForRemoval
      ? (strings?.undoButtonAriaLabel?.(tag) ?? i18n('undoButtonAriaLabel', undefined, { key: tag.key }))
      : (strings?.removeButtonAriaLabel?.(tag) ?? i18n('removeButtonAriaLabel', undefined, { key: tag.key }));
  };

  const limitInfo = () => {
    if (activeCount > tagLimit) {
      const excessTags = activeCount - tagLimit;
      return (
        <span className={styles['limit-exceeded']}>
          <InternalIcon className={styles['limit-icon']} name="fault" size="small" />
          <span>
            {strings?.tagLimitExceeded?.(tagLimit, excessTags) ??
              i18n('tagLimitExceeded', undefined, { tagLimit, excessTags })}
          </span>
        </span>
      );
    }
    if (activeCount === tagLimit) {
      return strings?.tagLimitReached?.(tagLimit) ?? i18n('tagLimitReached', undefined, { tagLimit });
    }
    const availableTags = tagLimit - activeCount;
    return strings?.tagLimit?.(availableTags, tagLimit) ?? i18n('tagLimit', undefined, { availableTags, tagLimit });
  };

  const valueLabel = (
    <>
      {i18n('valueHeader', strings?.valueHeader)}{' '}
      <span className={styles.optional}>({i18n('optional', strings?.optional)})</span>
    </>
  );

  return (
    <div {...rest} className={styles.root}>
      <InternalAttributeEditor<Tag>
        items={tags}
        definition={[
          {
            label: i18n('keyHeader', strings?.keyHeader),
            control: (tag, index) => (
              <SuggestedInput
                value={tag.key}
                onChange={key => updateTag(index, { key })}
                onBlur={() => setBlurredKeys(new Set(blurredKeys).add(index))}
                request={keysRequest}
                placeholder={i18n('keyPlaceholder', strings?.keyPlaceholder)}
                readOnly={tag.existing}
                enteredTextLabel={enteredKeyLabel}
                loadingText={i18n('keysSuggestionLoading', strings?.keysSuggestionLoading)}
                errorText={i18n('keysSuggestionError', strings?.keysSuggestionError)}
                recoveryText={i18n('retryText', strings?.retryText)}
              />
            ),
            errorText: showKeyError,
          },
          {
            label: valueLabel,
            control: (tag, index) =>
              tag.markedForRemoval ? (
                <div className={styles['undo-prompt']}>{i18n('undoPrompt', strings?.undoPrompt)}</div>
              ) : (
                <SuggestedInput
                  value={tag.value}
                  onChange={value => updateTag(index, { value })}
                  request={valuesRequest && (value => valuesRequest(tag.key, value))}
                  placeholder={i18n('valuePlaceholder', strings?.valuePlaceholder)}
                  enteredTextLabel={enteredValueLabel}
                  loadingText={i18n('valuesSuggestionLoading', strings?.valuesSuggestionLoading)}
                  errorText={i18n('valuesSuggestionError', strings?.valuesSuggestionError)}
                  recoveryText={i18n('retryText', strings?.retryText)}
                />
              ),
            errorText: (_, index) => {
              const error = errors[index].value;
              return error && valueErrorText[error];
            },
          },
        ]}
        onAddButtonClick={() => change([...tags, { key: '', value: '', existing: false }])}
        onRemoveButtonClick={event => removeTag(event.detail.itemIndex)}
        addButtonText={i18n('addButton', strings?.addButton)}
        removeButtonText={i18n('removeButton', strings?.removeButton)}
        getRemoveButtonText={tag => (tag.markedForRemoval ? i18n('undoButton', strings?.undoButton) : undefined)}
        removeButtonAriaLabel={buttonAriaLabel}
        disableAddButton={activeCount >= tagLimit}
        additionalInfo={limitInfo()}
        empty={i18n('emptyTags', strings?.emptyTags)}
        i18nStrings={{ itemRemovedAriaLive: i18n('itemRemovedAriaLive', strings?.itemRemovedAriaLive) }}
      />
    </div>
  );
}
