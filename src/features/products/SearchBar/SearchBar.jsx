import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery, selectFilteredProducts } from '../../Slices/SearchSlice';
import { Search, X } from 'lucide-react';

function SearchBar() {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.search.searchQuery);
  const filteredProducts = useSelector(selectFilteredProducts);

  const [inputValue, setInputValue] = useState(searchQuery);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClear = () => {
    setInputValue('');
    dispatch(setSearchQuery(''));
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearchQuery(inputValue));
    }, 1000); // 1-second debounce
    return () => clearTimeout(handler);
  }, [inputValue, dispatch]);

  const showModal = inputValue.trim().length > 0;

  return (
    <div className="relative flex justify-center w-full">
      <div className="relative w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%]">
        <input
          placeholder="Search products..."
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          style={{
            padding: '8px 40px 8px 40px', // left/right space for icons
            marginTop: '6px',
            marginBottom: '6px',
          }}
          className="w-full border-2 border-black rounded-full focus:outline-none focus:ring-1 focus:ring-black transition-all"
        />

        {/* Search Icon (left side) */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />

        {/* Clear Button (right side) */}
        {inputValue && (
          <button
            onClick={handleClear}
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Dropdown Modal */}
        {showModal && (
          <div
            style={{ marginTop: '4px' }}
            className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  style={{ padding: '12px' }}
                  className="hover:bg-gray-100 cursor-pointer transition-all flex items-center gap-3"
                >
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                    style={{ marginRight: '8px' }}
                  />
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
    </div>
  );
}

export default SearchBar;
