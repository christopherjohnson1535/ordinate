// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useState } from 'react';

import { EditorEngine } from './engine/interfaces';
import { loadEditorEngine } from './engine/load';

export type EngineState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; engine: EditorEngine };

/**
 * Loads the editor engine after the first render, so server rendering and the first paint show the
 * loading state without touching the engine. `retry` starts a new attempt after an error.
 */
export function useEditorEngine(): EngineState & { retry: () => void } {
  const [state, setState] = useState<EngineState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    loadEditorEngine().then(
      engine => active && setState({ status: 'ready', engine }),
      () => active && setState({ status: 'error' })
    );
    return () => {
      active = false;
    };
  }, [attempt]);

  const retry = () => {
    setState({ status: 'loading' });
    setAttempt(current => current + 1);
  };

  return { ...state, retry };
}
