// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import Button from '@ordinate/components/button';
import ButtonDropdown from '@ordinate/components/button-dropdown';
import Popover from '@ordinate/components/popover';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';
import Tabs from '@ordinate/components/tabs';
import Toggle from '@ordinate/components/toggle';
import { disableMotion } from '@ordinate/global-styles';

import { href } from '../../app/router';
import { CodeBlock, DocSection, Notes, Prose } from '../../parts/prose';
import { GuideDoc } from '../../registry/guides';
import { cssVariableOf, Figure, readToken, Split, useLiveValue } from './shared/figure';

import styles from './motion.module.scss';

const durations = [
  ['motionDurationResponsive', 'Presses, hovers, toggles, plates closing'],
  ['motionDurationExpressive', 'Marks sliding, plates opening, sections revealing'],
  ['motionDurationErase', 'A drawn stroke taking itself away'],
  ['motionDurationRotation', 'One turn of a spinner'],
  ['motionDurationDraw', 'A stroke drawing itself on a schematic'],
  ['motionDurationFlow', 'A skeleton breathing; a dot along a wire'],
] as const;

function Track({ token, use, played }: { token: string; use: string; played: boolean }) {
  const row = useRef<HTMLLIElement>(null);
  const value = useLiveValue(() => (row.current ? readToken(row.current, token) : ''), '');
  return (
    <li ref={row} className={styles['track-row']}>
      <span className={styles['track-name']}>
        <span className={styles.token}>{cssVariableOf(token).replace('--ord-', '')}</span>
        <span className={styles.use}>{use}</span>
      </span>
      <span
        className={clsx(styles.track, played && styles.played)}
        style={
          {
            '--duration': `var(${cssVariableOf(token)})`,
            '--easing': 'var(--ord-motion-easing-standard)',
          } as React.CSSProperties
        }
        aria-hidden="true"
      >
        <span className={styles.dot} />
      </span>
      <span className={styles.ms}>{value}</span>
    </li>
  );
}

function Durations() {
  const [played, setPlayed] = useState(false);
  return (
    <SpaceBetween size="l">
      <ul className={styles.tracks}>
        {durations.map(([token, use]) => (
          <Track key={token} token={token} use={use} played={played} />
        ))}
      </ul>
      <div className={styles.controls}>
        <Button iconName={played ? 'undo' : 'play'} onClick={() => setPlayed(current => !current)}>
          {played ? 'Send the dots back' : 'Run the dots'}
        </Button>
      </div>
    </SpaceBetween>
  );
}

/** The standard easing curve, read from its token and drawn on a square graph. */
function Curve() {
  const graph = useRef<SVGSVGElement>(null);
  const easing = useLiveValue(
    () => (graph.current ? readToken(graph.current, 'motionEasingStandard') : ''),
    'cubic-bezier(0.2, 0, 0, 1)'
  );
  const points = easing
    .match(/cubic-bezier\(([^)]+)\)/)?.[1]
    .split(',')
    .map(Number) ?? [0.2, 0, 0, 1];
  const [x1, y1, x2, y2] = points;
  const size = 200;
  const pad = 20;
  const px = (x: number) => pad + x * size;
  const py = (y: number) => pad + (1 - y) * size;
  const gridLines = [0.25, 0.5, 0.75];
  return (
    <div className={styles['curve-figure']}>
      <svg
        ref={graph}
        className={styles.curve}
        viewBox={`0 0 ${size + pad * 2} ${size + pad * 2}`}
        role="img"
        aria-label={`The standard easing curve, ${easing}: it starts quickly and slows as it lands.`}
      >
        {gridLines.map(line => (
          <g key={line}>
            <line className={styles['curve-grid']} x1={px(line)} y1={py(0)} x2={px(line)} y2={py(1)} />
            <line className={styles['curve-grid']} x1={px(0)} y1={py(line)} x2={px(1)} y2={py(line)} />
          </g>
        ))}
        <path className={styles['curve-axis']} d={`M${px(0)} ${py(1)}V${py(0)}H${px(1)}`} />
        <path className={styles['curve-linear']} d={`M${px(0)} ${py(0)}L${px(1)} ${py(1)}`} />
        <line className={styles['curve-handle']} x1={px(0)} y1={py(0)} x2={px(x1)} y2={py(y1)} />
        <line className={styles['curve-handle']} x1={px(1)} y1={py(1)} x2={px(x2)} y2={py(y2)} />
        <circle className={styles['curve-handle-dot']} cx={px(x1)} cy={py(y1)} r={3} />
        <circle className={styles['curve-handle-dot']} cx={px(x2)} cy={py(y2)} r={3} />
        <path
          className={styles['curve-line']}
          d={`M${px(0)} ${py(0)}C${px(x1)} ${py(y1)} ${px(x2)} ${py(y2)} ${px(1)} ${py(1)}`}
        />
        <text className={styles['curve-label']} x={px(1)} y={py(0) + 14} textAnchor="end">
          TIME
        </text>
        <text className={styles['curve-label']} x={px(0) + 4} y={py(1) - 6}>
          DISTANCE
        </text>
      </svg>
      <div>
        <Prose>
          <p>
            <code>motion-easing-standard</code> is <code>{easing}</code>. A move starts quickly and slows as it lands,
            like a pen set down on paper. The dashed line is <code>motion-easing-linear</code>, kept for spinners and
            strokes drawn at an even pace.
          </p>
          <p>There is no overshoot and no bounce: nothing in a drawing springs back.</p>
        </Prose>
      </div>
    </div>
  );
}

function PressAndLift() {
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (!held) {
      return;
    }
    const timer = window.setTimeout(() => setHeld(false), 600);
    return () => window.clearTimeout(timer);
  }, [held]);
  return (
    <div className={styles['press-stage']}>
      <div className={styles['press-cell']}>
        <button type="button" className={styles.block}>
          Press me
        </button>
        <p className={styles['press-label']}>Hold to press</p>
      </div>
      <div className={styles['press-cell']}>
        <button type="button" className={clsx(styles.block, held && styles.held)} onClick={() => setHeld(true)}>
          {held ? 'Pressed' : 'Click once'}
        </button>
        <p className={styles['press-label']}>Held for 600 ms</p>
      </div>
      <div className={styles['press-cell']}>
        <SpaceBetween direction="horizontal" size="xs">
          <Button>Restart</Button>
          <Button variant="primary">Deploy</Button>
        </SpaceBetween>
        <p className={styles['press-label']}>The real Button</p>
      </div>
    </div>
  );
}

function PlateRising() {
  const [open, setOpen] = useState(true);
  return (
    <SpaceBetween size="l">
      <div className={styles.controls}>
        <Toggle checked={open} onChange={event => setOpen(event.detail.checked)}>
          Plate open
        </Toggle>
        <ButtonDropdown
          items={[
            { id: 'restart', text: 'Restart' },
            { id: 'scale', text: 'Scale' },
            { id: 'logs', text: 'View log' },
          ]}
        >
          Open a real menu
        </ButtonDropdown>
        <Popover header="Memory" content="512 MiB of 2 GiB in use across 12 nodes." position="right">
          Open a popover
        </Popover>
      </div>
      <div className={styles['plate-stage']}>
        <div className={clsx(styles.plate, open && styles['plate-open'])} aria-hidden={!open}>
          <span className={styles['plate-title']}>Restart north-annex-web?</span>
          <span className={styles['plate-text']}>
            It fades in and rises 4 px onto its offset, and leaves faster than it came.
          </span>
        </div>
      </div>
    </SpaceBetween>
  );
}

function SlidingMarks({ still }: { still: boolean }) {
  const [range, setRange] = useState('week');
  const [tab, setTab] = useState('services');
  const pane = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (pane.current) {
      disableMotion(still, pane.current);
    }
  }, [still]);
  return (
    <div ref={pane} className={styles['compare-pane']}>
      <p className={styles['compare-label']}>{still ? 'Reduced motion: instant' : 'Motion on'}</p>
      <Tabs
        activeTabId={tab}
        onChange={event => setTab(event.detail.activeTabId)}
        ariaLabel={still ? 'Without motion' : 'With motion'}
        tabs={[
          { id: 'services', label: 'Services' },
          { id: 'deployments', label: 'Deployments' },
          { id: 'logs', label: 'Logs' },
        ]}
      />
      <SegmentedControl
        label="Usage over"
        selectedId={range}
        onChange={event => setRange(event.detail.selectedId)}
        options={[
          { id: 'day', text: 'Day' },
          { id: 'week', text: 'Week' },
          { id: 'month', text: 'Month' },
        ]}
      />
    </div>
  );
}

function Page() {
  return (
    <>
      <Prose>
        <p>
          Motion in Ordinate is brief and plain. Buttons press onto their offset, marks slide to the next choice, plates
          fade and rise a few pixels. Nothing bounces, and when the reader asks for reduced motion every change happens
          at once. Every duration and curve is a token, so a revision can change them.
        </p>
      </Prose>

      <DocSection id="durations" number={1} title="Durations">
        <Prose>
          <p>
            Each track below runs its dot across in the token&apos;s time, with the standard easing. Interface responses
            use the two short durations; the long ones are for drawings that draw themselves.
          </p>
        </Prose>
        <Figure code="Timing" caption="The dots cross their tracks in each token's duration.">
          <Durations />
        </Figure>
      </DocSection>

      <DocSection id="easing" number={2} title="Easing">
        <Figure code="Curve" caption="The standard easing, read from its token.">
          <Curve />
        </Figure>
      </DocSection>

      <DocSection id="press" number={3} title="Press and lift">
        <Split
          text={
            <>
              <p>
                A pressable button stands 2 px off a hard ink offset (M13). Pressed, it moves down and to the end onto
                the offset, and the offset closes. Released, it lifts back. The move takes{' '}
                <code>motion-duration-responsive</code>.
              </p>
              <p>
                The drawn blocks on the left are enlarged so the move is easy to see. The two at the end are real
                Buttons.
              </p>
            </>
          }
        >
          <Figure code="M13" caption="Press and hold, or click the second block to hold it pressed.">
            <PressAndLift />
          </Figure>
        </Split>
      </DocSection>

      <DocSection id="plates" number={4} title="Plates rising">
        <Split
          text={
            <>
              <p>
                A plate (M9), such as a modal, a popover or a menu, fades in and rises <code>size-offset-plate</code>{' '}
                onto its offset as it opens, over <code>motion-duration-expressive</code>. It leaves faster than it
                came, in <code>motion-duration-responsive</code>, so dismissing never makes anyone wait.
              </p>
            </>
          }
        >
          <Figure code="M9" caption="Switch the plate open and closed, or open the real menu and popover.">
            <PlateRising />
          </Figure>
        </Split>
      </DocSection>

      <DocSection id="marks" number={5} title="Marks that slide">
        <Prose>
          <p>
            When the choice in a row moves, the crop marks (M5) slide to the new item quickly and slow as they land,
            over <code>motion-duration-expressive</code>. The marks only slide once they have a place to slide from, so
            they never fly in when a page first draws.
          </p>
          <p>
            The pane on the right has <code>disableMotion</code> applied to it, as reduced motion would: the marks move
            at once.
          </p>
        </Prose>
        <Figure code="M5" caption="Change the tab or the range in each pane and compare.">
          <div className={styles.compare}>
            <SlidingMarks still={false} />
            <SlidingMarks still={true} />
          </div>
        </Figure>
      </DocSection>

      <DocSection id="reduced-motion" number={6} title="Reduced motion">
        <Prose>
          <p>
            Every transition and animation in Ordinate runs only when the operating system has no reduced-motion
            preference and <code>disableMotion</code> is off. Otherwise each change is instant: plates appear in place,
            marks jump, buttons press without travel. Nothing is lost, because motion never carries meaning on its own.
          </p>
        </Prose>
        <CodeBlock
          label="Turn motion off for the whole page"
          code={`
import { disableMotion } from '@ordinate/global-styles';

disableMotion(true);
`}
        />
        <Notes
          items={[
            <>
              The site&apos;s display settings have a motion switch that calls <code>disableMotion</code> for every
              page.
            </>,
            <>
              In custom components, put every transition inside a <code>prefers-reduced-motion: no-preference</code>{' '}
              query, and use the motion tokens for its duration and easing. See{' '}
              <a href={href('/foundations/tokens')}>Tokens</a>.
            </>,
            <>Do not animate layout that people read, such as table rows or text, beyond a short fade.</>,
          ]}
        />
      </DocSection>
    </>
  );
}

const doc: GuideDoc = {
  slug: 'motion',
  title: 'Motion',
  summary: 'Durations and easing, press and lift, plates rising, marks sliding, and reduced motion.',
  order: 7,
  keywords: ['animation', 'transition', 'duration', 'easing', 'reduced motion', 'disableMotion', 'press'],
  Page,
};

export default doc;
