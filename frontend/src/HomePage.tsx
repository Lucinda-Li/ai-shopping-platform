import { useState } from "react";
import { useNavigate } from "react-router-dom";

const sampleProducts = [
  { id: 1, brand: "Nike", name: "Air Max 90", price: 129.99 },
  { id: 2, brand: "Adidas", name: "Ultra Boost 22", price: 189.0 },
  { id: 3, brand: "Zara", name: "Linen Blazer", price: 89.9 },
  { id: 4, brand: "H&M", name: "Slim Fit Jeans", price: 49.99 },
  { id: 5, brand: "Uniqlo", name: "Fleece Jacket", price: 59.9 },
  { id: 6, brand: "New Balance", name: "550 Sneakers", price: 110.0 },
  { id: 7, brand: "Levi's", name: "501 Original", price: 69.5 },
  { id: 8, brand: "Gucci", name: "Canvas Tote", price: 450.0 },
];

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ brand, name, price }: {
  brand: string;
  name: string;
  price: number;
}) {
  return (
    <div style={styles.card}>
      <div style={styles.cardImg}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#D78FEE" strokeWidth="1.2">
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

// ── Home Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${query}`);
  };

  return (
    <div style={styles.page}>

      {/* Top navbar */}
      <div style={styles.topbar}>
        <button style={styles.iconBtn} title="Profile">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </button>
        <button style={styles.iconBtn} title="Wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF8FAB" stroke="#FF8FAB" strokeWidth="1.5">
            <path d="M12 21C12 21 3 14 3 8.5A5.5 5.5 0 0 1 12 5.5 5.5 5.5 0 0 1 21 8.5C21 14 12 21 12 21Z" />
          </svg>
        </button>
      </div>

      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.brand}>AuraFit.</h1>
        <p style={styles.tagline}>Take a trip. Find your fit.</p>

        <form onSubmit={handleSearch} style={styles.searchWrap}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D78FEE" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            style={styles.searchInput}
            type="text"
            placeholder="What are you looking for..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Trending items */}
      {/* <div style={styles.trending}>
        <div style={styles.sectionTitle}>Trending Items</div>
        <div style={styles.cardsGrid}>
          {sampleProducts.map((product) => (
            <ProductCard
              key={product.id}
              brand={product.brand}
              name={product.name}
              price={product.price}
            />
          ))}
        </div>
      </div> */}

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
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    background: "linear-gradient(135deg, #D78FEE, #A8E6CF)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  iconBtn: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    border: "1.5px solid rgba(255,255,255,0.6)",
    background: "rgba(255,255,255,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  hero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "4rem 2rem 3rem",
    textAlign: "center",
  },
  brand: {
    fontFamily: "serif",
    fontSize: "64px",
    letterSpacing: "-1.5px",
    lineHeight: "1",
    marginBottom: "10px",
    fontWeight: 400,
    background: "linear-gradient(135deg, #D78FEE, #5BC8C8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  tagline: {
    fontSize: "25px",
    color: "#D78FEE",
    marginBottom: "2rem",
    fontWeight: 300,
    fontStyle: "italic",
    fontFamily: "'Cormorant Garamond', serif",
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: "560px",
    background: "#FAF0FF",
    border: "1.5px solid #D78FEE",
    borderRadius: "999px",
    padding: "13px 22px",
    gap: "10px",
  },
  searchInput: {
    flex: 1,
    border: "none",
    background: "none",
    outline: "none",
    fontSize: "16px",
    fontFamily: "'DM Sans', sans-serif",
    color: "#6B4E8A",
  },
  trending: {
    padding: "0 2rem 3rem",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: 500,
    color: "#D78FEE",
    marginBottom: "1.25rem",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },
  card: {
    border: "1px solid #F0D5FA",
    borderRadius: "14px",
    overflow: "hidden",
    cursor: "pointer",
    background: "white",
  },
  cardImg: {
    width: "100%",
    aspectRatio: "1",
    background: "#FAF0FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    padding: "10px 12px 14px",
  },
  cardBrand: {
    fontSize: "11px",
    color: "#C9A0DC",
    marginBottom: "2px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  cardName: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#6B4E8A",
    marginBottom: "6px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  cardPrice: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#5BC8C8",
  },
};