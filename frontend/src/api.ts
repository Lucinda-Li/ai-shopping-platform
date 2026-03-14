const BASE_URL = "http://localhost:8000/api";

export interface SearchFilters {
  query: string;
  gender?: string;
  color?: string;
  min_price?: number;
  max_price?: number;
  limit?: number;
}

export interface Product {
  title: string;
  price: string;
  store: string;
  image_url: string;
  link: string;
  rating: number;
  reviews: number;
}

export async function searchClothes(filters: SearchFilters): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(filters),
  });

  if (!response.ok) {
    throw new Error("Search failed");
  }

  const data = await response.json();
  return data.results;
}