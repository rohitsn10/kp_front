import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const sfaApi = createApi({
  reducerPath: "sfaApi",
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
    getSfaData: builder.query({
        query: () => "land_module/add_sfa_data_to_land_bank",
      }),
  }),
});

export const {
    useGetSfaDataQuery
} = sfaApi;
