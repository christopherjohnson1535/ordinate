// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

declare module '*.css.js' {
  const styles: Readonly<Record<string, string>>;
  export default styles;
}
