// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './app';

import '~global-styles/index.css';

createRoot(document.getElementById('app') as HTMLElement).render(<App />);
