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
        url: "land_module/land_category_create", // The endpoint for category creation
        method: "POST", 
        body: {
          category_name: categoryData.name, // Adjusted to match the form data you're sending
        },
        headers: {
          "Content-Type": "application/json", // Set the content type to application/json
        }
      }),
    }),
    updateLandCategory: builder.mutation({
      query: ({ id, categoryData }) => ({
        url: `land_module/land_category_update/${id}`, // Dynamic URL with category ID
        method: "PUT",
        body: {
          category_name: categoryData.name, // The name field from categoryData
        },
        headers: {
          "Content-Type": "application/json", // Set the content type to application/json
        },
      }),
    }),
    deleteLandCategory: builder.mutation({
      query: (id) => ({
        url: `land_module/land_category_update/${id}`, // Dynamic URL with category ID
        method: "DELETE", 
        headers: {
          "Content-Type": "application/json", // Set the content type to application/json
        },
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
  useUpdateLandCategoryMutation,
  useDeleteLandCategoryMutation
} = landCategoryApi;
