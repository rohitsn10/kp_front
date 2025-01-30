import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const landCategoryApi = createApi({
  reducerPath: "landCategoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY, 
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token"); 
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); 
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createLandCategory: builder.mutation({
      query: (categoryData) => ({
        url: "land_module/land_category_create", 
        method: "POST", 
        body: categoryData, 
      }),
    }),
    getLandCategories: builder.query({
      query: () => ({
        url: "land_module/land_category_create", 
        method: "GET", 
      }),
    }),
  }),
});

export const {
  useCreateLandCategoryMutation,
  useGetLandCategoriesQuery,
} = landCategoryApi;
