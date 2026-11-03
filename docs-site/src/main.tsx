// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './app/app';
import { SettingsProvider } from './app/settings';

import '@ordinate/global-styles/index.css';
import './styles/site.scss';

createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </React.StrictMode>
);
