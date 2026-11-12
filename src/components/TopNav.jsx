import { SearchIcon, ChevronDownIcon, BellIcon } from './Icons.jsx';

const logo = `${import.meta.env.BASE_URL}assets/logo.svg`;

export default function TopNav({ search, onSearchChange, category, onCategoryChange, categories }) {
  return (
    <header className="top-nav">
      <div className="search-input-wrap">
        <SearchIcon className="search-icon" />
        <input
          type="search"
          placeholder="Search..."
          id="billing-search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {search && (
          <button
            type="button"
            className="btn-clear"
            aria-label="Clear Search"
            onClick={() => onSearchChange('')}
          >
            ✕
          </button>
        )}
      </div>

      <div className="top-nav-right">
        <button type="button" className="btn-dropdown">
          <span>📅 Last 30 Days</span>
          <ChevronDownIcon />
        </button>

        <div className="select-wrapper">
          <select
            className="category-select"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button type="button" className="btn-icon" aria-label="Notifications">
          <BellIcon />
        </button>

        <button type="button" className="btn-icon logo-icon" aria-label="Brand Logo">
          <img src={logo} alt="Logo" className="top-logo-img" />
        </button>
      </div>
    </header>
  );
}
