// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';

import Button from '@ordinate/components/button';
import Icon, { IconProps } from '@ordinate/components/icon';
import { deprecatedIconNames } from '@ordinate/components/icon/deprecated-names';
import icons from '@ordinate/components/icon/generated/icons';
import LiveRegion from '@ordinate/components/live-region';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';
import StatusIndicator from '@ordinate/components/status-indicator';
import TextFilter from '@ordinate/components/text-filter';

import { href } from '../../app/router';
import { CodeBlock, DocSection, Notes, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';
import { Figure, Split } from './shared/figure';

import styles from './icons.module.scss';

type IconName = keyof typeof icons;

const names = Object.keys(icons).sort() as IconName[];

// The old name of each renamed icon, so searching for `search` finds `find`.
const oldNames = new Map<string, string[]>();
for (const [old, current] of Object.entries(deprecatedIconNames)) {
  oldNames.set(current, [...(oldNames.get(current) ?? []), old]);
}

const sizes: { size: IconProps.Size; token: string; px: number }[] = [
  { size: 'small', token: 'size-icon-small', px: 12 },
  { size: 'normal', token: 'size-icon', px: 16 },
  { size: 'medium', token: 'size-icon-medium', px: 20 },
  { size: 'big', token: 'size-icon-big', px: 32 },
  { size: 'large', token: 'size-icon-large', px: 48 },
];

const variants: { variant: IconProps.Variant; use: string }[] = [
  { variant: 'normal', use: 'Follows the text color' },
  { variant: 'subtle', use: 'Secondary, help' },
  { variant: 'disabled', use: 'Unavailable' },
  { variant: 'link', use: 'Inside a link' },
  { variant: 'info', use: 'Note' },
  { variant: 'success', use: 'Complete' },
  { variant: 'warning', use: 'Caution' },
  { variant: 'error', use: 'Fault' },
];

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function Gallery() {
  const [filter, setFilter] = useState('');
  const [size, setSize] = useState<IconProps.Size>('medium');
  const [copied, setCopied] = useState<{ name: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = window.setTimeout(() => setCopied(null), 1800);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const query = filter.trim().toLowerCase();
  const shown = useMemo(
    () =>
      names.filter(
        name => !query || name.includes(query) || (oldNames.get(name) ?? []).some(old => old.includes(query))
      ),
    [query]
  );

  return (
    <SpaceBetween size="l">
      <div className={styles.toolbar}>
        <TextFilter
          filteringText={filter}
          onChange={event => setFilter(event.detail.filteringText)}
          filteringPlaceholder="Find an icon, by its name or an old name"
          filteringAriaLabel="Find an icon"
          countText={query ? `${shown.length} of ${names.length}` : undefined}
        />
        <SegmentedControl
          label="Size"
          selectedId={size}
          onChange={event => setSize(event.detail.selectedId as IconProps.Size)}
          options={[
            { id: 'normal', text: '16' },
            { id: 'medium', text: '20' },
            { id: 'big', text: '32' },
          ]}
        />
      </div>
      <p className={styles.readout}>
        {copied ? (
          copied.ok ? (
            <>
              Copied <span className={styles['readout-name']}>{copied.name}</span>
            </>
          ) : (
            <>The browser did not allow copying. The name is {copied.name}.</>
          )
        ) : (
          <>{shown.length} icons. Click one to copy its name.</>
        )}
      </p>
      <LiveRegion hidden={true}>
        {copied ? (copied.ok ? `Copied ${copied.name}` : `Could not copy ${copied.name}`) : ''}
      </LiveRegion>
      {shown.length ? (
        <ul className={styles.gallery} aria-label="Icons">
          {shown.map(name => {
            const old = oldNames.get(name);
            const isCopied = copied?.name === name && copied.ok;
            return (
              <li key={name} className={styles.cell}>
                <button
                  type="button"
                  className={clsx(styles.button, isCopied && styles.copied)}
                  onClick={async () => setCopied({ name, ok: await copyText(name) })}
                  aria-label={`Copy the icon name ${name}`}
                >
                  {isCopied && <span className={styles.stamp}>Copied</span>}
                  <span className={styles.hint} aria-hidden="true">
                    <Icon name="copy" size="small" />
                  </span>
                  <Icon name={name} size={size} />
                  <span className={styles.name}>{name}</span>
                  {old && <span className={styles.old}>was {old.join(', ')}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <SpaceBetween size="s" alignItems="center">
          <p className={styles.empty}>No icon is called &quot;{filter}&quot;.</p>
          <Button onClick={() => setFilter('')}>Clear the filter</Button>
        </SpaceBetween>
      )}
    </SpaceBetween>
  );
}

function Page() {
  return (
    <>
      <Prose>
        <p>
          Ordinate has {names.length} built-in icons, drawn as open strokes on a 16 by 16 grid. Each one takes the color
          of the text around it and keeps the same line weight at every size, so an icon sits in a sentence like a word.
          Icons are named for what they mean in Ordinate, in plain English.
        </p>
      </Prose>

      <DocSection id="gallery" number={1} title="Every icon">
        <Gallery />
      </DocSection>

      <DocSection id="usage" number={2} title="Using an icon">
        <CodeBlock
          label="An icon beside a word"
          code={`
import Icon from '@ordinate/components/icon';

<Icon name="locked" /> Private
`}
        />
        <Notes
          items={[
            <>
              An icon without <code>ariaLabel</code> is decorative and hidden from screen readers. Give it a label only
              when nothing else says what it means.
            </>,
            <>
              Buttons take an icon by name, with <code>iconName</code>. An <code>icon</code> button has no text, so it
              needs an <code>ariaLabel</code>. See <a href={href('/components/button')}>Button</a>.
            </>,
            <>
              Directional icons such as <code>arrow-right</code> and <code>chevron-right</code> turn round in
              right-to-left pages.
            </>,
          ]}
        />
      </DocSection>

      <DocSection id="grid" number={3} title="The grid and the stroke">
        <Split
          text={
            <>
              <p>
                Icons are drawn on a 16 by 16 grid with a 1.5 px stroke, <code>border-width-icon</code>, rounded at the
                ends and corners. The stroke does not scale with the icon, so a 48 px icon is drawn with the same pen as
                a 12 px one, as lines on a drawing are.
              </p>
              <p>
                Solid parts, such as the dot of <code>caution</code>, are filled; everything else is outline. Solid
                variants of whole icons end in <code>-solid</code>.
              </p>
            </>
          }
        >
          <Figure code="16 × 16" caption="Enlarged twelve times over the grid it is drawn on.">
            <div className={styles['grid16-row']}>
              {(['caution', 'locked'] as const).map(name => (
                <div key={name} className={styles.grid16}>
                  <Icon name={name} size="inherit" />
                </div>
              ))}
            </div>
          </Figure>
        </Split>
      </DocSection>

      <DocSection id="sizes" number={4} title="Sizes">
        <Figure code="size" caption="Each size is a token; inherit follows the font size of the text around it.">
          <div className={styles.sizes}>
            {sizes.map(({ size, token, px }) => (
              <div key={size} className={styles.size}>
                <Icon name="adjust" size={size} />
                <span className={styles['size-label']}>
                  <strong>{size}</strong>
                  {px} px · {token}
                </span>
              </div>
            ))}
          </div>
        </Figure>
      </DocSection>

      <DocSection id="variants" number={5} title="Variants">
        <Prose>
          <p>
            An icon follows the text color unless a <code>variant</code> says otherwise. The status variants color the
            mark only, as StatusIndicator does; keep the words next to them in ink, and use the icon named for the state
            so its shape tells the states apart without color.
          </p>
        </Prose>
        <Figure code="variant">
          <ul className={styles.variants}>
            {variants.map(({ variant, use }) => (
              <li key={variant} className={styles.variant}>
                <Icon
                  name={variant === 'normal' || variant === 'subtle' ? 'note' : statusIcon(variant)}
                  size="big"
                  variant={variant}
                />
                <span className={styles.name}>{variant}</span>
                <span className={styles.old}>{use}</span>
              </li>
            ))}
          </ul>
        </Figure>
        <Figure caption="The status icons at work in StatusIndicator, with their words in ink.">
          <SpaceBetween direction="horizontal" size="l">
            <StatusIndicator state="complete">Complete</StatusIndicator>
            <StatusIndicator state="underway">Underway</StatusIndicator>
            <StatusIndicator state="waiting">Waiting</StatusIndicator>
            <StatusIndicator state="queued">Queued</StatusIndicator>
            <StatusIndicator state="halted">Halted</StatusIndicator>
            <StatusIndicator state="caution">Caution</StatusIndicator>
            <StatusIndicator state="fault">Fault</StatusIndicator>
          </SpaceBetween>
        </Figure>
      </DocSection>

      <DocSection id="your-own" number={6} title="Your own icons">
        <Prose>
          <p>
            Pass an SVG drawn on the same 16 by 16 grid to <code>svg</code>, with{' '}
            <code>stroke=&quot;currentColor&quot;</code> and no fill, and Icon draws it with the same pen. To replace a
            built-in icon across an application, use <a href={href('/components/icon-provider')}>IconProvider</a>.
          </p>
        </Prose>
        <CodeBlock
          label="A custom icon"
          code={`
<Icon
  ariaLabel="Survey point"
  svg={
    <svg viewBox="0 0 16 16" stroke="currentColor" fill="none">
      <circle cx="8" cy="8" r="5" />
      <path d="M8 1v14M1 8h14" />
    </svg>
  }
/>
`}
        />
      </DocSection>
    </>
  );
}

function statusIcon(variant: IconProps.Variant): IconProps.Name {
  switch (variant) {
    case 'success':
      return 'complete';
    case 'warning':
      return 'caution';
    case 'error':
      return 'fault';
    case 'disabled':
      return 'locked';
    case 'link':
      return 'open-outside';
    default:
      return 'note';
  }
}

const doc: GuideDoc = {
  slug: 'icons',
  title: 'Icons',
  summary: 'Every built-in icon, with a filter and click-to-copy names, and the sizes and variants they come in.',
  order: 8,
  keywords: ['icon', 'iconName', 'svg', 'icon names', 'icon gallery', 'IconProvider'],
  Page,
};

export default doc;
