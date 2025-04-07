import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const safetyViolationApi = createApi({
  reducerPath: "safetyViolationApi",
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
    createSafetyViolationReport: builder.mutation({
      query: (body) => ({
        url: "annexures_module/create_safety_violation_report",
        method: "POST",
        body,
      }),
    }),
    getSafetyViolationReport: builder.query({
      query: () => ({
        url: "annexures_module/get_safety_violation_report",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateSafetyViolationReportMutation,
  useGetSafetyViolationReportQuery,
} = safetyViolationApi;
