import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GuestState {
  uid: string
  tableNumber: number
}

const initialState: GuestState = { 
  uid: '',
  tableNumber: 0
}

export const guestSlice = createSlice({
  name: 'guest',
  initialState,
  reducers: {
    setUid: (state, action:PayloadAction<string>) => {
      state.uid = action.payload
    },
    setTableNumber: (state, action:PayloadAction<number>) => {
      state.tableNumber = action.payload
    },
  }
});

export const { setUid, setTableNumber } = guestSlice.actions;

export default guestSlice.reducer;
