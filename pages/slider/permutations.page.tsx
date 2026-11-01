// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import FormField from '~components/form-field';
import Slider, { SliderProps } from '~components/slider';

import styles from '../form-controls.module.scss';

function useSlider(initial: number) {
  const [value, setValue] = useState(initial);
  return { value, onChange: (event: { detail: SliderProps.ChangeDetail }) => setValue(event.detail.value) };
}

const percent = (value: number) => `${value}%`;
const gigabytes = (value: number) => `${value} GiB`;

export default function SliderPermutations() {
  return (
    <article className={styles.page}>
      <h1>Slider</h1>

      <section className={styles.section}>
        <h2>In a form field</h2>
        <div className={styles.form}>
          <FormField label="Opacity" description="Of the overlay.">
            <Slider {...useSlider(40)} min={0} max={100} valueFormatter={percent} />
          </FormField>
          <FormField label="Replicas" description="Tick marks at every step.">
            <Slider {...useSlider(3)} min={1} max={9} tickMarks={true} />
          </FormField>
          <FormField label="Memory" description="Reference values and steps of 4.">
            <Slider
              {...useSlider(16)}
              min={0}
              max={64}
              step={4}
              tickMarks={true}
              referenceValues={[16, 32, 48]}
              valueFormatter={gigabytes}
            />
          </FormField>
          <FormField label="Threshold" description="Without the fill line.">
            <Slider {...useSlider(0.6)} min={0} max={1} step={0.05} hideFillLine={true} referenceValues={[0.5]} />
          </FormField>
        </div>
      </section>

      <section className={styles.section}>
        <h2>States</h2>
        <div className={styles.form}>
          <FormField label="Opacity" errorText="Must be below 80%.">
            <Slider {...useSlider(90)} min={0} max={100} valueFormatter={percent} />
          </FormField>
          <FormField label="Opacity" warningText="Text may be hard to read.">
            <Slider {...useSlider(70)} min={0} max={100} valueFormatter={percent} />
          </FormField>
          <FormField label="Opacity, read-only">
            <Slider value={25} min={0} max={100} readOnly={true} valueFormatter={percent} />
          </FormField>
          <FormField label="Replicas, disabled">
            <Slider value={4} min={1} max={9} disabled={true} tickMarks={true} />
          </FormField>
        </div>
      </section>
    </article>
  );
}
