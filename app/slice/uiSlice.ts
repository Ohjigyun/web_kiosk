import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface uiState {
  addMenuModalOpen: boolean
}

const initialState: uiState = { 
  addMenuModalOpen: false
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setAddMenuModalOpen: (state, action:PayloadAction<boolean>) => {
      state.addMenuModalOpen = action.payload
    },
  }
});

export const { setAddMenuModalOpen } = uiSlice.actions;

export default uiSlice.reducer;
