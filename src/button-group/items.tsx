// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import { InternalButton } from '../button/internal';
import { InternalButtonDropdown } from '../button-dropdown/internal';
import { FeedbackPanel, useFeedback } from '../internal/components/feedback-panel';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { InternalToggleButton } from '../toggle-button/internal';
import { InternalTooltip } from '../tooltip/internal';
import { ButtonGroupProps } from './interfaces';

import styles from './styles.css.js';

/**
 * Marks the element around each action's focusable control. Its value is the action's `id`.
 */
export const itemAttribute = 'data-toolbar-item';

interface ItemProps<T extends ButtonGroupProps.Item> {
  item: T;
  /**
   * 0 for the action holding the toolbar's single tab stop, -1 for the others.
   */
  tabIndex: number;
  onItemClick?: NonCancelableEventHandler<ButtonGroupProps.ItemClickDetails>;
  onItemFocus: (id: string) => void;
}

interface ControlProps {
  id: string;
  text: string;
  suppressTooltip?: boolean;
  onItemFocus: (id: string) => void;
  children: React.ReactNode;
}

// Wraps exactly one focusable control, so the toolbar can find it, and labels it with a tooltip.
function Control({ id, text, suppressTooltip = false, onItemFocus, children }: ControlProps) {
  const attributes = { [itemAttribute]: id };
  return (
    <span {...attributes} className={styles.control} onFocus={() => onItemFocus(id)}>
      <InternalTooltip content={text} describesTrigger={false} suppressed={suppressTooltip}>
        {children}
      </InternalTooltip>
    </span>
  );
}

export function ActionItem({
  item,
  tabIndex,
  onItemClick,
  onItemFocus,
}: ItemProps<ButtonGroupProps.IconButton | ButtonGroupProps.IconToggleButton>) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const { feedback, show, dismissHandlers } = useFeedback();

  const activate = (detail: ButtonGroupProps.ItemClickDetails) => {
    fireNonCancelableEvent(onItemClick, detail);
    if (item.popoverFeedback !== undefined && item.popoverFeedback !== null) {
      show(item.popoverFeedback);
    }
  };

  const shared = {
    className: styles.button,
    variant: 'icon',
    disabled: item.disabled,
    loading: item.loading,
    loadingText: item.loadingText,
    ariaLabel: item.text,
    tabIndex,
  } as const;

  const control =
    item.type === 'icon-toggle-button' ? (
      <InternalToggleButton
        {...shared}
        pressed={item.pressed}
        iconName={item.iconName}
        pressedIconName={item.pressedIconName}
        onChange={event => activate({ id: item.id, pressed: event.detail.pressed })}
      />
    ) : (
      <InternalButton
        {...shared}
        formAction="none"
        iconName={item.iconName}
        iconSvg={item.iconSvg}
        onClick={() => activate({ id: item.id })}
      />
    );

  return (
    <span ref={triggerRef} className={styles.item} {...dismissHandlers}>
      <Control id={item.id} text={item.text} suppressTooltip={feedback !== null} onItemFocus={onItemFocus}>
        {control}
      </Control>
      {feedback && (
        <FeedbackPanel key={feedback.key} trigger={triggerRef}>
          {feedback.content}
        </FeedbackPanel>
      )}
    </span>
  );
}

export function MenuItem({ item, tabIndex, onItemClick, onItemFocus }: ItemProps<ButtonGroupProps.MenuDropdown>) {
  return (
    <InternalButtonDropdown
      className={styles.item}
      triggerClassName={styles.button}
      variant="icon"
      triggerIconName={item.iconName}
      triggerTabIndex={tabIndex}
      items={item.items}
      disabled={item.disabled}
      loading={item.loading}
      loadingText={item.loadingText}
      ariaLabel={item.text}
      onItemClick={event => {
        const { id, checked } = event.detail;
        fireNonCancelableEvent(onItemClick, checked === undefined ? { id } : { id, checked });
      }}
      wrapTrigger={trigger => (
        <Control id={item.id} text={item.text} onItemFocus={onItemFocus}>
          {trigger}
        </Control>
      )}
    />
  );
}
