// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import {
  applyDensity,
  applyMode,
  applyRevision,
  applyStyle,
  Density,
  disableMotion,
  Mode,
  Revision,
  Style,
} from '@ordinate/global-styles';

export type Direction = 'ltr' | 'rtl';

/** How the whole site is drawn. Every example follows these unless its own toolbar overrides them. */
export interface DisplaySettings {
  mode: Mode;
  revision: Revision;
  density: Density;
  style: Style;
  direction: Direction;
  motion: boolean;
}

interface SettingsContextValue {
  settings: DisplaySettings;
  update: (change: Partial<DisplaySettings>) => void;
  reset: () => void;
}

export const defaultSettings: DisplaySettings = {
  mode: Mode.System,
  revision: Revision.V2026_2,
  density: Density.Comfortable,
  style: Style.Console,
  direction: 'ltr',
  motion: true,
};

const storageKey = 'ordinate-docs:display';

// Browser storage can be missing or refuse access (private windows, file:// in some browsers), so
// the site falls back to the defaults and carries on.
function readStored(): DisplaySettings {
  try {
    const stored = JSON.parse(window.localStorage.getItem(storageKey) ?? 'null');
    return stored ? { ...defaultSettings, ...pickKnown(stored) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

function pickKnown(value: Record<string, unknown>): Partial<DisplaySettings> {
  const known: Partial<DisplaySettings> = {};
  if (Object.values(Mode).includes(value.mode as Mode)) known.mode = value.mode as Mode;
  if (Object.values(Revision).includes(value.revision as Revision)) known.revision = value.revision as Revision;
  if (Object.values(Density).includes(value.density as Density)) known.density = value.density as Density;
  if (Object.values(Style).includes(value.style as Style)) known.style = value.style as Style;
  if (value.direction === 'ltr' || value.direction === 'rtl') known.direction = value.direction;
  if (typeof value.motion === 'boolean') known.motion = value.motion;
  return known;
}

function store(settings: DisplaySettings) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
  } catch {
    // Not stored; the choice still holds until the page reloads.
  }
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<DisplaySettings>(readStored);

  useEffect(() => {
    applyMode(settings.mode);
    applyRevision(settings.revision);
    applyDensity(settings.density);
    applyStyle(settings.style);
    document.documentElement.dir = settings.direction;
    disableMotion(!settings.motion);
    store(settings);
  }, [settings]);

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      update: change => setSettings(current => ({ ...current, ...change })),
      reset: () => setSettings(defaultSettings),
    }),
    [settings]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const value = useContext(SettingsContext);
  if (!value) {
    throw new Error('useSettings needs a SettingsProvider above it.');
  }
  return value;
}

/** Whether the page is drawn dark right now, following the operating system in system mode. */
export function useIsDark(): boolean {
  const { settings } = useSettings();
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches);
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setSystemDark(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);
  return settings.mode === Mode.Dark || (settings.mode === Mode.System && systemDark);
}
