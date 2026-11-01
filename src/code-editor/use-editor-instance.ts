// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useRef, useState } from 'react';

import { EditorConfig, EditorEngine, EditorInstance, EditorListeners } from './engine/interfaces';
import { CodeEditorProps } from './interfaces';

interface EditorInstanceOptions {
  engine: EditorEngine | null;
  value: string;
  language: CodeEditorProps.Language;
  config: EditorConfig;
  listeners: EditorListeners;
}

/**
 * Creates the editor in the element passed to the returned `setContainer` ref once the engine has
 * loaded, keeps it in sync with the props, and destroys it on unmount.
 */
export function useEditorInstance({ engine, value, language, config, listeners }: EditorInstanceOptions) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [instance, setInstance] = useState<EditorInstance | null>(null);
  // The editor reads the latest props when it is created, without being recreated when they change.
  const latest = useRef({ value, language, config, listeners });

  useEffect(() => {
    latest.current = { value, language, config, listeners };
  });

  useEffect(() => {
    if (!engine || !container) {
      return;
    }
    const { value, language, config } = latest.current;
    const created = engine.createEditor({
      parent: container,
      value,
      language,
      config,
      // The engine keeps this object, so it forwards to the newest handlers.
      listeners: {
        onChange: next => latest.current.listeners.onChange(next),
        onCursorChange: position => latest.current.listeners.onCursorChange(position),
        onDiagnosticsChange: counts => latest.current.listeners.onDiagnosticsChange(counts),
        onTabMovesFocusToggle: () => latest.current.listeners.onTabMovesFocusToggle(),
      },
    });
    setInstance(created);
    return () => {
      created.destroy();
      setInstance(null);
    };
  }, [engine, container]);

  useEffect(() => instance?.setValue(value), [instance, value]);
  useEffect(() => instance?.setLanguage(language), [instance, language]);
  useEffect(() => instance?.configure(config), [instance, config]);

  return { setContainer, instance };
}
