import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const mockDrillApi = createApi({
  reducerPath: "mockDrillApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY,
    prepareHeaders: (headers,{endpoint,body}) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      // headers.set("Content-Type", "application/json");

      // if (!(body instanceof FormData)) {
      //   headers.set("Content-Type", "application/json");
      // }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createMockDrillReport: builder.mutation({
      query: (body) => ({
        url: "annexures_module/create_mock_drill_report",
        method: "POST",
        body,
        formData: true,
      }),
    }),
    getMockDrillReport: builder.query({
      query: (locationId) => ({
        url: `annexures_module/get_mock_drill_report/${locationId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateMockDrillReportMutation,
  useGetMockDrillReportQuery,
} = mockDrillApi;
