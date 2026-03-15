import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WishlistProvider } from './context/WishlistContext';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { AiTryOnPage } from './pages/AiTryOnPage';
import { WishlistPage } from './pages/WishlistPage';
import SearchResultsPage from './SearchResultsPage';
import AuthPage from './AuthPage';
import HomePage from './HomePage';
import './App.css';

function App() {
  return (
    <WishlistProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/product/:productId" element={<ProductDetailsPage />} />
          <Route path="/ai-tryon" element={<AiTryOnPage />} />
        </Routes>
      </BrowserRouter>
    </WishlistProvider>
  );
}

export default App;