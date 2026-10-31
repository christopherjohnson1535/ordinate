// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => cleanup());

// jsdom does not implement modal dialogs.
const dialog = HTMLDialogElement.prototype;
if (typeof dialog.showModal !== 'function') {
  dialog.showModal = function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
}
if (typeof dialog.close !== 'function') {
  dialog.close = function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  };
}
