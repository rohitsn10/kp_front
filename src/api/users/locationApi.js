import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const landLocationApi = createApi({
  reducerPath: "landLocationApi",
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
    
    createLandBankLocation: builder.mutation({
      query: (formData) => ({
        url: "land_module/create_land_bank_location",
        method: "POST",
        body: formData,
      }),
    }),

    getLandBankLocations: builder.query({
      query: () => ({
        url: "land_module/create_land_bank_location",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateLandBankLocationMutation,
  useGetLandBankLocationsQuery,
} = landLocationApi;