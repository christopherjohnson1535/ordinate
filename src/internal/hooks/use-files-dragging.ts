// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useState } from 'react';

/**
 * Whether a drag carries files, as opposed to text or an element from the page.
 */
export function hasFiles(dataTransfer: DataTransfer | null | undefined): boolean {
  return Array.from(dataTransfer?.types ?? []).includes('Files');
}

/**
 * Whether the user is dragging files anywhere over the page.
 *
 * Enter and leave events fire for every element the pointer crosses, so only a leave with no
 * element to go to (the pointer left the window) ends the drag. A drop or the end of the drag
 * ends it too.
 */
export function useFilesDragging(): boolean {
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const onEnter = (event: DragEvent) => {
      if (hasFiles(event.dataTransfer)) {
        setDragging(true);
      }
    };
    const onLeave = (event: DragEvent) => {
      if (!event.relatedTarget) {
        setDragging(false);
      }
    };
    const onOver = (event: DragEvent) => {
      if (!hasFiles(event.dataTransfer)) {
        return;
      }
      setDragging(true);
      // A drop target has already accepted the drag. Anywhere else, refuse it, so that missing the
      // drop target does not make the browser open the file in place of the page.
      if (!event.defaultPrevented) {
        event.preventDefault();
        if (event.dataTransfer) {
          event.dataTransfer.dropEffect = 'none';
        }
      }
    };
    const onEnd = (event: DragEvent) => {
      setDragging(false);
      if (hasFiles(event.dataTransfer) && !event.defaultPrevented) {
        event.preventDefault();
      }
    };

    document.addEventListener('dragenter', onEnter);
    document.addEventListener('dragover', onOver);
    document.addEventListener('dragleave', onLeave);
    document.addEventListener('drop', onEnd);
    document.addEventListener('dragend', onEnd);
    return () => {
      document.removeEventListener('dragenter', onEnter);
      document.removeEventListener('dragover', onOver);
      document.removeEventListener('dragleave', onLeave);
      document.removeEventListener('drop', onEnd);
      document.removeEventListener('dragend', onEnd);
    };
  }, []);

  return dragging;
}
