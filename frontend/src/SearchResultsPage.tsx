import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { searchClothes } from "./api";
import type { Product as ApiProduct } from "./api";
import type { Product as DetailProduct } from "./types/product";

function toDetailProduct(apiProduct: ApiProduct, id: string): DetailProduct {
  return {
    id,
    name: apiProduct.title,
    brand: apiProduct.store,
    price: apiProduct.price,
    imageUrls: apiProduct.image_url ? [apiProduct.image_url] : [],
    officialUrl: apiProduct.link,
    sizes: ["XS", "S", "M", "L", "XL"],
    foundOn: [apiProduct.store],
    aiSummary: undefined,
  };
}

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product, onClick }: { product: ApiProduct; onClick: () => void }) {
  return (
    <div style={styles.card} onClick={onClick}>
      {product.image_url ? (
        <img
          src={product.image_url}
          alt={product.title}
          style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }}
        />
      ) : (
        <div style={styles.cardImg}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#D78FEE" strokeWidth="1.2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
        </div>
      )}
      <div style={styles.cardInfo}>
        <div style={styles.cardBrand}>{product.store}</div>
        <div style={styles.cardName}>{product.title}</div>
        <div style={styles.cardPrice}>{product.price}</div>
        {product.rating && (
          <div style={styles.cardRating}>⭐ {product.rating} ({product.reviews})</div>
        )}
      </div>
    </div>
  );
}

// ── Filter options ────────────────────────────────────────────────────────────
const filterOptions = [
  { key: "gender",     label: "Gender",      options: ["All", "Men", "Women", "Unisex"] },
  { key: "color",      label: "Color",       options: ["All", "Black", "White", "Blue", "Red", "Green", "Yellow", "Grey", "Purple", "Pink"] },
  { key: "priceRange", label: "Price range", options: ["All", "Under $50", "$50–$100", "$100–$200", "$200+"] },
  { key: "style",      label: "Style",       options: ["All", "Casual", "Formal", "Streetwear", "Bohemian", "Minimalist", "Vintage", "Sporty", "Business", "Party", "Sexy"] },
];

type Filters = Record<string, string>;

const defaultFilters: Filters = {
  gender: "All",
  color: "All",
  priceRange: "All",
  style: "All",
};

function parsePriceRange(range: string): { min_price?: number; max_price?: number } {
  switch (range) {
    case "Under $50":  return { max_price: 50 };
    case "$50–$100":   return { min_price: 50,  max_price: 100 };
    case "$100–$200":  return { min_price: 100, max_price: 200 };
    case "$200+":      return { min_price: 200 };
    default:           return {};
  }
}

// ── Search Results Page ───────────────────────────────────────────────────────
export default function SearchResultsPage() {
  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults]         = useState<ApiProduct[]>([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [showFilter, setShowFilter]   = useState(false);
  const [filters, setFilters]         = useState<Filters>({ ...defaultFilters });
  const [tempFilters, setTempFilters] = useState<Filters>({ ...defaultFilters });

  useEffect(() => {
    if (!initialQuery.trim()) return;

    const fetchResults = async () => {
      setLoading(true);
      setError("");
      try {
        const { min_price, max_price } = parsePriceRange(filters.priceRange);
        const data = await searchClothes({
          query:     initialQuery,
          limit:     40,
          gender:    filters.gender !== "All" ? filters.gender.toLowerCase() : undefined,
          color:     filters.color  !== "All" ? filters.color.toLowerCase()  : undefined,
          min_price,
          max_price,
          style:     filters.style  !== "All" ? filters.style.toLowerCase()  : undefined,
        });
        setResults(data);
      } catch (err) {
        console.error("Search error:", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [initialQuery, filters]);

  const openFilter  = () => { setTempFilters({ ...filters }); setShowFilter(true); };
  const closeFilter = () => setShowFilter(false);
  const saveFilter  = () => { setFilters({ ...tempFilters }); setShowFilter(false); };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${searchQuery}`);
  };

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <div style={styles.topbar}>
        <button style={styles.backBtn} onClick={() => navigate("/home")} title="Back to home">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div style={styles.navBrand}>AuraFit.</div>

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

        <button style={styles.iconBtn} onClick={openFilter} title="Filters">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D78FEE" strokeWidth="2">
            <path d="M3 6h18M6 12h12M9 18h6" />
          </svg>
        </button>

        {/* Wishlist — link to wishlist page (heart color from teammate UI) */}
        <Link to="/wishlist" style={styles.iconBtn} title="Wishlist" aria-label="Wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF8FAB" stroke="#FF8FAB" strokeWidth="1.5">
            <path d="M12 21C12 21 3 14 3 8.5A5.5 5.5 0 0 1 12 5.5 5.5 5.5 0 0 1 21 8.5C21 14 12 21 12 21Z" />
          </svg>
        </Link>
      </div>

      {/* Results bar */}
      <div style={styles.resultsBar}>
        <div style={styles.resultsText}>
          Showing results for <span style={styles.resultsQuery}>"{initialQuery}"</span>
          {!loading && results.length > 0 && ` — ${results.length} items`}
        </div>
        <button style={styles.sortBtn}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D78FEE" strokeWidth="2">
            <path d="M3 6h18M6 12h12M9 18h6" />
          </svg>
          Sort by
        </button>
      </div>

      {/* Cards area */}
      <div style={styles.cardsArea}>
        {loading ? (
          <div style={styles.centerMsg}>Searching for "{initialQuery}"...</div>
        ) : error ? (
          <div style={styles.centerMsg}>{error}</div>
        ) : results.length === 0 ? (
          <div style={styles.centerMsg}>No results found for "{initialQuery}"</div>
        ) : (
          <div style={styles.cardsGrid}>
            {results.map((product, index) => {
              const id = String(index);
              const detailProduct = toDetailProduct(product, id);
              return (
                <ProductCard
                  key={id}
                  product={product}
                  onClick={() =>
                    navigate(`/product/${id}`, {
                      state: { product: detailProduct, searchQuery: initialQuery },
                    })
                  }
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Overlay */}
      {showFilter && <div style={styles.overlay} onClick={closeFilter} />}

      {/* Filter panel */}
      <div style={{
        ...styles.filterPanel,
        right: showFilter ? 0 : "-320px",
        visibility: showFilter ? "visible" : "hidden",
      }}>
        <div style={styles.filterHeader}>
          <span style={styles.filterTitle}>Filters</span>
          <button style={styles.closeBtn} onClick={closeFilter}>✕</button>
        </div>

        {filterOptions.map(({ key, label, options }) => (
          <div key={key} style={styles.filterGroup}>
            <label style={styles.filterLabel}>{label}</label>
            <select
              style={styles.filterSelect}
              value={tempFilters[key]}
              onChange={(e) => setTempFilters({ ...tempFilters, [key]: e.target.value })}
            >
              {options.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}

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
     overflowX: "hidden" 
    },
  topbar: { 
    display: "flex", 
    alignItems: "center", 
    padding: "0.85rem 2rem", 
    background: "linear-gradient(135deg, #D78FEE, #A8E6CF)", 
    gap: "1rem", position: "sticky", top: 0, zIndex: 10 
  },
  backBtn: { 
    width: "34px", 
    height: "34px", 
    borderRadius: "50%", 
    border: "1.5px solid rgba(255,255,255,0.6)", 
    background: "rgba(255,255,255,0.25)", 
    display: "flex", alignItems: "center", 
    justifyContent: "center", 
    cursor: "pointer", 
    flexShrink: 0 
  },
  navBrand: { 
    fontFamily: "serif", 
    fontStyle: "italic", 
    fontSize: "26px", 
    fontWeight: 700, 
    color: "white", 
    whiteSpace: "nowrap", 
    letterSpacing: "-0.5px", 
    flexShrink: 0 
  },
  searchWrap: { 
    flex: 1, 
    display: "flex", 
    alignItems: "center", 
    background: "rgba(255,255,255,0.25)", 
    border: "1.5px solid rgba(255,255,255,0.5)", 
    borderRadius: "999px", 
    padding: "8px 16px", 
    gap: "8px" 
  },
  searchInput: { 
    flex: 1, 
    border: "none", 
    background: "none", 
    outline: "none", 
    fontSize: "14px", 
    fontFamily: "'DM Sans', sans-serif", 
    color: "white" 
  },
  iconBtn: { 
    width: "34px", 
    height: "34px", 
    borderRadius: "50%", 
    border: "1.5px solid rgba(255,255,255,0.6)", 
    background: "rgba(255,255,255,0.25)", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    cursor: "pointer", 
    flexShrink: 0 
  },
  resultsBar: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: "1rem 2rem 0.75rem" 
  },
  resultsText: { 
    fontSize: "14px", 
    color: "#C9A0DC" 
  },
  resultsQuery: { 
    color: "#6B4E8A", 
    fontWeight: 500 
  },
  sortBtn: { 
    display: "flex", 
    alignItems: "center", 
    gap: "6px", 
    background: "white", 
    border: "1px solid #F0D5FA", 
    borderRadius: "8px", 
    padding: "7px 14px", 
    fontFamily: "'DM Sans', sans-serif", 
    fontSize: "13px", 
    color: "#D78FEE", 
    cursor: "pointer" },
  centerMsg: { 
    textAlign: "center", 
    color: "#C9A0DC", 
    padding: "3rem 2rem", 
    fontSize: "15px" 
  },
  cardsArea: {
     padding: "0.5rem 2rem 3rem" 
  },
  cardsGrid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(4, 1fr)", 
    gap: "16px" 
  },
  card: { 
    border: "1px solid #F0D5FA", 
    borderRadius: "14px", 
    overflow: "hidden", 
    cursor: "pointer", 
    background: "white" 
  },
  cardImg: { 
    width: "100%", 
    aspectRatio: "1", 
    background: "#FAF0FF", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  cardInfo: { 
    padding: "10px 12px 14px" 

  },
  cardBrand: { 
    fontSize: "11px", 
    color: "#C9A0DC", 
    marginBottom: "2px", 
    textTransform: "uppercase", 
    letterSpacing: "0.5px" 
  },
  cardName: { 
    fontSize: "13px", 
    fontWeight: 500, 
    color: "#6B4E8A", 
    marginBottom: "6px", 
    whiteSpace: "nowrap", 
    overflow: "hidden", 
    textOverflow: "ellipsis" 
  },
  cardPrice: { 
    fontSize: "14px", 
    fontWeight: 500, 
    color: "#5BC8C8" 
  },
  cardRating: { 
    fontSize: "11px", 
    color: "#C9A0DC", 
    marginTop: "4px" 
  },
  overlay: { 
    position: "fixed", 
    inset: 0, 
    background: "rgba(107,78,138,0.15)", 
    zIndex: 20 
  },
  filterPanel: { 
    position: "fixed", 
    top: 0, 
    width: "300px", 
    height: "100vh", 
    background: "white", 
    borderLeft: "2px solid #D78FEE", 
    zIndex: 30, 
    transition: "right 0.3s ease", 
    padding: "1.5rem", 
    overflowY: "auto" 
  },
  filterHeader: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: "1.5rem", 
    paddingBottom: "1rem", 
    borderBottom: "1.5px solid #F0D5FA" 
  },
  filterTitle: { 
    fontSize: "18px", 
    fontWeight: 500, 
    color: "#6B4E8A", 
    fontFamily: "serif", 
    fontStyle: "italic"
  },
  closeBtn: { 
    width: "30px", 
    height: "30px", 
    borderRadius: "50%", 
    border: "1px solid #F0D5FA", 
    background: "#FAF0FF", 
    color: "#D78FEE", 
    cursor: "pointer", 
    fontSize: "14px", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  filterGroup: { 
    marginBottom: "1.1rem" 
  },
  filterLabel: { 
    display: "block", 
    fontSize: "12px", 
    fontWeight: 500, 
    color: "#D78FEE", 
    marginBottom: "5px", 
    letterSpacing: "0.3px" 
  },
  filterSelect: { 
    width: "100%", 
    border: "1px solid #F0D5FA", 
    borderRadius: "8px", 
    padding: "9px 12px", 
    fontSize: "13px", 
    color: "#6B4E8A", 
    fontFamily: "'DM Sans', sans-serif", 
    outline: "none", 
    background: "#FAF0FF" },
  saveBtn: { 
    width: "100%", 
    background: "linear-gradient(135deg, #D78FEE, #A8E6CF)", 
    color: "white", 
    border: "none", 
    borderRadius: "10px", 
    padding: "12px", 
    fontSize: "15px", 
    fontWeight: 500, 
    cursor: "pointer", 
    fontFamily: "'DM Sans', sans-serif", 
    marginTop: "0.5rem" },
};
