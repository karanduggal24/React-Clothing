import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedCategories: [],
  // future: minPrice, maxPrice
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategories(state, action) {
      state.selectedCategories = action.payload || [];
    },
    toggleCategory(state, action) {
      const cat = action.payload;
      if (!cat) return;
      const idx = state.selectedCategories.indexOf(cat);
      if (idx === -1) state.selectedCategories.push(cat);
      else state.selectedCategories.splice(idx, 1);
    },
    clearFilters(state) {
      state.selectedCategories = [];
    },
  },
});

export const { setCategories, toggleCategory, clearFilters } = filterSlice.actions;

export const selectFilters = (state) => state.filters || initialState;

// Simple selector that returns filtered products based on filters.
// This selector reads products from state.products.products.
export const selectFilteredProducts = (state) => {
  const products = state.products?.products || [];
  const { selectedCategories } = state.filters || initialState;

  return products.filter((p) => {
    return selectedCategories.length === 0 || selectedCategories.includes(p.category);
  });
};

export default filterSlice.reducer;
