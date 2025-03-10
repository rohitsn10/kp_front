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
import { materialApi } from "../api/material/materialApi.js";
import { companyApi } from "../api/company/companyApi.js";
import { expenseApi } from "../api/expense/expenseApi.js";
import { clientDataApi } from "../api/client/clientApi.js";
import { projectWpoApi } from "../api/wpo/wpoApi.js";
import { milestoneApi } from "../api/milestone/milestoneApi.js";
import { inspectionApi } from "../api/inspection/inspectionApi.js";
import { masterDesignApi } from "../api/masterdesign/masterDesign.js";
import { milestonePaymentApi } from "../api/milestonePayment/milestonePaymentApi.js";
import { permissionsApi } from "../api/permission/permissionApi.js";


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
    [materialApi.reducerPath]: materialApi.reducer,
    [companyApi.reducerPath]:companyApi.reducer,
    [expenseApi.reducerPath]:expenseApi.reducer,
    [clientDataApi.reducerPath]:clientDataApi.reducer,
    [projectWpoApi.reducerPath]:projectWpoApi.reducer,
    [milestoneApi.reducerPath]:milestoneApi.reducer,
    [inspectionApi.reducerPath]:inspectionApi.reducer,
    [masterDesignApi.reducerPath]:masterDesignApi.reducer,
    [milestonePaymentApi.reducerPath]:milestonePaymentApi.reducer,
    [permissionsApi.reducerPath]:permissionsApi.reducer
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
  .concat(materialApi.middleware)
  .concat(companyApi.middleware)
  .concat(expenseApi.middleware)
  .concat(clientDataApi.middleware)
  .concat(projectWpoApi.middleware)
  .concat(milestoneApi.middleware)
  .concat(inspectionApi.middleware)
  .concat(masterDesignApi.middleware)
  .concat(milestonePaymentApi.middleware)
  .concat(permissionsApi.middleware)
});

export default store;
