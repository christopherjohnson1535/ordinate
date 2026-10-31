// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { InternalIcon } from '../icon/internal';
import { fireCancelableEvent, fireNonCancelableEvent } from '../internal/events';
import { useInternalI18n } from '../internal/i18n/context';
import { warnOnce } from '../internal/logging';
import { LinkProps } from './interfaces';

import styles from './styles.css.js';

export interface InternalLinkProps extends LinkProps {
  /**
   * Lets other components position the link. Not part of the public API.
   */
  className?: string;
}

function isPlainLeftClick(event: React.MouseEvent) {
  return event.button === 0 && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey;
}

function fontSizeClass(variant: LinkProps.Variant, fontSize: LinkProps.FontSize) {
  if (variant === 'info') {
    return 'font-size-body-s';
  }
  if (variant === 'value-large') {
    return 'font-size-display-l';
  }
  return `font-size-${fontSize}`;
}

export const InternalLink = React.forwardRef(
  (
    {
      children,
      variant = 'secondary',
      href,
      external = false,
      externalIconAriaLabel,
      target,
      rel,
      fontSize = 'body-m',
      color = 'normal',
      ariaLabel,
      onFollow,
      onClick,
      className,
      ...rest
    }: InternalLinkProps,
    ref: React.Ref<LinkProps.Ref>
  ) => {
    const i18n = useInternalI18n('link');
    const linkRef = useRef<HTMLAnchorElement>(null);
    useImperativeHandle(ref, () => ({ focus: () => linkRef.current?.focus() }));

    if (href && /^\s*javascript:/i.test(href)) {
      warnOnce('Link', 'Use `onFollow` instead of a `javascript:` URL in `href`.');
    }

    const isButton = href === undefined;
    const anchorTarget = target ?? (external ? '_blank' : undefined);
    const anchorRel = rel ?? (anchorTarget === '_blank' ? 'noopener noreferrer' : undefined);

    const follow = (event: React.SyntheticEvent) =>
      fireCancelableEvent(onFollow, { href, external, target: anchorTarget }, event);

    const click = (event: React.MouseEvent | React.KeyboardEvent) => {
      const { ctrlKey, shiftKey, altKey, metaKey } = event;
      const button = 'button' in event ? event.button : 0;
      fireNonCancelableEvent(onClick, { button, ctrlKey, shiftKey, altKey, metaKey });
    };

    const classNames = clsx(
      styles.link,
      styles[`variant-${variant}`],
      styles[fontSizeClass(variant, fontSize)],
      styles[`color-${variant === 'info' ? 'normal' : color}`],
      className
    );

    const content = (
      <>
        {children}
        {external && (
          <>
            {' '}
            <InternalIcon
              className={styles['external-icon']}
              name="external"
              size="inherit"
              ariaLabel={i18n('externalIconAriaLabel', externalIconAriaLabel)}
            />
          </>
        )}
      </>
    );

    if (isButton) {
      return (
        <a
          {...rest}
          ref={linkRef}
          className={classNames}
          role="button"
          tabIndex={0}
          aria-label={ariaLabel}
          onClick={event => {
            follow(event);
            click(event);
          }}
          onKeyDown={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              follow(event);
              click(event);
            }
          }}
        >
          {content}
        </a>
      );
    }

    return (
      <a
        {...rest}
        ref={linkRef}
        className={classNames}
        href={href}
        target={anchorTarget}
        rel={anchorRel}
        aria-label={ariaLabel}
        onClick={event => {
          if (isPlainLeftClick(event)) {
            follow(event);
          }
          click(event);
        }}
      >
        {content}
      </a>
    );
  }
);
