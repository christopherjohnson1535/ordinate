// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, useContext } from 'react';

/**
 * Set by a container that draws its search slot as a command line, such as the top navigation.
 * An input inside it drops its own box and takes the command line's mono type and key hint.
 */
export const CommandLineContext = createContext(false);

export function useCommandLine(): boolean {
  return useContext(CommandLineContext);
}
