import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery, selectFilteredProducts } from '../../Slices/SearchSlice';

function SearchBar() {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.search.searchQuery);
  const filteredProducts = useSelector(selectFilteredProducts);

  const [inputValue, setInputValue] = useState(searchQuery);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearchQuery(inputValue));
    }, 1000); // 1 seconds debounce
    return () => clearTimeout(handler);
  }, [inputValue, dispatch]);

  const showModal = inputValue.trim().length > 0;

  return (
    <div className="relative flex justify-center w-full">
      {/* Wrapper to center search box (Tailwind widths kept) */}
      <div className="relative w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%]">
        <input
          placeholder="Search products..."
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          /* only padding/margin inline as requested */
          style={{
            padding: '8px 16px',    // top/bottom 8px, left/right 16px
            marginTop: '6px',
            marginBottom: '6px',
          }}
          className="w-full border-2 border-black rounded-full focus:outline-none focus:ring-2 focus:ring-black transition-all"
        />

        {/* Dropdown Modal */}
        {showModal && (
          <div
            /* only margin inline */
            style={{ marginTop: '4px' }}
            className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  /* padding inline only */
                  style={{ padding: '12px' }}
                  className="hover:bg-gray-100 cursor-pointer transition-all"
                >
                  <h4 className="font-semibold">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
              ))
            ) : (
              <p
                /* padding inline only */
                style={{ padding: '12px' }}
                className="text-gray-500 text-sm"
              >
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
