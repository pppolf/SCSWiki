<script setup lang="ts">
import { computed, useSlots, type VNode } from 'vue';

type Align = 'left' | 'center' | 'right' | undefined;

interface SourceCell {
  text: string;
  align?: Align;
}

interface RenderCell extends SourceCell {
  colspan: number;
  rowspan: number;
}

interface TableData {
  headers: SourceCell[];
  rows: SourceCell[][];
}

const slots = useSlots();

function normalizeText(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function getVNodeChildren(vnode: VNode): VNode[] {
  if (Array.isArray(vnode.children)) {
    return vnode.children as VNode[];
  }

  if (vnode.children && typeof vnode.children === 'object' && 'default' in vnode.children) {
    const defaultSlot = (vnode.children as { default?: () => VNode[] }).default;
    return defaultSlot?.() ?? [];
  }

  return [];
}

function getVNodeText(vnode: VNode): string {
  if (typeof vnode.children === 'string') {
    return vnode.children;
  }

  return getVNodeChildren(vnode).map(getVNodeText).join('');
}

function isVNodeElement(vnode: VNode, tag: string) {
  return typeof vnode.type === 'string' && vnode.type.toLowerCase() === tag;
}

function findTable(vnodes: VNode[]): VNode | undefined {
  for (const vnode of vnodes) {
    if (isVNodeElement(vnode, 'table')) {
      return vnode;
    }

    const table = findTable(getVNodeChildren(vnode));
    if (table) {
      return table;
    }
  }

  return undefined;
}

function collectRows(vnode: VNode): SourceCell[][] {
  if (isVNodeElement(vnode, 'tr')) {
    return [
      getVNodeChildren(vnode)
        .filter((child) => isVNodeElement(child, 'td') || isVNodeElement(child, 'th'))
        .map((child) => ({ text: normalizeText(getVNodeText(child)) })),
    ];
  }

  return getVNodeChildren(vnode).flatMap(collectRows);
}

function extractRenderedTable(vnodes: VNode[]): TableData | undefined {
  const table = findTable(vnodes);
  if (!table) {
    return undefined;
  }

  const rows = collectRows(table);
  if (rows.length < 2) {
    return undefined;
  }

  return {
    headers: rows[0],
    rows: rows.slice(1),
  };
}

function splitMarkdownRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split(/(?<!\\)\|/)
    .map((cell) => cell.replace(/\\\|/g, '|').trim());
}

function parseAlign(value: string): Align {
  const cell = value.trim();
  if (cell.startsWith(':') && cell.endsWith(':')) {
    return 'center';
  }
  if (cell.endsWith(':')) {
    return 'right';
  }
  if (cell.startsWith(':')) {
    return 'left';
  }
  return undefined;
}

function extractMarkdownTable(vnodes: VNode[]): TableData | undefined {
  const source = vnodes.map(getVNodeText).join('\n');
  const lines = source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const separatorIndex = lines.findIndex((line) =>
    splitMarkdownRow(line).every((cell) => /^:?-{3,}:?$/.test(cell)),
  );

  if (separatorIndex < 1) {
    return undefined;
  }

  const headerTexts = splitMarkdownRow(lines[separatorIndex - 1]);
  const aligns = splitMarkdownRow(lines[separatorIndex]).map(parseAlign);
  const rows = lines.slice(separatorIndex + 1).map((line) =>
    splitMarkdownRow(line).map((text, index) => ({
      text: normalizeText(text),
      align: aligns[index],
    })),
  );

  return {
    headers: headerTexts.map((text, index) => ({
      text: normalizeText(text),
      align: aligns[index],
    })),
    rows,
  };
}

function buildMergedRows(rows: SourceCell[][]): Array<Array<RenderCell | null>> {
  const grid = rows.map((row) => row.map((cell) => cell.text));
  const visited = rows.map((row) => row.map(() => false));

  return rows.map((row, rowIndex) =>
    row.map((cell, columnIndex) => {
      if (visited[rowIndex][columnIndex]) {
        return null;
      }

      let colspan = 1;
      while (grid[rowIndex][columnIndex + colspan] === cell.text) {
        colspan += 1;
      }

      let rowspan = 1;
      while (
        rowIndex + rowspan < grid.length &&
        Array.from({ length: colspan }).every(
          (_, offset) => grid[rowIndex + rowspan][columnIndex + offset] === cell.text,
        )
      ) {
        rowspan += 1;
      }

      for (let r = rowIndex; r < rowIndex + rowspan; r += 1) {
        for (let c = columnIndex; c < columnIndex + colspan; c += 1) {
          visited[r][c] = true;
        }
      }

      return {
        ...cell,
        colspan,
        rowspan,
      };
    }),
  );
}

const table = computed(() => {
  const content = slots.default?.() ?? [];
  return extractRenderedTable(content) ?? extractMarkdownTable(content);
});

const mergedRows = computed(() => (table.value ? buildMergedRows(table.value.rows) : []));
</script>

<template>
  <table v-if="table" class="auto-merge-table">
    <thead>
      <tr>
        <th
          v-for="(header, index) in table.headers"
          :key="`${header.text}-${index}`"
          :style="{ textAlign: header.align }"
        >
          {{ header.text }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in mergedRows" :key="rowIndex">
        <template v-for="(cell, columnIndex) in row" :key="columnIndex">
          <td
            v-if="cell"
            :colspan="cell.colspan"
            :rowspan="cell.rowspan"
            :style="{ textAlign: cell.align }"
          >
            {{ cell.text }}
          </td>
        </template>
      </tr>
    </tbody>
  </table>
  <slot v-else />
</template>

<style scoped>
.auto-merge-table td[rowspan],
.auto-merge-table td[colspan] {
  vertical-align: middle;
}
</style>
