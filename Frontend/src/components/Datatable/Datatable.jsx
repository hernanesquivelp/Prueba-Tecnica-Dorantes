import React from "react";

const DataTable = ({ columns, data }) => {
  return (
    <table className="table table-striped table-hover mt-4">
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((col, colIndex) => (
              <td key={colIndex}>
                {/* Si la columna tiene una función de 'render', la usamos.
                  Si no, mostramos el valor normal.
                */}
                {col.render ? col.render(row) : row[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
