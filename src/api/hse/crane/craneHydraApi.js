import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const craneHydraApi = createApi({
  reducerPath: "craneHydraApi",
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
    createCraneHydraInspection: builder.mutation({
      query: (body) => ({
        url: "annexures_module/create_crane_hydra_inspection",
        method: "POST",
        body,
      }),
    }),
    getCraneHydraInspection: builder.query({
      query: () => ({
        url: "annexures_module/get_crane_hydra_inspection",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCraneHydraInspectionMutation,
  useGetCraneHydraInspectionQuery,
} = craneHydraApi;
