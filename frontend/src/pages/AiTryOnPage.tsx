import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './AiTryOnPage.css'
import type { Product } from '../types/product'

interface LocationState {
  product?: Product & { selectedSize?: string }
}

const BACKEND_BASE_URL = 'http://localhost:8000'

interface TryOnResponse {
  status: string
  images: {
    front: string
  }
  recommended_size: string
  bmi: number
}

export function AiTryOnPage() {
  const location = useLocation()
  const state = location.state as LocationState | null
  const product = state?.product

  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null)
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [size, setSize] = useState(product?.selectedSize ?? product?.sizes?.[0] ?? '')
  const [isLoading, setIsLoading] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null)
  const [bmi, setBmi] = useState<number | null>(null)

  const sizes = product?.sizes ?? ['S', 'M', 'L']

  const getClothImageUrl = () => {
    if (!product) return null
    if (Array.isArray((product as Product).imageUrls) && product.imageUrls.length > 0) {
      return product.imageUrls[0]
    }
    if (product.imageUrl) {
      return product.imageUrl
    }
    return null
  }

  const fetchImageAsFile = async (url: string, filename: string) => {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error('Failed to fetch cloth image')
    }
    const blob = await res.blob()
    return new File([blob], filename, { type: blob.type || 'image/png' })
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (photoPreviewUrl) URL.revokeObjectURL(photoPreviewUrl)
    setPhotoFile(file)
    setPhotoPreviewUrl(URL.createObjectURL(file))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!photoFile || !height.trim() || !weight.trim() || !size) {
      setError('Please upload a photo and fill in height, weight, and size.')
      return
    }

    const clothUrl = getClothImageUrl()
    if (!clothUrl) {
      setError('No product image available for try-on.')
      return
    }

    setError(null)
    setIsLoading(true)
    try {
      const clothFile = await fetchImageAsFile(clothUrl, 'cloth.png')

      const formData = new FormData()
      formData.append('user_image', photoFile)
      formData.append('cloth_image', clothFile)
      formData.append('height', String(parseFloat(height)))
      formData.append('weight', String(parseFloat(weight)))
      formData.append('size', size)

      const response = await fetch(`${BACKEND_BASE_URL}/tryon`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data = (await response.json()) as TryOnResponse
      const frontPath = data.images?.front
      if (!frontPath) {
        throw new Error('No image returned from try-on service')
      }

      const fullUrl =
        frontPath.startsWith('http://') || frontPath.startsWith('https://')
          ? frontPath
          : `${BACKEND_BASE_URL}${frontPath}`

      setPreviewImageUrl(fullUrl)
      setRecommendedSize(data.recommended_size)
      setBmi(data.bmi)
    } catch {
      setError('We couldn\'t generate a preview right now. Please try again later.')
      // Keep user photo and inputs; do not clear
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page ai-tryon-page">
      <header className="ai-tryon-header">
        <Link
          to={product ? `/product/${product.id}` : '/'}
          state={product ? { product } : undefined}
          className="ai-tryon-header__back"
          aria-label="Back to product"
        >
          ← Back to product
        </Link>
      </header>

      <main className="ai-tryon-main">
        <h1 className="ai-tryon-main__title">AI Try-On</h1>
        {product && (
          <p className="ai-tryon-main__product">
            Trying: {product.name} — {product.brand}
          </p>
        )}

        <div className="ai-tryon-panels">
          <section className="ai-tryon-panel ai-tryon-panel--photo">
            <h2 className="ai-tryon-panel__title">Your Photo</h2>
            <div className="ai-tryon-panel__upload">
              {photoPreviewUrl ? (
                <>
                  <img
                    src={photoPreviewUrl}
                    alt="Your upload"
                    className="ai-tryon-panel__preview-img"
                  />
                  <label className="ai-tryon-panel__change">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="ai-tryon-panel__file-input"
                    />
                    Change photo
                  </label>
                </>
              ) : (
                <label className="ai-tryon-panel__drop">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="ai-tryon-panel__file-input"
                  />
                  <span>Upload a full-body photo to start</span>
                  <span className="ai-tryon-panel__upload-btn">Upload photo</span>
                </label>
              )}
            </div>
            <p className="ai-tryon-privacy">
              Your photo is used only for generating the preview and will not be shared.
            </p>
          </section>

          <section className="ai-tryon-panel ai-tryon-panel--preview">
            <h2 className="ai-tryon-panel__title">Try-on Preview</h2>
            <div className="ai-tryon-panel__preview-box">
              {error ? (
                <div className="ai-tryon-panel__error" role="alert">
                  {error}
                </div>
              ) : previewImageUrl ? (
                <>
                  <img
                    src={previewImageUrl}
                    alt="AI try-on result"
                    className="ai-tryon-panel__result-img"
                  />
                  {(recommendedSize || bmi) && (
                    <p className="ai-tryon-panel__meta">
                      {recommendedSize && <span>Recommended size: {recommendedSize}</span>}
                      {recommendedSize && bmi && <span> · </span>}
                      {bmi && <span>BMI: {bmi}</span>}
                    </p>
                  )}
                </>
              ) : (
                <div className="ai-tryon-panel__placeholder">
                  Your AI try-on will appear here
                </div>
              )}
            </div>
          </section>
        </div>

        <form onSubmit={handleSubmit} className="ai-tryon-form">
          <div className="ai-tryon-form__row">
            <div className="ai-tryon-form__field">
              <label htmlFor="height">Height</label>
              <input
                id="height"
                type="text"
                inputMode="decimal"
                placeholder="e.g. 170"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="ai-tryon-form__input"
              />
              <span className="ai-tryon-form__unit">cm</span>
            </div>
            <div className="ai-tryon-form__field">
              <label htmlFor="weight">Weight</label>
              <input
                id="weight"
                type="text"
                inputMode="decimal"
                placeholder="e.g. 65"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="ai-tryon-form__input"
              />
              <span className="ai-tryon-form__unit">kg</span>
            </div>
            <div className="ai-tryon-form__field">
              <label htmlFor="size">Size</label>
              <select
                id="size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="ai-tryon-form__select"
              >
                {sizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn--cta ai-tryon-form__submit"
            disabled={isLoading}
          >
            {isLoading ? 'Generating…' : 'Try it on with AI'}
          </button>
        </form>
      </main>
    </div>
  )
}
