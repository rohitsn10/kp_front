import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const qualitySupplyApi = createApi({
  reducerPath: "qualitySupplyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Endpoint for creating quality inspection items
    createQualityItems: builder.mutation({
      query: (itemData) => ({
        url: "quality_inspection/create_items/",
        method: "POST",
        body: itemData,
      }),
    }),
    listAllItems: builder.query({
      query: () => ({
        url: "quality_inspection/list_all_items",
        method: "GET",
      }),
    }),
    
  }),
});

export const {
  useCreateQualityItemsMutation,
  useListAllItemsQuery
} = qualitySupplyApi;