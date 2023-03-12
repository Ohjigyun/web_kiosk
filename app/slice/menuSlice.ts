import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { EntriesList } from '../../interfaces'

interface MenuState {
  menu: EntriesList | []
}

const initialState:MenuState = { 
  menu: []
}

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenu: (state, action:PayloadAction<EntriesList>) => {
      state.menu = action.payload
    },
  }
});

export const { setMenu } = menuSlice.actions;

export default menuSlice.reducer;
