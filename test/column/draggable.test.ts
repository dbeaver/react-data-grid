import { fireEvent } from '@testing-library/react';

import type { Column } from '../../src';
import { getHeaderCells, setup } from '../utils';

const columns: readonly Column<never>[] = [
  {
    key: 'col1',
    name: 'col1'
  },
  {
    key: 'col2',
    name: 'col2',
    draggable: true
  },
  {
    key: 'col3',
    name: 'col3',
    draggable: true
  },
  {
    key: 'col4',
    name: 'col4',
    draggable: true
  }
];

test('draggable columns', () => {
  const onColumnsReorder = vi.fn();
  setup({ columns, rows: [], onColumnsReorder });
  const [cell1, cell2, cell3, cell4] = getHeaderCells();

  expect(cell1).not.toHaveAttribute('draggable');
  expect(cell2).toHaveAttribute('draggable');
  expect(cell3).toHaveAttribute('draggable');
  expect(cell4).toHaveAttribute('draggable');

  expect(onColumnsReorder).not.toHaveBeenCalled();

  let data: unknown;
  let type: unknown;
  const event = {
    dataTransfer: {
      get types() {
        return [type];
      },
      setData(_type: unknown, _data: unknown) {
        type = _type;
        data = _data;
      },
      getData() {
        return data;
      }
    }
  } as const;

  fireEvent.dragStart(cell2, event);
  fireEvent.drop(cell4, event);

  expect(onColumnsReorder).toHaveBeenCalledWith('col2', 'col4');
  onColumnsReorder.mockReset();

  // should not call `onColumnsReorder` if drag and drop elements are the same
  fireEvent.dragStart(cell2, event);
  fireEvent.drop(cell2, event);
  expect(onColumnsReorder).not.toHaveBeenCalled();

  // should not drag a column if it is not specified as draggable
  fireEvent.dragStart(cell1, event);
  fireEvent.drop(cell2, event);
  expect(onColumnsReorder).not.toHaveBeenCalled();
});
