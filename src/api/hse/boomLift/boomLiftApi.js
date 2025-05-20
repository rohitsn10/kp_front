import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const boomLiftInspectionApi = createApi({
  reducerPath: "boomLiftInspectionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      // headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createBoomLiftInspection: builder.mutation({
      query: (body) => ({
        url: "annexures_module/create_boom_lift_inspection",
        method: "POST",
        body,
      }),
    }),
    getBoomLiftInspection: builder.query({
      query: (locationId) => ({
        url: `annexures_module/get_boom_lift_inspection/${locationId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateBoomLiftInspectionMutation,
  useGetBoomLiftInspectionQuery,
} = boomLiftInspectionApi;
