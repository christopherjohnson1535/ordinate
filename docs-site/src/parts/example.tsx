// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import CodeView from '@ordinate/components/code-view';
import CopyToClipboard from '@ordinate/components/copy-to-clipboard';
import ErrorBoundary from '@ordinate/components/error-boundary';
import SegmentedControl from '@ordinate/components/segmented-control';
import Skeleton from '@ordinate/components/skeleton';
import ToggleButton from '@ordinate/components/toggle-button';
import { applyMode, applyRevision, Mode, Revision } from '@ordinate/global-styles';

import { Direction, useIsDark, useSettings } from '../app/settings';
import { LoadedExample } from '../registry/types';

import styles from './example.module.scss';

/** Removes the license header, which every source file carries but no reader needs to copy. */
export function cleanSource(source: string): string {
  return source
    .replace(/^\/\/ Copyright .*\n/, '')
    .replace(/^\/\/ SPDX-License-Identifier: .*\n/, '')
    .replace(/^\s*\n/, '')
    .trimEnd();
}

type Shade = 'light' | 'dark';

const revisions = Object.values(Revision);

function useSource(example: LoadedExample) {
  const [source, setSource] = useState<string | null>(null);
  useEffect(() => {
    let current = true;
    example.loadSource().then(
      text => current && setSource(cleanSource(text)),
      () => current && setSource('')
    );
    return () => {
      current = false;
    };
  }, [example]);
  return source;
}

/** Loads the example's module and renders it, with construction lines standing in until it arrives. */
function ExampleRunner({ example }: { example: LoadedExample }) {
  const [loaded, setLoaded] = useState<{ example: LoadedExample; Component: React.ComponentType } | null>(null);
  const [failure, setFailure] = useState<Error | null>(null);
  useEffect(() => {
    let current = true;
    example.load().then(
      module => current && setLoaded({ example, Component: module.default }),
      error => current && setFailure(error instanceof Error ? error : new Error(String(error)))
    );
    return () => {
      current = false;
    };
  }, [example]);
  if (failure) {
    // Thrown during render so the error boundary around the preview reports it.
    throw failure;
  }
  if (!loaded || loaded.example !== example) {
    return <Skeleton variant="block" height="medium" loadingText={`Loading ${example.meta.title}`} />;
  }
  return <loaded.Component />;
}

/**
 * Applies the example's own mode and revision to its preview, so one example can be compared in
 * dark mode or a newer revision without changing the rest of the page.
 */
function useScopedDisplay(target: React.RefObject<HTMLDivElement | null>, shade: Shade, revision: Revision) {
  useEffect(() => {
    if (target.current) {
      applyMode(shade === 'dark' ? Mode.Dark : Mode.Light, target.current);
    }
  }, [target, shade]);
  useEffect(() => {
    if (target.current) {
      applyRevision(revision, target.current);
    }
  }, [target, revision]);
}

export interface ExampleProps {
  example: LoadedExample;
  /** The position of the example on its page, from 1, drawn as its reference. 0 draws none. */
  index: number;
  /** The heading level of the example's title. */
  headingLevel?: 3 | 4;
}

/**
 * One runnable example: a caption with its reference and title, a toolbar that changes the mode,
 * revision and direction of this example alone, the running example on a sheet, and its source.
 */
export function Example({ example, index, headingLevel = 3 }: ExampleProps) {
  const { meta } = example;
  const { settings } = useSettings();
  const pageShade: Shade = useIsDark() ? 'dark' : 'light';
  const [shade, setShade] = useState<Shade | null>(null);
  const [revision, setRevision] = useState<Revision | null>(null);
  const [direction, setDirection] = useState<Direction | null>(null);
  const [codeOpen, setCodeOpen] = useState(false);
  const preview = useRef<HTMLDivElement>(null);
  const source = useSource(example);

  const effectiveShade = shade ?? pageShade;
  const effectiveRevision = revision ?? settings.revision;
  const effectiveDirection = direction ?? settings.direction;
  useScopedDisplay(preview, effectiveShade, effectiveRevision);

  const id = `example-${meta.id}`;
  const Heading = `h${headingLevel}` as const;
  const reference = `E${index}`;

  return (
    <section className={styles.example} aria-labelledby={`${id}-title`}>
      <header className={styles.caption}>
        <Heading id={id} className={styles.title} data-anchor={meta.title} data-anchor-level={2}>
          {index > 0 && (
            <span className={styles.reference} aria-hidden="true">
              {reference}
            </span>
          )}
          <span id={`${id}-title`}>{meta.title}</span>
        </Heading>
        {meta.description && <div className={styles.description}>{meta.description}</div>}
      </header>

      <div className={styles.frame}>
        <div className={styles.toolbar} role="toolbar" aria-label={`Display of ${meta.title}`}>
          <SegmentedControl
            label="Mode"
            selectedId={effectiveShade}
            options={[
              { id: 'light', text: 'Light' },
              { id: 'dark', text: 'Dark' },
            ]}
            onChange={event => setShade(event.detail.selectedId as Shade)}
          />
          <SegmentedControl
            label="Revision"
            selectedId={effectiveRevision}
            options={revisions.map(value => ({ id: value, text: value }))}
            onChange={event => setRevision(event.detail.selectedId as Revision)}
          />
          <ToggleButton
            pressed={effectiveDirection === 'rtl'}
            onChange={event => setDirection(event.detail.pressed ? 'rtl' : 'ltr')}
          >
            Right to left
          </ToggleButton>
          <span className={styles.spacer} />
          <ToggleButton
            iconName="script"
            pressed={codeOpen}
            onChange={event => setCodeOpen(event.detail.pressed)}
            ariaLabel={`Code for ${meta.title}`}
          >
            Code
          </ToggleButton>
          {source !== null && (
            <CopyToClipboard
              variant="icon"
              textToCopy={source}
              copyButtonAriaLabel={`Copy the code for ${meta.title}`}
              copySuccessText="Code copied"
              copyErrorText="The browser did not allow copying"
            />
          )}
        </div>

        <div
          ref={preview}
          dir={effectiveDirection}
          className={[
            styles.preview,
            styles[`layout-${meta.layout ?? 'padded'}`],
            meta.height ? styles[`height-${meta.height}`] : '',
          ].join(' ')}
        >
          <ErrorBoundary
            errorBoundaryId={id}
            onError={event => {
              // Marked for scripts/check-pages.mjs, which reports examples that failed to render.
              preview.current?.setAttribute('data-example-error', `${meta.id}: ${String(event.detail.error)}`);
            }}
          >
            <ExampleRunner example={example} />
          </ErrorBoundary>
        </div>

        {codeOpen && (
          <div className={styles.code}>
            {source === null ? (
              <Skeleton variant="text" lines={6} loadingText="Loading the code" />
            ) : (
              <CodeView content={source} language="typescript" ariaLabel={`${meta.id}.tsx`} />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
