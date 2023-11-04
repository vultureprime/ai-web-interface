import { type ComponentType, type ReactElement } from 'react'
import DataGridItem from './DataGridItem'

export type DataRow = {
  id: number | string
} & Record<string, unknown>

export interface DataGridColumn<T extends DataRow> {
  field: keyof T
  headerName: string
  value?: (item: T) => string | ReactElement
}

export interface DataGridProps<T extends DataRow> {
  title: string
  columns: DataGridColumn<T>[]
  rows?: T[]
  detailsComponent?: ComponentType<DataRow>
}

export function DataGrid<T extends DataRow>({
  title,
  columns,
  rows,
  detailsComponent,
}: DataGridProps<T>) {
  return (
    <div>
      <h2 className='mb-4 text-center text-2xl font-bold text-blue-500'>
        {title}
      </h2>
      <div className='relative overflow-x-auto'>
        <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
          <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
            <tr>
              {columns.map(({ headerName }) => (
                <th key={headerName} scope='col' className='px-6 py-3'>
                  {headerName}
                </th>
              ))}
            </tr>
          </thead>
          {rows && (
            <tbody>
              {rows.map((r) => {
                return (
                  <DataGridItem
                    key={r.id}
                    columns={columns}
                    row={r}
                    detailsComponent={detailsComponent}
                  ></DataGridItem>
                )
              })}
            </tbody>
          )}
        </table>
      </div>
    </div>
  )
}

export default DataGrid
