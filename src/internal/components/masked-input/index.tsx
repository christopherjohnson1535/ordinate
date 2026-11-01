// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import { InputProps } from '../../../input/interfaces';
import { InternalInput, InternalInputProps } from '../../../input/internal';
import { fireKeyboardEvent, fireNonCancelableEvent, NonCancelableEventHandler } from '../../events';
import { useBrowserLayoutEffect } from '../../hooks/use-browser-layout-effect';
import { deleteText, insertText, Mask, MaskEdit, normalizeText } from './mask';

export type { Mask, MaskSegment } from './mask';

export interface MaskedInputProps extends Omit<
  InternalInputProps,
  'type' | 'inputMode' | 'step' | 'onChange' | 'autoComplete'
> {
  mask: Mask;
  /**
   * Called with the masked text whenever an edit changes it.
   */
  onChange?: NonCancelableEventHandler<InputProps.ChangeDetail>;
}

function selectionOf(input: HTMLInputElement) {
  const end = input.value.length;
  return {
    value: input.value,
    selectionStart: input.selectionStart ?? end,
    selectionEnd: input.selectionEnd ?? end,
  };
}

/**
 * A text input for values made of fixed runs of digits, such as dates and times. It handles each
 * keystroke and paste itself: digits fill the segments, separators appear on their own, a digit
 * that could not start a segment is padded (4 for a month becomes 04), and impossible values are
 * refused as they are typed. Edits that bypass the keyboard, such as autofill, are brought back
 * into the mask.
 */
export const MaskedInput = React.forwardRef(
  (
    { mask, value, onChange, onKeyDown, readOnly, disabled, nativeInputAttributes, ...rest }: MaskedInputProps,
    ref: React.Ref<InputProps.Ref>
  ) => {
    // The input element is not exposed by the inner component, so it is captured from its events,
    // which always come before any caret has to be placed.
    const elementRef = useRef<HTMLInputElement | null>(null);
    const pendingCaret = useRef<number | null>(null);

    useBrowserLayoutEffect(() => {
      const element = elementRef.current;
      const caret = pendingCaret.current;
      pendingCaret.current = null;
      if (element && caret !== null && element.ownerDocument.activeElement === element) {
        element.setSelectionRange(caret, caret);
      }
    }, [value]);

    const apply = (element: HTMLInputElement, edit: MaskEdit) => {
      if (edit.value === value) {
        element.setSelectionRange(edit.caret, edit.caret);
        return;
      }
      pendingCaret.current = edit.caret;
      fireNonCancelableEvent(onChange, { value: edit.value });
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      elementRef.current = event.currentTarget;
      if (onKeyDown && fireKeyboardEvent(onKeyDown, event)) {
        return;
      }
      if (readOnly || event.ctrlKey || event.metaKey || event.altKey || event.nativeEvent.isComposing) {
        return;
      }
      const element = event.currentTarget;
      if (event.key === 'Backspace' || event.key === 'Delete') {
        event.preventDefault();
        apply(element, deleteText(mask, selectionOf(element), event.key === 'Backspace' ? 'backward' : 'forward'));
      } else if (event.key.length === 1) {
        event.preventDefault();
        apply(element, insertText(mask, selectionOf(element), event.key));
      }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
      elementRef.current = event.currentTarget;
      if (readOnly) {
        return;
      }
      event.preventDefault();
      apply(
        event.currentTarget,
        insertText(mask, selectionOf(event.currentTarget), event.clipboardData.getData('text'))
      );
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      elementRef.current = event.currentTarget;
      const next = normalizeText(mask, event.currentTarget.value);
      if (next !== value) {
        pendingCaret.current = next.length;
        fireNonCancelableEvent(onChange, { value: next });
      }
    };

    return (
      <InternalInput
        {...rest}
        ref={ref}
        value={value}
        readOnly={readOnly}
        disabled={disabled}
        inputMode="numeric"
        autoComplete={false}
        disableBrowserAutocorrect={true}
        spellcheck={false}
        nativeInputAttributes={{
          ...nativeInputAttributes,
          onKeyDown: handleKeyDown,
          onPaste: handlePaste,
          onChange: handleChange,
          onFocus: event => {
            elementRef.current = event.currentTarget;
            nativeInputAttributes?.onFocus?.(event);
            fireNonCancelableEvent(rest.onFocus, null);
          },
        }}
      />
    );
  }
);
