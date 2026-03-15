import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useWishlist } from "./context/WishlistContext";

// Trending items — 2025 viral / TikTok & Gen Z trending (Lululemon dress, Super Puff, quarter-zip, tech shell, etc.)
const sampleProducts = [
  {
    id: 1,
    brand: "Lululemon",
    name: "2-in-1 Maxi Dress",
    price: 148.0,
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80",
  },
  {
    id: 2,
    brand: "Aritzia",
    name: "Super Puff™ Shorty",
    price: 248.0,
    imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&q=80",
  },
  {
    id: 3,
    brand: "Nike",
    name: "Quarter-Zip Pullover",
    price: 95.0,
    imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80",
  },
  {
    id: 4,
    brand: "Arc'teryx",
    name: "Beta LT Jacket",
    price: 399.0,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80",
  },
  {
    id: 5,
    brand: "New Balance",
    name: "550",
    price: 119.99,
    imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80",
  },
  {
    id: 6,
    brand: "Alo",
    name: "Airlift High-Waist Legging",
    price: 98.0,
    imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400&q=80",
  },
  {
    id: 7,
    brand: "Zara",
    name: "Oversized Structured Blazer",
    price: 129.0,
    imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80",
  },
  {
    id: 8,
    brand: "Salomon",
    name: "XT-6 Runner",
    price: 169.0,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
  },
];

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({
  brand,
  name,
  price,
  imageUrl,
  onSelect,
}: {
  brand: string;
  name: string;
  price: number;
  imageUrl?: string;
  onSelect: () => void;
}) {
  return (
    <div style={styles.card} onClick={onSelect} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onSelect()}>
      <div style={styles.cardImg}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            loading="lazy"
          />
        ) : (
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#9CD5FF" strokeWidth="1.2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
        )}
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
  const { wishlist } = useWishlist();
  const wishlistCount = wishlist.length;

  const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  if (query.trim()) {
    console.log("Search:", query);  // ← move inside the if
    navigate(`/search?q=${query}`);
  }
};

  return (
    <div style={styles.page}>

      {/* Top navbar — profile LEFT, wishlist RIGHT */}
      <div style={styles.topbar}>
        {/* Profile icon — left */}
        <button style={styles.iconBtn} title="Profile">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3A99E8" strokeWidth="1.8">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </button>

        {/* Wishlist heart — right, link to wishlist page */}
        <Link
          to="/wishlist"
          style={{ ...styles.iconBtn, position: "relative", textDecoration: "none" }}
          title="Wishlist"
          aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ""}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF6B8A" stroke="#FF6B8A" strokeWidth="1.5">
            <path d="M12 21C12 21 3 14 3 8.5A5.5 5.5 0 0 1 12 5.5 5.5 5.5 0 0 1 21 8.5C21 14 12 21 12 21Z" />
          </svg>
          {wishlistCount > 0 && (
            <span style={styles.wishlistBadge}>{wishlistCount}</span>
          )}
        </Link>
      </div>

      {/* Hero — brand name + tagline + search bar */}
      <div style={styles.hero}>
        <h1 style={styles.brand}>ShopAI.</h1>
        <p style={styles.tagline}>Find your style, powered by AI</p>

        <form onSubmit={handleSearch} style={styles.searchWrap}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CD5FF" strokeWidth="2">
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

      {/* Trending items — scrollable grid */}
      <section style={styles.trending} aria-label="Trending items">
        <h2 style={styles.sectionTitle}>Trending Items</h2>
        <div style={styles.cardsGrid}>
          {sampleProducts.map((product) => (
            <ProductCard
              key={product.id}
              brand={product.brand}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
              onSelect={() => navigate(`/search?q=${encodeURIComponent(product.name)}`)}
            />
          ))}
        </div>
      </section>

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
    borderBottom: "1px solid #E8F4FF",
    position: "sticky",
    top: 0,
    background: "white",
    zIndex: 10,
  },
  iconBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "1px solid #C8E8FF",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  wishlistBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    background: "#FF6B8A",
    color: "white",
    fontSize: 11,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 4px",
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
    color: "#1A5F8A",
    letterSpacing: "-1.5px",
    lineHeight: "1",
    marginBottom: "10px",
    fontWeight: 400,
  },
  tagline: {
    fontSize: "16px",
    color: "#3A99E8",
    marginBottom: "2rem",
    fontWeight: 300,
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: "560px",
    background: "#F7FBFF",
    border: "1.5px solid #C8E8FF",
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
    color: "#1A5F8A",
  },
  trending: {
    padding: "0 2rem 3rem",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: 500,
    color: "#1A5F8A",
    marginBottom: "1.25rem",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
  },
  card: {
    border: "1px solid #E8F4FF",
    borderRadius: "14px",
    overflow: "hidden",
    cursor: "pointer",
    background: "white",
    transition: "box-shadow 0.2s ease, border-color 0.2s ease",
  },
  cardImg: {
    width: "100%",
    aspectRatio: "1",
    background: "#F0F7FC",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
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
