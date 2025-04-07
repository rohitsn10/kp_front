import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const mockDrillApi = createApi({
  reducerPath: "mockDrillApi",
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
    createMockDrillReport: builder.mutation({
      query: (body) => ({
        url: "annexures_module/create_mock_drill_report",
        method: "POST",
        body,
      }),
    }),
    getMockDrillReport: builder.query({
      query: () => ({
        url: "annexures_module/get_mock_drill_report",
        method: "POST",
        body: {}, // assuming no params are needed like in your curl
      }),
    }),
  }),
});

export const {
  useCreateMockDrillReportMutation,
  useGetMockDrillReportQuery,
} = mockDrillApi;
