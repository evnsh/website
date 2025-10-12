interface TableProps {
  data: {
    headers: string[]
    rows: string[][]
  }
}

export function Table({ data }: TableProps) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="w-full border-collapse border border-neutral-300 dark:border-neutral-600">
        <thead>
          <tr>
            {data.headers.map((header, index) => (
              <th
                key={index}
                className="border border-neutral-300 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-800 px-4 py-2 text-left font-medium text-gray-900 dark:text-white"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-gray-700 dark:text-gray-300"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

