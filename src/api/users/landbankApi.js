import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const landBankApi = createApi({
  reducerPath: "landBankApi",
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
    createLandBankMaster: builder.mutation({
      query: (formData) => ({
        url: "land_module/create_land_bank_master",
        method: "POST",
        body: formData,
      }),
    }),
    getLandBankMaster: builder.query({
      query: () => ({
        url: "land_module/create_land_bank_master",
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateLandBankMasterMutation, useGetLandBankMasterQuery } =
  landBankApi;
