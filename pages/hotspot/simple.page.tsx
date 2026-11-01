// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AnnotationContext, { AnnotationContextProps } from '~components/annotation-context';
import Button from '~components/button';
import Hotspot, { HotspotProps } from '~components/hotspot';

import styles from './styles.module.scss';

const directions: HotspotProps.Direction[] = ['top', 'right', 'bottom', 'left'];

const tutorial: AnnotationContextProps.Tutorial = {
  title: 'Hotspot directions',
  tasks: [
    {
      title: 'Every direction',
      steps: [
        ...directions.map(direction => ({
          title: `Opens to the ${direction}`,
          content: `This annotation prefers the ${direction} side of its marker and flips when there is no room.`,
          hotspotId: `direction-${direction}`,
        })),
        {
          title: 'Marker on the start side',
          content: 'With `side="left"` the marker comes before the element, on the right in right-to-left layout.',
          hotspotId: 'side-start',
        },
        {
          title: 'A warning',
          content: 'Steps can carry a warning, for example when an earlier step was undone.',
          hotspotId: 'standalone',
          warningAlert: 'The project name was cleared.',
        },
      ],
    },
  ],
};

export default function HotspotSimple() {
  const [current, setCurrent] = useState<AnnotationContextProps.Tutorial | null>(tutorial);

  return (
    <article className={styles.page}>
      <h1>Hotspot</h1>
      <p className={styles.note}>
        Markers show for every step of the current task. The current step&apos;s marker is drawn in ink and pulses when
        motion is on; choose another marker to open its step.
      </p>
      <div className={styles.row}>
        <Button onClick={() => setCurrent(current ? null : tutorial)}>
          {current ? 'End the tutorial' : 'Start the tutorial'}
        </Button>
      </div>

      <AnnotationContext
        currentTutorial={current}
        onFinish={() => setCurrent(null)}
        i18nStrings={{ finishButtonText: 'Done' }}
      >
        <section className={styles.section}>
          <h2>Directions</h2>
          <div className={styles.compass}>
            {directions.map(direction => (
              <Hotspot key={direction} hotspotId={`direction-${direction}`} direction={direction}>
                <span className={styles.target}>{direction}</span>
              </Hotspot>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>Sides</h2>
          <div className={styles.column}>
            <Hotspot hotspotId="side-start" side="left" direction="right">
              <span className={styles.target}>Marker on the start side</span>
            </Hotspot>
            <div className={styles.sentence}>
              A hotspot can also stand on its own next to the element it explains, such as this sentence.{' '}
              <Hotspot hotspotId="standalone" direction="right" />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Outside the current task</h2>
          <Hotspot hotspotId="not-in-tutorial">
            <span className={styles.target}>No step points here, so no marker shows.</span>
          </Hotspot>
        </section>
      </AnnotationContext>
    </article>
  );
}
