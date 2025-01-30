import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../api/users/usersApi.js";
import { landBankApi } from "../api/users/landbankApi.js";
import { landCategoryApi } from "../api/users/categoryApi.js";

const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [landBankApi.reducerPath]: landBankApi.reducer,
    [landCategoryApi.reducerPath]: landCategoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
  .concat(userApi.middleware)
  .concat(landBankApi.middleware)
  .concat(landCategoryApi.middleware)

});

export default store;
