import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const harnessInspectionApi = createApi({
  reducerPath: "harnessInspectionApi",
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
    // Endpoint for creating harness inspection
    createHarnessInspection: builder.mutation({
      query: (formData) => ({
        url: "annexures_module/create_harness_inspection",
        method: "POST",
        body: formData,
        formData: true, // Important for the inspector_signature file upload
      }),
    }),
    
    // Endpoint for getting all harness inspections
    getAllHarnessInspections: builder.query({
      query: () => ({
        url: `annexures_module/get_harness_inspection/${locationId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateHarnessInspectionMutation,
  useGetAllHarnessInspectionsQuery,
} = harnessInspectionApi;