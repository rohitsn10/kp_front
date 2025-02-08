import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "../api/users/usersApi.js";
import { landBankApi } from "../api/users/landbankApi.js";
import { landCategoryApi } from "../api/users/categoryApi.js";
import { landLocationApi } from "../api/users/locationApi.js";
import { activityApi } from "../api/users/projectActivityApi.js";
import { subActivityApi } from "../api/users/subActivityApi.js";
import { multipleActivityApi } from "../api/users/multipleActivityApi.js";
import { sfaApi } from "../api/sfa/sfaApi.js";
import { projectApi } from "../api/users/projectApi.js";
import { documentApi } from "../api/users/documentApi.js";
import { companyApi } from "../api/company/companyApi.js";
import { expenseApi } from "../api/expense/expenseApi.js";
import { clientDataApi } from "../api/client/clientApi.js";
import { projectWpoApi } from "../api/wpo/wpoApi.js";


const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [landBankApi.reducerPath]: landBankApi.reducer,
    [landCategoryApi.reducerPath]: landCategoryApi.reducer,
    [landLocationApi.reducerPath]: landLocationApi.reducer,
    [activityApi.reducerPath]: activityApi.reducer,
    [subActivityApi.reducerPath]:subActivityApi.reducer,
    [multipleActivityApi.reducerPath]:multipleActivityApi.reducer,
    [sfaApi.reducerPath]:sfaApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [documentApi.reducerPath]: documentApi.reducer,
    [companyApi.reducerPath]:companyApi.reducer,
    [expenseApi.reducerPath]:expenseApi.reducer,
    [clientDataApi.reducerPath]:clientDataApi.reducer,
    [projectWpoApi.reducerPath]:projectWpoApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
  .concat(userApi.middleware)
  .concat(landBankApi.middleware)
  .concat(landCategoryApi.middleware)
  .concat(landLocationApi.middleware)
  .concat(activityApi.middleware)
  .concat(subActivityApi.middleware)
  .concat(multipleActivityApi.middleware)
  .concat(sfaApi.middleware)
  .concat(projectApi.middleware)
  .concat(documentApi.middleware)
  .concat(companyApi.middleware)
  .concat(expenseApi.middleware)
  .concat(clientDataApi.middleware)
  .concat(projectWpoApi.middleware)
});

export default store;
