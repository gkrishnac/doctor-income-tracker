import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from './types';

interface AuthState {
  user: User |;
}

const initialState: AuthState = {
  user: null,
  
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.loading = false;
      state.Loading: (state, action: PayloadAction<boolean>) => {
      state.state, action: PayloadAction<string>)payload;
      state.loading = false;
    },
  },
});

export const { setUser,ice.actions;
export default authSlice.reducer;
