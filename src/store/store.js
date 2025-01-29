import { configureStore } from '@reduxjs/toolkit';
import { userApi } from '../api/users/usersApi.js';


const store = configureStore({
  reducer: {
    // Add the userApi reducer here
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware), // Adds RTK Query middleware
});

export default store;
