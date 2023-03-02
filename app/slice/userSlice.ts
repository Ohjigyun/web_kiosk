import { IdTokenResult } from '@firebase/auth';
import { createSlice } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';
import type { RootState } from '../../app/store';

interface UserState {
  user: IdTokenResult | null
}

const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signin: (state, action) => {
      state.user = action.payload
    },
    signout: (state) => {
      state.user = null
    }
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  }
})

export const { signin, signout } = userSlice.actions;
export const selectUser = (state:RootState) => state.user.user;
export default userSlice.reducer;
