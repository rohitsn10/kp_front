import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const trailerInspectionApi = createApi({
  reducerPath: "trailerInspectionApi",
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
    createTrailerInspection: builder.mutation({
      query: (body) => ({
        url: "annexures_module/create_trailer_inspection",
        method: "POST",
        body,
      }),
    }),
    getTrailerInspection: builder.query({
      query: (locationId) => ({
        url: `annexures_module/get_trailer_inspection/${locationId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateTrailerInspectionMutation,
  useGetTrailerInspectionQuery,
} = trailerInspectionApi;
