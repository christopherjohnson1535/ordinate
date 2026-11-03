// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '@ordinate/components/button';
import Modal from '@ordinate/components/modal';
import SpaceBetween from '@ordinate/components/space-between';
import StatusIndicator from '@ordinate/components/status-indicator';

const steps = ['Pull image', 'Run migrations', 'Drain na-01', 'Restart na-01', 'Drain na-02', 'Restart na-02'];

export default function GrowingContent() {
  const [visible, setVisible] = useState(false);
  const [done, setDone] = useState(1);

  return (
    <>
      <Button onClick={() => setVisible(true)}>Show deployment steps</Button>
      <Modal
        visible={visible}
        size="large"
        position="top"
        kind="resource"
        reference="R4"
        header="Deployment 2026-11-02"
        onDismiss={() => setVisible(false)}
        footer={
          <Button
            iconName="chevron-right"
            iconAlign="right"
            disabled={done >= steps.length}
            onClick={() => setDone(current => current + 1)}
          >
            Run next step
          </Button>
        }
      >
        <SpaceBetween size="xs">
          {steps.slice(0, done).map(step => (
            <StatusIndicator key={step} state="complete">
              {step}
            </StatusIndicator>
          ))}
          {done < steps.length && <StatusIndicator state="underway">{steps[done]}</StatusIndicator>}
        </SpaceBetween>
      </Modal>
    </>
  );
}
