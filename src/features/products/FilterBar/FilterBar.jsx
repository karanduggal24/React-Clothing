import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectFilters, toggleCategory, clearFilters } from '../../Slices/filterSlice';
import { FiFilter } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { Button } from '../../../components/ui';

function FilterBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const categories = [
    "Men's Clothing",
    "Women's Clothing",
    "Kids' Clothing",
    "Accessories",
    "Footwear",
    "Sportswear",
    "Formal Wear",
    "Casual Wear",
    "Ethnic Wear",
    "Winter Collection"
  ];

  const dispatch = useDispatch();
  const { selectedCategories = [] } = useSelector(selectFilters);

  const handleToggle = (category) => {
    dispatch(toggleCategory(category));
  };

  const handleClear = () => dispatch(clearFilters());

  return (
    <div className='relative w-full'>
      {/* Mobile Filter Button */}
      <Button
        variant="default"
        size="sm"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className='md:hidden flex items-center gap-2'
        style={{ marginBottom: '8px' }}
      >
        <FiFilter className='text-xl' />
        <span>Filters {selectedCategories.length > 0 && `(${selectedCategories.length})`}</span>
      </Button>

      {/* Filter Container */}
      <div
        className={`
          md:relative fixed 
          md:w-auto w-full 
          md:h-auto h-screen 
          md:top-auto top-0 
          md:left-auto left-0 
          md:transform-none transform 
          md:translate-x-0 
          md:opacity-100 
          transition-all duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 md:opacity-100'}
          bg-white z-40
        `}
      >
        {/* Mobile Header */}
        <div
          style={{ padding: '10px' }}
          className='md:hidden flex items-center justify-between border-b'
        >
          <h3 className='text-xl font-medium'>Filters</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close filters"
          >
            <IoMdClose className='text-2xl' />
          </Button>
        </div>

        {/* Filter Content */}
        <div
          style={{ padding: '8px' }}
          className='flex flex-col gap-4'
        >
          <div
            style={{ marginBottom: '4px' }}
            className='md:hidden flex items-center justify-between'
          >
            <span className='text-sm text-gray-500'>
              {selectedCategories.length} selected
            </span>
            <Button
              variant="link"
              size="sm"
              onClick={() => {
                handleClear();
                setIsMenuOpen(false);
              }}
            >
              Clear all
            </Button>
          </div>

          {/* Categories */}
          <div className='md:flex md:flex-row flex-col gap-6 md:items-center overflow-x-auto max-h-[400px]'>
            {categories.map((category) => (
              <label
                key={category}
                style={{ paddingTop: '12px', paddingBottom: '12px' }}
                className='flex items-center justify-between md:justify-start gap-3 whitespace-nowrap font-sans text-sm font-medium uppercase border-b border-gray-200 last:border-none md:border-0'
              >
                <input
                  type='checkbox'
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleToggle(category)}
                  className='bg-white text-black border-2 border-black cursor-pointer rounded'
                />
                <span className='text-sm'>{category}</span>
              </label>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleClear();
                setIsMenuOpen(false);
              }}
              className='md:inline-block hidden'
              style={{ minWidth: '70px' }}
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Mobile Apply Button */}
        <div
          style={{ padding: '16px' }}
          className='md:hidden fixed bottom-0 left-0 w-full bg-white border-t'
        >
          <Button
            variant="default"
            size="default"
            onClick={() => setIsMenuOpen(false)}
            style={{ width: '100%' }}
          >
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div
          className='md:hidden fixed inset-0 bg-black bg-opacity-50 z-30'
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
}

export default FilterBar;
