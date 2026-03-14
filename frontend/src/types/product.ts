export interface Product {
  id: string
  name: string
  brand: string
  price: string
  /** Main image (optional if imageUrls is used) */
  imageUrl?: string
  /** Multiple product images for gallery */
  imageUrls: string[]
  officialUrl: string
  sizes: string[]
  foundOn: string[]
  aiSummary?: string
}

export interface Review {
  id: string
  productId: string
  imageUrl?: string
  rating: number
  text: string
  fromCommunity?: boolean
}
