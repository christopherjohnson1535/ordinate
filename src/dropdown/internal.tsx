// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Dropdown } from '../internal/components/dropdown';
import { fireNonCancelableEvent } from '../internal/events';
import { DropdownProps } from './interfaces';

import styles from './styles.css.js';

export function InternalDropdown({
  open,
  trigger,
  content,
  header,
  footer,
  onOutsideClick,
  onEscape,
  minWidth = 'trigger',
  maxWidth = 'none',
  ariaRole,
  ariaLabel,
  ariaLabelledby,
  ...rest
}: DropdownProps) {
  return (
    <div
      {...rest}
      className={styles.root}
      onKeyDown={event => {
        if (open && event.key === 'Escape') {
          // Closes only the dropdown, not a modal around it.
          event.preventDefault();
          event.stopPropagation();
          fireNonCancelableEvent(onEscape, null);
        }
      }}
    >
      <Dropdown
        open={open}
        trigger={trigger}
        header={header}
        footer={footer}
        onOutsideClick={() => fireNonCancelableEvent(onOutsideClick, null)}
        minWidth={minWidth}
        maxWidth={maxWidth}
        ariaRole={ariaRole}
        ariaLabel={ariaLabel}
        ariaLabelledby={ariaLabelledby}
      >
        {content}
      </Dropdown>
    </div>
  );
}
