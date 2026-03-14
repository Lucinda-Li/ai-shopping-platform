import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Product } from "./types/product";

// Sample results — replace with real data from FastAPI later
const sampleResults = [
  { id: 1, brand: "Nike", name: "Air Max 90", price: 129.99 },
  { id: 2, brand: "Adidas", name: "Ultra Boost 22", price: 189.0 },
  { id: 3, brand: "New Balance", name: "550 Sneakers", price: 110.0 },
  { id: 4, brand: "Puma", name: "RS-X Sneaker", price: 95.0 },
  { id: 5, brand: "Vans", name: "Old Skool", price: 70.0 },
  { id: 6, brand: "Converse", name: "Chuck Taylor", price: 65.0 },
  { id: 7, brand: "Reebok", name: "Classic Leather", price: 80.0 },
  { id: 8, brand: "Jordan", name: "Air Jordan 1", price: 180.0 },
];

/** 把搜索结果项转成详情页需要的 Product，便于点击卡片后带过去 */
function toProduct(item: (typeof sampleResults)[0]): Product {
  return {
    id: String(item.id),
    name: item.name,
    brand: item.brand,
    price: `$${item.price.toFixed(2)}`,
    imageUrls: [`https://placehold.co/320x400/f0f8ff/1a5f8a?text=${encodeURIComponent(item.name)}`],
    officialUrl: "https://example.com",
    sizes: ["XS", "S", "M", "L", "XL"],
    foundOn: ["Brand site"],
    aiSummary: undefined,
  };
}

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: (typeof sampleResults)[0] }) {
  const navigate = useNavigate();
  const { id, brand, name, price } = product;
  return (
    <div style={styles.card} onClick={() => navigate(`/product/${id}`, { state: { product: toProduct(product) } })}>
      {/* Image placeholder — replace with <img src={imageUrl} /> when backend is ready */}
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

// ── Search Results Page ───────────────────────────────────────────────────────
export default function SearchResultsPage() {
  const navigate = useNavigate();

  // Get search query from URL e.g. /search?q=sneakers
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <div style={styles.topbar}>
        {/* Back button — 回到上一页（首页） */}
        <button style={styles.backBtn} onClick={() => navigate("/home")} title="Back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Brand */}
        <div style={styles.navBrand}>ShopAI.</div>

        {/* Search bar pre-filled with query */}
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

        {/* Wishlist heart */}
        <button style={styles.iconBtn} title="Wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF"  stroke="#FF6B8A" strokeWidth="1.5">
            <path d="M12 21C12 21 3 14 3 8.5A5.5 5.5 0 0 1 12 5.5 5.5 5.5 0 0 1 21 8.5C21 14 12 21 12 21Z" />
          </svg>
        </button>
      </div>

      {/* Results count + sort */}
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
        <div style={styles.cardsGrid}>
          {sampleResults.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
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
  },
  topbar: {
    display: "flex",
    alignItems: "center",
    padding: "0.85rem 2rem",
    background: "#9CD5FF",
    gap: "1rem",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  backBtn: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: "1px solid white",
    background: "rgba(255,255,255,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },
  navBrand: {
    fontFamily: "serif",
    fontSize: "26px",
    fontWeight: 700,
    color: "#1A5F8A",
    whiteSpace: "nowrap",
    letterSpacing: "-0.5px",
    flexShrink: 0,
  },
  searchWrap: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.3)",
    border: "1.5px solid rgba(255,255,255,0.6)",
    borderRadius: "999px",
    padding: "8px 16px",
    gap: "8px",
  },
  searchInput: {
    flex: 1,
    border: "none",
    background: "none",
    outline: "none",
    fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
    color: "white",
  },
  iconBtn: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: "1px solid white",
    background: "rgba(255,255,255,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },
  resultsBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem 0.75rem",
  },
  resultsText: {
    fontSize: "14px",
    color: "#88bde0",
  },
  resultsQuery: {
    color: "#1A5F8A",
    fontWeight: 500,
  },
  sortBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "white",
    border: "1px solid #C8E8FF",
    borderRadius: "8px",
    padding: "7px 14px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13px",
    color: "#3A99E8",
    cursor: "pointer",
  },
  cardsArea: {
    padding: "0.5rem 2rem 3rem",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },
  card: {
    border: "1px solid #E8F4FF",
    borderRadius: "14px",
    overflow: "hidden",
    cursor: "pointer",
    background: "white",
  },
  cardImg: {
    width: "100%",
    aspectRatio: "1",
    background: "#EEF7FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    padding: "10px 12px 14px",
  },
  cardBrand: {
    fontSize: "11px",
    color: "#88bde0",
    marginBottom: "2px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  cardName: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#1A5F8A",
    marginBottom: "6px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cardPrice: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#3A99E8",
  },
};
