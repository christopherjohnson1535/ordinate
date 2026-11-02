// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import ToggleButton, { ToggleButtonProps } from '~components/toggle-button';

import styles from './styles.module.scss';

function Toggle({ initial, ...props }: Omit<ToggleButtonProps, 'pressed'> & { initial: boolean }) {
  const [pressed, setPressed] = useState(initial);
  return <ToggleButton {...props} pressed={pressed} onChange={event => setPressed(event.detail.pressed)} />;
}

interface Variant {
  name: string;
  props: Omit<ToggleButtonProps, 'pressed'>;
}

const variants: Variant[] = [
  { name: 'normal', props: { children: 'Bold' } },
  { name: 'normal, icon', props: { children: 'Favorite', iconName: 'star', pressedIconName: 'star-solid' } },
  {
    name: 'icon',
    props: { variant: 'icon', iconName: 'heart', pressedIconName: 'heart-solid', ariaLabel: 'Like' },
  },
];

export default function ToggleButtonPermutations() {
  const [saving, setSaving] = useState(false);
  const [following, setFollowing] = useState(false);

  return (
    <article className={styles.page}>
      <h1>Toggle button permutations</h1>
      <table className={styles.grid}>
        <thead>
          <tr>
            <th scope="col">Variant</th>
            <th scope="col">Not pressed</th>
            <th scope="col">Pressed</th>
            <th scope="col">Disabled</th>
            <th scope="col">Disabled, pressed</th>
            <th scope="col">Loading</th>
          </tr>
        </thead>
        <tbody>
          {variants.map(({ name, props }) => (
            <tr key={name}>
              <th scope="row">{name}</th>
              <td>
                <Toggle {...props} initial={false} />
              </td>
              <td>
                <Toggle {...props} initial={true} />
              </td>
              <td>
                <Toggle {...props} initial={false} disabled={true} />
              </td>
              <td>
                <Toggle {...props} initial={true} disabled={true} />
              </td>
              <td>
                <Toggle {...props} initial={true} loading={true} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <section className={styles.section}>
        <h2>Formatting toolbar</h2>
        <div className={styles.row}>
          <Toggle variant="icon" iconName="edit" ariaLabel="Edit mode" initial={true} />
          <Toggle variant="icon" iconName="microphone-off" ariaLabel="Mute" initial={false} />
          <Toggle
            variant="icon"
            iconName="thumbs-up"
            pressedIconName="thumbs-up-solid"
            ariaLabel="Helpful"
            initial={false}
          />
          <Toggle
            variant="icon"
            iconName="thumbs-down"
            pressedIconName="thumbs-down-solid"
            ariaLabel="Not helpful"
            initial={false}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2>Saving the change</h2>
        <div className={styles.row}>
          <ToggleButton
            pressed={following}
            loading={saving}
            loadingText="Saving"
            iconName="notification"
            onChange={event => {
              setSaving(true);
              setTimeout(() => {
                setSaving(false);
                setFollowing(event.detail.pressed);
              }, 1200);
            }}
          >
            Follow project
          </ToggleButton>
        </div>
      </section>
    </article>
  );
}
