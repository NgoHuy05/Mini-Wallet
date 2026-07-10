// components/PaginatorFilter.jsx
import { FaFilter, FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const PaginatorFilter = ({
  page,
  totalPages,
  onPageChange,
  filterOptions = [],
  filterValue = "",
  onFilterChange,
  filterLabel = "Bộ lọc",
  showFilter = true,
  className = "",
}) => {
  return (
    <div className={`flex flex-wrap items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-3 text-sm">
        {showFilter && filterOptions.length > 0 && (
          <>
            <span className="text-gray-600 font-medium flex items-center gap-1.5">
              <FaFilter size={13} className="text-gray-400" /> {filterLabel}:
            </span>
            <select
              value={filterValue}
              onChange={(e) => onFilterChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 bg-white font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-[120px]"
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 text-sm">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
        >
          <FaChevronLeft size={12} /> 
        </button>
        <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-md">
          Trang {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
        >
           <FaChevronRight size={12} />
        </button>
      </div>
    </div>
  );
};

export default PaginatorFilter;