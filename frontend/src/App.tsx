import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProductDetailsPage } from './pages/ProductDetailsPage'
import { AiTryOnPage } from './pages/AiTryOnPage'
import { SearchResultPlaceholder } from './pages/SearchResultPlaceholder'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchResultPlaceholder />} />
        <Route path="/product/:productId" element={<ProductDetailsPage />} />
        <Route path="/ai-tryon" element={<AiTryOnPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
