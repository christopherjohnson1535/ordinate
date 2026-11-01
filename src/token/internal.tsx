// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import { fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { InternalTruncatedText } from '../truncated-text/internal';
import { TokenProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalTokenProps extends TokenProps {
  /**
   * Lets a token list move focus between dismiss buttons. Not part of the public API.
   */
  dismissButtonRef?: React.Ref<ButtonProps.Ref>;
  /**
   * Language of the label, when it differs from the page. Not part of the public API.
   */
  lang?: string;
  /**
   * Lets other components position the token. Not part of the public API.
   */
  className?: string;
}

export function InternalToken({
  label,
  labelTag,
  description,
  tags,
  icon,
  variant = 'normal',
  disabled = false,
  readOnly = false,
  onDismiss,
  dismissLabel,
  tooltipContent,
  dismissButtonRef,
  lang,
  className,
  ...rest
}: InternalTokenProps) {
  const i18n = useInternalI18n('token');
  const inline = variant === 'inline';
  const dismissible = Boolean(onDismiss) && !disabled && !readOnly;
  // An inline token sits in running text, where a block element would end the paragraph.
  const Root = inline ? 'span' : 'div';

  return (
    <Root
      {...rest}
      className={clsx(
        styles.root,
        styles[`variant-${variant}`],
        disabled && styles.disabled,
        readOnly && styles['read-only'],
        className
      )}
    >
      <span className={styles.content}>
        <span className={styles.main}>
          {icon && <span className={styles.icon}>{icon}</span>}
          {inline ? (
            <InternalTruncatedText className={styles.label} lang={lang} tooltipContent={tooltipContent}>
              {label}
            </InternalTruncatedText>
          ) : (
            <span className={styles.label} lang={lang}>
              {label}
            </span>
          )}
          {!inline && labelTag && <span className={styles['label-tag']}>{labelTag}</span>}
        </span>
        {!inline && description && <span className={styles.description}>{description}</span>}
        {!inline && tags && tags.length > 0 && (
          <span className={styles.tags}>
            {tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </span>
        )}
      </span>
      {dismissible && (
        <InternalButton
          ref={dismissButtonRef}
          className={styles['dismiss-button']}
          variant="icon"
          iconName="close"
          formAction="none"
          ariaLabel={i18n('dismissLabel', dismissLabel)}
          onClick={() => fireNonCancelableEvent(onDismiss, null)}
        />
      )}
    </Root>
  );
}
