// Copyright Christopher Johnson. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface TreeNode<T> {
  item: T;
  id: string;
  /**
   * Depth from 1, as `aria-level` counts it.
   */
  level: number;
  /**
   * Position among the item's siblings, from 0.
   */
  index: number;
  setSize: number;
  parentId: string | null;
  hasChildren: boolean;
  expanded: boolean;
  /**
   * The rendered children: empty while the node is collapsed.
   */
  children: TreeNode<T>[];
}

export interface TreeAccessors<T> {
  getItemId: (item: T) => string;
  getItemChildren: (item: T) => ReadonlyArray<T> | undefined;
}

export interface VisibleTree<T> {
  roots: TreeNode<T>[];
  /**
   * Every rendered node in reading order, which is the order arrow keys move through.
   */
  visible: TreeNode<T>[];
}

/**
 * Builds the nodes that are on screen: the top-level items and the children of expanded
 * items, all the way down. Collapsed branches are not walked, so a large tree costs only
 * what is shown.
 */
export function buildVisibleTree<T>(
  items: ReadonlyArray<T>,
  { getItemId, getItemChildren }: TreeAccessors<T>,
  expanded: ReadonlySet<string>
): VisibleTree<T> {
  const visible: TreeNode<T>[] = [];
  const build = (siblings: ReadonlyArray<T>, level: number, parentId: string | null): TreeNode<T>[] =>
    siblings.map((item, index) => {
      const id = getItemId(item);
      const children = getItemChildren(item) ?? [];
      const hasChildren = children.length > 0;
      const isExpanded = hasChildren && expanded.has(id);
      const node: TreeNode<T> = {
        item,
        id,
        level,
        index,
        setSize: siblings.length,
        parentId,
        hasChildren,
        expanded: isExpanded,
        children: [],
      };
      visible.push(node);
      if (isExpanded) {
        node.children = build(children, level + 1, id);
      }
      return node;
    });
  return { roots: build(items, 1, null), visible };
}

/**
 * The IDs of the ancestors of the item with `id`, from the top level down, or `null`
 * when no item has that ID.
 */
export function findAncestorIds<T>(
  items: ReadonlyArray<T>,
  { getItemId, getItemChildren }: TreeAccessors<T>,
  id: string
): string[] | null {
  for (const item of items) {
    const itemId = getItemId(item);
    if (itemId === id) {
      return [];
    }
    const below = findAncestorIds(getItemChildren(item) ?? [], { getItemId, getItemChildren }, id);
    if (below) {
      return [itemId, ...below];
    }
  }
  return null;
}
