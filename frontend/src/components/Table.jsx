import { useState } from "react";

const Table = ({ data, columns }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const perPage = 5;

  const filtered = data.filter(item =>
    JSON.stringify(item).toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="table-wrapper">
      <div className="table-controls">
        <input
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            {columns.map(col => <th key={col}>{col}</th>)}
          </tr>
        </thead>

        <tbody>
          {paginated.map((row,i) => (
            <tr key={i}>
              {columns.map(col => (
                <td key={col}>{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button 
          className="pagination__btn pagination__btn--prev"
          onClick={()=>setPage(p=>Math.max(p-1,1))}
          disabled={page === 1}
        >
          ← Prev
        </button>
        <span className="pagination__info">
          Page {page} of {Math.ceil(filtered.length / perPage)}
        </span>
        <button 
          className="pagination__btn pagination__btn--next"
          onClick={()=>setPage(p=>p+1)}
          disabled={page >= Math.ceil(filtered.length / perPage)}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Table;
