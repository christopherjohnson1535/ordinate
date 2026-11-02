// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import Button from '~components/button';
import Link from '~components/link';
import Popover, { PopoverProps } from '~components/popover';

import styles from './styles.module.scss';

const positions: PopoverProps.Position[] = ['top', 'right', 'bottom', 'left'];

export default function PopoverSimple() {
  const refPopover = useRef<PopoverProps.Ref>(null);

  return (
    <article className={styles.page}>
      <h1>Popover</h1>

      <section className={styles.section}>
        <h2>Text trigger</h2>
        <p>
          The north-annex project uses{' '}
          <Popover header="Memory" content="512 MiB of 2 GiB in use across 12 nodes.">
            512 MiB of memory
          </Popover>{' '}
          and stores logs for{' '}
          <Popover
            header="Log retention"
            content={
              <>
                Logs older than 30 days move to cold storage. <Link href="#retention">Change retention</Link>
              </>
            }
          >
            30 days
          </Popover>
          .
        </p>
        <p>
          Without a header: <Popover content="Measured at the load balancer, every minute.">p95 latency</Popover>.
          Without a close button:{' '}
          <Popover dismissButton={false} header="Zone" content="us-mountain-1a">
            zone
          </Popover>
          .
        </p>
        <div style={{ maxInlineSize: 160 }}>
          <Popover wrapTriggerText={false} content="This trigger does not wrap.">
            A long trigger that stays on one line
          </Popover>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Positions</h2>
        <div className={styles.compass}>
          {positions.map(position => (
            <Popover
              key={position}
              position={position}
              header={`Position ${position}`}
              content="Points at its trigger."
            >
              {position}
            </Popover>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Sizes and custom triggers</h2>
        <div className={styles.row}>
          {(['small', 'medium', 'large'] as const).map(size => (
            <Popover
              key={size}
              size={size}
              position="bottom"
              header={`Size ${size}`}
              content="A popover grows with its content up to the largest width of its size, then wraps the text onto more lines."
            >
              {size}
            </Popover>
          ))}
          <Popover size="small" fixedWidth={true} position="bottom" header="Fixed" content="Short.">
            fixed width
          </Popover>
          <Popover triggerType="custom" position="bottom" header="Node status" content="All 12 nodes are healthy.">
            <Button variant="icon" iconName="note" ariaLabel="Node status" />
          </Popover>
          <Popover ref={refPopover} triggerType="custom" position="bottom" content="Opened with a button.">
            <Button formAction="none">Custom trigger</Button>
          </Popover>
          <Button variant="link" formAction="none" onClick={() => refPopover.current?.dismiss()}>
            Dismiss with the ref
          </Button>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Inside a scrolling container</h2>
        <div className={styles.clip}>
          <p>
            <Popover renderWithPortal={true} position="bottom" header="With a portal" content="Not clipped.">
              Rendered with a portal
            </Popover>
          </p>
          <p>
            <Popover position="bottom" header="Fixed position" content="Floats above the scroll container.">
              Rendered in place
            </Popover>
          </p>
          <p style={{ blockSize: 160 }}>More content below.</p>
        </div>
      </section>

      <section className={styles.edges}>
        <Popover position="left" header="Flipped" content="There is no room on the start side, so it opens at the end.">
          Start edge
        </Popover>
        <Popover
          position="right"
          header="Flipped"
          content="There is no room on the end side, so it opens at the start."
        >
          End edge
        </Popover>
      </section>
    </article>
  );
}
