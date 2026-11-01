// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { InternalButton } from '../button/internal';
import { InternalFormField } from '../form-field/internal';
import { SplitPanelPosition } from '../internal/context/split-panel-context';
import { InternalModal } from '../modal/internal';
import { InternalRadioGroup } from '../radio-group/internal';
import { InternalSpaceBetween } from '../space-between/internal';

export interface PreferencesStrings {
  title?: string;
  positionLabel?: string;
  positionDescription?: string;
  positionBottom?: string;
  positionSide?: string;
  positionSideUnavailable?: string;
  confirm?: string;
  cancel?: string;
}

interface PreferencesModalProps {
  position: SplitPanelPosition;
  isSidePositionUnavailable: boolean;
  strings: PreferencesStrings;
  onConfirm: (position: SplitPanelPosition) => void;
  onDismiss: () => void;
}

/**
 * The dialog where the user picks the panel's position. Mount it to open it, so each
 * opening starts from the current position.
 */
export function PreferencesModal({
  position,
  isSidePositionUnavailable,
  strings,
  onConfirm,
  onDismiss,
}: PreferencesModalProps) {
  const [selected, setSelected] = useState<SplitPanelPosition>(position);

  return (
    <InternalModal
      visible={true}
      size="small"
      header={strings.title}
      onDismiss={onDismiss}
      footer={
        <InternalSpaceBetween direction="horizontal" size="xs">
          <InternalButton variant="link" formAction="none" onClick={onDismiss}>
            {strings.cancel}
          </InternalButton>
          <InternalButton variant="primary" formAction="none" onClick={() => onConfirm(selected)}>
            {strings.confirm}
          </InternalButton>
        </InternalSpaceBetween>
      }
    >
      <InternalFormField label={strings.positionLabel} description={strings.positionDescription}>
        <InternalRadioGroup
          value={selected}
          onChange={event => setSelected(event.detail.value as SplitPanelPosition)}
          items={[
            { value: 'bottom', label: strings.positionBottom },
            {
              value: 'side',
              label: strings.positionSide,
              disabled: isSidePositionUnavailable,
              description: isSidePositionUnavailable ? strings.positionSideUnavailable : undefined,
            },
          ]}
        />
      </InternalFormField>
    </InternalModal>
  );
}
