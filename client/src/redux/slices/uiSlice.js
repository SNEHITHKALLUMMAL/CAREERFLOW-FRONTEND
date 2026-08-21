import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSidebarOpen: false, // used by dashboard layouts (mobile nav / collapsible sidebar)
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openSidebar(state) {
      state.isSidebarOpen = true;
    },
    closeSidebar(state) {
      state.isSidebarOpen = false;
    },
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
});

export const { openSidebar, closeSidebar, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
