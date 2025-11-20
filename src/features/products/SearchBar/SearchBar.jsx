import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchQuery, selectFilteredProducts } from '../../Slices/SearchSlice';
import { Search, X } from 'lucide-react';
function SearchBar({ isMobile = false, isVisible = false, onClose = () => {} }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchQuery = useSelector((state) => state.search.searchQuery);
  const filteredProducts = useSelector(selectFilteredProducts);

  const [inputValue, setInputValue] = useState(searchQuery);

  const handleInputChange = (e) => setInputValue(e.target.value);

  const handleClear = () => {
    setInputValue('');
    dispatch(setSearchQuery(''));
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    // Clear search and close mobile modal when navigating
    setInputValue('');
    dispatch(setSearchQuery(''));
    if (isMobile && onClose) {
      onClose();
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearchQuery(inputValue));
    }, 600);
    return () => clearTimeout(handler);
  }, [inputValue, dispatch]);

  const showModal = inputValue.trim().length > 0;

  // Mobile overlay search (slides down)
  if (isMobile) {
    return (
      <div
        className={`fixed top-0 left-0 w-full bg-white shadow-md z-50 transform transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
        aria-hidden={!isVisible}
      >
        <div
          style={{ padding: '16px' }}
          className="flex items-center justify-between border-b border-gray-200"
        >
          <h3 className="text-lg font-semibold">Search</h3>
          <button aria-label="Close search" onClick={onClose}>
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div style={{ padding: '16px', position: 'relative' }}>
          <input
            placeholder="Search products..."
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            style={{ padding: '8px 40px 8px 40px' }}
            className="w-full border-2 border-black rounded-full focus:outline-none focus:ring-1 focus:ring-black transition-all"
            autoFocus={isVisible}
          />
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          {inputValue && (
            <button
              onClick={handleClear}
              type="button"
              className="absolute right-7 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {showModal && (
          <div className="max-h-72 overflow-y-auto border-t border-gray-200">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  style={{ padding: '12px' }}
                  className="hover:bg-gray-100 cursor-pointer transition-all flex items-center gap-3"
                >
                  <img src={product.img} alt={product.name} className="object-cover rounded" style={{ width: '36px', height: '64px', objectPosition: 'top' }} />
                  <div>
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.category}</p>
                    <p className="text-sm text-gray-600">{product.price} Rs</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ padding: '12px' }} className="text-gray-500 text-sm">
                No products related to your search.
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Desktop search (centered container)
  return (
    <div style={{ marginLeft: 'auto', marginRight: 'auto' }} className="relative w-full max-w-[720px]">
      <input
        placeholder="Search products..."
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        style={{ padding: '8px 40px 8px 40px', marginTop: '6px', marginBottom: '6px' }}
        className="w-full border-2 border-black rounded-full focus:outline-none focus:ring-1 focus:ring-black transition-all"
      />

      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />

      {inputValue && (
        <button
          onClick={handleClear}
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black transition-colors"
          aria-label="Clear search"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {showModal && (
        <div
          style={{ marginTop: '4px' }}
          className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg z-100 max-h-60 overflow-y-auto"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                style={{ padding: '12px' }}
                className="hover:bg-gray-100 cursor-pointer transition-all flex items-center gap-3"
              >
                <img src={product.img} alt={product.name} className="w-10 h-10 object-cover rounded" />
                <div>
                  <h4 className="font-semibold">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="text-sm text-gray-600">{product.price} Rs</p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ padding: '12px' }} className="text-gray-500 text-sm">
              No products related to your search.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
