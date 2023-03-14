import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { EntriesList, UuidTable } from '../../interfaces'

interface MenuState {
  menu: EntriesList | []
  uuidToDisplayList: UuidTable
}

const initialState:MenuState = { 
  menu: [],
  uuidToDisplayList: {}
}

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenu: (state, action:PayloadAction<EntriesList>) => {
      state.menu = action.payload
    },
    setUuidToDisplayList: (state, action:PayloadAction<UuidTable>) => {
      state.uuidToDisplayList = action.payload
    },
  }
});

export const { setMenu, setUuidToDisplayList } = menuSlice.actions;

export default menuSlice.reducer;
