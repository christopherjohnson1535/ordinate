// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '@ordinate/components/button';
import Drawer from '@ordinate/components/drawer';
import FormField from '@ordinate/components/form-field';
import RadioGroup from '@ordinate/components/radio-group';
import SegmentedControl from '@ordinate/components/segmented-control';
import SpaceBetween from '@ordinate/components/space-between';
import Toggle from '@ordinate/components/toggle';
import { Density, Mode, Revision, Style } from '@ordinate/global-styles';

import { Direction, useSettings } from './settings';

const styleDescriptions: Record<Style, string> = {
  [Style.Console]: 'Applications, drawn like a set of drawings. The default.',
  [Style.Editorial]: 'A journal or a magazine: serif headlines and long reading.',
  [Style.Studio]: 'A studio portfolio: large type and quiet frames.',
  [Style.Shopfront]: 'A local shop or service: warm, plain and direct.',
};

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * The display settings of the whole site. These are the same switches an application has:
 * applyMode, applyRevision, applyStyle and applyDensity from @ordinate/global-styles.
 */
export function DisplayPanel() {
  const { settings, update, reset } = useSettings();
  return (
    <Drawer
      header="Display"
      reference="C1"
      kind="configuration"
      footer={
        <Button variant="link" onClick={reset}>
          Reset to the defaults
        </Button>
      }
    >
      <SpaceBetween size="l">
        <FormField layout="stacked" label="Mode" description="System follows your operating system.">
          <SegmentedControl
            label="Mode"
            selectedId={settings.mode}
            options={Object.values(Mode).map(mode => ({ id: mode, text: capitalize(mode) }))}
            onChange={event => update({ mode: event.detail.selectedId as Mode })}
          />
        </FormField>
        <FormField
          layout="stacked"
          label="Revision"
          description="The look every component is pinned to. 2026.2 rounds the corners."
        >
          <SegmentedControl
            label="Revision"
            selectedId={settings.revision}
            options={Object.values(Revision).map(revision => ({ id: revision, text: revision }))}
            onChange={event => update({ revision: event.detail.selectedId as Revision })}
          />
        </FormField>
        <FormField layout="stacked" label="Style">
          <RadioGroup
            value={settings.style}
            items={Object.values(Style).map(style => ({
              value: style,
              label: capitalize(style),
              description: styleDescriptions[style],
            }))}
            onChange={event => update({ style: event.detail.value as Style })}
          />
        </FormField>
        <FormField layout="stacked" label="Density">
          <SegmentedControl
            label="Density"
            selectedId={settings.density}
            options={Object.values(Density).map(density => ({ id: density, text: capitalize(density) }))}
            onChange={event => update({ density: event.detail.selectedId as Density })}
          />
        </FormField>
        <FormField layout="stacked" label="Direction">
          <SegmentedControl
            label="Direction"
            selectedId={settings.direction}
            options={[
              { id: 'ltr', text: 'Left to right' },
              { id: 'rtl', text: 'Right to left' },
            ]}
            onChange={event => update({ direction: event.detail.selectedId as Direction })}
          />
        </FormField>
        <Toggle
          checked={settings.motion}
          description="Off stops every component animation. Your system's reduced-motion setting is always followed."
          onChange={event => update({ motion: event.detail.checked })}
        >
          Motion
        </Toggle>
      </SpaceBetween>
    </Drawer>
  );
}
