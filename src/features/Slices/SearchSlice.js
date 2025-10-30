import {createSlice} from '@reduxjs/toolkit';
const initialState = {
    searchQuery: '',
};


const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchQuery(state, action) {
            state.searchQuery = action.payload;
        }},
});

export const { setSearchQuery } = searchSlice.actions;

// ✅ Selector for just the search query
export const selectSearchQuery = (state) => state.search.searchQuery;

// ✅ Selector for filtered products (optional, if you want to include filtering logic)
// 
export const selectFilteredProducts = (state) => {
  const products = state.products?.products || [];
  const searchQuery = state.search.searchQuery.trim().toLowerCase();

  // if search query is empty, return empty array
  if (!searchQuery) return [];

  return products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery)
  );
};

export default searchSlice.reducer;

