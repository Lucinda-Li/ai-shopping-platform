import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ id, brand, name, price }: {
  id: number;
  brand: string;
  name: string;
  price: number;
}) {
  const navigate = useNavigate();

  return (
    <div style={styles.card} onClick={() => navigate(`/product/${id}`)}>
      <div style={styles.cardImg}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#9CD5FF" strokeWidth="1.2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      </div>
      <div style={styles.cardInfo}>
        <div style={styles.cardBrand}>{brand}</div>
        <div style={styles.cardName}>{name}</div>
        <div style={styles.cardPrice}>${price.toFixed(2)}</div>
      </div>
    </div>
  );
}

// ── Filter options ────────────────────────────────────────────────────────────
const filterOptions = [
  { key: "gender",     label: "Gender",      options: ["All", "Men", "Women", "Unisex"] },
  { key: "color",      label: "Color",       options: ["All", "Black", "White", "Blue", "Red", "Green", "Yellow"] },
  { key: "age",        label: "Age group",   options: ["All", "Adult", "Kids", "Teen"] },
  { key: "priceRange", label: "Price range", options: ["All", "Under $50", "$50–$100", "$100–$200", "$200+"] },
  { key: "onSale",     label: "On sale",     options: ["All", "On sale only"] },
  { key: "grading",    label: "Grading",     options: ["All", "★★★★★", "★★★★☆", "★★★☆☆", "★★☆☆☆", "★☆☆☆☆"] },
];

type Filters = Record<string, string>;

const defaultFilters: Filters = {
  gender: "All", color: "All", age: "All",
  priceRange: "All", onSale: "All", grading: "All",
};

// ── Search Results Page ───────────────────────────────────────────────────────
export default function SearchResultsPage() {
  const navigate = useNavigate();
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Filters>({ ...defaultFilters });
  const [tempFilters, setTempFilters] = useState<Filters>({ ...defaultFilters });

  const openFilter = () => {
    setTempFilters({ ...filters }); // reset temp to last saved
    setShowFilter(true);
  };

  useEffect(() => {
    if (initialQuery.trim()) {
      setLoading(true);
      fetch(`http://127.0.0.1:8000/search?q=${initialQuery}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [initialQuery, filters]);
  
  const closeFilter = () => setShowFilter(false); // close WITHOUT saving

  const saveFilter = () => {
    setFilters({ ...tempFilters }); // lock in the new filters
    setShowFilter(false);
    console.log("Filters saved:", tempFilters);
    // TODO: call FastAPI with filters + query
    // fetch(`/search?q=${searchQuery}&gender=${tempFilters.gender}&...`)
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${searchQuery}`);
  };

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <div style={styles.topbar}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div style={styles.navBrand}>ShopAI.</div>

        <form onSubmit={handleSearch} style={styles.searchWrap}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            style={styles.searchInput}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What are you looking for..."
          />
        </form>

        {/* Filter button */}
        <button style={styles.iconBtn} onClick={openFilter} title="Filters">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M3 6h18M6 12h12M9 18h6" />
          </svg>
        </button>

        {/* Wishlist */}
        <button style={styles.iconBtn} title="Wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF6B8A" stroke="#FF6B8A" strokeWidth="1.5">
            <path d="M12 21C12 21 3 14 3 8.5A5.5 5.5 0 0 1 12 5.5 5.5 5.5 0 0 1 21 8.5C21 14 12 21 12 21Z" />
          </svg>
        </button>
      </div>

      {/* Results bar */}
      <div style={styles.resultsBar}>
        <div style={styles.resultsText}>
          Showing results for <span style={styles.resultsQuery}>"{initialQuery}"</span>
        </div>
        <button style={styles.sortBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3A99E8" strokeWidth="2">
            <path d="M3 6h18M6 12h12M9 18h6" />
          </svg>
          Sort by
        </button>
      </div>

      {/* Cards grid */}
      <div style={styles.cardsArea}>
        {loading ? (
          <p style={{ color: "#88bde0", textAlign: "center", padding: "2rem 0" }}>
            Loading...
          </p>
        ) : results.length === 0 ? (
          <p style={{ color: "#88bde0", textAlign: "center", padding: "2rem 0" }}>
            No results found.
          </p>
        ) : (
          <div style={styles.cardsGrid}>
            {results.map((product: { id: number; brand: string; name: string; price: number }) => (
              <ProductCard
                key={product.id}
                id={product.id}
                brand={product.brand}
                name={product.name}
                price={product.price}
              />
            ))}
          </div>
        )}
      </div>

      {/* Overlay — click to close WITHOUT saving */}
      {showFilter && (
        <div style={styles.overlay} onClick={closeFilter} />
      )}

      {/* Filter panel */}
      <div style={{ ...styles.filterPanel, right: showFilter ? 0 : "-320px", 
        visibility: showFilter ? "visible" : "hidden"}}>
        <div style={styles.filterHeader}>
          <span style={styles.filterTitle}>Filters</span>
          <button style={styles.closeBtn} onClick={closeFilter}>✕</button>
        </div>

        {filterOptions.map(({ key, label, options }, i) => (
          <div key={key}>
            {/* Divider before price section */}
            {i === 3 && <hr style={styles.filterDivider} />}
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>{label}</label>
              <select
                style={styles.filterSelect}
                value={tempFilters[key]}
                onChange={(e) => setTempFilters({ ...tempFilters, [key]: e.target.value })}
              >
                {options.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>
        ))}

        {/* Save button — saves and closes */}
        <button style={styles.saveBtn} onClick={saveFilter}>
          Save filters
        </button>
      </div>

    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  page: {
    background: "#ffffff",
    minHeight: "100vh",
    fontFamily: "'DM Sans', sans-serif",
    overflowX: "hidden",  
  },
  topbar: {
    display: "flex", alignItems: "center",
    padding: "0.85rem 2rem", background: "#9CD5FF",
    gap: "1rem", position: "sticky", top: 0, zIndex: 10,
  },
  backBtn: {
    width: "34px", height: "34px", borderRadius: "50%",
    border: "1px solid white", background: "rgba(255,255,255,0.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", flexShrink: 0,
  },
  navBrand: {
    fontFamily: "serif", fontSize: "26px", fontWeight: 700,
    color: "#1A5F8A", whiteSpace: "nowrap",
    letterSpacing: "-0.5px", flexShrink: 0,
  },
  searchWrap: {
    flex: 1, display: "flex", alignItems: "center",
    background: "rgba(255,255,255,0.3)",
    border: "1.5px solid rgba(255,255,255,0.6)",
    borderRadius: "999px", padding: "8px 16px", gap: "8px",
  },
  searchInput: {
    flex: 1, border: "none", background: "none", outline: "none",
    fontSize: "14px", fontFamily: "'DM Sans', sans-serif", color: "white",
  },
  iconBtn: {
    width: "34px", height: "34px", borderRadius: "50%",
    border: "1px solid white", background: "rgba(255,255,255,0.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", flexShrink: 0,
  },
  resultsBar: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "1rem 2rem 0.75rem",
  },
  resultsText: { fontSize: "14px", color: "#88bde0" },
  resultsQuery: { color: "#1A5F8A", fontWeight: 500 },
  sortBtn: {
    display: "flex", alignItems: "center", gap: "6px",
    background: "white", border: "1px solid #C8E8FF",
    borderRadius: "8px", padding: "7px 14px",
    fontFamily: "'DM Sans', sans-serif", fontSize: "13px",
    color: "#3A99E8", cursor: "pointer",
  },
  cardsArea: { padding: "0.5rem 2rem 3rem" },
  cardsGrid: {
    display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px",
  },
  card: {
    border: "1px solid #E8F4FF", borderRadius: "14px",
    overflow: "hidden", cursor: "pointer", background: "white",
  },
  cardImg: {
    width: "100%", aspectRatio: "1", background: "#EEF7FF",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  cardInfo: { padding: "10px 12px 14px" },
  cardBrand: {
    fontSize: "11px", color: "#88bde0", marginBottom: "2px",
    textTransform: "uppercase", letterSpacing: "0.5px",
  },
  cardName: {
    fontSize: "13px", fontWeight: 500, color: "#1A5F8A",
    marginBottom: "6px", whiteSpace: "nowrap",
    overflow: "hidden", textOverflow: "ellipsis",
  },
  cardPrice: { fontSize: "14px", fontWeight: 500, color: "#3A99E8" },
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(26,95,138,0.15)", zIndex: 20,
  },
  filterPanel: {
    position: "fixed", top: 0,
    width: "300px", height: "100vh",
    background: "white", borderLeft: "2px solid #9CD5FF",
    zIndex: 30, transition: "right 0.3s ease",
    padding: "1.5rem", overflowY: "auto",
  },
  filterHeader: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", marginBottom: "1.5rem",
    paddingBottom: "1rem", borderBottom: "1.5px solid #E8F4FF",
  },
  filterTitle: {
    fontSize: "18px", fontWeight: 500,
    color: "#1A5F8A", fontFamily: "serif",
  },
  closeBtn: {
    width: "30px", height: "30px", borderRadius: "50%",
    border: "1px solid #C8E8FF", background: "#EEF7FF",
    color: "#3A99E8", cursor: "pointer", fontSize: "14px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  filterDivider: {
    border: "none", borderTop: "1px solid #E8F4FF", margin: "0.5rem 0",
  },
  filterGroup: { marginBottom: "1.1rem" },
  filterLabel: {
    display: "block", fontSize: "12px", fontWeight: 500,
    color: "#3A99E8", marginBottom: "5px", letterSpacing: "0.3px",
  },
  filterSelect: {
    width: "100%", border: "1px solid #C8E8FF",
    borderRadius: "8px", padding: "9px 12px",
    fontSize: "13px", color: "#1A5F8A",
    fontFamily: "'DM Sans', sans-serif", outline: "none", background: "#FAFCFF",
  },
  saveBtn: {
    width: "100%", background: "#9CD5FF", color: "#1A5F8A",
    border: "none", borderRadius: "10px", padding: "12px",
    fontSize: "15px", fontWeight: 500, cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", marginTop: "0.5rem",
  },
};