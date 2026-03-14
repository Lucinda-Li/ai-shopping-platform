import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './AiTryOnPage.css'
import type { Product } from '../types/product'

interface LocationState {
  product?: Product & { selectedSize?: string }
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

  const sizes = product?.sizes ?? ['S', 'M', 'L']

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
    setError(null)
    setIsLoading(true)
    try {
      // TODO: call real API; for now simulate failure sometimes for demo
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const shouldFail = false // set true to test error state
      if (shouldFail) {
        throw new Error('Service temporarily unavailable')
      }
      setPreviewImageUrl('https://placehold.co/400x500/c8e8ff/1a5f8a?text=Try-on+Preview')
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
                <img
                  src={previewImageUrl}
                  alt="AI try-on result"
                  className="ai-tryon-panel__result-img"
                />
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
